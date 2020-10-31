const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'requerido'],
        maxlength: [35, 'máximo 35 caracteres']
    },
    apellido: {
        type: String,
        required: [true, 'requerido'],
        maxlength: [40, 'máximo 40 caracteres']
    },
    email: {
        type: String,
        required: [true, 'requerido'],
        unique: true,
        index: true,
        match: [/\S+@\S+\.\S+/, 'email invalido'],
    },
    contraseña: {
        type: String,
        required: [true, 'requerido']
    },
    activo: {
        type: Boolean,
        default: true
    }
    ,
    incidentes: [{
        type: Schema.Types.ObjectId,
        ref: 'Incidente'
    }],
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = usuarioSchema;