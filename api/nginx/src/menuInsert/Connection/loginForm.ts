const hostname = window.location.hostname

let redirectUri = encodeURIComponent(`https://redirectmeto.com/http://${hostname}:8080/api/auth/callback/42`);
const ft_url = "https://api.intra.42.fr/oauth/authorize?" +
	"client_id=u-s4t2ud-04dc53dfa151b3c595dfa8d2ad750d48dfda6fffd8848b0e4b1d438b00306b10&" +
	`redirect_uri=${redirectUri}&` +
	"response_type=code"

redirectUri = encodeURIComponent(`https://redirectmeto.com/http://${hostname}:8080/api/auth/callback/google`);
const google_url = "https://accounts.google.com/o/oauth2/v2/auth?" +
	"client_id=570055045570-c95opdokftohj6c4l7u9t7b46bpmnrkl.apps.googleusercontent.com&" +
	`redirect_uri=${redirectUri}&` +
	"response_type=code&" +
	"scope=profile%20email&" +
	"access_type=offline&" +
	"include_granted_scopes=true&" +
	"prompt=login"

export const loginForm = () => `
                <form id="login"  class="flex responsive-form-login flex-col items-center justify-center">
                
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                <div id="form-login-error" class="error-message"></div>

                  <input
                    id="username-login"
                    type="text"
                    placeholder="Username"
                    class="responsive-case-login responsive-placeholder responsive-case responsive-text"
                  />
                  <input
                    id="password-login"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-login responsive-placeholder responsive-case responsive-text"
                  />
                    
                    <button id="submit-login" type="submit" class="responsive-text responsive-case-submit text-black gap-4">Login</button>
                    
                    <div class="flex flex-row h-[5%] w-full justify-center items-center">
                      <a href="${ft_url}"
                        class="flex object-contain responsive-text responsive-case-submit-42 text-white mr-4 px-[15px] py-[5px]">
                       	  Login/Register with 42
                      </a>
                        <a href="${google_url}"
                        class="flex object-contain responsive-text responsive-case-submit-google text-white px-[15px] py-[5px]">
                          Login/Register with Google
                      </a>
                    </div>
                    
                    <button type="button" id="registerBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">REGISTER</button>
                </form>`
