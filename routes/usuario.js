const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();

const usuarioSchema = require('../schemas/usuario');
const usuario = mongoose.model('Usuario', usuarioSchema);

// CREAR USUARIO
Router.post('/usuarios', function (req, res, next) {
    Usr = new usuario(req.body);
    
    Usr.save(function (err, usuario) {
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
            usuario.__v = undefined;
            usuario.contraseña = undefined;
            res.json(usuario);
        }
    });
});

module.exports = Router;