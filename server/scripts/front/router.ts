import { PlayerAnimation } from "./player_animation.js";
import { Position } from './scripts.js';
/*Permet d'eviter que le player tourne en fond sur d'autres page*/
interface IPlayerController {
    destroy(): void;
    getVelocity(): Position;
    getIsJumping(): boolean;
}

interface Route {
    path: string;
    title: string;
    /*Gestion du chargement asynchrone du contenu des templates grace a Promise*/
    template: (() => Promise<string>) | string;
}

export default class Router {
    private routes: Route[];
    /*utilisation des elements html*/
    /*private appDiv: HTMLElement;*/
    private currentPageDiv: HTMLElement;
    private nextPageDiv: HTMLElement;
    private worldContainer: HTMLElement;
    private currentPath: string = '/';
    private worldWidth: number = 0; 
    private pageTransitioninProgress: boolean = false;

    private activePlayerController: IPlayerController | null = null;

    constructor(routes: Route[]) {
        this.routes = routes;
        /*recupere l'element app dans index.html*/
        const app = document.getElementById("app");
        if (!app)
            throw new Error("Element not found");
        app.innerHTML = `
            <div id="world-container" class="relative overflow-hidden w-full h-screen">
                <div id="current-page" class="absolute inset-0"></div>
                <div id="next-page" class="absolute inset-0 translate-x-full"></div>
            </div>
        `;
        /*this.appDiv = app;*/
        this.worldContainer = document.getElementById("world-container") as HTMLElement;
        this.currentPageDiv = document.getElementById("current-page") as HTMLElement;
        this.nextPageDiv = document.getElementById("next-page") as HTMLElement;
        this.worldWidth = window.innerWidth;
        this.bindLinks();
        /*Cette ligne ajoute un écouteur pour l'événement popstate sur l'objet window. L'événement popstate est déclenché lorsque l'utilisateur utilise les boutons Back ou Forward du navigateur. Lorsque cet événement se produit, la méthode updatePage() est appelée pour mettre à jour le contenu affiché en fonction de l'URL courante, assurant ainsi que l'application réagit correctement aux changements de l'historique sans recharger la page. */
        window.addEventListener("popstate", () => this.updatePage());
        window.addEventListener("resize", () => this.handleResize());
        this.updatePage();
    }

    public async preloadNextPage(direction: 'right' | 'left') {

        if (this.pageTransitioninProgress) return;

        const paths = ['/', '/about', '/Tv', '/contact'];
        const currentIndex = paths.indexOf(this.currentPath);
        let nextPath;

        if (direction === 'right' && currentIndex < paths.length - 1) {
            nextPath = paths[currentIndex + 1];
        } else if (direction === 'left' && currentIndex > 0) {
            nextPath = paths[currentIndex - 1];
        } else {
            return;
        }
        const nextRoute = this.routes.find(r => r.path === nextPath);
        if (!nextRoute) return;

        let content = nextRoute.template;
        if (typeof content === "function") {
            try {
                content = await content();
            } catch (error) {
                content = "<p>Error failed to up this page </p>";
            }
        }
        if (direction === 'right') {
            this.nextPageDiv.classList.remove('-translate-x-full');
            this.nextPageDiv.classList.add('translate-x-full');
        } else {
            this.nextPageDiv.classList.remove('translate-x-full');
            this.nextPageDiv.classList.add('-translate-x-full');
        }
        this.nextPageDiv.innerHTML = content;
        this.pageTransitioninProgress = true;
        return nextPath;
    }

    private handleResize() {
        this.worldWidth = window.innerWidth;
    }

    public updatePageTransition(playerX: number, direction: 'right' | 'left') {
        if(!this.pageTransitioninProgress) return;
        //console.log(`Player X: ${playerX}`);
        if (direction === 'right') {

            const progress = playerX / this.worldWidth;
            //console.log(`Progress: ${progress}`);
            this.currentPageDiv.style.transform = `translateX(-${progress * 100}%)`;
            this.nextPageDiv.style.transform = `translateX(${(1 - progress) * 100}%)`;
            //this.nextPageDiv.style.zIndex = "10";
        } else {
            const progress = (this.worldWidth - playerX) / this.worldWidth;
            this.currentPageDiv.style.transform = `translateX(${progress * 100}%)`;
            this.nextPageDiv.style.transform = `translateX(${(progress - 1) * 100}%)`;
            //this.nextPageDiv.style.zIndex = "10";
        }
    }    

