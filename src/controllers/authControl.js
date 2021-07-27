const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const cors = require('cors');
const { Op } = require("sequelize");

require("dotenv-safe").config();

const User=require('../models/user');
const Product=require('../models/product');
const ProductSales=require('../models/ManyToMany_Models/ProductSales');
const productSchedule=require('../models/ManyToMany_Models/ProductSchedule');

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
			PhoneNumber:req.body.PhoneNumber,
			ResetToken:null
		})
		if(result){
			res.json({menssage:"Cadastro bem-sucedido"});
		}
	})
	}catch(err){
		res.status(400).send({error:"Cadastro mal-sucedido"});
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
					res.json({
						menssage:"Success on auth",
						id:result.id,
						UserName:result.UserName,
						Email:result.Email,
						BirthDate:result.BirthDate,
						PhoneNumber:result.PhoneNumber
					});
				}
				else{
					res.json({Error:"Senha Errada"});
				}
			})

		}else{
			res.json({Error:"E-Mail Errado"});
		}
	}catch(err){
		res.status(400).send({Error:"Autenticação falha"});
	}
});

router.post('/delete/User',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			id:req.body.id
		}})
		if(result){
			const findPro=await Product.findAll({
				where:{userId:result.id}
			})
			if(findPro){
				for(var x=0;x<findPro.length;x++){
					const del1=await ProductSales.destroy({
				 		where:{ProductId:findPro[x].id}
					});
					const del2=await productSchedule.destroy({
						where:{ProSerId:findPro[x].id}
				   });
				}
			}
			const del=await User.destroy({where:{
				id:result.id
			}})
			res.json({mensage:"User Deleted"});
		}else{
			res.json({Error:"Wrong Email"});
		}
	}catch(err){
		res.status(400).send({Error:"delete Failed"});
	}
});

router.put('/update',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			id:req.body.id
		}})
		if(result){
			const json='{"User":["UserName","BirthDate","PhoneNumber"]}';
			const obj=JSON.parse(json);

			for(var x=0;x<obj.User.length;x++){
				var string=obj.User[x];
				if(req.body[string]!=""){
				result[string]=req.body[string];
				await result.save();
			}
			res.json({menssage:"Values Updated"});
		}
	}
	}catch(err){
		res.status(400).send({Error:"Update Failed"});
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

		const menssage = {
			from: '<cligeroficial@gmail.com>',
			to: `<${req.body.Email}>`,
			subject: 'Recuperação de senha',
			html: `<p>Olá, pelo visto você gostaria de mudar a sua senha, use esse código aqui para redefinir sua senha ${token}</p>`
		};
	    transporter.sendMail(menssage, (err, info) => {
	        if (err) {
	            console.log(`Error occurred. ${err.menssage}`);
	            res.json({Error:"Email not sended"});
	        }else{
	        	res.json({menssage:"Email sended", Token:`${token}`})
		        console.log(`Message sent:, ${info.menssageId}`);
	        }
	    });
	}catch(err){
		res.status(400).send({Error:"Email not Sended"})
	}
})


router.post('/ConfirmToken',async(req,res)=>{
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
			res.json({menssage:"Token confimed"});
		});
	}catch(err){
		res.status(400).send({Error:"Cannot confirm Token, try again Later"});
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
					res.json({menssage:"Password Changed"})
				}
			})
		}else{
			res.status(400).send({Error:"Email or Token is Invalid"})
		}
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Cannot change Password"});
	}
})

module.exports=app=>app.use('/auth',router);
