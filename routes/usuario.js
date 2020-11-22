const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const usuarioSchema = require('../schemas/usuario');
const Usuario = mongoose.model('Usuario', usuarioSchema);

// REGISTRO USUARIO
Router.post('/registro', function (req, res, next) {
    let { nombre, apellido, email, contraseña, admin } = req.body;

    let contra = req.body.contraseña;
    contra = crypto.createHash('sha256').update(contra).digest('hex');

    let usuario = new Usuario({ nombre, apellido, email, contraseña: contra, admin });

    usuario.save((err, usr) => {
        if (err) {
            if (err.code == 11000) {
                next(new RestError(err.message, 409));
            } else {
                errors = {};
                for (const key in err.errors) {
                    if (err.errors[key].constructor.name != 'ValidationError') {
                        errors[key] = err.errors[key].message;
                    }
                }
                next(new RestError(errors, 400));
            }
        } else {
            res.json( usr );
        }
    })
});

// LOGIN
Router.post('/login', function (req, res, next) {
    const email = req.body.email;
    let contraseña = req.body.contraseña;
    contraseña = crypto.createHash('sha256').update(contraseña).digest('hex');

    Usuario.findOne({ email: email, contraseña: contraseña }, function (err, doc) {
        if (doc) {
            res.json(doc);
        } else {
            next(new RestError('Usuario o Contraseña invalidos', 401));
        }
    });
});

// OBTENER TODOS LOS USUARIOS
Router.get('/usuarios', function (req, res) {
    Query = Usuario.find({});
    Query.exec(function (err, usuarios) {
        if (!err) {
            res.json(usuarios);
        } else {
            errors = {};
            for (const key in err.errors) {
                if (err.errors[key].constructor.name != 'ValidationError') {
                    errors[key] = err.errors[key].message;
                }
            }
            next(new RestError(errors, 400));
        }
    })
});

// OBTENER USUARIO por ID
Router.get('/usuarios/:id', function (req, res) {
    const id = req.params.id;
    Query = Usuario.findById(id)
    Query.exec(function (err, usr) {
        if (!err) {
            usr.__v = undefined;
            res.json(usr);
        }
    });
});
 
// ACTUALIZAR USUARIO (Desactivar)
Router.put('/usuarios/:id', function (req, res, next) {
    const id = req.params.id;
    Usuario.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, function (err, usuario) {
        if (!err) {
            if (usuario) {
                res.json(usuario)
            } else {
                next(new RestError('recurso no encontrado', 404));
            }
        } else {
            if (err.code == 11000) {
                next(new RestError(err.message, 409));
            } else {
                errors = {};
                for (const key in err.errors) {
                    if (err.errors[key].constructor.name != 'ValidationError') {
                        errors[key] = err.errors[key].message;
                    }
                }
                next(new RestError(errors, 400));
            }
        }
    });
});

// OBTENER INCIDENTES DE UN USUARIO
Router.get('/incidentes/usuarios', function (req, res, next) {
    const id = req.query.id;
    Query = Usuario.findById(id).populate('incidentes', '-__v')

    Query.exec(function (err, usuario) {
        if (!err) {
            res.json(usuario);
        } else {
            errors = {};
            for (const key in err.errors) {
                if (err.errors[key].constructor.name != 'ValidationError') {
                    errors[key] = err.errors[key].message;
                }
            }
            next(new RestError(errors, 400));
        }
    });
});

module.exports = Router;