import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { AIInstance } from "../AIInstance/AIInstance"

let matchmakingSocket: Socket | null = null;
const aiInstances: Map<string, AIInstance> = new Map();

export function registerSocketHandlers(socket: Socket, app: FastifyInstance) {
  matchmakingSocket = socket;

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("game-started", (data: { gameId: string, playerId: any }) => {
    console.log("IA join game:", data.gameId);
    const instance = new AIInstance(data.gameId, app.io, () => matchmakingSocket);
    aiInstances.set(data.gameId, instance);
  });

  socket.on("game-update", (data) => {
    const { gameId, state } = data;
    const instance = aiInstances.get(gameId);
    if (instance) {
      instance.handleUpdate(state);
    }
  });

  socket.on("game-end", (gameId: string) => {
    console.log("Game", gameId, "end");
    const instance = aiInstances.get(gameId);
    if (instance) {
      instance.stop();
    }
  });
}
