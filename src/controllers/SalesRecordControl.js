const express=require('express');
const router=express.Router();
const cors=require('cors');

const SalesRecord=require('../models/SalesRecord');
const ProductSales=require('../models/ManyToMany_Models/ProductSales');

router.use(cors());

router.post('/newRecord',async(req,res)=>{
    try{
        const result=await SalesRecord.create({
            TotalCost:req.body.TotalCost,
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
            res.json({message:"Success on Create"});
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
                const Created=item.createdAt;
                let FormattedDate=(Created.getFullYear())+ "-" + ('0' + (Created.getMonth()+1)).slice(-2) + "-" + ("0"+(Created.getDate())).slice(-2)
                let TotalCost=item.TotalCost,
                MoneyPayed=item.MoneyPayed,
                PayBack=item.PayBack,
                id=item.id,
                createdAt=FormattedDate

                return {id,TotalCost, MoneyPayed, PayBack,createdAt}
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
            let end=(Object.values(obj).length!=0)?Data.concat(obj):[];
            res.json(end);
        }
    }catch(err){
        console.error(err);
        res.status(400).send({error:"Couldn't Get the Data"});
    }
});

router.post('/GetOneProduct',async(req,res)=>{
    try{
        const result=await SalesRecord.findAll({
            where:{
                userId:req.body.userId
            }
        });
        if(result){
             const resp=await ProductSales.findAll({
                where:{
                    ProductId:req.body.ProductId
                }
            });
            if(resp){
                const Data=resp.map(function(item,ID){
                    let FormattedDate=(item.createdAt.getFullYear())+ "/" + (item.createdAt.getMonth() + 1) + "/" + ((item.createdAt.getDate()))
                    let SalesId=item.SalesId,
                    ProductId=item.ProductId,
                    Amount=item.Amount,
                    Weight=item.Weight,
                    createdAt=FormattedDate;

                    return {SalesId,ProductId,Amount,Weight,createdAt}
                })
                res.json(Data);
            }
        }
        else{
            res.json({error:'Not Found'})
        }
    }catch(err){
        console.error(err);
        res.status(400).send({error:"Couldn't Get the Data"});
    }
})


module.exports=app=>app.use("/SalesRecord",router);
