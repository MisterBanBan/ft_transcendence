export interface User {
    id: string;
    username: string;
    avatar_url: string;
}

export interface Relationship {
    requester_id: string;
    addressee_id: string;
    status: 'pending' | 'accepted' | 'blocked';
    updated_at: string;
}

export interface UserStatus {
    OFFLINE: 'offline',
    ONLINE: 'online',
    IN_GAME: 'in_game',
    IDLE: 'idle'
}

export interface WebSocketMessageTypes {
    USER_STATUS_CHANGE: 'user_status_change',
    GAME_INVITE: 'game_invite',
    PING: 'ping',
    PONG: 'pong',
    STATUS_CHANGE: 'status_change'
}

