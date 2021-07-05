const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const cors = require('cors');

require("dotenv-safe").config();

const User=require('../models/user');
const transporter=require('../modules/mail');
const authPass=require('../middleware/auth');
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
			ResetToken:null,
			ResetTokenExpDate:null
		})
		if(result){
			res.json({mensage:"Success on register"})
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
					res.json({mensage:"Success on auth"})
				}
				else{
					res.json({Error:"Wrong Password"})
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
						res.json({mensage:"User Deleted"})
					}
				}
				else{
					res.json({Error:"Wrong Password"})
				}
			})
		}else{
			res.json({Error:"Wrong Email"});
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
			to: `<${req.body.Email}>`,
			subject: 'Recuperação de senha',
			html: `<p>recupera tua conta ai bro atraves desse token ai ${token}</p>`
		};
	    transporter.sendMail(mensage, (err, info) => {
	        if (err) {
	            console.log(`Error occurred. ${err.mensage}`);
	            res.json({Error:"Email not sended"})
	        }else{
	        	res.json({Mensage:"Email sended", Token:`${token}`})
		        console.log(`Message sent:, ${info.mensageId}`);
	        }
	    });
	}catch(err){
		res.status(400).send({Error:"Failed"})
	}
})


router.get('/resetPass',authPass,async(req,res)=>{
	try{
		res.json({"user":req.userId});		
	}catch(err){
		res.status(400).send({Error:"Failed"});
	}
})

router.put('/confirmPass',async(req,res)=>{
	try{
		bcrypt.hash(req.body.Password, 10, async(err, hash)=> {

			const result=await User.update(
				{Password:hash},
				{where:{Email:req.body.Email}}
			) 
			if(result){
				res.json({mensage:"Password Changed"})
			}
		})		
	}catch(err){
		res.status(400).send({Error:"Failed"});
	}
})

module.exports=app=>app.use('/auth',router);
