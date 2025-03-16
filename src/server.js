import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import config from "./config.js";

const PORT = config.port || 8080;

const server = http.createServer(app);

const io = new Server(server);
import setupSocket from "./socket.js";
setupSocket(io);

server.listen(PORT, () => {
    const serverUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    console.log(`🚀 Servidor ejecutándose en ${serverUrl}${PORT}`);
});
