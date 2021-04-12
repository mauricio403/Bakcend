'use strict'

var validator = require('validator');

var fs = require('fs');

var path = require('path');

var Article = require('../models/article');


var controller = {

    datosCurso: (req, res) => {
        return res.status(200).send({
            curso: 'Desarrollo de node',
            autor: "Mauricio Matango",
            edad: '21'
        })
    },

    test: (req, res) => {
        return res.status(200).send({
           article: params
        });
    },

    save: (req, res) => {

        //recoger los parametros por post

        var params = req.body;
        

        //validar datos(validator)

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch(err){
            return res.status(200).send({
                status: 'error',
                message: "Faltan datos por enviar"
            });
        }
        if (validate_title && validate_content){
          

            //crear el objeto a guardar

                var article = new Article();


            //asiganar valores

                article.title = params.title;
                article.content = params.content;
                article.image = null;

            //guardar el articulo

            article.save((err, articleStored)=>{

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: "Error al guardar el articulo"
                    });
                }
                //devlver una respuesta
                return res.status(200).send({
                    status: 'succesfull',
                    article: articleStored
                });
            })

            
            
        } else {
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son validos"
            });
        }

    },

    getArticles: (req, res) => {

        var query = Article.find()

        var last = req.params.last;

       if(last || last != undefined){
        query.limit(5);
       }
       
       // busqueda
        query.exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los datos"
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar"
                });
            }

            return res.status(200).send({
                status: 'succesfull',
                articles
            });
        })

    
    },

    getArticle: (req, res) => {
        // recoger el id de la url

        var articleId = req.params.id;

        //comporbar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: "No existe el articulo"
            });
        }

        //buscar el articulo

        Article.findById(articleId, (err, article) => {

            if(err || !article){
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los datos"
                });
            }
           
             //devolver en json

             return res.status(200).send({
                status: 'succesfull',
                article
            });
        })

    },

    update: (req, res) => {

        //recoger el id de la url

        var articleId = req.params.id;


        //recoger los datos que llegan por put

        var params = req.body;


        //validar los datos

        try{
            var validate_title =  !validator.isEmpty(params.title);
            var validate_content =  !validator.isEmpty(params.content);
        } catch(err){
            return res.status(500).send({
                status: 'error',
                message: "Faltan datos por enviar"
            });
        }

        if(validate_title && validate_content){

            // hacer un find and update
             Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdate) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al actualizar"
                    });
                }
                if(!articleUpdate){
                    return res.status(404).send({
                        status: 'error',
                        message: "No existe el articulo para actualizar"
                    });
                }

                //devolver la respuesta

                return res.status(200).send({
                    status: 'succesfull',
                    article: articleUpdate
                });

             });

        } else{
            return res.status(500).send({
                status: 'error',
                message: "La validacion no es correcto"
            });
        }
        
        
    },

    delete: (req, res) => {

        //recoger el id de la url

        var articleId = req.params.id;


        //hacer find and delete

        Article.findByIdAndDelete({_id: articleId}, (err, articleRemove) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la peticion de borrado"
                });
            }
            if( !articleRemove){
                return res.status(404).send({
                    status: 'error',
                    message: "No se ha borrado el articulo, apaz no existe"
                });
            }

            return res.status(200).send({
                status: 'succesfull',
                article: articleRemove
            });
        });
    },


    upload: (req, res) => {
        // configurar el modulo de connect-multiparty router/article.js(hecho)



        //recoger el ficher de la peticion

        var fileName = 'imagen no subida..';

        if(!req.files){
            return res.status(200).send({
                status: 'error',
                message: fileName
            });
        }

        //conseguir el nombre y la extencion del archivo

        var filePath = req.files.file0.path;
        var file_split = filePath.split('/');
        
        //nombre del archivo

        var file_name = file_split[2];
       
        //extencion del fichero

        var extencion_split = file_name.split('\.');

        var file_ext = extencion_split[1]
 
        //comporbar la extencion, solo imagenes y si no lo es borrar el fichero


        if(file_ext !='png' && file_ext !='jpeg'&& file_ext !='jpeg' && file_ext !='gif'){
            
            //borrar el archivo subido

            fs.unlink(filePath, (err)=> {
                return res.status(200).send({
                    status: 'error',
                    message: 'la extencion de la imagen no es valida'
                });
            })

        } else{

            var articleId = req.params.id;

            if(articleId){
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) => {

                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
             }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
             }
            // subir el archivo
            
        }
          // end upload file

    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
    },
    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }
            
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    }


};

//end controler

module.exports = controller;