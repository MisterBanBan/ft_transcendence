/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   newTwoFa.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/06 18:52:33 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/25 09:53:07 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const newTwoFa = () => `
<div id="toggle-2fa-popup" class="flex responsive-form-login flex-col items-center justify-center">
<div class="flex justify-center">
				<div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
			<img id="qrCodeImage" src="" alt="QR Code" />
				</div>
		</div>
    <p class="text-gray-600 text-center text-sm">
				Scannez le QR code avec votre application d’authentification, ou entrez le code manuellement si vous l’avez déjà configurée.
		</p>                 
                  <input
                    id="2fa-code"
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-login responsive-case"
                  />
                  <input
                    id="2fa-password"
                    type="text"
                    placeholder="Enter Password"
                    class="responsive-placeholder responsive-case-login responsive-case"
                  />
                  <button type="submit" id="2fa-submit" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`