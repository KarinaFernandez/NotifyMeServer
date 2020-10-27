const express = require('express');
const app = express();
const RestError = require('./rest-error');
const mongoose = require('mongoose'); 

const incidente = require('./routes/incidente');

//require('dotenv').config(); 

// Conectar a DB local
const uri = 'mongodb://localhost:27017/db';
const options = {useUnifiedTopology:true, useNewUrlParser:true};
mongoose.connect(uri,options); 

/*
const uri = process.env.MONGODB_URI;
const options = {useNewUrlParser:true, useUnifiedTopology: true}; 
*/

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
app.use(incidente);

app.use((err,req,res,next) => {
    res.status(err instanceof RestError? err.status: 500);
    res.json({error:err.message});
});

app.listen(3000, function () {
    console.log('Escuchando puerto 3000');
})

// app.listen(process.env.PORT, function(){
//     console.log(`Escuchando puerto ${process.env.PORT}`);
// });
