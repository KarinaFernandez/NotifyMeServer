const express = require('express');
const app = express();
const RestError = require('./rest-error');

const incidente = require('./routes/incidente');

app.use(express.json());
app.use(incidente);

app.use((err,req,res,next) => {
    res.status(err instanceof RestError? err.status: 500);
    res.json({error:err.message});
});

app.listen(3000, function () {
    console.log('Escuchando puerto 3000');
});
