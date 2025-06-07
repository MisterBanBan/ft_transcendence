async function loadBlockedUsers() {
    const apiUrl = getApiUrl();
    const currentUserId = getCurrentUserId();

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/blockedList`, {
            headers: {
                'user-id': currentUserId
            }
        });

        const data = await response.json();
        displayResponse('blockedResponse', data, !response.ok);

        // Display blocked users in a nice format
        const blockedList = document.getElementById('blockedList');
        if (data.blocked && data.blocked.length > 0) {
            blockedList.innerHTML = data.blocked.map(blockedUser => `
                <div class="blocked-item">
                    <strong>${blockedUser.username}</strong> (${blockedUser.id})
                    <br>Status: Blocked
                    <br>Avatar: ${blockedUser.avatar_url || 'N/A'}
                    <br>
                    <button onclick="unblockUser('${blockedUser.id}')" class="unblock-user-btn">
                        Unblock User
                    </button>
                </div>
            `).join('');
        } else {
            blockedList.innerHTML = '<p>Aucun utilisateur bloqué</p>';
        }
    } catch (error) {
        displayResponse('blockedResponse', { error: error.message }, true);
    }
}