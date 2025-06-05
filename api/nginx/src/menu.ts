/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/06/05 18:45:46 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";
import { loginForm } from "./loginForm.js";
import { registerForm } from "./registerForm.js";
import { profile } from "./profile.js";



export class menu implements Component {
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private profileBtn: HTMLElement;
    private visibleForm: "none" | "login" | "profile" = "none";

    private formsContainer: HTMLElement;
    
    constructor(videoId: string, containerFormId: string, authBtnId: string, profileBtnId: string) { 
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
        
        const profileBtn = document.getElementById(profileBtnId);
        if (!profileBtn) throw new Error('Form wrapper not found');
        this.profileBtn= profileBtn;
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        
        this.videoMain.addEventListener("loadedmetadata", () => {
            console.log("Loadedmetadata ready");
            this.resize();
        });
        
        this.authBtn.addEventListener('click', this.authBtnHandler);
        this.profileBtn.addEventListener('click', this.profileBtnHandler);
    }

    private authBtnHandler = () => {
        if (this.visibleForm !== "login") {
            this.loadForm('login');
            this.visibleForm = "login";
        } else {
            this.formsContainer.innerHTML = '';
            this.visibleForm = "none";
        }
    };
    

    private profileBtnHandler = () => {
        if (this.visibleForm !== "profile") {
            this.loadProfile();
            this.visibleForm = "profile";
        } else {
            this.formsContainer.innerHTML = '';
            this.visibleForm = "none";
        }
    }
    
    private loadProfile() {
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', profile());
        this.eventFormListeners();
    }
    
    private  async loadForm(formType: 'login' | 'register'){
        this.formsContainer.innerHTML = '';

        const formHtml = formType === 'login' ? loginForm() : registerForm();
    
        this.formsContainer.insertAdjacentHTML('beforeend', formHtml);
        this.eventFormListeners();
    }
    
    private eventFormListeners() {
        document.getElementById('registerBtn')?.addEventListener('click', () => this.loadForm('register'));
        document.getElementById('loginBtn')?.addEventListener('click', () => this.loadForm('login'));
        document.getElementById('profileReturnBtn')?.addEventListener('click', () => this.profileBtnHandler());
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
