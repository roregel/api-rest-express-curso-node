const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const Joi = require('joi');
const morgan = require('morgan');
const config = require('config');
const usuarios = require('./routes/usuarios');

const app = express();

const logger = require('./logger')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

// Configuraciòn de entornos
console.log('Aplicación: ', config.get("nombre"));
console.log('DB server: ', config.get("configDB.host"));

// Uso de middleware de tercero - Morgan
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado...');
    inicioDebug('Morgan habilitado...');
}

// Trabajos con la base de datos
dbDebug('Conectando con la db...');
// app.use(logger);

// app.use(function (req, res, next) {
//     console.log('Autenticando...');
//     next();
// });

app.get('/', (req, res)=>{
    res.send('Hola mundo desde Express.');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});