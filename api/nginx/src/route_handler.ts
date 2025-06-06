/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   route_handler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/06/06 13:01:13 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
//import { Forest } from './generateTrees.js';
import { introduction } from './intro.js';
import { menu } from './menu.js';
import { Zoom } from './zoom.js';
import { proceduralBackground } from './proceduralBackground.js';
import { pong } from './pong.js';

//permet de gerer la destruction des new
let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

    
    "/": {
        init: () => {
            activeComponent?.destroy?.();
            const bg = new proceduralBackground('procedural-bg', 'procedural-bg', 8);
            const playerIntro = new introduction('player');
            //const brushUrl = '/img/tree.png'; // votre png de coup de pinceau
            //const forest = new Forest('forest', brushUrl);
            //forest.generate(10);
            
            bg.init();
            playerIntro.init();
            activeComponent = {
                init: () => {},
                destroy: () => { bg.destroy(); playerIntro.destroy(); }
            };
        },
        destroy: () => {}
    },
    
    "/game": {
        init: () => {
            activeComponent?.destroy?.();
            const me = new menu('video_main','container_form', 'user');
            me.init();
            activeComponent = {
                init: () => {},
                destroy: () => { me.destroy(); }
            };
        },
        destroy: () => {}
    },
    "/Tv": {
        init: () => {
            activeComponent?.destroy?.();
            const tv = new Zoom('zoom');
            tv.init();
            activeComponent = {
                init: () => {},
                destroy: () => { tv.destroy(); }
            };
        },
        destroy: () => {}
    },
    "/Pong": {
        init: () => {
            activeComponent?.destroy?.();
            const pongGame = new pong(
                'left-bar',      // ID de la barre gauche
                'right-bar',     // ID de la barre droite
                'pong-bg', // ID du conteneur de jeu
                'pong'
              );
            pongGame.init();
            activeComponent = {
                init: () => {},
                destroy: () => { pongGame.destroy(); }
            };
        },
        destroy: () => {}
    }
    
};

export function handleRouteComponents(path: string) {
    const component = routeComponents[path];
    if(component) {
        component.init();
    }
}
