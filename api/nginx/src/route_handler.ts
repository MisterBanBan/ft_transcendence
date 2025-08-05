/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   route_handler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/08/02 23:27:40 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import {TFAValidate} from "./auth/2fa-validate.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Logout} from "./auth/logout.js";
import { introduction } from './intro.js';
import { Zoom } from './zoom.js';
import { proceduralBackground } from './proceduralBackground.js';
import { pong } from './pong.js';
import { viewManager } from './views/viewManager.js';
import { chaletCadre } from './chaletCadre.js';

//permet de gerer la destruction des new
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

			console.log("Init /game");
			const me = new viewManager('video_main','container_form', 'user');
            me.init();
			const login = new Login();
			login.init();

            activeComponent = {
                init: () => {},
                destroy: () => { me.destroy(); login.destroy();  }
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
				'backPong',
				'quitPong',
				'loading',
				'win',
				'lose',
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
	"/settings": {
		init: () => {
			activeComponent?.destroy?.();

			const changeUsername = new ChangeUsername();
			const changePassword = new ChangePassword();
			// const toggle2FA = new Toggle2FA();
			const logout = new Logout();
			changeUsername.init();
			changePassword.init();
			// toggle2FA.init();
			logout.init();

			activeComponent = {
				init: () => {},
				destroy: () => { changeUsername.destroy(); changePassword.destroy(); logout.destroy(); },
			};
		},
		destroy: () => {}
	},
	"/2fa": {
		init: () => {
			activeComponent?.destroy?.();

			const tfa = new TFAValidate();
			tfa.init();

			activeComponent = {
				init: () => {},
				destroy: () => { tfa.destroy(); },
			};
		},
		destroy: () => {}
	},
	"/auth": {
		init: () => {
			activeComponent?.destroy?.();

			const login = new Login();
			const register = new Register();
			login.init();
			register.init();
			activeComponent = {
				init: () => {},
				destroy: () => { login.destroy(); register.destroy(); },
			};
		},
		destroy: () => {}
	},
};

export function handleRouteComponents(path: string) {
	const component = routeComponents[path];
	if(component) {
		console.warn(path, "component init");
		component.init();
	}
}
