import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { GameInstance } from "./GameInstance"

let matchmakingSocket: Socket | null = null;
const gameInstances: Map<string, GameInstance> = new Map();

export function registerSocketHandlers(socket: Socket, app: FastifyInstance) {
  matchmakingSocket = socket;

  socket.on("disconnect", () => {
    app.log.info(`❌ Client disconnected: ${socket.id}`);
  });

  socket.on("create-game", (data: { gameId: string; playerIds: string[] }) => {
    const { gameId, playerIds } = data;

    console.log(`Creating game ${gameId} for players:`, playerIds);

    const instance = new GameInstance(gameId, playerIds, app.io, () => matchmakingSocket);
    gameInstances.set(gameId, instance);
  });

  socket.on("player-input", (data) => {
    const { gameId, playerId, input } = data;
    const instance = gameInstances.get(gameId);
    if (instance) {
      instance.handleInput(playerId, input);
    }
  });
}
