import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import cors from "@fastify/cors";
import { Socket } from "socket.io";
import { io as ClientIO } from "socket.io-client";
import fs from "fs";

async function start() {
  const dir = __dirname;

  const app = fastify({
    logger: true,
    https: {
      key: fs.readFileSync("/app/certs/key.pem"),
      cert: fs.readFileSync("/app/certs/cert.pem"),
    },
  });

  await app.register(cors, { origin: "*", credentials: true });
  await app.register(fastifyIO, { cors: { origin: "*", credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  const gameSocket = ClientIO("http://game:8082", {
    transports: ["websocket"],
  });

  const playerToGame: Map<string, string> = new Map();

  gameSocket.on("connect", () => {
    console.log("Connected to game service");
  });

  gameSocket.on("game-update", (data) => {
    const { gameId } = data;
    console.log(`Forwarding game-update for ${gameId}`);

    for (const [playerId, pGameId] of playerToGame.entries()) {
      if (pGameId === gameId) {
        const clientSocket = app.io.sockets.sockets.get(playerId);
        if (clientSocket) {
          clientSocket.emit("game-update", data);
        }
      }
    }
  });

  let waitingPlayer: Socket | null = null;
  let gameIdCounter = 1;

  app.ready(() => {
    app.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      if (!waitingPlayer) {
        waitingPlayer = socket;
      } else {
        const gameId = `game-${gameIdCounter++}`;

        playerToGame.set(socket.id, gameId);
        playerToGame.set(waitingPlayer.id, gameId);

        // Important : informer game de créer la partie avec les vrais playerIds
        gameSocket.emit("create-game", { gameId, playerIds: [waitingPlayer.id, socket.id] });

        waitingPlayer.emit("game-started", { gameId, playerId: waitingPlayer.id });
        socket.emit("game-started", { gameId, playerId: socket.id });

        waitingPlayer = null;
      }

      socket.on("player-input", (data) => {
        const gameId = playerToGame.get(socket.id);
        if (!gameId) return;

        gameSocket.emit("player-input", {
          gameId,
          playerId: socket.id,
          input: data,
        });
      });
    });
  });

  app.listen({ port: 8083, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

start();
