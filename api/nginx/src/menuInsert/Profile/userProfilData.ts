async function fetchUserProfileData(userId) {
    try {
        const profileResponse = await fetch(`/user/${userId}/profile`);
        const profileData = await profileResponse.json();

        const matchesResponse = await fetch(`/user/${userId}/matches`);
        const matchesData = await matchesResponse.json();

        if (profileData.success && matchesData.success) {
            return {
                profile: profileData.data,
                matches: matchesData.data.matches
            };
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}
