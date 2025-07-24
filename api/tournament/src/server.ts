import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { join } from "node:path";
import cors from "@fastify/cors";
import fastifyIO from "fastify-socket.io";

async function startServer() {

	try {
		const server = fastify();

		await server.register(cors, { origin: `http://10.13.4.2:8443` , credentials: true }); // peut etre ajouter les adresses des autres docker en cas de prob
		await server.register(fastifyIO, {
			path: "/wss/tournament",
			cors: { origin: `http://10.13.4.2:8443`, credentials: true }
		});

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