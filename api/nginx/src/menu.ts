/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/07/26 12:01:08 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";
import { loginForm } from "./menuInsert/loginForm.js";
import { registerForm } from "./menuInsert/registerForm.js";
import { game } from "./menuInsert/game.js";
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import { AuthUser } from './type.js';
import { getUser, setUser } from "./user-handler.js";
import { viewManager } from "./views/viewManager.js";



export class menu implements Component {
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    //private visibleForm: "none" | "login" | "parametre" = "none";
    private formsContainer: HTMLElement;
    private formspicture: HTMLElement;
    private options!: HTMLElement[];
    private cursor!: HTMLVideoElement;
    private selectedIdx: number = 0;
    private viewManager: viewManager;
    private keydownHandler: (e: KeyboardEvent) => void;
    
    constructor(videoId: string, containerFormId: string, authBtnId: string, currentUser: AuthUser | undefined) { 
        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('Video element not found');
        this.videoMain = video;

        const container = document.getElementById(containerFormId);
        if (!container) throw new Error('Form wrapper not found');
        this.containerForm = container;

        const authBtn = document.getElementById(authBtnId);
        if (!authBtn) throw new Error('Auth button not found');
        this.authBtn = authBtn;

        const formsContainer = document.getElementById('dynamic-content');
        if (!formsContainer) throw new Error('Form wrapper not found');
        this.formsContainer= formsContainer;

        const formspicture = document.getElementById('picture');
        if (!formspicture) throw new Error('Form wrapper not found');
        this.formspicture = formspicture;

        this.viewManager = new viewManager(formsContainer,  this.formspicture, this.videoMain, () => this.setupGameMenu());

        setUser(currentUser);

        this.keydownHandler = this.handleKeydown.bind(this);
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        this.videoMain.addEventListener("loadedmetadata", () => {
            console.log("Loadedmetadata ready");
            this.resize();
        });
        this.resize();
        this.authBtn.addEventListener('click', this.authBtnHandler);
    }

 
    private authBtnHandler = () => {
        if (!getUser()) {
            this.viewManager.show('login');
        } else {
            this.viewManager.show('parametre');
        }
    };
    

    private loadAcceuil (){
        this.videoMain.poster = "/img/pong.png";
        this.videoMain.src = '/img/acceuil.mp4';
        this.videoMain.load();
    }
  
       

    private updateCursor() {
        if (!this.options.length) return;
        const firstOption = this.options[0];
        const selected = this.options[this.selectedIdx];
        const offset = selected.offsetTop - firstOption.offsetTop;
        this.cursor.style.top = offset + "px";
        

        this.options.forEach((opt, i) => {
            opt.classList.toggle('selected', i === this.selectedIdx);
        });
    }
    
    private selectOption() {
        if (!this.options.length) return;
        const selected = this.options[this.selectedIdx];
        if (selected.id === 'Offline') {
            window.history.pushState(null, "", "Pong?mode=offline");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'Online') {
            window.history.pushState(null, "", "Pong?mode=online");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'AI') {
            window.history.pushState(null, "", "Pong?mode=ai");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'Tournament') {
            this.viewManager.show('parametre');
        }
    }
    
    private handleKeydown(e: KeyboardEvent) {
        console.log(e.key)
        if (!this.options.length) return;
        if (e.key === "ArrowDown") {
            this.selectedIdx = (this.selectedIdx + 1) % this.options.length;
            this.updateCursor();
        } else if (e.key === "ArrowUp") {
            this.selectedIdx = (this.selectedIdx - 1 + this.options.length) % this.options.length;
            this.updateCursor();
        } else if (e.key === "Enter") {
            this.selectOption();
        }
    }

    private setupGameMenu() {
        this.options = Array.from(document.querySelectorAll('.menu-option')) as HTMLElement[];
        const cursor = document.getElementById('cursor-video') as HTMLVideoElement;
        if (!cursor) throw new Error('Cursor video not found');
        this.cursor = cursor;
        this.updateCursor();
        this.options.forEach((opt, i) => {
            opt.addEventListener('click', () => {
                this.selectedIdx = i;
                this.updateCursor();
                this.selectOption();
            });
        });
        document.removeEventListener('keydown', this.keydownHandler);
        document.addEventListener('keydown', this.keydownHandler);
    }
    
    private resize = () => {
        const rect = this.videoMain.getBoundingClientRect();
            
        this.containerForm.style.left = `${(rect.left )}px`;
        this.containerForm.style.top = `${(rect.top )}px`;
        this.containerForm.style.width = `${rect.width }px`;
        this.containerForm.style.height = `${rect.height}px`;
        this.containerForm.style.position = "absolute";
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resize);
        this.authBtn.removeEventListener('click', this.authBtnHandler);
        document.removeEventListener('keydown', this.keydownHandler);
    }
}


