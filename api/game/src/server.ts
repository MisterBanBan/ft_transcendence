import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import { Socket } from "socket.io";
import autoLoad from "@fastify/autoload";
import { join } from "path";

class GameInstance {
  private interval!: NodeJS.Timeout;
  state: any;

  constructor(
    public id: string,
    private players: string[],
    private io: any,
    private getMatchmakingSocket: () => Socket | null
  ) {
    this.state = {
      players: players.map((id, idx) => ({ id, x: 100 + idx * 50 })),
      ball: { x: 150, y: 200 },
    };
    this.startGameLoop();
  }

  startGameLoop() {
    console.log(`[${this.id}] startGameLoop called`);
    this.interval = setInterval(() => {
      this.updateGame();
    }, 1000 / 30);
  }

  updateGame() {
    this.state.ball.x += 1;

    console.log("Try send game-update");
    const matchmakingSocket = this.getMatchmakingSocket();
    if (matchmakingSocket) {
      matchmakingSocket.emit("game-update", {
        gameId: this.id,
        state: this.state,
      });
    }
  }

  handleInput(playerId: string, input: any) {
    const player = this.state.players.find((p: any) => p.id === playerId);
    if (player && input.direction) {
      player.x += input.direction === "left" ? -5 : 5;
    }
  }

  stop() {
    clearInterval(this.interval);
  }
}

async function start() {
  const dir = __dirname;

  const app = fastify({ logger: true });

  await app.register(cors, { origin: "*", credentials: true });
  await app.register(fastifyIO, { cors: { origin: "*", credentials: true } });

  app.register(autoLoad, { dir: join(dir, "plugins/"), encapsulate: false });
  app.register(autoLoad, { dir: join(dir, "routes/") });

  const gameInstances: Map<string, GameInstance> = new Map();

  let matchmakingSocket: Socket | null = null;

  app.ready(() => {
    app.io.on("connection", (socket: Socket) => {
      console.log("Game service: client connected", socket.id);
      matchmakingSocket = socket;

      socket.on("create-game", (data: { gameId: string; playerIds: string[] }) => {
        const { gameId, playerIds } = data;

        console.log(`Creating game ${gameId} for players:`, playerIds);

        // Optionnel : faire rejoindre les joueurs à une salle
        // playerIds.forEach(id => app.io.sockets.sockets.get(id)?.join(gameId));

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
    });
  });

  app.listen({ port: 8082, host: "0.0.0.0" }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}

start();
