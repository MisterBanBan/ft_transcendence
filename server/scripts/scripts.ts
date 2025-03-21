import { PlayerAnimation } from "./player_animation.js";

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
/*
function handleKeyPress(velocity: {x: number, y: number}, speed: number, e: KeyboardEvent) {
    switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'z':
            velocity.y = -speed;
            break;
        case 'arrowdown':
        case 's':
            velocity.y = speed;
            break;
        case 'arrowleft':
        case 'q':
            velocity.x = -speed;
            break;
        case 'arrowright':
        case 'd':
            velocity.x = speed;
            break;
    }
}*/

/*
function handleKeyRelease(velocity: {x: number, y: number}, e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'z':
        case 'arrowdown':
        case 's':
            velocity.y = 0;
            break;
        case 'arrowleft':
        case 'q':
        case 'arrowright':
        case 'd':
            velocity.x = 0;
            break;
    }
}*/

function handleKeyPressPlayer(stats: PlayerStats, speed: number, jump: number, player: PlayerAnimation,  e: KeyboardEvent) {

    switch(e.key.toLowerCase()) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
        case 'q':
            if (stats.leftKey === false)
            {
                stats.leftKey = true;
                stats.velocity.x += -speed;
                player.startAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey === false)
                {
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
            if (stats.leftKey)
            {
                stats.velocity.x -= -speed;
                stats.leftKey = false;
                player.stopAnimation();
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey)
            {
                stats.velocity.x -= speed;
                stats.rightKey = false;
                player.stopAnimation();
            }
            break;
    }
}


class PlayerController {
    private player: PlayerAnimation;
    private pos: Position = { x: 0, y: 0};
    private velo: Position = { x: 0, y: 0};
    private stats: PlayerStats = new PlayerStats();
    private speed: number = 400;
    private jump: number = -700;
    private gravity: number = 1500;
    private lastTimestamp: number = 0;
    private playerWidth: number;
    private playerHeight: number;

    constructor(playerId: string) {
        const playerElement = document.getElementById(playerId);
        if (!playerElement) throw new Error('Player element not found');
        this.player = new PlayerAnimation(playerId);
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;

        this.updatePosition();
        window.addEventListener('keydown', (e) => handleKeyPressPlayer(this.stats, this.speed, this.jump, this.player, e));
        window.addEventListener('keyup', (e) => handleKeyReleasePlayer(this.stats, this.speed, this.player, e));

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private gameLoop(timestamp: number) {
        const deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.pos.x += this.stats.velocity.x * deltaTime;
        this.stats.velocity.y += this.gravity * deltaTime;
        this.pos.y += this.stats.velocity.y * deltaTime;

        this.pos.x = Math.max(0, Math.min(window.innerWidth - this.playerWidth, this.pos.x));
        this.pos.y = Math.max(0, Math.min(window.innerHeight - this.playerHeight, this.pos.y));

        const floor = window.innerHeight - this.playerHeight;
        if (this.pos.y >= floor)
        {
            this.stats.velocity.y = 0;
            this.pos.y = floor;
            this.stats.isJumping = false;
        }
        console.log(`Velocity Y: ${this.stats.velocity.y}, Position Y: ${this.pos.y}`);
        console.log(`Velocity X: ${this.stats.velocity.x}`);
        this.updatePosition();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    private updatePosition() {
        this.player.updatePosition(this.pos.x, this.pos.y);
    }


    
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new PlayerController('player');
});
