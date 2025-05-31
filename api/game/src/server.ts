import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import { Socket } from "socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import { GameInstance } from "./utils/GameInstance"

async function start() {
  const dir = __dirname;

  const app = fastify({ logger: true });

  await app.register(cors, { origin: "*", credentials: true });
  await app.register(fastifyIO, { cors: { origin: "*", credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  const gameInstances: Map<string, GameInstance> = new Map();

  let matchmakingSocket: Socket | null = null;

  app.ready(() => {
    app.io.on("connection", (socket: Socket) => {
      console.log("Game service: client connected", socket.id);
      matchmakingSocket = socket;

      socket.on("create-game", (data: { gameId: string; playerIds: string[] }) => {
        const { gameId, playerIds } = data;

        console.log(`Creating game ${gameId} for players:`, playerIds);

        const instance = new GameInstance(gameId, playerIds, app.io, () => matchmakingSocket);
        gameInstances.set(gameId, instance);
      });

      socket.on("player-input", (data) => {
        const { gameId, playerId, input } = data;
        const instance = gameInstances.get(gameId);
        if (instance) {
          instance.handleInput(playerId, input);
        }
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
