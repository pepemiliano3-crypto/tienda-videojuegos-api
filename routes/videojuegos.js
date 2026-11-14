const express = require('express');
const router = express.Router();
const { db, responderError } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Videojuego:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: "Super Mario Odyssey"
 *         genero:
 *           type: string
 *           example: "Plataformas"
 *         precio:
 *           type: number
 *           example: 1299.00
 *         desarrolladora_id:
 *           type: integer
 *           example: 1
 *     VideojuegoInput:
 *       type: object
 *       required:
 *         - titulo
 *         - genero
 *         - precio
 *         - desarrolladora_id
 *       properties:
 *         titulo:
 *           type: string
 *           example: "Super Mario Odyssey"
 *         genero:
 *           type: string
 *           example: "Plataformas"
 *         precio:
 *           type: number
 *           example: 1299.00
 *         desarrolladora_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Videojuegos
 *   description: Catálogo de videojuegos disponibles en la tienda
 */

/**
 * @swagger
 * /api/videojuegos:
 *   get:
 *     summary: Obtiene todos los videojuegos
 *     tags: [Videojuegos]
 *     responses:
 *       200:
 *         description: Lista de videojuegos en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Videojuego'
 *       500:
 *         description: Error del servidor
 */
// GET: leer todos los registros
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM videojuegos ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        responderError(res, error, 'Error al consultar videojuegos');
    }
});

/**
 * @swagger
 * /api/videojuegos/{id}:
 *   get:
 *     summary: Obtiene el videojuego por su ID
 *     tags: [Videojuegos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *         example: 1
 *     responses:
 *       200:
 *         description: Videojuego encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Videojuego'
 *       404:
 *         description: No existe un registro con ese ID
 *       500:
 *         description: Error del servidor
 */
// GET por ID: leer un registro
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM videojuegos WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        responderError(res, error, 'Error al consultar el videojuego');
    }
});

/**
 * @swagger
 * /api/videojuegos:
 *   post:
 *     summary: Registra un nuevo videojuego
 *     tags: [Videojuegos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideojuegoInput'
 *     responses:
 *       201:
 *         description: Registro creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Videojuego'
 *       400:
 *         description: Faltan campos obligatorios o tienen un formato inválido
 *       409:
 *         description: Valor duplicado o llave foránea inexistente
 *       500:
 *         description: Error del servidor
 */
// POST: crear un registro
router.post('/', async (req, res) => {
    try {
        const { titulo, genero, precio, desarrolladora_id } = req.body;
        if (titulo == null || genero == null || precio == null || desarrolladora_id == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: titulo, genero, precio, desarrolladora_id' });
        }
        const query = 'INSERT INTO videojuegos (titulo, genero, precio, desarrolladora_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const resultado = await db.query(query, [titulo, genero, precio, desarrolladora_id]);
        res.status(201).json({ mensaje: 'Registro creado con éxito', videojuego: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al guardar el videojuego');
    }
});

/**
 * @swagger
 * /api/videojuegos/{id}:
 *   put:
 *     summary: Actualiza el videojuego por su ID
 *     tags: [Videojuegos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideojuegoInput'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Videojuego'
 *       400:
 *         description: Faltan campos obligatorios o tienen un formato inválido
 *       404:
 *         description: No existe un registro con ese ID
 *       409:
 *         description: Valor duplicado o llave foránea inexistente
 *       500:
 *         description: Error del servidor
 */
// PUT: actualizar un registro por ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, genero, precio, desarrolladora_id } = req.body;
        if (titulo == null || genero == null || precio == null || desarrolladora_id == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: titulo, genero, precio, desarrolladora_id' });
        }
        const query = 'UPDATE videojuegos SET titulo = $1, genero = $2, precio = $3, desarrolladora_id = $4 WHERE id = $5 RETURNING *';
        const resultado = await db.query(query, [titulo, genero, precio, desarrolladora_id, id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro actualizado correctamente', videojuego: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al actualizar el videojuego');
    }
});

/**
 * @swagger
 * /api/videojuegos/{id}:
 *   delete:
 *     summary: Elimina el videojuego por su ID
 *     tags: [Videojuegos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *         example: 1
 *     responses:
 *       200:
 *         description: Registro eliminado permanentemente
 *       404:
 *         description: No existe un registro con ese ID
 *       409:
 *         description: No se puede eliminar porque tiene registros relacionados
 *       500:
 *         description: Error del servidor
 */
// DELETE: eliminar un registro por ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('DELETE FROM videojuegos WHERE id = $1 RETURNING *', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro eliminado permanentemente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar el videojuego');
    }
});

module.exports = router;
