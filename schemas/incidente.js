const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incidenteSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'Titulo requerido'],
    },
    tipo: {
        type: String,
        required: [true, 'Tipo requerido'],
    },
    imagenUrl: {
        type: String
    },
    longitud: {
        type: String,
        required: [true, 'Longitud requerida'],
    },
    latitud: {
        type: String,
        required: [true, 'Latitud requerida'],
    },
    fecha: {
        type: Date,
        required: [true, 'Fecha requerida']
    },
    validado: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: props => `Llego al minimo de validaciones para un incidente`
        }
    },
    habilitado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Usuario requerido']
    }
});

module.exports = incidenteSchema;