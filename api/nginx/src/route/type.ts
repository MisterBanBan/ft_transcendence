export interface AuthUser {
    id: number;
    username: string;
    avatar_url: string
    provider: string;
    provider_id?: string;
    tfa: boolean;
    updatedAt: number;
}