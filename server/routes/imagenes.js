const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificatokenImg } = require('../middlewares/autentificacion');

let app = express();

app.get('/imagen/:tipo/:img', verificatokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    //let pathImg = `./uploads/${ tipo }/${ img }`;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);

    } else {
        let noImagenpath = path.resolve(__dirname, '../assets/no-image.jpg');

        res.sendFile(noImagenpath);

    }



});

module.exports = app;