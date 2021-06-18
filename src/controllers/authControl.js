const express=require('express');
const { Sequelize } = require("sequelize");
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const cors = require('cors');

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

router.use(cors())

router.post('/register',async(req,res,next)=>{
	try{
		console.log(req.body.email_user)
		const result=await User.findOne({where:{
			email_user:req.body.email_user
		}})
		if(result==null){
				bcrypt.hash(req.body.password_user, 10, async(err, hash)=> {
				const resultX=await User.create({
					nm_user:req.body.nm_user,
					email_user:req.body.email_user,
					password_user:hash,
				})
				if(resultX){
					res.status(200).send({mensage:"Success on register"})
				}
			})
		}else{
			res.json({Error:"Email or UserName Already Exists"})
		}
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
					res.status(200).send({Error:"Wrong Password"})
				}
			})
			
		}else{
			res.status(200).send({Error:"Wrong E-Mail"});
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"auth Failed"});
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
					res.status(200).send({Error:"Wrong Password"})
				}
			})
		}
	}catch(err){
		res.status(400).send({Error:"deletation Failed"})
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
	            res.status(200).send({Error:"Email not sended"})
	        }else{
	        	res.status(200).send({Mensage:"Email sended", Token:`${token}`})
		        console.log('Message sent: %s', info.mensageId);
	        }
	    });
	}catch(err){
		res.status(400).send({Error:"Failed"})
	}
})


router.get('/ResetPass',authPass,async(req,res)=>{
	try{
		res.send({"user":req.userId});		
	}catch(err){
		res.status(400).send({Error:"Failed"});
	}
})

router.put('/ConfirmPass',async(req,res)=>{
	try{
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
		res.status(400).send({Error:"Failed"});
	}
})

module.exports=app=>app.use('/auth',router);
