import express from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import UserModel from "../dao/models/User.js";
import logger from "../utils/loggerUtils.js"; 

const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next(); // ✅ Allow access if session exists
    } else {
        handleAuthError(req, res);
    }
};

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/perfil'); // ✅ Redirect to profile if logged in
    } else {
        next(); // ✅ Allow access if no session exists
    }
};

const authenticateJWT = async (req, res, next) => {
    try {
        const token = req.cookies.tokenCookie;
        if (!token) {
            return handleAuthError(req, res);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            logger.error(`❌ JWT Authentication error: Usuario no encontrado`);
            return res.status(401).json({ error: "Usuario no encontrado, inicia sesión." });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error("❌ Error en authenticateJWT:", error);
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn("⚠️ Unauthorized access: No user session found.");
            return res.status(401).json({ error: "No autenticado" });
        }

        if (!roles.includes(req.user.role)) {
            logger.warn(`⚠️ Access denied for user ${req.user.email} - Role required: ${roles.join(", ")}`);
            return res.status(403).json({ error: "No autorizado" });
        }

        next();
    };
};

/**
 * Handles authentication errors differently for API requests vs browser requests.
 * - API requests return a JSON response.
 * - Browser requests are redirected to the login page.
 */
const handleAuthError = (req, res) => {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.status(401).json({ error: "Authentication required" });
    }
    return res.redirect('/login'); // Only redirect for browser-based requests
};

export { authorizeRoles, authenticateJWT, isLoggedIn, isLoggedOut };
