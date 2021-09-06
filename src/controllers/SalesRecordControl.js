const express=require('express');
const router=express.Router();
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
                const resp=await ProductSales.create({
                    ProductId:req.body.ProductId[x],
                    SalesId:result.id,
                    Amount:req.body.Amount[x],
                    Weight:req.body.Weight[x],
                });
            }

            res.json({menssage:"new record Created"});
        }
    }catch(err){
        res.status(400).send({error:"Could not Create"});
    }
})

router.post('/GetAll',async(req,res)=>{
    try{
        const result=await SalesRecord.findAll({
            where:{
                userId:req.body.userId
            }
        });
        if(result){
            const Data=result.map(function(item,ID){
                let TotalBuyPrice=item.TotalBuyPrice,
                MoneyPayed=item.MoneyPayed,
                PayBack=item.PayBack,
                id=item.id

                return {id,TotalBuyPrice, MoneyPayed, PayBack}
            });

            var obj={};
            
            for(var x=0;x<Data.length;x++){
                const resp=await ProductSales.findAll({
                    where:{
                        SalesId:Data[x].id
                    }
                });
                if(resp){
                    const Data2=resp.map(function(item,ID){
                        let SalesId=item.SalesId,
                        ProductId=item.ProductId,
                        Amount=item.Amount,
                        Weight=item.Weight;

                        return {SalesId,ProductId,Amount,Weight}
                    })
                    
                    for(y=0;y<Data2.length;y++){
                        obj[Data2[y].SalesId]=Data2;
                    }
                }
            }
            let end=Data.concat(obj);
            res.json(end);
        }
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Couldn't Get the Data"});
    }
});

router.post('/GetOne',async(req,res)=>{
    try{
        const result=await SalesRecord.findOne({
            where:{
                userId:req.body.userId,
                id:req.body.id
            }
        });
        if(result){
            const resp=await ProductSales.findAll({
                where:{
                    SalesId:result.id
                }
            });
            if(resp){
                const Data2=resp.map(function(item,ID){
                    let SalesId=item.SalesId,
                    ProductId=item.ProductId,
                    Amount=item.Amount,
                    Weight=item.Weight;


                    return {SalesId,ProductId,Amount,Weight}
                })
                var obj=result.dataValues;
                var end= Object.assign(obj, Data2);

                res.json(end);
            }
        }
    }catch(err){
        console.log(err);
        res.status(400).send({error:"Couldn't Get the Data"});
    }
})

module.exports=app=>app.use("/SalesRecord",router);
