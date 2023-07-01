const Sequelize = require('sequelize');
const database = require('../db');

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
      produtoId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });

module.exports = Usuario;