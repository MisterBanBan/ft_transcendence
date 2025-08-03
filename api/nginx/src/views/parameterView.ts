/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   parameterView.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 22:32:55 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/03 23:59:42 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { parametre } from "../menuInsert/parametre.js";
import { viewManager } from "./viewManager.js";
import { profile } from "../menuInsert/Profile/profile.js";
import { Logout } from "../auth/logout.js";
import { Component } from "../component.js";

export class parameterView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private picture: HTMLElement;

    private handleReturn = () => {console.log('clicked');this.viewManager.show('game');};
    private handleProfile = () => this.loadProfile();
    private handleFriendsList = () => this.viewManager.show('friendsList');
    private handleSettings = () => this.viewManager.show('settings');
    private handleParametre = () => this.viewManager.show('parametre');
    private handleLogout = () => {this.viewManager.show('login'), this.picture.innerHTML = ''};
    
    

    constructor(container: HTMLElement, viewManager: viewManager, picture: HTMLElement) {
        this.container = container;
        this.viewManager = viewManager;
        this.picture = picture;
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
        document.getElementById('profile')?.addEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.addEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.addEventListener('click', this.handleSettings);
        document.getElementById('logout')?.addEventListener('click', this.handleLogout);
       document.getElementById('parametreReturnBtn')?.addEventListener('click', this.handleReturn);
    }
    
    private loadProfile() {
        this.container.innerHTML = '';
        this.container.innerHTML = profile();
        document.getElementById('profileReturnBtn')?.addEventListener('click', this.handleParametre);
    }

    public destroy(): void {
        document.getElementById('profile')?.removeEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.removeEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.removeEventListener('click', this.handleSettings);
        document.getElementById('logout')?.removeEventListener('click', this.handleLogout);
        document.getElementById('parametreReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('profileReturnBtn')?.removeEventListener('click', this.handleParametre);
        
    }
}