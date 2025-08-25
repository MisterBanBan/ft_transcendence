import { PlayerAnimation } from "./player_animation.js";
import {router} from "../route/router.js";

const pressedKeys: { [key: string]: boolean } = {};

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

function handleKeyPressPlayer(stats: PlayerStats, player: PlayerAnimation, e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (pressedKeys[key]) return;
    pressedKeys[key] = true;

    switch (key) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = stats.jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
            stats.leftKey = true;
            stats.velocity.x -= stats.speed;
            player.setDirection(true);
            player.startAnimation();
            break;
        case 'arrowright':
            stats.rightKey = true;
            stats.velocity.x += stats.speed;
            player.setDirection(false);
            player.startAnimation();
            break;
    }
}

function handleKeyReleasePlayer(stats: PlayerStats, player: PlayerAnimation, e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (!pressedKeys[key]) {
        return;
    }
    pressedKeys[key] = false;

    switch (key) {
        case 'arrowleft':
            stats.velocity.x += stats.speed;
            stats.leftKey = false;
            if (stats.rightKey) {
                player.setDirection(false);
                player.startAnimation();
            }
            break;
        case 'arrowright':
            stats.velocity.x -= stats.speed;
            stats.rightKey = false;
            if (stats.leftKey) {
                player.setDirection(true);
                player.startAnimation();
            }
            break;
    }

    if (!stats.leftKey && !stats.rightKey) {
        player.stopAnimation();
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
    private skipButton?: HTMLElement;
    private worldIs: number = 4;
    private pressE;
    private boundHandleWindowBlur;
    private boundHandleVisibilityChange;
    private boundHandleResize;
    private boundGameLoop;
    private SkipHandler = () => { router.navigateTo("/game"); };
    private boundKeyDownHandler: (e: KeyboardEvent) => void;
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private animationFrameId: number | null = null;
    
    private isInTriggerZone: boolean = false;
    private isDoorOpen: boolean = false;

    constructor(playerId: string, presseE: string) {


        const playerElement = document.getElementById(playerId);
        if (!playerElement) throw new Error('Player element not found');
        this.playerElement = playerElement;

        const pressE = document.getElementById(presseE);
        if (!pressE) throw new Error('Press E element not found');
        this.pressE = pressE;
        
        const skipButton = document.getElementById('skipButton');
        if (skipButton)
            this.skipButton = skipButton;


        this.boundHandleResize = this.handleResize.bind(this);
        this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);
        this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.boundGameLoop = this.gameLoop.bind(this);



        this.player = new PlayerAnimation(playerId);

        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.player.setDirection(false);
        let worldPath: string;
        this.activateInfoUserOnce();
        const path = window.location.pathname;
        if(path === "/")
        {
            displayTextByLetter("After wandering for ages among trees and mist, a house finally appears deep within the forest—a quiet promise of shelter.", "dialogueBox", 50);
        }
        else
        {
            displayTextByLetter("Inside the house, a Pong console rests on the floor and invites play; the urge to imitate familiar gestures awakens beneath the gentle glow of the TV.", "dialogueBox", 50);
        }
        this.boundKeyDownHandler = (e) => {handleKeyPressPlayer(this.stats, this.player, e)};
        this.boundKeyUpHandler = (e) => {
            const key = e.key.toLowerCase();
            handleKeyReleasePlayer(this.stats, this.player, e);
            if (key === 'e') {
                if (this.isInTriggerZone && !this.isDoorOpen) {
                    this.isDoorOpen = true;
                    
                        if (path === "/" && this.worldIs === 2)
                        {
                            worldPath = "/chalet";
                        }
                        else if (path === "/chalet")
                        {
                            if (this.worldIs === 1)
                            {
                                worldPath = "/";
                            } else if (this.worldIs === 0)
                            {
                                worldPath = "/game";
                            }
                        }
                        router.navigateTo(worldPath);
                }
            }
        };
        this.bindEvent();

    }

    private bindEvent()
    {
        window.addEventListener('keydown', this.boundKeyDownHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);
        window.addEventListener('blur', this.boundHandleWindowBlur);
        document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
        window.addEventListener('resize', this.boundHandleResize);
        if(this.skipButton && this.SkipHandler)
            this.skipButton.addEventListener('click', this.SkipHandler);
        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
    }




    private handleVisibilityChange() {
        if (document.hidden) {
            this.handleWindowBlur();
        }
    }

    private handleWindowBlur() {
        for (const key in pressedKeys) {
            if (pressedKeys[key]) {
            pressedKeys[key] = false;
            const fakeEvent = new KeyboardEvent('keyup', { key });
            handleKeyReleasePlayer(this.stats, this.player, fakeEvent);
            }
        }
        this.stats.leftKey = false;
        this.stats.rightKey = false;
        this.stats.velocity.x = 0;
        this.player.setDirection(false);
        this.player.stopAnimation();
    }


    private handleResize() {
        const viewportHeight = window.innerHeight;
        const playerBottom = this.pos.y + this.playerHeight;
        
        if (playerBottom > viewportHeight) {
            this.pos.y = viewportHeight - this.playerHeight;
            this.updatePosition();
        }
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
        this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
    }

    private checkTriggers() {
        const path = window.location.pathname;
        if (!this.pressE) return;

        if (path === "/chalet") {
            const triggerX = 0.6 * window.innerWidth * 2;
            const triggerY = 0.5 * window.innerHeight;

            const shouldShowPressEBack = this.worldPosX <= triggerY;
            const shouldShowPressE = this.worldPosX >= triggerX;
            const img = document.getElementById("img") as HTMLImageElement;
            if (!img) return;

            if (shouldShowPressE) {
                img.src = "/img/enter.png";
                this.worldIs = 0;
                this.isInTriggerZone = true;
                this.pressE.classList.remove("hidden");
                img.classList.add('left-[80%]');
                img.classList.remove('left-[10%]');
            } else if (shouldShowPressEBack) {
                img.src = "/img/back.png";
                this.worldIs = 1;
                this.isInTriggerZone = true;
                this.pressE.classList.remove("hidden");
                img.classList.add('left-[10%]');
                img.classList.remove('left-[80%]');
            } else {
                this.isInTriggerZone = false;
                this.pressE.classList.add("hidden");
                img.classList.remove('left-[10%]', 'left-[80%]');
            }
        }

        const door = document.getElementById("trigger");
        const secondWindow = document.getElementById("secondWindow");
        if (!door || !this.pressE || !secondWindow) return;

        

        const rect = door.getBoundingClientRect();
        
        const doorLeft = this.cameraX + rect.left + this.playerWidth;
        const doorRight = doorLeft + rect.width / 3;
        const inZone = this.worldPosX >= doorLeft && doorRight >= this.worldPosX;

        if (!inZone) {
            door.classList.remove("bg-black", "bg-opacity-50");
            secondWindow.classList.remove("bg-black", "bg-opacity-50");
            this.pressE.classList.add("hidden",);
          }else
          {
            this.worldIs = 2;
            this.isInTriggerZone = inZone;
            door.classList.add("bg-black", "bg-opacity-50");
            secondWindow.classList.add("bg-black", "bg-opacity-50");
            this.pressE.classList.remove("hidden");
          }

    }

    private infoUser()
    {
        const pageOne = document.getElementById("pageOne");
        const userInfo = document.getElementById("infoUser");
        if( !pageOne || !userInfo) return;
        pageOne.classList.remove("bg-black/50");
        userInfo.classList.add("hidden");
    }



    private activateInfoUserOnce() {
        const handleKeydown = (event: KeyboardEvent) => {
            this.infoUser();
            document.removeEventListener("keydown", handleKeydown);
        };
        document.addEventListener("keydown", handleKeydown);
    }



    private updatePosition() {
        this.player.updatePosition(this.pos.x, this.pos.y);
    }

    public destroy(): void {
        this.stats.velocity.x = 0;
        this.stats.velocity.y = 0;
        this.stats.leftKey = false;
        this.stats.rightKey = false;

        for (const key in pressedKeys) pressedKeys[key] = false;

        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('blur', this.boundHandleWindowBlur);
        document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.player && typeof this.player.destroy === "function") {
            this.player.destroy();
        }
        if (this.skipButton && this.SkipHandler) {
            this.skipButton.removeEventListener('click', this.SkipHandler);
        }

    }


}

function displayTextByLetter(text: string, elementId: string, speed: number) : void {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
            return;
    }

    let index = 0;
    element.textContent = '';
    const interval = setInterval(() => {
    if(index < text.length) {
        element.textContent += text[index];
        index++;
    } else {
        clearInterval(interval);
    }
    }, speed);
}

export default PlayerController;
