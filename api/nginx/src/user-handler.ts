import { AuthUser } from "./type";

let user: AuthUser | undefined = undefined;

export function setUser(newUser: AuthUser | undefined): void {
    user = newUser;
    if (user) {
        console.log("User set:", user);
    } else {
        console.log("User cleared");
    }
}

export function getUser(): AuthUser | undefined {
    return user;
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