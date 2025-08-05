import { parametre } from "../menuInsert/parametre.js";
import { viewManager } from "./viewManager.js";
import { profile } from "../menuInsert/Profile/profile.js";
import { Logout } from "../auth/logout.js";
import { Component } from "../component.js";
import {router} from "../router.js";
import {getUser} from "../user-handler.js";
import {fetchUserProfileData} from "../menuInsert/Profile/userProfilData.js";

export class parameterView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private picture: HTMLElement;

    private handleReturn = () => {console.log('clicked');router.navigateTo('/game');};
    private handleProfile = () => this.loadProfile();
	private handleParametre = () => router.navigateTo("/game#parametre");
    private handleFriendsList = () => router.navigateTo("/game#friendsList");
    private handleSettings = () => router.navigateTo("/game#settings");
    private handleLogout = () => router.navigateTo("/game#login");

    

    constructor(container: HTMLElement, viewManager: viewManager, picture: HTMLElement) {
        this.container = container;
        this.viewManager = viewManager;
        this.picture = picture;
        //this.videoMain = videoMain;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = parametre();
        const logout = new Logout();
        logout.init();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        document.getElementById('profile')?.addEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.addEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.addEventListener('click', this.handleSettings);
        document.getElementById('logout')?.addEventListener('click', this.handleLogout);
       document.getElementById('parametreReturnBtn')?.addEventListener('click', this.handleReturn);
    }

    private async loadProfile() {
        try {
            this.container.innerHTML = '<div class="h-full w-full flex items-center justify-center"><p class="text-white">Loading profile...</p></div>';

            const currentUser = await getUser();

            if (!currentUser || !currentUser.id) {
                throw new Error('User not logged in or user ID missing');
            }

            const userId = String(currentUser.id);
            const userData = await fetchUserProfileData(userId);
            console.log(userData);

            if (userData) {
                this.container.innerHTML = profile(userData.profile, userData.matches);
                document.getElementById('profileReturnBtn')?.addEventListener('click', this.handleParametre);
            } else {
                this.container.innerHTML = '<div class="h-full w-full flex items-center justify-center"><p class="text-white text-red-500">Error loading profile</p></div>';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.container.innerHTML = '<div class="h-full w-full flex items-center justify-center"><p class="text-white text-red-500">Error loading profile</p></div>';
        }
    }

    public destroy(): void {
        document.getElementById('profile')?.removeEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.removeEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.removeEventListener('click', this.handleSettings);
        document.getElementById('logout')?.removeEventListener('click', this.handleLogout);
        document.getElementById('parametreReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('profileReturnBtn')?.removeEventListener('click', this.handleParametre);
        
    }
}