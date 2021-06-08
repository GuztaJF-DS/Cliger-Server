const jwt=require('jsonwebtoken');

require("dotenv-safe").config();

module.exports=(req,res,next)=>{
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

	jwt.verify(token,process.env.SECRET,(err,decoded)=>{
		if(err){
			return res.status(401).send({"error":"Token invalid"});
		}
		return next();
	});
};