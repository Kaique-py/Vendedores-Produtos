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

//Deletar produto
router.delete('/usuarios/:usuarioId/produtos/:produtoId', async (req, res) => {
  try {
    await database.sync();
    const { usuarioId, produtoId } = req.params;
    const usuario = await Usuario.findByPk(usuarioId);
    const produto = await Produto.findOne({where: { produtoId: produtoId, usuarioId: usuarioId } });
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

//ATÉ AQUI FUNCIONA PERFECTAMENTESSSS...

//Realizar compra/venda de um produto
router.put('/venda/:usuarioId/produtos/:produtoId', async (req, res) => {
  try { //No campo acima usuarioId vamos inserir o id de quem está vendendo o produto.
    await database.sync();
    const { usuarioId, produtoId } = req.params;
    const { novoDonoId } = req.body; //Aqui, no campo da requisição será o id do comprador.
    const usuario = await Usuario.findByPk(usuarioId)
    const produto = await Produto.findOne({where: { produtoId: produtoId, usuarioId: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ message: 'Vendedor não encontrado.' });
    }
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    const novoDono = await Usuario.findByPk(novoDonoId)
    if (!novoDono) {
      return res.status(404).json({ message: 'Comprador não encontrado.' });
    }
    produto.usuarioId = novoDonoId;
    await produto.save();
    await database.sync();
    return res.status(200).json( {message: "Venda realizada com sucesso."} );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
});

module.exports = router;