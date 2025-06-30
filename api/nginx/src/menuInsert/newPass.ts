/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newPass.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 16:19:28 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/27 00:13:46 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newPass = () => `
<form id="newPass" class="flex responsive-form-register flex-col items-center justify-center">
                <div id="error-password" class="error-message-password text-red-500 text-sm mb-2"></div>
                <input
                    id="current_password"
                    type="text"
                    placeholder="Enter New Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                <input
                    id="new_password"
                    type="text"
                    placeholder="Enter New Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                <input 
                    id="confirm_new_password"
                    type="text"
                    placeholder="Confirm New Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                  <button type="submit" id="submit-new-password" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="passReturnBtn" class="text-white responsive-text ">Return</button>
                  </form>`