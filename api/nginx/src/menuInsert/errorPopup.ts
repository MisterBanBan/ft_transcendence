export const errorPopup = (text: string) => `
<div id="error-popup" 
     style="position: absolute; z-index: 2;" 
     class="h-[20%] w-[40%] responsive-case responsive-text flex flex-col items-center justify-center bg-black/80">
    
    <div class="w-full text-center">
        ${text}
    </div>
    
    <button class="responsive-case mb-2" onclick="this.parentElement.remove()"> 
        Close 
    </button>
</div>
`