/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ViewManager.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:58:58 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/31 17:50:14 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { SettingsView } from './settingsView.js';
import { getUser } from '../user-handler.js';
import { parameterView } from './parameterView.js';
import { friendsView } from './friendsView.js';
import { loginView } from './loginView.js';
import { registerView } from './registerView.js';
import { Component } from '../component.js';
import { game } from '../menuInsert/game.js';
import { picture } from '../menuInsert/Picture/picture.js';
import { friendsActif } from '../menuInsert/Picture/friendsActif.js';
import { tournamentView } from './tournamentView.js';
import { friendActifLog } from '../menuInsert/Picture/friendsActifLog.js';


export class viewManager implements Component {
    //private pictureContainer: HTMLElement;
    private activeView : Component | null = null;

    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private formsContainer: HTMLElement;
    private formspicture: HTMLElement;
    private options!: HTMLElement[];
    private cursor!: HTMLVideoElement;
    private selectedIdx: number = 0;
    private activeViewName: string | null = null;
    private keydownHandler: (e: KeyboardEvent) => void;

    constructor(videoId: string, containerId: string, authBtnId: string) {


        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('Video element not found');
        this.videoMain = video;

        const containerForm = document.getElementById(containerId);
        if (!containerForm) throw new Error('Form wrapper not found');
        this.containerForm = containerForm;

        const authBtn = document.getElementById(authBtnId);
        if (!authBtn) throw new Error('Auth button not found');
        this.authBtn = authBtn;

        const formsContainer = document.getElementById('dynamic-content');
        if (!formsContainer) throw new Error('Form wrapper not found');
        this.formsContainer= formsContainer;

        const formspicture = document.getElementById('picture');
        if (!formspicture) throw new Error('Form wrapper not found');
        this.formspicture = formspicture;
        
        this.keydownHandler = this.handleKeydown.bind(this);
        
        this.userLog();
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

    private userLog()
    {
        if (!getUser())
            this.show("login");
        else
            this.show("game");
    }

    public show(viewName: string) {
        if (this.activeViewName === 'game') {
            this.destroyGameListeners();
        }
        this.activeView?.destroy();
        
        this.formsContainer.innerHTML = '';
        //this.pictureContainer.innerHTML = '';
        
        let newView: Component | null = null;


        console.log(`Switching to view: ${viewName}`);
        switch (viewName) {
            case 'game':
                this.loadAcceuilVideo();
                this.formsContainer.innerHTML = game();
                this.formspicture.innerHTML = picture();
                const firendDiv = document.getElementById('friendsActif');
                if (firendDiv) {
                    firendDiv.innerHTML = friendsActif();
                }
                //document.querySelectorAll('#friend').forEach(btn => {
                 //   btn.addEventListener('click', (e) => this.friendAction(e as MouseEvent));          });
                    document.querySelectorAll('#friend').forEach(btn => {
                        const clone = btn.cloneNode(true);
                        btn.replaceWith(clone);
                        clone.addEventListener('click', (e) => this.friendActionLog(e as MouseEvent));
                    });
                    try {
                        this.setupGameMenu();
                    } catch (error) {
                        console.error("Error setting up game menu:", error);
                    }
                    this.wordAnimation();
                break;
            case 'login':
                newView =  new loginView(this.formsContainer, this);
                break;
            case 'register':
                newView = new registerView(this.formsContainer, this.formspicture, this);
                break;
            case 'settings':
                const currentUser = getUser();
                if (currentUser) {
                    newView = new SettingsView(this.formsContainer,  this);
                } else {
                    console.error("No user is currently authenticated.");
                }
                break;
            case 'acceuil':
                this.loadAcceuilVideo();
                break;
            case 'tournament':
                newView = new tournamentView(this.formsContainer, this);
                break;
            case 'parametre':
                newView = new parameterView(this.formsContainer, this, this.formspicture);
                break;
            case 'friendsList':
                newView = new friendsView(this.formsContainer, this);
                break;
            default:
                console.error(`View "${viewName}" is not implemented.`);
        }
        this.activeView = newView;
        this.activeViewName = viewName;
        if (this.activeView) {
            this.activeView.init();
        }
        
    }
    public destroyGameListeners(): void {
        document.removeEventListener('keydown', this.keydownHandler);
        console.log('Game listeners removed');
    }
    
    private wordAnimation() {
        const friends = document.querySelectorAll('.friend');
        friends.forEach(div => {
            const word = div.textContent?.trim() || '';
            div.textContent = '';
            word.split('').forEach((letter, idx) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.transitionDelay = `${idx * 0.1}s`;
            div.appendChild(span);
            });
        });
    }



    
    private friendActionLog(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;
        const friendsContainer = document.getElementById('friendsActif');
        if (!friendsContainer) {
            console.error('Friends container not found');
            return;
        }
        const existingPopup = document.getElementById('friend-popup');
        if (existingPopup) {
            existingPopup.remove();
            return;
        }
        const popupHtml = friendActifLog(x, y);
        friendsContainer.insertAdjacentHTML('beforeend', popupHtml);
    }
    
    private loadAcceuilVideo() {
        this.videoMain.poster = "/img/pong.png";
        this.videoMain.src = '/img/acceuil.mp4';
        this.videoMain.load();
    }
    
    private loadSettingsVideo() {
        this.videoMain.poster = "/img/acceuilDraw.png";
        this.videoMain.src = "/img/acceuilParam.mp4";
        this.videoMain.load();
    }

    private authBtnHandler = () => {
        if (!getUser()) {
            this.show('login');
        } else {
            this.show('parametre');
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
            window.history.pushState(null, "", "Pong?mode=local");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'Online') {
            window.history.pushState(null, "", "Pong?mode=online");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'IA') {
            window.history.pushState(null, "", "Pong?mode=ai");
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        if (selected.id === 'Tournament') {
            this.show('tournament');
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
        console.log('Cursor updated:', this.cursor);
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
        if (this.options) {
            this.options.forEach((opt) => {
                opt.replaceWith(opt.cloneNode(true)); // retire tous les listeners
            });
        }
        this.activeView?.destroy();
        
    }
}