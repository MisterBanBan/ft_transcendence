var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Router {
    constructor(routes) {
        this.activePlayerController = null;
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
        return __awaiter(this, void 0, void 0, function* () {
            const currentPath = window.location.pathname;
            const direction = this.getNavigationDirection(currentPath, url);
            // Créer un conteneur temporaire pour la nouvelle page
            const tempContainer = document.createElement("div");
            tempContainer.className = "fixed inset-0 transform transition-transform duration-500 ease-in-out";
            tempContainer.style.zIndex = "10";
            // Positionner le conteneur hors écran selon la direction
            if (direction === 'forward') {
                tempContainer.classList.add("translate-x-full");
            }
            else {
                tempContainer.classList.add("-translate-x-full");
            }
            // Animer le contenu actuel
            this.appDiv.classList.add("transition-transform", "duration-500", "ease-in-out");
            this.appDiv.style.transform = direction === 'forward' ? "translateX(-100vw)" : "translateX(100vw)";
            // Charger le contenu de la nouvelle page
            const newRoute = this.routes.find(r => r.path === url) ||
                this.routes.find(r => r.path === "*");
            if (newRoute) {
                let content = newRoute.template;
                if (typeof content === "function") {
                    try {
                        content = yield content();
                    }
                    catch (error) {
                        content = "<p>Error failed to load this page</p>";
                    }
                }
                // Insérer le contenu dans le conteneur temporaire
                tempContainer.innerHTML = content;
                document.body.appendChild(tempContainer);
                // Attendre un instant pour que le DOM se mette à jour
                yield new Promise(resolve => setTimeout(resolve, 50));
                // Animer l'entrée du nouveau contenu
                tempContainer.classList.remove(direction === 'forward' ? "translate-x-full" : "-translate-x-full");
                // Attendre la fin de l'animation
                yield new Promise(resolve => setTimeout(resolve, 500));
                // Nettoyer les contrôleurs actifs
                if (this.activePlayerController) {
                    this.activePlayerController.destroy();
                    this.activePlayerController = null;
                }
                // Mettre à jour l'URL et le titre
                history.pushState(null, "", url);
                document.title = newRoute.title;
                // Remplacer le contenu principal
                this.appDiv.innerHTML = content;
                this.appDiv.style.transform = ""; // Réinitialiser la transformation
                this.appDiv.classList.remove("transition-transform", "duration-500", "ease-in-out");
                // Supprimer le conteneur temporaire
                document.body.removeChild(tempContainer);
                // Initialiser les scripts si nécessaire
                if (url === "/") {
                    this.checkForPlayerElement();
                }
            }
        });
    }
    getNavigationDirection(currentPath, newPath) {
        const paths = ['/', '/about', 'Tv', '/contact'];
        const currentIndex = paths.indexOf(currentPath);
        const nextIndex = paths.indexOf(newPath);
        return nextIndex > currentIndex ? 'forward' : 'backward';
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
                this.appDiv.innerHTML = content;
                // Charger dynamiquement le script à chaque fois qu'on revient sur l'accueil
                if (window.location.pathname === "/") {
                    this.checkForPlayerElement();
                }
            }
            else {
                this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
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
                const { default: PlayerController } = yield import("./scripts.js");
                this.activePlayerController = new PlayerController('player');
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
            return `
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
export {};
