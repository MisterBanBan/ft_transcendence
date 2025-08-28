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

export function setAvatarUrl(avatarUrl: string): void {
    if (user) {
        user.avatar_url = avatarUrl;
    }
}