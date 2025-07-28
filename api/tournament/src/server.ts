import fastify from "fastify";
import autoLoad from "@fastify/autoload";
import { join } from "node:path";
import fastifyIO from "fastify-socket.io";
import {Tournament} from "./class/Tournament.js";

export const tournaments = new Map<string, Tournament>();

async function startServer() {

	try {
		const app = fastify();

		await app.register(fastifyIO, {
			path: "/wss/tournament",
		});

		const dir = __dirname;
		await app.register(autoLoad, {
			dir: join(dir, "plugins/"),
			encapsulate: false
		});

		await app.register(autoLoad, {
			dir: join(dir, "routes/")
		});

		await app.listen({ port: 8081, host: '0.0.0.0' });
		console.log(`Tournaments service is running on 0.0.0.0:8081`);
	} catch (err) {
		//app.log.error(err);
		console.log(err);
		process.exit(1);
	}
}

startServer();