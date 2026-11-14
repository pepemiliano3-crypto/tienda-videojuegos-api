const express = require('express');
const router = express.Router();
const { db, responderError } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nickname:
 *           type: string
 *           example: "GamerPro99"
 *         correo:
 *           type: string
 *           example: "gamerpro99@correo.com"
 *         fecha_registro:
 *           type: string
 *           format: date
 *           example: "2026-11-09"
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nickname
 *         - correo
 *       properties:
 *         nickname:
 *           type: string
 *           example: "GamerPro99"
 *         correo:
 *           type: string
 *           example: "gamerpro99@correo.com"
 *         fecha_registro:
 *           type: string
 *           format: date
 *           example: "2026-11-09"
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Usuarios registrados en la tienda
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios en formato JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error del servidor
 */
// GET: leer todos los registros
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM usuarios ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        responderError(res, error, 'Error al consultar usuarios');
    }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene el usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: No existe un registro con ese ID
 *       500:
 *         description: Error del servidor
 */
// GET por ID: leer un registro
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        responderError(res, error, 'Error al consultar el usuario');
    }
});

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Registro creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
        const { nickname, correo, fecha_registro } = req.body;
        if (nickname == null || correo == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nickname, correo' });
        }
        const query = 'INSERT INTO usuarios (nickname, correo, fecha_registro) VALUES ($1, $2, COALESCE($3, CURRENT_DATE)) RETURNING *';
        const resultado = await db.query(query, [nickname, correo, fecha_registro]);
        res.status(201).json({ mensaje: 'Registro creado con éxito', usuario: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al guardar el usuario');
    }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza el usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
        const { nickname, correo, fecha_registro } = req.body;
        if (nickname == null || correo == null) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nickname, correo' });
        }
        const query = 'UPDATE usuarios SET nickname = $1, correo = $2, fecha_registro = COALESCE($3, fecha_registro) WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [nickname, correo, fecha_registro, id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro actualizado correctamente', usuario: resultado.rows[0] });
    } catch (error) {
        responderError(res, error, 'Error al actualizar el usuario');
    }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina el usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
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
        const resultado = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No existe un registro con ese ID' });
        }
        res.status(200).json({ mensaje: 'Registro eliminado permanentemente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar el usuario');
    }
});

module.exports = router;
