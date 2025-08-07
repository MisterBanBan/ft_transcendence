export function generateTrees(containerId:string, count: number = 20): HTMLElement[] {
    const container = document.getElementById(containerId);
    if(!container) {
        throw new Error(`Container #${containerId} not found`);
    }
    
    const treesS: HTMLElement[] = [];
    const step = 100 / count;

    const treesImages = [
        '/img/tree2.png',
        '/img/tree3.png',
        '/img/tree1.png',
    ];
    
    for(let i = 0; i < count; i++)
    {
        const tree = document.createElement('img');
        const randomImage = treesImages[Math.floor(Math.random() * treesImages.length)];
        tree.src = randomImage;
        tree.alt = 'tree';
        tree.style.position = 'absolute';
        const minVw = 10;
        const maxVw = 25;
        const size = randomSize(minVw, maxVw);
        tree.style.width = `${size}vw`;
        tree.style.height = 'auto';
        tree.style.bottom = `${13}%`;
        tree.style.left = `${i * step + Math.random() * (step * 0.5)}%`;
        container.appendChild(tree);
        treesS.push(tree);
    }
    return treesS;

    function randomSize(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}

export function destroyTree(treesS: HTMLElement[]): void {
    treesS.forEach(treesS => treesS.remove());
}