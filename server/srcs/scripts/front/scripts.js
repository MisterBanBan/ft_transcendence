var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    constructor(playerId, router, initialX, initialDirection) {
        this.pos = { x: 0, y: 0 };
        this.stats = new PlayerStats();
        this.speed = 400;
        this.jump = -700;
        this.gravity = 1500;
        this.lastTimestamp = 0;
        this.transitionDirection = null;
        this.animationFrameId = null;
        const playerElement = document.getElementById(playerId);
        if (!playerElement)
            throw new Error('Player element not found');
        //cela ne sert a rien les deux if
        console.log(`init: ${initialDirection}`);
        console.log(`init: ${initialX}`);
        this.router = router;
        if (initialX !== undefined) {
            this.pos.x = initialX;
        }
        if (initialDirection) {
            this.transitionDirection = initialDirection;
            /*if (initialDirection === 'right') {

            }*/
        }
        console.log(`PlayerController initialisé avec position X: ${this.pos.x}`);
        console.log("PlayerController initialisé !");
        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.boundKeyDownHandler = (e) => handleKeyPressPlayer(this.stats, this.speed, this.jump, this.player, e);
        this.boundKeyUpHandler = (e) => handleKeyReleasePlayer(this.stats, this.speed, this.player, e);
        window.addEventListener('keydown', this.boundKeyDownHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);
        this.lastTimestamp = performance.now();
        this.updatePosition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    gameLoop(timestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lastTimestamp)
                this.lastTimestamp = timestamp;
            const deltaTime = (timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;
            const screenWidth = window.innerWidth;
            /*console.log(`init: ${this.pos.x}`);
            console.log(`init: ${screenWidth * 0.5}`);
            if (this.nextPagePath) {
                console.log("Next page path exists:", this.nextPagePath);
            } else {
                console.log("Next page path is null or undefined");
            }*/
            if (this.stats.velocity.x > 0 && this.pos.x > screenWidth * 0.5 && !this.nextPagePath) {
                this.nextPagePath = yield this.router.preloadNextPage('right');
                this.transitionDirection = 'right';
            }
            else if (this.stats.velocity.x < 0 && this.pos.x < screenWidth * 0.5 && !this.nextPagePath) {
                this.nextPagePath = yield this.router.preloadNextPage('left');
                this.transitionDirection = 'left';
            }
            if (this.nextPagePath && this.transitionDirection && (this.pos.x < screenWidth * 0.6 || this.pos.x > screenWidth * 0.6)) {
                this.router.updatePageTransition(this.pos.x, this.transitionDirection);
                if ((this.transitionDirection === 'right' && this.pos.x > screenWidth) || (this.transitionDirection === 'left' && this.pos.x < -this.playerWidth)) {
                    yield this.router.completePageTransition(this.nextPagePath);
                    if (this.transitionDirection === 'right') {
                        this.pos.x = 0;
                    }
                    else {
                        this.pos.x = screenWidth - this.playerWidth;
                    }
                    this.nextPagePath = null;
                    this.transitionDirection = null;
                } /*else {
                    this.pos.x = Math.max(0, Math.min(screenWidth - this.playerWidth, this.pos.x));
                }
                this.updatePosition();
                this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));*/
            }
            this.pos.x += this.stats.velocity.x * deltaTime;
            this.stats.velocity.y += this.gravity * deltaTime;
            this.pos.y += this.stats.velocity.y * deltaTime;
            if (!this.nextPagePath) {
                this.pos.x = Math.max(0, Math.min(screenWidth - this.playerWidth, this.pos.x));
            }
            /*this.pos.x = Math.max(0, Math.min(window.innerWidth - this.playerWidth, this.pos.x));*/
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
        });
    }
    updatePosition() {
        this.player.updatePosition(this.pos.x, this.pos.y);
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
    getVelocity() {
        return Object.assign({}, this.stats.velocity);
    }
    getIsJumping() {
        return this.stats.isJumping;
    }
}
// Exporter correctement la classe PlayerController
export default PlayerController;
/*
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("player")) {
        console.warn("Le joueur n'est pas encore chargé, attente...");
        setTimeout(() => new PlayerController('player'), 100);
    }
});*/
