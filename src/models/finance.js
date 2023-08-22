const { Sequelize } = require('sequelize');
const Database = require('../config/database');
const User = require('./user');

const FinanceData = Database.define('finances', {
    CurrentBalance: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        hooks: 'true',
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = FinanceData;
