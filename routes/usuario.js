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
            res.json({ usuario: usr });
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
            res.json({ usr: doc });
        } else {
            next(new RestError('Usuario o Contraseña invalidos', 401));
        }
    });
});

// OBTENER USUARIO por ID
Router.get('/usuarios/:id', function (req, res) {
    const id = req.params.id;
    Query = Usuario.findById(id)
    Query.exec(function (err, usuario) {
        if (!err) {
            usuarios.contraseña = undefined
            res.json(usuario);
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


module.exports = Router;