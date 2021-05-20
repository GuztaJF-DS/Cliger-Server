const { Sequelize } = require('sequelize');
require("dotenv-safe").config();

const db = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  port:process.env.DBPORT,
  dialect: 'mysql'
});

(async()=>{
	try{
		const resultado=await db.sync();
		console.log("conected :)");
	}catch(err){
		console.log(err);
	}
})();

module.exports=db;
