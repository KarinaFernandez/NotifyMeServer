const mongoose  = require('mongoose'); 
const Schema    = mongoose.Schema;

const incidenteSchema = new Schema({
    titulo: {
        type: String,
        required: [true,'Titulo requerido'],
    },
    tipo: {
        type: String,
        required: [true,'Tipo requerido'],
    },
    imagenUrl: {
        type: String
    },
    longitud: {
        type: String,
        required: [true,'Longitud requerida'],
    },
    latitud: {
        type: String,
        required: [true,'Latitud requerida'],
    },
    fecha: {
        type: Date,
        required: [true,'Fecha requerida'],
        validate: {
            validator : function(value){
                return value < Date.now();
            },
            message: props => `${props.value} la fecha no es valida. Fecha menor a fecha actual`
        }

    }
});

module.exports = incidenteSchema;