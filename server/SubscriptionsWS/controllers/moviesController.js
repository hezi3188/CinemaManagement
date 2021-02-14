const express=require('express');
const moviesBL=require('../models/moviesBL');

const router=express.Router();

router.route('/')
.get(async function(req, res){
    let data=await moviesBL.getAll();
    return res.json(data);
})

router.route('/:id')
.get(async function(req, res){
    let id=req.params.id;
    let data=await moviesBL.getMovie(id);
    return res.json(data);
})

router.route('/')
.post(async function(req, res){
        let obj=req.body;
        let data=await moviesBL.addMovie(obj);
        return res.json(data);
})

router.route('/:id')
.put(async function(req, res){
    let id=req.params.id;
    let obj=req.body;
    let data=await moviesBL.updateMovie(id,obj);
    return res.json(data);
})
router.route('/:id')
.delete(async function(req, res){
    let id=req.params.id;
    let data=await moviesBL.deleteMovie(id);
    return res.json(data);
})
module.exports=router;