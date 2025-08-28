import { Component } from "../route/component.js"
import { router } from "../route/router.js";
import {wait} from "../route/wait.js";

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
	private inGame: number = 0;
    private side: string | null = null;
    private mode: string | null;
    private leftBar!: Bar;
    private rightBar!: Bar;
    private ball!: Ball;
    private rafId = 0;
    private imgPong: HTMLImageElement;
    private leftBEle: HTMLElement;
    private rightBEle: HTMLElement;
    private ballEle: HTMLElement;
    private scorePlayer1: HTMLElement;
    private scorePlayer2: HTMLElement;
	private timer: HTMLElement;
    private loadingEle: HTMLElement;
    private winEle: HTMLElement;
    private loseEle: HTMLElement;
    private backPongEle: HTMLElement;
    private quitPongEle: HTMLElement;
    private endEle: HTMLElement;
    private videoMainEle: HTMLElement;
    private backRect!: DOMRect;

	private socket = io(`/`, {
		transports: ["websocket", "polling"],
		withCredentials: true,
        path: "/wss/matchmaking"
	});
    
    constructor(leftBarId: string, rightBarId: string, ballId: string,containerId: string, scorePlayer1: string, scorePlayer2: string, timer: string,
            backPong: string, quitPong: string, loading: string, win: string, lose: string, end: string, video_main: string, mode: string | null) {
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

        const score_player2 = document.getElementById(scorePlayer2);
        if(!score_player2) {
            throw new Error('Score Player 2 not found');
        }

		const timerElement = document.getElementById(timer);
		if(!timerElement) {
			throw new Error('Timer element not found');
		}

		const loadingElement = document.getElementById(loading);
		if(!loadingElement) {
			throw new Error('Loading element not found');
		}

		const winElement = document.getElementById(win);
		if(!winElement) {
			throw new Error('Win element not found');
		}

		const loseElement = document.getElementById(lose);
		if(!loseElement) {
			throw new Error('Lose element not found');
		}

		const backPongElement = document.getElementById(backPong);
		if(!backPongElement) {
			throw new Error('Back Pong element not found');
		}

		const quitPongElement = document.getElementById(quitPong);
		if(!quitPongElement) {
			throw new Error('Quit Pong element not found');
		}

        const endElement = document.getElementById(end);
        if(!endElement) {
            throw new Error('End element not found');
        }

        const videoMainElement = document.getElementById(video_main);
        if(!videoMainElement) {
            throw new Error('Video Main element not found');
        }

        this.leftBEle = leftBarElement;
        this.rightBEle = rightBarElement;
        this.ballEle = ballElement;
        this.scorePlayer1 = score_player1;
        this.scorePlayer2 = score_player2;
		this.timer = timerElement;
		this.loadingEle = loadingElement;
		this.winEle = winElement;
		this.loseEle = loseElement;
		this.backPongEle = backPongElement;
		this.quitPongEle = quitPongElement;
        this.endEle = endElement;
        this.videoMainEle = videoMainElement;
        this.imgPong = document.getElementById(containerId) as HTMLImageElement;

        this.mode = mode;

        this.backPongEle.addEventListener('click', this.handleBackPongClick);
        this.quitPongEle.addEventListener('click', this.handleQuitPongClick);
    }

    private handleBackPongClick = () => {
        if (this.mode !== "private") {
            if (this.socket && this.socket.connected) {
                this.socket.emit("abandon");
            } else {
                console.error("Socket is not connected");
            }
            router.navigateTo("/Pong?mode=" + this.mode);
        }
    };
    
    private handleQuitPongClick = () => {
        if (this.socket && this.socket.connected) {
            this.socket.emit("abandon");
        } else {
            console.error("Socket is not connected");
        }
    
        if (this.mode !== "private") {
            router.navigateTo("/game");
        } else {
            router.navigateTo("/game#tournament");
        }
    };

    private infoUser = () => {
        this.videoMainEle.style.display = "none";
    }

    private activateInfoUserOnce = () =>  {
        const imgRect = this.imgPong.getBoundingClientRect();

		const width = imgRect.width * 0.4;
		const height = imgRect.height * 0.4;

		this.videoMainEle.style.width = `${width}px`;
		this.videoMainEle.style.height = `${height}px`;
		this.videoMainEle.style.top = `${imgRect.top + imgRect.height * 0.499416569 - height / 2}px`;
		this.videoMainEle.style.left = `${imgRect.left + imgRect.width * 0.41 - width / 2}px`;
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

	private loadingScreen = () => {
		const imgRect = this.imgPong.getBoundingClientRect();

		const width = imgRect.width * 0.5;
		const height = imgRect.height * 0.5;

		this.loadingEle.style.width = `${width}px`;
		this.loadingEle.style.height = `${height}px`;
		this.loadingEle.style.top = `${imgRect.top + imgRect.height * 0.499416569 - height / 2}px`;
		this.loadingEle.style.left = `${imgRect.left + imgRect.width * 0.404052734 - width / 2}px`;

		if (this.inGame == 0) {
			this.loadingEle.style.display = "inline";
			this.hidePong();
		}
	}


    private endScreen = () => {
        const imgRect = this.imgPong.getBoundingClientRect();

		const width = imgRect.width * 0.5;
		const height = imgRect.height * 0.5;

		this.winEle.style.width = `${width}px`;
		this.winEle.style.height = `${height}px`;
		this.winEle.style.top = `${imgRect.top + imgRect.height * 0.499416569 - height / 2}px`;
		this.winEle.style.left = `${imgRect.left + imgRect.width * 0.404052734 - width / 2}px`;

        this.loseEle.style.width = `${width}px`;
		this.loseEle.style.height = `${height}px`;
		this.loseEle.style.top = `${imgRect.top + imgRect.height * 0.499416569 - height / 2}px`;
		this.loseEle.style.left = `${imgRect.left + imgRect.width * 0.404052734 - width / 2}px`;

        this.endEle.style.fontSize = `${width * 0.2}px`;
        this.endEle.style.top = `${imgRect.top + imgRect.height * 0.3}px`;
        this.endEle.style.left = `${imgRect.left + imgRect.width * 0.12}px`;
    }

	private buttonResize = () => {
		const imgRect = this.imgPong.getBoundingClientRect();

		const width = imgRect.width * 0.073242188;
		const height = imgRect.height * 0.175029172;

		this.backPongEle.style.width = `${width}px`;
		this.backPongEle.style.height = `${height}px`;
		this.backPongEle.style.top = `${imgRect.top + imgRect.height * 0.55 - height / 2}px`;
		this.backPongEle.style.left = `${imgRect.left + imgRect.width * 0.844726563 - width / 2}px`;

		this.quitPongEle.style.width = `${width}px`;
		this.quitPongEle.style.height = `${height}px`;
		this.quitPongEle.style.top = `${imgRect.top + imgRect.height * 0.55 - height / 2}px`;
		this.quitPongEle.style.left = `${imgRect.left + imgRect.width * 0.937 - width / 2}px`;
	}


    public init(): void{
        if (this.mode)
		    this.socket.emit(this.mode);
        else
            this.socket.emit("error");

        this.videoMainEle.style.display = "none";
        this.imgPong.onload = () => {
            this.activateInfoUserOnce();
			this.winEle.style.display = "none";
			this.loseEle.style.display = "none";
            this.endEle.style.display = "none";
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
            window.addEventListener('keydown', this.infoUser);
			window.addEventListener('keyup', this.boundKeyUpHandler);
			window.addEventListener('resize', this.barResize);
			window.addEventListener('resize', this.loadingScreen);
            window.addEventListener('resize', this.endScreen);
			window.addEventListener('resize', this.buttonResize);

			this.barResize();
			this.loadingScreen();
            this.endScreen();
			this.buttonResize();
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

    private hidePong = () => {
        this.leftBEle.style.display = "none";
        this.rightBEle.style.display = "none";
        this.ballEle.style.display = "none";
        this.scorePlayer1.style.display = "none";
        this.scorePlayer2.style.display = "none";
		this.timer.style.display = "none";
    }

    private showPong = () => {
        this.leftBEle.style.display = "block";
        this.rightBEle.style.display = "block";
        this.ballEle.style.display = "block";
        this.scorePlayer1.style.display = "block";
        this.scorePlayer2.style.display = "block";
		this.timer.style.display = "block";
    }

    private gameLoop = () => {

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

		this.scorePlayer1.style.fontSize = `${imgWidth * 0.25}px`;
		this.scorePlayer1.style.top = `${imgTop}px`;
		this.scorePlayer1.style.left = `${imgLeft + imgWidth * 0.222045898 - this.scorePlayer1.getBoundingClientRect().width * 0.5}px`; // position horizontale

		this.scorePlayer2.style.fontSize = `${imgWidth * 0.25}px`;
		this.scorePlayer2.style.top = `${imgTop}px`;
		this.scorePlayer2.style.left = `${imgLeft + imgWidth * 0.58605957 - this.scorePlayer2.getBoundingClientRect().width * 0.5}px`;

		this.timer.style.fontSize = `${imgWidth * 0.07}px`;
		this.timer.style.top = `${imgTop}px`;
		this.timer.style.left = `${imgLeft + imgWidth * 0.404052734 - this.timer.getBoundingClientRect().width / 2}px`;
    };

    private updateScore(newScore_player1: number, newScore_player2: number) {
        this.scorePlayer1.textContent = newScore_player1.toString();
        this.scorePlayer2.textContent = newScore_player2.toString();
    }

    private updateHandler() {
        let gameId: string;

        let ball = { x: 0, y: 0 };

        this.socket.on("game-started", (data: { gameId: string, side: string}) => {
          gameId = data.gameId;
          this.side = data.side;
          this.inGame = 1;
		  this.showPong();
		  this.loadingEle.style.display = "none";
          this.videoMainEle.style.display = "inline";
        });

        this.socket.on("game-update", (data: { gameId: string, time: number, state: {
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
				if (data.time >= 0)
                    this.timer.textContent = data.time.toString();
				else
                    this.timer.textContent = `Extra Time`;
                this.rafId = requestAnimationFrame(this.gameLoop);
            }
            if (data && data.state && data.state.score)
        		this.updateScore(data.state.score.playerLeft, data.state.score.playerRight);
        });

        this.socket.on("connect_error", (err: any) => {
            console.error("Connection error:", err);
        });

        this.socket.on("game-end", async (score: {playerLeft: number, playerRight: number}) => {
			this.inGame = 2;
            if (this.side === "left" && score.playerLeft > score.playerRight ||
                this.side === "right" && score.playerLeft < score.playerRight) {
                this.winEle.style.display = "inline";
                this.endScreen();
            } else if (this.side === "undefined" || this.side === null) {
                if (score.playerLeft > score.playerRight) {
                    this.endEle.textContent = "Player Left wins!";
                }
                else if (score.playerLeft < score.playerRight) {
                    this.endEle.textContent = "Player Right wins!";
                }
				if (score.playerLeft != score.playerRight)
                	this.endEle.style.display = "inline";
            }
            else {
                this.loseEle.style.display = "inline";
                this.endScreen();
            }
            this.hidePong();

			await wait(2000);
			if (this.mode == "private" && (window.location.pathname + window.location.hash) !== "/game#tournament") {
				router.navigateTo("/game#tournament")
			}
        })
    }
    
    public destroy(): void {
        if (this.backPongEle) {
            this.backPongEle.removeEventListener('click', this.handleBackPongClick);
        }
    
        if (this.quitPongEle) {
            this.quitPongEle.removeEventListener('click', this.handleQuitPongClick);
        }
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keydown', this.infoUser);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('resize', this.barResize);
		window.removeEventListener('resize', this.loadingScreen);
        window.removeEventListener('resize', this.endScreen);
		window.removeEventListener('resize', this.buttonResize);
        cancelAnimationFrame(this.rafId);
		this.socket.removeAllListeners();
		this.socket.disconnect();
    }
}
