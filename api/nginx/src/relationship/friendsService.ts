import {getUser} from "../user-handler.js";
import {ApiUtils} from "./apiUtils.js";

interface loadFriendsResponse {
    message?: string;
    error?: string;
    friends?: Friends[];
}

interface Friends {
    username: string;
    id: string;
    avatar_url: string;
    status: string;
}

export class FriendService {

    static async removeFriend(friendId: string): Promise<void> {
        const currentUser = getUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            const response = await fetch(`/api/users/${currentUser.id}/removeFriend`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId: friendId })
            });

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
            const response = await fetch(`/api/users/${currentUser.id}/friendsList`, {
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
                    <img src="/uploads/${friend.avatar_url || '/last_airbender.jpg'}" alt="${friend.username}" class="w-10 h-10 rounded-full object-contain"/>
                    <button class="friend-btn responsive-text-historique" data-friend-id="${friend.id}" data-username="${friend.username}">${friend.username}</button>
                    <span>Online</span>
                </div>
            `).join('')}
        </div>
    `;
    }
}
