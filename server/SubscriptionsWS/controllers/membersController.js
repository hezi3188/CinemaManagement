const express=require('express');
const membersBL=require('../models/membersBL');

const router=express.Router();

router.route('/')
.get(async function(req, res){
    let data=await membersBL.getAll();
    return res.json(data);
})

router.route('/:id')
.get(async function(req, res){
    let id=req.params.id;
    let data=await membersBL.getMember(id);
    return res.json(data);
})

router.route('/')
.post(async function(req, res){
        let obj=req.body;
        let data=await membersBL.addMember(obj);
        return res.json(data);
})

router.route('/:id')
.put(async function(req, res){
    let id=req.params.id;
    let obj=req.body;
    let data=await membersBL.updateMember(id,obj);
    return res.json(data);
})
router.route('/:id')
.delete(async function(req, res){
    let id=req.params.id;
    let data=await membersBL.deleteMember(id);
    return res.json(data);
})
module.exports=router;