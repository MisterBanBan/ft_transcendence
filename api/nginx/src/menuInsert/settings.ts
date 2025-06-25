/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settings.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 15:31:19 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/25 15:05:05 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const settings = () => `
    <form id="paramUser" class="flex responsive-form-login gap-4 flex-col items-center justify-center">
    
    <button type="button" id="newPseudo" class="responsive-text responsive-case-settings text-black">Change Nickname</button>
    <button type="button" id="newPass" class="responsive-text responsive-case-settings text-black">Change Password</button>
    
    <input type="checkbox" id="toggle-2fa">

    <button type="button" id="settingsReturnBtn" class="text-white responsive-text ">Return</button>

    
    </form>
`