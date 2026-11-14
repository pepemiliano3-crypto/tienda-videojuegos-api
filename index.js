// ==================== 1. DEPENDENCIAS ====================
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// ==================== 2. CONFIGURACIÓN DE LA APP ====================
const app = express();
app.use(cors());           // Permite peticiones desde otros orígenes (frontend)
app.use(express.json());   // Convierte el JSON recibido en objetos JavaScript (req.body)

// ==================== 3. CONFIGURACIÓN DE SWAGGER ====================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de la Tienda Digital de Videojuegos',
            version: '1.0.0',
            description: 'API REST para gestionar el catálogo de videojuegos, desarrolladoras, usuarios y licencias (compras con código de activación) de una tienda digital.'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor local de desarrollo' }
        ]
    },
    apis: ['./routes/*.js']    // Archivos donde están los comentarios @swagger
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== 4. RUTAS (una por tabla) ====================
app.use('/api/desarrolladoras', require('./routes/desarrolladoras'));
app.use('/api/videojuegos', require('./routes/videojuegos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/licencias', require('./routes/licencias'));

// La raíz redirige a la documentación
app.get('/', (req, res) => res.redirect('/api-docs'));

// ==================== 5. ENCENDER EL SERVIDOR ====================
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    console.log(`Documentación Swagger en http://localhost:${PUERTO}/api-docs`);
});
