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