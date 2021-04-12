'use strict'

//cargar modulos de node para crear el servidor

var express = require('express');

var bodyParser = require('body-parser')


//ejecutar express

var app = express();

//cargar las rutas

 var article_routes = require("./routes/article");

//cargar midelwares


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

//cargar el cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// añadir prefijos a rutas / cargar rutas

app.use('/api', article_routes);



//exportar modulo (fichero actual)

module.exports = app;