export const newPass = () => `
<form id="newPass" class="flex responsive-form-register flex-col items-center justify-center">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                <div id="error-password" class="error-message"></div>
                <div id="success-password" class="succes-message"></div>
                <input
                    id="current_password"
                    type="password"
                    placeholder="Enter Current Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                <input
                    id="new_password"
                    type="password"
                    placeholder="Enter New Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                <input 
                    id="confirm_new_password"
                    type="password"
                    placeholder="Confirm New Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                  <button type="submit" id="submit-new-password" class="responsive-text responsive-case-submit text-black">Valider</button>
                  <button type="button" id="passReturnBtn" class="text-white responsive-text ">Return</button>
                  </form>`