const Sequelize = require('sequelize');
const database = require('../db');
const Usuario = require('./usuario');

const Produto = database.define('produto', {
    produtoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nomeProduto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      valor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
});

module.exports = Produto;