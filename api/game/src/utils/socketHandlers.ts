import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { GameInstance } from "../GameInstance/GameInstance"

let matchmakingSocket: Socket | null = null;
const gameInstances: Map<string, GameInstance> = new Map();

export function registerSocketHandlers(socket: Socket, app: FastifyInstance) {
  matchmakingSocket = socket;

  socket.on("disconnect", () => {
    app.log.info(`Client disconnected: ${socket.id}`);
  });

  socket.on("create-game", (data: { gameId: string; playerIds: string[] }) => {
    const { gameId, playerIds } = data;

    console.log(`Creating game ${gameId} for players:`, playerIds);

    const instance = new GameInstance(gameId, app.io, () => matchmakingSocket);
    gameInstances.set(gameId, instance);
  });

  socket.on("player-input", (data: { gameId: string; input: any }) => {
    const { gameId, input } = data;
    const instance = gameInstances.get(gameId);
    if (instance) {
      instance.handleInput(input);
    }
  });

  socket.on("abandon", (data: { gameId: string; side: string }) => {
    const { gameId, side } = data;
    const instance = gameInstances.get(gameId);
    if (instance) {
      instance.handleAbandon(side);
    }
  });
}
