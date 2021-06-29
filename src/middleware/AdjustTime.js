const Schedule=require('../models/Schedule');
const bodyParser=require('body-parser');
const { Op } = require("sequelize");

module.exports=async(req,res,next)=>{
	const Day = req.body.ScheduledDay;
	const Time=req.body.ScheduledHour;
	const Id=req.body.userId;

	const result=await Schedule.findAll({
		where:{
			[Op.and]: [{ScheduledDay:Day }, { userId:Id }]
		},
		raw: true
	})
	if(result){
		var data= result.map(function(id,indice){
			return id.ScheduledHour;
		});

		var y=Time;
		const [hour,min]=y.split(":");
		if(min%10!=0||min<0||min>59||min==""){
			return res.status(400).send({"error":"The Number Is Invalid"});
		}
		else{
			for(var x=0;x<data.length;x++){
				if(data[x]==Time){
					return res.status(400).send({"error":"já existe cliente marcado nessa hora"});
				}
			}
		}
		
	}
	
	return next();
}