const {Sequelize}=require('Sequelize');
const Database=require('../config/database');

const User=require('./user');

const ProductService=Database.define('productService',{
    Code:{
        type:Sequelize.STRING,
        allowNull:true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Description:{
        type:Sequelize.TEXT,
        allowNull:true
    },
    Type:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Value:{
        type:Sequelize.FLOAT,
        allowNull:true
    },
    TotalAmount:{
        type:Sequelize.INTEGER,
        allowNull:true
    }
});

User.hasMany(ProductService,{onDelete:'CASCADE'});
ProductService.belongsTo(User);

module.exports=ProductService;