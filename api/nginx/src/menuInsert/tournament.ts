/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 17:36:29 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/30 11:01:13 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const tournament = () => `
    <div id="tournament" class="h-full w-full flex items-center justify-center">
		<div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
			<div class="flex flex-row items-center justify-center  h-full w-full">
				<div id="left-box"  class="flex flex-col items-center justify-center h-full w-[40%] h-[90%]">
					
				</div>
			
				<div class="w-px h-full bg-white mx-4"></div>
	
				<div id="right-box" class="flex flex-col items-center justify-center h-[90%] w-[60%] responsive-text gap-6">
					<div id="first" class="flex flex-row items-center justify-center h-[15%] w-full">
						<div class="flex flex-row justify-center w-full h-full ">
							<p id="tournament-title" class="text-white responsive-text-friendsList">Tournament</p>
						</div>
					</div>
					<div id="right-box-infos" class=" h-[80%] w-[80%]">
						
					</div>
					<div class="w-[70%] h-[30%]">
							<button type="button" id="return-button" class="w-full h-full bg-white/60 rounded-lg text-black responsive-text-friendsList">Return</button>
					</div>
				</div>
			</div>
        </div>
    </div>
`