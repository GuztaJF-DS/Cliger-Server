const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const cors = require('cors');

require("dotenv-safe").config();

const User=require('../models/user');
const Product=require('../models/product');
const ProductSales=require('../models/ManyToMany_Models/ProductSales');
const productSchedule=require('../models/ManyToMany_Models/ProductSchedule');

const GenerateConfirmToken=require('../middleware/GenerateToken');
const transporter=require('../modules/mail');
const emailFilter=require('../middleware/filter');


function GeneratePreLoadToken (params={}){
	return token=jwt.sign(params, process.env.SECRET,{
		expiresIn:(60*60*24),
	});
}

router.use(cors())

router.post('/register',emailFilter,async(req,res)=>{
	try{
		const Token=GeneratePreLoadToken();
		bcrypt.hash(req.body.Password, 10, async(err, hash)=> {
		const result=await User.create({
			UserName:req.body.UserName,
			Email:req.body.Email,
			Password:hash,
			BirthDate:req.body.BirthDate,
			PhoneNumber:req.body.PhoneNumber,
			ResetToken:null,
			ConfirmToken:Token
		})
		if(result){
			res.json({message:"Cadastro bem-sucedido",ConfirmToken:Token,Id:result.id});
		}
	})
	}catch(err){
		res.status(400).send({Error:"Cadastro mal-sucedido"});
	}

});

router.post('/authenticate',async(req,res)=>{
	try{
		const token=GenerateConfirmToken();
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){
			bcrypt.compare(req.body.Password,result.Password, async(err,resp)=>{
				if(resp){
					res.json({
						message:"Sucesso no Login",
						id:result.id,
						UserName:result.UserName,
						Email:result.Email,
						BirthDate:result.BirthDate,
						PhoneNumber:result.PhoneNumber,
						ConfirmToken:result.ConfirmToken
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
		console.log(err);
		res.status(400).send({Error:"Autentica????o falha"});
	}
});

router.post('/GetUserbyToken',async(req,res)=>{
	try{
		jwt.verify(req.body.ConfirmToken,process.env.SECRET,async(err,decoded)=>{
			if(err){
				const result=await User.findOne({where:{
					ConfirmToken:req.body.ConfirmToken
				}})
				if(result){
					result.ConfirmToken=GeneratePreLoadToken();
					await result.save();
				}
				res.json({Error:"Not Valid Token"});
			}
			if(!err){
				const result=await User.findOne({where:{
					ConfirmToken:req.body.ConfirmToken
				}})
				if(result){
					res.json({
						message:"Sucesso no Login",
						id:result.id,
						UserName:result.UserName,
						Email:result.Email,
						BirthDate:result.BirthDate,
						PhoneNumber:result.PhoneNumber
					});
				}
			}
		});
		
	}catch(err){
		console.log(err)
		res.status(400).send({Error:"Not Found"});
	}
})

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
			res.json({message:"Usu??rio deletado"});
		}else{
			res.json({Error:"Email Errado"});
		}
	}catch(err){
		res.status(400).send({Error:"Falha na opera????o"});
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
			res.json({message:"Valores Atualizados"});
		}
	}
	}catch(err){
		res.status(400).send({Error:"Atualiza????o falha"});
	}
})

router.post('/forgotPass',async(req,res)=>{
	try{
		let Token=GenerateConfirmToken();

		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){
			bcrypt.hash(Token, 10, async(err, hash)=> {
				result.ResetToken=hash;
				const resp=await result.save();
			});
		}
		else{
			res.json({Error:"Email Not Exists"});
			return;
		}

		const message = {
			from: '<cligeroficial@gmail.com>',
			to: `<${req.body.Email}>`,
			subject: 'Recupera????o de senha',
			html: `
			<body style="background-color:#68293f;">
				<img src="https://i.ibb.co/SBSS0JF/Cliger-Logo-Text-Only.png" alt="Cliger-Logo"/>
				<h2 style="color:#ebb89b">
					Ol??, pelo visto voc?? gostaria de mudar a sua senha, use esse c??digo aqui para redefinir sua senha
				</h2>
					<h1 style="color:#ebb89b">${Token}</h1>
				<h2 style="color:#ebb89b">
					Caso voc?? n??o queira mudar a senha apenas ignore este e-mail
				</h2>
			<body>`
		};
			console.log("\nEnviando o Email");
			transporter.sendMail(message, (err, info) => {
	        if (err) {
	            console.log(`Error occurred. ${err.message}`);
	            res.json({Error:"Email not sended"});
	        }else{
		        console.log(`Message sent:, ${info.messageId}`);
	        	res.json({message:"Email sended"})
	        }
	    });
	}catch(err){
		console.log(err);
		res.status(400).send({Error:"Email n??o Enviado"})
	}
})


router.post('/ConfirmToken',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){			
			bcrypt.compare(req.body.Token,result.ResetToken, async(err,resp)=>{
				if(resp){
					res.json({message:"C??digo confirmado"});
				}
				else if(err){
					console.log(err);
					res.json({Error:"C??digo Invalido"});
				}
				else{
					res.json({Error:"C??digo Errado"});
				}
			})
		}
	}
	catch(err){
		console.log(err);
		res.status(400).send({Error:"Cannot confirm Token, try again Later"});
	}
})

router.post('/ChangePass',async(req,res)=>{
	try{
		const result=await User.findOne({where:{
			Email:req.body.Email
		}})
		if(result){			
			bcrypt.compare(req.body.Token,result.ResetToken, async(err,resp)=>{
				if(resp){
					bcrypt.hash(req.body.Password, 10, async(err, hash)=> {
						result.Password=hash,
						result.ResetToken="";
						await result.save();
						res.json({message:"Password Changed"})
					})
				}
		})
		}else{
			res.json({Error:"Email or Token is Invalid"})
		}
	}catch(err){
		console.log(err);
		res.json({Error:"Cannot change Password"});
	}
})


module.exports=app=>app.use('/auth',router);
