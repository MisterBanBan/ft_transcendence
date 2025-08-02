/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/06 13:42:52 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/02 22:30:37 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const profile = () => `
    <div id="profil" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">
            <div id="perso"  class="flex flex-col items-center justify-center h-full w-[30%]">
                <img src="/img/kodama_stop1.png" alt="Kodama" class="w-[40%] h-[80%] bg-white rounded-full">
                <p class="text-white responsive-text">Kodama</p>
            </div>
        
            <div class="w-px h-full bg-white mx-4"></div>

            <div id="infos" class="flex flex-col items-center justify-center h-full w-[70%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[25%] w-[70%]">
                    <div class="flex flex-col items-center justify-center w-full h-full">
                        <p class="text-white">BANBAN</p>
                        <p class="text-white">900</p>
                    </div>
                </div>
                <div id="second" class="flex flex-row items-center justify-between h-[25%] w-[70%] responsive-text">
                    <div class="flex flex-col justify-center  h-full">
                        <img src="/img/trophee.png" alt="trophee" class="w-[50%] h-[50%]">
                        <p class="text-white">900</p>
                        <p class="text-white">300</p>
                    </div>
                    <div class="flex flex-col  justify-center  h-full ">
                        <p class="text-white">14000</p>
                        <p class="text-white">9000</p>
                    </div>
                    <div class="flex flex-col  justify-center  h-full ">
                        <p class="text-white">400</p>
                        <p class="text-white">500</p>
                    </div>
                </div>
                <div class="w-[70%] h-[30%]">
                    <div class="h-full w-full overflow-y-auto ">
                        ${matches.slice(0, 10).map(match => `
                        <div class="flex flex-row justify-between items-center responsive-text-historique ">
                            <span class="">${match.player1}</span>
                            <span class="">${match.score1} - ${match.score2}</span>
                            <span class="">${match.player2}</span>
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