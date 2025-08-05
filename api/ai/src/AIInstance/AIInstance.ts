import { Socket } from "socket.io";
import { bar, ball, limit, input } from "../utils/interface";

export class AIInstance {
	private interval!: NodeJS.Timeout;
	private updateInterval!: NodeJS.Timeout;
	private bar: bar;
	private ball: ball;
	private limit: limit;
	private input: input; 
	private cooldown: boolean;

	constructor(
	  public id: string,
	  private io: any,
	  private getMatchmakingSocket: () => Socket | null
	) {
		this.limit = {
			map: {
				left: 164,
				top: 123,
				right: 3146,
				bot: 1590
			},
			ball: {
				width: 85.7,
				height: 85.7
			}
		};	
		this.bar = {
			left: {
				y: (this.limit.map.bot - this.limit.map.top) / 2,
				x: (this.limit.map.right - this.limit.map.left) / 10
			},
			right: {
				y: (this.limit.map.bot - this.limit.map.top) / 2,
				x: this.limit.map.right - (this.limit.map.right - this.limit.map.left) / 10
			},
			width: 40.96,
			height: 342.8,
			speed: (this.limit.map.bot - this.limit.map.top) / 60
		};
		this.ball = {
			x: (this.limit.map.right - this.limit.map.left) / 2,
			y: (this.limit.map.bot - this.limit.map.top) / 2,
			vx: Math.cos(Math.PI / 4),
			vy: Math.sin(Math.PI / 4)
		};
		this.input = {
			up: false,
			down: false
		};

		this.cooldown = true;

		this.startAILoop();
		this.startUpdateLoop();
	}
  
	private startAILoop() {
		console.log(`[${this.id}] startAILoop called`);
		this.interval = setInterval(() => {
			this.updateAI();
		}, 1000 / 60);
	}
  
	private startUpdateLoop() {
		console.log(`[${this.id}] startUpdateLoop called`);
		this.updateInterval = setInterval(() => {
			this.cooldown = true;
		}, 1000);
	}

	private updateAI() {
		
		if (this.ball.vx < 0)
		{
			this.replaceBar();
		}
		else
		{
			this.barMovement();
		}

		if (this.input.up)
			this.bar.right.y -= this.bar.speed;
		if (this.input.down)
			this.bar.right.y += this.bar.speed;
	}

	private replaceBar() {

		const dist = this.bar.right.y - (this.limit.map.top + (this.limit.map.bot - this.limit.map.top) / 2);
		
		if ( dist >= this.bar.speed )
		{
			this.sendUpdate(true, false);
		}
		else if ( dist <= -this.bar.speed )
		{
			this.sendUpdate(false, true);
		}
		else
		{
			this.sendUpdate(false, false);
		}
	}

	private barMovement() {

		const intersectionY = this.findIntersection();
		const pos = this.aimOpposite(intersectionY);

		const dist = this.bar.right.y - pos;
		
		if ( dist >= this.bar.speed )
		{
			this.sendUpdate(true, false);
		}
		else if ( dist <= -this.bar.speed )
		{
			this.sendUpdate(false, true);
		}
		else
		{
			this.sendUpdate(false, false);
		}
	}

	private findIntersection() {

		const limit_x = this.bar.right.x - this.limit.ball.width / 2;
		const dx = limit_x - this.ball.x;
		const steps = dx / this.ball.vx;

		let y = this.ball.y + this.ball.vy * steps;

		const height = this.limit.map.bot - this.limit.map.top;
		const range = 2 * height;
	  
		y = y - this.limit.map.top;
	  
		y = y % range;
		if (y < 0) y += range;
	  
		if (y > height) {
		  y = range - y;
		}
		
		return (y + this.limit.map.top);
	}

	private aimOpposite(destY: number): number {

		const distTop = this.bar.left.y - this.limit.map.top;
		const distBot = this.limit.map.bot - this.bar.left.y;
	
		const aimPoint = (distTop > distBot) 
			? this.limit.map.top + this.limit.ball.height / 2
			: this.limit.map.bot - this.limit.ball.height / 2;
	
		const deltaY = aimPoint - destY;
		const deltaX = this.bar.left.x - this.bar.right.x;

		let angle = Math.atan2(deltaY, deltaX);
		angle = (angle < 0) ? angle + 2 * Math.PI : angle;
	
		const barRatio = 4 * (angle - Math.PI) / Math.PI;
    	const centerDist = barRatio * (this.bar.height / 2);
	
		return destY + centerDist;
	}

	private sendUpdate(up: boolean, down: boolean) {

		if (up != this.input.up)
		{
			const matchmakingSocket = this.getMatchmakingSocket();
			if (matchmakingSocket) {
				matchmakingSocket.emit("player-input", {
					gameId: this.id,
					input: {
						direction: "up",
						state: up,
						player: "right"
					}
				});
	  		}
		}

		if (down != this.input.down)
		{
			const matchmakingSocket = this.getMatchmakingSocket();
			if (matchmakingSocket) {
				matchmakingSocket.emit("player-input", {
					gameId: this.id,
					input: {
						direction: "down",
						state: down,
						player: "right"
					},
				});
			}
		}

		this.input.up = up;
		this.input.down = down;	
	}

	public handleUpdate( 
			state: { 
				bar: {
					left: number,
					right: number
				},
				ball: {
					x: number,
					y: number,
					vx: number,
					vy: number
				},
				score: {
					player1: number,
					player2: number
				} 
			} ) {
		if (this.cooldown == true)
		{
			this.ball = state.ball;
			this.bar.left.y = state.bar.left;
			this.bar.right.y = state.bar.right;
			this.ball.vx = state.ball.vx;
			this.ball.vy = state.ball.vy;

			this.cooldown = false;
		}
	}
  
	public stop() {
		console.log(`[${this.id}] AILoop end`);
		clearInterval(this.interval);
		clearInterval(this.updateInterval);
	}
  }