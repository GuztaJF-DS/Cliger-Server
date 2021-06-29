const User=require('../models/user');
const bodyParser=require('body-parser');

module.exports=async(req,res,next)=>{
	const result=await User.findOne({where:{
		Email:req.body.Email
	}})
	if(result!=null){
		res.json({Error:"Email or UserName Already Exists"});
	}
	return next();
}