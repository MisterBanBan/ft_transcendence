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

  socket.on("join-game", (gameId: string) => {
    const instance = new AIInstance(gameId, app.io, () => matchmakingSocket);
    aiInstances.set(gameId, instance);
  });

  socket.on("game-update", (data) => {
    const { gameId, playerId, input } = data;
    const instance = aiInstances.get(gameId);
    if (instance) {
      instance.handleInput(playerId, input);
    }
  });
}
