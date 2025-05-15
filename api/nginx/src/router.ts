/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:24 by afavier           #+#    #+#             */
/*   Updated: 2025/05/06 11:10:25 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//import { introduction } from './intro.js'
import { routes, Route } from './routes.js';
import { handleRouteComponents } from './route_handler.js';
import {showError} from "./auth/show_errors";


class Router {
    private routes: Route[];
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
        if(!url.startsWith("/")) {
            console.error("URL not good : ", url);
            return;
        }
        history.pushState(null, "",url);
        this.updatePage();
    }

    public async updatePage(): Promise<void> {
        try {
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
                handleRouteComponents(path);
            } else {
                this.appDiv.innerHTML = "<h1>404 - Page not found</h1>";
                return
            }
        } catch (error) {
            console.error("Error critical : ", error);
            this.appDiv.innerHTML = "<h1>Erreur interne</h1>";
        }
        
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await fetch("/api/auth/verify", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });

        const router = new Router(routes);
        await router.updatePage();
    } catch (error) {
        console.error("Wrong init :", error);
        document.body.innerHTML = "<h1>Appli dumped</h1>";
    }
})