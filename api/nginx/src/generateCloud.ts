/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generateCloud.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/07 05:58:52 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 07:25:07 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function generateCloud(containerId: string, count: number = 5): HTMLElement[] {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }

    const clouds: HTMLElement[] = [];
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('img');
        cloud.src = '/img/kodama_walk.png';
        cloud.alt = 'cloud';
        cloud.style.position = 'absolute';
        const minVw = 5;
        const maxVw = 15;
        const size = randomSize(minVw, maxVw);
        cloud.style.width = `${size}vw`;
        cloud.style.height = 'auto';
        //cloud.className = 'w-18 h-18 animate-float';
        cloud.classList.add('animate-float');
        cloud.style.top = `${20 + Math.random() * 20}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        //cloud.style.border = '1px solid red';
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