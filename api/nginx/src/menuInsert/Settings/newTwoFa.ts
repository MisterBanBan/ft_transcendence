export const newTwoFa = () => `
<div id="toggle-2fa-popup" class="flex responsive-form-login flex-col items-center justify-center gap-2">
          <div class="flex justify-center ">
              <div class="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
            <img id="qrCodeImage" src="" alt="QR Code" />
              </div>
          </div>
          <div id="error-add-2fa" class="error-message"></div>
          <p class="text-white font-omori text-center text-xl">
              Scan the QR code with your authenticator app.
          </p>                 
                  <input
                    id="2fa-code"
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-2fa responsive-case responsive-text"
                  />
                  <input
                    id="2fa-password"
                    type="password"
                    placeholder="Enter Password"
                    class="responsive-placeholder responsive-case-2fa responsive-case responsive-text"
                  />
                  <button type="submit" id="2fa-submit" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="2faReturnBtn" class="responsive-text-profile ">Return</button>
                  </div>
`