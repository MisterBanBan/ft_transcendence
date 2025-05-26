/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/05/07 06:31:26 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface Route {
	path: string;
	title: string;
	/*Gestion du chargement asynchrone du contenu des templates grace a Promise*/
	template: (() => Promise<string>) | string;
}

export const routes: Route[] = [
	{
		path: "/",
		title: "Accueil",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));//bg-[url('/img/fond_outside.jpg')] bg-cover bg-center bg-no-repeat
			return `
			<div class="fixed inset-0 overflow-hidden">
		<!-- 1. Calque procédural plein-écran, derrière tout (z-index -10) -->
		<div
	id="procedural-bg"
	class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
		></div>
		<div
	id="cloud"
	class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
		></div>

		<!-- 2. Contenu principal -->
		<div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
	<div class="w-screen h-screen relative">
			<div class="absolute inset-0 w-full h-full"></div>
	</div>
	<div class="w-screen h-screen relative">
			<video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black">
		<source src="/img/quit.mp4" type="video/mp4">
			</video>
	</div>
	<div id="videoDoor" class="w-screen h-screen relative">
			<video autoplay loop muted class="absolute bottom-0 inset-0 w-full h-full object-contain bg-black">
		<source src="/img/door.mp4" type="video/mp4">
			</video>
			<div id="pressE" class="hidden absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
		<video autoplay loop muted class="w-12 h-12">
				<source src="/img/pressE.mp4" type="video/mp4">
		</video>
			</div>
	</div>
		</div>

		<!-- 3. Joueur par-dessus tout -->
		<div id="player" class="absolute bottom-0 left-0 w-64 h-64 bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10"></div>
    </div>
`;
			

			
		}		
		
	},
	{
		path: "/game",
		title: "Game",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `<div class="w-screen h-screen relative">
						<video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-500">
			<source id="menu" src="/img/new_game.mp4" type="video/mp4">
				</video>
				</div>
			`;
		}
	},
	{
		path: "/Tv",
		title: "Tv",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `<div id="zoom" class="w-screen h-screen relative">
						<video autoplay loop muted class="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-500">
			<source src="/img/Tv.mp4" type="video/mp4">
				</video>
				</div>
			`;
		}
	},
	{
		path: "/auth",
		title: "Authentication",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `<div class="flex m-auto gap-8 w-4/5">
    <!-- Login Form -->
    <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h2 class="text-white text-2xl mb-4">Sign In</h2>
        <div id="error-global-login" class="error-message-login text-red-500 text-sm mb-2"></div>

        <label for="username-login" class="text-white">Username:</label>
        <div id="error-username-login" class="error-message-login text-red-500 text-sm mb-1"></div>
        <input type="text" id="username-login" class="p-2 mb-3 rounded border border-gray-300" />

        <label for="password-login" class="text-white">Password:</label>
        <div id="error-password-login" class="error-message-login text-red-500 text-sm mb-1"></div>
        <input type="password" id="password-login" class="p-2 mb-4 rounded border border-gray-300" />
        
        <label for="code" class="text-white">2FA Code (if 2FA enabled):</label>
        <div id="error-code-login" class="error-message-login text-red-500 text-sm mb-1"></div>
        <input type="text" id="code" class="p-2 mb-4 rounded border border-gray-300" />

        <input type="button" id="submit-login" value="Sign In"
               class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
    </div>

    <!-- Register Form -->
    <div class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
        <h2 class="text-white text-2xl mb-4">Sign Up</h2>
        <div id="error-global-register" class="error-message-register text-red-500 text-sm mb-2"></div>

        <label for="username-register" class="text-white">Username:</label>
        <div id="error-username-register" class="error-message-register text-red-500 text-sm mb-1"></div>
        <input type="text" id="username-register" class="p-2 mb-3 rounded border border-gray-300" />

        <label for="password-register" class="text-white">Password:</label>
        <div id="error-password-register" class="error-message-register text-red-500 text-sm mb-1"></div>
        <input type="password" id="password-register" class="p-2 mb-3 rounded border border-gray-300" />

        <label for="cpassword" class="text-white">Confirm Password:</label>
        <input type="password" id="cpassword" class="p-2 mb-4 rounded border border-gray-300" />

        <input type="button" id="submit-register" value="Sign Up"
               class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
    </div>
</div>

<div class="w-4/5 m-auto mt-6 flex justify-center">
    <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-04dc53dfa151b3c595dfa8d2ad750d48dfda6fffd8848b0e4b1d438b00306b10&redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fcallback&response_type=code" 
       target="_blank" 
       class="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded cursor-pointer text-center">
        Sign In with 42 OAuth
    </a>
</div>`;
		}
	},
	{
		path: "/2fa",
		title: "2FA",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `
		<div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
	<!-- Titre -->
	<h2 class="text-2xl font-semibold text-center text-gray-800">Vérification en 2 étapes</h2>

	<!-- Boîte pour l'image -->
	<div class="flex justify-center">
			<div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
		<img id="qrCodeImage" src="" alt="QR Code" />
			</div>
	</div>

	<!-- Texte explicatif -->
	<p class="text-gray-600 text-center text-sm">
			Scannez le QR code avec votre application d’authentification, ou entrez le code manuellement si vous l’avez déjà configurée.
	</p>

	<!-- Zone de texte pour le code -->
	<input
			id="codeInput"
			type="text"
			placeholder="Entrez le code 2FA"
			class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
	/>

	<!-- Bouton de validation -->
	<button
			id="submit"
			type="submit"
			class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
	>
			Vérifier
	</button>
		</div>`;
		}
	},
	{
		path: "*",
		title: "404 - Page not found",
		template: `
			`
	}
];

