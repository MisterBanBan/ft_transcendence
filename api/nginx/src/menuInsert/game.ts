/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/10 20:53:40 by mtbanban          #+#    #+#             */
/*   Updated: 2025/07/30 13:32:30 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const game = () => `
<div id="game" class="flex responsive-form-login flex-col items-center  justify-center">

  <div id="game-options" class="flex flex-col items-center justify-center mt-4 responsive-game-gap relative w-[40%] ">
    <div id="Offline" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">Offline</div>
    <div id="online" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">Online</div>
    <div id="IA" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">AI</div>
    <div id="Tournament" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">Tournament</div>

    <video id="cursor-video" src="/img/select_game.mp4"
           autoplay loop muted
           class="absolute left-[-10px] top-0 responsive-video-game pointer-events-none z-10;">
    </video>
  </div>
</div>

`