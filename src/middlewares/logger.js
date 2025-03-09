import logger from "../utils/loggerUtils.js";

/**
 * Middleware para registrar todas las peticiones HTTP entrantes
 */
const requestLogger = (req, res, next) => {
    logger.http(`🌐 ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
};

export default requestLogger;
