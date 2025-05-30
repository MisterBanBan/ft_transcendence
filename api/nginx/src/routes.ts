/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/05/30 18:54:47 by mtbanban         ###   ########.fr       */
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
      <div id="pressE" class="hidden absolute inset-0 z-20 items-center justify-center bg-black bg-opacity-50">
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
            return `
            <section id="sec_video" class="w-screen h-screen relative overflow-hidden flex items-center justify-center">
              <video autoplay loop muted id="video_main"
                class="block max-w-full max-h-full object-contain"
                <source src="/img/game.mp4" type="video/mp4">
              </video>
              <div id="container_form" class="absolute w-full h-full flex items-center justify-center pointer-events-auto ">
                <button type="button" id="user" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-indigo-500 flex text-white shadow-lg hover:bg-indigo-600 focus:outline-none">
  +
</button>
                <form id="login" class="flex hidden flex-col sm:gap-1 md:gap-2 lg:gap-3 xl:gap-4 w-full max-w-[200px] sm:max-w-[250px] xl:max-w-[350px] h-full items-center justify-center">
                  <input
                    type="text"
                    placeholder="Username"
                    class="w-full h-8 top-2 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat bg-center pl-10 pr-4 bg-black text-white rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="w-full h-8 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat pl-10 pr-4 bg-black bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]"
                  />
                    <button type="submit" class="w-full h-8 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-text bg-[url('/img/case.png')] bg-no-repeat bg-black bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]">Login</button>
                    <button type="button" id="registerBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">register</button>
                </form>
                
                <form id="register" class="flex hidden flex-col gap-1 w-full max-w-[200px] sm:max-w-[250px] xl:max-w-[350px] h-full items-center justify-center">
                  <input
                    type="text"
                    placeholder="Username"
                    class="w-full h-8 top-2 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat bg-center pl-10 pr-4 bg-black text-white rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="w-full h-8 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat pl-10 pr-4 bg-black bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="w-full h-8 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat pl-10 pr-4 bg-black bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]"
                  />
                    <button type="submit" class="w-full h-8 sm:h-12 md:h-14 lg:h-16 xl:h-[96px] responsive-text bg-[url('/img/case.png')] bg-no-repeat bg-black bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]">Login</button>
                    <button type="button" id="loginBtn" class="text-white responsive-text ">LOGIN</button>
                </form>
              </div>
            
            </section>
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


