export class Zoom {
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private isZoom: boolean = false;

    constructor(zoomId: string) {
        const zoomElement = document.getElementById(zoomId);
        if(!zoomElement) throw new Error('Zoom element not found');
        const video = zoomElement.querySelector('video');
        if (!video) throw new Error('no video found in zoom element');
        
        console.log("zoom");

        this.boundKeyUpHandler = (e) => {
            if (e.key.toLowerCase() == 'p') {
                this.isZoom = true;
                if (this.isZoom) {
                    video.classList.add('scale-300', 'transition-transform', 'duration-500', 'cursor-zoom-out');
                } else {
                    video.classList.remove('scale-300', 'transition-transform', 'duration-500', 'cursor-zoom-out');
                }
            }
        };
        window.addEventListener('keyup',this.boundKeyUpHandler);
    }
    public destroy() {
        window.removeEventListener('keyup', this.boundKeyUpHandler);
    }
}