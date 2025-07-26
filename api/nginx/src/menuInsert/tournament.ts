/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 17:36:29 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/25 17:52:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const tournament = () => `
    <div id="tournament" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">
            <div id="creatTournament"  class="flex flex-col items-center justify-center h-full w-[30%]">
                
            </div>
        
            <div class="w-px h-full bg-white mx-4"></div>

            <div id="tournois_actuel" class="flex flex-col items-center justify-center h-[80%] w-[70%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[15%] w-[70%]">
                    <div class="flex flex-row justify-center w-full h-full">
                        <p id="tournois" class="text-white responsive-text-friendsList">Friends</p>
                    </div>
                </div>
                <div id="dynamic-friends" class=" h-[70%] w-[70%]">
                    
                </div>
                <div class="w-[70%] h-[30%]">
                    
                </div>
            </div>
        </div>
        </div>
    </div>
`