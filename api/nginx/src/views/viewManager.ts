import { SettingsView } from './settingsView.js';
import { getUser } from '../route/user-handler.js';
import { parameterView } from './parameterView.js';
import { friendsView } from './friendsView.js';
import { loginView } from './loginView.js';
import { registerView } from './registerView.js';
import { Component } from '../route/component.js';
import { game } from '../menuInsert/game.js';
import { picture } from '../menuInsert/Picture/picture.js';
import { tournamentView } from './tournamentView.js';
import {router} from "../route/router.js";
import {clearTournamentSocket} from "../tournament/tournamentsHandler.js"
import { ProfilePictureManager } from '../menuInsert/Picture/profilPictureManager.js';
import { selectAnimation } from '../IntroProject/selectAnimat.js';
import {profileView} from "./profileView.js";
import {page404} from "../menuInsert/404.js";
import {ApiUtils} from "../relationship/apiUtils.js";

declare const io: any;

export class viewManager implements Component {
    private activeView : Component | null = null;
    private profilePictureManager: ProfilePictureManager | null = null;
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private readonly formsContainer: HTMLElement;
    private readonly formspicture: HTMLElement;
    private options!: HTMLElement[];
    private cursor!: HTMLVideoElement;
    private selectedIdx: number = 0;
    private select?: selectAnimation;
    private activeViewName: string | null = null;
    private readonly keydownHandler: (e: KeyboardEvent) => void;
    private socket = io(`/`, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        path: "/wss/users-status"
    });

    public oldPaths: string[] = [];

    constructor(videoId: string, containerId: string, authBtnId: string) {

        const video = document.getElementById(videoId) as HTMLVideoElement;
        if (!video) throw new Error('Video element not found');
        this.videoMain = video;

        const containerForm = document.getElementById(containerId);
        if (!containerForm) throw new Error('Form wrapper not found');
        this.containerForm = containerForm;

        const authBtn = document.getElementById(authBtnId);
        if (!authBtn) throw new Error('Auth button not found');
        this.authBtn = authBtn;

        const formsContainer = document.getElementById('dynamic-content');
        if (!formsContainer) throw new Error('Form Container not found');
        this.formsContainer= formsContainer;

        const formspicture = document.getElementById('picture');
        if (!formspicture) throw new Error('Form picture not found');
        this.formspicture = formspicture;

        this.keydownHandler = this.handleKeydown.bind(this);

        this.userLog();
        this.initializeProfilePictureManager();

        if (getUser()) {
            this.formspicture.innerHTML = picture();

            setTimeout(() => {
                if (this.profilePictureManager) {
                    this.profilePictureManager.reinitialize();
                }
            }, 100);
        }

        const powerOff = document.getElementById('power');
        if (powerOff)
            powerOff.addEventListener('click',  () => {
                const onAnimEnd = (e: AnimationEvent) => {
                    if (e.animationName === 'tvOff') {
                        this.containerForm.removeEventListener('animationend', onAnimEnd);
                        router.navigateTo('/chalet');
                    }
                };
                this.containerForm.addEventListener('animationend', onAnimEnd);
                this.containerForm.classList.add('tv-effect', 'off');
            });
    }

    public init(): void {

        window.addEventListener("resize", this.resize);
        this.videoMain.addEventListener("loadedmetadata", () => {
            this.resize();
        });
        this.resize();
        this.authBtn.addEventListener('click', this.authBtnHandler);
    }

    private initializeProfilePictureManager(): void {
        const currentUser = getUser();
        if (currentUser) {
            this.profilePictureManager = new ProfilePictureManager();
            this.profilePictureManager.reinitialize()
        }
    }

    private userLog()
    {
        if (!getUser())
            this.show("login");
        else
            this.show("game");
    }

    public show(viewName: string) {
        if (this.activeViewName === 'game') {
            this.destroyGameListeners();
        }
        this.activeView?.destroy();

        const hash = window.location.hash;
        if (hash) {
            viewName = hash.replace('#', '')
        }

        if (viewName !== "login" && viewName !== "register")
        {
            if (!getUser())
                router.navigateTo("/game#login")
        }

        if (viewName !== "tournament")
            clearTournamentSocket();

        console.info(`Redirecting to ${viewName}`)

        this.formsContainer.innerHTML = '';

        let newView: Component | null = null;

        const params = new URLSearchParams(window.location.search)

        switch (viewName) {
            case 'game':
                this.formsContainer.innerHTML = game();
                this.select = new selectAnimation('cursor-video');
                this.select.startAnimation();

                    try {
                        this.setupGameMenu();
                    } catch (error) {
                        console.error("Error setting up game menu:", error);
                    }
                break;
            case 'login':
                if (getUser())
                    router.navigateTo("/game", this)
                else {
                    const token = params.get("token")
                    newView = new loginView(this.formsContainer, this, token);
                }
                break;
            case 'register':
                if (getUser())
                    router.navigateTo("/game", this)
                else
                    newView = new registerView(this.formsContainer, this.formspicture, this);
                break;
            case 'settings':
                const setting = params.get("setting")
                newView = new SettingsView(this.formsContainer, this, setting);

                const popup = params.get("popup")
                if (popup)
                    ApiUtils.showAlert(decodeURI(popup))
                break;
            case 'tournament':
                newView = new tournamentView(this.formsContainer, this);
                break;
            case 'parametre':
                newView = new parameterView(this.formsContainer, this);
                break;
            case 'friendsList':
                newView = new friendsView(this.formsContainer, this);
                break;
            case 'user':
                const username = params.get("username")
                newView = new profileView( this, username);
                break;
            default:
                this.formsContainer.innerHTML = '';
                this.formsContainer.innerHTML = page404();
        }

        this.activeView = newView;
        this.activeViewName = viewName;
        if (this.activeView)
            this.activeView.init();
    }

    public destroyGameListeners(): void {
        document.removeEventListener('keydown', this.keydownHandler);
        this.select?.stopAnimation();
    }

    public setPicture(): void {
        this.formspicture.innerHTML = picture()
    }

    private authBtnHandler = () => {
        if (!getUser()) {
            router.navigateTo("/game#login", this)
        } else {
            router.navigateTo("/game#parametre", this)
        }
    };

    private updateCursor() {
        if (!this.options.length) return;
        const firstOption = this.options[0];
        const selected = this.options[this.selectedIdx];
        const offset = selected.offsetTop - firstOption.offsetTop;
        this.cursor.style.top = offset + "px";


        this.options.forEach((opt, i) => {
            opt.classList.toggle('selected', i === this.selectedIdx);
        });
    }

    private selectOption() {
        if (!this.options.length) return;
        const selected = this.options[this.selectedIdx];
        if (selected.id === 'Offline') {
            router.navigateTo("/Pong?mode=local");
        }
        if (selected.id === 'Online') {
            router.navigateTo("/Pong?mode=online");
        }
        if (selected.id === 'IA') {
            router.navigateTo("/Pong?mode=ai");
        }
        if (selected.id === 'Tournament') {
            router.navigateTo("/game#tournament", this)
        }
    }

    private handleKeydown(e: KeyboardEvent) {
        if (!this.options.length) return;
        if (e.key === "ArrowDown") {
            this.selectedIdx = (this.selectedIdx + 1) % this.options.length;
            this.updateCursor();
        } else if (e.key === "ArrowUp") {
            this.selectedIdx = (this.selectedIdx - 1 + this.options.length) % this.options.length;
            this.updateCursor();
        } else if (e.key === "Enter") {
            this.selectOption();
        }
    }

    private setupGameMenu() {
        this.options = Array.from(document.querySelectorAll('.menu-option')) as HTMLElement[];
        if (!this.options.length) {
            console.error('No menu options found');
            return;
        }
        const cursor = document.getElementById('cursor-video') as HTMLVideoElement;
        if (!cursor) throw new Error('Cursor video not found');
        this.cursor = cursor;
        this.updateCursor();
        this.options.forEach(opt => {
            opt.addEventListener('click', this.menuClickHandler);
        });

        document.removeEventListener('keydown', this.keydownHandler);
        document.addEventListener('keydown', this.keydownHandler);
    }
    
    private menuClickHandler = (event: Event) => {
        const opt = event.currentTarget as HTMLElement;
        const idx = this.options.indexOf(opt);
        if (idx !== -1) {
            this.selectedIdx = idx;
            this.updateCursor();
            this.selectOption();
        }
    }


    private resize = () => {
        const rect = this.videoMain.getBoundingClientRect();

        this.containerForm.style.left = `${(rect.left )}px`;
        this.containerForm.style.top = `${(rect.top )}px`;
        this.containerForm.style.width = `${rect.width }px`;
        this.containerForm.style.height = `${rect.height}px`;
        this.containerForm.style.position = "absolute";
    }

    public destroy(): void {

        window.removeEventListener('resize', this.resize);
        this.authBtn.removeEventListener('click', this.authBtnHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        if (this.profilePictureManager) {
            this.profilePictureManager.destroy();
            this.profilePictureManager = null;
        }
        if (this.options) {
            this.options.forEach(opt => {
                opt.removeEventListener('click', this.menuClickHandler);
            });
        }

        if (this.activeView)
            this.activeView.destroy();
        this.socket.disconnect();
    }
}