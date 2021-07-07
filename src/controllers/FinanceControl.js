const express=require("express");
const router=express.Router();
const bodyParser=require("body-parser");
const cors = require('cors');

const User=require('../models/user');
const Finance=require('../models/finance');

router.use(cors());

router.post('/register',async(req,res)=>{
    try{
        const ResultFin=await Finance.create({
            CurrentBalance:req.body.CurrentBalance,
            userId:req.body.userId
        })
        if(ResultFin){
            res.json({menssage:"New Record made"});
        }
    }catch(err){
        res.status(400).send({error:"error"});
    }
});

module.exports=app=>app.use('/finance',router);