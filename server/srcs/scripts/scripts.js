"use strict";
var PlayerStats = /** @class */ (function () {
    function PlayerStats() {
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.leftKey = false;
        this.rightKey = false;
    }
    return PlayerStats;
}());
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
function handleKeyPressPlayer(stats, speed, jump, e) {
    switch (e.key.toLowerCase()) {
        case ' ':
            if (!stats.isJumping) {
                stats.velocity.y = jump;
                stats.isJumping = true;
            }
            break;
        case 'arrowleft':
        case 'q':
            if (stats.leftKey === false) {
                stats.leftKey = true;
                stats.velocity.x += -speed;
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey === false) {
                stats.rightKey = true;
                stats.velocity.x += speed;
            }
            break;
    }
}
function handleKeyReleasePlayer(stats, speed, e) {
    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'q':
            if (stats.leftKey) {
                stats.velocity.x -= -speed;
                stats.leftKey = false;
            }
            break;
        case 'arrowright':
        case 'd':
            if (stats.rightKey) {
                stats.velocity.x -= speed;
                stats.rightKey = false;
            }
            break;
    }
}
var PlayerController = /** @class */ (function () {
    function PlayerController(playerId) {
        var _this = this;
        this.pos = { x: 0, y: 0 };
        this.velo = { x: 0, y: 0 };
        this.stats = new PlayerStats();
        this.speed = 400;
        this.jump = -700;
        this.gravity = 1500;
        this.lastTimestamp = 0;
        var playerElement = document.getElementById(playerId);
        if (!playerElement)
            throw new Error('Player element not found');
        this.player = playerElement;
        var sizePlayer = playerElement.getBoundingClientRect();
        this.playerWidth = sizePlayer.width;
        this.playerHeight = sizePlayer.height;
        this.updatePosition();
        window.addEventListener('keydown', function (e) { return handleKeyPressPlayer(_this.stats, _this.speed, _this.jump, e); });
        window.addEventListener('keyup', function (e) { return handleKeyReleasePlayer(_this.stats, _this.speed, e); });
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    PlayerController.prototype.gameLoop = function (timestamp) {
        var deltaTime = (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;
        this.pos.x += this.stats.velocity.x * deltaTime;
        this.stats.velocity.y += this.gravity * deltaTime;
        this.pos.y += this.stats.velocity.y * deltaTime;
        this.pos.x = Math.max(0, Math.min(window.innerWidth - this.playerWidth, this.pos.x));
        this.pos.y = Math.max(0, Math.min(window.innerHeight - this.playerHeight, this.pos.y));
        var floor = window.innerHeight - this.playerHeight;
        if (this.pos.y >= floor) {
            this.stats.velocity.y = 0;
            this.pos.y = floor;
            this.stats.isJumping = false;
        }
        console.log("Velocity Y: ".concat(this.stats.velocity.y, ", Position Y: ").concat(this.pos.y));
        console.log("Velocity X: ".concat(this.stats.velocity.x));
        this.updatePosition();
        requestAnimationFrame(this.gameLoop.bind(this));
    };
    PlayerController.prototype.updatePosition = function () {
        this.player.style.top = "".concat(this.pos.y, "px");
        this.player.style.left = "".concat(this.pos.x, "px");
    };
    return PlayerController;
}());
// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function () {
    new PlayerController('player');
});
