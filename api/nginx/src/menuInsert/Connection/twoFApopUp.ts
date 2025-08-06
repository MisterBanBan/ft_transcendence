/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twoFApopUp.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 15:28:28 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/27 00:14:42 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const twoFApopUp = () =>
    `
                <div id="popup-2fa" class="fixed w-full h-full inset-0 flex flex-col gap-4 justify-center items-center bg-black/80 z-20">
                  <input 
                    type="text"
                    id="code-2fa"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-2fa responsive-case responsive-text"
                  />
                  <button type="submit" id="submit-2fa" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>`