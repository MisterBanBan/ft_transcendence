import { Socket } from "socket.io";

export class AIInstance {
	private interval!: NodeJS.Timeout;
	bar: any;
	ball: any;
	private limit: any;
	private input: any;

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
	  
		this.startAILoop();
	}
  
	private startAILoop() {
		console.log(`[${this.id}] startAILoop called`);
		this.interval = setInterval(() => {
			this.updateAI();
		}, 1000 / 60);
	}
  
	private updateAI() {
		
		if (this.ball.new.x < this.ball.old.x)
		{
			this.replaceBar();
			return ;
		}

		const matchmakingSocket = this.getMatchmakingSocket();
		if (matchmakingSocket) {
		matchmakingSocket.emit("player-input", {
			gameId: this.id,
			input: this.input,
		});
	  }
	}

	private replaceBar() {

	}
  
	public handleUpdate(playerId: string, input: { direction: string, state: boolean, player: string}) {
		
	}
  
	private stop() {
	  clearInterval(this.interval);
	}
  }