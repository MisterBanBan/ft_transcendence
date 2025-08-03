import { getUser } from '../../user-handler.js';

interface UserWithAvatar {
    avatar_url?: string | { avatar_url: string } | undefined;
}

export const picture = () => {
    const currentUser = getUser() as UserWithAvatar;

    let avatarUrl: string = 'last_airbender.jpg';

    try {
        if (currentUser && (currentUser as any).avatar_url) {
            const rawAvatarUrl = (currentUser as any).avatar_url;

            if (typeof rawAvatarUrl === 'string') {
                avatarUrl = rawAvatarUrl;
                console.log('Used string avatar_url:', avatarUrl);
            } else if (typeof rawAvatarUrl === 'object' && rawAvatarUrl.avatar_url) {
                avatarUrl = rawAvatarUrl.avatar_url;
                console.log('Used nested avatar_url:', avatarUrl);
            } else {
                console.log('Unknown avatar_url format, using default');
                avatarUrl = 'last_airbender.jpg';
            }
        }
    } catch (error) {
        console.error('Error processing avatar_url:', error);
        avatarUrl = 'last_airbender.jpg';
    }

    if (typeof avatarUrl !== 'string') {
        console.error('avatarUrl is not a string! Type:', typeof avatarUrl, 'Value:', avatarUrl);
        avatarUrl = 'last_airbender.jpg';
    }

    return `
    <div class="w-full h-full flex flex-col relative">
        <div class="w-full h-[46%] flex items-center justify-center relative">
            <button
                type="button"
                id="picture-profile"
                class="w-[65%] h-[68%] mt-4 mr-4 bg-[url(/uploads/${avatarUrl})] bg-[length:100%_100%] bg-white/60 bg-no-repeat bg-center z-20 pointer-events-auto flex items-center justify-center rounded-full hover:scale-105 transition-transform duration-200 cursor-pointer"
                title="Click to change profile picture"
            ></button>
        </div>

    </div>
    `;
};
