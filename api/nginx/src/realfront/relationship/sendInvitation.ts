/*
async function sendInvitation() {
    const apiUrl = getApiUrl();
    const currentUserId = getCurrentUserId();
    const addresseeId = document.getElementById('inviteUserId').value;

    if (!addresseeId) {
        alert('Please enter a user ID to invite');
        return;
    }

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'userId': currentUserId
            },
            body: JSON.stringify({
                addressee_id: addresseeId
            })
        });

        const data = await response.json();
        displayResponse('inviteResponse', data, !response.ok);
    } catch (error) {
        displayResponse('inviteResponse', { error: error.message }, true);
    }
}*/
