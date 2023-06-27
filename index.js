(async () => {

    const database = require('./db');
    const Produto = require('./models/produto');
    const Usuario = require('./models/usuario');
    await database.sync();
})();