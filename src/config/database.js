const { Sequelize } = require('sequelize');
const mysql=require('mysql2/promise');
require("dotenv-safe").config();

run();

const db = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  port:process.env.DBPORT,
  dialect: 'mysql',
  timezone: '-03:00'
});

async function run(){
  const connection=await mysql.createConnection({host:process.env.DBHOST,port:process.env.DBPORT,user:process.env.DBUSERNAME,password:process.env.DBPASSWORD});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DBNAME}\`;`);

  // const resultado=await db.sync({ alter: true });
  const resultado=await db.sync();
}


module.exports=db;