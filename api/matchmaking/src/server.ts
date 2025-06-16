import fastify, { FastifyInstance } from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import cors from "@fastify/cors";
import { io as ClientIO } from "socket.io-client";
import fs from "fs";

async function start() {
  const dir = __dirname;

  const app: FastifyInstance = fastify({
    logger: true,
    https: {
      key: fs.readFileSync("/app/certs/key.pem"),
      cert: fs.readFileSync("/app/certs/cert.pem"),
    },
  });

  await app.register(cors, { origin: "https://z3r5p6:8443", credentials: true });         // tester depuis un autre poste
  await app.register(fastifyIO, { cors: { origin: "https://z3r5p6:8443", credentials: true } });

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

  gameSocket.on("connect", () => {
    console.log("Connected to game service");
  });

  gameSocket.on("game-update", (data) => {
    const { gameId } = data;

    for (const [playerId, value] of app.playerToGame.entries()) {
      const pGameId = value.gameId;
      if (pGameId === gameId) {
        const clientSocket = app.io.sockets.sockets.get(playerId);
        if (clientSocket) {
          clientSocket.emit("game-update", data);
        }
        if (playerId === app.aiSocket.id)
        {
          app.aiSocket.emit("game-update", data);
        }
      }
    }
  });

  gameSocket.on("game-end", (data: {gameId: string, score: { playerLeft: number, playerRight: number }}) => {
    console.log("game ", data.gameId, " end with a score of ", data.score.playerLeft, ":", data.score.playerRight);
    for (const [playerId, value] of app.playerToGame.entries()) {
      const pGameId = value.gameId;
      if (pGameId === data.gameId) {
        const clientSocket = app.io.sockets.sockets.get(playerId);
        if (clientSocket) {
          clientSocket.emit("game-end", data.score);
        }
        if (playerId === app.aiSocket.id)
        {
          app.aiSocket.emit("game-end", data.gameId);
        }
      }
    }
  })

  app.listen({ port: 8083, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

start();
