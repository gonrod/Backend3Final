const express = require('express');
const { generateTicket } = require('../controllers/ticketController');
const { authenticateJWT } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Genera un ticket de compra
 *     description: Crea un ticket de compra basado en los productos dentro del carrito del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ticket generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketId:
 *                   type: string
 *                   description: ID del ticket generado.
 *                 totalAmount:
 *                   type: number
 *                   description: Monto total del ticket.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Lista de productos comprados.
 *       401:
 *         description: Usuario no autenticado.
 *       400:
 *         description: Error al generar el ticket.
 */
router.post('/', authenticateJWT, generateTicket);

module.exports = router;
