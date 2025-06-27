interface StatusMessage {
    type: 'status_change' | 'heartbeat';
    status?: 'online' | 'offline' | 'in_game';
    userId: string;
}

export class WebSocketManager {
    private socket: WebSocket | null = null;
    private url: string;
    private userId: string | null = null;
    private heartbeatInterval: number | null = null;
    private connectionChangeCallback: ((isConnected: boolean) => void) | null = null;
    private messageCallback: ((message: any) => void) | null = null;

    constructor(url: string) {
        this.url = url.replace('http', 'ws') + '/api/users/ws/status/';
    }

    connect(userId: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket already connected');
            return;
        }

        this.userId = userId;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.connectionChangeCallback?.(true);
            this.startHeartbeat();
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('Received message:', message);
                this.messageCallback?.(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.connectionChangeCallback?.(false);
            this.stopHeartbeat();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.stopHeartbeat();
    }

    updateStatus(status: 'online' | 'offline' | 'in_game'): void {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.userId) {
            console.error('WebSocket not connected or userId not set');
            return;
        }

        const message: StatusMessage = {
            type: 'status_change',
            userId: this.userId,
            status: status
        };

        this.socket.send(JSON.stringify(message));
    }

    private startHeartbeat(): void {
        this.heartbeatInterval = window.setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN && this.userId) {
                const heartbeat: StatusMessage = {
                    type: 'heartbeat',
                    userId: this.userId
                };
                this.socket.send(JSON.stringify(heartbeat));
            }
        }, 30000); // Send heartbeat every 30 seconds
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    onConnectionChange(callback: (isConnected: boolean) => void): void {
        this.connectionChangeCallback = callback;
    }

    onMessage(callback: (message: any) => void): void {
        this.messageCallback = callback;
    }
}
