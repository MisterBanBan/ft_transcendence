import { searchMate } from "../menuInsert/Friends/searchMate.js";
import { friendActionTemplate } from "../menuInsert/Friends/friendAction.js";
import { Component } from "../route/component.js";
import { InvitationService } from "../relationship/invitationService.js";
import { FriendService } from "../relationship/friendsService.js";

import { viewManager } from "./viewManager.js";
import { friendsList } from "../menuInsert/Friends/friendsList.js";
import {router} from "../route/router.js";
import {ApiUtils} from "../relationship/apiUtils.js";

export class friendsView implements Component {
	private container: HTMLElement;
	private readonly viewManager: viewManager;
	private friendBtnHandler = (e: Event) => this.friendAction(e as MouseEvent);
	private handleReturn = () => router.navigateTo("/game#parametre", this.viewManager);
	private handleFriends = () => this.friends();
	private handleInvites = () => this.invites();
	private boundInviteClickHandler?: () => void;
	private boundInviteKeydownHandler?: (event: KeyboardEvent) => void;

	private friendId: string | null = null;
	private username: string | null = null;

	private closeOnClickOutside?: (evt: MouseEvent) => void;

	constructor(container: HTMLElement, viewManager: viewManager) {
		this.container = container;
		this.viewManager = viewManager;

		this.handleRemove = this.handleRemove.bind(this);
		this.handleProfile = this.handleProfile.bind(this);
	}

	public async init(): Promise<void> {
		this.container.innerHTML = friendsList();
		await this.friends();
		const leftFriends = document.getElementById('divLeft');
		if (!leftFriends) {
			console.error('Left friends container not found');
			return;
		}
		leftFriends.innerHTML = '';
		leftFriends.insertAdjacentHTML('beforeend', searchMate());
		const inviteInput = document.getElementById('inviteUserId') as HTMLInputElement;
		const shareInviteButton = document.getElementById('Share Invite');
		if (!inviteInput || !shareInviteButton) {
			console.error('Invite input or Share Invite button not found');
			return;
		}
		if (shareInviteButton && inviteInput) {
			this.boundInviteClickHandler = () => {
				const inviteValue = inviteInput.value.trim();
				if (!inviteValue) {
					ApiUtils.showAlert('Username search can\'t be empty')
					return;
				}

				InvitationService.sendInvitation();
			};
			this.boundInviteKeydownHandler = (event: KeyboardEvent) => {
				if (event.key === "Enter") {
					shareInviteButton.click();
				}
			};
			shareInviteButton.addEventListener('click', this.boundInviteClickHandler);
			inviteInput.addEventListener('keydown', this.boundInviteKeydownHandler);
		}
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

		invitesContainer.innerHTML = '';
		InvitationService.loadInvitations();
	}

	private async friends() {
		const friendsContainer = document.getElementById('dynamic-popup');
		if (!friendsContainer) {
			console.error('Friends container not found');
			return;
		}
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
		this.friendId = target.getAttribute('data-friend-id');
		this.username = target.getAttribute('data-username');


		if (!this.friendId || this.friendId === 'undefined') {
			console.error('Invalid friend ID:', this.friendId);
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

		const popupHtml = friendActionTemplate(x, y, this.friendId);
		friendsContainer.insertAdjacentHTML('beforeend', popupHtml);

		const popup = document.getElementById('friend-popup');
		if (!popup)
		{ console.log('Friends-popup not found'); return; }

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

		const removeFriend = document.getElementById('removeFriend')
		if (removeFriend) {
			removeFriend.removeEventListener('click', this.handleRemove);
			removeFriend.addEventListener('click', this.handleRemove);
		}

		const friendProfile = document.getElementById("friendProfile")
		if (friendProfile) {
			friendProfile.removeEventListener('click', this.handleProfile)
			friendProfile.addEventListener('click', this.handleProfile)
		}
	}

	destroy(): void {
		const inviteInput = document.getElementById('inviteUserId');
		const shareInviteButton = document.getElementById('Share Invite');
		document.getElementById('friendReturnBtn')?.removeEventListener('click', this.handleReturn);
		document.getElementById('friends')?.removeEventListener('click', this.handleFriends);
		document.getElementById('invites')?.removeEventListener('click', this.handleInvites);

		document.querySelectorAll('.friend-btn').forEach(btn => {
			btn.removeEventListener('click', this.friendBtnHandler);
		});

		const removeFriend = document.getElementById('removeFriend')
		if (removeFriend) {
			removeFriend.removeEventListener('click', this.handleRemove);
		}

		const friendProfile = document.getElementById("friendProfile")
		if (friendProfile) {
			friendProfile.removeEventListener('click', this.handleProfile)
		}

		if (this.closeOnClickOutside) {
			document.removeEventListener('click', this.closeOnClickOutside);
			this.closeOnClickOutside = undefined;
		}
		if (inviteInput && this.boundInviteKeydownHandler) {
			inviteInput.removeEventListener('keydown', this.boundInviteKeydownHandler);
			this.boundInviteKeydownHandler = undefined;
		}
		if (shareInviteButton && this.boundInviteClickHandler) {
			shareInviteButton.removeEventListener('click', this.boundInviteClickHandler);
			this.boundInviteClickHandler = undefined;
		}
		InvitationService.destroy();
		FriendService.destroy();
	}

	private async handleRemove() {
		if (!this.friendId)
			return;

		try {
			await FriendService.removeFriend(this.friendId);

			const popup = document.getElementById('friend-popup');
			if (popup) {
				popup.remove();
			}

			await this.friends();

		} catch (error) {
			console.error('Error removing friend:', error);
		}
	}

	private handleProfile() {
		router.navigateTo(`/game?username=${this.username}#user`, this.viewManager);
	}
}