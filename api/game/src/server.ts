import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import { Socket } from "socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";

async function start() {
	const dir = __dirname;

	const app = fastify({ logger: true });

	await app.register(cors, { origin: "*", credentials: true });
	await app.register(fastifyIO, { cors: { origin: "*", credentials: true } });

	app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
	app.register(autoLoad, { dir: join(dir, "routes/") });

	app.ready(() => {
		app.io.on("connection", (socket: Socket) => {	
			console.log("Matchmaking service connected");

		socket.on("player-input", (data) => {
		console.log("Received input:", data);

		// Simulate game logic
		const gameState = {
			players: [{ id: data.playerId, x: 100 }],
			ball: { x: 150, y: 200 },
		};

		// Send game state back to matchmaking
		socket.emit("game-update", gameState);
		});
	});
});

app.listen({ port: 8082, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
}

start();
