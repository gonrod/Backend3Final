import TicketDAO from '../dao/daos/TicketDAO.js';
import TicketDTO from '../dtos/TicketDTO.js';
import { v4 as uuidv4 } from 'uuid'; // Generador de códigos únicos
import CartDAO from '../dao/daos/CartDAO.js';
import ProductDAO from '../dao/daos/ProductDAO.js';

/**
 * Genera un ticket de compra basado en el contenido del carrito del usuario.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const generateTicket = async (req, res) => {
    try {
        const { userId, cartId } = req.body;

        // Obtener el carrito del usuario
        const cart = await CartDAO.getCartById(cartId);
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        let totalAmount = 0;
        let purchasedProducts = [];

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                totalAmount += item.product.price * item.quantity;
                purchasedProducts.push({ product: item.product._id, quantity: item.quantity });

                // Actualizar stock del producto
                await ProductDAO.updateProduct(item.product._id, { stock: item.product.stock - item.quantity });
            } else {
                return res.status(400).json({ error: `Stock insuficiente para ${item.product.title}` });
            }
        }

        // Crear el ticket usando DAO
        const newTicket = await TicketDAO.createTicket({
            code: uuidv4(),
            user: userId,
            products: purchasedProducts,
            totalAmount
        });

        res.json({ message: "Compra realizada con éxito", ticket: new TicketDTO(newTicket) });

    } catch (error) {
        console.error("❌ Error generando ticket:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
