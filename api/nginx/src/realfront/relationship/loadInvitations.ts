/*
async function loadInvitations() {
    const apiUrl = getApiUrl();
    const currentUserId = getCurrentUserId();

    try {
        const response = await fetch(`https://localhost:8443/api/users/${currentUserId}/invitations`, {
            headers: {
                'user-id': currentUserId
            }
        });

        const data = await response.json();
        displayResponse('invitationsResponse', data, !response.ok);

        // Display invitations in a nice format
        const invitationsList = document.getElementById('invitationsList');
        if (data.invitations && data.invitations.length > 0) {
            invitationsList.innerHTML = data.invitations.map(inv => `
                    <div class="invitation-item pending">
                        <strong>${inv.username}</strong> (${inv.requester_id})
                        <br>Status: ${inv.status}
                        <br>Avatar: ${inv.avatar_url || 'N/A'}
                    </div>
                `).join('');
        } else {
            invitationsList.innerHTML = '<p>Aucune invitation en attente</p>';
        }
    } catch (error) {
        displayResponse('invitationsResponse', { error: error.message }, true);
    }
}*/
