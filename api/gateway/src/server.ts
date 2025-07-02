import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "fs";

async function startServer() {

	const server = fastify();

	const filename = fileURLToPath(import.meta.url);
	const dir = dirname(filename);

	try {

		await server.register(autoLoad, {
			dir: join(dir, "plugins/"),
			encapsulate: false
		});

		await server.register(autoLoad, {
			dir: join(dir, "routes/")
		});

		await server.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Gateway service is running on 0.0.0.0:3000`);
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

startServer();
