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
          cert: fs.readFileSync("/app/certs/cert.pem")
        }
    });
    
    await app.register(cors, { origin: "*", credentials: true });
    await app.register(fastifyIO, { cors: { origin: "*", credentials: true } });

    app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
    app.register(autoLoad, { dir: join(dir, "routes/") });

    const gameSocket = ClientIO("http://game:8082", {
      transports: ["websocket"],
    });

    gameSocket.on("connect", () => {
      console.log("Connected to game service");
    });

    gameSocket.on("game-update", (data) => {
      app.io.emit("game-update", data);
    });

    app.ready(() => {
      app.io.on("connection", (socket: Socket) => {
        console.log("Client connected:", socket.id);

        socket.on("player-input", (data) => {
          console.log("Received input from client:", data);
          gameSocket.emit("player-input", data);
        
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
