/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newTwoFa.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/06 18:52:33 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/06 19:13:14 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newTwoFa = () => `
<div id="popup2fa" class="fixed w-full h-full inset-0 flex flex-col gap-4 justify-center items-center bg-black/80 z-20">
                  <input 
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-2fa responsive-case"
                  />
                  <button type="submit" class="responsive-case-2fa responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`