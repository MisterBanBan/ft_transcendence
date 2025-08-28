import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import multipart from "@fastify/multipart";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import corsConfig from './config/cors.js';
import fileValidationConfig from "./config/file-validation.js";
import websocket from "@fastify/websocket";
// import cleanupPlugin from "./plugins/cleanup.js";

declare module 'fastify' {
    interface FastifyInstance {
        activeConnections: Map<string, { socket: any; userId: string }>;
        userStatus: Map<string, string>;
        broadcastToAll: (message: any, excludeUserId?: string) => void;
        broadcastToUser: (userId: string, message: any) => void;
    }
}

const activeConnections = new Map();
const userStatus = new Map();

async function startServer() {

    const server = fastify();

    console.log("server started");

    const filename = fileURLToPath(import.meta.url);
    const dir = dirname(filename);

    // Register file validation configuration
    await server.register(fileValidationConfig);


    // Register cors config
    await server.register(corsConfig);

    // Init websocket
    await server.register(websocket);
    server.decorate('activeConnections', activeConnections);
    server.decorate('userStatus', userStatus);
    server.decorate('broadcastToAll', broadcastToAll);
    server.decorate('broadcastToUser', broadcastToUser);

    try {
        server.register(autoLoad, {
            dir: join(dir, "plugins/"),
            encapsulate: false
        });

        server.register(multipart);

        server.register(autoLoad, {
            dir: join(dir, "routes/")
        });

        // await server.register(cleanupPlugin);

        await server.listen({ port: 8080, host: '0.0.0.0' });
        console.log(`Users service is running on 0.0.0.0:8080`);

    } catch (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
}

function broadcastToUser(userId: string, message: any) {
    const connection = activeConnections.get(userId);
    if (connection && connection.socket.readyState === WebSocket.OPEN) {
        connection.socket.send(JSON.stringify(message));
    }
}

function broadcastToAll(message: any, excludeUserId?: string) {
    activeConnections.forEach((conn, userId) => {
        if (userId !== excludeUserId && conn.socket.readyState === WebSocket.OPEN) {
            conn.socket.send(JSON.stringify(message));
        }
    });
}

startServer();