const { Sequelize } = require("sequelize");
const Database = require("../config/database");
const User = require("./user");

const FinanceData=Database.define("finances",{
    CurrentBalance:{
        type: Sequelize.INTEGER,
        allowNull:false
    }
});

User.hasMany(FinanceData,{onDelete:'CASCADE'});
FinanceData.belongsTo(User);

module.exports=FinanceData;