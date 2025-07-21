/*
async function removeFriend(friendId) {
    const currentUserId = getCurrentUserId();

    if (!confirm('Are you sure you want to remove this friend?')) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/removeFriend`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'user-id': currentUserId
            },
            body: JSON.stringify({
                friend_id: friendId
            })
        });

        const data = await response.json();
        displayResponse('removeFriendResponse', data, !response.ok);

        if (response.ok) {
            await loadFriends();
        }
    } catch (error) {
        displayResponse('removeFriendResponse', { error: error.message }, true);
    }
}*/
