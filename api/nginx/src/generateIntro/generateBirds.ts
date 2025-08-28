export function generateBirds(containerId: string, count:number = 15): HTMLElement[] {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }
    
    const birds: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
        const bird = document.createElement('video');
    bird.autoplay    = true;
    bird.loop        = true;
    bird.muted       = true;
    const src = document.createElement('source');
    src.src  = '/img/bird.mp4';
    src.type = 'video/mp4';
    bird.appendChild(src);

    bird.className = 'absolute w-[5%] h-[5%] object-contain animate-float';
    bird.style.top  = `${20 + Math.random() * 30}%`;
    bird.style.left = `${Math.random() * 100}%`;

    container.appendChild(bird);
    birds.push(bird);
    }
    return birds;


}

export function animateBirds(birds: HTMLElement[]) {
    const speed = 0.1;
    let rafId: number;
    
    const loop = () => {
      birds.forEach(bird => {
        let left = parseFloat(bird.style.left);
        left -= speed;
        if (left < -10) left = 110;
        bird.style.left = `${left}%`;
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return rafId;
}

export function destroyBirds(birds: HTMLElement[], rafId: number): void {
    cancelAnimationFrame(rafId);
    birds.forEach(birds => birds.remove());
}