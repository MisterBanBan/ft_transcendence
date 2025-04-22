export class Zoom {
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private isZoom: boolean = false;
    private video: HTMLVideoElement;

    constructor(zoomId: string) {
        const zoomElement = document.getElementById(zoomId);
        if(!zoomElement) throw new Error('Zoom element not found');
        const video = zoomElement.querySelector('video');
        if (!video) throw new Error('no video found in zoom element');
        this.video = video;


        this.boundKeyUpHandler = (e) => {
            if (e.key.toLowerCase() == 'p') {
                this.isZoom = true;
                if (this.isZoom) {
                    video.classList.add('scale-300', 'transition-transform',
                        'duration-500', 'cursor-zoom-out');
                    this.video.addEventListener('transitionend', this.handleTransitionEnd);
                } else {
                    video.classList.remove('scale-300', 'transition-transform',
                        'duration-500', 'cursor-zoom-out');
                }
            }
        };
        window.addEventListener('keyup',this.boundKeyUpHandler);
    }

    private handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName === 'transform') {
            this.video.removeEventListener('transitionend', this.handleTransitionEnd);
            window.history.pushState(null, "", "/game");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
    }

    public destroy() {
        window.removeEventListener('keyup', this.boundKeyUpHandler);
        this.video.removeEventListener('transitionend', this.handleTransitionEnd);
    }
}