export const removeTwoFa = () => `
<div id="popup2fa" class="flex responsive-form-login flex-col items-center justify-center">
                  <div id="error-remove-2fa" class="error-message"></div>
                  <input
                    id="2fa-code-remove"
                    type="text"
                    placeholder="Enter 2FA code"
                    class="responsive-placeholder responsive-case-2fa responsive-case responsive-text"
                  />
                  <input
                    id="2fa-password-remove"
                    type="password"
                    placeholder="Enter Password"
                    class="responsive-placeholder responsive-case-2fa responsive-case responsive-text"
                  />
                  <button type="submit" id="2fa-submit-remove" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="2faReturnBtn" class="text-white responsive-text ">Return</button>
                  </div>
`