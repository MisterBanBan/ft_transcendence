import {getUser} from '../../route/user-handler.js';

export const picture = () => {
    const currentUser = getUser();

    let fullAvatarPath: string = '/uploads/last_airbender.jpg'

    if (currentUser && currentUser.avatar_url) {
        fullAvatarPath = currentUser.avatar_url.startsWith('/') ? currentUser.avatar_url : `/uploads/${currentUser.avatar_url}`;
    }

    return `
    <div class="w-full h-full flex flex-col relative">
        <div class="w-full h-[46%] flex items-center justify-center relative">
            <button
                type="button"
                id="picture-profile"
                class="w-[70%] h-[68%] mt-3 mr-9 bg-[url(${fullAvatarPath})] bg-[length:100%_100%] bg-no-repeat bg-center z-20 pointer-events-auto flex items-center justify-center rounded-full hover:scale-105 transition-transform duration-200 cursor-pointer"
                style='background-image: url("${fullAvatarPath}?t=${Date.now()}"); background-size: 100% 100%; background-repeat: no-repeat; background-position: center center;'
                title="Click to change profile picture"
            ></button>
        </div>
        <div class="w-full h-[54%] flex  relative">
            <button type="button" id="power"
             class="absolute top-[54%] left-[28%] w-[30%] h-[30%] bg-[url('/img/powerOf.png')] bg-contain bg-no-repeat">
        </button>
        </div>

    </div>
    `;
};
