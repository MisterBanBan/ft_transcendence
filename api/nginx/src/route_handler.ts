import { introduction } from './intro.js';
import { menu } from './menu.js';
import { Zoom } from './zoom.js';
import { proceduralBackground } from './proceduralBackground.js';

type RouteComponent = {
    init: () => void;
    destroy?: () => void;
};
//permet de gerer la destruction des new
let activeComponent: { instance: unknown; destroy?: () => void } | undefined;

const routeComponents: Record<string, RouteComponent> = {
    "/": {
        init: () => {
            activeComponent?.destroy?.();

            // Génère les oiseaux dans #procedural-bg
            new proceduralBackground('procedural-bg').generateBirds(7);
        
            // Puis ton intro/joueur
            const playerIntro = new introduction('player');
            activeComponent = {
              instance: playerIntro,
              //destroy: () => playerIntro.destroy?.()
            };
        },
        //pour l'instant inutile
        //destroy: () => (activeComponent?.instance as introduction)?.destroy?.()
    },
    "/game": {
        init: () => {
            activeComponent?.destroy?.();
            activeComponent = {instance: new menu('menu')};
        },
    },
    "/Tv": {

        init: () => {
            activeComponent?.destroy?.();
            activeComponent = {instance: new Zoom('zoom')};
        }
    }
};

export function handleRouteComponents(path: string) {
    const component = routeComponents[path];
    if(component) {
        component.init();
    }
}

export function registerRouteComponent(path: string, component: RouteComponent) {
    routeComponents[path] = component;
}