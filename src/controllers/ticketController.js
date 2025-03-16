import TicketDAO from '../dao/daos/TicketDAO.js';
import TicketDTO from '../dtos/TicketDTO.js';
import { v4 as uuidv4 } from 'uuid'; // Generador de códigos únicos
import CartDAO from '../dao/daos/CartDAO.js';
import ProductDAO from '../dao/daos/ProductDAO.js';
import TicketRepository from '../dao/repositories/TicketRepository.js';

/**
 * Genera un ticket de compra basado en el contenido del carrito del usuario.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const generateTicket = async (req, res) => {
    try {
        const user = req.user;

        // Verificar si el carrito tiene productos
        const cart = await CartRepository.getCartByUserId(user._id);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío, no se puede generar un ticket." });
        }

        let totalAmount = 0;
        let purchasedProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product._id);
            if (!product || product.stock < item.quantity) continue;

            product.stock -= item.quantity;
            await ProductRepository.updateProduct(product._id, { stock: product.stock });

            purchasedProducts.push({
                product: product._id,
                quantity: item.quantity
            });

            totalAmount += product.price * item.quantity;
        }

        if (purchasedProducts.length === 0) {
            return res.status(400).json({ error: "No hay suficientes productos en stock para completar la compra." });
        }

        // ✅ Generar código único de ticket
        const ticketCode = `T-${Date.now()}`;
        const newTicket = await TicketRepository.createTicket({
            code: ticketCode,
            user: user._id,
            products: purchasedProducts,
            totalAmount,
            purchaseDate: new Date()
        });

        if (!newTicket || !newTicket._id) {
            throw new Error("Error al guardar el ticket en MongoDB");
        }

        // 🔹 Limpiar carrito después de la compra
        await CartRepository.clearCart(cart._id);

        return res.status(201).json({ message: "✅ Ticket generado con éxito", ticketId: newTicket._id });

    } catch (error) {
        console.error("❌ Error al generar ticket:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



/**
 * Obtiene un ticket por su ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        

        const ticket = await TicketRepository.getTicketById(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error("❌ Error al obtener el ticket:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};