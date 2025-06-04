/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/06/04 15:33:12 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from "./component.js";


export class menu implements Component {
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private loginForm: HTMLElement;
    private registerForm: HTMLElement;
    private registerBtn: HTMLElement;
    private loginBtn: HTMLElement;
    private ffaDiv: HTMLElement;
    private ffaBtn: HTMLElement;
    
    constructor(videoId: string, containerFormId: string, authBtnId: string, loginFormId: string, registerFormId: string, registerBtnId: string, loginBtnId: string, ffaId: string) { 
        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('Video element not found');
        this.videoMain = video;

        const container = document.getElementById(containerFormId);
        if (!container) throw new Error('Form wrapper not found');
        this.containerForm = container;

        const authBtn = document.getElementById(authBtnId);
        if (!authBtn) throw new Error('Auth button not found');
        this.authBtn = authBtn;

        const loginForm = document.getElementById(loginFormId);
        if (!loginForm) throw new Error('Form wrapper not found');
        this.loginForm = loginForm;

        const registerForm = document.getElementById(registerFormId);
        if (!registerForm) throw new Error('Form wrapper not found');
        this.registerForm = registerForm;

        const registerBtn = document.getElementById(registerBtnId);
        if (!registerBtn) throw new Error('Form wrapper not found');
        this.registerBtn = registerBtn;

        const loginBtn = document.getElementById(loginBtnId);
        if (!loginBtn) throw new Error('Form wrapper not found');
        this.loginBtn= loginBtn;

        const ffaDiv = document.getElementById(ffaId);
        if (!ffaDiv) throw new Error('Form wrapper not found');
        this.ffaDiv= ffaDiv;
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        
        this.videoMain.addEventListener("loadedmetadata", () => {
            console.log("Loadedmetadata ready");
            this.resize();
        });

        this.authBtnHandler = () => {
            if(!this.loginForm.classList.contains('hidden')  || 
            !this.registerForm.classList.contains('hidden')) {
                this.loginForm.classList.add('hidden');
                this.registerForm.classList.add('hidden');
            } else {
                this.loginForm.classList.remove('hidden');
                this.registerForm.classList.add('hidden');
                this.resize();
            }
            
        };

        this.registerBtnHandler = () => { 
            this.loginForm.classList.add('hidden');
            this.registerForm.classList.remove('hidden');
            
        };

        this.loginBtnHandler = () => { 
            this.registerForm.classList.add('hidden');
            this.loginForm.classList.remove('hidden');
        };
        this.authBtn.addEventListener('click', this.authBtnHandler);
        this.registerBtn.addEventListener('click', this.registerBtnHandler);
        this.loginBtn.addEventListener('click', this.loginBtnHandler);
    }

    private authBtnHandler = () => {};
    private registerBtnHandler = () => {};
    private loginBtnHandler = () => {};
    
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
        this.registerBtn.removeEventListener('click', this.registerBtnHandler);
        this.loginBtn.removeEventListener('click', this.loginBtnHandler);
    }
}
