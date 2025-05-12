/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/05/12 10:40:39 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";

export class menu implements Component{
    private boundKeyDownHandler!: (e: KeyboardEvent) => void;
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
    }
    public init(): void {
    
        this.videoPaths.forEach((src: string) => {
          const link: HTMLLinkElement = document.createElement('link');
          link.rel = 'preload';
          link.as = 'video';
          link.href = src;
          link.type = 'video/mp4';
          document.head.appendChild(link);
        });

        this.boundKeyDownHandler = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.boundKeyDownHandler);
    }

    private onKeyDown(e: KeyboardEvent) {
        const key = e.key.toLocaleLowerCase();
            if (key == 'w' || key == 'arrowup') {
                this.loadpage('up');
            } if (key == 's' || key == 'arrowdown') {
                this.loadpage('down');
            } if (key == 'enter') {
                this.newPage();
            }
    }

    public destroy(): void {
        window.removeEventListener('keyup', this.boundKeyDownHandler);
    }

    private newPage() {
        if (this.currentPage === 0) {
            window.history.pushState(null, "", "/Pong");
            //permet de faire reagir les ecoute sur popstate depuis router pour init updatepage popstate = historique qui change sans actualiser
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
    }
    
    private loadpage(direction: 'up' | 'down') {
        
        if (direction === "down") {
            this.currentPage = (this.currentPage + 1) % this.videoPaths.length;
        } else if (direction === "up") {
            this.currentPage = (this.currentPage - 1 + this.videoPaths.length) % this.videoPaths.length;
        }
        this.menuSource.src = this.videoPaths[this.currentPage];
        this.video.load();

    }


}