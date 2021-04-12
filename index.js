"use strict";

var mongoose = require("mongoose");

var app = require('./app');

var port = 3900;

mongoose.Promise = global.Promise;

mongoose.set("useFindAndModify", false);

//conexion a mongobd

mongoose.connect("mongodb://localhost:27017/api_rest_blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("La  conexion a la base de datos se ha realizado de forma exitosa!");

    //crear el servidor u ponerme a escuchar peticiones  http

    app.listen(port, () => {
        console.log('Servidor corriendo en puerto: ' + port)
    })

  });
