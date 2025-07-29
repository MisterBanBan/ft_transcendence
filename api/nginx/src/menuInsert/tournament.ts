/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tournament.ts                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/25 17:36:29 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/28 18:19:49 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const tournament = () => `
    <div id="tournament" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">
            <div id="creatTournament"  class="flex flex-col items-center justify-center h-full w-[40%]">
                <input type="text" id="nameTournament" placeholder="Name of the tournament"            
                class="responsive-case-register responsive-placeholder responsive-case responsive-text"/>  
                <select id="tournamentDropdown" class="mt-4 mb-4 bg-black text-white border border-gray-500 rounded">
                        <option value="1">4 players</option>
                        <option value="2">8 players</option>
                        <option value="3">16 players</option>
                    </select>
                <input type="text" id="pseudoPlayerTournament" placeholder="Pseudo of the player"            
                class="responsive-case-register responsive-placeholder responsive-case responsive-text"/>  
                <button id="submitCreatTournament" class="text-white responsive-text" >Creat Tournament</button>
            </div>
        
            <div class="w-px h-full bg-white mx-4"></div>

            <div id="tournament_current" class="flex flex-col items-center justify-center h-[80%] w-[60%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[15%] w-full">
                    <div class="flex flex-row justify-center w-full h-full">
                        <p id="tournois" class="text-white responsive-text-friendsList">Tournament</p>
                    </div>
                </div>
                <div id="dynamic-tournament" class=" h-[70%] w-[70%]">
                    
                </div>
                <div class="w-[70%] h-[30%]">
                    
                </div>
            </div>
        </div>
        </div>
    </div>
`