export const game = () => `
<div id="game" class="flex responsive-form-login flex-col items-center  justify-center">

  <div id="game-options" class="flex flex-col items-center justify-center mt-4 responsive-game-gap relative w-[40%] ">
    <div id="Offline" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">Offline</div>
    <div id="Online" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">Online</div>
    <div id="IA" class="menu-option  text-white responsive-text-parametre font-omori cursor-pointer">AI</div>
    <div id="Tournament" class="menu-option  text-white responsive-text-parametre font-omori mb-4 cursor-pointer">Tournament</div>

    <div id="cursor-video" 
           class="absolute right-[55%] top-0 bg-[url('/img/kodama_stop1.png')] responsive-video-game pointer-events-none bg-contain bg-no-repeat z-10;">
    </div>
  </div>
</div>

`
