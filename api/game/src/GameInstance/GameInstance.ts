import { Socket } from "socket.io";
import { limit, state, intern, pause } from "../utils/interface"

export class GameInstance {
	private interval!: NodeJS.Timeout;
	private time!:NodeJS.Timeout;
	private state: state;
	private limit: limit;
	private intern: intern;
	private pause: pause;

	constructor(
	  public id: string,
	  private io: any,
	  private getMatchmakingSocket: () => Socket | null
	) {
		this.limit = {
			map: {left: 164, top: 123, right: 3146, bot: 1590},
			speed: (3146 - 164) / 25,
			timer: 180
		};
		this.state = {
			bar: {
				left: this.limit.map.top + (this.limit.map.bot - this.limit.map.top) / 2,
				right: this.limit.map.top + (this.limit.map.bot - this.limit.map.top) / 2
			},
			ball: {
				x: this.limit.map.left + (this.limit.map.right - this.limit.map.left) / 2,
				y: this.limit.map.top + (this.limit.map.bot - this.limit.map.top) / 2,
				vx: Math.cos(Math.PI / 4),
				vy: Math.sin(Math.PI / 4)
			},
			score: {
				playerLeft: 0,
				playerRight: 0
			}
		};
		this.intern = {
			ball: {
				width: 85.7,
				height: 85.7,
				speed: (this.limit.map.right - this.limit.map.left) / 200
			},
			bar: {
				left: {
					x: this.limit.map.left + (this.limit.map.right - this.limit.map.left) / 10,
					Up: false,
					Down: false
				},
				right: {
					x: this.limit.map.right - (this.limit.map.right - this.limit.map.left) / 10,
					Up: false,
					Down: false
				},
				width: 40.96,
				height: 342.8,
				speed: (this.limit.map.bot - this.limit.map.top) / 60
			}
		};
		this.pause = {
			bool: true,
			cooldown: 0
		};
	  
		this.startGameLoop();
	}
  
	private startGameLoop() {
		console.log(`[${this.id}] startGameLoop called`);
		this.interval = setInterval(() => {
			this.sendUpdate();
			if (this.pause.bool)
				this.pause.cooldown++;
			else
				this.updateGame();
			this.barUpdate();
			if (this.pause.cooldown == 60)
			{
				this.pause.cooldown = 0;
				this.pause.bool = false;
			}
		}, 1000 / 60);
		console.log("timer loop started");
		this.time = setInterval(() => {
			console.log("time: ", this.limit.timer);
			this.limit.timer--;
			if (((this.state.score.playerRight >= 10 || this.state.score.playerLeft >= 10) || this.limit.timer <= 0) && this.state.score.playerRight != this.state.score.playerLeft)
				this.endGame();
		}, 1000);
		
	}

	private sendUpdate() {
		const matchmakingSocket = this.getMatchmakingSocket();
		if (matchmakingSocket) {
			matchmakingSocket.emit("game-update", {
				gameId: this.id,
				state: this.state,
				time: this.limit.timer
			});
		}
	}
	
	private updateGame() {

		this.state.ball.x += this.state.ball.vx * this.intern.ball.speed;
		this.state.ball.y += this.state.ball.vy * this.intern.ball.speed;

		const left = this.limit.map.left + (this.intern.ball.width / 2);
		const right = this.limit.map.right - (this.intern.ball.width / 2);

		if (this.state.ball.x <= left || this.state.ball.x >= right) {
			this.updateScore();

			if (this.state.ball.x < left)
				this.state.ball.x = left;
			if (this.state.ball.x > right)
				this.state.ball.x = right;
		}

		const top = this.limit.map.top + (this.intern.ball.height / 2);
		const bot = this.limit.map.bot - (this.intern.ball.height / 2);

		if (this.state.ball.y <= top || this.state.ball.y >= bot) {
			if (this.intern.ball.speed < this.limit.speed)
				this.intern.ball.speed += this.intern.ball.speed / 20;

			this.state.ball.vy *= -1;

			if (this.state.ball.y < top)
				this.state.ball.y = top;
			if (this.state.ball.y > bot)
				this.state.ball.y = bot;
		}
	}

