const { Sequelize } = require("sequelize");
const Database=require("../config/database");
const User=require("./user");

const Schedule = Database.define("schedule", {
	  ScheduledDay: {
        type: Sequelize.DATEONLY,
        allowNull:false
    },
      ScheduledHour:{
        type:Sequelize.STRING,
        allowNull:false
      },
      ClientName:{
        type:Sequelize.STRING,
        allowNull:true
      }
	});

User.hasMany(Schedule,{onDelete:'CASCADE'});
Schedule.belongsTo(User);

module.exports=Schedule;
