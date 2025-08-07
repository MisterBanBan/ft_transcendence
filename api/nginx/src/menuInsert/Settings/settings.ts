export const settings = () => `
    <form id="paramUser" class="flex responsive-form-login gap-4 flex-col items-center justify-center">
    
    <button type="button" id="newPseudo" class="responsive-text-parametre">Change Nickname</button>
    <button type="button" id="newPass" class="responsive-text-parametre">Change Password</button>
    <p class="font-omori text-white text-2xl">Active or Deactivate 2FA</p>
    <input type="checkbox" class="responsive-text-parametre" id="toggle-2fa">

    <button type="button" id="settingsReturnBtn" class="text-white responsive-text-parametre">Return</button>

    
    </form>
`