export const newPseudo = () => `
<form id="newPseudo" class="flex responsive-form-login flex-col items-center justify-center">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                <div id="error-username" class="error-message"></div>
                <div id="success-username" class="succes-message"></div>

                <input
                    id="username"
                    type="text"
                    placeholder="Enter New Pseudo"
                    class="responsive-placeholder responsive-case-login responsive-case responsive-text"
                  />
                  <button type="submit" id="submit-username" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="pseudoReturnBtn" class="text-white responsive-text ">Return</button>
                  </form>
`

