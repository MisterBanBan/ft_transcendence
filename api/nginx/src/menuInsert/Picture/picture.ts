/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   picture.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/02 14:36:48 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/03 14:55:18 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export const picture = () => `
						
  <div class="w-full h-full flex flex-col relative">
    <div class="w-full h-[46%] flex items-center justify-center relative">
      <button
        type="button"
        id="picture"
        class="w-[65%] h-[72%] mt-2 mr-3  bg-[url('/img/last_airbender.jpg')] bg-[length:100%_100%] bg-white/60 bg-no-repeat bg-center z-20 pointer-events-auto flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-125"
      ></button>
    </div>
  </div>

						
					`