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

interface Position {
    x: number;
    y: number;
}

class Bar {
    position: Position = {x: 0, y: 0};
    velocity: Position = {x: 0, y: 0};
    upKeyPress: boolean = false;
    downKeyPress: boolean = false;
    speed: number = 800;
    height: number;

    constructor(public element: HTMLElement) {
        this.height = element.offsetHeight;
        this.element.style.willChange = "transform";
    }

    update(dt: number, containerHeight: number) {
        const margin = containerHeight * 0.1;       // 10 % haut + 10 % bas
        const maxY   = containerHeight - this.height - margin;

       this.position.y += this.velocity.y *dt;
        this.position.y = Math.max(margin, Math.min(maxY, this.position.y));

        this.element.style.transform = `translateY(${this.position.y}px)`;
    }
}

function handleKeyPress(bar: Bar, upKey: string, downKey: string, e: KeyboardEvent) {
        const k = e.key.toLowerCase();
    if (k === upKey.toLowerCase() && !bar.upKeyPress) {
        bar.upKeyPress = true;
        bar.velocity.y = -bar.speed;
    }
    if (k === downKey.toLowerCase() && !bar.downKeyPress) {
        bar.downKeyPress = true;
        bar.velocity.y = bar.speed;
    }
}

function handleKeyRelease(bar: Bar, upKey: string, downKey: string, e: KeyboardEvent) {
        const k = e.key.toLowerCase();
    if (k === upKey.toLowerCase() && bar.upKeyPress) {
        bar.upKeyPress = false;
        bar.velocity.y = bar.downKeyPress ? bar.speed : 0;
    }
    if (k === downKey.toLowerCase() && bar.downKeyPress) {
        bar.downKeyPress = false;
        bar.velocity.y = bar.upKeyPress ? -bar.speed : 0;
    }
}

export class pong implements Component {
    private boundKeyDownHandler!: (e: KeyboardEvent) => void;
    private boundKeyUpHandler!: (e: KeyboardEvent) => void;
    private leftBar!: Bar;
    private rightBar!: Bar;
    private rafId = 0;
    private lastTime = 0;
    //private container: HTMLElement;
    private imgPong: HTMLImageElement;
    private leftBEle: HTMLElement;
    private rightBEle: HTMLElement;
    private backRect!: DOMRect;
    //private first: boolean = false;
    
    constructor(leftBarId: string, rightBarId: string, imgPongId: string,containerId: string) {
        const leftBarElement = document.getElementById(leftBarId);
        if(!leftBarElement) {
            throw new Error('Left bar not found');
        }
        
        const rightBarElement = document.getElementById(rightBarId);
        if(!rightBarElement) {
            throw new Error('Right bar not found');
        }
        
        this.leftBEle = leftBarElement;
        this.rightBEle = rightBarElement;
        this.imgPong = document.getElementById(imgPongId) as HTMLImageElement;

    }
    
    private barResize = () => {
        const imgRect = this.imgPong.getBoundingClientRect();
        
        const imgTop = imgRect.top;
        //const imgLeft = imgRect.left;
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
        
        // Position horizontale (15% et 85% de la largeur de l'image)
        //this.leftBar.element.style.left  = `${imgLeft + imgWidth * 0.15}px`;
        //this.rightBar.element.style.left = `${imgLeft + imgWidth * 0.85}px`;
        this.leftBar.height = barHeight;
        this.rightBar.height = barHeight;
        
        // Position verticale (definie entre 10% et 90% de la hauteur de l'image)
        const margin = imgHeight * 0.1;
        const maxY = imgHeight - this.leftBar.height - margin;
        this.leftBar.position.y = Math.max(margin, Math.min(maxY, this.leftBar.position.y));
        this.rightBar.position.y = Math.max(margin, Math.min(maxY, this.rightBar.position.y));

        // Applique la position en pixels par rapport au top de l'image
        this.leftBar.element.style.top  = `${imgTop + this.leftBar.position.y}px`;
        this.rightBar.element.style.top = `${imgTop + this.rightBar.position.y}px`;

    }
    
    public init(): void{
        this.imgPong.onload = () => {
            //this.container = containerElement;
            this.leftBar = new Bar(this.leftBEle);
            this.rightBar = new Bar(this.rightBEle);
            
            this.backRect = this.imgPong.getBoundingClientRect();
            const backRectHeight = this.backRect.height;
            const margin = backRectHeight * 0.1;
            const centerY = margin +(backRectHeight - margin * 2 - this.leftBar.height) / 2;
            this.leftBar.position.y = centerY;
            this.rightBar.position.y = centerY;
    
            window.addEventListener('resize', this.barResize);
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp);
            this.barResize();
            
            this.rafId    = requestAnimationFrame(this.gameLoop);
            
            };
            
            if (this.imgPong.complete && this.imgPong.onload) {
                this.imgPong.onload(new Event("load"));
            }
    }
    private onKeyDown = (e: KeyboardEvent) => {
        handleKeyPress(this.leftBar, "z", "s", e);
        handleKeyPress(this.rightBar, "ArrowUp", "ArrowDown", e);
    };
    
    private onKeyUp = (e: KeyboardEvent) => {
        handleKeyRelease(this.leftBar,  "z",        "s",        e);
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
        [this.leftBar, this.rightBar].forEach((bar, i) => {
            bar.position.y += bar.velocity.y * dt;
            bar.position.y = Math.max(margin, Math.min(maxY, bar.position.y));
            // Horizontal : 15% pour gauche, 85% pour droite
            const x = imgLeft + imgWidth * (i === 0 ? 0.05 : 0.65);
            bar.element.style.left = `${x}px`;
            // Vertical : top = top de l'image + position.y
            bar.element.style.top = `${imgTop + bar.position.y}px`;
        });
    
        this.rafId = requestAnimationFrame(this.gameLoop);
    };
    
    
    public destroy(): void {
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('resize', this.barResize);
        cancelAnimationFrame(this.rafId);
    }
}