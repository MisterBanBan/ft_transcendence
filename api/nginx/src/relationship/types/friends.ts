export interface loadFriendsResponse {
    message?: string;
    error?: string;
    friends?: Friends[];
}

export interface Friends {
    username: string;
    id: string;
    avatar_url: string;
    status: string;
}