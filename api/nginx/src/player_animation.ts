export class PlayerAnimation{
    private element: HTMLElement;
    private images: string[] = [
        '../img/kodama_stop1.png',
        '../img/kodama_walk1.png',
        '../img/kodama_walk22.png',
        '../img/kodama_walk33.png',
    ];
    private currentFrame: number = 0;
    private animationInterval: number | null = null;

    constructor(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) throw new Error("element not found");
        this.element = element;
    }
    startAnimation(frameRate: number = 100) {
        if (this.animationInterval) return;
        this.animationInterval = window.setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % this.images.length;
            this.element.style.backgroundImage = `url(${this.images[this.currentFrame]})`;
        }, frameRate); 
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            this.currentFrame = 0;
            this.element.style.backgroundImage = `url(${this.images[0]})`;
        }
    }
    updatePosition(x: number, y: number) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    setDirection(left: boolean) {
        if (left) {
            this.element.style.transform = 'scaleX(-1)';
        } else {
            this.element.style.transform = 'scaleX(1)';
        }
    }
    destroy() {
        this.stopAnimation();
    }
    
}