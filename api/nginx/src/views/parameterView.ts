import { parametre } from "../menuInsert/parametre.js";
import { viewManager } from "./viewManager.js";
import { Logout } from "../auth/logout.js";
import { Component } from "../route/component.js";
import {router} from "../route/router.js";
import {getUser} from "../route/user-handler.js";
import {fetchUserProfileData} from "../menuInsert/Profile/userProfilData.js";

export class parameterView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private componentStorage?: Component;

    private handleReturn = () => {router.navigateTo('/game', this.viewManager);};
    private handleProfile = () => this.loadProfile();
	private handleParametre = () => router.navigateTo("/game#parametre", this.viewManager);
    private handleFriendsList = () => router.navigateTo("/game#friendsList", this.viewManager);
    private handleSettings = () => router.navigateTo("/game#settings", this.viewManager);
    private handleLogout = () => router.navigateTo("/game#login", this.viewManager);

    

    constructor(container: HTMLElement, viewManager: viewManager) {
        this.container = container;
        this.viewManager = viewManager;
    }

    public init(): void {
        this.componentStorage?.destroy();
        this.container.innerHTML = '';
        this.container.innerHTML = parametre();
        this.componentStorage = new Logout();
        this.componentStorage.init();
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

            if (userData) {
                router.navigateTo(`/game?username=${currentUser.username}#user`, this.viewManager)
            } else {
                this.container.innerHTML = '<div class="h-full w-full flex items-center justify-center"><p class="text-white text-red-500">Error loading profile</p></div>';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.container.innerHTML = '<div class="h-full w-full flex items-center justify-center"><p class="text-white text-red-500">Error loading profile</p></div>';
        }
    }

    public destroy(): void {
        this.componentStorage?.destroy();
        document.getElementById('profile')?.removeEventListener('click', this.handleProfile);
        document.getElementById('friendsList')?.removeEventListener('click', this.handleFriendsList);
        document.getElementById('settings')?.removeEventListener('click', this.handleSettings);
        document.getElementById('logout')?.removeEventListener('click', this.handleLogout);
        document.getElementById('parametreReturnBtn')?.removeEventListener('click', this.handleReturn);
        document.getElementById('profileReturnBtn')?.removeEventListener('click', this.handleParametre);
        
    }
}