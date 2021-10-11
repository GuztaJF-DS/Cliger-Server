const express=require('express');
const router=express.Router();
const cors = require('cors');
const { Op } = require("sequelize");

const Schedule=require('../models/Schedule');
const ProSchedule=require('../models/ManyToMany_Models/ProductSchedule');
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
			for(var x=0;x<req.body.ProSerId.length;x++){
				const resp=await ProSchedule.create({
					ScheduleId:result.id,
					ProSerId:req.body.ProSerId[x]
				})
				if(!resp){
					res.json({Error:"Could not Create"});
				}
			}

			res.json({message:"Success on Create"});
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Creation Failed"});
	} 

})

router.post('/getOne',async(req,res)=>{
	try{
		const result=await Schedule.findOne({
			where:{
				[Op.and]: [{ScheduledDay:req.body.ScheduledDay },{ScheduledHour:req.body.ScheduledHour }, { userId:req.body.userId }]
			}
		});
		if(result){
			const Data=result.dataValues;
			const resp=await ProSchedule.findAll({
				where:{
					ScheduleId:Data.id
				}
			})
			if(resp){
				const Data2=resp.map(function(item,ID){
					let ScheduleId=item.ScheduleId,
					ProSerId=item.ProSerId

					return {ScheduleId,ProSerId}
				});
				var end="["+JSON.stringify(Data)+',{"'+Data.id+'":'+JSON.stringify(Data2)+'}]';

				var DataEnd = JSON.parse(end);

				res.json(DataEnd);
			}

		}else{
			res.json({message:"Cannot Find any register at this time"})
		}
	}catch(err){
		res.status(400).send({Error:"Couldn't Get the Data"});
	}
})

router.post('/getAllFromDay',async(req,res)=>{
	try{
		const result=await Schedule.findAll({
			where:{
				[Op.and]: [{ScheduledDay:req.body.ScheduledDay},{userId:req.body.userId}]
			},
			raw:true
		})
		if(result){
			const Data=result.map(function(item,ID){
				let id=item.id,
				ScheduledDay=item.ScheduledDay,
				ScheduledHour=item.ScheduledHour,
				ClientName=item.ClientName
				return {id,ScheduledDay, ScheduledHour, ClientName};
			})

			var obj={};
			for(var x=0;x<Data.length;x++){
				const resp=await ProSchedule.findAll({
					where:{
						ScheduleId:Data[x].id
					}
				});
				if(resp){
					let RightID;
					const Data2=resp.map(function(item,ID){
						let ScheduleId=item.ScheduleId,
						ProSerId=item.ProSerId;

						RightID=ScheduleId;

						return {ScheduleId,ProSerId}
					});


					obj[RightID]=Data2;
				}
			}

			var end = Data.concat(obj);

			res.json(end);
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Couldn't Get the Data"});
	}
})

router.post('/delete/One',async(req,res)=>{
	try{
		const find=await Schedule.findOne({
			where:{
				[Op.and]:[{ScheduledDay:req.body.ScheduledDay },{ScheduledHour:req.body.ScheduledHour },{userId:req.body.userId}]
			}
		})
		if(find){
			const DelX=await ProSchedule.destroy({
				where:{ScheduleId:find.id}
			})

			const del=await Schedule.destroy({
				where:{id:find.id}
			})
			if(del){
				res.json({message:"Shedule deleted"});
			}
			else{
				res.json({Error:"Schedule not deleted"});
			}
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Couldn't Delete"});
	}
})

router.delete('/delete/EntireDay',async(req,res)=>{
	try{
		const find=await Schedule.findAll({
			where:{
				[Op.and]:[{ScheduledDay:req.body.ScheduledDay }, { userId:req.body.userId }]
			},raw:true
		});

		if(find){
			const data=await find.map(function(item,ID){
				return item.id
			})
			for(var x=0;x<data.length;x++){
				const delx=await ProSchedule.destroy({
					where:{ScheduleId:data[x]}
				})
			}
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
		}
	}catch(err){
		res.status(400).send({Error:"Records not Deleted"});
	}
})

router.put('/update',AdjustTime,async(req,res)=>{
	try{
		const result=await Schedule.findOne({
			where:{
				[Op.and]: [{id:req.body.id }, { userId:req.body.userId }]
			}
		});
		if(result){
			const Types='{"type":["ScheduledDay","ScheduledHour","ClientName"]}';
			const obj=JSON.parse(Types);
			var Opps="";


			if(req.body.ProSerIdToChange!="",req.body.ProSerIdToChange!=null){
				const resp=await ProSchedule.findOne({
					where:{
						[Op.and]: [{ScheduleId:result.id}, { ProSerId:req.body.ProSerIdToChange }]
					}
				});
				if(resp){
					if(req.body.ProSerIdNew==""||req.body.ProSerIdNew==null){
						Opps=" Product selected but we didn't find it";
					}else{
						resp.ProSerId=req.body.ProSerIdNew
						await resp.save();
					}
				}
			}

			for(var x=0;x<obj.type.length;x++){
				var string=obj.type[x];
				if(req.body[string]!=""){
					result[string]=req.body[string];
					await result.save();
				}
			}
			res.json({message:"Values Changed"+Opps});
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Couldn't Update the Schedule"});
	}
})

module.exports=app=>app.use('/schedule',router);
