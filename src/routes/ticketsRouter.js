import express from 'express';
import { generateTicket, getTicketById } from '../controllers/ticketController.js';
import { authenticateJWT } from '../middlewares/auth.js';

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

/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   get:
 *     summary: Obtiene un ticket por su ID
 *     description: Recupera la información de un ticket de compra específico por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ticket a recuperar.
 *     responses:
 *       200:
 *         description: Ticket encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID del ticket.
 *                 code:
 *                   type: string
 *                   description: Código único del ticket.
 *                 user:
 *                   type: string
 *                   description: ID del usuario que generó el ticket.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product:
 *                         type: string
 *                         description: ID del producto.
 *                       quantity:
 *                         type: integer
 *                         description: Cantidad comprada del producto.
 *                 totalAmount:
 *                   type: number
 *                   description: Monto total de la compra.
 *                 purchaseDate:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de la compra.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Ticket no encontrado.
 */
router.get('/:ticketId', authenticateJWT, getTicketById);

export default router;
