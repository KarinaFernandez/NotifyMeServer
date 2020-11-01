const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const conn = mongoose.connection;


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
    let body = req.body;
    // Usuario.findOne({ email: body.email }, (erro, usr) => {
    //     if (erro) {
    //         return res.status(500).json({
    //             err: erro
    //         })
    //     }
    //     // Verifica que exista un usuario con el mail escrita por el usuario.
    //     if (!usr) {
    //         return res.status(400).json({
    //             err: {
    //                 message: "Usuario o contraseña incorrectos"
    //             }
    //         })
    //     }
    //     // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
    //     if (!bcrypt.compare(body.contraseña, usr.contraseña)) {
    //         return res.status(400).json({
    //             err: {
    //                 message: "Usuario o contraseña incorrectos"
    //             }
    //         });
    //     }
    //     // Genera el token de autenticación
    //     let token = jwt.sign({
    //         usuario: usr,
    //     }, process.env.SEED_AUTENTICACION, {
    //         expiresIn: process.env.CADUCIDAD_TOKEN
    //     })
    //     res.json({
    //         usuario: usr,
    //         token,
    //     })
    // })
    const email = req.body.email;
    let  contraseña = req.body.contraseña;
    contraseña = crypto.createHash('sha256').update(contraseña).digest('hex');

    conn.db.collection('usuarios', function (err, collection) {
        collection.findOne({email:email, contraseña:contraseña}, function(err, doc){
            if(doc){
           //     const token = jwt.sign(doc.usr, process.env.TOKEN_SECRET);
                doc.contraseña = undefined;
                // doc.token = token;
                res.json({usr:doc});
            }
            else{
                next(new RestError('Usuario o Contraseña invalidos', 401));
            }
        });
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

module.exports = Router;