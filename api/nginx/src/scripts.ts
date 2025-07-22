/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scripts.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:42 by afavier           #+#    #+#             */
/*   Updated: 2025/07/22 18:39:05 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { PlayerAnimation } from "./player_animation.js";

interface IPlayerController {
    destroy(): void;
}

interface Position {
    x: number;
    y: number;
}

class PlayerStats {
    velocity: Position = {x: 0, y: 0};
    isJumping: boolean = false;
    leftKey: boolean = false;
    rightKey: boolean = false;
    speed: number = 800;
    jump: number = -700;
}

function handleKeyPressPlayer(stats: PlayerStats, player: PlayerAnimation, isInTriggerZone: boolean, isDoorOpen: boolean, e: KeyboardEvent) {
    switch(e.key.toLowerCase()) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = stats.jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
        case 'a':
            if (!stats.leftKey) {
                stats.leftKey = true;
                stats.velocity.x -= stats.speed;
                player.startAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (!stats.rightKey) {
                stats.rightKey = true;
                stats.velocity.x += stats.speed;
                player.startAnimation();
            }
            break;
    }
}

function handleKeyReleasePlayer(stats: PlayerStats, player: PlayerAnimation, e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            if (stats.leftKey) {
                stats.velocity.x += stats.speed;
                stats.leftKey = false;
                player.stopAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey) {
                stats.velocity.x -= stats.speed;
                stats.rightKey = false;
                player.stopAnimation();
            }
            break;
    }
}


export class PlayerController implements IPlayerController{
    private player: PlayerAnimation;
    private pos: Position = { x: 0, y: 0};
    private stats: PlayerStats = new PlayerStats();
    private lastTimestamp: number = 0;
    private playerWidth: number;
    private playerHeight: number;
    private playerElement: HTMLElement;
    private boundKeyDownHandler: (e: KeyboardEvent) => void;
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private animationFrameId: number | null = null;
    
    private isInTriggerZone: boolean = false;
    private isDoorOpen: boolean = false;

    constructor(playerId: string, door: string) {
        window.addEventListener('resize', this.handleResize.bind(this));
        const playerElement = document.getElementById(playerId);
        if (!playerElement) throw new Error('Player element not found');

        this.playerElement = playerElement; 
        console.log("PlayerController initialisé !");
        
        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        
        let worldPath: string;
        
        this.boundKeyDownHandler = (e) => handleKeyPressPlayer(this.stats, this.player, this.isDoorOpen, this.isInTriggerZone, e);
        this.boundKeyUpHandler = (e) => {
            handleKeyReleasePlayer(this.stats, this.player, e);
            if (e.key.toLowerCase() === 'e') {
                if (this.isInTriggerZone && !this.isDoorOpen) {
                    this.isDoorOpen = true;
                    const path = window.location.pathname;
                        if (path === "/")
                        {
                            worldPath = "/chalet";
                        }
                        else
                        {
                            worldPath = "/game";
                        }
                        window.history.pushState(null, "", worldPath);
                        window.dispatchEvent(new PopStateEvent("popstate"));
                }
            }
        };

        window.addEventListener('keydown', this.boundKeyDownHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);

        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));

    }
    private handleResize() {
        const viewportHeight = window.innerHeight;
        console.log("Viewport height:", viewportHeight);
        const playerBottom = this.pos.y + this.playerHeight;
        
        if (playerBottom > viewportHeight) {
            this.pos.y = viewportHeight - this.playerHeight;
            this.updatePosition();
        }
    }
    public destroy(): void {
        this.player.stopAnimation();
        
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        console.log("PlayerController destroy");
    }

    private worldPosX:number = 0;
    private cameraX:number = 0;

    private computeDeltaTime(ts: number): number {
        const deltaTime = (ts - this.lastTimestamp) / 1000;
        this.lastTimestamp = ts;
        return (deltaTime);
    }

    private updatePhysics(dt: number, worldWidth: number, viewportHeight: number) {
        
        const gravity = 1500; 
        this.worldPosX = this.worldPosX || this.pos.x;
        this.worldPosX += this.stats.velocity.x * dt;
        this.worldPosX = Math.max(0, Math.min(worldWidth - this.playerWidth, this.worldPosX));

        const rect = this.playerElement.getBoundingClientRect();
        this.playerHeight = rect.height;
        this.playerWidth = rect.width;

        this.stats.velocity.y += gravity * dt;
        this.pos.y += this.stats.velocity.y * dt;
    
        const playerBottom = this.pos.y + this.playerHeight;
        if (playerBottom >= viewportHeight) {
            this.stats.velocity.y = 0;
            this.pos.y = viewportHeight - this.playerHeight;
            this.stats.isJumping = false;
        }
        console.log(this.pos.y, viewportHeight, this.playerHeight);
        this.pos.x = this.worldPosX - this.cameraX;
    }

    private updateCamera(viewportWidth: number, worldWidth: number) {

        const cameraDeadZone = viewportWidth / 3;
        const maxCameraX = worldWidth - viewportWidth;

        if (this.worldPosX < cameraDeadZone) {
            this.cameraX = 0;
        } else if (this.worldPosX > worldWidth - cameraDeadZone) {
            this.cameraX = worldWidth - viewportWidth;
        } else {
            this.cameraX = this.worldPosX - cameraDeadZone;
        }

        const pageContainer = document.getElementById("pageContainer");
        if (pageContainer) {
            this.cameraX = Math.max(0, Math.min(this.cameraX, maxCameraX));
            pageContainer.style.transform = `translateX(-${this.cameraX}px)`;
        }
    }

    private checkTriggers() {
        const path = window.location.pathname;
        const pressE = document.getElementById("pressE");
        if (!pressE) return;
        if (path === "/chalet")
        {
            const triggerX = 0.8 * window.innerWidth * 2;
            
            const shouldShowPressE = this.worldPosX >= triggerX;
            this.isInTriggerZone = shouldShowPressE;
            pressE.classList.toggle("hidden", !shouldShowPressE);
        }
        const door = document.getElementById("trigger");


        if (!door || !pressE) return;

        

        const rect = door.getBoundingClientRect();
        
        const doorLeft = this.cameraX + rect.left + this.playerWidth;
        // faudrait mettre une box pour la door 
        const doorRight = doorLeft + rect.width / 3;
        //console.log('door: %d, %d, %d',this.worldPosX, doorLeft, doorRight);
        const inZone = this.worldPosX >= doorLeft && doorRight >= this.worldPosX;

        if (inZone !== this.isInTriggerZone) {
            this.isInTriggerZone = inZone;
            pressE.classList.toggle("hidden", !inZone);
          }
        
    }

    private gameLoop(timestamp: number) {
        
        const deltaTime = this.computeDeltaTime(timestamp);

    
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const path = window.location.pathname;
        let worldWidth: number;
        if (path === "/chalet")
        {
            worldWidth = viewportWidth * 2;
        } else {
            worldWidth = viewportWidth * 3;
        }
        


        this.updatePhysics(deltaTime, worldWidth, viewportHeight);
        this.updateCamera(viewportWidth, worldWidth);

        this.checkTriggers();
        
        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private updatePosition() {
        this.player.updatePosition(this.pos.x, this.pos.y);
    }
}

export default PlayerController;

8