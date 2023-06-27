const Sequelize = require('sequelize');
const database = require('../db');
const Produto = require('./produto');

const Usuario = database.define('usuario', {
    usuarioId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomeUsuario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
});

module.exports = Usuario;