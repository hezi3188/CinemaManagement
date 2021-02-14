const express=require('express');
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
module.exports=router;