    public async completePageTransition(nextPath: string) {
        if (!this.pageTransitioninProgress) return;
    
        let playerX: number | undefined = undefined;
        let playerVelocity = {x: 0, y: 0};
        let isJumping = false;

        if ( this.activePlayerController) {
            const playerElement = document.getElementById("player");
            if (playerElement) {
                const rect = playerElement.getBoundingClientRect();
                playerX = rect.left;
                playerVelocity = this.activePlayerController.getVelocity();
                isJumping = this.activePlayerController.getIsJumping();
                this.activePlayerController.destroy();
                this.activePlayerController = null;
            }
        }
        // Sauvegardez la référence au joueur
        /*const playerElement = document.getElementById("player");
        if (playerElement) {
            playerElement.remove();
        }*/
    
        history.pushState(null, "", nextPath);
        const nextRoute = this.routes.find(r => r.path === nextPath);
        if (nextRoute) document.title = nextRoute.title;
    
        const tempContent = this.currentPageDiv.innerHTML;
        this.currentPageDiv.innerHTML = this.nextPageDiv.innerHTML;
        this.nextPageDiv.innerHTML = tempContent;
        
        this.currentPageDiv.style.transform = '';
        this.nextPageDiv.style.transform = '';
        this.nextPageDiv.classList.add('translate-x-full');
    
        this.currentPath = nextPath;
        this.pageTransitioninProgress = false;
    
        // Réinsérez le joueur dans le nouveau conteneur
        const paths = ['/', '/about', '/Tv', '/contact'];
        const currentIndex = paths.indexOf(this.currentPath);
        const nextIndex = paths.indexOf(nextPath);
        const direction = nextIndex > currentIndex ? 'right' : 'left';
        
        this.loadPlayerScripts(playerX, direction);
        /*if (playerElement) {
            const container = document.getElementById("player-container");
            if (container) {
                container.appendChild(playerElement);
            }
            let playerX = 0;
            let playerDirection = null;
            if (this.activePlayerController) {
                const playerElement = document.getElementById("player");
                if (playerElement) {
                    const rect = playerElement.getBoundingClientRect();
                    playerX = rect.left;
                    const paths = ['/', '/about', '/Tv', '/contact'];
                    const currentIndex = paths.indexOf(this.currentPath);
                    const nextIndex = paths.indexOf(nextPath);
                    playerDirection = nextIndex > currentIndex ? 'right' : 'left';
                }
                this.activePlayerController.destroy();
                this.activePlayerController = null;
            }
            
            if (playerDirection === 'right' || playerDirection === 'left') {
                this.checkForPlayerElement(playerX, playerDirection);
            } else {
                this.checkForPlayerElement(playerX, undefined);
            }
            
        }*/
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
            this.currentPageDiv.innerHTML = content;
    
            // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil
            if (window.location.pathname === "/") {
                this.checkForPlayerElement();
            }
        } else {
            this.currentPageDiv.innerHTML = "<h1>404 - Page not found</h1>";
        }
    }

    public navigateTo(url: string): void {
        history.pushState(null, "",url);
        this.updatePage();
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

    private checkForPlayerElement(initialX?: number, initialDirection?: 'right' | 'left') {
        const playerContainer = document.getElementById("player-container");
        if (playerContainer) {
            // Vérifier si le joueur existe déjà
            if (!document.getElementById("player")) {
                const playerElement = document.createElement("div");
                console.log('test player already');
                playerElement.id = "player";
                playerElement.className = "absolute bottom-0 left-0 w-64 h-64 bg-[url('/public/img/kodama_stop.png')] bg-contain bg-no-repeat z-10";
                playerContainer.appendChild(playerElement);
            }
            this.loadPlayerScripts(initialX, initialDirection);
        }
        else {
            setTimeout(() => this.checkForPlayerElement(), 50);
        }
    }
    

    
    private async loadPlayerScripts(initialX?: number, initialDirection?: 'right' | 'left') {
        try {
            const playerElement = document.getElementById("player");
            if (playerElement) {
                const { default: PlayerController } = await import("./scripts.js");
                this.activePlayerController = new PlayerController('player', this, initialX, initialDirection);
            }
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
            return `<div class="fixed inset-0 w-full h-screen bg-[url('/public/img/fond_outside.jpg')] bg-cover bg-no-repeat bg-center -z-10"></div>
            <div id="player-container"></div>`;
        }
    },
    {
        path: "/about",
        title: "About",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen bg-[url('/public/img/fond_outside.jpg')] bg-cover bg-no-repeat bg-center -z-10"></div>
            <div id="player-container"></div>`;
        }
    },
    {
        path: "/Tv",
        title: "Tv",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen -z-10">
            <video autoplay loop muted class="w-full h-full object-cover">
                <source src="/public/img/quit.mp4" type="video/mp4">
            </video>
            </div>
            <div id="player-container"></div>
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