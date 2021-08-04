const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const Joi = require('joi');
const morgan = require('morgan');
const config = require('config');

const app = express();

const logger = require('./logger')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

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

const usuarios = [
    {id: 1, nombre: 'Raúl'},
    {id: 2, nombre: 'Pablo'},
    {id: 3, nombre: 'Ana'}
];

app.get('/', (req, res)=>{
    res.send('Hola mundo desde Express.');
});

app.get('/api/usuarios', (req, res)=>{
    res.send(usuarios)
});

app.get('/api/usuarios/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if (!usuario) { 
        es.status(404).send('El usuario no fue encontrado');
        return;
    }

    res.send(usuario);
});

app.post('/api/usuarios', (req, res)=>{

    const { error, value } = validarUsuario(req.body.nombre);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
    
        usuarios.push(usuario);
        res.send(usuario);
        return;
    }

    res.status(400).send(error.details[0].message);
});

app.put('/api/usuarios/:id', (req, res)=>{
    // Encontrar si existe el objeto usuario
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    usuario.nombre = value.nombre;

    res.send(usuario);

});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado2');
        return;
    }
    
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.status(200).send(usuario);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})

function existeUsuario(id) {
    return usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    return schema.validate({ nombre });

}