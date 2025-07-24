/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   user-handler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/16 16:56:56 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/16 16:57:02 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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