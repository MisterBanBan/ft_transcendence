/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/06/10 21:04:04 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";
import { loginForm } from "./menuInsert/loginForm.js";
import { registerForm } from "./menuInsert/registerForm.js";
import { profile } from "./menuInsert/profile.js";
import { score } from "./score/score.js";
import { settings } from "./menuInsert/settings.js";
import { newPseudo } from "./menuInsert/newPseudo.js";
import { newPass } from "./menuInsert/newPass.js";
import { newTwoFa } from "./menuInsert/newTwoFa.js";
import { game } from "./menuInsert/game.js";



export class menu implements Component {
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private visibleForm: "none" | "login" | "profile" = "none";
    private connected: boolean = false;
    private formsContainer: HTMLElement;
    
    constructor(videoId: string, containerFormId: string, authBtnId: string) { 
        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('Video element not found');
        this.videoMain = video;

        const container = document.getElementById(containerFormId);
        if (!container) throw new Error('Form wrapper not found');
        this.containerForm = container;

        const authBtn = document.getElementById(authBtnId);
        if (!authBtn) throw new Error('Auth button not found');
        this.authBtn = authBtn;

        const formsContainer = document.getElementById('container_form');
        if (!formsContainer) throw new Error('Form wrapper not found');
        this.formsContainer= formsContainer;
        
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        
        this.videoMain.addEventListener("loadedmetadata", () => {
            console.log("Loadedmetadata ready");
            this.resize();
        });
        
        this.authBtn.addEventListener('click', this.authBtnHandler);
    }

    private authBtnHandler = () => {
        if (this.visibleForm !== "login" && this.connected === false) {
            this.loadForm('login');
            this.visibleForm = "login";
            this.connected = true;
        } else if (this.connected === true && this.visibleForm !== "login" ){
            if (this.visibleForm !== "profile") {
                this.loadProfile();
                this.visibleForm = "profile";
            } else {
                this.formsContainer.innerHTML = '';
                this.formsContainer.insertAdjacentHTML('beforeend', game());

                this.loadAcceuil();
                this.visibleForm = "none";
            }
        } 
        else {
            this.formsContainer.innerHTML = '';
            this.formsContainer.insertAdjacentHTML('beforeend', game());
            this.visibleForm = "none";
        }
    };
    
    private loadProfile() {
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', profile());
        this.eventFormListeners();
    }

    private async loadScore() {
        this.formsContainer.innerHTML = '';
        const scoreHtml = await score();
        this.formsContainer.insertAdjacentHTML('beforeend', scoreHtml);
        this.eventFormListeners();
    }
    
    private loadSettings() {
        this.formsContainer.innerHTML = '';
        if (this.videoMain.src !== '/img/acceuilParam.mp4') {
            this.videoMain.poster = "/img/acceuilDraw.png";
            this.videoMain.src = "/img/acceuilParam.mp4";
            this.videoMain.load(); 
        }
        this.formsContainer.insertAdjacentHTML('beforeend', settings());
        this.eventFormListeners();
    }

    private logOut() {
        this.formsContainer.innerHTML = '';
        this.formsContainer.insertAdjacentHTML('beforeend', game());

        this.loadAcceuil();
        this.visibleForm = "none";
        this.eventFormListeners();
    }


    private newPseudo(){
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', newPseudo());
        document.getElementById('pseudoReturnBtn')?.addEventListener('click', () => this.returnForm());
        
    }
    private newPassword(){
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', newPass());
        document.getElementById('passReturnBtn')?.addEventListener('click', () => this.returnForm());

    }
    private new2fa(){
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', newTwoFa());
        document.getElementById('2faReturnBtn')?.addEventListener('click', () => this.returnForm());

    }
    
    private  async loadForm(formType: 'login' | 'register'){
        this.formsContainer.innerHTML = '';

        const formHtml = formType === 'login' ? loginForm() : registerForm();
    
        this.formsContainer.insertAdjacentHTML('beforeend', formHtml);
        this.eventFormListeners();
    }

    private returnForm() {
        this.formsContainer.innerHTML = '';
        this.formsContainer.insertAdjacentHTML('beforeend', game());

        this.loadAcceuil();
        this.visibleForm = "none";
        this.eventFormListeners();
    }
    
    private eventFormListeners() {
        document.getElementById('registerBtn')?.addEventListener('click', () => this.loadForm('register'));
        document.getElementById('loginBtn')?.addEventListener('click', () => this.loadForm('login'));
        document.getElementById('profileReturnBtn')?.addEventListener('click', () => this.returnForm());

        document.getElementById('score')?.addEventListener('click', () => this.loadScore());
        document.getElementById('settings')?.addEventListener('click', () => this.loadSettings());
        document.getElementById('log out')?.addEventListener('click', () => this.logOut());
        document.getElementById('newPseudo')?.addEventListener('click', () => this.newPseudo());
        document.getElementById('newPass')?.addEventListener('click', () => this.newPassword());
        document.getElementById('new2fa')?.addEventListener('click', () => this.new2fa());

    }
    

    private loadAcceuil (){
        this.videoMain.poster = "/img/pong.png";
        this.videoMain.src = '/img/acceuil.mp4';
        this.videoMain.load();
    }
    
    private resize = () => {
        const rect = this.videoMain.getBoundingClientRect();
            
        this.containerForm.style.left = `${(rect.left )}px`;
        this.containerForm.style.top = `${(rect.top )}px`;
        this.containerForm.style.width = `${rect.width * 0.8}px`;
        this.containerForm.style.height = `${rect.height}px`;
        this.containerForm.style.position = "absolute";
        
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resize);
        this.authBtn.removeEventListener('click', this.authBtnHandler);
    }
}
