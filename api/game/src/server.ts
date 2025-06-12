import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import autoLoad from "@fastify/autoload";
import { join } from "path";

async function start() {
  const dir = __dirname;

  const app = fastify({ logger: true });

  await app.register(cors, { origin: "http://matchmaking", credentials: true });
  await app.register(fastifyIO, { cors: { origin: "http://matchmaking", credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  app.listen({ port: 8082, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

start();
