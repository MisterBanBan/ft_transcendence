import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import cors from "@fastify/cors";
import { io as ClientIO } from "socket.io-client";
import fs from "fs";
import { gameUpdate } from "./gamesManager/gameUpdate";

async function start() {
	const dir = __dirname;

	const app = fastify();

	await app.register(cors, { origin: `http://${process.env.HOSTNAME}:8443` , credentials: true }); // peut etre ajouter les adresses des autres docker en cas de prob
	await app.register(fastifyIO, {
		path: "/wss/matchmaking",
		cors: { origin: `http://${process.env.HOSTNAME}:8443`, credentials: true }
	});

	app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
	app.register(autoLoad, { dir: join(dir, "routes/") });


	const gameSocket = ClientIO("http://game:8082", {
		transports: ["websocket"],
	});

	app.decorate("gameSocket", gameSocket);

	const aiSocket = ClientIO("http://ai:8085", {
		transports: ["websocket"],
	});

	app.decorate("aiSocket", aiSocket);

	const playerToGame = new Map<string, { playerName: string, gameId: string, side: string }>();
	app.decorate("playerToGame", playerToGame);

	const privateQueue = new Map<string, string>();
	app.decorate("privateQueue", privateQueue);

	gameUpdate(app);

	app.listen({ port: 8083, host: "0.0.0.0" }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
	});
}

start();
