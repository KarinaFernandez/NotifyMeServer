const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioSchema = require('../schemas/usuario');
const Usuario = mongoose.model('Usuario', usuarioSchema);

// REGISTRO USUARIO
Router.post('/registro', function (req, res, next) {
    let { nombre, apellido, email, contraseña, admin } = req.body;
    let usuario = new Usuario({ nombre, apellido, email, contraseña: bcrypt.hashSync(contraseña, 10), admin });

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
            usr.__v = undefined;
            usr.contraseña = undefined;
            res.json({
                usuario: usr
            });
        }
    })
});

// LOGIN
Router.post('/login', function (req, res, next) {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (erro, usuarioDB) => {
        if (erro) {
            return res.status(500).json({
                err: erro
            })
        }
        // Verifica que exista un usuario con el mail escrita por el usuario.
        if (!usuarioDB) {
            return res.status(400).json({
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            })
        }
        // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
        if (!bcrypt.compare(body.contraseña, usuarioDB.contraseña)) {
            return res.status(400).json({
                err: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }
        // Genera el token de autenticación
        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED_AUTENTICACION, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })
        res.json({
            usuario: usuarioDB,
            token,
        })
    })
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

module.exports = Router;