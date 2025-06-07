async function acceptInvitation() {
    const apiUrl = getApiUrl();
    const requesterId = document.getElementById('requesterIdAccept').value;

    if (!requesterId) {
        alert('Please enter the requester ID');
        return;
    }

    try {
        const response = await fetch(`https://localhost:8443/api/users/${requesterId}/accept`, {
            method: 'PUT',
            headers: {
                'user-id': getCurrentUserId()
            }
        });

        const data = await response.json();
        displayResponse('manageResponse', data, !response.ok);
    } catch (error) {
        displayResponse('manageResponse', { error: error.message }, true);
    }
}