const express = require('express');
const app = express();

app.get('/', function (request, response) {
    response.send('Taxi Driver');
});

app.listen(3000, function () {
    console.log('Escuchando puerto 3000');
});