/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ViewManager.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:58:58 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/25 18:35:23 by mtbanban         ###   ########.fr       */
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
import { picture } from '../menuInsert/picture.js';
import { friendAction } from '../menuInsert/friendAction.js';
import { friendsActif } from '../menuInsert/friendsActif.js';
import { tournamentView } from './tournamentView.js';



export class viewManager{
    private container: HTMLElement;
    private pictureContainer: HTMLElement;
    private videoMain: HTMLVideoElement;
    private setupGameMenuCallback: () => void;
    private activeView : Component | null = null;

    constructor(container: HTMLElement, picture: HTMLElement, videoMain: HTMLVideoElement, setupGameMenuCallback: () => void) {
        this.container = container;
        this.videoMain = videoMain;
        this.pictureContainer = picture;
        this.setupGameMenuCallback = setupGameMenuCallback;
        this.userLog();
    }

    private userLog()
    {
        if (!getUser())
            this.show("login");
        else
            this.show("game");
    }

    public show(viewName: string) {
        
        this.activeView?.destroy();
        
        this.container.innerHTML = '';
        //this.pictureContainer.innerHTML = '';
        
        let newView: Component | null = null;

        switch (viewName) {
            case 'game':
                this.loadAcceuilVideo();
                this.container.innerHTML = game();
                this.pictureContainer.innerHTML = picture();
                const firendDiv = document.getElementById('friendsActif');
                if (firendDiv) {
                    firendDiv.innerHTML = friendsActif();
                }
                //document.querySelectorAll('#friend').forEach(btn => {
                 //   btn.addEventListener('click', (e) => this.friendAction(e as MouseEvent));          });
                    document.querySelectorAll('#friend').forEach(btn => {
                        const clone = btn.cloneNode(true);
                        btn.replaceWith(clone);
                        clone.addEventListener('click', (e) => this.friendAction(e as MouseEvent));
                    });
                    this.setupGameMenuCallback();
                break;
            case 'login':
                newView =  new loginView(this.container, this);
                break;
            case 'register':
                newView = new registerView(this.container, this.pictureContainer, this);
                break;
            case 'settings':
                const currentUser = getUser();
                if (currentUser) {
                    newView = new SettingsView(this.container,  this);
                } else {
                    console.error("No user is currently authenticated.");
                }
                break;
            case 'acceuil':
                this.loadAcceuilVideo();
                break;
            case 'tournament':
                newView = new tournamentView(this.container, this);
            case 'parametre':
                newView = new parameterView(this.container, this, this.videoMain);
                break;
            case 'friendsList':
                newView = new friendsView(this.container, this);
                break;
            default:
                console.error(`View "${viewName}" is not implemented.`);
        }
        this.activeView = newView;
        
        if (this.activeView) {
            this.activeView.init();
        }
        
    }

    private friendAction(e: MouseEvent) {
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
        const popupHtml = friendAction(x, y);
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
}