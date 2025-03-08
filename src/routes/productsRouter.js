const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById,
    renderCatalog,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    generateTestProducts, 
    deleteAllProducts 
} = require('../controllers/productsController');

const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Devuelve una lista de productos disponibles en la base de datos.
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente.
 */
router.get('/', authenticateJWT, authorizeRoles("admin", "user"), renderCatalog);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     description: Devuelve los detalles de un producto específico.
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *       404:
 *         description: Producto no encontrado.
 */
router.get('/:pid', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto
 *     description: Agrega un nuevo producto a la base de datos. Solo disponible para administradores.
 *     responses:
 *       201:
 *         description: Producto creado exitosamente.
 *       403:
 *         description: No autorizado.
 */
router.post('/', authenticateJWT, authorizeRoles("admin"), addProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualiza un producto
 *     description: Modifica los detalles de un producto existente. Solo disponible para administradores.
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Producto no encontrado.
 */
router.put('/:pid', authenticateJWT, authorizeRoles("admin"), updateProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Elimina un producto
 *     description: Borra un producto específico de la base de datos. Solo disponible para administradores.
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *       403:
 *         description: No autorizado.
 *       404:
 *         description: Producto no encontrado.
 */
router.delete('/:pid', authenticateJWT, authorizeRoles("admin"), deleteProduct);

/**
 * @swagger
 * /api/products/generate:
 *   post:
 *     summary: Genera productos de prueba
 *     description: Crea productos ficticios para pruebas. Solo disponible para administradores.
 *     responses:
 *       201:
 *         description: Productos de prueba generados exitosamente.
 *       403:
 *         description: No autorizado.
 */
router.post('/generate', authenticateJWT, authorizeRoles("admin"), generateTestProducts);

/**
 * @swagger
 * /api/products/deleteAll:
 *   delete:
 *     summary: Elimina todos los productos
 *     description: Borra todos los productos de la base de datos. Solo disponible para administradores.
 *     responses:
 *       200:
 *         description: Todos los productos fueron eliminados.
 *       403:
 *         description: No autorizado.
 */
router.delete('/deleteAll', authenticateJWT, authorizeRoles("admin"), deleteAllProducts);

module.exports = router;
