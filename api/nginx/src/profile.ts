/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 18:30:05 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/05 18:45:08 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const profile = () => `
    <div id="profile" class="fixed w-full h-full inset-0 flex flex-col gap-4 justify-center items-center bg-black/80 z-20">
                <div id="picture" class="w-20 h-20 rounded-full bg-indigo-500 flex text-white shadow-lg hover:bg-indigo-600 focus:outline-none">
                </div>
                <input 
                    type="text"
                    placeholder="Enter New Password"
                    class="responsive-placeholder responsive-case-2fa responsive-case"
                  />
                <input 
                    type="text"
                    placeholder="Confirm New Password"
                    class="responsive-placeholder responsive-case-2fa responsive-case"
                  />
                  <button type="submit" class="responsive-case-2fa responsive-text responsive-case text-white">Valider</button>
                  <button type="button" id="profileReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`