	private barUpdate()
	{
		if (this.intern.bar.left.Up && this.state.bar.left > this.limit.map.top + this.intern.bar.height / 2)
			this.state.bar.left -= this.intern.bar.speed;
		if (this.intern.bar.left.Down && this.state.bar.left < this.limit.map.bot - this.intern.bar.height / 2)
			this.state.bar.left += this.intern.bar.speed;
		if (this.intern.bar.right.Up && this.state.bar.right > this.limit.map.top + this.intern.bar.height / 2)
			this.state.bar.right -= this.intern.bar.speed;
		if (this.intern.bar.right.Down && this.state.bar.right < this.limit.map.bot - this.intern.bar.height / 2)
			this.state.bar.right += this.intern.bar.speed;

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
				const bar_ratio = -center_dist / (this.intern.bar.height / 2);
				let new_angle = bar_ratio * Math.PI / 4;
				this.state.ball.vx = Math.cos(new_angle);
				this.state.ball.vy = Math.sin(new_angle);
				if (this.intern.ball.speed < this.limit.speed)
					this.intern.ball.speed += this.intern.ball.speed / 20;
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
				const bar_ratio = center_dist / (this.intern.bar.height / 2);
				const new_angle = Math.PI + bar_ratio * Math.PI / 4;
				this.state.ball.vx = Math.cos(new_angle);
				this.state.ball.vy = Math.sin(new_angle);
				if (this.intern.ball.speed < this.limit.speed)
					this.intern.ball.speed +=  this.intern.ball.speed / 20;
			}
		}
	}

	private endGame()
	{
		this.stop();
		if (this.state.score.playerLeft > 10)
			this.state.score.playerLeft = 10;
		if (this.state.score.playerRight > 10)
			this.state.score.playerRight = 10;
		const matchmakingSocket = this.getMatchmakingSocket();
		if (matchmakingSocket) {
			matchmakingSocket.emit("game-end", {
				gameId: this.id,
				score: this.state.score
			});
		}
	}

	private updateScore()
	{
        this.pause.bool = true;

        if (this.state.ball.x <= this.limit.map.left + (this.intern.ball.width / 2))
            this.state.score.playerRight += 1;
        else if (this.state.ball.x >= this.limit.map.right - (this.intern.ball.width / 2))
            this.state.score.playerLeft += 1;
		
		if ((this.state.score.playerRight >= 10 || this.state.score.playerLeft >= 10) || this.limit.timer <= 0)
		{
			this.endGame();
		}
		this.state.ball.x = this.limit.map.left + (this.limit.map.right - this.limit.map.left) / 2;
		this.state.ball.y = this.limit.map.top + (this.limit.map.bot - this.limit.map.top) / 2;

		let new_angle = Math.random() * Math.PI;
		if (new_angle > 0.25 * Math.PI)
			new_angle += Math.PI * 0.5;
		if (new_angle > 1.25 * Math.PI)
			new_angle += Math.PI * 0.5;
		this.state.ball.vx = Math.cos(new_angle);
		this.state.ball.vy = Math.sin(new_angle);
		this.intern.ball.speed = (this.limit.map.right - this.limit.map.left) / 250;
	}
  
	public handleInput(input: { direction: string, state: boolean, player: string}) {
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

	public handleAbandon(side: string) {
		if (side === "right") {
			this.state.score.playerLeft = 10;
		} else if (side === "left") {
			this.state.score.playerRight = 10;
		} else {
			this.state.score.playerLeft = 10;
			this.state.score.playerRight = 11;
		}
		this.updateScore();
	}
  
	private stop() {
		clearInterval(this.interval);
		clearInterval(this.time);
		console.log(`[${this.id}] GameLoop end`);
	}
  }