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
}

function handleKeyPressPlayer(stats: PlayerStats, speed: number, jump: number, player: PlayerAnimation, e: KeyboardEvent) {
    switch(e.key.toLowerCase()) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
        case 'q':
            if (!stats.leftKey) {
                stats.leftKey = true;
                stats.velocity.x -= speed;
                player.startAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (!stats.rightKey) {
                stats.rightKey = true;
                stats.velocity.x += speed;
                player.startAnimation();
            }
            break;
    }
}

function handleKeyReleasePlayer(stats: PlayerStats, speed: number, player: PlayerAnimation, e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'q':
            if (stats.leftKey) {
                stats.velocity.x += speed;
                stats.leftKey = false;
                player.stopAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey) {
                stats.velocity.x -= speed;
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
    private speed: number = 400;
    private jump: number = -700;
    private gravity: number = 1500;
    private lastTimestamp: number = 0;
    private playerWidth: number;
    private playerHeight: number;
    private boundKeyDownHandler: (e: KeyboardEvent) => void;
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private animationFrameId: number | null = null;

    constructor(playerId: string) {
        const playerElement = document.getElementById(playerId);
        if (!playerElement) throw new Error('Player element not found');

        console.log("PlayerController initialisé !");
        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.boundKeyDownHandler = (e) => handleKeyPressPlayer(this.stats, this.speed, this.jump, this.player, e);
        this.boundKeyUpHandler = (e) => handleKeyReleasePlayer(this.stats, this.speed, this.player, e);

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
    private gameLoop(timestamp: number) {
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.pos.x += this.stats.velocity.x * deltaTime;
        this.stats.velocity.y += this.gravity * deltaTime;
        this.pos.y += this.stats.velocity.y * deltaTime;

        const pageContainer = document.getElementById("pageContainer");
        if (pageContainer) {
            const containerWidth = window.innerWidth * 2; // Largeur totale du conteneur (2 pages)
            const viewportCenter = window.innerWidth / 2;
            if (this.pos.x > window.innerWidth / 2) {
                const maxOffset = containerWidth - window.innerWidth; // Déplacement maximum du conteneur
            const offset = Math.min(this.pos.x - viewportCenter, maxOffset);
            pageContainer.style.transform = `translateX(-${offset}px)`;
        } else {
            pageContainer.style.transform = 'translateX(0)';
        }
        }

        this.pos.x = Math.max(0, Math.min(window.innerWidth * 2 - this.playerWidth, this.pos.x));
        this.pos.y = Math.max(0, Math.min(window.innerHeight - this.playerHeight, this.pos.y));

        const floor = window.innerHeight - this.playerHeight;
        if (this.pos.y >= floor) {
            this.stats.velocity.y = 0;
            this.pos.y = floor;
            this.stats.isJumping = false;
        }

        //console.log(`Velocity Y: ${this.stats.velocity.y}, Position Y: ${this.pos.y}`);
        //console.log(`Velocity X: ${this.stats.velocity.x}`);
        
        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private updatePosition() {
        this.player.updatePosition(this.pos.x, this.pos.y);
    }
}

// Exporter correctement la classe PlayerController
export default PlayerController;

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("player")) {
        console.warn("Le joueur n'est pas encore chargé, attente...");
        setTimeout(() => new PlayerController('player'), 100);
    }
});
