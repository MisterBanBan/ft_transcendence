/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournoisAction.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 16:17:06 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/25 18:04:39 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const tournoisAction = (x: number, y: number) => `
  <div id="tournois-popup" style="position:fixed; top:max(10px, ${y-10}px); left:${x - 200}px; z-index:50;"
       class="w-[10%] h-[30%] bg-white/70 flex flex-col items-center justify-center rounded-lg overflow-hidden ">
       <div class="flex items-center justify-center w-full h-full flex-col gap-2 "> 
            <button id="addFriend" class="flex w-full  text-black">Ajouter</button>
            <button id="removeFriend" class="flex w-full  text-black">Retirer</button>
            <button id="blockFriend" class="flex w-full  text-black">Bloquer</button>
            <button id="inviteFriend" class="flex w-full  text-black">Invite Game</button>
            <button id="closePopup" class="flex w-full  text-black">Profil</button>
        </div>
  </div>
`;