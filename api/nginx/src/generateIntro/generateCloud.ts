/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   generateCloud.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/07 05:58:52 by afavier           #+#    #+#             */
/*   Updated: 2025/07/10 16:15:31 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function generateCloud(containerId: string, count: number = 15): HTMLElement[] {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container #${containerId} not found`);
    }

    const clouds: HTMLElement[] = [];
    const step = 100 / count;
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('img');
        if(i < 5)
            cloud.src = '/img/clouds.png';
        else if(i < 10)
            cloud.src = '/img/cloudd.png';
        else
            cloud.src = '/img/cloudss.png';
        cloud.alt = 'cloud';
        cloud.style.position = 'absolute';
        const minVw = 5;
        const maxVw = 15;
        const size = randomSize(minVw, maxVw);
        cloud.style.width = `${size}vw`;
        cloud.style.height = 'auto';
        cloud.classList.add('animate-float');
        cloud.style.top = `${20 + Math.random() * 5}%`;
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