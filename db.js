const { Pool, types } = require('pg');

// Formato de salida: DATE como texto 'AAAA-MM-DD' y NUMERIC (precios) como número
types.setTypeParser(1082, (valor) => valor);
types.setTypeParser(1700, (valor) => parseFloat(valor));

// Pool: administra las conexiones simultáneas a PostgreSQL
const db = new Pool({
    user: 'postgres',                      // Superusuario de pgAdmin
    host: 'localhost',                     // Servidor local
    database: 'tienda_videojuegos_db',     // Base de datos de este proyecto
    password: 'tu contraseña aqui',        // Reemplazar por tu contraseña real
    port: 5432                             // Puerto predeterminado de PostgreSQL
});

// Traduce los errores de PostgreSQL a respuestas HTTP claras
function responderError(res, error, mensajeBase) {
    console.error(error.message);
    if (error.code === '23505') {
        return res.status(409).json({ mensaje: 'Ya existe un registro con ese valor único (nickname, correo, código, etc.)' });
    }
    if (error.code === '23503') {
        return res.status(409).json({ mensaje: 'Llave foránea inválida: el registro relacionado no existe o hay registros que dependen de este' });
    }
    if (error.code === '23502' || error.code === '22P02' || error.code === '22007' || error.code === '23514') {
        return res.status(400).json({ mensaje: 'Datos con formato inválido o campos obligatorios vacíos' });
    }
    res.status(500).json({ mensaje: mensajeBase });
}

module.exports = { db, responderError };
