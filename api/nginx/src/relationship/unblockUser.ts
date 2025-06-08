/*
async function unblockUser(blockedUserId) {
    const currentUserId = getCurrentUserId();

    if (!confirm('Are you sure you want to unblock this user?')) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/unblockUser`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'user-id': currentUserId
            },
            body: JSON.stringify({
                blocked_user_id: blockedUserId
            })
        });

        const data = await response.json();
        displayResponse('unblockResponse', data, !response.ok);

        if (response.ok) {
            // Reload the blocked users list after successful unblocking
            await loadBlockedUsers();
        }
    } catch (error) {
        displayResponse('unblockResponse', { error: error.message }, true);
    }
}*/
