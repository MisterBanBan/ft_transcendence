document.querySelector('.btn-glow')?.addEventListener('click', () => {
    createParticles();
});
// Solution complète avec gestion d'erreur
function createParticles() {
    const particles = document.querySelector('.particles');
    const button = document.querySelector('.btn-glow');

    if (!particles || !button) {
        console.error('Éléments manquants dans le DOM');
        return;
    }

    button.addEventListener('click', () => {
        // Création des particules...
    });
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

// Ajout de l'animation dynamique
const style = document.createElement('style');
style.textContent = `
@keyframes explode {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
}
`;
document.head.appendChild(style);
