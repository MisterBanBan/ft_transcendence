import {getUser} from "../user-handler.js";
import {ApiUtils} from "./apiUtils.js";
import { profile } from "../menuInsert/Profile/profile.js";
import {router} from "../router.js";

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
            const response = await fetch(`/api/users/removeFriend`, {
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

    static async viewProfile(friendId: string): Promise<void> {
        try {
            // Appeler la nouvelle route pour récupérer le profil complet
            const response = await fetch(`/api/users/${friendId}/fullProfile`);
            if (!response.ok) {
                console.error('Failed to fetch full profile');
                alert('Failed to load profile. Please try again.');
                return;
            }
    
            const { success, data } = await response.json();
            if (!success) {
                console.error('Error fetching profile:', data);
                alert('Failed to load profile. Please try again.');
                return;
            }
    
            // Générer le HTML du profil
            const profileHtml = profile(data, data.matches);
    
            // Injecter le HTML dans une section dédiée
            const profileContainer = document.getElementById('friendsList');
            if(!profileContainer) return;
            if (profileContainer) {
                profileContainer.innerHTML = profileHtml;
                profileContainer.style.display = 'block';
            }

    
            // Ajouter un gestionnaire pour le bouton "Return"
            const returnBtn = document.getElementById('profileReturnBtn');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    router.navigateTo("/game#friendsList");
                });            } else {
                console.error('Return button not found');
            }
        } catch (error) {
            console.error('Error fetching full profile:', error);
            alert('Failed to load profile. Please try again.');
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
}
