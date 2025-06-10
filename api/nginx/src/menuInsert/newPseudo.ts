/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newPseudo.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 16:14:07 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/09 18:53:51 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newPseudo = () => `
<div id="newPseudo" class="flex responsive-form-login flex-col items-center justify-center">
                  <input 
                    type="text"
                    placeholder="Enter New Pseudo"
                    class="responsive-placeholder responsive-case-login responsive-case"
                  />
                  <button type="submit" class="responsive-case-login responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="pseudoReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`