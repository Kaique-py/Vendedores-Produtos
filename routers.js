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
    usuario.produtoId = null;
    if (cpf == ""){
    usuario.cpf = null;        
    }
    if (cpf == null){
      usuario.cpf = null;        
    }
    if (telefone == ""){
      usuario.telefone = null;        
    }
    if (telefone == null){
      usuario.telefone = null;        
    }
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
    produto.usuarioId = usuarioId
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
router.get('/usuarios/:usuarioId', async (req, res) => {
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
    if (nomeUsuario == ""){
      usuario.nomeUsuario = null;        
    }
    if (nomeUsuario == null){
      usuario.nomeUsuario = null;        
    }
    if (cpf){
      usuario.cpf = cpf;
    }
      if (cpf == ""){
      usuario.cpf = null;        
    }
    if (cpf == null){
      usuario.cpf = null;        
    }
    if (telefone){
      usuario.telefone = telefone;
    }
    if (telefone == ""){
      usuario.telefone = null;        
    }
    if (telefone == null){
      usuario.telefone = null;        
    }
    if (senha){
      usuario.senha = senha;
    }
    if (senha == ""){
      usuario.senha = null;        
    }
    if (senha == null){
      usuario.senha = null;        
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
router.put('/usuarios/:usuarioId/produtos/:produtoId', async (req, res) => {
  try {
    await database.sync();
    const { usuarioId, produtoId } = req.params;
    const { nomeProduto, valor, descricao } = req.body;
    const usuario = await Usuario.findByPk(usuarioId)
    const produto = await Produto.findOne({where: { produtoId: produtoId, usuarioId: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    const atualizacao = {};
    if (nomeProduto){
      atualizacao.nomeProduto = nomeProduto;
    }
    if (valor){
      atualizacao.valor = valor;
    }
    if (descricao){
      atualizacao.descricao = descricao;
    }
    if (descricao == null){
      atualizacao.descricao = null;        
    }    
    await Produto.update(atualizacao, { where: { produtoId: produtoId, usuarioId: usuarioId } });
    const atualizado = await Produto.findOne({ where: { produtoId: produtoId, usuarioId: usuarioId } });
    await database.sync();
    return res.json(atualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
});

//Deletar um usuário
router.delete('/usuarios/:usuarioId', async (req, res) => {
  try {
    await database.sync();
    const { usuarioId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId);
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

// Rota para compra de um produto
router.put('/usuarios/:usuarioId/comprar/:produtoId', async (req, res) => {
  try {
    const { usuarioId, produtoId } = req.params;
    const { fornecedorId } = req.body;
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const produto = await usuario.comprarProduto(produtoId, fornecedorId);
    return res.json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao comprar o produto.' });
  }
});

// Rota para venda de um produto
router.put('/usuarios/:usuarioId/vender/:produtoId', async (req, res) => {
  try {
    const { usuarioId, produtoId } = req.params;
    const { compradorId } = req.body;
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const produto = await usuario.venderProduto(produtoId, compradorId);
    return res.json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao vender o produto.' });
  }
});

// Rota para exibir os produtos do usuário
router.get('/usuarios/:usuarioId/produtos', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const produtos = await usuario.mostrarProdutos();
    return res.json(produtos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao exibir os produtos do usuário.' });
  }
});

// Rota para descartar um produto pelo usuário
router.delete('/usuarios/:usuarioId/descartar/:produtoId', async (req, res) => {
  try {
    const { usuarioId, produtoId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const produto = await usuario.descartarProduto(produtoId);
    return res.json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao descartar o produto.' });
  }
});


module.exports = router;