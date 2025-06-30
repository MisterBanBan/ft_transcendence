/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newPseudo.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 16:14:07 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/27 00:13:52 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newPseudo = () => `
<div id="newPseudo" class="flex responsive-form-login flex-col items-center justify-center">
        <label for="username" class="block text-gray-700 font-medium mb-2">Nouveau pseudo</label>
                  
<input
                    id="username"
                    type="text"
                    placeholder="Enter New Pseudo"
                    class="responsive-placeholder responsive-case-login responsive-case responsive-text"
                  />
                  <button type="submit" id="submit-username" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="pseudoReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`