import { parametre } from "../menuInsert/parametre.js";
import { viewManager } from "./viewManager.js";
import { profile } from "../menuInsert/Profile/profile.js";
import { Logout } from "../auth/logout.js";
import { Component } from "../component.js";
import {router} from "../router.js";

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
    
    private loadProfile() {
        this.container.innerHTML = '';
        this.container.innerHTML = profile();
        document.getElementById('profileReturnBtn')?.addEventListener('click', this.handleParametre);
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