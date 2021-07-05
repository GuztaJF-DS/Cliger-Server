const Schedule=require('../models/Schedule');
const bodyParser=require('body-parser');
const { Op } = require("sequelize");

module.exports=async(req,res,next)=>{
	const Day = req.body.ScheduledDay;
	let Time=req.body.ScheduledHour;
	const UserId=req.body.userId;
	let ID=req.body.id;
	
	if(!req.body.id){
		ID="";
	}
	
	const result=await Schedule.findAll({
		where:{
			[Op.or]:[{
				[Op.and]: [{id:ID}, { userId:UserId }]
			},{
				[Op.and]: [{ScheduledDay:Day }, { userId:UserId }]
			}]
			
		},
		raw: true
	})
	if(result){
		var data= result.map(function(id,indice){
			if(Time==""){
				req.body.ScheduledHour=id.ScheduledHour;
				Time=req.body.ScheduledHour;
			}
			return id.ScheduledHour;
		});

		var data2=result.map(function(id,indice){
			return id.ScheduledDay;
		});

		var data3=result.map(function(id,indice){
			return id.id;
		});

		var y=Time;
		const [hour,min]=y.split(":");
		if(min%10!=0||min<0||min>59||min==""){
			return res.status(400).send({"error":"The Number Is Invalid"});
		}
		else{
			for(var x=0;x<data.length;x++){
				console.log("\n"+data3[x]);
				if(data[x]==Time && data2[x]==Day){
					console.log("\n"+data2[x]);
					console.log("\n"+data[x]);
					if(data3[x]==ID){
						return next();
					}
					return res.status(400).send({"error":"já existe cliente marcado nessa hora"});
				}
			}
		}
		
	}
	return next();
}