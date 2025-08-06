import { AuthUser } from "./type";

let user: AuthUser | undefined = undefined

export function setUser(newUser: AuthUser | undefined): void {
    user = newUser;
}

export function getUser(): AuthUser | undefined {
    return user;
}

export function setAvatarUrl(avatarUrl: string): void {
    if (user) {
        user.avatar_url = avatarUrl;
    }
}

export function set2faPlaceholder(token: string): void {
    user = {
        username: token,
        id: -1,
        avatar_url: "",
        provider: "placeholder",
        provider_id: undefined,
        tfa: true,
        updatedAt: Date.now(),
    }
}