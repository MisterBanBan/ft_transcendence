import { FastifyPluginAsync } from "fastify";
import { registerSocketHandlers } from "../utils/socketHandlers";
import { Socket } from "socket.io";

const socketPlugin: FastifyPluginAsync = async (app) => {
  app.io.on("connection", (socket: Socket) => {
    app.log.info(`🔌 Client connected: ${socket.id}`);
    registerSocketHandlers(socket, app);
  });
};

export default socketPlugin;
