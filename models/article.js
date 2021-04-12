'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var atricleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

module.exports = mongoose.model('Article', atricleSchema);

//articles --. GUARDA DOCUEMNTOS DE ESTE TIPO Y CON ESTA ESTRUCTURA DENTRO DE LA COLECCION