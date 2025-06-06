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
		ball: { x: 1500, y: 700, vx: Math.cos(Math.PI / 4), vy: Math.sin(Math.PI / 4), speed: 10 },
		score: {player1: 0, player2: 0}
	  };
	  this.startGameLoop();
	}
  
	private startGameLoop() {
	  console.log(`[${this.id}] startGameLoop called`);
	  this.interval = setInterval(() => {
		this.updateGame();
	  }, 1000 / 60);
	}
  
	private updateGame() {

		this.state.ball.x += this.state.ball.vx * this.state.ball.speed;
		this.state.ball.y += this.state.ball.vy * this.state.ball.speed;
		
		if (this.state.ball.x <= 10 || this.state.ball.x >= 3000) {
			this.updateScore();
		}

		if (this.state.ball.y <= 10 || this.state.ball.y >= 1400) {
			if (this.state.ball.speed < 50)
				this.state.ball.speed += 2;
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

	private updateScore()
	{
		if (this.state.ball.x <= 10)
			this.state.score.player2 += 1;
		else
			this.state.score.player1 += 1;
		
		this.state.ball.x = 1500;
		this.state.ball.y = 700;

		this.state.ball.vx = Math.random() * (1 - -1) + -1;
		this.state.ball.vy = Math.random() * (1 - -1) + -1;
		this.state.ball.speed = 10;
	}
  
	public handleInput(playerId: string, input: any) {
	  const player = this.state.players.find((p: any) => p.id === playerId);
	  if (player && input.direction) {
		player.x += input.direction === "left" ? -5 : 5;
	  }
	}
  
	private stop() {
	  clearInterval(this.interval);
	}
  }