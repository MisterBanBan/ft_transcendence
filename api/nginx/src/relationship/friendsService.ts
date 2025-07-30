import {getUser} from "../user-handler.js";
import {ApiUtils} from "./apiUtils.js";

interface loadFriendsResponse{
    message?: string;
    error?: string;
    friends?: Friends[];
}

interface Friends {
    username: string;
    friendsId: string;
    avatar_url: string;
}

export class FriendService {
    private static readonly BASE_URL = 'https://localhost:8443';

    static async removeFriend(friendId: string): Promise<void> {
        try {
            const response = await fetch(`${this.BASE_URL}/api/users/${friendId}/removeFriend`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove friend');
            }

            const data = await response.json();
            console.log(data.message);
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
            console.log(`Fetching friends for user ID: ${currentUser.id}`);
            const response = await fetch(`${this.BASE_URL}/api/users/${currentUser.id}/friendsList`, {
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
            console.log('API Response data:', data);

            if (data.friends && data.friends.length > 0) {
                console.log(`Found ${data.friends.length} friends`);
                return data.friends;
            } else {
                console.log('No friends found in response');
                return [];
            }
        } catch (error) {
            console.error('Network or parsing error:', error);
            return [];
        }
    }

    static displayFriends(friends: Friends[]): string {
        const sortedFriends = friends.sort((a, b) => a.username.localeCompare(b.username));
        let nb = 0;

        return `
            <div class="h-full w-full overflow-y-auto">
                ${sortedFriends.map(friend => `
                    <div class="flex flex-row justify-between items-center gap-4 responsive-text-historique">
                        <p class="w-10 h-10">${nb++}</p>
                        <img src="${friend.avatar_url || '/default-avatar.png'}" alt="${friend.username}" class="w-10 h-10 rounded-full object-contain"/>
                        <button id="friend" data-friend-id="${friend.friendsId}" class="responsive-text-historique">${friend.username}</button>
                        <span>Online</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}
