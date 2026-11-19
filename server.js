const app = require('./app');
const bd = require('./config/bd');

bd.sync()
    .then(() => {
        console.log('Banco sincronizado');

        app.listen(3000, () => {
            console.log('Servidor na porta 3000');
        });
    })
    .catch(console.error);