const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const cors = require('cors');
const { Op } = require("sequelize");

require("dotenv-safe").config();

const User=require('../models/user');
const transporter=require('../modules/mail');
const emailFilter=require('../middleware/filter');

function Generate_Token (params={}){
	return token=jwt.sign(params, process.env.SECRET,{
		expiresIn:(5*60),
	});
}

router.use(cors())

router.post('/register',emailFilter,async(req,res,next)=>{
	try{
		bcrypt.hash(req.body.Password, 10, async(err, hash)=> {
		const result=await User.create({
			UserName:req.body.UserName,
			Email:req.body.Email,
			Password:hash,
			BirthDate:req.body.BirthDate,
			Cpf:req.body.Cpf,
			PhoneNumber:req.body.PhoneNumber,
			ResetToken:null
		})
		if(result){
			res.json({mensage:"Success on register"});
		}
	})
	}catch(err){
		res.status(400).send({error:"Registration Failed"});
	}

});

router.post('/authenticate',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){
			bcrypt.compare(req.body.Password,result.Password, async(err,resp)=>{
				if(resp){
					res.json({mensage:`Success on auth ${result.ResetToken}`});
				}
				else{
					res.json({Error:"Wrong Password"});
				}
			})
			
		}else{
			res.json({Error:"Wrong E-Mail"});
		}
	}catch(err){
		res.status(400).send({Error:"auth Failed"});
	}
});

router.post('/delete/User',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){
			bcrypt.compare(req.body.Password,result.Password, async(err,resp)=>{
				if(resp){
					const del=await User.destroy({where:{
						Email:req.body.Email
					}})
					if(del){
						res.json({mensage:"User Deleted"});
					}
				}
				else{
					res.json({Error:"Wrong Password"});
				}
			})
		}else{
			res.json({Error:"Wrong Email"});
		}
	}catch(err){
		res.status(400).send({Error:"deletation Failed"});
	}
})

router.post('/forgotPass',async(req,res)=>{
	try{
		const token=Generate_Token();
		
		const mail=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(mail){
			mail.ResetToken=token;
			await mail.save();
		}
		else{
			res.status(400).send({Error:"Email Not Exists"});
		}

		const mensage = {
			from: '<cligeroficial@gmail.com>',
			to: `<${req.body.Email}>`,
			subject: 'Recuperação de senha',
			html: `<p>recupera tua conta ai bro atraves desse token ai ${token}</p>`
		};
	    transporter.sendMail(mensage, (err, info) => {
	        if (err) {
	            console.log(`Error occurred. ${err.mensage}`);
	            res.json({Error:"Email not sended"});
	        }else{
	        	res.json({Mensage:"Email sended", Token:`${token}`})
		        console.log(`Message sent:, ${info.mensageId}`);
	        }
	    });
	}catch(err){
		res.status(400).send({Error:"Failed"})
	}
})


router.get('/ConfirmToken',async(req,res)=>{
	try{
		const authHeader=req.headers.authorization;;

		if(!authHeader){
			return res.status(401).send({"error":"No Token provided"});
		}

		const parts=authHeader.split(' ');

		if(!parts.length===2){
			return res.status(401).send({"error":"Token Error"});
		}
		const [scheme,token]=parts;

		if(!/^Bearer$/i.test(scheme)){
			return res.status(401).send({"error":"Token MalFormatted"});
		}

		jwt.verify(token,process.env.SECRET,async(err,decoded)=>{
			if(err){
				return res.status(401).send({"error":"Token invalid"});
			}
			res.json({mensage:"Token confimed"});
		});		
	}catch(err){
		res.status(400).send({Error:"Failed"});
	}
})

router.put('/changePass',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			[Op.and]:[{Email:req.body.Email},{ResetToken:req.body.Token}]
		}});
		if(result){
			bcrypt.hash(req.body.Password, 10, async(err, hash)=> {
				const resp=await User.update(
					{Password:hash},
					{where:{Email:req.body.Email}}
				) 
				if(resp){
					result.ResetToken="";
					await result.save();
					res.json({mensage:"Password Changed"})
				}
			})
		}else{
			res.status(400).send({Error:"Email or Token is Invalid"})
		}	
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Failed"});
	}
})

module.exports=app=>app.use('/auth',router);
