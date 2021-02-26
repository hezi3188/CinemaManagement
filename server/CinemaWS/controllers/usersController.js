const express=require('express');
const jwt=require('jsonwebtoken');
const usersBL=require('../models/usersAndAuthBL');

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

module.exports=router;