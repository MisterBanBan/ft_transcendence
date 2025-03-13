"use strict";
var _a;
(_a = document.querySelector('.btn-glow')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    createParticles();
});
// Solution complète avec gestion d'erreur
function createParticles() {
    var particles = document.querySelector('.particles');
    var button = document.querySelector('.btn-glow');
    if (!particles || !button) {
        console.error('Éléments manquants dans le DOM');
        return;
    }
    button.addEventListener('click', function () {
        // Création des particules...
    });
}
function getRandomColor() {
    return "hsl(".concat(Math.random() * 360, ", 70%, 60%)");
}
// Ajout de l'animation dynamique
var style = document.createElement('style');
style.textContent = "\n@keyframes explode {\n    0% { transform: scale(1); opacity: 1; }\n    100% { transform: scale(3); opacity: 0; }\n}\n";
document.head.appendChild(style);
