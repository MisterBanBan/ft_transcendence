import {getUser} from "../route/user-handler.js";
import {ApiUtils} from "./apiUtils.js";
import { profile } from "../menuInsert/Profile/profile.js";
import {router} from "../route/router.js";
import {viewManager} from "../views/viewManager.js";
import {profileActionTemplate} from "../menuInsert/Profile/profileAction.js";
import { loadFriendsResponse, Friends } from "./types/friends.js"

let username: string | null = null
let viewManagerRef: viewManager | undefined = undefined

export class FriendService {
	private static returnBtnListener: () => void;
	private static profileBtnHandler = (e: Event) => this.profileAction(e as MouseEvent);
	private static closeOnClickOutside?: (evt: MouseEvent) => void;

	static async removeFriend(friendId: string): Promise<void> {
		const currentUser = getUser();
		if (!currentUser) {
			throw new Error('User not authenticated');
		}

		try {
			const response = await fetch(`/api/users/removeFriend`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ friendId: friendId })
			});

			const data = await response.json();
		} catch (error) {
			console.error('Error removing friend:', error);
			throw error;
		}
	}

	static async loadFriends(): Promise<Friends[]> {
		const currentUser = getUser();
		if (!currentUser) {
			ApiUtils.showAlert('User not authenticated');
			return [];
		}

		try {
			const response = await fetch(`/api/users/friendsList`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`HTTP Error ${response.status}:`, errorText);
				return [];
			}

			const data: loadFriendsResponse = await response.json();

			if (data.friends && data.friends.length > 0) {
				return data.friends;
			} else {
				return [];
			}
		} catch (error) {
			return [];
		}
	}

	static async viewProfile(friendId: string, viewManager?: viewManager): Promise<void> {
		viewManagerRef = viewManager;

		try {
			const response = await fetch(`/api/users/${friendId}/fullProfile`);
			if (!response.ok) {
				console.error('Failed to fetch full profile');
				return;
			}

			const { success, data } = await response.json();
			if (!success) {
				console.error('Error fetching profile:', data);
				return;
			}

			const profileHtml = profile(data, data.matches);

			const profileContainer = document.getElementById('dynamic-content');
			if(!profileContainer) {
				router.navigateTo("/game#notFound", viewManager)
				return;
			}

			profileContainer.innerHTML = profileHtml;

			document.querySelectorAll('.profile-btn').forEach(btn => {
				btn.addEventListener('click', this.profileBtnHandler);
			});

			const returnBtn = document.getElementById('profileReturnBtn');
			if (returnBtn) {
				if (this.returnBtnListener) {
					returnBtn.removeEventListener('click', this.returnBtnListener);
				}

				this.returnBtnListener = () => {
					if (viewManager) {
						const popped = viewManager.oldPaths.pop()
						router.navigateTo(popped ?? "/game", viewManager, true);
					}
					else
						router.navigateTo("/game");
				};

				returnBtn.addEventListener('click', this.returnBtnListener);
			} else {
				console.error('Return button not found');
			}
		} catch (error) {
			console.error('Error fetching full profile:', error);
		}
	}

	static displayFriends(friends: Friends[]): string {
		const sortedFriends = friends.sort((a, b) => a.username.localeCompare(b.username));
		let nb = 0;
		if (friends.length > 0)


			return `
                <div class="h-full w-full overflow-y-auto">
                    ${sortedFriends.map(friend => `
                        <div class="flex flex-row w-[80%] h-[20%] items-center gap-4 responsive-text-historique">
                            <p class="mr-10 w-[40px] h-[40px]">${nb++}</p>
                            <div class="w-[40px] h-[40px] rounded-full overflow-hidden mr-20">
                                <img src="/uploads/${friend.avatar_url || '/last_airbender.jpg'}" alt="${friend.username}" class="w-full h-full object-cover"/>
                            </div>
                            <button class="mr-10 friend-btn responsive-text-historique" data-friend-id="${friend.id}" data-username="${friend.username}">${friend.username}</button>
                            <span class="ml-auto">${friend.status}</span>
                        </div>
                    `).join('')}
                </div>
            `;
		else
			return `<p class="text-gray-400 flex flex-row justify-center item-center gap-8">No friends</p>`;
	}

	static destroy(): void {
		const returnBtn = document.getElementById('profileReturnBtn');
		if (returnBtn && this.returnBtnListener) {
			returnBtn.removeEventListener('click', this.returnBtnListener);
		}

		if (this.closeOnClickOutside) {
			document.removeEventListener('click', this.closeOnClickOutside);
			this.closeOnClickOutside = undefined;
		}
	}

	static profileAction(e: MouseEvent): void {
		const x = e.clientX;
		const y = e.clientY;
		const target = e.target as HTMLElement;

		username = target.innerText

		if (!username) {
			console.error('Invalid username:', username);
			return;
		}

		const container = document.getElementById('dynamic-popup');
		if (!container) {
			console.error('Main container not found');
			return;
		}

		const existingPopup = document.getElementById('profile-popup');
		if (existingPopup) {
			existingPopup.remove();
			return;
		}

		const popupHtml = profileActionTemplate(x, y);
		container.insertAdjacentHTML('beforeend', popupHtml);

		const popup = document.getElementById('profile-popup');
		if (!popup) {
			console.error('profile-popup not found')
			return;
		}

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

		const profile = document.getElementById("profile")
		if (profile) {
			profile.removeEventListener('click', this.handleProfile)
			profile.addEventListener('click', this.handleProfile)
		}
	}

	static handleProfile() {
		router.navigateTo(`/game?username=${username}#user`, viewManagerRef);
		username = null

	}
}
