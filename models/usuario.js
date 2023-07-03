const Sequelize = require('sequelize');
const database = require('../db');
const Produto = require("./produto");

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

Usuario.prototype.comprarProduto = async function (produtoId, fornecedorId) {
  try {
    const produto = await Produto.findByPk(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    const fornecedor = await Usuario.findByPk(fornecedorId);
    if (!fornecedor) {
      throw new Error('Fornecedor não encontrado.');
    }
    if (produto.usuarioId !== fornecedor.usuarioId) {
      throw new Error('O produto não pertence ao fornecedor.');
    }
    produto.usuarioId = this.usuarioId;
    await produto.save();
    return produto;
  } catch (error) {
    throw new Error('Erro ao comprar o produto.');
  }
};    

Usuario.prototype.venderProduto = async function (produtoId) {
  try {
    const produto = await Produto.findByPk(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    if (produto.usuarioId !== this.usuarioId) {
      throw new Error('O produto não pertence a esse usuário.');
    }
    const comprador = await Usuario.findByPk(compradorId)
    if (!comprador) {
      throw new Error('Produto não encontrado.');
    }
    produto.usuarioId = comprador.usuarioId;
    await produto.save();
    return produto;
  } catch (error) {
    throw new Error('Erro ao vender o produto.');
  }
};
    
Usuario.prototype.mostrarProdutos = async function () {
  try {
    const produtos = await Produto.findAll({ where: { usuarioId: this.usuarioId } });
    return produtos;
  } catch (error) {
    throw new Error('Erro ao exibir os produtos do usuário.');
  }
};
    
Usuario.prototype.descartarProduto = async function (produtoId) {
  try {
    const produto = await Produto.findByPk(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    if (produto.usuarioId !== this.usuarioId) {
      throw new Error('O produto não pertence ao usuário.');
    }
    await produto.destroy();
    return produto;
  } catch (error) {
    throw new Error('Erro ao descartar o produto.');
  }
};
    
module.exports = Usuario;