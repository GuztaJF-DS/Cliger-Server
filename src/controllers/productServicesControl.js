const express=require('express');
const router=express.Router();
const cors=require('cors');
const { Op }=require('sequelize');

const ProSer=require('../models/product');
const ProductSales=require('../models/ManyToMany_Models/ProductSales');
const ProductSchedule=require('../models/ManyToMany_Models/ProductSchedule');

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

router.post('/GetAll',async(req,res)=>{
    try{
        const result=await ProSer.findAll({
            where:{
                userId:req.body.userId
            },raw:true
        });
        if(result){
            if(Object.values(result).length==0){
                res.json({message:"Not Found"});
            }else{
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
        }
    }catch(err){
      console.log(err);
        res.status(400).json({error:err});
    }
});

router.post('/GetOne',async(req,res)=>{
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

router.post('/Update',async(req,res)=>{
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
                if(req.body[str]==""||req.body[str]==null){
                    null
                }else{
                    result[str]=req.body[str];
                    await result.save();
                }
            }

            res.json({message:"Values Changed"});
        }
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Couldn't Update the Product/Service"});
    }
});

router.post('/deleteOne',async(req,res)=>{
    try{
        const result=await ProductSales.destroy({
            where:{
                ProductId:req.body.DeleteId
            }
        })
        const response=await ProductSchedule.destroy({
            where:{
                ProSerId:req.body.DeleteId
            }
        })
        const resp=await ProSer.destroy({
            where:{
                [Op.and]:[{id:req.body.DeleteId},{userId:req.body.userId}]
            }
        });

        res.json({message:"Product/Service deleted Succesfully"})
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Couldn't Delete"});
    }
})

module.exports=app=>app.use("/products", router);
