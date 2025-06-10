/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 18:30:05 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/09 18:47:45 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const profile = () => `
    <div id="profile" class="flex responsive-form-register flex-col items-center justify-center">
                <div id="picture" class="w-20 h-20 rounded-full bg-indigo-500 flex text-white shadow-lg hover:bg-indigo-600 focus:outline-none">
                </div>
                <button type="button" id="score" class="responsive-case-register responsive-text responsive-case text-white">Score</button>
                <button type="button" id="settings" class="responsive-case-register responsive-text responsive-case text-white">Settings</button>
                <button type="button" id="log out" class="responsive-case-register responsive-text responsive-case text-white">Log out</button>
                  <button type="button" id="profileReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`