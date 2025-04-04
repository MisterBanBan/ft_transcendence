import { PlayerAnimation } from "./player_animation.js";
class PlayerStats {
    constructor() {
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.leftKey = false;
        this.rightKey = false;
    }
}
function handleKeyPressPlayer(stats, speed, jump, player, e) {
    switch (e.key.toLowerCase()) {
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
function handleKeyReleasePlayer(stats, speed, player, e) {
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
class PlayerController {
    constructor(playerId) {
        this.pos = { x: 0, y: 0 };
        this.stats = new PlayerStats();
        this.speed = 400;
        this.jump = -700;
        this.gravity = 1500;
        this.lastTimestamp = 0;
        this.animationFrameId = null;
        const playerElement = document.getElementById(playerId);
        if (!playerElement)
            throw new Error('Player element not found');
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
    destroy() {
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
    gameLoop(timestamp) {
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        this.pos.x += this.stats.velocity.x * deltaTime;
        this.stats.velocity.y += this.gravity * deltaTime;
        this.pos.y += this.stats.velocity.y * deltaTime;
        this.pos.x = Math.max(0, Math.min(window.innerWidth - this.playerWidth, this.pos.x));
        this.pos.y = Math.max(0, Math.min(window.innerHeight - this.playerHeight, this.pos.y));
        const floor = window.innerHeight - this.playerHeight;
        if (this.pos.y >= floor) {
            this.stats.velocity.y = 0;
            this.pos.y = floor;
            this.stats.isJumping = false;
        }
        console.log(`Velocity Y: ${this.stats.velocity.y}, Position Y: ${this.pos.y}`);
        console.log(`Velocity X: ${this.stats.velocity.x}`);
        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    updatePosition() {
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
