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
			speed: 150,
			map: {left: 164, top: 123, right: 3146, bot: 1590}
		};	
		this.state = {
			players: players.map((id, idx) => ({ id, x: 100 + idx * 50 })),
			bar: {left:  (this.limit.map.bot - this.limit.map.top) / 2, right: (this.limit.map.bot - this.limit.map.top) / 2 },
			ball: { x: (this.limit.map.right - this.limit.map.left) / 2, y: (this.limit.map.bot - this.limit.map.top) / 2 },
			score: {player1: 0, player2: 0}
		};
		this.intern = {
			ball: { width: 85.7, height: 85.7,  vx: Math.cos(Math.PI / 4), vy: Math.sin(Math.PI / 4), speed: 10 },
			bar: {	
				left: { x: (this.limit.map.right - this.limit.map.left) / 10 ,Up: false, Down: false },
				right: { x: this.limit.map.right - (this.limit.map.right - this.limit.map.left) / 10 ,Up: false, Down: false},
				width: 40.96,
				height: 342.8}
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
		
		this.barUpdate();

		if (this.state.ball.x <= this.limit.map.left + (this.intern.ball.width / 2) || this.state.ball.x >= this.limit.map.right - (this.intern.ball.width / 2)) {
			this.updateScore();
			if (this.state.ball.x < this.limit.map.left + (this.intern.ball.width / 2))
				this.state.ball.x = this.limit.map.left + (this.intern.ball.width / 2);
			if (this.state.ball.x > this.limit.map.right - (this.intern.ball.width / 2))
				this.state.ball.x = this.limit.map.right - (this.intern.ball.width / 2);
		}

		if (this.state.ball.y <= this.limit.map.top + (this.intern.ball.height / 2) || this.state.ball.y >= this.limit.map.bot - (this.intern.ball.height / 2)) {
			if (this.intern.ball.speed < this.limit.speed)
				this.intern.ball.speed += 1;
			this.intern.ball.vy *= -1;
			if (this.state.ball.y < this.limit.map.top + (this.intern.ball.height / 2))
				this.state.ball.y = this.limit.map.top + (this.intern.ball.height / 2);
			if (this.state.ball.y > this.limit.map.bot - (this.intern.ball.height / 2))
				this.state.ball.y = this.limit.map.bot - (this.intern.ball.height / 2);
		}
  
	  const matchmakingSocket = this.getMatchmakingSocket();
	  if (matchmakingSocket) {
		matchmakingSocket.emit("game-update", {
		  gameId: this.id,
		  state: this.state,
		});
	  }
	}

	private barUpdate()
	{
		if (this.intern.bar.left.Up && this.state.bar.left > this.limit.map.top + this.intern.bar.height / 2)
			this.state.bar.left -= 15;
		if (this.intern.bar.left.Down && this.state.bar.left < this.limit.map.bot - this.intern.bar.height / 2)
			this.state.bar.left += 15;
		if (this.intern.bar.right.Up && this.state.bar.right > this.limit.map.top + this.intern.bar.height / 2)
			this.state.bar.right -= 15;
		if (this.intern.bar.right.Down && this.state.bar.right < this.limit.map.bot - this.intern.bar.height / 2)
			this.state.bar.right += 15;

		const defenseArea = (this.limit.map.right - this.limit.map.left) * 0.1;
		if (this.state.ball.x - this.intern.ball.width / 2 <= this.limit.map.left + defenseArea)
		{
			const left	= this.limit.map.left + defenseArea;
			const right = this.limit.map.left + defenseArea + this.intern.bar.width;
			const top   = this.state.bar.left - this.intern.bar.height / 2;
			const bot	= this.state.bar.left + this.intern.bar.height / 2;

			const closest_x = Math.max(left, Math.min(right, this.state.ball.x));
			const closest_y = Math.max(top, Math.min(bot, this.state.ball.y))
			
			const dx = this.state.ball.x - closest_x
			const dy = this.state.ball.y - closest_y
			
			const distance_squared = dx*dx + dy*dy;

			if (distance_squared <= (this.intern.ball.width / 2) * (this.intern.ball.width / 2))
			{
				const center_dist = this.state.bar.left - closest_y;
				const bar_ratio = -center_dist / this.intern.bar.height / 2;
				let new_angle = bar_ratio * Math.PI;
				this.intern.ball.vx = Math.cos(new_angle);
				this.intern.ball.vy = Math.sin(new_angle);
				if (this.intern.ball.speed < this.limit.speed)
					this.intern.ball.speed += 1;
			}
		}
		if (this.state.ball.x + this.intern.ball.width / 2 >= this.limit.map.right - defenseArea)
		{
			const left	= this.limit.map.right - defenseArea - this.intern.bar.width;
			const right = this.limit.map.right - defenseArea;
			const top   = this.state.bar.right - this.intern.bar.height / 2;
			const bot	= this.state.bar.right + this.intern.bar.height / 2;

			const closest_x = Math.max(left, Math.min(right, this.state.ball.x));
			const closest_y = Math.max(top, Math.min(bot, this.state.ball.y))
			
			const dx = this.state.ball.x - closest_x
			const dy = this.state.ball.y - closest_y
			
			const distance_squared = dx*dx + dy*dy;

			if (distance_squared <= (this.intern.ball.width / 2) * (this.intern.ball.width / 2))
			{
				const center_dist = this.state.bar.right - closest_y;
				const bar_ratio = center_dist / this.intern.bar.height / 2;
				let new_angle = Math.PI + bar_ratio * Math.PI;
				this.intern.ball.vx = Math.cos(new_angle);
				this.intern.ball.vy = Math.sin(new_angle);
				if (this.intern.ball.speed < this.limit.speed)
					this.intern.ball.speed += 1;
			}
		}
	}

	private updateScore()
	{
		if (this.state.ball.x <= this.limit.map.left + (this.intern.ball.width / 2))
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
					this.intern.bar.left.Up = input.state;
				if (input.direction == "down")
					this.intern.bar.left.Down = input.state;
			}
			if (input.player == "right")
			{
				if (input.direction == "up")
					this.intern.bar.right.Up = input.state;
				if (input.direction == "down")
					this.intern.bar.right.Down = input.state;
			}
		}
	}
  
	private stop() {
	  clearInterval(this.interval);
	}
  }