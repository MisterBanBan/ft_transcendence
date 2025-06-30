/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   removeTwoFa.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/13 18:24:42 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/30 19:05:04 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export const removeTwoFa = () => `
<div id="popup2fa" class="flex responsive-form-login flex-col items-center justify-center">
                  <input
                    id="2fa-code-remove"
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-login responsive-case responsive-text"
                  />
                  <input
                    id="2fa-password-remove"
                    type="text"
                    placeholder="Enter Password"
                    class="responsive-placeholder responsive-case-login responsive-case responsive-text"
                  />
                  <button type="submit" id="2fa-submit-remove" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`