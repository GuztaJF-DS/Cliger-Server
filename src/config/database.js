const { Sequelize } = require('sequelize');
const mysql=require('mysql2/promise');
require("dotenv-safe").config();

const db = new Sequelize(process.env.DBNAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
  host: 'localhost',
  port:process.env.DBPORT,
  dialect: 'mysql',
  timezone: '-03:00'
});

run();

async function run(){
  const connection=await mysql.createConnection({
    host:process.env.DBHOST,
    port:process.env.DBPORT,
    user:process.env.DBUSERNAME,
    password:process.env.DBPASSWORD
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DBNAME}\`;`);

  // If you have changed the DataBase and want to Update it, use the code below
  //const resultado=await db.sync({ alter: true });

  // But If you don't have changed, use this instead, cuz he is faster than the other :)
  const resultado=await db.sync();
}


module.exports=db;
