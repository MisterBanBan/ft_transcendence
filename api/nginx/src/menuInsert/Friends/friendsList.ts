export const friendsList = () => `
    <div id="friendsList" class="h-full w-full flex items-center justify-center">
    <div class="h-[85%] w-[90%] flex flex-col items-center justify-center bg-black/60">
        <div class="flex flex-row items-center justify-center  h-full w-full">
            <div id="divLeft"  class="flex flex-col items-center justify-center h-full w-[30%]">
                
            </div>
        
            <div class="w-px h-full bg-white mx-4"></div>

            <div id="infos" class="flex flex-col items-center justify-center h-[80%] w-[70%] responsive-text">
                <div id="first" class="flex flex-row items-center justify-center h-[15%] w-[70%]">
                    <div class="flex flex-row justify-center w-full h-full">
                        <button id="friends" class="text-white responsive-text-parametre">Friends</button>
                    </div>
                    <div class="flex flex-row  justify-center w-full h-full ">
                        <button id="invites" class="text-white responsive-text-parametre">Invites</button>
                    </div>
                </div>
                <div id="dynamic-popup" class=" h-[70%] w-[70%]">
                    
                </div>
                <div class="w-[70%] h-[30%] items-center justify-center flex flex-col">
                    <button type="button" id="friendReturnBtn" class="text-white responsive-text-parametre ">Return</button>
                </div>
            </div>
        </div>
        </div>
    </div>
`

