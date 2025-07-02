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
import {TFAValidate} from "./auth/2fa-validate.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Toggle2FA} from "./auth/toggle-2fa.js";
import {Logout} from "./auth/logout.js";
import {CreateTournament} from "./tournament/create-tournament.js";
import {GetTournaments} from "./tournament/get-tournaments.js";
import EnhancedSocket from './tournament/enhanced-ws.js';

// import { introduction } from './intro.js';
// import { menu } from './menu.js';
// import { Zoom } from './zoom.js';
// import { proceduralBackground } from './proceduralBackground.js';

//permet de gerer la destruction des new
let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

	"/tournament": {
		init: () => {
			activeComponent?.destroy?.();

			const ws = new EnhancedSocket('wss://10.14.8.1:8443/wss/tournament');

			ws.onopen = () => {
				console.log('WebSocket opened');
				ws.send('Hello from client');
			};
			ws.onmessage = (event) => {
				console.log('Message from server:', event.data);
			};
			ws.onerror = (e) => {
				console.error('WebSocket error:', e);
			};
			ws.onclose = (event) => {
				console.log(event);
				console.log('WebSocket closed', event.code, event.reason);
			};

			const createTournament = new CreateTournament(ws);
			//const getTournaments = new GetTournaments(ws);

			createTournament.init();
			//getTournaments.init();

			activeComponent = {
				init: () => {},
				destroy: () => { createTournament.destroy(); },
			};
		},
		destroy: () => {}
	},
	"/settings": {
		init: () => {
			activeComponent?.destroy?.();

			const changeUsername = new ChangeUsername();
			const changePassword = new ChangePassword();
			const toggle2FA = new Toggle2FA();
			const logout = new Logout();
			changeUsername.init();
			changePassword.init();
			toggle2FA.init();
			logout.init();

			activeComponent = {
				init: () => {},
				destroy: () => { changeUsername.destroy(); changePassword.destroy(); toggle2FA.destroy(); logout.destroy(); },
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
	"/2fa/create": {
		init: () => {
			activeComponent?.destroy?.();

			const toggle2FA = new Toggle2FA();
			toggle2FA.init();

			activeComponent = {
				init: () => {},
				destroy: () => { toggle2FA.destroy(); },
			};
		},
		destroy: () => {}
	},
	"/2fa/remove": {
		init: () => {
			activeComponent?.destroy?.();

			const toggle2FA = new Toggle2FA();
			toggle2FA.init();
			activeComponent = {
				init: () => {},
				destroy: () => { toggle2FA.destroy(); },
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
