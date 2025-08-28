export interface InvitationRequest {
    addressee_username: string;
}

export interface InvitationResponse {
    message?: string;
    error?: string;
    invitations?: Invitation[];
}

export interface Invitation {
    requester_id: string;
    username: string;
    status: 'pending' | 'accepted' | 'declined';
    avatar_url?: string;
}

export interface LoadInvitationResponse {
    message?: string;
    error?: string;
    invitations?: LoadInvitation[];
}

export interface LoadInvitation {
    requester_id: string;
    username: string;
    avatar_url: string;
}