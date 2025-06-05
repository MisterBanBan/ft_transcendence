/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   twoFApopUp.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 15:28:28 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/05 15:32:05 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const twoFApopUp = () =>
    `
                <div id="popup2fa" class="fixed w-full h-full hidden inset-0 flex flex-col gap-4 justify-center items-center bg-black/80 z-20">
                  <input 
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-2fa responsive-case"
                  />
                  <button type="submit" class="responsive-case-2fa responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>`