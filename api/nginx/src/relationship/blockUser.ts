/*
async function blockUser(userIdToBlock) {
    const currentUserId = getCurrentUserId();

    if (!confirm('Are you sure you want to block this user?')) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/blockUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': currentUserId
            },
            body: JSON.stringify({
                blocked_user_id: userIdToBlock
            })
        });

        const data = await response.json();
        displayResponse('blockUserResponse', data, !response.ok);

    } catch (error) {
        displayResponse('blockUserResponse', { error: error.message }, true);
    }
}*/
