/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsView.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/19 12:37:00 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/26 11:24:20 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//import { Component } from "./component.js";
import { friends } from "../menuInsert/friends.js";
import { invites } from "../menuInsert/invites.js";
import { searchMate } from "../menuInsert/searchMate.js";
import { playerPerso } from "../menuInsert/playerPerso.js";
import { friendAction } from "../menuInsert/friendAction.js";
import { Component } from "../component.js";
import { tournoisAction } from "../menuInsert/tournoisAction.js";

import { viewManager } from "./viewManager.js";
import { friendsList } from "../menuInsert/friendsList.js";

export class friendsView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private handleReturn = () => this.viewManager.show('parametre');
    private handleFriends = () => this.friends("dynamic-popup", 'friends');
    private handleInvites = () => this.invites();

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = friendsList();
        this.friends("dynamic-popup", 'friends');
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
    
    private friends(name: string, view: string) {
        const friendsContainer = document.getElementById(name);
        if (!friendsContainer) {
            console.error('Friends container not found');
            return;
        }
        const leftFriends = document.getElementById('divLeft');
        if (!leftFriends) {
            console.error('Left friends container not found');
            return;
        }
        leftFriends.innerHTML = '';
        friendsContainer.innerHTML = '';
        if(view === 'friends') {
            leftFriends.insertAdjacentHTML('beforeend', playerPerso());
            friendsContainer.insertAdjacentHTML('beforeend', friends());
        }
        
        
        document.querySelectorAll('#friend').forEach(btn => {
            btn.addEventListener('click', (e) => this.friendAction(e as MouseEvent,'friends'));          });
    }
    
    private friendAction(e: MouseEvent, view: string){
        const x = e.clientX;
        const y = e.clientY;
        const friendsContainer = document.getElementById('dynamic-popup');
        if (!friendsContainer) {
            console.error('Friends container not found');
            return;
        }
        if( view === 'friends') {
            const existingPopup = document.getElementById('friend-popup');
            if (existingPopup) {
                existingPopup.remove();
                return;
            }
        } else if (view === 'tournois') {
            const existingPopup = document.getElementById('tournois-popup');
            if (existingPopup) {
                existingPopup.remove();
                return;
            }
        }
        let popupHtml = '';
        if( view === 'friends') {
            popupHtml = friendAction(x, y);
        } else if (view === 'tournois') {
            popupHtml = tournoisAction(x, y);
        }
        friendsContainer.insertAdjacentHTML('beforeend', popupHtml);
    }

    destroy(): void {
        document.getElementById('friendsReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('friends')?.removeEventListener('click', this.handleFriends);
        document.getElementById('invites')?.removeEventListener('click', this.handleInvites);
        document.querySelectorAll('#friend').forEach(btn => {
            btn.removeEventListener('click', (e) => this.friendAction(e as MouseEvent, 'friends'));
        });
        
    }
}