/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   settings.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 15:31:19 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/06 22:20:05 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const settings = () => `
    <form id="paramUser" class="flex responsive-form-login gap-4 flex-col items-center justify-center">
    
    <button type="button" id="newPseudo" class="responsive-case-login responsive-text responsive-case text-white">Change Nickname</button>
    <button type="button" id="newPass" class="responsive-case-login responsive-text responsive-case text-white">Change Password</button>
    <button type="button" id="new2fa" class="responsive-case-login responsive-text responsive-case text-white">Change TwoFa</button>
   <button type="button" id="profileReturnBtn" class="text-white responsive-text ">Return</button>

    
    </form>
`