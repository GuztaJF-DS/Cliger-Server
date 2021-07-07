const express=require("express");
const router=express.Router();
const bodyParser=require("body-parser");
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
            res.json({menssage:"New Record made"});
        }else{
            res.json({error:"Cannot make a new Record"});
        }
    }catch(err){
        res.status(400).send({error:"error"});
    }
});

router.get('/getAll',async(req,res)=>{
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
        res.status(400).send({error:"error"});
    }
})

module.exports=app=>app.use('/finance',router);