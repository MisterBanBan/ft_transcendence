import { Component } from "./component.js";

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
                if (buffer.endsWith('liam')) {
                    this.showEasterEgg();
                    buffer = '';
                }
            }
        };
        window.addEventListener('keydown', this.keydownHandler);
    }

    private showEasterEgg() {
    const easteregg = document.createElement('div');
    easteregg.className = 'easteregg';
    easteregg.innerHTML = `
  <img src="/img/liam.jpg"
       style="
         position: absolute;
         left: 156vw;
         top: 23%;
         width: 140px;
         height: 124px;
         border-radius: 50%;
         object-fit: cover;
         z-index: 50;
       "
       alt="secret">
`;

    const pageContainer = document.getElementById('pageContainer');
    if (pageContainer) {
      pageContainer.appendChild(easteregg);
    }
}


    public destroy(): void {
        window.removeEventListener('keydown', this.keydownHandler);
        const easteregg = document.querySelector('.easteregg');
        if (easteregg) {
            easteregg.remove();
        }
    }
}