export class menu {
    private boundKeyUpHandler: (e: KeyboardEvent) => void;
    private menuSource: HTMLSourceElement;
    private video: HTMLVideoElement;
    private currentPage: number = 0;
    private videoPaths: string[] = [
        '/img/new_game.mp4',
        '/img/continue.mp4',
        '/img/setting.mp4',
        '/img/quit.mp4'
      ];
    
    constructor(menuId: string) {
        const menuElement = document.getElementById(menuId) as HTMLSourceElement;
        if (!menuElement) throw new Error('Menu element not found');
        this.menuSource = menuElement;

        const video = this.menuSource.closest('video') as HTMLVideoElement;
        if (!video) throw new Error('video element not found');
        this.video = video;
          
          this.videoPaths.forEach((src: string) => {
            const link: HTMLLinkElement = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = src;
            link.type = 'video/mp4';
            document.head.appendChild(link);
          });

        this.boundKeyUpHandler = (e) => {
            const key = e.key.toLocaleLowerCase();
            if (key == 'w' || key == 'arrowup') {
                this.loadpage('up');
            } if (key == 's' || key == 'arrowdown') {
                this.loadpage('down');
            }  
        };
        window.addEventListener('keydown', this.boundKeyUpHandler);
    }
    loadpage(direction: 'up' | 'down') {
        
        if (direction === "down") {
            this.currentPage = (this.currentPage + 1) % this.videoPaths.length;
        } else if (direction === "up") {
            this.currentPage = (this.currentPage - 1 + this.videoPaths.length) % this.videoPaths.length;
        }
        this.menuSource.src = this.videoPaths[this.currentPage];
        this.video.load();

    }

    private destroy() {
        window.removeEventListener('keyup', this.boundKeyUpHandler);
    }
}