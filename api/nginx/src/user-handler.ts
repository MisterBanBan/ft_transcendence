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