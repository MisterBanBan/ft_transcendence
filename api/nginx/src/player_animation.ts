/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   player_animation.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:44 by afavier           #+#    #+#             */
/*   Updated: 2025/07/01 18:58:09 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class PlayerAnimation{
    private element: HTMLElement;
    private images: string[] = [
        '../img/kodama_stop.png',
        '../img/kodama_walk.png',
        '../img/kodama_walk2.png',
        '../img/kodama_walk3.png',
    ];
    private currentFrame: number = 0;
    private animationInterval: number | null = null;

    constructor(elementId: string) {
        const element = document.getElementById(elementId);
        if (!element) throw new Error("element not found");
        this.element = element;
    }
    startAnimation(frameRate: number = 100) {
        if (this.animationInterval) return;
        this.animationInterval = window.setInterval(() => {
            //console.log(this.images[this.currentFrame]);
            this.currentFrame = (this.currentFrame + 1) % this.images.length;
            this.element.style.backgroundImage = `url(${this.images[this.currentFrame]})`;
        }, frameRate); 
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            this.currentFrame = 0;
            this.element.style.backgroundImage = `url(${this.images[0]})`;
        }
    }
    updatePosition(x: number, y: number) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }
    
}