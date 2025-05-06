// import { introduction } from './intro.js'

interface Route {
    path: string;
    title: string;
    /*Gestion du chargement asynchrone du contenu des templates grace a Promise*/
    template: (() => Promise<string>) | string;
}

class Router {
    private routes: Route[];
    /*utilisation des elements html*/
    private appDiv: HTMLElement;
    
    constructor(routes: Route[]) {
        this.routes = routes;
        /*recupere l'element app dans index.html*/
        const app = document.getElementById("app");
        if (!app)
            throw new Error("Element not found");
        this.appDiv = app;
        this.bindLinks();
        /*Cette ligne ajoute un écouteur pour l'événement popstate sur l'objet window. L'événement popstate est déclenché lorsque l'utilisateur utilise les boutons Back ou Forward du navigateur. Lorsque cet événement se produit, la méthode updatePage() est appelée pour mettre à jour le contenu affiché en fonction de l'URL courante, assurant ainsi que l'application réagit correctement aux changements de l'historique sans recharger la page. */
        window.addEventListener("popstate", () => this.updatePage());
    }
        /*Intercepte les clics*/
    private bindLinks(): void {
        document.body.addEventListener("click", (event) => {
            /*seul les liens avec data-link <a href="/home" data-link>Accueil</a>  closest permet de remonter a l'element de datalink*/
            const target = (event.target as HTMLElement).closest("[data-link]");
            if (target) {
                /*empeche le comportement par defaut du navigateur comme recharger la page */
                event.preventDefault();
                const url = target.getAttribute("href");
                if (url) {
                    this.navigateTo(url);
                }
            }
        });
    }
    public navigateTo(url: string): void {
        history.pushState(null, "",url);
        this.updatePage();
    }
    public async updatePage(): Promise<void> {

        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path) || 
                      this.routes.find(r => r.path === "*");
    
        if (route) {
            document.title = route.title;
            let content = route.template;
            if (typeof content === "function") {
                try {
                    content = await content();
                } catch (error) {
                    content = "<p>Error failed to up this page </p>";
                }
            }
            this.appDiv.innerHTML = content;
        } else {
            this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
        }
    }
}


const routes: Route[] = [
    {
        path: "/",
        title: "Accueil",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <div class="fixed inset-0 overflow-hidden">
              <div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
                <div class="w-screen h-screen relative">
                  <div class="absolute inset-0 w-full h-full bg-[url('/img/fond_outside.jpg')] bg-cover bg-center bg-no-repeat"></div>
                </div>
                <div class="w-screen h-screen relative">
                  <video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black">
                    <source src="/img/quit.mp4" type="video/mp4">
                    .
                  </video>
                </div>
                <div id="videoDoor" class="w-screen h-screen relative">
                  <video autoplay loop muted class="absolute bottom-0 inset-0 w-full h-full object-contain bg-black">
                    <source src="/img/door.mp4" type="video/mp4">
                  </video>
                </div>
              </div>
              <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10"></div>
                <div id="pressE" class="hidden absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <video autoplay loop muted class="w-12 h-12">
                    <source src="/img/pressE.mp4" type="video/mp4">
                </video>
                </div>
                <script type="module" src="/public/intro.js"></script>
                

            </div>`;
            

            
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


document.addEventListener("DOMContentLoaded", () => {
    try {
        const router = new Router(routes);
        router.updatePage();
    } catch (error) {
        console.error(error);
    }



})