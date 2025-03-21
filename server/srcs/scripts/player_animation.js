var PlayerAnimation = /** @class */ (function () {
    function PlayerAnimation(elementId) {
        this.images = [
            '/public/img/kodama_stop.png',
            '/public/img/kodama_walk.png',
            '/public/img/kodama_walk2.png',
            '/public/img/kodama_walk3.png',
        ];
        this.currentFrame = 0;
        this.animationInterval = null;
        var element = document.getElementById(elementId);
        if (!element)
            throw new Error("element not found");
        this.element = element;
    }
    PlayerAnimation.prototype.startAnimation = function (frameRate) {
        var _this = this;
        if (frameRate === void 0) { frameRate = 100; }
        if (this.animationInterval)
            return;
        this.animationInterval = window.setInterval(function () {
            _this.currentFrame = (_this.currentFrame + 1) % _this.images.length;
            _this.element.style.backgroundImage = "url(".concat(_this.images[_this.currentFrame], ")");
        }, frameRate);
    };
    PlayerAnimation.prototype.stopAnimation = function () {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            this.currentFrame = 0;
            this.element.style.backgroundImage = "url(".concat(this.images[0], ")");
        }
    };
    PlayerAnimation.prototype.updatePosition = function (x, y) {
        this.element.style.left = "".concat(x, "px");
        this.element.style.top = "".concat(y, "px");
    };
    return PlayerAnimation;
}());
export { PlayerAnimation };
