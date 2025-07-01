/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   route_handler.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
<<<<<<< HEAD
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/06/03 11:25:18 by mtbanban         ###   ########.fr       */
=======
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:15 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 06:31:05 by afavier          ###   ########.fr       */
>>>>>>> main
/*                                                                            */
/* ************************************************************************** */

import { Component } from './component.js';
<<<<<<< HEAD
//import { Forest } from './generateTrees.js';
import { introduction } from './intro.js';
import { menu } from './menu.js';
import { Zoom } from './zoom.js';
import { proceduralBackground } from './proceduralBackground.js';
import { pong } from './pong.js';
=======
import { Login } from "./auth/login.js";
import { Register } from "./auth/register.js";
import {TFAValidate} from "./auth/2fa-validate.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Toggle2FA} from "./auth/toggle-2fa.js";
import {Logout} from "./auth/logout.js";
// import { introduction } from './intro.js';
// import { menu } from './menu.js';
// import { Zoom } from './zoom.js';
// import { proceduralBackground } from './proceduralBackground.js';
>>>>>>> main

//permet de gerer la destruction des new
let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

<<<<<<< HEAD
    
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
            const me = new menu('video_main','container_form', 'user', 'login', 'register','registerBtn','loginBtn');
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
            const params = new URLSearchParams(window.location.search);
            const mode = params.get("mode");

            activeComponent?.destroy?.();
            const pongGame = new pong(
                'left-bar',      // ID de la barre gauche
                'right-bar',	// ID de la barre droite
                'ball',			// ID de la balle
                'pong-bg', // ID du conteneur de jeu
                'pong',
                mode
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
=======
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
>>>>>>> main
}
