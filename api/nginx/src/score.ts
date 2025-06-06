/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   score.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/06 18:31:06 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/06 22:53:03 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const score = () => `
    <div id="scoreContainer" class="flex h-full w-full items-center justify-center  bg-black/60">
        
        <div class="flex flex-col gap-2 w-[30%] h-[25%] items-center justify-start">
            <h2 class="responsive-text text-white">Global Ranking</h2>
            <div class="flex justify-between w-full text-center text-white font-omori">
                <span>Rank</span>
                <span>Nickname</span>
                <span>Score</span>
            </div>
        </div >
        <div class="w-[30%] h-[25%] flex flex-col items-center justify-start gap-2">
            <h2 class="responsive-text text-white">Global Ranking</h2>
            <div class="flex justify-between text-center w-full text-white font-omori">
                <span>Rank</span>
                <span>Nickname</span>
                <span>Score</span>
            </div>
        </div>
    
   
        <button type="button" id="profileReturnBtn" class="text-white responsive-text ">Return</button>

    
    </div>
`