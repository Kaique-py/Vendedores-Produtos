const Sequelize = require('sequelize');
const database = require('../db');
const Produto = require('./produto');

const Usuario = database.define('usuario', {
    usuarioId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomeUsuario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
});

module.exports = Usuario;