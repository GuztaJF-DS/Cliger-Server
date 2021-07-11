const {Sequelize}=require('Sequelize');
const Database=require('../../config/database');

const ProSer=require('../product');
const Schedule=require('../schedule');

const ProductSchedule=Database.define("ProductSchedule",{
    ScheduleId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'cascade',
        hooks:'true',
        references:{
            model:Schedule,
            key:'id'
        }
    },
    ProSerId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        onDelete:'cascade',
        hooks:'true',
        references:{
            model:ProSer,
            key:'id'
        }
    }
})

module.exports=ProductSchedule;