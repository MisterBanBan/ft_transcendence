import fastify, { FastifyInstance } from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import cors from "@fastify/cors";
import { io as ClientIO } from "socket.io-client";
import fs from "fs";
import { gameUpdate } from "./gamesManager/gameUpdate";

async function start() {
  const dir = __dirname;

  const app = fastify({
    https: {
      key: fs.readFileSync("/app/certs/key.key"),
      cert: fs.readFileSync("/app/certs/cert.crt"),
    }
  });

  await app.register(cors, { origin: `https://${process.env.HOSTNAME}:8443` , credentials: true }); // peut etre ajouter les adresses des autres docker en cas de prob
  await app.register(fastifyIO, { cors: { origin: `https://${process.env.HOSTNAME}:8443`, credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });


  const gameSocket = ClientIO("https://game:8082", {
    transports: ["websocket"],
    rejectUnauthorized: false,
  });

  app.decorate("gameSocket", gameSocket);

  w

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
