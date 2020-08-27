const express = require('express');
const Categoria = require('../models/categoria');
//const _ = require('underscore'); // standar para ocupar underscore es co guion 
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentificacion');

let app = express();



//================================
//mostrar todas las categorias
//================================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // con el populete rescato informacion de otra tabla 

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email') //primer parametro la tabla segun parametros los campos que quiero mostrar
        .exec((err, categoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria

            });
        });
});


//================================
//mostrar categorias por ID
//================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findBYID(............);

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }

            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB

        });

    });
});

//================================
//Crear nueva Categoria me salio weno
//================================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria

    let body = req.body;
    //let idusuario   = req.usuario.id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }
        // valido si se crea la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB

        });

    });
});


//================================
//actualizar Categoria
//================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    // actualizar la descripcion de la categoria

    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion']);
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


//================================
//eliminar Categoria
//================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    // solo un administrado puede borrar la categoria
    // categori.findByidAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });

    });

});


module.exports = app;