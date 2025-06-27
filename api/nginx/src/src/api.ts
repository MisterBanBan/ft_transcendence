export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getUserProfile(userId: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/user/${userId}/profile`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async getUserMatches(userId: string, page: number = 1, limit: number = 10): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/user/${userId}/matches?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async updateUserStatus(userId: string, status: 'online' | 'offline' | 'in_game'): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/user/${userId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async uploadAvatar(userId: string, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/api/users/${userId}/avatar`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async getUserStatuses(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/users/status`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async getDebugInfo(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/api/users/ws/debug`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}
