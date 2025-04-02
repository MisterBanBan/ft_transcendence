import { PlayerAnimation } from "./player_animation.js";

interface Route {
    path: string;
    title: string;
    /*par exemple, lorsqu'on doit récupérer des données depuis une API, ou simuler un délai de chargement*/
    template: (() => Promise<string>) | string;
}

class Router {
    private routes: Route[];
    private appDiv: HTMLElement;

    constructor(routes: Route[]) {
        this.routes = routes;
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
            /*seul les liens avec data-link <a href="/home" data-link>Accueil</a>  closest permet de remonter a lelement de datalink*/
            const target = (event.target as HTMLElement).closest("[data-link]");
            if (target) {
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
    
            // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil
            if (window.location.pathname === "/") {
                this.loadPlayerScripts();
            }
        } else {
            this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
        }
    }
    
    private async loadPlayerScripts() {
        try {
            const { default: PlayerController } = await import("./scripts.js");

            const playerElement = document.getElementById("player");
            if (playerElement) {
                new PlayerController('player');
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
            <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/public/img/kodama_stop.png')] bg-contain bg-no-repeat"></div>
            `;
    
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