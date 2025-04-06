var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Router {
    constructor(routes) {
        this.currentPath = '/';
        this.worldWidth = 0;
        this.pageTransitioninProgress = false;
        this.activePlayerController = null;
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
        this.worldContainer = document.getElementById("world-container");
        this.currentPageDiv = document.getElementById("current-page");
        this.nextPageDiv = document.getElementById("next-page");
        this.worldWidth = window.innerWidth;
        this.bindLinks();
        /*Cette ligne ajoute un écouteur pour l'événement popstate sur l'objet window. L'événement popstate est déclenché lorsque l'utilisateur utilise les boutons Back ou Forward du navigateur. Lorsque cet événement se produit, la méthode updatePage() est appelée pour mettre à jour le contenu affiché en fonction de l'URL courante, assurant ainsi que l'application réagit correctement aux changements de l'historique sans recharger la page. */
        window.addEventListener("popstate", () => this.updatePage());
        window.addEventListener("resize", () => this.handleResize());
        this.updatePage();
    }
    preloadNextPage(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pageTransitioninProgress)
                return;
            const paths = ['/', '/about', '/Tv', '/contact'];
            const currentIndex = paths.indexOf(this.currentPath);
            let nextPath;
            if (direction === 'right' && currentIndex < paths.length - 1) {
                nextPath = paths[currentIndex + 1];
            }
            else if (direction === 'left' && currentIndex > 0) {
                nextPath = paths[currentIndex - 1];
            }
            else {
                return;
            }
            const nextRoute = this.routes.find(r => r.path === nextPath);
            if (!nextRoute)
                return;
            let content = nextRoute.template;
            if (typeof content === "function") {
                try {
                    content = yield content();
                }
                catch (error) {
                    content = "<p>Error failed to up this page </p>";
                }
            }
            if (direction === 'right') {
                this.nextPageDiv.classList.remove('-translate-x-full');
                this.nextPageDiv.classList.add('translate-x-full');
            }
            else {
                this.nextPageDiv.classList.remove('translate-x-full');
                this.nextPageDiv.classList.add('-translate-x-full');
            }
            this.nextPageDiv.innerHTML = content;
            this.pageTransitioninProgress = true;
            return nextPath;
        });
    }
    handleResize() {
        this.worldWidth = window.innerWidth;
    }
    /*Intercepte les clics*/
    bindLinks() {
        document.body.addEventListener("click", (event) => {
            /*seul les liens avec data-link <a href="/home" data-link>Accueil</a>  closest permet de remonter a l'element de datalink*/
            const target = event.target.closest("[data-link]");
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
    navigateTo(url) {
        history.pushState(null, "", url);
        this.updatePage();
    }
    updatePageTransition(playerX, direction) {
        if (!this.pageTransitioninProgress)
            return;
        if (direction === 'right') {
            const progress = playerX / this.worldWidth;
            this.nextPageDiv.style.transform = `translateX(${(1 - progress) * 100}%)`;
        }
        else {
            const progress = (this.worldWidth - playerX) / this.worldWidth;
            this.nextPageDiv.style.transform = `translateX(${(progress - 1) * 100}%)`;
        }
    }
    completePageTransition(nextPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pageTransitioninProgress)
                return;
            history.pushState(null, "", nextPath);
            const nextRoute = this.routes.find(r => r.path === nextPath);
            if (nextRoute)
                document.title = nextRoute.title;
            // Sauvegardez la position actuelle du joueur avant de changer de page
            const playerElement = document.getElementById("player");
            const playerPosition = playerElement ? playerElement.getBoundingClientRect() : null;
            const tempContent = this.currentPageDiv.innerHTML;
            this.currentPageDiv.innerHTML = this.nextPageDiv.innerHTML;
            this.nextPageDiv.innerHTML = tempContent;
            this.nextPageDiv.style.transform = '';
            this.nextPageDiv.classList.add('translate-x-full');
            this.currentPath = nextPath;
            this.pageTransitioninProgress = false;
            // Restaurez la position du joueur sur la nouvelle page
            const newPlayerElement = document.getElementById("player");
            if (newPlayerElement && playerPosition) {
                // Utilisez les coordonnées sauvegardées pour positionner le joueur
                if (this.activePlayerController) {
                    this.activePlayerController.destroy();
                    this.activePlayerController = null;
                }
                this.checkForPlayerElement();
            }
        });
    }
    updatePage() {
        return __awaiter(this, void 0, void 0, function* () {
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
                        content = yield content();
                    }
                    catch (error) {
                        content = "<p>Error failed to up this page </p>";
                    }
                }
                this.currentPageDiv.innerHTML = content;
                // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil
                if (window.location.pathname === "/") {
                    this.checkForPlayerElement();
                }
            }
            else {
                this.currentPageDiv.innerHTML = "<h1>404 - Page not found</h1>";
            }
        });
    }
    checkForPlayerElement() {
        const playerElement = document.getElementById("player");
        if (playerElement) {
            this.loadPlayerScripts();
        }
        else {
            setTimeout(() => this.checkForPlayerElement(), 50);
        }
    }
    loadPlayerScripts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playerElement = document.getElementById("player");
                if (playerElement) {
                    const { default: PlayerController } = yield import("./scripts.js");
                    this.activePlayerController = new PlayerController('player', this);
                }
            }
            catch (error) {
                console.error("Erreur lors du chargement des scripts:", error);
            }
        });
    }
}
const routes = [
    {
        path: "/",
        title: "Accueil",
        template: () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen bg-[url('/public/img/fond_outside.jpg')] bg-cover bg-no-repeat bg-center -z-10"></div>
            <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/public/img/kodama_stop.png')] bg-contain bg-no-repeat"></div>
            `;
        })
    },
    {
        path: "/about",
        title: "About",
        template: () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen bg-[url('/public/img/about_bg.jpg')] bg-cover bg-no-repeat bg-center -z-10"></div>
            <div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/public/img/kodama_stop.png')] bg-contain bg-no-repeat"></div>
            `;
        })
    },
    {
        path: "/Tv",
        title: "Tv",
        template: () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 300));
            return `<div class="fixed inset-0 w-full h-screen -z-10">
            <video autoplay loop muted class="w-full h-full object-cover">
                <source src="/public/img/quit.mp4" type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
            </video>
            </div>
            `;
        })
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
});
