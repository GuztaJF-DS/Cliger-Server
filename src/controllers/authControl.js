const express=require('express');
const { Sequelize } = require("sequelize");
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');

require("dotenv-safe").config();

const User=require('../models/user');
const Database=require('../config/database');
const transporter=require('../modules/mail');
const authPass=require('../middleware/auth')

function Generate_Token (params={}){
	return token=jwt.sign(params, process.env.SECRET,{
			expiresIn:(5*60),
		});
}

router.post('/register',async(req,res,next)=>{
	try{
		 bcrypt.hash(req.body.password_user, 10, async(err, hash)=> {
			const result=await User.create({
				nm_user:req.body.nm_user,
				email_user:req.body.email_user,
				password_user:hash,
			})
			if(result){
				res.status(200).send({mensage:"Success on register"})
			}
		})
	}catch(err){
		res.status(400).send({error:"Registration Failed"});
	}

});

router.post('/authenticate',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			email_user:req.body.email_user
		}})
		if(result){
			bcrypt.compare(req.body.password_user,result.password_user, async(err,resp)=>{
				if(resp){
					res.status(200).send({mensage:"Success on auth"})
				}
				else{
					res.status(400).send({mensage:"Wrong Password"})
				}
			})
			
		}else{
			res.status(400).send({error:"Wrong E-Mail"});
		}
	}catch(err){
		console.log(err);
		res.status(400).send({error:"auth Failed"});
	}
});

router.post('/delete/User',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			email_user:req.body.email_user
		}})
		if(result){
			bcrypt.compare(req.body.password_user,result.password_user, async(err,resp)=>{
				if(resp){
					const resul=await User.destroy({where:{
						email_user:req.body.email_user
					}})
					if(resul){
						res.status(200).send({mensage:"User Deleted"})
					}
				}
				else{
					res.status(400).send({mensage:"Wrong Password"})
				}
			})
		}
	}catch(err){
		console.log(err);
		res.status(400).send({error:"deletation Failed"})
	}
})

router.post('/forgotPass',async(req,res)=>{
	try{

		const token=Generate_Token();
		
		const mensage = {
			from: '<cligeroficial@gmail.com>',
			to: '<'+req.body.email_user+'>',
			subject: 'Recuperação de senha',
			html: `<p>recupera tua conta ai bro atraves desse token ai ${token}</p>`
		};
	    transporter.sendMail(mensage, (err, info) => {
	        if (err) {
	            console.log('Error occurred. ' + err.mensage);
	            res.status(400).send({error:"Email not sended"})
	        }else{
	        	res.status(200).send({mensage:"Email sended", Token:`${token}`})
		        console.log('Message sent: %s', info.mensageId);
	        }
	    });
	}catch(err){
		console.log(err);
		res.status(400).send({error:"Failed"})
	}
})


router.get('/ResetPass',authPass,async(req,res)=>{
	try{
		res.send({"user":req.userId});		
	}catch(err){
		console.log(err);
		console.log(req.body.password_user);
		res.status(400).send({error:"Failed"});
	}
})

router.post('/ConfirmPass',async(req,res)=>{
	try{
		console.log(req.body.password_user);
		bcrypt.hash(req.body.password_user, 10, async(err, hash)=> {

			const result=await User.update(
				{password_user:hash},
				{where:{email_user:req.body.email_user}}
			) 
			if(result){
				res.status(200).send({mensage:"Password Changed"})
			}
		})		
	}catch(err){
		console.log(err);
		console.log(req.body.password_user);
		res.status(400).send({error:"Failed"});
	}
})

module.exports=app=>app.use('/auth',router);
