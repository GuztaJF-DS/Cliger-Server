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
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'cascade',
        hooks:'true',
        references:{
            model:User,
            key:'id'
        }
    }
});

module.exports=SalesRecord;