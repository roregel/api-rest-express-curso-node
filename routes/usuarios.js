const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id: 1, nombre: 'Raúl'},
    {id: 2, nombre: 'Pablo'},
    {id: 3, nombre: 'Ana'}
];

ruta.get('/', (req, res)=>{
    res.send(usuarios);
});

ruta.get('/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if (!usuario) { 
        es.status(404).send('El usuario no fue encontrado');
        return;
    }

    res.send(usuario);
});

ruta.post('/', (req, res)=>{

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

ruta.put('/:id', (req, res)=>{
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

ruta.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado2');
        return;
    }
    
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.status(200).send(usuario);
});

function existeUsuario(id) {
    return usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    return schema.validate({ nombre });

}

module.exports = ruta;