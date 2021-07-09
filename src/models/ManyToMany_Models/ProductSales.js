const {Sequelize}=require('sequelize');
const database=require('../../config/database');

const ProSer=require('../product');
const SalesRecord=require('../SalesRecord');

const ProductSales=database.define('ProductSales',{
    ProductId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
            model:ProSer,
            key:'id'
        }
    },
    SalesId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'CASCADE',
        references:{
            model:SalesRecord,
            key:'id'
        }
    }
})

module.exports=ProductSales;