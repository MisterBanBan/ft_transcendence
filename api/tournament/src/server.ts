import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "fs";
// import websocket from "@fastify/websocket";
// import multipart from "@fastify/multipart";
// import { existsSync } from "node:fs";

async function startServer() {

    try {
		const server = fastify({
			https: {
				cert: fs.readFileSync("/app/certs/cert.crt"),
				key: fs.readFileSync("/app/certs/key.key"),
			}
		});

        console.log("server started");

        const filename = fileURLToPath(import.meta.url);
        const dir = dirname(filename);

        server.register(autoLoad, {
            dir: join(dir, "plugins/"),
            encapsulate: false
        });

        server.register(autoLoad, {
            dir: join(dir, "routes/")
        });

        await server.listen({ port: 8081, host: '0.0.0.0' });
        console.log(`Tournaments service is running on 0.0.0.0:8081`);
    } catch (err) {
        //server.log.error(err);
        console.log(err);
        process.exit(1);
    }
}

startServer();