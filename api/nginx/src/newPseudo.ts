/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newPseudo.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 16:14:07 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/06 21:41:04 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newPseudo = () => `
<div id="newPseudo" class="fixed w-full h-full inset-0 flex flex-col gap-4 justify-center items-center bg-black/80 z-20">
                  <input 
                    type="text"
                    placeholder="Enter New Pseudo"
                    class="responsive-placeholder responsive-case-2fa responsive-case"
                  />
                  <button type="submit" class="responsive-case-2fa responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="pseudoReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`