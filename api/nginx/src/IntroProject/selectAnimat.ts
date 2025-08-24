export class selectAnimation{
    private element: HTMLElement;
    private images: string[] = [
        '../img/select1.png',
        '../img/select2.png',
        '../img/select3.png',
        '../img/select4.png',
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
}