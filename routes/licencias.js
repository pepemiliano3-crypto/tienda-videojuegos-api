const express = require('express');
const router = express.Router();
const { db, responderError } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Licencia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fecha_compra:
 *           type: string
 *           format: date
 *           example: "2026-11-09"
 *         codigo_activacion:
 *           type: string
 *           example: "ABCD-1234-EFGH"
 *         usuario_id:
 *           type: integer
 *           example: 1
 *         videojuego_id:
 *           type: integer
 *           example: 1
 *     LicenciaInput:
 *       type: object
 *       required:
 *         - codigo_activacion
 *         - usuario_id
 *         - videojuego_id
 *       properties:
 *         fecha_compra:
 *           type: string
 *           format: date
 *           example: "2026-11-09"
 *         codigo_activacion:
 *           type: string
 *           example: "ABCD-1234-EFGH"
 *         usuario_id:
 *           type: integer
 *           example: 1
 *         videojuego_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Licencias
 *   description: Compras de videojuegos y sus códigos de activación
 */

/**
 * @swagger
 * /api/licencias:
 *   get:
 *     summary: Obtiene todas las licencias
 *     tags: [Licencias]
 *     responses:
 *       200:
 *         description: Lista de licencias en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Licencia'
 *       500:
 *         description: Error del servidor
 */
// GET: leer todos los registros
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM licencias ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        responderError(res, error, 'Error al consultar licencias');
    }
});

/**
 * @swagger
 * /api/licencias/{id}:
 *   get:
 *     summary: Obtiene la licencia por su ID
 *     tags: [Licencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la licencia
 *         example: 1
 *     responses:
 *       200:
 *         description: Licencia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Licencia'
 *       404:
 *         description: No existe un registro con ese ID
 *       500:
 *         description: Error del servidor
 */
// GET por ID: leer un registro
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM licencias WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        responderError(res, error, 'Error al consultar la licencia');
    }
});

/**
 * @swagger
 * /api/licencias:
 *   post:
 *     summary: Registra una nueva licencia
 *     tags: [Licencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LicenciaInput'
 *     responses:
 *       201:
 *         description: Registro creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Licencia'
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
        const { fecha_compra, codigo_activacion, usuario_id, videojuego_id } = req.body;
        if (codigo_activacion == null || usuario_id == null || videojuego_id == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: codigo_activacion, usuario_id, videojuego_id' });
        }
        const query = 'INSERT INTO licencias (fecha_compra, codigo_activacion, usuario_id, videojuego_id) VALUES (COALESCE($1, CURRENT_DATE), $2, $3, $4) RETURNING *';
        const resultado = await db.query(query, [fecha_compra, codigo_activacion, usuario_id, videojuego_id]);
        res.status(201).json({ mensaje: 'Registro creado con éxito', licencia: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al guardar la licencia');
    }
});

/**
 * @swagger
 * /api/licencias/{id}:
 *   put:
 *     summary: Actualiza la licencia por su ID
 *     tags: [Licencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la licencia
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LicenciaInput'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Licencia'
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
        const { fecha_compra, codigo_activacion, usuario_id, videojuego_id } = req.body;
        if (codigo_activacion == null || usuario_id == null || videojuego_id == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: codigo_activacion, usuario_id, videojuego_id' });
        }
        const query = 'UPDATE licencias SET fecha_compra = COALESCE($1, fecha_compra), codigo_activacion = $2, usuario_id = $3, videojuego_id = $4 WHERE id = $5 RETURNING *';
        const resultado = await db.query(query, [fecha_compra, codigo_activacion, usuario_id, videojuego_id, id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro actualizado correctamente', licencia: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al actualizar la licencia');
    }
});

/**
 * @swagger
 * /api/licencias/{id}:
 *   delete:
 *     summary: Elimina la licencia por su ID
 *     tags: [Licencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la licencia
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
        const resultado = await db.query('DELETE FROM licencias WHERE id = $1 RETURNING *', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro eliminado permanentemente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar la licencia');
    }
});

module.exports = router;
