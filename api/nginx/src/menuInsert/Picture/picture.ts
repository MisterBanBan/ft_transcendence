/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   picture.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/02 14:36:48 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/24 11:19:08 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export const picture = () => `
						
  <div class="w-full h-full flex flex-col relative">
    <div class="w-full h-[47%] flex items-center justify-center relative">
      <button
        type="button"
        id="picture"
        class="w-[65%] h-[72%] mt-4 mr-4  bg-[url('/img/last_airbender.jpg')] bg-[length:100%_100%] bg-white/60 bg-no-repeat bg-center z-20 pointer-events-auto flex items-center justify-center rounded-full"
      ></button>
    </div>
    <div id="friendsActif" class="w-[95%] h-[53%] border-4 rounded-lg border-white/60 bg-black flex items-center justify-center mb-4">
    </div>
  </div>

						
					`