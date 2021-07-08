const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const cors=require('cors');
const {Op}=require('sequelize');

const ProSer=require('../models/product');

router.use(cors());

router.post('/New',async(req,res)=>{
    try{
        const result=await ProSer.create({
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

router.get('/GetAll',async(req,res)=>{
    try{
        const result=await ProSer.findAll({
            where:{
                userId:req.body.userId
            },raw:true
        });
        if(result){
            const data=result.map(function(item,ID){
                let id=item.id,
                Code=item.Code,
                Name=item.Name,
                Description=item.Description,
                Type=item.Type,
                Value=item.TotalAmount,
                userId=item.userId;

                return {id,Code,Name,Description,Type,Value,Value,userId}
            })
            res.json(data);
        }
    }catch(err){
        res.status(400).send({error:'Error'});
    }
});

router.get('/GetOne',async(req,res)=>{
    try{
        const result=await ProSer.findOne({
            where:{
                [Op.and]:[{userId:req.body.userId},{Name:req.body.Name}]
            }
        });
        if(result){
            res.json(result);
        }
    }catch(err){
        res.status(400).send({error:'Error'});
    }
});

router.put('/Update',async(req,res)=>{
    try{
        const result=await ProSer.findOne({
            where:{
                [Op.and]:[{id:req.body.id},{userId:req.body.userId}]
            }
        });
        if(result){
            const Variables='{"vars":["Code","Name","Description","Type","Value","TotalAmount"]}';
            const obj=JSON.parse(Variables);

            for(var x=0;x<obj.vars.length;x++){
                const str=obj.vars[x];
                if(req.body[str]!=null){
                    result[str]=req.body[str];
                    await result.save();
                    console.log("1");
                }else{
                    console.log("0");
                }
            }
            
            res.json({menssage:"Values Changed"});
        }
    }catch(err){
        console.log(err);
        res.status(400).send({error:'error'});
    }
})

module.exports=app=>app.use("/products", router);