/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newPass.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 16:19:28 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/09 18:53:15 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newPass = () => `
<div id="newPass" class="flex responsive-form-login flex-col items-center justify-center">
                <input 
                    type="text"
                    placeholder="Enter New Password"
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                <input 
                    type="text"
                    placeholder="Confirm New Password"
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                  <button type="submit" class="responsive-case-login responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="passReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>`