function createHerbe(x: number, container: HTMLElement) {
    const herbe = document.createElement('div');
    herbe.classList.add('herbe');
    herbe.style.left = `${x}px`;
    container.appendChild(herbe);
}

const herbeContainer = document.querySelector('.herbe-container') as HTMLElement;

if (herbeContainer) {
    const pageWidth = window.innerWidth;
    const spacing = 10; // Espacement entre chaque brin de herbe

    for (let x = 0; x < pageWidth; x += spacing) {
        createHerbe(x, herbeContainer);
    }
} else {
    console.error("Élément '.herbe-container' non trouvé.");
}

document.addEventListener('DOMContentLoaded', () => {
    const bouton = document.getElementById('monBouton') as HTMLButtonElement;
    let compteur = 0;

    bouton.addEventListener('click', () => {
        compteur++;
        bouton.textContent = `Clics : ${compteur}`;
    });
});

function qsdsq()
{}
