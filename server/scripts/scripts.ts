interface Position {
    x: number;
    y: number;
}

class PlayerStats {
    velocity: Position = {x: 0, y: 0};
    isJumping: boolean = false;
    lastKeyLeft: boolean = false;
    lastKeyRight: boolean = false;
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

function handleKeyPressPlayer(stats: PlayerStats, speed: number, jump: number, e: KeyboardEvent) {

    switch(e.key.toLowerCase()) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
        case 'q':
            stats.lastKeyLeft = true;
            stats.lastKeyRight = false;
            stats.velocity.x = -speed;
            break;
        case 'arrowright':
        case 'd':
            stats.lastKeyRight = true;
            stats.lastKeyLeft = false; 
            stats.velocity.x = speed;
            break;
    }
}

function moveLeft(velocity: {x: number, y: number}, speed: number) {
    velocity.x = -speed;
}

function moveRight(velocity: {x: number, y: number}, speed: number) {
    velocity.x = speed;
}

function stopJumpMovement(velocity: {x: number, y: number}) {
    velocity.x = 0;
}

function handleKeyReleasePlayer(stats: PlayerStats, speed: number, e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'q':
            stats.lastKeyLeft = false;
            if (stats.lastKeyRight)
                moveRight(stats.velocity, speed);
            else
                stopJumpMovement(stats.velocity);
            break;
        case 'arrowright':
        case 'd':
            stats.lastKeyRight = false;
            if (stats.lastKeyLeft)
                moveLeft(stats.velocity, speed);
            else
                stopJumpMovement(stats.velocity);
            break;
    }
}


class PlayerController {
    private player: HTMLElement;
    private pos: Position = { x: 0, y: 0};
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
        this.player = playerElement;
        const sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;

        this.updatePosition();
        window.addEventListener('keydown', (e) => handleKeyPressPlayer(this.stats, this.speed, this.jump, e));
        window.addEventListener('keyup', (e) => handleKeyReleasePlayer(this.stats, this.speed, e));

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

        this.updatePosition();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private updatePosition() {
        this.player.style.top = `${this.pos.y}px`;
        this.player.style.left = `${this.pos.x}px`;
    }
    
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new PlayerController('player');
});
