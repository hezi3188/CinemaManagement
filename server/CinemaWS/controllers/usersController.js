const express=require('express');
const jwt=require('jsonwebtoken');
const usersBL=require('../models/usersBL');

const router=express.Router();

router.route('/')
.get(async function(req, res){
    let data=await usersBL.getAll();
    return res.json(data);
})

router.route('/:id')
.get(async function(req, res){
    let id=req.params.id;
    let data=await usersBL.getUser(id);
    return res.json(data);
})

router.route('/')
.post(async function(req, res){
        let obj=req.body;
        let data=await usersBL.addUser(obj);
        return res.json(data);
})

router.route('/:id')
.put(async function(req, res){
    let id=req.params.id;
    let obj=req.body;
    let data=await usersBL.updateUser(id,obj);
    return res.json(data);
})
router.route('/:id')
.delete(async function(req, res){
    let id=req.params.id;
    let data=await usersBL.deleteUser(id);
    return res.json(data);
})
router.post('/register',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;

    let data=await usersBL.register(username,password);
    return res.json(data);
});


router.post('/login',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;

    const RSA_PRIVATE_KEY="dsadcdf23dffdfr3r3";

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
        res.status(401).send(err.message);
    }
})
module.exports=router;