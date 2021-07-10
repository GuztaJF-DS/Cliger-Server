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
		var data= result.map(function(item,indice){
			if(Time==""){
				req.body.ScheduledHour=id.ScheduledHour;
				Time=req.body.ScheduledHour;
			}
			let ScheduledHour=item.ScheduledHour,
			ScheduledDay=item.ScheduledDay,
			id=item.id
			return {ScheduledHour,ScheduledDay,id};
		});


		var y=Time;
		const [hour,min]=y.split(":");
		if(min%10!=0||min<0||min>59||min==""||hour>23||hour<0){
			return res.status(400).send({"error":"The Number Is Invalid"});
		}
		else{
			for(var x=0;x<data.length;x++){
				if(data[x].ScheduledHour==Time && data[x].ScheduledDay==Day){
					if(data[x].id==ID){
						return next();
					}
					return res.status(400).send({"error":"já existe cliente marcado nessa hora"});
				}
			}
		}
		
	}
	return next();
}