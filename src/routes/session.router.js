import express from 'express';
import { 
    postLogin, 
    getCurrentSession, 
    registerUser, 
    requestPasswordReset, 
    resetPassword 
} from '../controllers/sessionController.js';

import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js';
import UserDTO from '../dtos/UserDTO.js';

const router = express.Router();

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Inicia sesión
 *     description: Permite a un usuario autenticarse en el sistema.
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales incorrectas.
 */
router.post('/', postLogin);

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea una nueva cuenta de usuario en la base de datos.
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Error en la solicitud de registro.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtiene la sesión actual del usuario autenticado
 *     description: Devuelve los datos del usuario autenticado en la sesión en formato DTO.
 *     responses:
 *       200:
 *         description: Información de sesión obtenida correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/current', authenticateJWT, (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        const userDTO = new UserDTO(req.user); // ✅ Convertimos el usuario a DTO
        res.json({ user: userDTO }); // 🔄 Retornamos solo la info necesaria
    } catch (error) {
        console.error("❌ Error en /current:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

/**
 * @swagger
 * /api/sessions/reset-password/{token}:
 *   post:
 *     summary: Restablece la contraseña del usuario
 *     description: Permite al usuario establecer una nueva contraseña usando un token de recuperación.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de contraseña
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente.
 *       400:
 *         description: Token inválido o expirado.
 */
router.post('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /api/sessions/forgot-password:
 *   post:
 *     summary: Solicita recuperación de contraseña
 *     description: Envia un enlace de recuperación al email del usuario.
 *     responses:
 *       200:
 *         description: Email de recuperación enviado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 */
router.post('/forgot-password', requestPasswordReset);

/**
 * @swagger
 * /api/sessions/forgot-password:
 *   get:
 *     summary: Renderiza la página de recuperación de contraseña
 *     description: Devuelve la vista Handlebars para que el usuario pueda ingresar su email y solicitar una recuperación de contraseña.
 *     responses:
 *       200:
 *         description: Vista de recuperación de contraseña cargada correctamente.
 */
router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword");
});

/**
 * @swagger
 * /api/sessions/admin-catalog:
 *   get:
 *     summary: Renderiza el catálogo de administrador
 *     description: Devuelve la vista del catálogo de productos en tiempo real. Solo accesible por administradores.
 *     responses:
 *       200:
 *         description: Catálogo de administrador cargado correctamente.
 *       403:
 *         description: Acceso denegado.
 */
router.get('/admin-catalog', authenticateJWT, authorizeRoles("admin"), (req, res) => res.render('realTimeProducts'));

/**
 * @swagger
 * /api/sessions/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     description: Elimina la cookie de autenticación y destruye la sesión del usuario.
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 *       500:
 *         description: Error al cerrar sesión.
 */

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('tokenCookie'); // Elimina el JWT almacenado en cookies
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al cerrar sesión:", err);
                return res.status(500).json({ error: "Error al cerrar sesión" });
            }
            return res.status(200).json({ message: "Sesión cerrada exitosamente" });
        });
    } catch (error) {
        console.error("Error en logout:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});



export default router;
