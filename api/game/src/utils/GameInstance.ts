import { Socket } from "socket.io";

export class GameInstance {
	private interval!: NodeJS.Timeout;
	state: any;
	private limit: any;
	private intern: any;

	constructor(
	  public id: string,
	  private players: string[],
	  private io: any,
	  private getMatchmakingSocket: () => Socket | null
	) {
		this.limit = {
			speed: 300,
			map: {left: 165, top: 123, right: 3144, bot: 1589}
		};	
		this.state = {
			players: players.map((id, idx) => ({ id, x: 100 + idx * 50 })),
			bar: {left:  (this.limit.map.bot - this.limit.map.top) / 2, right: (this.limit.map.bot - this.limit.map.top) / 2 },
			ball: { x: (this.limit.map.right - this.limit.map.left) / 2, y: (this.limit.map.bot - this.limit.map.top) / 2 },
			score: {player1: 0, player2: 0}
		};
		this.intern = {
			ball: { vx: Math.cos(Math.PI / 4), vy: Math.sin(Math.PI / 4), speed: 10 },
			bar: {leftKUp: false, leftKDown: false, rightKUp: false, rightKDown: false}
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

		this.state.ball.x += this.intern.ball.vx * this.intern.ball.speed;
		this.state.ball.y += this.intern.ball.vy * this.intern.ball.speed;
		
		if (this.intern.bar.leftKUp)
		{
			this.state.bar.left -= 10;
		}
		if (this.intern.bar.leftKDown)
		{
			this.state.bar.left += 10;
		}
		if (this.intern.bar.rightKUp)
		{
			this.state.bar.right -= 10;
		}
		if (this.intern.bar.rightKDown)
		{
			this.state.bar.right += 10;
		}

		if (this.state.ball.x <= this.limit.map.left + (this.limit.map.left / 10) || this.state.ball.x >= this.limit.map.right - (this.limit.map.right / 10)) {
			this.updateScore();
		}

		if (this.state.ball.y <= this.limit.map.top + (this.limit.map.top / 10) || this.state.ball.y >= this.limit.map.bot - (this.limit.map.top / 10)) {
			if (this.intern.ball.speed < this.limit.speed)
				this.intern.ball.speed += 2;
			this.intern.ball.vy *= -1;
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
		if (this.state.ball.x <= this.limit.left)
			this.state.score.player2 += 1;
		else
			this.state.score.player1 += 1;
		
		this.state.ball.x = (this.limit.map.right - this.limit.map.left) / 2;
		this.state.ball.y = (this.limit.map.bot - this.limit.map.top) / 2;

		const new_angle = Math.random() * 2 * Math.PI;
		this.intern.ball.vx = Math.cos(new_angle);
		this.intern.ball.vy = Math.sin(new_angle);
		this.intern.ball.speed = 10;
	}
  
	public handleInput(playerId: string, input: { direction: string, state: boolean, player: string}) {
		const player = this.state.players.find((p: any) => p.id === playerId); // changer fct pour gerer un 1v1 entre 2 poste distant
		if (player) {
			if (input.player == "left")
			{
				if (input.direction == "up")
					this.intern.bar.leftKUp = input.state;
				if (input.direction == "down")
					this.intern.bar.leftKDown = input.state;
			}
			if (input.player == "right")
			{
				if (input.direction == "up")
					this.intern.bar.rightKUp = input.state;
				if (input.direction == "down")
					this.intern.bar.rightKDown = input.state;
			}
		}
	}
  
	private stop() {
	  clearInterval(this.interval);
	}
  }