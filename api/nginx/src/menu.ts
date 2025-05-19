/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/05/19 10:38:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";

export class menu implements Component{
    //private boundKeyDownHandler!: (e: KeyboardEvent) => void;
    //private boundClickDownHandler!: (e: KeyboardEvent) => void;
    private menuSource: HTMLSourceElement;
    private auth: HTMLElement;
    private img: HTMLElement;
    private videoMenu: HTMLVideoElement;
    //private video: HTMLVideoElement;
    private currentPage: number = 0;
    private windowPaths: string[] = [
        'new_game',
        'continue',
        'setting',
        'quit'
      ];
    
    constructor(menuId: string, imgId: string, authId: string, videoId: string) {
        const menuElement = document.getElementById(menuId) as HTMLSourceElement;
        if (!menuElement) throw new Error('Menu element not found');
        this.menuSource = menuElement;

        const img = document.getElementById(imgId);
        if (!img) throw new Error('video element not found');
        this.img = img;
        
        const auth = document.getElementById(authId);
        if (!auth) throw new Error('video element not found');
        this.auth = auth;

        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('video element not found');
        this.videoMenu = video;
    }
    public init(): void {

        this.auth.addEventListener('click', this.onClickDown);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('resize', this.positionImageVideo);
    }

    private onClickDown = (e: MouseEvent) => {
        e.preventDefault();
        if (this.img) {
            this.img.classList.toggle('hidden');
        }
    }
    
    private onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLocaleLowerCase();
            if (key == 'w' || key == 'arrowup') {
                this.loadpage('up');
            } if (key == 's' || key == 'arrowdown') {
                this.loadpage('down');
            } if (key == 'enter') {
                this.newPage();
            }
    }

    private positionImageVideo() {
        const rect = this.videoMenu.getBoundingClientRect();
        this.img.style.left   = rect.left + rect.width * 0.04 + "px";
        this.img.style.top    = rect.top  + rect.height * 0.18 + "px";
        this.img.style.width  = rect.width * 0.70 + "px";
        this.img.style.height = rect.height * 0.70 + "px";
        
    }
    
    public destroy(): void {
        window.removeEventListener('keyup', this.onKeyDown);
    }

    private newPage() {
        if (this.currentPage === 0) {
            window.history.pushState(null, "", "/Pong");
            //permet de faire reagir les ecoute sur popstate depuis router pour init updatepage popstate = historique qui change sans actualiser
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        else if (this.currentPage === 1){
            
        }
        else if (this.currentPage === 2) {
            
        }
        else if (this.currentPage === 3) {
            
        }
    }
    
    private loadpage(direction: 'up' | 'down') {
        //ici mettre lanimation de la fleches
        if (direction === "down") {
            this.currentPage = (this.currentPage + 1) % this.windowPaths.length;
        } else if (direction === "up") {
            this.currentPage = (this.currentPage - 1 + this.windowPaths.length) % this.windowPaths.length;
        }

    }
}