const express=require('express');
const { Sequelize } = require("sequelize");
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');

require("dotenv-safe").config();

const User=require('../models/user');
const Database=require('../config/database');

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
	try{
		const result=await User.findOne({where:{
			email_user:req.body.email_user
		}})
		if(result){
			bcrypt.hash(result.password_user,10,(err,hash)=>{
				bcrypt.compare(req.body.password_user,hash).then(resp=>{
					if(resp){
						res.status(200).send({mensage:"Success on auth"})
					}
					else{
						res.status(400).send({mensage:"Wrong Password"})
					}
				})
				
			})
			
		}else{
			res.status(400).send({error:"Wrong E-Mail"});
		}
	}catch(err){
		res.status(400).send({error:"auth Failed"});
	}
});

module.exports=app=>app.use('/auth',router);
