import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";

export function registerSocketHandlers(socket: Socket, app: FastifyInstance) {
  socket.on("message", (data: string) => {
    app.log.info(`📩 Message from ${socket.id}: ${data}`);
    socket.emit("message", `Echo: ${data}`);
  });

  socket.on("disconnect", () => {
    app.log.info(`❌ Client disconnected: ${socket.id}`);
  });
}
