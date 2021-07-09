const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const cors=require('cors');

const SalesRecord=require('../models/SalesRecord');
const ProductSales=require('../models/ManyToMany_Models/ProductSales');

router.use(cors());

router.post('/newRecord',async(req,res)=>{
    try{
        const result=await SalesRecord.create({
            TotalBuyPrice:req.body.TotalBuyPrice,
            MoneyPayed:req.body.MoneyPayed,
            PayBack:req.body.PayBack,
            userId:req.body.userId
        })
        if(result){
            for(var x=0;x<req.body.ProductId.length;x++){
                const result2=await ProductSales.create({
                    ProductId:req.body.ProductId[x],
                    SalesId:result.id,
                    Amount:req.body.Amount[x],
                    Weight:req.body.Weight[x],
                });
                if(result2){
                    console.log("1");
                }else{
                    console.log("0");
                }
            }
            
            res.json({menssage:"new record Created"});
        }
    }catch(err){
        res.status(400).send({error:"error"});
    }
})

module.exports=app=>app.use("/SalesRecord",router);