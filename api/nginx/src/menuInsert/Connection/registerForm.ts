export const registerForm = () => `
                <form id="register"  class="flex responsive-form-register flex-col items-center justify-center">
                  
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                <div id="form-register-error" class="error-message"></div>
                <input
                    id="username-register"
                    type="text"
                    placeholder="Username"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                  <input
                    id="password-register"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                  <input
                    id="cpassword"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case responsive-text"
                  />
                    <button type="submit" id="submit-register" class="responsive-text responsive-case-submit text-black">Register</button>
                    <button type="button" id="loginBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300 ">LOGIN</button>
                </form>`