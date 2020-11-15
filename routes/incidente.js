const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();

const Incidente = mongoose.model('Incidente', require('../schemas/incidente'));

// CREAR INCIDENTE
Router.post('/incidentes', function (req, res, next) {
    Inc = new Incidente(req.body);

    Inc.save(function (err, inc) {
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
            // inc.__v = undefined;
            // res.json(inc);

            id = inc._id
            Query = Incidente.findById(id).populate('usuario', '-__v');
            Query.exec(function (err, inc) {
                if (!err) {
                    inc.__v = undefined;
                    res.json(inc);
                }
            });
        }
    });
});

// OBTENER TODOS LOS INCIDENTES
Router.get('/incidentes', function (req, res) {
    Query = Incidente.find({}).populate('usuario', '-__v');

    Query.exec(function (err, incidentes) {
        if (!err) {
            res.json(incidentes);
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

// OBTENER INCIDENTE por ID
Router.get('/incidentes/:id', function (req, res) {
    const id = req.params.id;
    Query = Incidente.findById(id)
    Query.exec(function (err, inc) {
        if (!err) {
            inc.__v = undefined;
            res.json(inc);
        }
    });
});

// ACTUALIZAR INCIDENTE (Validar / Deshabilitar)
Router.put('/incidentes/:id', function (req, res, next) {
    const id = req.params.id;
    Incidente.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, function (err, incidente) {
        if (!err) {
            if (incidente) {
                res.json(incidente)
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
