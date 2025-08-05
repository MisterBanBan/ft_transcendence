import { Component } from "./component.js"
import {router} from "./router.js";

declare const io: any;

interface Position {
    x: number;
    y: number;
}

class Ball {
    position: Position = {x: 0, y: 0};
    height: number;

    constructor(public element: HTMLElement) {
        this.height = element.offsetHeight;
        this.element.style.willChange = "transform";
    }
}

class Bar {
    position: Position = {x: 0, y: 0};
    upKeyPress: boolean = false;
    downKeyPress: boolean = false;
    height: number;

    constructor(public element: HTMLElement) {
        this.height = element.offsetHeight;
        this.element.style.willChange = "transform";
    }
}

export class pong implements Component {
    private boundKeyDownHandler!: (e: KeyboardEvent) => void;
    private boundKeyUpHandler!: (e: KeyboardEvent) => void;
    private mode: string | null;
    private scorePlayer1: HTMLElement;
    private scorePlayer2: HTMLElement;
    private leftBar!: Bar;
    private rightBar!: Bar;
    private ball!: Ball;
    private rafId = 0;
    private imgPong: HTMLImageElement;
    private leftBEle: HTMLElement;
    private rightBEle: HTMLElement;
    private ballEle: HTMLElement;
    private backRect!: DOMRect;
    private backButton!: HTMLElement;
	private socket = io(`/`, {
		transports: ["websocket", "polling"],
		withCredentials: true,
        path: "/wss/matchmaking"
	});
    
    constructor(leftBarId: string, rightBarId: string, ballId: string, imgPongId: string,containerId: string, scorePlayer1: string, scorePlayer2: string, mode: string | null) {
        const leftBarElement = document.getElementById(leftBarId);
        if(!leftBarElement) {
            throw new Error('Left bar not found');
        }
        
        const rightBarElement = document.getElementById(rightBarId);
        if(!rightBarElement) {
            throw new Error('Right bar not found');
        }
        
        const ballElement = document.getElementById(ballId);
        if(!ballElement) {
            throw new Error('Ball not found');
        }

        const  score_player1 = document.getElementById(scorePlayer1);
        if(!score_player1) {
            throw new Error('Score Player 1 not found');
        }
        this.scorePlayer1 = score_player1;

        const score_player2 = document.getElementById(scorePlayer2);
        if(!score_player2) {
            throw new Error('Score Player 2 not found');
        }
        this.scorePlayer2 = score_player2;

        this.leftBEle = leftBarElement;
        this.rightBEle = rightBarElement;
        this.ballEle = ballElement;
        this.imgPong = document.getElementById(containerId) as HTMLImageElement;

        this.mode = mode;

    }
    
    private barResize = () => {
        const imgRect = this.imgPong.getBoundingClientRect();
        
        const imgTop = imgRect.top;
        const imgWidth = imgRect.width;
        const imgHeight = imgRect.height;

        const barWidth = imgWidth * 0.01;
        const barHeight = imgHeight * 0.2;
        //definir la taille des barres en fonction de la taille de la fenetre
        this.leftBar.element.style.width = `${barWidth}px`;
        this.leftBar.element.style.height = `${barHeight}px`;
        this.rightBar.element.style.width = `${barWidth}px`;
        this.rightBar.element.style.height = `${barHeight}px`;
        this.ball.element.style.width = `${imgHeight * 0.05}px`;
        this.ball.element.style.height = `${imgHeight * 0.05}px`;
        
        // Position horizontale (15% et 85% de la largeur de l'image)
        this.leftBar.height = barHeight;
        this.rightBar.height = barHeight;
        this.ball.height = imgHeight * 0.05;
        
        // Position verticale (definie entre 10% et 90% de la hauteur de l'image)
        const margin = imgHeight * 0.1;
        const maxY = imgHeight - this.leftBar.height - margin;
        this.leftBar.position.y = Math.max(margin, Math.min(maxY, this.leftBar.position.y));
        this.rightBar.position.y = Math.max(margin, Math.min(maxY, this.rightBar.position.y));
        this.ball.position.y = Math.max(margin, Math.min(imgHeight - this.ball.height - margin, this.ball.position.y));

        // Applique la position en pixels par rapport au top de l'image
        this.leftBar.element.style.top  = `${imgTop + this.leftBar.position.y}px`;
        this.rightBar.element.style.top = `${imgTop + this.rightBar.position.y}px`;
        this.ball.element.style.top = `${imgTop + this.ball.position.y}px`;

    }


