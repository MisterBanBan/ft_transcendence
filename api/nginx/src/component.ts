/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   component.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 16:59:22 by afavier           #+#    #+#             */
/*   Updated: 2025/05/06 17:01:08 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface Component {
    //initialisation the composant (listenners, animation)
    init(): void;
    //destruction of creation (listenners, animation)
    destroy(): void;
}