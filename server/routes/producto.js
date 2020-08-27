const express = require('express');
const { verificaToken } = require('../middlewares/autentificacion');
const Producto = require('../models/producto');
const { response } = require('./categoria');

let app = express();

//===================
// obtener todos los productos
//=================

app.get('/producto', verificaToken, (req, res) => {
    // traer todos los productos
    // populate: con usuario y categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

//===================
// obtener solo un productos
//=================

app.get('/producto/:id', verificaToken, (req, res) => {
    // traer solo un producto
    // populate: con usuario y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'producto no encontrado'
                    }

                });
            }

            res.json({
                ok: true,
                producto: productoDB

            });
        });

});

//===================
// buscar producto
//=================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//===================
// Crear un producto
//=================

app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

//===================
// actualizar un producto
//=================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'EL ID NO EXISTE'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});


//===================
// actualizar un producto
//=================

app.delete('/producto/:id', verificaToken, (req, res) => {
    // cambiar el estado falso campo disponible

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            });


        });
    });
});

module.exports = app;