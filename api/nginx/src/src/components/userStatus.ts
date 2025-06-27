import { WebSocketManager } from '../websocket.js';
import { ApiClient } from '../api.js';

export class UserStatusComponent {
    constructor(
        private wsManager: WebSocketManager,
        private apiClient: ApiClient
    ) {}

    async updateStatus(userId: string, status: 'online' | 'offline' | 'in_game'): Promise<void> {
        try {
            // Update via WebSocket
            this.wsManager.updateStatus(status);

            // Also update via REST API
            await this.apiClient.updateUserStatus(userId, status);

            console.log(`Status updated to ${status} for user ${userId}`);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
}
