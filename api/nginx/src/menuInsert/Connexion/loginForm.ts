/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loginForm.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afavier <afavier@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 13:11:22 by mtbanban          #+#    #+#             */
/*   Updated: 2025/08/03 16:45:09 by afavier          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//a tester avec un gap-4 pour que le bouton register soit au meme niveau que le bouton login
export const loginForm = () => `
                <form id="login"  class="flex responsive-form-login flex-col items-center justify-center">
                
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                <div id="form-login-error" class="error-message-login text-red-500 text-sm mb-2"></div>

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
                      <button id="submit-42" class="flex object-contain responsive-text responsive-case-submit-42-google text-blue-500 gap-4"><img class="h-6 w-6" src="https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png"/>Login/Register with 42 OAuth</button>
                      <button id="submit-google" class="flex object-contain responsive-text responsive-case-submit-42-google text-red-500 gap-4">Login/Register with Google OAuth</button>
                    </div>
                    <button type="button" id="registerBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">Register</button>
                </form>`
