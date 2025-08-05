import { SettingsView } from './settingsView.js';
import { getUser } from '../user-handler.js';
import { parameterView } from './parameterView.js';
import { friendsView } from './friendsView.js';
import { loginView } from './loginView.js';
import { registerView } from './registerView.js';
import { Component } from '../component.js';
import { game } from '../menuInsert/game.js';
import { picture } from '../menuInsert/Picture/picture.js';
import { tournamentView } from './tournamentView.js';
import {router} from "../router.js";
import {tournamentSocket} from "../tournaments.js"
import { ProfilePictureManager } from '../menuInsert/Picture/profilPictureManager.js';
import { selectAnimation } from '../selectAnimat.js';


export class viewManager implements Component {
    //private pictureContainer: HTMLElement;
    private activeView : Component | null = null;
    private profilePictureManager: ProfilePictureManager | null = null;
    private videoMain: HTMLVideoElement;
    private containerForm: HTMLElement;
    private authBtn: HTMLElement;
    private formsContainer: HTMLElement;
    private formspicture: HTMLElement;
    private options!: HTMLElement[];
    private cursor!: HTMLVideoElement;
    private selectedIdx: number = 0;
    private select?: selectAnimation;
    private activeViewName: string | null = null;
    private keydownHandler: (e: KeyboardEvent) => void;

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
        if (!formsContainer) throw new Error('Form wrapper not found');
        this.formsContainer= formsContainer;

        const formspicture = document.getElementById('picture');
        if (!formspicture) throw new Error('Form wrapper not found');
        this.formspicture = formspicture;

        this.keydownHandler = this.handleKeydown.bind(this);
        
        this.userLog();
        this.initializeProfilePictureManager();
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
            this.profilePictureManager = new ProfilePictureManager(currentUser.id.toString());
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
            else
            {
                this.formspicture.innerHTML = picture();
                const powerOf = document.getElementById('power');
                if(powerOf)
                    powerOf.addEventListener('click',  () => {
                    const onAnimEnd = (e: AnimationEvent) => {
                        if (e.animationName === 'tvOff') {
                            this.containerForm.removeEventListener('animationend', onAnimEnd);
                            router.navigateTo('/chalet');
                        }

    };
                        this.containerForm.addEventListener('animationend', onAnimEnd);
                        this.containerForm.classList.add('tv-effect', 'off');
                });
                setTimeout(() => {
                    if (this.profilePictureManager) {
                        this.profilePictureManager.reinitialize();
                    }
                }, 100);
            }
        }

        const params = new URLSearchParams(window.location.search);
        const leave = params.get("leave");
        if (leave && leave === "true")
            tournamentSocket.emit("leave");

        console.info(`Redirecting to ${viewName}`)

        this.formsContainer.innerHTML = '';
        //this.pictureContainer.innerHTML = '';

        let newView: Component | null = null;

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
                const currentUser = getUser();
                const setting = params.get("setting")
                if (currentUser) {
                    newView = new SettingsView(this.formsContainer, this, setting);
                } else {
                    console.error("No user is currently authenticated.");
                }
                break;
            case 'tournament':
                newView = new tournamentView(this.formsContainer, this);
                break;
            case 'parametre':
                newView = new parameterView(this.formsContainer, this, this.formspicture);
                break;
            case 'friendsList':
                newView = new friendsView(this.formsContainer, this);
                break;
            default:
                console.error(`View "${viewName}" is not implemented.`);
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

    // private wordAnimation() {
    //     const friends = document.querySelectorAll('.friend');
    //     friends.forEach(div => {
    //         const word = div.textContent?.trim() || '';
    //         div.textContent = '';
    //         word.split('').forEach((letter, idx) => {
    //         const span = document.createElement('span');
    //         span.textContent = letter;
    //         span.style.transitionDelay = `${idx * 0.1}s`;
    //         div.appendChild(span);
    //         });
    //     });
    // }


    private authBtnHandler = () => {
        if (!getUser()) {
            router.navigateTo("/game#login", this)
            // this.show('login');
        } else {
            router.navigateTo("/game#parametre", this)
            // this.show('parametre');
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
            // this.show('tournament');
        }
    }
    
    private handleKeydown(e: KeyboardEvent) {
        console.log(e.key)
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
        const cursor = document.getElementById('cursor-video') as HTMLVideoElement;
        if (!cursor) throw new Error('Cursor video not found');
        this.cursor = cursor;
        this.updateCursor();
        this.options.forEach((opt, i) => {
            opt.addEventListener('click', () => {
                this.selectedIdx = i;
                this.updateCursor();
                this.selectOption();
            });
        });
        document.removeEventListener('keydown', this.keydownHandler);
        document.addEventListener('keydown', this.keydownHandler);
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

        console.log("Destroying ViewManager")

        window.removeEventListener('resize', this.resize);
        this.authBtn.removeEventListener('click', this.authBtnHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        if (this.profilePictureManager) {
            this.profilePictureManager.destroy();
            this.profilePictureManager = null;
        }
        if (this.options) {
            this.options.forEach((opt) => {
                opt.replaceWith(opt.cloneNode(true));
            });
        }
        if (this.activeView)
            this.activeView.destroy();
    }
}