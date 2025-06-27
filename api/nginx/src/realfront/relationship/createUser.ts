/*
async function createUser() {
    const apiUrl = getApiUrl();
    const userId = document.getElementById('newUserId').value;
    const username = document.getElementById('newUsername').value;

    if (!userId || !username) {
        alert('Please enter both user ID and username');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                username: username
            })
        });

        const data = await response.json();
        displayResponse('createUserResponse', data, !response.ok);

        // Clear form
        document.getElementById('newUserId').value = '';
        document.getElementById('newUsername').value = '';

    } catch (error) {
        displayResponse('createUserResponse', { error: error.message }, true);
    }
}*/
