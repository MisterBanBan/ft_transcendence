/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   route_handler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/07/22 11:22:56 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import {TFAValidate} from "./auth/2fa-validate.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Logout} from "./auth/logout.js";
// import { introduction } from './intro.js';
// import { menu } from './menu.js';
// import { Zoom } from './zoom.js';
// import { proceduralBackground } from './proceduralBackground.js';
//import { generateTrees } from './generateTrees.js';
import { introduction } from './intro.js';
import { menu } from './menu.js';
import { Zoom } from './zoom.js';
import { proceduralBackground } from './proceduralBackground.js';
import { pong } from './pong.js';
import { AuthUser } from './type.js';

//permet de gerer la destruction des new
let activeComponent: Component | null = null;
let currentUser: AuthUser | undefined = undefined;

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
			const playerIntro = new introduction('player');

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
			const me = new menu('video_main','container_form', 'user', currentUser);
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
	// "/2fa/create": {
	// 	init: () => {
	// 		activeComponent?.destroy?.();

	// 		const toggle2FA = new Toggle2FA();
	// 		toggle2FA.init();

	// 		activeComponent = {
	// 			init: () => {},
	// 			destroy: () => { toggle2FA.destroy(); },
	// 		};
	// 	},
	// 	destroy: () => {}
	// },
	// "/2fa/remove": {
	// 	init: () => {
	// 		activeComponent?.destroy?.();

	// 		const toggle2FA = new Toggle2FA();
	// 		toggle2FA.init();
	// 		activeComponent = {
	// 			init: () => {},
	// 			destroy: () => { toggle2FA.destroy(); },
	// 		};
	// 	},
	// 	destroy: () => {}
	// },
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

export function handleRouteComponents(path: string, user?: AuthUser) {
	const component = routeComponents[path];
	if(component) {
		currentUser = user;
		component.init();
	}
}
