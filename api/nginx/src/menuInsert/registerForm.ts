/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   registerForm.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 13:11:24 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/12 11:11:00 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const registerForm = () => `
                <form id="register"  class="flex responsive-form-register flex-col items-center justify-center">
                  
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                <div id="form-register-error" class="error-message-register text-red-500 text-sm mb-2"></div>
                <input
                    id="username-register"
                    type="text"
                    placeholder="Username"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                  <input
                    id="password-register"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                  <input
                    id="cpassword"
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                    <button type="submit" id="submit-register" class="responsive-text responsive-case-submit text-black">Register</button>
                    <button type="button" id="loginBtn" class="text-white responsive-text relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300 ">LOGIN</button>
                </form>`