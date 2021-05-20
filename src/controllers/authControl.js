const express=require('express');
const { Sequelize } = require("sequelize");
const router=express.Router();
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');

require("dotenv-safe").config();

const User=require('../models/user.js');
const Database=require('../config/database.js');

function generate_Token(params={}){
	return token=jwt.sign(params, process.env.SECRET,{
		expiresIn:300
	});
}

router.post('/register',async(req,res,next)=>{
	try{
		const result=await User.create({
			nm_user:req.body.nm_user,
			email_user:req.body.email_user,
			password_user:req.body.password_user,
		})
		if(result){
			res.status(200).send({mensage:"Success on register"})
		}
	}catch(err){
		res.status(400).send({error:"Registration Failed"});
	}

});

router.post('/authenticate',async(req,res)=>{
	//To do
});

module.exports=app=>app.use('/auth',router);
