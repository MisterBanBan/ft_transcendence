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

function KeyEPress() {
    
}

export class PlayerController implements IPlayerController{
    private player: PlayerAnimation;
    private pos: Position = { x: 0, y: 0};
    private stats: PlayerStats = new PlayerStats();
    private lastTimestamp: number = 0;
    private playerWidth: number;
    private playerHeight: number;
    private boundKeyDownHandler: (e: KeyboardEvent) => void;
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    //private boundKeyEHandler: (e: KeyboardEvent) => void;
    private animationFrameId: number | null = null;
    
    private doorWorldPage: number = 2 * window.innerWidth + 400;
    private doorWidth = 256;
    private isInTriggerZone: boolean = false;
    private animationPlaying = false;
    private isDoorOpen: boolean = false;

    constructor(playerId: string, door: string) {
        const playerElement = document.getElementById(playerId);
        
        
        if (!playerElement) throw new Error('Player element not found');


        console.log("PlayerController initialisé !");
        
        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.boundKeyDownHandler = (e) => handleKeyPressPlayer(this.stats, this.player, this.isDoorOpen, this.isInTriggerZone, e);
        this.boundKeyUpHandler = (e) => {
            handleKeyReleasePlayer(this.stats, this.player, e);
            if (e.key.toLowerCase() === 'e') {
                if (this.isInTriggerZone && !this.isDoorOpen) {
                    this.isDoorOpen = true;
                    const doorContainer = document.getElementById("videoDoor");
                    if (doorContainer) {
                        doorContainer.innerHTML = `<video autoplay loop muted class="absolute bottom-0 inset-0 w-full h-full object-contain bg-black">
                        <source src="/img/doorOpen.mp4" type="video/mp4">
                      </video>`;
                        window.history.pushState(null, "", "/Tv");
                        window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                }
            }
        };

        window.addEventListener('keydown', this.boundKeyDownHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);

        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));

    }

    public destroy(): void {
        // Arrêter l'animation du joueur
        this.player.stopAnimation();
        
        // Supprimer les écouteurs d'événements
        window.removeEventListener('keydown', this.boundKeyDownHandler);
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        
        // Annuler la boucle de jeu
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        console.log("PlayerController détruit");
    }

    private worldPosX:number = 0;
    private cameraX:number = 0;

    private computeDeltaTime(ts: number): number {
        const deltaTime = (ts - this.lastTimestamp) / 1000;
        this.lastTimestamp = ts;
        return (deltaTime);
    }

    private updatePhysics(dt: number, worldWidth: number, viewportHeight: number) {
        //position par rapport au monde
        const gravity = 1500; 
        this.worldPosX = this.worldPosX || this.pos.x;
        this.worldPosX += this.stats.velocity.x * dt;
        this.worldPosX = Math.max(0, Math.min(worldWidth - this.playerWidth, this.worldPosX));

        //graviter
        this.stats.velocity.y += gravity * dt;
        this.pos.y += this.stats.velocity.y * dt;
        this.pos.y = Math.max(0, Math.min(viewportHeight - this.playerHeight, this.pos.y));

        //max graviter
        const floor = viewportHeight - this.playerHeight;
        if (this.pos.y >= floor) {
            this.stats.velocity.y = 0;
            this.pos.y = floor;
            this.stats.isJumping = false;
        }
        console.log(`phy: %d, %d, %d`, this.pos.x, this.worldPosX, this.cameraX);
        //position du player
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

        const playerCenter = this.worldPosX + this.playerWidth/2;
        const inZone = (playerCenter >= this.doorWorldPage &&
            playerCenter <= this.doorWorldPage + this.doorWidth);
        //console.log('player %d triggerzone %d', this.worldPosX, this.triggerZoneStart);
        const doorVideo = document.querySelector<HTMLVideoElement>('#videoDoor video');
        const pressE = document.getElementById("pressE");
        if (!doorVideo || !pressE) return;

        if (inZone && !this.isInTriggerZone) {
            this.isInTriggerZone = true;

            const rect = doorVideo.getBoundingClientRect();
            Object.assign(pressE.style, {
                position: 'absolute',
                top:    `${rect.top}px`,
                left:   `${rect.left}px`,
                width:  `${rect.width}px`,
                height: `${rect.height}px`
              });
              pressE.classList.remove('hidden');

            //doorHidden.classList.remove('hidden');
        } else if (!inZone && this.isInTriggerZone) {
            this.isInTriggerZone = false;
            pressE.classList.add('hidden');
        }
        
    }

    private gameLoop(timestamp: number) {
        
        const deltaTime = this.computeDeltaTime(timestamp);

    
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const worldWidth = viewportWidth * 3;

        this.doorWorldPage = 2 * viewportWidth + 400;

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

// Exporter correctement la classe PlayerController
export default PlayerController;

