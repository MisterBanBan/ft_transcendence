import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { join } from "node:path";
import fs from "fs";
import fastifyWebsocket from "@fastify/websocket";
import wssGet from "./wss.js";

async function startServer() {

    try {
		const server = fastify(
			{
			https: {
				cert: fs.readFileSync("/app/certs/cert.crt"),
				key: fs.readFileSync("/app/certs/key.key"),
			}
		}
		);

		await server.register(fastifyWebsocket);
		await server.register(wssGet);
		// await server.register(fastifyIO, { cors: { origin: "https://z3r6p4:8443", credentials: true } });



        const dir = __dirname;
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