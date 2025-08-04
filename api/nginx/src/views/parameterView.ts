/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parameterView.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 22:32:55 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/28 15:19:35 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { parametre } from "../menuInsert/parametre.js";
import { score } from "../score/score.js";
import { viewManager } from "./viewManager.js";
import { profile } from "../menuInsert/Profile/profile.js";
import { Logout } from "../auth/logout.js";
import { Component } from "../component.js";
import {router} from "../router.js";

export class parameterView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    //private videoMain: HTMLVideoElement;

    private handleReturn = () => {console.log('clicked'); router.navigateTo("/game")};
    private handleScore = () => this.loadScore();
    private handleProfile = () => this.loadProfile();
    private handleFriendsList = () => router.navigateTo("/game#friendsList");
    private handleSettings = () => router.navigateTo("/game#settings");
    private handleLogout = () => router.navigateTo("/game#login");
    
    

    constructor(container: HTMLElement, viewManager: viewManager, videoMain: HTMLVideoElement) {
        this.container = container;
        this.viewManager = viewManager;
        //this.videoMain = videoMain;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = parametre();
        const logout = new Logout();
        logout.init();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('score')?.addEventListener('click', this.handleScore);
        document.getElementById('profile')?.addEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.addEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.addEventListener('click', this.handleSettings);
        document.getElementById('logout')?.addEventListener('click', this.handleLogout);
       document.getElementById('parametreReturnBtn')?.addEventListener('click', this.handleReturn);
    }

    private async loadScore() {
        this.container.innerHTML = '';
        const scoreHtml = await score();
        this.container.innerHTML = scoreHtml;    
        document.getElementById('scoreReturnBtn')?.addEventListener('click', this.handleSettings);
    }
    
    private loadProfile() {
        this.container.innerHTML = '';
        this.container.innerHTML = profile();
        document.getElementById('profileReturnBtn')?.addEventListener('click', this.handleSettings);
    }

    public destroy(): void {
        document.getElementById('score')?.removeEventListener('click', this.handleScore);
        document.getElementById('profile')?.removeEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.removeEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.removeEventListener('click', this.handleSettings);
        document.getElementById('logout')?.removeEventListener('click', this.handleLogout);
        document.getElementById('parametreReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('scoreReturnBtn')?.removeEventListener('click', this.handleSettings);
        document.getElementById('profileReturnBtn')?.removeEventListener('click', this.handleSettings);
        
    }
}