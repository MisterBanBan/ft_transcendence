import { AuthUser } from "./type";

let user: AuthUser | undefined = undefined

export function setUser(newUser: AuthUser | undefined): void {
    user = newUser;
}

export function getUser(): AuthUser | undefined {
    if (user && user.id === -1)
        return undefined;
    return user;
}

export function setUsername(username: string): void {
    if (user) {
        user.username = username
    }
}

export function setAvatarUrl(avatarUrl: string): void {
    if (user) {
        user.avatar_url = avatarUrl;
    }
}

export function set2FA(active: boolean): void {
    if (user) {
        user.tfa = active
    }
}