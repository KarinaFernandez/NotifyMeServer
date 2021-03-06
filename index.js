const express = require('express');
const app = express();
const RestError = require('./rest-error');
const mongoose = require('mongoose'); 
var cors = require('cors');

const usuario = require('./routes/usuario');
const incidente = require('./routes/incidente');

require('dotenv').config(); 

// Conectar a DB local
// const uri = 'mongodb://localhost:27017/incidentes';
// const options = {useUnifiedTopology:true, useNewUrlParser:true};
// mongoose.connect(uri,options); 

const uri = process.env.MONGODB_URI;
const options = {useNewUrlParser:true, useUnifiedTopology: true}; 

//Evento
mongoose.connect(uri, options).catch(error => {
    console.log('Hubo un error de conexión', error.message);
}); 

const conn = mongoose.connection;
//Error de conexion
mongoose.connection.on('error', error => {
    console.log('Hubo un error de conexión', error.message);
}); 

app.use(express.json());
app.use(cors());
app.use(incidente);
app.use(usuario);

app.use((err,req,res,next) => {
    res.status(err instanceof RestError? err.status: 500);
    res.json({error:err.message});
});


process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION ||  'este-es-el-seed-desarrollo';

/* Levanta Local
app.listen(3000, function () {
    console.log('Escuchando puerto 3000');
})
*/

app.listen(process.env.PORT, function(){
    console.log(`Escuchando puerto ${process.env.PORT}`);
});
