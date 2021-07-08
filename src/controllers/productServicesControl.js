const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const cors=require('cors');

const ProSer=require('../models/product');

router.use(cors());

router.post('/New',async(req,res)=>{
    try{
        const result=ProSer.create({
            Code:req.body.Code,
            Name:req.body.Name,
            Description:req.body.Description,
            Type:req.body.Type,
            Value:req.body.Value,
            TotalAmount:req.body.TotalAmount,
            userId:req.body.userId
        });
        if(result){ 
            res.json({"menssage":"New Product Recoded"});
        }
    }catch(err){
        res.status(400).send({error:'Error'});
    }
});


module.exports=app=>app.use("/products", router);