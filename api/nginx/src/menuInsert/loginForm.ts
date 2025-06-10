/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   loginForm.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mtbanban <mtbanban@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/05 13:11:22 by mtbanban          #+#    #+#             */
/*   Updated: 2025/06/05 15:06:12 by mtbanban         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export const loginForm = () => `
                <form id="login"  class="flex responsive-form-login flex-col items-center justify-center">
                
                
                <input type="text" name="fakeuser" style="position:absolute;top:-9999px">
                <input type="password" name="fakepass" style="position:absolute;top:-9999px">  
                
                
                <input
                    type="text"
                    placeholder="Username"
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    class="responsive-case-login responsive-placeholder responsive-case"
                  />
                    <button type="submit" class="responsive-case-login responsive-text responsive-case text-white">Login</button>
                    <button type="button" id="registerBtn" class="text-white responsive-text responsive-case-login relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white hover:after:w-full after:transition-all after:duration-300">Register</button>
                </form>`
