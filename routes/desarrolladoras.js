const express = require('express');
const router = express.Router();
const { db, responderError } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Desarrolladora:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Nintendo"
 *         pais:
 *           type: string
 *           example: "Japón"
 *     DesarrolladoraInput:
 *       type: object
 *       required:
 *         - nombre
 *         - pais
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Nintendo"
 *         pais:
 *           type: string
 *           example: "Japón"
 */

/**
 * @swagger
 * tags:
 *   name: Desarrolladoras
 *   description: Empresas creadoras de videojuegos
 */

/**
 * @swagger
 * /api/desarrolladoras:
 *   get:
 *     summary: Obtiene todas las desarrolladoras
 *     tags: [Desarrolladoras]
 *     responses:
 *       200:
 *         description: Lista de desarrolladoras en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Desarrolladora'
 *       500:
 *         description: Error del servidor
 */
// GET: leer todos los registros
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM desarrolladoras ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        responderError(res, error, 'Error al consultar desarrolladoras');
    }
});

/**
 * @swagger
 * /api/desarrolladoras/{id}:
 *   get:
 *     summary: Obtiene la desarrolladora por su ID
 *     tags: [Desarrolladoras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la desarrolladora
 *         example: 1
 *     responses:
 *       200:
 *         description: Desarrolladora encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desarrolladora'
 *       404:
 *         description: No existe un registro con ese ID
 *       500:
 *         description: Error del servidor
 */
// GET por ID: leer un registro
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM desarrolladoras WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        responderError(res, error, 'Error al consultar la desarrolladora');
    }
});

/**
 * @swagger
 * /api/desarrolladoras:
 *   post:
 *     summary: Registra una nueva desarrolladora
 *     tags: [Desarrolladoras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesarrolladoraInput'
 *     responses:
 *       201:
 *         description: Registro creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desarrolladora'
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
        const { nombre, pais } = req.body;
        if (nombre == null || pais == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, pais' });
        }
        const query = 'INSERT INTO desarrolladoras (nombre, pais) VALUES ($1, $2) RETURNING *';
        const resultado = await db.query(query, [nombre, pais]);
        res.status(201).json({ mensaje: 'Registro creado con éxito', desarrolladora: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al guardar la desarrolladora');
    }
});

/**
 * @swagger
 * /api/desarrolladoras/{id}:
 *   put:
 *     summary: Actualiza la desarrolladora por su ID
 *     tags: [Desarrolladoras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la desarrolladora
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesarrolladoraInput'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Desarrolladora'
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
        const { nombre, pais } = req.body;
        if (nombre == null || pais == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, pais' });
        }
        const query = 'UPDATE desarrolladoras SET nombre = $1, pais = $2 WHERE id = $3 RETURNING *';
        const resultado = await db.query(query, [nombre, pais, id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro actualizado correctamente', desarrolladora: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al actualizar la desarrolladora');
    }
});

/**
 * @swagger
 * /api/desarrolladoras/{id}:
 *   delete:
 *     summary: Elimina la desarrolladora por su ID
 *     tags: [Desarrolladoras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la desarrolladora
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
        const resultado = await db.query('DELETE FROM desarrolladoras WHERE id = $1 RETURNING *', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro eliminado permanentemente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar la desarrolladora');
    }
});

module.exports = router;
