const Sequelize = require('sequelize');
const sequelize = new Sequelize('banco', 'postgres', 'kaique', {
    dialect: 'postgres',
    host: 'localhost'
})

module.exports = sequelize;