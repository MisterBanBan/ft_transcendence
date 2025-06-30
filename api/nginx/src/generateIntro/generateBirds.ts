/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generateBirds.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 18:07:38 by afavier           #+#    #+#             */
/*   Updated: 2025/06/30 22:42:31 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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

    // 3) Styles Tailwind + positionnement absolu
    bird.className = 'absolute w-16 h-16 object-contain animate-float';
    bird.style.top  = `${20 + Math.random() * 10}%`;
    bird.style.left = `${Math.random() * 100}%`;

    // 4) Ajout au DOM et au tableau
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