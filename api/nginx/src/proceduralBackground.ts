export class proceduralBackground {
    private container: HTMLElement;
    private birds: HTMLElement[] = [];

    constructor(containerId: string) {
        const co = document.getElementById(containerId);
        if (!co) throw Error('element null');
        this.container = co;
        //this.container.classList.add('relative', 'w-full', 'h-screen', 'overflow-hidden');
        
    }
    // generate() {
    //     this.generateBirds(5);
    // }

    public generateBirds(count = 5) {
        //const skyLevel = window.innerHeight * 0.2;
        for (let i = 0; i < count; i++) {
          const bird = document.createElement('div');
          bird.className = 'absolute text-4xl animate-float';
          const skyPercent = 20 + Math.random() * 20;
          bird.style.top = `${skyPercent}%`;
          bird.style.left = `${Math.random() * 100}%`;
          //bird.style.top = `${skyLevel + Math.random() * 20}%`;
          bird.textContent = "🐦";
          this.container.appendChild(bird);
          this.birds.push(bird);
        }
        this.animateBirds();
    }
    private animateBirds() {
      const speed = 0.2;
      const loop = () => {
        this.birds.forEach(bird => {
          let left = parseFloat(bird.style.left);
          left -= speed;
          if (left < -10) left = 110;
          bird.style.left = `${left}%`;
        });
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
}



// window.addEventListener('load', () => {
//     const bg = new proceduralBackground('background-container');
//     bg.generate();
//   });