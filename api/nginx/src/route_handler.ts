/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   route_handler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 06:31:05 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import {TFA} from "./auth/2fa.js";
// import { introduction } from './intro.js';
// import { menu } from './menu.js';
// import { Zoom } from './zoom.js';
// import { proceduralBackground } from './proceduralBackground.js';

//permet de gerer la destruction des new
let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

	"/2fa": {
		init: () => {
			activeComponent?.destroy?.();

			const tfa = new TFA();
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

	// "/": {
	//     init: () => {
	//         activeComponent?.destroy?.();
	//         const bg = new proceduralBackground('procedural-bg', 'cloud', 7);
	//         const playerIntro = new introduction('player');
	//
	//         bg.init();
	//         playerIntro.init();
	//         activeComponent = {
	//             init: () => {},
	//             destroy: () => { bg.destroy(); playerIntro.destroy(); }
	//         };
	//     },
	//     destroy: () => {}
	// },
	//
	// "/game": {
	//     init: () => {
	//         activeComponent?.destroy?.();
	//         const me = new menu('menu');
	//         me.init();
	//         activeComponent = {
	//             init: () => {},
	//             destroy: () => { me.destroy(); }
	//         };
	//     },
	//     destroy: () => {}
	// },
	// "/Tv": {
	//     init: () => {
	//         activeComponent?.destroy?.();
	//         const tv = new Zoom('zoom');
	//         tv.init();
	//         activeComponent = {
	//             init: () => {},
	//             destroy: () => { tv.destroy(); }
	//         };
	//     },
	//     destroy: () => {}
	// }
};

export function handleRouteComponents(path: string) {
	const component = routeComponents[path];
	if(component) {
		component.init();
	}
}
