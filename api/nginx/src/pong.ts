/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 15:16:55 by mtbanban          #+#    #+#             */
/*   Updated: 2025/05/20 11:22:27 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js"

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

    // update(dt: number, containerHeight: number) {
    //     const margin = containerHeight * 0.1;
    //     const maxY   = containerHeight - this.height - margin;

    //     this.position.y = Math.max(margin, Math.min(maxY, this.position.y));
    //     this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

    // }
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

    // update(dt: number, containerHeight: number) {
    //     const margin = containerHeight * 0.1;
    //     const maxY   = containerHeight - this.height - margin;

    //     this.position.y = Math.max(margin, Math.min(maxY, this.position.y));

    //     this.element.style.transform = `translateY(${this.position.y}px)`;
    // }
}

function handleKeyPress(bar: Bar, upKey: string, downKey: string, e: KeyboardEvent) {
        const k = e.key.toLowerCase();
    if (k === upKey.toLowerCase() && !bar.upKeyPress) {
        bar.upKeyPress = true;
    }
    if (k === downKey.toLowerCase() && !bar.downKeyPress) {
        bar.downKeyPress = true;
    }
}

function handleKeyRelease(bar: Bar, upKey: string, downKey: string, e: KeyboardEvent) {
        const k = e.key.toLowerCase();
    if (k === upKey.toLowerCase() && bar.upKeyPress) {
        bar.upKeyPress = false;
    }
    if (k === downKey.toLowerCase() && bar.downKeyPress) {
        bar.downKeyPress = false;
    }
}

export class pong implements Component {
    private boundKeyDownHandler!: (e: KeyboardEvent) => void;
    private boundKeyUpHandler!: (e: KeyboardEvent) => void;
    private leftBar!: Bar;
    private rightBar!: Bar;
    private ball!: Ball;
    private rafId = 0;
    private lastTime = 0;
    private imgPong: HTMLImageElement;
    private leftBEle: HTMLElement;
    private rightBEle: HTMLElement;
    private ballEle: HTMLElement;
    private backRect!: DOMRect;
    
    constructor(leftBarId: string, rightBarId: string, ballId: string, imgPongId: string,containerId: string) {
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
            throw new Error('Right bar not found');
        }

        this.leftBEle = leftBarElement;
        this.rightBEle = rightBarElement;
        this.ballEle = ballElement;
        this.imgPong = document.getElementById(imgPongId) as HTMLImageElement;

    }
    
    private barResize = () => {
        const imgRect = this.imgPong.getBoundingClientRect();
        
        const imgTop = imgRect.top;
        const imgWidth = imgRect.width;
        const imgHeight = imgRect.height;

        const barWidth = imgWidth * 0.02;
        const barHeight = imgHeight * 0.2;
        console.log(": %d : %d", barHeight, barWidth);
        //definir la taille des barres en fonction de la taille de la fenetre
        this.leftBar.element.style.width = `${barWidth}px`;
        this.leftBar.element.style.height = `${barHeight}px`;
        this.rightBar.element.style.width = `${barWidth}px`;
        this.rightBar.element.style.height = `${barHeight}px`;
        this.ball.element.style.width = `${barHeight * 0.5}px`;
        this.ball.element.style.height = `${barHeight * 0.5}px`;
        
        // Position horizontale (15% et 85% de la largeur de l'image)
        this.leftBar.height = barHeight;
        this.rightBar.height = barHeight;
        this.ball.height = barHeight;
        
        // Position verticale (definie entre 10% et 90% de la hauteur de l'image)
        const margin = imgHeight * 0.1;
        const maxY = imgHeight - this.leftBar.height - margin;
        this.leftBar.position.y = Math.max(margin, Math.min(maxY, this.leftBar.position.y));
        this.rightBar.position.y = Math.max(margin, Math.min(maxY, this.rightBar.position.y));
        this.ball.position.y = Math.max(margin, Math.min(maxY, this.ball.position.y));

        // Applique la position en pixels par rapport au top de l'image
        this.leftBar.element.style.top  = `${imgTop + this.leftBar.position.y}px`;
        this.rightBar.element.style.top = `${imgTop + this.rightBar.position.y}px`;
        this.ball.element.style.top = `${imgTop + this.ball.position.y}px`;

    }
    
    public init(): void{
        this.imgPong.onload = () => {
            this.leftBar = new Bar(this.leftBEle);
            this.rightBar = new Bar(this.rightBEle);
            this.ball = new Ball(this.ballEle);
            
            this.backRect = this.imgPong.getBoundingClientRect();
            const backRectHeight = this.backRect.height;
            const margin = backRectHeight * 0.1;
            const centerY = margin +(backRectHeight - margin * 2 - this.leftBar.height) / 2;
            this.leftBar.position.y = centerY;
            this.rightBar.position.y = centerY;
            this.ball.position.y = centerY;
    
            window.addEventListener('resize', this.barResize);
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp);
            this.barResize();
            
            // this.rafId    = requestAnimationFrame(this.gameLoop);
			this.socketfct();
            
            };
            
            if (this.imgPong.complete && this.imgPong.onload) {
                this.imgPong.onload(new Event("load"));
            }
    }
    private onKeyDown = (e: KeyboardEvent) => {
        handleKeyPress(this.leftBar, "w", "s", e);
        handleKeyPress(this.rightBar, "ArrowUp", "ArrowDown", e);
    };
    
    private onKeyUp = (e: KeyboardEvent) => {
        handleKeyRelease(this.leftBar,  "w",        "s",        e);
        handleKeyRelease(this.rightBar, "ArrowUp",  "ArrowDown", e);
    };
    
    private gameLoop = (timestamp: number) => {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
    
        // Mesure la position réelle de l'image
        this.backRect = this.imgPong.getBoundingClientRect();
        const imgTop = this.backRect.top;
        const imgLeft = this.backRect.left;
        const imgWidth = this.backRect.width;
        const imgHeight = this.backRect.height;
    
        // Clamp vertical
        const margin = imgHeight * 0.1;
        const maxY = imgHeight - this.leftBar.height - margin;
    
        // Update barres
        [this.leftBar, this.rightBar, this.ball].forEach((bar, i) => {
            // bar.position.y = Math.max(margin, Math.min(maxY, bar.position.y));
            if (i < 2)
            	bar.position.x = imgLeft + imgWidth * (i === 0 ? 0.05 : 0.65);

            bar.element.style.left = `${imgLeft + bar.position.x}px`;
            bar.element.style.top = `${imgTop + bar.position.y}px`;
        });
    
        // this.rafId = requestAnimationFrame(this.gameLoop);
    };
    
    private socketfct() {
        const socket = io("https://10.13.6.6:8083", {
          transports: ["websocket", "polling"],
          withCredentials: true,
        });

        let gameId: string | null = null;
        let playerId: string | null = null;

        let ball = { x: 0, y: 0 };

        let score_player1 = 0;
        let score_player2 = 0;

        function updateScore(newScore_player1: number, newScore_player2: number) {
        	score_player1 = newScore_player1;
        	score_player2 = newScore_player2;
        
        	const scoreElement_player1 = document.getElementById("score-player1");
        	if (scoreElement_player1) {
        		scoreElement_player1.textContent = score_player1.toString();
        	}
        
        	const scoreElement_player2 = document.getElementById("score-player2");
        	if (scoreElement_player2) {
        		scoreElement_player2.textContent = score_player2.toString();
        	}
        }

        socket.on("connect", () => {
          console.log("Connected with id:", socket.id);
        });

        socket.on("game-started", (data: any) => {
          gameId = data.gameId;
          playerId = data.playerId;
          console.log("Game started! Game ID:", gameId, "Player ID:", playerId);
        });

        socket.on("game-update", (data: { gameId: string, state: {
        	players: { id: string, x: number }[],
        	ball: { x: number, y: number, vx: number, vy: number },
        	score: {player1: number, player2: number}}}) => {
        	if (data && data.state && data.state.ball) {
            	ball = data.state.ball;
                this.ball.position.x = data.state.ball.x * (this.backRect.width / 4096);
                this.ball.position.y = data.state.ball.y * (this.backRect.height / 1714);
				this.rafId    = requestAnimationFrame(this.gameLoop);
            }
            if (data && data.state && data.state.score)
        		updateScore(data.state.score.player1, data.state.score.player2);
			// console.log("Game Update - Ball:", ball);
        });

        socket.on("connect_error", (err: any) => {
            console.error("Connection error:", err);
        });
    }
    
    public destroy(): void {
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('resize', this.barResize);
        cancelAnimationFrame(this.rafId);
    }
}