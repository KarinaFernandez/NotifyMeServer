const express = require('express');
const Router = express.Router();

const Incidente = require('../schemas/incidente');

// CREAR INCIDENTE
Router.post('/incidente', function (req, res, next) {
    incidente = new Incidente(req.body);

    incidente.save(function (err, inc) {
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
            inc.titulo = undefined;
            inc.tipo = undefined;
            inc.imagenUrl = undefined;
            inc.longitud = undefined;
            inc.latitud = undefined;
            inc.fecha = undefined;
            res.json(inc);
        }
    });
});

module.exports = Router;
