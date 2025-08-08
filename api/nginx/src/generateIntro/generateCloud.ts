export function generateCloud(containerId: string, count: number = 20): HTMLElement[] {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }

    const clouds: HTMLElement[] = [];
    const step = 100 / count;

    const cloudImages = [
        '/img/cloud1.png',
        '/img/cloud2.png',
        '/img/cloud3.png',
        '/img/cloud4.png',
        '/img/cloud5.png',
        '/img/cloud6.png',
        '/img/cloud7.png',
        '/img/cloud8.png',
    ];
    
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('img');
        const randomImage = cloudImages[Math.floor(Math.random() * cloudImages.length)];
        cloud.src = randomImage;
        cloud.alt = 'cloud';
        cloud.style.position = 'absolute';
        const minVw = 5;
        const maxVw = 15;
        const size = randomSize(minVw, maxVw);
        cloud.style.width = `${size}vw`;
        cloud.style.height = 'auto';
        cloud.classList.add('animate-float');
        cloud.style.top = `${20 + Math.random() * 15}%`;
        cloud.style.left = `${i * step + Math.random() * (step * 0.5)}%`;
        container.appendChild(cloud);
        clouds.push(cloud);
    }
    return clouds;

    function randomSize(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}

export function destroyCloud(clouds: HTMLElement[]): void {
    clouds.forEach(clouds => clouds.remove());
}