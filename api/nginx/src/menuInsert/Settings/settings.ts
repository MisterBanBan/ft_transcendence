/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settings.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 15:31:19 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/28 15:24:04 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const settings = () => `
    <form id="paramUser" class="flex responsive-form-login gap-4 flex-col items-center justify-center">
    
    <button type="button" id="newPseudo" class="responsive-text-parametre">Change Nickname</button>
    <button type="button" id="newPass" class="responsive-text-parametre">Change Password</button>
    
    <input type="checkbox" class="responsive-text-parametre" id="toggle-2fa">

    <button type="button" id="settingsReturnBtn" class="text-white responsive-text-parametre ">Return</button>

    
    </form>
`