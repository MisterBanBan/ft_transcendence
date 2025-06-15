/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loginForm.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 13:11:22 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/13 18:13:00 by mtbanban         ###   ########.fr       */
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
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                  <input
                    id="password-login"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                    <button id="submit-login" type="submit" class="responsive-text responsive-case-submit text-black gap-4">Login</button>
                    <button type="button" id="registerBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">Register</button>
                </form>`
