const Sequelize = require('sequelize');
const express = require('express');
const Produto = require('./models/produto');
const Usuario = require('./models/usuario');
const database = require('./db');

const router = express.Router();

//Criação do usuário
router.post('/cadastro-de-usuario', async (req, res) => {
  try{
    const { nomeUsuario, cpf, telefone, senha } = req.body;
    const usuario = await Usuario.create({ nomeUsuario, cpf, telefone, senha });
    await database.sync();
    res.json(usuario);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao cadastrar o usuário.' });
  }
});

//Criação de produto de um usuário específico
router.post('/usuarios/:usuarioId/cadastro-de-produto/', async (req, res) => {
  try{
    const { usuarioId } = req.params;
    const { nomeProduto, valor, descricao } = req.body;
    if (descricao == null){
      produto.descricao = null;}
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario){
      return res.status(404).json( { message: 'Usuário não encontrado.' });
    }
    const produto = await Produto.create({ nomeProduto, valor, descricao });
    await usuario.addProdutos(produto);

    await database.sync();
    res.json(produto);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao cadastrar o produto.' });
  }
});

//Buscar todos os usuários cadastrados
router.get('/usuarios', async (req, res) => { //ATENÇÃO AQUIIIII, ESSA PARTE PARA VER SE A CONEXÃO ESTÁ FEITA.
  try {
    await database.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  try{
    await database.sync();
    const usuario = await Usuario.findAll();
    res.json(usuario);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

//Buscar um usuário específico
router.get('/usuarios/:id', async (req, res) => {
  try{
    await database.sync();
    const { usuarioId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId);
    res.json(usuario);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});

//Buscar todos os produtos de um usuário
router.get('/usuarios/:usuarioId/produtos', async (req, res) => {
    try{
      await database.sync();
      const { usuarioId } = req.params;
      const usuario = await Usuario.findByPk(usuarioId)
      if (!usuario){
        return res.status(404).json( { message: 'Usuário não encontrado.' });
      }
      const produto = await usuario.getProdutos();
      res.json(produto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar os produtos deste usuário.' });
    }
  });

//Busar um produto específico de um usuário
router.get('/usuarios/:usuarioId/produtos/:produtoId', async (req, res) => {
  try{
    await database.sync();
    const { usuarioId, produtoId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId)
    if (!usuario){
      return res.status(404).json( { message: 'Usuário não encontrado.' });
    }
    const produto = await Produto.findOne({where: { produtoId: produtoId, usuarioId: usuarioId}});
    if (!produto){
      return res.status(404).json( { message: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar produto.' });
  }
});

//ATÉ AQUI FUNCIONA NORMAL, EM PRINCÍPIO!!!

//Atualizar dados de um usuário
router.put('/usuarios/:usuarioId', async (req, res) => {
  try {
    await database.sync();
    const { usuarioId } = req.params;
    const { nomeUsuario, cpf, telefone, senha } = req.body;
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (nomeUsuario){
      usuario.nomeUsuario = nomeUsuario;
    }
    if (cpf){
      usuario.cpf = cpf;
    }
    if (telefone){
      usuario.telefone = telefone;
    }
    if (senha){
      usuario.senha = senha;
    }
    if (telefone == null){
      usuario.telefone = null;        
    }
    await usuario.save();
    await database.sync();
    return res.json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar cadastro de usuário.' });
  }
});

//Atualizar dados de um produto de um usuário
router.put('/usuarios/:usuarioId/produto/:id', async (req, res) => {
  try {
    await database.sync();
    const { usuarioId, idProduto } = req.params;
    const { nomeProduto, valor, descricao } = req.body;
    const usuario = await Usuario.findByPk(usuarioId)
    const produto = await Produto.findByPk(idProduto);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    if (nomeProduto){
      produto.nomeProduto = nomeProduto;
    }
    if (valor){
      produto.valor = valor;
    }
    if (descricao){
      produto.descricao = descricao;
    }
    if (descricao == null){
      produto.descricao = null;        
    }
    await produto.save();
    await database.sync();
    return res.json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
});

//Deletar um usuário
router.delete('/usuarios/:id', async (req, res) => {
  try {
    await database.sync();
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    await usuario.destroy();
    await database.sync();
    return res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
});

//Deletar produto
router.delete('/usuarios/:id/produtos/:id', async (req, res) => {
  try {
    await database.sync();
    const { id, idProduto } = req.params;
    const usuario = await Usuario.findByPk(id);
    const produto = await usuario.getProdutos(idProduto);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    await produto.destroy();
    await database.sync();
    return res.json({ message: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar o produto.' });
  }
});

//Realizar compra/venda de um produto
router.delete('/vendas/:id', async (req, res) => {
  try {
    await database.sync();
    const { id1, id2, idProduto } = req.params;
    const vendedor = await Usuario.findByPk(id1);
    const produto = await vendedor.getProdutos(idProduto);
    if (!vendedor) {
      return res.status(404).json({ message: 'Vendedor não encontrado.' });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    const comprador = await Usuario.findByPk(id2);
    if (!comprador) {
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }
    await comprador.addProduto(produto);  
    await produto.destroy();
    await database.sync();
    return res.json({ message: 'Venda realizada com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao realizar venda.' });
  }
});

module.exports = router;