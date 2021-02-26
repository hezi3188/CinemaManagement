const express=require('express');
const jwt=require('jsonwebtoken');
const usersBL=require('../models/usersBL');

const router=express.Router();

const RSA_PRIVATE_KEY="dsadcdf23dffdfr3r3";

const checkAuth=(token)=> {
    let id=null;
    jwt.verify(token, RSA_PRIVATE_KEY, function(err, decoded) 
    { 
        if(decoded)
             id=decoded.id;
    });
    return id;
} 



router.route('/')
.get(async function(req, res){
    var token = req.headers['x-access-token'];
    if (!token){
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    if(checkAuth(token)) {
        let data;
        try {
             data=await usersBL.getAll();
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
        return res.json(data);
    }
    else{
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
  
})

router.route('/:id')
.get(async function(req, res){
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    if(checkAuth(token)){
        let id=req.params.id;
        let data;
        try {
            data=await usersBL.getUser(id);
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
        return res.json(data);
    }
    else{
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
   
})

router.route('/')
.post(async function(req, res){
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    if(checkAuth(token)){
        let obj=req.body;
        let data;
        try {
            data=await usersBL.addUser(obj);
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
        return res.json(data);
    }
    else{
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
})

router.route('/:id')
.put(async function(req, res){
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    if(checkAuth(token)){


        let id=req.params.id;
        let obj=req.body;
        let data;
        try {
            data=await usersBL.updateUser(id,obj);
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
        return res.json(data);
    }
    else{
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
})

router.route('/:id')
.delete(async function(req, res){
    var token = req.headers['x-access-token'];
    if(!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    if(checkAuth(token)){


        let id=req.params.id;
        let data;
        try {
             data=await usersBL.deleteUser(id);
        } catch (error) {
            return res.status(500).send("Error: " + error.message);
        }
            return res.json(data);
    }
    else{
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
})
router.post('/register',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;

    try {
        let data=await usersBL.register(username,password);
        const id= await usersBL.getUserId(username);
        var userToken=jwt.sign({id:id},RSA_PRIVATE_KEY,{expiresIn:await usersBL.getSeesionTimeOut(id)*60});
        res.status(200).send({msg:data,token:userToken});
    } catch (error) {
        res.status(401).send("Error: "+error.message);
    }
});


router.post('/login',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;


    try {
        const id= await usersBL.getUserId(username);
        if(await usersBL.login(username,password)){
            var userToken=jwt.sign({id:id},RSA_PRIVATE_KEY,{expiresIn:await usersBL.getSeesionTimeOut(id)*60});
            res.status(200).send({token:userToken});
        
        }
        
        else
        {
            res.sendStatus(401); 
        }
    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
})
module.exports=router;