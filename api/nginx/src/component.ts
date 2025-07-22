/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   component.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 16:59:22 by afavier           #+#    #+#             */
/*   Updated: 2025/06/18 10:57:33 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export interface Component {
    //initialisation the composant (listenners, animation)
    init(): void;
    //destruction of creation (listenners, animation)
    destroy(): void;
}