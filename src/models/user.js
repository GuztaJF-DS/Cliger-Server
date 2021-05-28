const { Sequelize } = require("sequelize");
const Database=require("../config/database");

const User = Database.define("users", {
	  nm_user:{
        type: Sequelize.STRING,
        allowNull:false,
		unique:'compositeIndex'
    },
	  email_user: {
        type: Sequelize.STRING,
        allowNull:false,
		unique:'compositeIndex'
    },
	  password_user: {
        type: Sequelize.STRING,
        allowNull:false
    },
	});

module.exports=User;
