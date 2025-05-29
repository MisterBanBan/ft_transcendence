import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import cors from "@fastify/cors";
import { Socket } from "socket.io";
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

  await app.register(cors, {
    origin: "*",
    credentials: true,
  });

  await app.register(fastifyIO, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  const connectedClients: Socket[] = [];

  app.ready((err) => {
    if (err) throw err;

    app.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      connectedClients.push(socket);

      if (connectedClients.length === 2) {
        console.log("Deux clients connectés !");
        connectedClients.forEach((s) =>
          s.emit("message", "Deux joueurs sont connectés !")
        );
      }

      socket.on("message", (msg: string) => {
        console.log(`Received from ${socket.id}: ${msg}`);
        socket.emit("message", `Echo: ${msg}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        const index = connectedClients.indexOf(socket);
        if (index !== -1) connectedClients.splice(index, 1);
      });
    });
  });

  app.listen({ port: 8083, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
}

start();