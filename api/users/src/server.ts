import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fileValidationConfig from './config/file-validation.js';
import validationErrorHandler from './error/validation-errors.js';
// import corsConfig from './config/cors.js';
// import cors from "@fastify/cors";
// import websocket from "@fastify/websocket";


async function startServer() {

    const server = fastify();

    console.log("server started");

    const filename = fileURLToPath(import.meta.url);
    const dir = dirname(filename);

    // Register file validation configuration
    await server.register(fileValidationConfig);

    // Register custom error handler for validation errors
    await server.register(validationErrorHandler);

    // // Register cors config
    // await server.register(corsConfig);

    /*    server.register(websocket);*/

    try {
        server.register(autoLoad, {
            dir: join(dir, "plugins/"),
            encapsulate: false
        });

        server.register(autoLoad, {
            dir: join(dir, "routes/")
        });

        await server.listen({ port: 8080, host: '0.0.0.0' });
        console.log(`Users service is running on 0.0.0.0:8080`);

    } catch (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
}

startServer();