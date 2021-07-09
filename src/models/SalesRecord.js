const {Sequelize}=require('sequelize');
const database=require('../config/database');

const User=require('./user');

const SalesRecord=database.define('SalesRecord',{
    TotalBuyPrice:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    MoneyPayed:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    PayBack:{
        type:Sequelize.FLOAT,
        allowNull:true
    }
});
User.hasMany(SalesRecord,{onDelete:'CASCADE'});
SalesRecord.belongsTo(User);

module.exports=SalesRecord;