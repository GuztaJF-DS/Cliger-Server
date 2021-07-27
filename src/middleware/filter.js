const User=require('../models/user');
const bodyParser=require('body-parser');

module.exports=async(req,res,next)=>{
	try{
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result!=null){
			res.json({Error:"Este Email já foi cadastrado"});
		}else{
			return next();
		}
	}catch(err){
		console.log(err);
		res.json({Error:"Um Error ocoreu na verificação do Email"});
	}
}
