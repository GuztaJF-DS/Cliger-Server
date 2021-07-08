const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const cors = require('cors');
const { Op } = require("sequelize");

const Schedule=require('../models/Schedule');
const AdjustTime=require('../middleware/AdjustTime');

router.use(cors())

router.post('/register',AdjustTime,async(req,res)=>{
	try{
		const result=await Schedule.create({
			ScheduledDay:req.body.ScheduledDay,
			ScheduledHour:req.body.ScheduledHour,
			ClientName:req.body.ClientName,
			userId:req.body.userId
		})
		if(result){
			res.json({menssage:"Sucess on Create"})
		}
	}catch(err){
		res.status(400).send({Error:"Creation Failed"});
	}
	
})

router.get('/getOne',async(req,res)=>{
	try{
		const result=await Schedule.findOne({
			where:{
				[Op.and]: [{ScheduledDay:req.body.ScheduledDay },{ScheduledHour:req.body.ScheduledHour }, { userId:req.body.userId }]
			}
		});
		if(result){
			const Data=result.dataValues;
			res.json(Data)
		}else{
			res.json({menssage:"Cannot Find any register at this time"})
		}
	}catch(err){
		res.status(400).send({Error:"Error"});
	}
})

router.get('/getAllFromDay',async(req,res)=>{
	try{	
		const result=await Schedule.findAll({
			where:{
				[Op.and]: [{ScheduledDay:req.body.ScheduledDay},{userId:req.body.userId}]
			},
			raw:true
		})
		if(result){
			const data=result.map(function(item,id){
				return item;
			})
			res.json(data)
		}
	}catch{
		res.status(400).send({Error:"Error"});
	}
})

router.delete('/delete/One',async(req,res)=>{
	try{
		const del=await Schedule.destroy({
			where:{
				[Op.and]:[{ScheduledDay:req.body.ScheduledDay },{ScheduledHour:req.body.ScheduledHour },{userId:req.body.userId}]
			}
		})
		if(del){
			res.json({menssage:"Shedule deleted"})
		}
		else{
			res.json({Error:"Schedule not deleted"})
		}
	}catch(err){
		console.log(err)
		res.status(400).send({Error:"Error"})
	}
})

router.delete('/delete/Day',async(req,res)=>{
	try{
		const del=await Schedule.destroy({
			where:{
				[Op.and]:[{ScheduledDay:req.body.ScheduledDay }, { userId:req.body.userId }]
			}
		});
		if(del){
			res.json({menssage:"Records Deleted Successfully"});
		}
		else{
			res.json({menssage:"Records not Deleted"});
		}
	}catch(err){
		res.status(400).send({Error:"Error"});
	}
})

router.put('/update/Day',AdjustTime,async(req,res)=>{
	try{
		const result=await Schedule.findOne({
			where:{
				[Op.and]: [{id:req.body.id }, { userId:req.body.userId }]
			}
		});
		if(result){
			const Types='{"type":["ScheduledDay","ScheduledHour","ClientName"]}';
			const obj=JSON.parse(Types);

			for(var x=0;x<obj.type.length;x++){
				var string=obj.type[x];
				if(req.body[string]!=""){
					result[string]=req.body[string];
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
		res.status(400).send({Error:"Error"});
	}
})

module.exports=app=>app.use('/schedule',router);
