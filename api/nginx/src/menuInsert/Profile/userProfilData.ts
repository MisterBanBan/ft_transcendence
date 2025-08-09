interface UserProfile {
    username: string;
    status: 'online' | 'offline' | 'in_game';
    totalGames?: number;
    wins?: number;
    losses?: number;
    winrate?: string;
}

interface Match {
    player1: string;
    player2: string;
    score1: number;
    score2: number;
    date: string;
    gameType?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

interface MatchesResponse {
    matches: Match[];
    pagination: {
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

export async function fetchUserProfileData(userId: string): Promise<{profile: UserProfile, matches: Match[]} | null> {
    try {
        const profileResponse = await fetch(`/api/users/userProfile`);

        if (!profileResponse.ok) {
            console.error(`Profile request failed with status: ${profileResponse.status}`);
            const responseText = await profileResponse.text();
            console.error(`Response text:`, responseText);
            throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }

        const contentType = profileResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await profileResponse.text();
            console.error('Response is not JSON:', responseText);
            throw new Error('Response is not JSON');
        }

        const profileData: ApiResponse<UserProfile> = await profileResponse.json();

        const matchesResponse = await fetch(`/api/users/matches`);

        if (!matchesResponse.ok) {
            console.error(`Matches request failed with status: ${matchesResponse.status}`);
            const responseText = await matchesResponse.text();
            console.error(`Response text:`, responseText);
            throw new Error(`HTTP error! status: ${matchesResponse.status}`);
        }

        const matchesContentType = matchesResponse.headers.get('content-type');
        if (!matchesContentType || !matchesContentType.includes('application/json')) {
            const responseText = await matchesResponse.text();
            console.error('Matches response is not JSON:', responseText);
            throw new Error('Matches response is not JSON');
        }

        const matchesData: ApiResponse<MatchesResponse> = await matchesResponse.json();

        if (profileData.success && matchesData.success) {
            return {
                profile: profileData.data,
                matches: matchesData.data.matches
            };
        } else {
            const errorMsg = profileData.error || matchesData.error || 'API returned success: false';
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}
