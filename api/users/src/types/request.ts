export interface InviteBody {
    addressee_username: string;
}

export interface UserParams {
    userId: string;
}

export interface RequesterParams {
    requesterId: string;
}

export interface RemoveFriendBody {
    friend_id: string;
}

export interface BlockUserBody {
    blocked_user_id: string;
}

export interface UnblockUserBody {
    blocked_user_id: string;
}