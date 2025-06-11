import { Socket } from "socket.io";

export class AIInstance {
	private interval!: NodeJS.Timeout;
	private bar: any;
	private ball: any;
	private limit: any;
	private input: any;
	private cooldown: boolean;

	constructor(
	  public id: string,
	  private io: any,
	  private getMatchmakingSocket: () => Socket | null
	) {
		this.limit = {
			map: {left: 164, top: 123, right: 3146, bot: 1590}
		};	
		this.bar = {
			left: { y: (this.limit.map.bot - this.limit.map.top) / 2, x: (this.limit.map.right - this.limit.map.left) / 10 },
			right: { y: (this.limit.map.bot - this.limit.map.top) / 2, x: this.limit.map.right - (this.limit.map.right - this.limit.map.left) / 10 },
			width: 40.96,
			height: 342.8
		};
		this.ball = {
			old: { x: (this.limit.map.right - this.limit.map.left) / 2, y: (this.limit.map.bot - this.limit.map.top) / 2 },
			new: { x: (this.limit.map.right - this.limit.map.left) / 2, y: (this.limit.map.bot - this.limit.map.top) / 2 },
			width: 85.7,
			height: 85.7,
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
		this.interval = setInterval(() => {
			this.cooldown = true;
		}, 1000);
	}

	private updateAI() {
		
		if (this.ball.new.x < this.ball.old.x)
		{
			// console.log("test");
			this.replaceBar();
		}
		else
		{
			this.barMovement();
		}
	}

	private replaceBar() {
		const dist = this.bar.right.y - (this.limit.bot - this.limit.top) / 2;
		if ( dist >= 15 )
		{
			this.input = { up: true, down: false };
			this.sendUpdate(true, false);
		}
		else if ( dist <= 15 )
		{
			this.sendUpdate(false, true);
		}
		else
		{
			this.sendUpdate(false, false);
		}
	}

	private barMovement() {
		// if ( this.ball.old === this.ball.new )
		// 	return ;

		const intersectionY = this.findIntersection();

		// add strategy

		const dist = this.bar.right.y - intersectionY;
		if ( dist >= 15 )
		{
			this.sendUpdate(true, false);
		}
		else if ( dist <= 15 )
		{
			this.sendUpdate(false, true);
		}
		else
		{
			this.sendUpdate(false, false);
		}
	}

	private findIntersection() {
		let x = this.ball.new.x;
		let y = this.ball.new.y;

		while (x < this.bar.right - this.ball.width / 2)
		{
			x += this.ball.vx * 10;
			y += this.ball.vy * 10;
		}

		return (y);
	}
  
	private sendUpdate(up: boolean, down: boolean) {

		if (up != this.input.up)
		{
			const matchmakingSocket = this.getMatchmakingSocket();
			if (matchmakingSocket) {
				matchmakingSocket.emit("player-input", {
					gameId: this.id,
					input: { direction: "up", state: up, player: "right"},
				});
				console.log("test: ", this.id, { direction: "up", state: up, player: "right"});
	  		}
		}

		if (down != this.input.down)
		{
			const matchmakingSocket = this.getMatchmakingSocket();
			if (matchmakingSocket) {
				matchmakingSocket.emit("player-input", {
					gameId: this.id,
					input: { direction: "down", state: down, player: "right"},
				});
				console.log("test: ", this.id, { direction: "down", state: down, player: "right"});
			}
		}

		this.input.up = up;
		this.input.down = down;
		
	}

	public handleUpdate(
		data: { gameId: string, 
			state: { 
				players: any,
				bar: {left:  number, right: number },
				ball: { x: number, y: number },
				score: {player1: number, player2: number} } }) {
		console.log("JAMBON");
		if (this.cooldown == true)
		{
			this.ball.old = this.ball.new;

			this.ball.new = data.state.ball;
			this.bar.left.y = data.state.bar.left;
			this.bar.right.y = data.state.bar.right;
			
			const dx = this.ball.new.x - this.ball.old.x;
			const dy = this.ball.new.y - this.ball.old.y;

			const norme = Math.sqrt(dx * dx + dy * dy);
			this.ball.vx = dx / norme;
			this.ball.vy = dy / norme;

			this.cooldown = false;
		}
	}
  
	private stop() {
	  clearInterval(this.interval);
	}
  }