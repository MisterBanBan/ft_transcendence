import { PlayerAnimation } from "./player_animation.js";
import PlayerController from "./scripts.js";

/*Permet d'eviter que le player tourne en fond sur d'autres page*/
interface IPlayerController {
    destroy(): void;
}

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
    private activePlayerController: IPlayerController | null = null;

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
        if (this.activePlayerController) {
            this.activePlayerController.destroy();
            this.activePlayerController = null;
        }

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
    
            // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil
            if (window.location.pathname === "/") {
                this.checkForPlayerElement();
            }
        } else {
            this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
        }
    }

    private checkForPlayerElement() {
        const playerElement = document.getElementById("player");
        if (playerElement) {
            this.loadPlayerScripts();
        }
        else {
            setTimeout(() => this.checkForPlayerElement(), 50);
        }
    }
    
    private async loadPlayerScripts() {
        try {
            this.activePlayerController = new PlayerController('player', 'pressE');
        } catch (error) {
            console.error("Erreur lors du chargement des scripts:", error);
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
            <div class="absolute inset-0 overflow-hidden">
                <div id="pageContainer" class="flex w-[300vw] h-full">
                    <div class="flex w-screen h-full bg-[url('/img/fond_outside.jpg')] bg-cover bg-no-repeat bg-center"></div>
                    <div class="flex w-screen h-full">
                        <video autoplay loop muted class="w-full h-full object-cover">
                            <source src="/img/quit.mp4" type="video/mp4">
                        </video>
                    </div>
                    <div class="flex w-screen h-full">
                        <video autoplay loop muted class="absolute w-64 h-64 bottom-0 left-400 object-cover">
                            <source src="/img/door.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
                <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10"></div>
                <div id="pressE" class="hidden" ><video autoplay loop muted class="absolute w-64 h-64 bottom-0 left-400 object-cover">
                            <source src="/img/pressE.mp4" type="video/mp4">
                        </video></div>
            </div>`;
        }        
        
    },
    {
        path: "/about",
        title: "About",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            `;
        }
    },
    {
        path: "/Tv",
        title: "Tv",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen -z-10">
            <video autoplay loop muted class="w-full h-full object-cover">
                <source src="./img/quit.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
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
    const router = new Router(routes);
    router.updatePage();
})