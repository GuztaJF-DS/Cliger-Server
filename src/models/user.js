const { Sequelize } = require("sequelize");
const Database=require("../config/database");

const User = Database.define("users", {
	  UserName:{
        type: Sequelize.STRING,
        allowNull:false
    },
	  Email: {
        type: Sequelize.STRING,
        allowNull:false
    },
	  Password: {
        type: Sequelize.STRING,
        allowNull:false
    },
      BirthDate: {
        type: Sequelize.DATEONLY,
        allowNull:false
    },
      Cpf: {
        type: Sequelize.STRING,
        allowNull:false
    },
      PhoneNumber: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
      ResetToken: {
        type: Sequelize.STRING,
        allowNull:true
    },
	});

module.exports=User;
