const Sequelize = require('sequelize');
const database = require('../db');
const Usuario = require('./usuario');

const Produto = database.define('produto', {
    produtoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nomeProduto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valor: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true,
      },
});

module.exports = Produto;