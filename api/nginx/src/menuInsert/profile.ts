/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 18:30:05 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/12 11:10:37 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const profile = () => `
    <div id="profile" class="flex responsive-form-register flex-col items-center justify-center">
                <div id="picture" class="w-20 h-20 rounded-full bg-indigo-500 flex text-white shadow-lg hover:bg-indigo-600 focus:outline-none">
                </div>
                <button type="button" id="score" class="responsive-text responsive-case-submit text-black">Score</button>
                <button type="button" id="settings" class="responsive-text responsive-case-submit text-black">Settings</button>
                <button type="button" id="log out" class="responsive-text responsive-case-submit text-black">Log out</button>
                  <button type="button" id="profileReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`