import { FastifyPluginAsync } from "fastify";
import { registerSocketHandlers } from "../utils/socketHandlers";

const socketPlugin: FastifyPluginAsync = async (app) => {
  app.io.on("connection", (socket) => {
    app.log.info(`🔌 Client connected: ${socket.id}`);
    registerSocketHandlers(socket, app);
  });
};

export default socketPlugin;
