import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { AIInstance } from "./AIInstance"

let matchmakingSocket: Socket | null = null;
const aiInstances: Map<string, AIInstance> = new Map();

export function registerSocketHandlers(socket: Socket, app: FastifyInstance) {
  matchmakingSocket = socket;

  socket.on("disconnect", () => {
    app.log.info(`Client disconnected: ${socket.id}`);
  });

  socket.on("game-started", (data: { gameId: string, playerId: any }) => {
    console.log("IA join game: ", data.gameId);
    const instance = new AIInstance(data.gameId, app.io, () => matchmakingSocket);
    aiInstances.set(data.gameId, instance);
  });

  socket.on("game-update", (data) => {
    const { gameId, input } = data;
    console.log("yop: ", data);
    const instance = aiInstances.get(gameId);
    if (instance) {
      instance.handleUpdate(input);
    }
  });
}
