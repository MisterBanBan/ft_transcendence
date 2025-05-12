/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pong.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/10 15:16:55 by mtbanban          #+#    #+#             */
/*   Updated: 2025/05/12 20:37:17 by mtbanban         ###   ########.fr       */
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
    }

    update(dt: number, containerHeight: number) {
        this.position.y += this.velocity.y * dt;
        if(this.position.y < 0) {
            this.position.y = 0;
        }
        if (this.position.y > containerHeight - this.height) {
            this.position.y = containerHeight - this.height;
        }
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
    //private pos: Position = {x: 0, y: 0};
    private leftBar: Bar;
    private rightBar: Bar;
    private rafId = 0;
    private lastTime = 0;
    private container: HTMLElement;
    
    constructor(leftBarId: string, rightBarId: string, containerId: string) {
        const leftBarElement = document.getElementById(leftBarId);
        if(!leftBarElement) {
            throw new Error('Left bar not found');
        }
        const rightBarElement = document.getElementById(rightBarId);
        if(!rightBarElement) {
            throw new Error('Right bar not found');
        }
        const containerElement = document.getElementById(containerId);
        if(!containerElement) {
            throw new Error('Right bar not found');
        }
        this.leftBar = new Bar(leftBarElement);
        this.rightBar = new Bar(rightBarElement);
        this.container = containerElement;

        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }
    
    public init(): void{
        this.rafId    = requestAnimationFrame(this.gameLoop);
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
    
        // met à jour chaque barre
        const H = this.container.clientHeight;
        this.leftBar.update(dt, H);
        this.rightBar.update(dt, H);
    
        this.rafId = requestAnimationFrame(this.gameLoop);
      };
    
    public destroy(): void {
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        cancelAnimationFrame(this.rafId);
    }
}