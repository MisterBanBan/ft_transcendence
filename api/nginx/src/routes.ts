/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 06:31:26 by afavier          ###   ########.fr       */
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

  <!-- 2. Contenu principal -->
  <div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
    <div class="w-screen h-screen relative">
      <div class="absolute inset-0 w-full h-full"></div>
    </div>
    <div class="w-screen h-screen relative">
      <video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black">
        <source src="/img/quit.mp4" type="video/mp4">
      </video>
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
            return `<div class="w-screen h-screen relative">
                        <video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-500">
            <source id="menu" src="/img/new_game.mp4" type="video/mp4">
                </video>
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
        path: "/auth",
        title: "Authentication",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="flex m-auto gap-8 w-4/5">

            <!-- Sign-in Form -->
            <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h2 class="text-white text-2xl mb-4">Sign In</h2>
                <div id="error-global-login" class="text-red-500 text-sm mb-2"></div>

                <label for="email-login" class="text-white">Email:</label>
                <div id="error-email-login" class="text-red-500 text-sm mb-1"></div>
                <input type="text" id="email-login" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="password-login" class="text-white">Password:</label>
                <div id="error-password-login" class="text-red-500 text-sm mb-1"></div>
                <input type="password" id="password-login" class="p-2 mb-4 rounded border border-gray-300" />

                <input type="button" id="submit-login" value="Sign In"
                       class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
            </div>

            <!-- Sign-up Form -->
            <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h2 class="text-white text-2xl mb-4">Sign Up</h2>
                <div id="error-global-register" class="text-red-500 text-sm mb-2"></div>

                <label for="email-register" class="text-white">Email:</label>
                <div id="error-email-register" class="text-red-500 text-sm mb-1"></div>
                <input type="text" id="email-register" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="password-register" class="text-white">Password:</label>
                <div id="error-password-register" class="text-red-500 text-sm mb-1"></div>
                <input type="password" id="password-register" class="p-2 mb-3 rounded border border-gray-300" />

                <label for="cpassword" class="text-white">Confirm Password:</label>
                <input type="password" id="cpassword" class="p-2 mb-4 rounded border border-gray-300" />

                <input type="button" id="submit-register" value="Sign Up"
                       class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
            </div>
        </div>`;
        }
    },
    {
        path: "*",
        title: "404 - Page not found",
        template: `
            `
    }
];
 
