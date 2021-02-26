const express=require('express');
const jwt=require('jsonwebtoken');
const authBL=require('../models/usersAndAuthBL');

const router=express.Router();

const RSA_PRIVATE_KEY="dsadcdf23dffdfr3r3";


router.post('/register',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;

    try {
        let data=await authBL.register(username,password);
        const id= await authBL.getUserId(username);
        var userToken=jwt.sign({id:id},RSA_PRIVATE_KEY,{expiresIn:await authBL.getSeesionTimeOut(id)*60});
        res.status(200).send({msg:data,token:userToken});
    } catch (error) {
        res.status(401).send("Error: "+error.message);
    }
});


router.post('/login',async function(req, res){
    const username=req.body.userName;
    const password=req.body.password;


    try {
        const id= await authBL.getUserId(username);
        if(await authBL.login(username,password)){
            var userToken=jwt.sign({id:id},RSA_PRIVATE_KEY,{expiresIn:await authBL.getSeesionTimeOut(id)*60});
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