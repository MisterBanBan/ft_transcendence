import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import { io as ClientIO } from "socket.io-client";
import { gameUpdate } from "./gamesManager/gameUpdate";
import { playerInfo, privateInfo } from "./utils/interface";

async function start() {
	const dir = __dirname;

	const app = fastify();

	await app.register(fastifyIO, {
		path: "/wss/matchmaking",
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
	
	const usersSocket = ClientIO("http://users-status:8086", {
		transports: ["websocket"],
		path: "/wss/users-status",
	});

	app.decorate("usersSocket", usersSocket);

	const playerToGame = new Map<string, playerInfo>();
	app.decorate("playerToGame", playerToGame);

	const privateQueue = new Map<string, privateInfo>();
	app.decorate("privateQueue", privateQueue);

	const privateResult = new Map<string, privateInfo>();
	app.decorate("privateResult", privateResult)

	gameUpdate(app);

	app.listen({ port: 8083, host: "0.0.0.0" }, (err) => {
		if (err) {
			app.log.error(err);
			process.exit(1);
		}
	});
}

start();
