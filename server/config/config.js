//=======================
//   puerto
//========================

process.env.PORT = process.env.PORT || 3000;


//==========================================================================
// Entorno
//==========================================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//==========================================================================
// Fecha Vencimiento
//==========================================================================
// 60 segunoos
// 60 minutos
// 24 horas 
// 30 dias

//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';


//==========================================================================
// SEDD de autentificacion
//==========================================================================

process.env.SEED = process.env.SEED || 'este-es-el-sedd-desarrollo';

//==========================================================================
// Base datos 
//==========================================================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================================================================
//google client id
//==========================================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '945163453386-ep9oatj4nae8e24ctsl65439h2l85tm3.apps.googleusercontent.com';