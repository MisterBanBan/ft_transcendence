/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   type.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/17 17:41:44 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/17 17:41:50 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface AuthUser {
    id: number;
    username: string;
    provider: string;
    provider_id?: string;
    tfa: boolean;
    updatedAt: number;
}