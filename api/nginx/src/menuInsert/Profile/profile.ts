/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 13:42:52 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/03 14:39:47 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const profile = () => `
    <div id="profil" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">

            <div id="infos" class="flex flex-col items-center justify-center h-full w-[70%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[15%] w-[70%]">
                    <div class="flex flex-col items-center justify-center w-full h-full">
                        <p class="text-white">BANBAN</p>
                         <span class=" w-3 h-3 rounded-full border-2 mt-8 border-white bg-red-500" : "bg-gray-400""></span>
                    </div>
                </div>
                <div id="second" class="flex flex-row items-center justify-between h-[25%] w-[70%] responsive-text">
                    <div class="flex flex-col  h-full">
                        <p class="responsive-text-profile">Total Game</p>
                        <p class="text-white">30</p>
                    </div>
                    <div class="flex flex-col items-center  h-full ">
                        <p class="responsive-text-profile">Wins</p>
                        <p class="text-white">90</p>
                    </div>
                    <div class="flex flex-col items-center  h-full ">
                        <p class="responsive-text-profile">Losses</p>
                        <p class="text-white">50</p>
                    </div>
                    <div class="flex flex-col items-end  h-full ">
                        <p class="responsive-text-profile">Winrate</p>
                        <p class="text-white">70%</p>
                    </div>
                </div>
                <div class="w-[70%] h-[35%]">
                    
                        <div class="h-[10%] w-full flex flex-row mb-8 justify-between items-center">
                            <p class="responsive-text-profile">Player1</p>
                            <p class="responsive-text-profile">Player2</p>
                            <p class="responsive-text-profile">Score</p>
                            <p class="responsive-text-profile">Game Type</p>
                        </div>
                        <div class="h-full w-full overflow-y-auto ">
                        ${matches.slice(0, 10).map(match => `
                        <div class="flex flex-row justify-between items-center responsive-text-historique ">
                            <span class="">${match.player1}</span>
                            <span class="">${match.player2}</span>
                            <span class="">${match.score1} - ${match.score2}</span>
                            <span class="">${match.date}</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
`

const matches = [
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },
    { player1: "Alice", score1: 3, player2: "Bob", score2: 2, date: "2024-07-08" },

  ];