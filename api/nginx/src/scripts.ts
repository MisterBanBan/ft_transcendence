import { PlayerAnimation } from "./player_animation.js";
import {router} from "./router.js";

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

function handleKeyPressPlayer(stats: PlayerStats, player: PlayerAnimation, isInTriggerZone: boolean, isDoorOpen: boolean, e: KeyboardEvent) {
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
    pressedKeys[key] = false;

    switch (key) {
        case 'arrowleft':
            stats.velocity.x += stats.speed;
            stats.leftKey = false;
            break;
        case 'arrowright':
            stats.velocity.x -= stats.speed;
            stats.rightKey = false;
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
        
        const skipButton = document.getElementById('skipButton');
        if (skipButton) {
            this.skipButton = skipButton;
            this.skipButton.addEventListener('click', () => {
                router.navigateTo("/game");
            });
        }
        window.addEventListener('blur', this.handleWindowBlur.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.player.setDirection(false);
        let worldPath: string;
        this.activateInfoUserOnce();
        displayTextByLetter("Bienvenue dans le jeu ! Appuyez sur 'E' pour ouvrir la porte.\nvhfrvvbbrevbbvbberuvbibrbvilrbziuvbiulbtrulibvulibrltuibvuil\nbrtubviubrtubviubrtluibvubrtuhbvlubrtubvulrbtubvirbti", "dialogueBox", 50);
        this.boundKeyDownHandler = (e) => {console.log("Key Down"); handleKeyPressPlayer(this.stats, this.player, this.isDoorOpen, this.isInTriggerZone, e)};
        this.boundKeyUpHandler = (e) => {
            console.log("Key up")
            handleKeyReleasePlayer(this.stats, this.player, e);
            if (e.key.toLowerCase() === 'e') {
                if (this.isInTriggerZone && !this.isDoorOpen) {
                    this.isDoorOpen = true;
                    const path = window.location.pathname;
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

        window.addEventListener('keydown', this.boundKeyDownHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);

        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    private handleVisibilityChange() {
        if (document.hidden) {
            this.handleWindowBlur();
        }
    }

    private handleWindowBlur() {
    // Remet tous les flags à zéro
    for (const key in pressedKeys) pressedKeys[key] = false;

    this.stats.leftKey = false;
    this.stats.rightKey = false;
    this.stats.velocity.x = 0;
    this.player.setDirection(false);
    this.player.stopAnimation();

}


    private handleResize() {
        const viewportHeight = window.innerHeight;
        // console.log("Viewport height:", viewportHeight);
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
        // console.log(this.stats.velocity.x)
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
        // console.log(this.pos.y, viewportHeight, this.playerHeight);
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
                pressE.classList.remove("hidden");
                img.classList.add('left-[80%]');
                img.classList.remove('left-[10%]');
            } else if (shouldShowPressEBack) {
                img.src = "/img/back.png";
                this.worldIs = 1;
                this.isInTriggerZone = true;
                pressE.classList.remove("hidden");
                img.classList.add('left-[10%]');
                img.classList.remove('left-[80%]');
            } else {
                this.isInTriggerZone = false;
                pressE.classList.add("hidden");
                img.classList.remove('left-[10%]', 'left-[80%]');
            }
        }

        const door = document.getElementById("trigger");
        const secondWindow = document.getElementById("secondWindow");
        if (!door || !pressE || !secondWindow) return;

        

        const rect = door.getBoundingClientRect();
        
        const doorLeft = this.cameraX + rect.left + this.playerWidth;
        const doorRight = doorLeft + rect.width / 3;
        const inZone = this.worldPosX >= doorLeft && doorRight >= this.worldPosX;

        if (!inZone) {
            door.classList.remove("bg-black", "bg-opacity-50");
            secondWindow.classList.remove("bg-black", "bg-opacity-50");
            pressE.classList.add("hidden",);
          }else
          {
            this.worldIs = 2;
            this.isInTriggerZone = inZone;
            door.classList.add("bg-black", "bg-opacity-50");
            secondWindow.classList.add("bg-black", "bg-opacity-50");
            pressE.classList.remove("hidden");
          }

    }

    private infoUser()
    {
        const pageOne = document.getElementById("pageOne");
        const userInfo = document.getElementById("infoUser");
        if( !pageOne || !userInfo) return;
        console.log("infoUser called");
        pageOne.classList.remove("bg-black/50");
        userInfo.classList.add("hidden");

    }



    private activateInfoUserOnce() {
        const handleKeydown = (event: KeyboardEvent) => {
            console.log(`Key pressed: ${event.key}`);
            this.infoUser();
            document.removeEventListener("keydown", handleKeydown);
        };
        document.addEventListener("keydown", handleKeydown);
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
    public destroy(): void {
        this.player.stopAnimation();
        
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        window.removeEventListener('blur', this.handleWindowBlur.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        console.log("PlayerController destroy");
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
