import { Component } from './component.js';
import { introduction } from '../IntroProject/intro.js';
import { proceduralBackground } from '../IntroProject/proceduralBackground.js';
import { pong } from '../pong/pong.js';
import { viewManager } from '../views/viewManager.js';
import { chaletCadre } from '../IntroProject/chaletCadre.js';

let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

    "/": {
        init: () => {
            activeComponent?.destroy?.();
            const bg = new proceduralBackground('procedural-bg', 'procedural-bg', 16);
            const playerIntro = new introduction('player');

            bg.init();
            playerIntro.init();
            activeComponent = {
                init: () => {},
                destroy: () => { bg.destroy(); playerIntro.destroy(); }
            };
        },
        destroy: () => {}
    },

	"/chalet": {
		init: () => {
			activeComponent?.destroy?.();
			const playerIntro = new introduction('playerChalet');

			const chalet = new chaletCadre('chalet');
			chalet.init();
			playerIntro.init();
			activeComponent = {
				init: () => {},
				destroy: () => { playerIntro.destroy(); }
			};
		},
		destroy: () => {}
	},

    "/game": {
        init: () => {
            activeComponent?.destroy?.();

			const me = new viewManager('video_main','container_form', 'user');
            me.init();

            activeComponent = {
                init: () => {},
                destroy: () => { me.destroy(); }
            };
        },
        destroy: () => {}
    },
    "/Pong": {
        init: () => {
            const params = new URLSearchParams(window.location.search);
            const mode = params.get("mode");

            activeComponent?.destroy?.();
            const pongGame = new pong(
                'left-bar',
                'right-bar',
                'ball',
                'pong-bg',
				'score-player1',
				'score-player2',
                'timer',
				'backPong',
				'quitPong',
				'loading',
				'win',
				'lose',
				'end',
                'video_main',
                mode
              );
            pongGame.init();
            activeComponent = {
                init: () => {},
                destroy: () => { pongGame.destroy(); }
            };
        },
        destroy: () => {}
    },
};

export function handleRouteComponents(path: string) {
	const component = routeComponents[path];
	if(component) {
		component.init();
	}
}