    public init(): void{
        if (this.mode)
		    this.socket.emit(this.mode);
        else
            this.socket.emit("error");

		this.imgPong.onload = () => {
			this.leftBar = new Bar(this.leftBEle);
			this.rightBar = new Bar(this.rightBEle);
			this.ball = new Ball(this.ballEle);
			this.backRect = this.imgPong.getBoundingClientRect();
			const backRectHeight = this.backRect.height;
			const margin = backRectHeight * 0.1;
			const centerY = margin +(backRectHeight - margin * 2 - this.leftBar.height) / 2;
			this.leftBar.position.y = centerY; // changer pour des valeurs exacts plus tard
			this.rightBar.position.y = centerY;
			this.ball.position.y = centerY;

			this.boundKeyDownHandler = this.onKeyDown.bind(this);
			this.boundKeyUpHandler = this.onKeyUp.bind(this);
			window.addEventListener('keydown', this.boundKeyDownHandler);
			window.addEventListener('keyup', this.boundKeyUpHandler);
			window.addEventListener('resize', this.barResize);
			const backButton = document.getElementById('backPong');
            if (backButton) {
                this.backButton = backButton;
                this.backButton.addEventListener('click', () => {
					router.navigateTo("/game");
                });
            }

			this.barResize();
			this.updateHandler();
		};

        if (this.imgPong.complete && this.imgPong.onload) {
			this.imgPong.onload(new Event("load"));
		}
    }
    private onKeyDown = (e: KeyboardEvent) => {
		const k = e.key.toLowerCase();
		if (k === "w".toLowerCase() && !this.leftBar.upKeyPress) {
			this.leftBar.upKeyPress = true;
			this.socket.emit("player-input", { direction: "up", state: true, player: "left"} );
		}
		if (k === "s".toLowerCase() && !this.leftBar.downKeyPress) {
			this.leftBar.downKeyPress = true;
			this.socket.emit("player-input", { direction: "down", state: true, player: "left"} );
		}

		if (k === "ArrowUp".toLowerCase() && !this.rightBar.upKeyPress) {
			this.rightBar.upKeyPress = true;
			this.socket.emit("player-input", { direction: "up", state: true, player: "right"} );
		}
		if (k === "ArrowDown".toLowerCase() && !this.rightBar.downKeyPress) {
			this.rightBar.downKeyPress = true;
			this.socket.emit("player-input", { direction: "down", state: true, player: "right"} );
		}
    };
    
    private onKeyUp = (e: KeyboardEvent) => {
        const k = e.key.toLowerCase();
		if (k === "w".toLowerCase() && this.leftBar.upKeyPress) {
			this.leftBar.upKeyPress = false;
			this.socket.emit("player-input", { direction: "up", state: false, player: "left"} );
		}
		if (k === "s".toLowerCase() && this.leftBar.downKeyPress) {
			this.leftBar.downKeyPress = false;
			this.socket.emit("player-input", { direction: "down", state: false, player: "left"} );
		}

		if (k === "ArrowUp".toLowerCase() && this.rightBar.upKeyPress) {
			this.rightBar.upKeyPress = false;
			this.socket.emit("player-input", { direction: "up", state: false, player: "right"} );
		}
		if (k === "ArrowDown".toLowerCase() && this.rightBar.downKeyPress) {
			this.rightBar.downKeyPress = false;
			this.socket.emit("player-input", { direction: "down", state: false, player: "right"} );
		}
    };
    
