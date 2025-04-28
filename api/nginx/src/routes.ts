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
        path: "*",
        title: "404 - Page not found",
        template: `
            `
    }
];

