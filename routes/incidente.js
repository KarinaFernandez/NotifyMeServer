const express = require('express');
const mongoose = require('mongoose');
const RestError = require('../rest-error');
const Router = express.Router();

const incidenteSchema = require('../schemas/incidente');
const incidente = mongoose.model('Incidente', incidenteSchema);

// CREAR INCIDENTE
Router.post('/incidentes', function (req, res, next) {
    Inc = new incidente(req.body);

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
            inc.__v = undefined;
            res.json(inc);
        }
    });
});

// OBTENER TODOS LOS INCIDENTES
Router.get('/incidentes', function (req, res) {
    incidente
        .find({})
        .populate('usuario')
        .exec((err, inc) => {
            if (err) return handleError(err);
            return inc
        });


    // incidente.find({}, (err, incidentes) =>
    //     res.send(incidentes.reduce((incidenteMap, inc) => {
    //         inc.__v = undefined;
    //         incidenteMap[inc.id] = inc
    //         return incidenteMap
    //     }, {})),
    // )
});

// OBTENER INCIDENTE por ID
Router.get('/incidentes/:id', function (req, res) {
    const id = req.params.id;
    Query = incidente.findById(id)
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
    incidente.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, function (err, incidente) {
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
