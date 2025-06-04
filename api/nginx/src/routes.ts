/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/06/04 08:00:48 by mtbanban         ###   ########.fr       */
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
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <div class="fixed inset-0 h-full w-full relative overflow-hidden">
                <div
                  id="procedural-bg"
                  class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
                ></div>
                <canvas id="forest" class="absolute inset-0 -z-20"></canvas>
                <div class="absolute left-0 bottom-0 w-full h-full z-10">
  <img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[30%] object-cover pointer-events-none translate-y-2" />
  <img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[17%] object-cover pointer-events-none translate-y-2" />
</div>




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
</div>
                <!-- 3. Joueur par-dessus tout -->
<div id="player"
     class="fixed left-0 w-[10vw] h-[25vh] bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10">
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
                class="block max-w-full max-h-full object-contain">
                <source src="/img/game.mp4" type="video/mp4">
              </video>
              <div id="container_form" class="absolute w-full h-full flex items-center justify-center pointer-events-auto ">
                <button type="button" id="user" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-indigo-500 flex text-white shadow-lg hover:bg-indigo-600 focus:outline-none">
  +
</button>
                <form id="login" autocomplete="off" class="flex hidden responsive-form-login flex-col items-center justify-center">
                
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                
                <input
                    type="text"
                    placeholder="Username"
                    autocomplete="off"
                    class="responsive-case-login responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat bg-center px-3 bg-black/60 rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    autocomplete="off"
                    class="responsive-case-login responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat px-3 bg-black/60 bg-center  rounded focus:outline-none bg-[length:100%_100%]"
                  />
                    <button type="submit" class="responsive-case-login responsive-text bg-[url('/img/case.png')] bg-no-repeat  bg-black/60 bg-center  text-white rounded focus:outline-none bg-[length:100%_100%] ">Login</button>
                    <button type="button" id="registerBtn" class="text-white responsive-text responsive-case-login relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">register</button>
                </form>
                
                <form id="register" autocomplete="off" class="flex hidden responsive-form-register flex-col items-center justify-center">
                  
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                
                <input
                    type="text"
                    placeholder="Username"
                    autocomplete="off"
                    class="responsive-case-register responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat bg-center px-3 bg-black/60  rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    autocomplete="off"
                    class="responsive-case-register responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat px-3 bg-black/60 bg-center   rounded focus:outline-none bg-[length:100%_100%]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    autocomplete="off"
                    class="responsive-case-register responsive-placeholder bg-[url('/img/case.png')] bg-no-repeat px-3 bg-black/60 bg-center   rounded focus:outline-none bg-[length:100%_100%]"
                  />
                    <button type="submit" class="responsive-case-register responsive-text bg-[url('/img/case.png')] bg-no-repeat bg-black/60 bg-center  text-white rounded focus:outline-none bg-[length:100%_100%]">Login</button>
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


