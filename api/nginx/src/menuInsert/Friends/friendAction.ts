export const friendActionTemplate = (x: number, y: number, friendId: string) => `
  <div id="friend-popup" style="position:fixed; top:max(10px, ${y - 10}px); left:${x}px; z-index:50;"
       class="w-42 max-w-[64vw] h-30 max-h-[52vh] sm-h-[20] bg-white/90 flex flex-col items-center justify-center rounded-lg overflow-auto shadow-lg">
    <div class="flex flex-col gap-2 w-full h-full px-2 py-2 break-words whitespace-normal overflow-auto">
      <button id="removeFriend" class="w-full text-black break-words">Remove</button>
      <button id="friendProfile"  data-friend-id="${friendId}" class="friends-profile-btn w-full text-black">Profile</button>
    </div>
  </div>
`;