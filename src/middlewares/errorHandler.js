import logger from "../utils/loggerUtils.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`❌ Error en ${req.method} ${req.url} - Mensaje: ${err.message} - Stack: ${err.stack}`);
    res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
};

export default errorHandler;
