import { Socket } from "socket.io";

export class GameInstance {
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
		ball: { x: 300, y: 200, vx: Math.cos(Math.PI / 4), vy: Math.sin(Math.PI / 4), speed: 4 },
		score: {player1: 0, player2: 0}
	  };
	  this.startGameLoop();
	}
  
	startGameLoop() {
	  console.log(`[${this.id}] startGameLoop called`);
	  this.interval = setInterval(() => {
		this.updateGame();
	  }, 1000 / 60);
	}
  
	updateGame() {
  
		this.state.ball.x += this.state.ball.vx * this.state.ball.speed;
		this.state.ball.y += this.state.ball.vy * this.state.ball.speed;
  
	   if (this.state.ball.x <= 5 || this.state.ball.x >= 595) {
		  if (this.state.ball.speed < 50)
			  this.state.ball.speed += 0.5;
		  this.state.ball.vx *= -1;
		  if (this.state.ball.x <= 5)
			  this.state.score.player2 += 1;
		  else
			  this.state.score.player1 += 1;
		}
		if (this.state.ball.y <= 5 || this.state.ball.y >= 395) {
		  if (this.state.ball.speed < 50)
			  this.state.ball.speed += 0.5;
		  this.state.ball.vy *= -1;
		}
  
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