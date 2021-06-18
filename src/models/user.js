const { Sequelize } = require("sequelize");
const Database=require("../config/database");

const User = Database.define("users", {
	  nm_user:{
        type: Sequelize.STRING,
        allowNull:false
    },
	  email_user: {
        type: Sequelize.STRING,
        allowNull:false
    },
	  password_user: {
        type: Sequelize.STRING,
        allowNull:false
    },
	});

module.exports=User;
