import { Component } from "../route/component.js";

export class chaletCadre implements Component {
    private container: HTMLElement;
    private keydownHandler: (event: KeyboardEvent) => void;


    constructor(container: string) {
        const elem = document.getElementById(container);
    if (!elem)
        throw new Error('Container element not found');
    this.container = elem;
        this.keydownHandler = this.secretImg.bind(this);
    }

    public init(): void {
        this.secretImg();
    }

    private secretImg (){
        let buffer = '';
        this.keydownHandler = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (/^[a-z]$/.test(key)) {
                buffer += key;
                if (buffer.length > 10) {
                    buffer = buffer.slice(-10);
                }
                const prenoms = ['liam', 'afavier', 'arvoyer', 'mbaron', 'anjambon', 'andre'];
                for (const prenom of prenoms) {
                    if (buffer.endsWith(prenom)) {
                        this.showEasterEgg(prenom);
                        buffer = '';
                        break;
                    }
                }
            }
        };
        window.addEventListener('keydown', this.keydownHandler);
    }

    private showEasterEgg(prenom: string) {

        const existingEasterEgg = document.querySelector('.easteregg');
        if (existingEasterEgg) {
            existingEasterEgg.remove();
        }

        prenom = this.sanitizePrenom(prenom);

        const easteregg = document.createElement('div');
        easteregg.className = 'easteregg';
    
        const img = document.createElement('img');
        img.src = `/img/${encodeURIComponent(prenom)}.jpg`;
        img.alt = "secret";
        img.style.position = "absolute";
        img.style.left = "156vw";
        img.style.top = "23%";
        img.style.width = "140px";
        img.style.height = "120px";
        img.style.borderRadius = "50%";
        img.style.objectFit = "cover";
        img.style.zIndex = "50";
    
        easteregg.appendChild(img);
    
        const pageContainer = document.getElementById('pageContainer');
        if (pageContainer) {
            pageContainer.appendChild(easteregg);
        }
    }
    private sanitizePrenom(prenom: string): string {
        return prenom.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    public destroy(): void {
        window.removeEventListener('keydown', this.keydownHandler);
        const easteregg = document.querySelector('.easteregg');
        if (easteregg) {
            easteregg.remove();
        }
    }
}