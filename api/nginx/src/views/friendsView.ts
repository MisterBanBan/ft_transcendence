/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsView.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/19 12:37:00 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/27 10:50:01 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//import { Component } from "./component.js";
import { friends } from "../menuInsert/Friends/friends.js";
import { invites } from "../menuInsert/Friends/invites.js";
import { searchMate } from "../menuInsert/Friends/searchMate.js";
import { playerPerso } from "../menuInsert/Profile/playerPerso.js";
import { friendAction } from "../menuInsert/Friends/friendAction.js";
import { Component } from "../component.js";

import { viewManager } from "./viewManager.js";
import { friendsList } from "../menuInsert/Friends/friendsList.js";

export class friendsView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private handleReturn = () => this.viewManager.show('parametre');
    private handleFriends = () => this.friends();
    private handleInvites = () => this.invites();

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = friendsList();
        this.friends();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('friendsReturnBtn')?.addEventListener('click', this.handleReturn);
        document.getElementById('friends')?.addEventListener('click', this.handleFriends);
        document.getElementById('invites')?.addEventListener('click', this.handleInvites);

    }

    private invites() {
        const invitesContainer = document.getElementById('dynamic-friends');
        if (!invitesContainer) {
            console.error('Invites container not found');
            return;
        }
        const leftFriends = document.getElementById('perso');
        if (!leftFriends) {
            console.error('Left friends container not found');
            return;
        }
        leftFriends.innerHTML = '';
        leftFriends.insertAdjacentHTML('beforeend', searchMate());
        invitesContainer.innerHTML = '';
        invitesContainer.insertAdjacentHTML('beforeend', invites());
        //this.eventFriendsListener();
        //this.eventFormListeners();
    }
    
    private friends() {
        const friendsContainer = document.getElementById('dynamic-friends');
        if (!friendsContainer) {
            console.error('Friends container not found');
            return;
        }
        const leftFriends = document.getElementById('perso');
        if (!leftFriends) {
            console.error('Left friends container not found');
            return;
        }
        leftFriends.innerHTML = '';
        leftFriends.insertAdjacentHTML('beforeend', playerPerso());
        friendsContainer.innerHTML = '';
        friendsContainer.insertAdjacentHTML('beforeend', friends());
        document.querySelectorAll('#friend').forEach(btn => {
            btn.addEventListener('click', (e) => this.friendAction(e as MouseEvent));          });
    }
    
    private friendAction(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;
        const friendsContainer = document.getElementById('dynamic-friends');
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

    destroy(): void {
        document.getElementById('friendsReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('friends')?.removeEventListener('click', this.handleFriends);
        document.getElementById('invites')?.removeEventListener('click', this.handleInvites);
        document.querySelectorAll('#friend').forEach(btn => {
            btn.removeEventListener('click', (e) => this.friendAction(e as MouseEvent));
        });
        
    }
}