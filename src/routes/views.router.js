import express from 'express';
import { renderCatalog } from "../controllers/productsController.js";
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Redirige a la vista correcta según el rol del usuario
 *     description: Si el usuario no está autenticado, lo redirige a `/login`. Si es admin, lo redirige a `/admin-catalog`. Si es usuario normal, lo envía a `/catalog`.
 *     responses:
 *       302:
 *         description: Redirección a la vista correspondiente.
 */
router.get('/', authenticateJWT, (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    if (req.user.role === 'admin') {
        return res.redirect('/admin-catalog');
    }
    return res.redirect('/catalog');
});

/**
 * @swagger
 * /catalog:
 *   get:
 *     summary: Renderiza el catálogo de productos
 *     description: Devuelve la vista del catálogo con los productos disponibles.
 *     responses:
 *       200:
 *         description: Vista de catálogo cargada correctamente.
 */
router.get('/catalog', renderCatalog);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Renderiza la página de inicio de sesión
 *     description: Devuelve la vista de login para los usuarios.
 *     responses:
 *       200:
 *         description: Página de login cargada correctamente.
 */
router.get('/login', (req, res) => res.render('login'));

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Renderiza la página de registro de usuarios
 *     description: Devuelve la vista de registro para nuevos usuarios.
 *     responses:
 *       200:
 *         description: Página de registro cargada correctamente.
 */
router.get('/register', (req, res) => res.render('register'));

/**
 * @swagger
 * /forgot-password:
 *   get:
 *     summary: Renderiza la página de recuperación de contraseña
 *     description: Devuelve la vista donde el usuario puede solicitar un restablecimiento de contraseña.
 *     responses:
 *       200:
 *         description: Página de recuperación de contraseña cargada correctamente.
 */
router.get('/forgot-password', (req, res) => res.render('forgotPassword'));

/**
 * @swagger
 * /reset-password/{token}:
 *   get:
 *     summary: Renderiza la página para restablecer la contraseña
 *     description: Devuelve la vista donde el usuario puede ingresar una nueva contraseña usando un token de recuperación.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de contraseña
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Página de restablecimiento de contraseña cargada correctamente.
 */
router.get('/reset-password/:token', (req, res) => {
    res.render('resetPassword', { token: req.params.token });
});

/**
 * @swagger
 * /admin-catalog:
 *   get:
 *     summary: Renderiza la vista de administración de productos
 *     description: Devuelve la vista donde los administradores pueden gestionar productos en tiempo real.
 *     responses:
 *       200:
 *         description: Vista de administración cargada correctamente.
 *       403:
 *         description: Acceso denegado si el usuario no es administrador.
 */
router.get('/admin-catalog', authenticateJWT, authorizeRoles("admin"), (req, res) => {
    res.render('realTimeProducts');
});

export default router;
