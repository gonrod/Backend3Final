// Cargar Variables de Entorno
import dotenv from 'dotenv';
dotenv.config();

// Importar Módulos Esenciales
import express from 'express';
import cors from 'cors';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import EventEmitter from 'events';
import config from './config.js';
import connectDB from './database.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swaggerConfig.js";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Límites de Eventos
EventEmitter.defaultMaxListeners = 20;

// Importar Middlewares
import requestLogger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { authenticateJWT } from './middlewares/auth.js';

// Importar Rutas
import userRouter from './routes/user.router.js';
import sessionRouter from './routes/session.router.js';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import ticketRouter from './routes/ticketsRouter.js';
import mocksRouter from './routes/mocks.router.js';
import viewsRouter from "./routes/views.router.js";

// Inicializar Express
const app = express();
const PORT = config.port || 8080;

// Conectar a la Base de Datos
connectDB();

// Configurar Middlewares
app.use(requestLogger);  // 🔹 Middleware de logging
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());

// Configurar Passport
import { initializePassport } from './config/passport.config.js';
initializePassport();
app.use(passport.initialize());

// Configurar Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: { eq: (a, b) => a === b },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Definir Rutas de API
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/mocks', mocksRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Definir Rutas de Vistas
app.use("/", viewsRouter);

// Redirección Automática en `/`
app.get("/", authenticateJWT, (req, res) => {
    if (process.env.NODE_ENV === "test") {
        return res.json({ message: "Test mode active, no redirection applied." });
    }

    // Only redirect if the user is not authenticated
    if (!req.user) {
        return res.redirect("/login");
    }

    // Redirect based on user role
    const redirectPath = req.user.role === "admin" ? "/admin-catalog" : "/catalog";
    return res.redirect(redirectPath);
});

// Manejo de Errores Global
app.use(errorHandler);

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);
import setupSocket from './socket.js'; // 🔹 Configuración separada de Socket.IO
setupSocket(io);

// Iniciar Servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

console.log("NODE_ENV:", process.env.NODE_ENV);

export default app;