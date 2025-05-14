import fastify from "fastify";
import socketioServer from "fastify-socket.io";
import autoLoad from "@fastify/autoload";
import { Server } from "socket.io";
import { join } from "path";

const dir = __dirname;

const app = fastify({ logger: true });

app.register(socketioServer);

app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
app.register(autoLoad, { dir: join(dir, "routes/") });

app.listen({ port: 8082, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}
