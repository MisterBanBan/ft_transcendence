/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generateBirds.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 18:07:38 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 06:01:14 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function generateBirds(containerId: string, count:number = 5): HTMLElement[] {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }
    
    const birds: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
        const bird = document.createElement('img');
        bird.src = '/img/kodama_stop.png';
        bird.alt = 'bird';
        bird.style.position = 'absolute';
        bird.className = 'w-16 h-16 animate-float';
        bird.style.top = `${20 + Math.random() * 20}%`;
        bird.style.left = `${Math.random() * 100}%`;
        container.appendChild(bird);
        birds.push(bird);
    }
    return birds;


}

export function animateBirds(birds: HTMLElement[]) {
    const speed = 0.2;
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