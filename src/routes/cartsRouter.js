import express from 'express';
import { 
    createCart, 
    getCartById, 
    addProductToCart, 
    removeProductFromCart, 
    checkoutCart, 
    getCartIdByUser, 
    getCartView, 
    finalizePurchase 
} from '../controllers/cartsController.js';
import { authenticateJWT } from '../middlewares/auth.js';
import UserRepository from '../dao/repositories/UserRepository.js';

const router = express.Router();

/**
 * @swagger
 * /api/carts/my-cart:
 *   get:
 *     summary: Obtiene el carrito del usuario autenticado
 *     description: Devuelve el ID del carrito asociado al usuario actualmente autenticado.
 *     responses:
 *       200:
 *         description: ID del carrito obtenido exitosamente.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: No se encontró un carrito para el usuario.
 */
router.get('/my-cart', authenticateJWT, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const user = await UserRepository.getUserById(req.user.id);
        if (!user || !user.cart) {
            return res.status(404).json({ error: "Carrito no encontrado para el usuario." });
        }

        res.json({ cartId: user.cart });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /api/carts/view:
 *   get:
 *     summary: Renderiza la vista del carrito del usuario autenticado
 *     description: Devuelve una página con la vista del carrito del usuario.
 *     responses:
 *       200:
 *         description: Vista del carrito obtenida correctamente.
 *       401:
 *         description: Usuario no autenticado.
 */
router.get('/view', authenticateJWT, getCartView);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crea un nuevo carrito
 *     description: Crea un carrito vacío en la base de datos.
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente.
 */
router.post('/', createCart);

/**
 * @swagger
 * /api/carts/{cid}:
 *   get:
 *     summary: Obtiene un carrito por ID
 *     description: Devuelve los detalles de un carrito específico.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente.
 *       404:
 *         description: Carrito no encontrado.
 */
router.get('/:cid', getCartById);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     description: Agrega un producto al carrito identificado por su ID.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente al carrito.
 *       404:
 *         description: Carrito o producto no encontrado.
 */
router.post('/:cid/product/:pid', addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Elimina un producto del carrito
 *     description: Remueve un producto específico de un carrito.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente del carrito.
 *       404:
 *         description: Producto o carrito no encontrado.
 */
router.delete('/:cid/product/:pid', removeProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}/checkout:
 *   post:
 *     summary: Realiza el checkout del carrito
 *     description: Procesa la compra del carrito, generando un ticket.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Checkout realizado con éxito.
 *       400:
 *         description: Error en el proceso de checkout.
 */
router.post('/:cid/checkout', checkoutCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finaliza la compra del carrito
 *     description: Genera el ticket de compra y vacía el carrito. Requiere autenticación.
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Carrito no encontrado.
 */
router.post('/:cid/purchase', authenticateJWT, finalizePurchase);

export default router;
