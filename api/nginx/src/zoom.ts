import { Component } from "./component.js";
import { router } from "./router.js";

export class Zoom implements Component{
    private boundKeyUpHandler!: (e: KeyboardEvent) => void;
    private video: HTMLVideoElement;

    constructor(zoomId: string) {
        const zoomElement = document.getElementById(zoomId);
        if(!zoomElement) {
            throw new Error('Zoom element not found');
        }

        const video = zoomElement.querySelector('video');
        if (!video) {
            throw new Error('no video found in zoom element');
        }
        this.video = video;
    }
        public init(): void {
            this.boundKeyUpHandler = (e) => {
                if (e.key.toLowerCase() == 'p') {
                    this.video.classList.add('scale-300', 'transition-transform',
                        'duration-500', 'cursor-zoom-out');
                    this.video.addEventListener('transitionend', this.handleTransitionEnd);
                }
            };
            window.addEventListener('keyup',this.boundKeyUpHandler);
        }
        
    

    private handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName === 'transform') {
            this.video.removeEventListener('transitionend', this.handleTransitionEnd);
            router.navigateTo("/game");
        }
    }

    public destroy() {
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        this.video.removeEventListener('transitionend', this.handleTransitionEnd);
    }
}