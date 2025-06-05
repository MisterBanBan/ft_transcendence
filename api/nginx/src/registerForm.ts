/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   registerForm.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 13:11:24 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/05 15:06:17 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const registerForm = () => `
                <form id="register"  class="flex responsive-form-register flex-col items-center justify-center">
                  
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                
                <input
                    type="text"
                    placeholder="Username"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="responsive-case-register responsive-placeholder responsive-case"
                  />
                    <button type="submit" class="responsive-case-register responsive-text responsive-case text-white">Login</button>
                    <button type="button" id="loginBtn" class="text-white responsive-text ">LOGIN</button>
                </form>`