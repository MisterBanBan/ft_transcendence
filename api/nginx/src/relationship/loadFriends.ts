async function loadFriends() {
    const apiUrl = getApiUrl();
    const currentUserId = getCurrentUserId();

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/friendsList`, {
            headers: {
                'user-id': currentUserId
            }
        });

        const data = await response.json();
        displayResponse('friendsResponse', data, !response.ok);

        // Display friends in a nice format
        const friendsList = document.getElementById('friendsList');
        if (data.friends && data.friends.length > 0) {
            friendsList.innerHTML = data.friends.map(friend => `
                <div class="friend-item accepted">
                    <strong>${friend.username}</strong> (${friend.id})
                    <br>Status: ${friend.status || 'online'}
                    <br>Avatar: ${friend.avatar_url || 'N/A'}
                    <br>
                    <button onclick="removeFriend('${friend.id}')" class="remove-friend-btn">
                        Remove Friend
                    </button>
                    <button onclick="blockUser('${friend.id}')" class="block-user-btn">
                        Block User
                    </button>
                </div>
            `).join('');
        } else {
            friendsList.innerHTML = '<p>Aucun ami pour le moment</p>';
        }
    } catch (error) {
        displayResponse('friendsResponse', { error: error.message }, true);
    }
}