import Cart from '../models/Cart.js';

/**
 * Data Access Object (DAO) for Cart operations.
 */
class CartDAO {
    /**
     * Retrieves a cart by ID and populates product details.
     * @param {string} cartId - The ID of the cart.
     * @returns {Promise<Object>} The cart object.
     */
    async getCartById(cartId) {
        try {
            return await Cart.findById(cartId).populate('products.product');
        } catch (error) {
            console.error("❌ Error obteniendo el carrito:", error);
            throw error;
        }
    }

    /**
     * Creates a new cart for a user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Object>} The newly created cart.
     */
    async createCart(userId) {
        try {
            const newCart = new Cart({ user: userId, products: [] });
            return await newCart.save();
        } catch (error) {
            console.error("❌ Error creando el carrito:", error);
            throw error;
        }
    }

    /**
     * Adds a product to a cart, updating the quantity if it already exists.
     * @param {string} cartId - The ID of the cart.
     * @param {string} productId - The ID of the product.
     * @param {number} quantity - The quantity to add.
     * @returns {Promise<Object>} The updated cart.
     */
    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            console.error("❌ Error agregando producto al carrito:", error);
            throw error;
        }
    }

    /**
     * Removes a product from a cart.
     * @param {string} cartId - The ID of the cart.
     * @param {string} productId - The ID of the product.
     * @returns {Promise<Object>} The updated cart.
     */
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            return await cart.save();
        } catch (error) {
            console.error("❌ Error eliminando producto del carrito:", error);
            throw error;
        }
    }
}

export default new CartDAO();
