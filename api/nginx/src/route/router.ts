import { routes, Route } from './routes.js';
import { handleRouteComponents } from './route_handler.js';
import { AuthUser } from './type.js';
import { setUser} from "./user-handler.js";
import {viewManager} from "../views/viewManager.js";

export const logoutChannel = new BroadcastChannel('logout_channel');

logoutChannel.onmessage = (event) => {
	if (event.data === 'logout') {
		setUser(undefined)
		router.navigateTo("/game#login");
	}
};

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
		window.addEventListener("popstate", () => this.updatePage());
	}

	private bindLinks(): void {
		document.body.addEventListener("click", (event) => {
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

	public navigateTo(url: string, viewManager?: viewManager, isReturning: boolean = false): void {
		if(!url.startsWith("/")) {
			console.error("URL not good : ", url);
			return;
		}

		const gameFromGame = (window.location.pathname === "/game" && url.split(/[?#]/)[0] === "/game")

		if (gameFromGame && viewManager && !isReturning) {
			let oldPath = window.location.pathname

			if (window.location.search)
				oldPath += window.location.search

			if (window.location.hash)
				oldPath += window.location.hash

			viewManager.oldPaths.push(oldPath)
		}

		history.pushState(null, "",url);

		if (gameFromGame) {
			if (viewManager) {
				viewManager.show("game");
				return;
			}
		}

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

export const router = new Router(routes);

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const response = await fetch("/api/auth/verify", {
			method: "GET",
		});

		if (response.ok) {
			const data: AuthUser | undefined = await response.json();
			if (data)
				setUser(data);
		}
		await router.updatePage();
	} catch (error) {
		console.error("Wrong init :", error);
		document.body.innerHTML = "<h1>Appli dumped</h1>";
	}
})