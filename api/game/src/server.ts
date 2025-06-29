import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "fs";

async function startServer() {

    const server = fastify({
        https: {
            cert: fs.readFileSync("/app/certs/cert.crt"),
            key: fs.readFileSync("/app/certs/key.key"),
        }
    });

    console.log("server started");

    const filename = fileURLToPath(import.meta.url);
    const dir = dirname(filename);

    try {
        server.register(autoLoad, {
            dir: join(dir, "routes/")
        });
    } catch (err) {
        console.error(err);
    }

/*    server.register(cors, {
        origin: "*",
        methods: ["GET", "POST"]
    });*/

    /*    server.register(websocket);*/
    try {
        server.register(autoLoad, {
            dir: join(dir, "plugins/"),
            encapsulate: false
        });
    } catch (err) {
        console.error(err);
    }

    /*    server.register(multipart);*/

    try {
        await server.listen({ port: 8082, host: '0.0.0.0' });
        console.log(`Users service is running on 0.0.0.0:8082`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

startServer();