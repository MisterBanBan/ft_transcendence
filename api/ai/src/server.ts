import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import fs from "fs";

async function start() {
  const dir = __dirname;

  const app = fastify();

  await app.register(cors, { origin: "http://matchmaking", credentials: true });
  await app.register(fastifyIO, { cors: { origin: "http://matchmaking", credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  app.listen({ port: 8085, host: "0.0.0.0" }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("server listening on 0.0.0.0:8085");
  });
}

start();
