const express=require("express");
const router=express.Router();
const cors = require('cors');

const Finance=require('../models/finance');

router.use(cors());

router.post('/register',async(req,res)=>{
    try{
        const Result=await Finance.create({
            CurrentBalance:req.body.CurrentBalance,
            userId:req.body.userId
        })
        if(Result){
            res.json({message:"Success on Create"});
        }
    }catch(err){
        res.status(400).send({error:"Cannot make a new Record"});
    }
});

router.post('/getAll',async(req,res)=>{
    try{
        const Result=await Finance.findAll({
            where:{
                userId:req.body.userId
            },raw:true
        })
        if(Result){
            const data=Result.map(function(item,id){
                let Id=item.id,
                CurrentBalance=item.CurrentBalance,
                Date=item.createdAt,
                userId=item.userId;

                return {Id,CurrentBalance,Date,userId}
            })
            res.json(data);

        }
    }catch(err){
        res.status(400).send({error:"Couldn't Get the Data"});
    }
})

module.exports=app=>app.use('/finance',router);
