import { viewManager } from "./viewManager.js";
import { getUser } from "../user-handler.js";
import { wait } from "../wait.js";
import { twoFApopUp } from "../menuInsert/Connection/twoFApopUp.js";
import {TFAValidate} from "../auth/2fa-validate.js";
import { Login } from "../auth/login.js";
import { loginForm } from "../menuInsert/Connection/loginForm.js";
import { Component } from "../component.js";
import {router} from "../router.js";
import {AuthUser} from "../type.js";


export class loginView implements Component {
    private container: HTMLElement;
    private viewManager: viewManager;
    private token: string | null;
    private loginLogic: Login | null;
    private tfaValidate: TFAValidate | null;

    private handleSubmit = () => this.submit_loginForm();
    private handleRegister = () => router.navigateTo("/game#register", this.viewManager);

    constructor(container: HTMLElement,  viewManager: viewManager, token: string | null) {
        this.container = container;
        this.viewManager = viewManager;
        this.token = token
        this.loginLogic = null;
        this.tfaValidate = null;
    }

    public init(): void {
        this.container.innerHTML = '';
        this.container.innerHTML = loginForm();
        this.loginLogic = new Login();
        this.loginLogic.init();
        this.attachEventListeners();

        if (this.token) {
            this.container.insertAdjacentHTML('beforeend', twoFApopUp());
            this.tfaValidate = new TFAValidate(this.token);
            this.tfaValidate.init()
        }
    }

    private attachEventListeners() {
        document.getElementById('submit-login')?.addEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.addEventListener('click', this.handleRegister);

    }
    //bloquer lenvoie de pleins de submit
    public async submit_loginForm() {
        await wait(1000)

        const user = getUser();
        if (user) {
            if (user.tfa) {
                //a changer
                this.container.insertAdjacentHTML('beforeend', twoFApopUp());
                if (this.tfaValidate)
                    this.tfaValidate.destroy();
                this.tfaValidate = new TFAValidate(user.username);
                this.tfaValidate.init();
            }
            else {
                router.navigateTo("/game", this.viewManager)
            }
        }
    }

    public destroy(): void {
        document.getElementById('submit-login')?.removeEventListener('click', this.handleSubmit);
        document.getElementById('registerBtn')?.removeEventListener('click', this.handleRegister);

        if (this.loginLogic)
            this.loginLogic.destroy()

        if (this.tfaValidate)
            this.tfaValidate.destroy()
    }
}