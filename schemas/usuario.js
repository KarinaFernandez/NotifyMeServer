const mongoose = require('mongoose');
const incidenteSchema = require('./incidente');
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
    },
    incidentes: [{
        type: Schema.Types.ObjectId,
        ref: 'Incidente'
    }],
    admin: {
        type: Boolean,
        default: false
    }
});

// elimina la key password del objeto que retorna al momento de crear un usuario
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.contraseña;
    delete userObject.__v;
    return userObject;
 }

module.exports = usuarioSchema;