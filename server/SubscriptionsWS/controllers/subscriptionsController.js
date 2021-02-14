const express=require('express');
const subscriptionsBL=require('../models/subscriptionsBL');

const router=express.Router();

router.route('/')
.get(async function(req, res){
    let data=await subscriptionsBL.getAll();
    return res.json(data);
})

router.route('/:id')
.get(async function(req, res){
    let id=req.params.id;
    let data=await subscriptionsBL.getSubscription(id);
    return res.json(data);
})

router.route('/')
.post(async function(req, res){
        let obj=req.body;
        let data=await subscriptionsBL.addSubscription(obj);
        return res.json(data);
})

router.route('/:id')
.put(async function(req, res){
    let id=req.params.id;
    let obj=req.body;
    let data=await subscriptionsBL.updateSubscription(id,obj);
    return res.json(data);
})
router.route('/:id')
.delete(async function(req, res){
    let id=req.params.id;
    let data=await subscriptionsBL.deleteSubscription(id);
    return res.json(data);
})
module.exports=router;