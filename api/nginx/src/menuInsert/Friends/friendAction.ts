/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friendAction.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 16:17:06 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/12 11:20:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const friendAction = (x: number, y: number) => `
  <div id="friend-popup" style="position:fixed; top:max(10px, ${y-10}px); left:${x - 200}px; z-index:50;"
       class="w-42 max-w-[64vw] h-40 max-h-[52vh] sm-h-[20] bg-white/90 flex flex-col items-center justify-center rounded-lg overflow-auto shadow-lg">
    <div class="flex flex-col gap-2 w-full h-full px-2 py-2 break-words whitespace-normal overflow-auto">
      <button id="removeFriend" class="w-full text-black break-words">Retirer</button>
      <button id="inviteFriend" class="w-full text-black break-words">Invite Game</button>
      <button id="closePopup" class="w-full text-black break-words">Profil</button>
    </div>
  </div>
`;