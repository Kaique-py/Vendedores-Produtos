const Sequelize = require('sequelize');
const express = require('express');
const router = require('./routers');

const app = express();


app.use(express.json())
app.use(router);

app.listen(8000, console.log('Servidor rodando.'));

module.exports = app;