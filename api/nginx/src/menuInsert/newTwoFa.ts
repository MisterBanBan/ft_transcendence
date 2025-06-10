/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newTwoFa.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/06 18:52:33 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/09 18:54:07 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newTwoFa = () => `
<div id="popup2fa" class="flex responsive-form-login flex-col items-center justify-center">
                  <input 
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-login responsive-case"
                  />
                  <button type="submit" class="responsive-case-login responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`