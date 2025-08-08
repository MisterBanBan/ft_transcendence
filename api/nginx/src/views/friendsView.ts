/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendsView.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/19 12:37:00 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/03 23:50:50 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//import { Component } from "./component.js";
//import { invites } from "../menuInsert/Friends/invites.js";
import { searchMate } from "../menuInsert/Friends/searchMate.js";
import { playerPerso } from "../menuInsert/Profile/playerPerso.js";
import { friendActionTemplate } from "../menuInsert/Friends/friendAction.js";
import { Component } from "../component.js";
import { InvitationService } from "../relationship/invitationService.js";
import { FriendService } from "../relationship/friendsService.js";

import { viewManager } from "./viewManager.js";
import { friendsList } from "../menuInsert/Friends/friendsList.js";
import {router} from "../router.js";

export class friendsView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private friendBtnHandler = (e: Event) => this.friendAction(e as MouseEvent);
    private handleReturn = () => router.navigateTo("/game#parametre", this.viewManager);
    private handleFriends = () => this.friends();
    private handleInvites = () => this.invites();
    private closeOnClickOutside?: (evt: MouseEvent) => void;

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public async init(): Promise<void> {
        this.container.innerHTML = friendsList();
        await this.friends();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('friendReturnBtn')?.addEventListener('click', this.handleReturn);
        document.getElementById('friends')?.addEventListener('click', this.handleFriends);
        document.getElementById('invites')?.addEventListener('click', this.handleInvites);
    }

    private invites() {
        const invitesContainer = document.getElementById('dynamic-popup');
        if (!invitesContainer) {
            console.error('Invites container not found');
            return;
        }
        const leftFriends = document.getElementById('divLeft');
        if (!leftFriends) {
            console.error('Left friends container not found');
            return;
        }
        leftFriends.innerHTML = '';
        leftFriends.insertAdjacentHTML('beforeend', searchMate());
        invitesContainer.innerHTML = '';
        InvitationService.loadInvitations();

            const inviteInput = document.getElementById('inviteUserId') as HTMLInputElement;
            const shareInviteButton = document.getElementById('Share Invite');
            console.log('Invite input:', inviteInput);
            if (shareInviteButton && inviteInput) {
                shareInviteButton.addEventListener('click', () => {
                    const inviteValue = inviteInput.value.trim();
        
                    if (!inviteValue) {
                        console.log('Input is empty');
                        return;
                    }
        
                    console.log(`Sending invite to: ${inviteValue}`);
                    InvitationService.sendInvitation();
                });
            }
    }

    private async friends() {
        const friendsContainer = document.getElementById('dynamic-popup');
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
        leftFriends.insertAdjacentHTML('beforeend', playerPerso());
        friendsContainer.innerHTML = '';

        try {
            const friendsList = await FriendService.loadFriends();
            const friendsHtml = FriendService.displayFriends(friendsList);
            friendsContainer.insertAdjacentHTML('beforeend', friendsHtml);

            document.querySelectorAll('.friend-btn').forEach(btn => {
                btn.addEventListener('click', this.friendBtnHandler);
            });
        } catch (error) {
            console.error('Error loading friends:', error);
            friendsContainer.innerHTML = '<p>Error loading friends</p>';
        }
    }

    private friendAction(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;
        const target = e.target as HTMLElement;
        const friendId = target.getAttribute('data-friend-id');
        const username = target.getAttribute('data-username');

        console.log('Friend action triggered for:', { friendId, username });

        if (!friendId || friendId === 'undefined') {
            console.error('Invalid friend ID:', friendId);
            return;
        }

        const friendsContainer = document.getElementById('dynamic-popup');
        if (!friendsContainer) {
            console.error('Friends container not found');
            return;
        }

        const existingPopup = document.getElementById('friend-popup');
        if (existingPopup) {
            existingPopup.remove();
            return;
        }

        const popupHtml = friendActionTemplate(x, y);
        friendsContainer.insertAdjacentHTML('beforeend', popupHtml);

        const popup = document.getElementById('friend-popup');
        if (!popup)
            { console.log('fdfd'); return; }

        this.closeOnClickOutside = (evt: MouseEvent) => {
         if (!popup.contains(evt.target as Node)) {
             popup.remove();
             document.removeEventListener('click', this.closeOnClickOutside!);
             return;
             }
         };
         setTimeout(() => {
            document.addEventListener('click', this.closeOnClickOutside!);
            }, 0);


        document.getElementById('removeFriend')?.addEventListener('click', async () => {
            try {
                console.log('Attempting to remove friend with ID:', friendId);
                await FriendService.removeFriend(friendId);

                const popup = document.getElementById('friend-popup');
                if (popup) {
                    popup.remove();
                }

                await this.friends();

            } catch (error) {
                console.error('Error removing friend:', error);
                alert('Failed to remove friend. Please try again.');
            }
        });
    }

    destroy(): void {
        document.getElementById('friendReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('friends')?.removeEventListener('click', this.handleFriends);
        document.getElementById('invites')?.removeEventListener('click', this.handleInvites);

        document.querySelectorAll('.friend-btn').forEach(btn => {
            btn.removeEventListener('click', this.friendBtnHandler);
        });
        if (this.closeOnClickOutside) {
            document.removeEventListener('click', this.closeOnClickOutside);
            this.closeOnClickOutside = undefined;
        }
    }

}