    private gameLoop = () => {
    
        // Mesure la position réelle de l'image
        this.backRect = this.imgPong.getBoundingClientRect();
        const imgTop = this.backRect.top;
        const imgLeft = this.backRect.left;
        const imgWidth = this.backRect.width;
    
        // Update barres
		// place bar to 10% and 90% of the map
		this.leftBar.position.x = imgWidth * 0.11284179687 - imgWidth * 0.01;
		this.rightBar.position.x = imgWidth * 0.69526367187;
        
		[this.leftBar, this.rightBar, this.ball].forEach((bar, i) => {
            bar.element.style.left = `${imgLeft + bar.position.x}px`;
            bar.element.style.top = `${imgTop + bar.position.y}px`;
        });

		this.scorePlayer1.style.fontSize = `${imgWidth * 0.25}px`; // taille de la police
		this.scorePlayer1.style.top = `${imgTop}px`;   // position verticale
		this.scorePlayer1.style.left = `${imgLeft + imgWidth * 0.222045898 - this.scorePlayer1.getBoundingClientRect().width * 0.5}px`; // position horizontale

		this.scorePlayer2.style.fontSize = `${imgWidth * 0.25}px`; // taille de la police
		this.scorePlayer2.style.top = `${imgTop}px`;
		this.scorePlayer2.style.left = `${imgLeft + imgWidth * 0.58605957 - this.scorePlayer2.getBoundingClientRect().width * 0.5}px`;
    };

    private updateScore(newScore_player1: number, newScore_player2: number) {
        this.scorePlayer1.textContent = newScore_player1.toString();
        this.scorePlayer2.textContent = newScore_player2.toString();
    }

    private updateHandler() {
        let gameId: string;
        let playerId: string[];

        let ball = { x: 0, y: 0 };

        this.socket.on("connect", () => {
          console.log("Connected with id:", this.socket.id);
        });

        this.socket.on("game-started", (data: { gameId: string, playerId: string[]}) => {
          gameId = data.gameId;
          playerId = data.playerId;
          console.log("Game started! Game ID:", gameId, "Player ID:", playerId);
        });

        this.socket.on("game-update", (data: { gameId: string, state: {
			bar: { left: number, right: number},
        	ball: { x: number, y: number},
        	score: {playerLeft: number, playerRight: number}}}) => {
        	if (data && data.state && data.state.ball) {
            	ball = data.state.ball;

				// img ball pos = ball pos * ratio current_size and base_size - ball size / 2
                this.ball.position.x =  data.state.ball.x * this.backRect.width / 4096 - (this.ball.height * 0.5);
                this.ball.position.y = data.state.ball.y * this.backRect.height / 1714 - (this.ball.height * 0.5);
				this.leftBar.position.y = data.state.bar.left * this.backRect.height / 1714 - (this.leftBar.height * 0.5) ;
				this.rightBar.position.y = data.state.bar.right * this.backRect.height / 1714 - (this.rightBar.height * 0.5);
				this.rafId = requestAnimationFrame(this.gameLoop);
            }
            // console.log(data.state);
            if (data && data.state && data.state.score)
        		this.updateScore(data.state.score.playerLeft, data.state.score.playerRight);
		// console.log("Game Update - Ball:", ball);
        });

        this.socket.on("connect_error", (err: any) => {
            console.error("Connection error:", err);
        });

        this.socket.on("game-end", (score: {playerLeft: number, playerRight: number}) => {
            console.log("Game end with a score of ", score.playerLeft, ":", score.playerRight);
        })
    }
    
    public destroy(): void {
		console.log("Destroy pong")
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('resize', this.barResize);
        cancelAnimationFrame(this.rafId);
		this.socket.removeAllListeners();
		this.socket.disconnect();
    }
}