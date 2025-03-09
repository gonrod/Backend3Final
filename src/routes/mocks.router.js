import express from "express";
import { generateMocks } from "../controllers/mocksController.js";

const router = express.Router();

/**
 * @swagger
 * /api/mocks/{users}/{products}:
 *   post:
 *     summary: Genera datos de prueba
 *     description: Genera una cantidad específica de usuarios y productos ficticios en la base de datos.
 *     parameters:
 *       - in: path
 *         name: users
 *         required: true
 *         description: Cantidad de usuarios a generar
 *         schema:
 *           type: integer
 *       - in: path
 *         name: products
 *         required: true
 *         description: Cantidad de productos a generar
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Datos de prueba generados con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersCreated:
 *                   type: integer
 *                   description: Número de usuarios generados.
 *                 productsCreated:
 *                   type: integer
 *                   description: Número de productos generados.
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Lista de usuarios creados.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Lista de productos creados.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/:users/:products", generateMocks);

export default router;
