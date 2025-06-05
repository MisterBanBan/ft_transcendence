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
import { TFACreate } from "./auth/2fa/create.js";
import {TFA} from "./auth/2fa/2fa.js";
import {ChangeUsername} from "./auth/change-username.js";
import {ChangePassword} from "./auth/change-password.js";
import {Toggle2FA} from "./auth/toggle-2fa.js";

//permet de gerer la destruction des new
let activeComponent: Component | null = null;

const routeComponents: Record<string, Component> = {

	"/settings": {
		init: () => {
			activeComponent?.destroy?.();

			const changeUsername = new ChangeUsername();
			const changePassword = new ChangePassword();
			const toggle2FA = new Toggle2FA();
			changeUsername.init();
			changePassword.init();
			toggle2FA.init();

			activeComponent = {
				init: () => {},
				destroy: () => { changeUsername.destroy(); changePassword.destroy(); toggle2FA.destroy(); },
			};
		},
		destroy: () => {}
	},
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
	"/2fa/create": {
		init: () => {
			activeComponent?.destroy?.();

			const tfaCreate = new TFACreate();
			tfaCreate.init();

			activeComponent = {
				init: () => {},
				destroy: () => { tfaCreate.destroy(); },
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
		component.init();
	}
}
