const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const cors = require('cors');

require("dotenv-safe").config();

const Schedule=require('../models/Schedule');
const AdjustTime=require('../middleware/AdjustTime');

router.use(cors())

router.post('/register',AdjustTime,async(req,res)=>{
	try{
		const result=await Schedule.create({
			SeviceProvided:req.body.SeviceProvided,
			Description:req.body.Description,
			ScheduledDay:req.body.ScheduledDay,
			ScheduledHour:req.body.ScheduledHour,
			ClientName:req.body.ClientName,
			userId:req.body.userId
		})
		if(result){
			res.json({mensage:"Sucess on Create"})
		}
	}catch(err){
		res.status(400).send({Error:"Creation Failed"});
	}
	
})

router.get('/getOne',async(req,res)=>{
	try{
		const result=await Schedule.findOne({
			where:{
				ScheduledDay:req.body.ScheduledDay
			}
		});
		if(result){
			const Data=result.dataValues;
			res.json(Data)
		}
	}catch(err){
		res.status(400).send({Error:"Creation Failed"});
	}
})

module.exports=app=>app.use('/schedule',router);
