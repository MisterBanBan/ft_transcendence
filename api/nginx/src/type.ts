/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   type.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/17 17:41:44 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/18 18:35:48 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface AuthUser {
    id: number;
    username: string;
    avatar_url: string
    provider: string;
    provider_id?: string;
    tfa: boolean;
    updatedAt: number;
}