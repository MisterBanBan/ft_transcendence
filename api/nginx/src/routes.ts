/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   routes.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/06 11:10:33 by afavier           #+#    #+#             */
/*   Updated: 2025/07/22 14:42:58 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const ft_url = "https://api.intra.42.fr/oauth/authorize?" +
	"client_id=u-s4t2ud-04dc53dfa151b3c595dfa8d2ad750d48dfda6fffd8848b0e4b1d438b00306b10&" +
	"redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fcallback%2F42&" +
	"response_type=code";
const google_url = "https://accounts.google.com/o/oauth2/v2/auth?" +
	"client_id=570055045570-c95opdokftohj6c4l7u9t7b46bpmnrkl.apps.googleusercontent.com&" +
	"redirect_uri=https%3A%2F%2Flocalhost%3A8443%2Fapi%2Fauth%2Fcallback%2Fgoogle&" +
	"response_type=code&" +
	"scope=profile%20email&" +
	"access_type=offline&" +
	"include_granted_scopes=true&" +
	"prompt=login"

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
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <div class="fixed inset-0 h-full w-full relative overflow-hidden">

				
                <canvas id="forest" class="absolute inset-0 -z-20"></canvas>
				
				




                <div id="pageContainer" class="flex w-[300vw] h-screen overflow-hidden">
					<div
					id="procedural-bg"
					class="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
					>
				  
					</div>
				
					<div class="w-screen h-screen relative">
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2" z-10/>
			
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2" z-20/>

						</div>        
					</div>
					<div class="w-screen h-screen relative">
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2" z-10/>
		
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2" z-20/>
						</div>      
					</div>

                  	<div id="videoDoor" class="w-screen h-screen relative z-50">
                    	<img src="/img/chalet.png" class="absolute bottom-[2%] left-0 w-[60%] h-[60%] object-contain z-50"/>
						<div id="pressE" class="hidden absolute inset-0 z-20 items-center justify-center bg-black bg-opacity-50">
							<video autoplay loop muted class="w-12 h-12">
							<source src="/img/pressE.mp4" type="video/mp4">
							</video>
						</div>
						<div class="absolute left-0 bottom-0 w-full h-full z-10">
							<img src="/img/path2.png" class="absolute left-0 bottom-0 w-full h-[18%] object-cover pointer-events-none translate-y-2" z-10/>
	
							<img src="/img/path.png"  class="absolute left-0 bottom-0 w-full h-[12%] object-cover pointer-events-none translate-y-2" z-20/>
						</div>  
                  	</div>
				      
                </div>
			</div>
							<!-- 3. Joueur par-dessus tout -->
			<div id="player"
				class="fixed left-0 w-[10vw] h-[25vh] bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-10">
			</div>
              
`;
            

            
        }        
        
    },
    { 
        path: "/game",
        title: "Game",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
            <section id="sec_video" class="w-screen h-screen relative overflow-hidden flex items-center justify-center">
              <video autoplay loop muted id="video_main"
                class="block max-w-full max-h-full object-contain">
                <source src="/img/acceuil.mp4" type="video/mp4">
              </video>

             
              	<div id="container_form" class="absolute w-full h-full flex items-center justify-center pointer-events-auto ">
					<div class="flex flex-col items-center justify-center h-full w-[80%] relative">	    
						<button type="button" id="user" class="absolute flex items-center justify-center top-[10%] right-[5%] w-[6%] h-[10%] bg-[url('/img/profile.png')] bg-contain bg-black/60 bg-no-repeat bg-center z-20 pointer-events-auto">
								</button>
						<div id="dynamic-content" class="h-full w-full flex items-center justify-center absolute"></div>
					</div>
					<div id="picture" class="h-full w-[20%] flex items-center justify-center relative">
					</div>
													
					
            	</div>
            </section>
            `;
        }
    },
	{
		path: "/chalet",
		title: "Chalet",
		template: async () => {
			await new Promise(resolve => setTimeout(resolve, 300));
			return `
				<div id="chalet" class="fixed inset-0 h-full w-full relative overflow-hidden">
					<div id="pageContainer" class="flex w-[200vw] h-full overflow-x-auto items-center justify-center relative">
						<img src="/img/chalet_inside.png" class="inset-0 w-full h-[85%] object-fill z-50">
						<div id="pressE" class="hidden absolute inset-0 z-20 items-center justify-center bg-black bg-opacity-50">
							<video autoplay loop muted class="w-12 h-12">
							<source src="/img/pressE.mp4" type="video/mp4">
							</video>
						</div>
						</div>
				</div>
				<div id="player"
				class="fixed left-0 w-[30vw] h-[70vh] bg-[url('/img/kodama_stop.png')] bg-contain bg-no-repeat z-50">
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

      path: "/Pong",
      title: "Pong",
      template: async () => {
        await new Promise(r => setTimeout(r, 300));
        return `
            <div id="pong" class="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
              <img
                id="pong-bg"
                src="/img/pong.png"
                alt="Pong background"
                class="block max-w-full max-h-full object-contain"
              />
              <img id="ball"  src="/img/ball.png"  class="absolute" />
              <img id="left-bar"  src="/img/bar_left.png"  class="absolute" />
              <img id="right-bar" src="/img/bar_left.png" class="absolute" />
            </div>


        `;
      }
    },
    {
        path: "/auth",
        title: "Authentication",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
	<div class="flex m-auto gap-8 w-4/5">
		<!-- Login Form -->
		<form id="form-login" class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
			<h2 class="text-white text-2xl mb-4">Login</h2>
		
			<div id="form-login-error" class="error-message-login text-red-500 text-sm mb-2"></div>
		
			<label for="username-login" class="text-white">Username:</label>
			<input type="text" id="username-login" aria-describedby="error-username-login" required
				class="p-2 mb-3 rounded border border-gray-300" />
		
			<label for="password-login" class="text-white">Password:</label>
			<input type="password" id="password-login" aria-describedby="error-password-login" required
				class="p-2 mb-4 rounded border border-gray-300" />
		
			<button type="submit" id="submit-login" class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer">
				Login
			</button>
		</form>
	
		<!-- Register Form -->
		<form id="form-register" class="flex flex-col w-1/2 bg-gray-700 p-6 rounded-lg border border-gray-600">
			<h2 class="text-white text-2xl mb-4">Register</h2>
			<div id="form-register-error" class="error-message-register text-red-500 text-sm mb-2"></div>
	
			<label for="username-register" class="text-white">Username:</label>
			<input type="text" id="username-register" required
					class="p-2 mb-3 rounded border border-gray-300" />
	
			<label for="password-register" class="text-white">Password:</label>
			<input type="password" id="password-register" required
					class="p-2 mb-3 rounded border border-gray-300" />
	
			<label for="cpassword" class="text-white">Confirm Password:</label>
			<input type="password" id="cpassword" required
					class="p-2 mb-4 rounded border border-gray-300" />
	
			<input type="submit" id="submit-register" value="Register"
				   class="bg-blue-600 hover:bg-blue-800 text-white py-2 rounded cursor-pointer" />
		</form>
	</div>
	
	<div class="w-1/5 m-auto mt-6 flex justify-center">
		<a href="${ft_url}"
		   target="_blank" 
		   class="bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded cursor-pointer text-center flex items-center gap-2">
		   <img src="https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png" alt="42 logo" class="w-6 h-6" />
		   Login/Register with 42 OAuth
		</a>
	</div>
	
	<div class="w-1/5 m-auto mt-6 flex justify-center">
		<a href="${google_url}"
		   target="_blank" 
		   class="bg-red-600 hover:bg-red-800 text-white py-2 px-6 rounded cursor-pointer text-center flex items-center gap-2">
		   Login/Register with Google OAuth
		</a>
	</div>
	
	<!-- 2FA Popup -->
	<div id="popup-2fa" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
	  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
		<h2 class="text-xl font-semibold mb-4 text-gray-800">Vérification 2FA requise</h2>
		
		<p class="mb-2 text-sm text-gray-600">Veuillez entrer votre code d'authentification à deux facteurs pour continuer.</p>
	
		<div id="popup-2fa-error" class="text-red-600 text-sm mb-2"></div>
		
		<input type="text" id="popup-2fa-code" placeholder="Code 2FA" class="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring focus:ring-blue-300">
	
		<div class="flex justify-end space-x-2">
		  <button onclick="document.getElementById('popup-2fa').classList.add('hidden');" class="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400">Annuler</button>
		  <button id="submit-2fa" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800">Valider</button>
		</div>
	  </div>
	</div>`;
        }
    },
    {
        path: "/2fa/create",
        title: "2FA create",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
			<!-- 2FA Toggle -->
	<div id="toggle-2fa-popup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
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
				id="2fa-code"
				type="text"
				placeholder="Entrez le code 2FA"
				class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<input
				id="2fa-password"
				type="password"
				placeholder="Mot de passe (non requis si vous n'utilisez pas transcendence pour la connexion)"
				class="w-full px-4 py-2 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<!-- Bouton de validation -->
		<button
				id="2fa-submit"
				type="submit"
				class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
		>
				Vérifier
		</button>
			</div>
	</div>`;
        }
    },
    {
        path: "/2fa/remove",
        title: "2FA remove",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
			<!-- 2FA Remove -->
	<div id="remove-2fa-popup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
	  <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
		<!-- Titre -->
		<h2 class="text-2xl font-semibold text-center text-gray-800">Suppression de la vérification en 2 étapes</h2>
	
		<!-- Zone de texte pour le code -->
		<input
				id="2fa-code-remove"
				type="text"
				placeholder="Entrez le code 2FA"
				class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<input
				id="2fa-password-remove"
				type="password"
				placeholder="Mot de passe (non requis si vous n'utilisez pas transcendence pour la connexion)"
				class="w-full px-4 py-2 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<!-- Bouton de validation -->
		<button
				id="2fa-submit-remove"
				type="submit"
				class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
		>
				Vérifier
		</button>
			</div>
	</div>`;
        }
    },
    {
        path: "/2fa",
        title: "2FA",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
	<div id="2fa" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
	  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
		<h2 class="text-xl font-semibold mb-4 text-gray-800">Vérification 2FA requise</h2>
		
		<p class="mb-2 text-sm text-gray-600">Veuillez entrer votre code d'authentification à deux facteurs pour continuer.</p>
	
		<div id="popup-2fa-error" class="text-red-600 text-sm mb-2"></div>
		
		<input type="text" id="2fa-code" placeholder="Code 2FA" class="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring focus:ring-blue-300">
	
		<div class="flex justify-end space-x-2">
		  <button id="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800">Valider</button>
		</div>
	  </div>
	</div>`;
        }
    },
    {
        path: "/settings",
        title: "Settings",
        template: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return `
	<div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Paramètres du compte</h2>

    <!-- Formulaire pour changer de pseudo -->
    <form class="mb-6">
      <div class="mb-4">
        <label for="username" class="block text-gray-700 font-medium mb-2">Nouveau pseudo</label>
        <div id="error-username" class="text-red-500 text-sm mb-2"></div>
        <input type="text" id="username" name="username"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="button" id="submit-username"
              class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
        Changer le pseudo
      </button>
    </form>

    <!-- Formulaire pour changer de mot de passe -->
    <form class="mb-6">
      <div id="error-password" class="error-message-password text-red-500 text-sm mb-2"></div>
      <div class="mb-4">
        <label for="current_password" class="block text-gray-700 font-medium mb-2">Mot de passe actuel</label>
        <input type="password" id="current_password" name="current_password"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-4">
        <label for="new_password" class="block text-gray-700 font-medium mb-2">Nouveau mot de passe</label>
        <input type="password" id="new_password" name="new_password"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-4">
        <label for="confirm_new_password" class="block text-gray-700 font-medium mb-2">Confirmer le nouveau mot de passe</label>
        <input type="password" id="confirm_new_password" name="confirm_new_password"
               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="button" id="submit-new-password"
              class="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600">
        Changer le mot de passe
      </button>
    </form>
    
	<!-- Checkbox pour activer/désactiver l'A2F -->
    <div>
		<label for="toggle-2fa" class="text-gray-700 font-medium">Activer l'A2F</label>
		<input type="checkbox" id="toggle-2fa">
	</div>	
	
	 <button
		id="logout"
		type="button"
		class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
		>
				Logout
	</button>
  </div>
 

  
	<!-- 2FA Toggle -->
	<div id="toggle-2fa-popup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
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
				id="2fa-code"
				type="text"
				placeholder="Entrez le code 2FA"
				class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<input
				id="2fa-password"
				type="password"
				placeholder="Mot de passe (non requis si vous n'utilisez pas transcendence pour la connexion)"
				class="w-full px-4 py-2 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<!-- Bouton de validation -->
		<button
				id="2fa-submit"
				type="submit"
				class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
		>
				Vérifier
		</button>
			</div>
	</div>

	<!-- 2FA Remove -->
	<div id="remove-2fa-popup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center hidden z-50">
	  <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
		<!-- Titre -->
		<h2 class="text-2xl font-semibold text-center text-gray-800">Suppression de la vérification en 2 étapes</h2>
	
		<!-- Zone de texte pour le code -->
		<input
				id="2fa-code-remove"
				type="text"
				placeholder="Entrez le code 2FA"
				class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<input
				id="2fa-password-remove"
				type="password"
				placeholder="Mot de passe (non requis si vous n'utilisez pas transcendence pour la connexion)"
				class="w-full px-4 py-2 border text-sm border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		
		<!-- Bouton de validation -->
		<button
				id="2fa-submit-remove"
				type="submit"
				class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
		>
				Vérifier
		</button>
			</div>
	</div>`;

			}
		},
		{
			path: "/tournament",
			title: "Tournament",
			template: async () => {
				await new Promise(resolve => setTimeout(resolve, 300));
				return `
				
	<div id="tournament-info" class="fixed top-4 right-4 bg-gray-100 p-4 rounded shadow-md w-64">
	  <h3 class="text-lg font-semibold mb-2">Tournament Info</h3>
	  <p><strong>Name:</strong> <span id="tournament-name-display">---</span></p>
	  <div class="mt-2">
		<strong>Players:</strong>
		<ul id="players-list" class="list-disc list-inside max-h-40 overflow-auto text-sm text-gray-700"></ul>
	  </div>
	  <button id="start-tournament" class="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200">Start</button>
	  <button id="leave-tournament" class="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200">Leave</button>
	</div>

	<div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
    	<h2 class="text-2xl font-semibold mb-6 text-center">Formulaire</h2>
    	<form class="space-y-4">
      <div>
        <label for="tournament-name" class="block text-sm font-medium text-gray-700">Enter tournament name:</label>
        <input type="text" id="tournament-name" name="tournament-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div>
        <label for="tournament-size" class="block text-sm font-medium text-gray-700">Choose your tournament size:</label>
        <select id="tournament-size" name="tournament-size" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="4">4</option>
          <option value="8">8</option>
        </select>
      </div>
      <div>
        <button type="submit" id="tournament-submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">Create</button>
      </div>
     </form>
  	</div>
	<div id="tournaments" class="bg-white p-8 rounded shadow-md w-full max-w-sm">
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
