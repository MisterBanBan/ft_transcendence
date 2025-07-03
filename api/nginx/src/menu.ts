/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   menu.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:09:58 by afavier           #+#    #+#             */
/*   Updated: 2025/07/02 15:32:17 by mtbanban         ###   ########.fr       */
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
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import {TFAValidate} from "./auth/2fa-validate.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Add2FA, Remove2FA} from "./auth/toggle-2fa.js";
import {Logout} from "./auth/logout.js";
import { removeTwoFa } from "./menuInsert/removeTwoFa.js";
import { AuthUser } from './type.js';
import { getUser, setUser } from "./user-handler.js";
import { wait } from "./wait.js";
import { twoFApopUp } from "./menuInsert/twoFApopUp.js";
import { picture } from "./menuInsert/picture.js";



export class menu implements Component {
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private visibleForm: "none" | "login" | "profile" = "none";
    private formsContainer: HTMLElement;
    private formspicture: HTMLElement;
    private options!: HTMLElement[];
    private cursor!: HTMLVideoElement;
    private selectedIdx: number = 0;
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

        setUser(currentUser);

        this.keydownHandler = this.handleKeydown.bind(this);
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        this.videoMain.addEventListener("loadedmetadata", () => {
            console.log("Loadedmetadata ready");
            this.resize();
        });
        if (getUser()) {
            this.formsContainer.insertAdjacentHTML('beforeend', game());
            this.setupGameMenu();
        }
        this.authBtn.addEventListener('click', this.authBtnHandler);
    }

 

    private authBtnHandler = () => {
        console.log(getUser());
        if (!getUser() && this.visibleForm !== "login") {
            this.loadForm('login');
            this.visibleForm = "login";
        } else if (getUser() !== undefined){
            if (this.visibleForm !== "profile") {
                this.loadProfile();
                this.visibleForm = "profile";
            } else {
                this.formsContainer.innerHTML = '';
                this.loadAcceuil();
                this.formsContainer.insertAdjacentHTML('beforeend', game());
                this.setupGameMenu();
                this.visibleForm = "none";
            }
        } 
        else {
            this.formsContainer.innerHTML = '';
            this.loadAcceuil();
            //this.formsContainer.insertAdjacentHTML('beforeend', game());
            //this.setupGameMenu();
            this.visibleForm = "none";
        }
    };
    
    private loadProfile() {
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', profile());
        this.loadAcceuil();
        
        const logout = new Logout();
        logout.init();
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
            //a changer le png 
            this.videoMain.poster = "/img/acceuilDraw.png";
            this.videoMain.src = "/img/acceuilParam.mp4";
            this.videoMain.load(); 
        }
        this.formsContainer.insertAdjacentHTML('beforeend', settings());

        this.eventFormListeners();


    }


    
    private logOut() {

        this.formsContainer.innerHTML = '';
        this.formspicture.innerHTML = '';
        //this.formsContainer.insertAdjacentHTML('beforeend', game());
        
        this.loadAcceuil();
        this.visibleForm = "none";
        this.eventFormListeners();
    }


    private newPseudo(){
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', newPseudo());
        const changeUsername = new ChangeUsername();
        changeUsername.init();
        document.getElementById('pseudoReturnBtn')?.addEventListener('click', () => this.loadSettings());
        
    }
    private newPassword(){
        this.formsContainer.innerHTML = '';

        this.formsContainer.insertAdjacentHTML('beforeend', newPass());
        const changePassword = new ChangePassword();
        changePassword.init();
        document.getElementById('passReturnBtn')?.addEventListener('click', () => this.loadSettings());

    }

    private toggle2FA() {
        if (getUser()?.tfa) {
            this.remove2fa();
            return;
        }
        else if (getUser()?.tfa === false) {
            this.new2fa();
            return;
        }
    }

    private new2fa(){
        this.formsContainer.innerHTML = '';
        this.formsContainer.insertAdjacentHTML('beforeend', newTwoFa());
        const add2FA = new Add2FA();
        add2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', () => this.loadSettings());

    }

    private remove2fa() {
        this.formsContainer.innerHTML = '';
        this.formsContainer.insertAdjacentHTML('beforeend', removeTwoFa());
        const remove2FA = new Remove2FA();
        remove2FA.init();
        document.getElementById('2faReturnBtn')?.addEventListener('click', () => this.loadSettings());

    }
    
    private  async loadForm(formType: 'login' | 'register'){
        this.formsContainer.innerHTML = '';

        const formHtml = formType === 'login' ? loginForm() : registerForm();

        this.formsContainer.insertAdjacentHTML('beforeend', formHtml);
        if (formType === 'register') {
            const register = new Register();
            register.init();
        }
        else if (formType === 'login') {
            const login = new Login();
            login.init();
        }
        this.eventFormListeners();
    }

    private returnForm() {
        this.formsContainer.innerHTML = '';
        this.formsContainer.insertAdjacentHTML('beforeend', game());

        this.loadAcceuil();
        this.visibleForm = "none";
        this.eventFormListeners();
    }

    private async handle2FA() {
        const limit = 10;
        let attempts = 0;
        while (!document.cookie.includes("2FA-REQUIRED=false") && attempts < limit) {
            await wait(1000);
            console.log("Waiting for 2FA validation...", attempts);
            attempts++;
        }

        if (document.cookie.includes("2FA-REQUIRED=false")) {
            this.formsContainer.innerHTML = '';
            this.loadAcceuil();
            this.formsContainer.insertAdjacentHTML('beforeend', game());
            this.setupGameMenu();
            this.visibleForm = "none";
        } else if (attempts >= limit) {
            console.error("2FA validation timed out.");
        }

        this.eventFormListeners(); 
    }

    public async submit_loginForm() {

        const limit = 10;
        let attempts = 0;
        while (!getUser() && attempts < limit) {
            await wait(1000);
            attempts++;
        }

        const user = getUser();
        if (user) {
            if (user.tfa) {
                this.formsContainer.insertAdjacentHTML('beforeend', twoFApopUp());
                this.visibleForm = "none";
                const tfaValidate = new TFAValidate(user.username);
                tfaValidate.init();
            }
            else {
                this.formsContainer.innerHTML = '';
                this.loadAcceuil();
                this.formsContainer.insertAdjacentHTML('beforeend', game());
                this.formspicture.insertAdjacentHTML('beforeend', picture());
                this.setupGameMenu();
                this.visibleForm = "none";
            }
        } else if (attempts >= limit) {
            console.error("Login request timed out.");
        }
        
        this.eventFormListeners(); 
    }

    public async submit_registerForm() {

        const limit = 10;
        let attempts = 0;
        while (!getUser() && attempts < limit) {
            await wait(1000);
            attempts++;
        }
        if (getUser()) {
            this.formsContainer.innerHTML = '';
            this.loadAcceuil();
            this.formsContainer.insertAdjacentHTML('beforeend', game());
            this.formspicture.insertAdjacentHTML('beforeend', picture());
            this.setupGameMenu();
            this.visibleForm = "none";
        }
        this.eventFormListeners(); 
    }
    
    private eventFormListeners() {
        document.getElementById('registerBtn')?.addEventListener('click', () => this.loadForm('register'));
        document.getElementById('loginBtn')?.addEventListener('click', () => this.loadForm('login'));
        document.getElementById('profileReturnBtn')?.addEventListener('click', () => this.returnForm());
        document.getElementById('submit-login')?.addEventListener('click', () => this.submit_loginForm());
        document.getElementById('submit-register')?.addEventListener('click', () => this.submit_registerForm());
        document.getElementById('settingsReturnBtn')?.addEventListener('click', () => this.loadProfile());
        document.getElementById('scoreReturnBtn')?.addEventListener('click', () => this.loadProfile());
        document.getElementById('submit-2fa')?.addEventListener('click', () => this.handle2FA());

        
        document.getElementById('score')?.addEventListener('click', () => this.loadScore());
        document.getElementById('settings')?.addEventListener('click', () => this.loadSettings());
        document.getElementById('logout')?.addEventListener('click', () => this.logOut());
        document.getElementById('newPseudo')?.addEventListener('click', () => this.newPseudo());
        document.getElementById('newPass')?.addEventListener('click', () => this.newPassword());
        document.getElementById('toggle-2fa')?.addEventListener('change', () => this.toggle2FA());

    }
    

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
    }
    
    private handleKeydown(e: KeyboardEvent) {
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
    }
}


