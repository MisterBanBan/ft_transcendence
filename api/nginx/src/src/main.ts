import { WebSocketManager } from './websocket.js';
import { ApiClient } from './api.js';
import { UserStatusComponent } from './components/userStatus.js';
import { UserProfileComponent } from './components/userProfile.js';
import { AvatarUploadComponent } from './components/avatarUpload.js';

class App {
    private wsManager: WebSocketManager;
    private apiClient: ApiClient;
    private userStatusComponent: UserStatusComponent;
    private userProfileComponent: UserProfileComponent;
    private avatarUploadComponent: AvatarUploadComponent;

    constructor() {
        // Initialize API client
        this.apiClient = new ApiClient('https://localhost:8443');

        // Initialize WebSocket manager
        this.wsManager = new WebSocketManager('wss://localhost:8443');

        // Initialize components
        this.userStatusComponent = new UserStatusComponent(this.wsManager, this.apiClient);
        this.userProfileComponent = new UserProfileComponent(this.apiClient);
        this.avatarUploadComponent = new AvatarUploadComponent(this.apiClient);

        this.initializeEventListeners();
        this.setupWebSocketListeners();
    }

    private initializeEventListeners(): void {
        // Connection controls
        const connectBtn = document.getElementById('connect-btn') as HTMLButtonElement;
        const disconnectBtn = document.getElementById('disconnect-btn') as HTMLButtonElement;

        connectBtn.addEventListener('click', () => {
            const userId = (document.getElementById('user-id') as HTMLInputElement).value;
            if (userId) {
                this.wsManager.connect(userId);
                connectBtn.disabled = true;
                disconnectBtn.disabled = false;
            }
        });

        disconnectBtn.addEventListener('click', () => {
            this.wsManager.disconnect();
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
        });

        // Status update
        const updateStatusBtn = document.getElementById('update-status-btn') as HTMLButtonElement;
        updateStatusBtn.addEventListener('click', () => {
            const userId = (document.getElementById('user-id') as HTMLInputElement).value;
            const status = (document.getElementById('status-select') as HTMLSelectElement).value as 'online' | 'offline' | 'in_game';
            this.userStatusComponent.updateStatus(userId, status);
        });

        // Profile loading
        const loadProfileBtn = document.getElementById('load-profile-btn') as HTMLButtonElement;
        loadProfileBtn.addEventListener('click', () => {
            const userId = (document.getElementById('profile-user-id') as HTMLInputElement).value;
            this.userProfileComponent.loadProfile(userId);
        });

        // Avatar upload
        const uploadAvatarBtn = document.getElementById('upload-avatar-btn') as HTMLButtonElement;
        uploadAvatarBtn.addEventListener('click', () => {
            const userId = (document.getElementById('avatar-user-id') as HTMLInputElement).value;
            const fileInput = document.getElementById('avatar-file') as HTMLInputElement;
            this.avatarUploadComponent.uploadAvatar(userId, fileInput);
        });

        // Refresh users
        const refreshUsersBtn = document.getElementById('refresh-users-btn') as HTMLButtonElement;
        refreshUsersBtn.addEventListener('click', () => {
            this.loadActiveUsers();
        });

        // Clear messages
        const clearMessagesBtn = document.getElementById('clear-messages-btn') as HTMLButtonElement;
        clearMessagesBtn.addEventListener('click', () => {
            const messagesContainer = document.getElementById('messages-container');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        });
    }

    private setupWebSocketListeners(): void {
        this.wsManager.onConnectionChange((isConnected: boolean) => {
            const indicator = document.getElementById('connection-indicator');
            const text = document.getElementById('connection-text');

            if (indicator && text) {
                if (isConnected) {
                    indicator.className = 'status-indicator online';
                    text.textContent = 'Connected';
                } else {
                    indicator.className = 'status-indicator offline';
                    text.textContent = 'Disconnected';
                }
            }
        });

        this.wsManager.onMessage((message: any) => {
            this.displayMessage(message);
        });
    }

    private displayMessage(message: any): void {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'message';

        const timestamp = new Date().toLocaleTimeString();
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-type">${message.type}</span>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-content">
                <pre>${JSON.stringify(message, null, 2)}</pre>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    private async loadActiveUsers(): Promise<void> {
        try {
            const response = await this.apiClient.getUserStatuses();
            const usersListElement = document.getElementById('users-list');

            if (usersListElement && response.users) {
                usersListElement.innerHTML = response.users.map((user: any) => `
                    <div class="user-item">
                        <div class="user-info">
                            <strong>${user.username || user.id}</strong>
                            <span class="user-status ${user.status}">${user.status}</span>
                        </div>
                        <div class="user-activity">
                            Last activity: ${new Date(user.last_activity).toLocaleString()}
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
