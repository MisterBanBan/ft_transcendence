function getApiUrl() {
    return document.getElementById('apiUrl').value;
}

// Get current user ID
function getCurrentUserId() {
    return document.getElementById('currentUserId').value;
}

// Display response in a container
function displayResponse(containerId, response, isError = false) {
    const container = document.getElementById(containerId);
    container.textContent = JSON.stringify(response, null, 2);
    container.className = `response ${isError ? 'error' : 'success'}`;
}