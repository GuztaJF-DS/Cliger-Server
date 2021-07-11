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
        res.status(400).send({error:"Cannot Register, Check if you don't forget to fill the form"});
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
                Value=item.Value,
                TotalAmount=item.TotalAmount,
                userId=item.userId;

                return {id,Code,Name,Description,Type,Value,TotalAmount,userId}
            })
            res.json(data);
        }
    }catch(err){
        res.status(400).send({error:"Couldn't Get the Data"});
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
        res.status(400).send({error:"Couldn't Get the Data"});
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
            
            console.log(req.body.Value);
            for(var x=0;x<obj.vars.length;x++){
                const str=obj.vars[x];
                if(req.body[str]==""||req.body[str]==null){
                    console.log("");
                }else{
                    result[str]=req.body[str];
                    await result.save();
                }
            }
            
            res.json({menssage:"Values Changed"});
        }
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Couldn't Update the Product/Service"});
    }
});

router.delete('/deleteOne',async(req,res)=>{
    try{    
        const result=await ProductSales.destroy({
            where:{
                ProductId:req.body.id
            }
        })
        const response=await ProductSchedule.destroy({
            where:{
                ProSerId:req.body.id
            }
        })
        const resp=await ProSer.destroy({
            where:{
                [Op.and]:[{id:req.body.id},{userId:req.body.userId}]
            }
        });
        res.json({menssage:"Product/Service deleted Succesfully"})
    }catch(err){
        res.status(400).send({error:"Couldn't Delete"});
    }
})

module.exports=app=>app.use("/products", router);