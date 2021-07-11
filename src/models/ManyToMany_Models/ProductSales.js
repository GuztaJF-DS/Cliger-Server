const {Sequelize}=require('sequelize');
const database=require('../../config/database');

const ProSer=require('../product');
const SalesRecord=require('../SalesRecord');

const ProductSales=database.define('ProductSales',{
    ProductId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'cascade',
        hooks:'true',
        references:{
            model:ProSer,
            key:'id'
        }
    },
    SalesId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'cascade',
        hooks:'true',
        references:{
            model:SalesRecord,
            key:'id'
        }
    },
    Amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    Weight:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
})

module.exports=ProductSales;