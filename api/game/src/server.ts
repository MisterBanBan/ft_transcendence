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
      cert: fs.readFileSync("/app/certs/cert.pem")
    }
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
  
  app.io.of("/").adapter.on("create-room", (test1: any) => {
    console.log(`room ${test1} was created`);
  });

  app.ready((err) => {
    if (err) throw err;

    app.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      app.io.of("/").adapter.on("join-room", (test1: any, id: any) => {
        console.log(`socket ${id} has joined room ${test1}`);
      });
      socket.on("message", (msg: string) => {
        console.log(`Received from ${socket.id}: ${msg}`);
        socket.emit("message", `Echo: ${msg}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  });

  app.listen({ port: 8082, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
}

start();
