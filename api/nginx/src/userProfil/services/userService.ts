import { User, UserProfile, Match, ApiResponse, MatchesResponse } from '../types/user';
import { ApiConfig } from '../config/api';

export class UserService {

    static async getUserById(userId: string): Promise<User | null> {
        try {
            const response = await fetch(
                ApiConfig.getApiUrl(`/api/users/${userId}`),
                {
                    method: 'GET',
                    headers: ApiConfig.getDefaultHeaders()
                }
            );

            if (response.status === 404) {
                console.warn(`User with ID ${userId} not found`);
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData: User = await response.json();
            return userData;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new Error('Failed to fetch user information');
        }
    }


    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const response = await fetch(
                ApiConfig.getApiUrl(`/user/${userId}/profile`),
                {
                    method: 'GET',
                    headers: ApiConfig.getDefaultHeaders()
                }
            );

            if (response.status === 404) {
                console.warn(`Profile for user ${userId} not found`);
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse: ApiResponse<UserProfile> = await response.json();

            if (!apiResponse.success || !apiResponse.data) {
                throw new Error('Invalid response format');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw new Error('Failed to fetch user profile');
        }
    }

    static async getUserMatches(
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<MatchesResponse | null> {
        try {
            const url = new URL(ApiConfig.getApiUrl(`/user/${userId}/matches`));
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', limit.toString());

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: ApiConfig.getDefaultHeaders()
            });

            if (response.status === 404) {
                console.warn(`Matches for user ${userId} not found`);
                return null;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse: ApiResponse<MatchesResponse> = await response.json();

            if (!apiResponse.success || !apiResponse.data) {
                throw new Error('Invalid response format');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching user matches:', error);
            throw new Error('Failed to fetch user matches');
        }
    }


    static async updateUserStatus(
        userId: string,
        status: 'offline' | 'online' | 'in_game'
    ): Promise<boolean> {
        try {
            const response = await fetch(
                ApiConfig.getApiUrl(`/user/${userId}/status`),
                {
                    method: 'POST',
                    headers: ApiConfig.getDefaultHeaders(),
                    body: JSON.stringify({ status })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse: ApiResponse<any> = await response.json();
            return apiResponse.success;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw new Error('Failed to update user status');
        }
    }
}
