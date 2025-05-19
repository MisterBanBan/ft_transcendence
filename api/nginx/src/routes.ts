/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/05/18 15:26:33 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface Route {
    path: string;
    title: string;
    /*Gestion du chargement asynchrone du contenu des templates grace a Promise*/
    template: (() => Promise<string>) | string;
}

export const routes: Route[] = [
    {
        path: "/",
        title: "Accueil",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));//bg-[url('/img/fond_outside.jpg')] bg-cover bg-center bg-no-repeat
            return `
            <div class="fixed inset-0 overflow-hidden">
  <!-- 1. Calque procédural plein-écran, derrière tout (z-index -10) -->
  <div
    id="procedural-bg"
    class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
  ></div>
  <div
    id="cloud"
    class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
  ></div>
<canvas id="forest" class="absolute inset-0 -z-20"></canvas>
<div id="procedural-bg" class="absolute inset-0 -z-10"></div>
<!-- puis ton contenu principal en z-0 ou plus -->



  <!-- 2. Contenu principal -->
  <div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
    <div class="w-screen h-screen relative">
      <div class="absolute inset-0 w-full h-full"></div>
    </div>

    <div id="videoDoor" class="w-screen h-screen relative">
      <video autoplay loop muted class="absolute bottom-0 inset-0 w-full h-full object-contain bg-black">
        <source src="/img/door.mp4" type="video/mp4">
      </video>
      <div id="pressE" class="hidden absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
        <video autoplay loop muted class="w-12 h-12">
          <source src="/img/pressE.mp4" type="video/mp4">
        </video>
      </div>
    </div>
  </div>

  <!-- 3. Joueur par-dessus tout -->
  <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10"></div>
</div>
`;
            

            
        }        
        
    },
    {
        path: "/game",
        title: "Game",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
                        <video autoplay loop muted class="block max-w-full max-h-full object-contain" id="main-video">
                          <source id="menu" src="/img/game.mp4" type="video/mp4">
                        </video>
                        <button id="auth"
                          class="absolute rounded-full bg-red-500 hover:bg-red-700 w-16 h-16 flex items-center justify-center shadow-lg" 
                          style="top:18%; left:68%;">
                          <span class="text-white font-bold text-xl">GO</span>
                        </button>
                          <img
                            id="special-img"
                            src="/img/last_airbender.jpg"
                            alt="last_airbender"
                            class="absolute hidden object-cover"
                            style="
                              top: 18%;
                              left: 4%;
                              width: 70%;
                              height: 70%;
                              pointer-events: none;
                            "
                          />
                </div>
            `;
        }
    },
    {
        path: "/Tv",
        title: "Tv",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div id="zoom" class="w-screen h-screen relative">
                        <video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-500">
            <source src="/img/Tv.mp4" type="video/mp4">
                </video>
                </div>
            `;
        }
    },
    {
    
      path: "/Pong",
      title: "Pong",
      template: async () => {
        await new Promise(r => setTimeout(r, 300));
        return `
            <div id="pong" class="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
              <img
                id="pong-bg"
                src="/img/pong.png"
                alt="Pong background"
                class="block max-w-full max-h-full object-contain"
              />
              <img id="left-bar"  src="/img/bar_left.png"  class="absolute" />
              <img id="right-bar" src="/img/bar_left.png" class="absolute" />
            </div>


        `;
      }
    },
    
    {
        path: "*",
        title: "404 - Page not found",
        template: `
            `
    }
];

/*          <div id="pong" class="relative w-screen h-screen bg-red overflow-hidden">
            <img 
              src="/img/pong.png"
              alt="Pong background"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <img
                id="left-bar"
                src="/img/bar_left.png" alt="Left paddle"
                class="absolute left-[15%] top-0 w-8 h-24"
              />
              <img
                id="right-bar"
                src="/img/bar_left.png" alt="Right paddle"
                class="absolute right-[35%] top-0 w-8 h-24"
              />
          </div>*/
