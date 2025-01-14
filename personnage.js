// Chemins vers les sprites
const idleSprites = [
    "Images/personnage/sprite_0.png", // Idle sprite 1
    "Images/personnage/sprite_1.png"  // Idle sprite 2
];
const runSprites = [
    "Images/personnage/sprite_2.png", // Run sprite 1
    "Images/personnage/sprite_3.png", // Run sprite 2
    "Images/personnage/sprite_4.png"  // Run sprite 3
];

// Sélection des éléments
const spriteElement = document.getElementById("sprite");
const navItems = document.querySelectorAll("#nav-bar li");

// Variables pour gérer les animations
let currentSpriteIndex = 0;
let idleInterval;
let runInterval;
let currentDirection = 1; // 1 pour normal, -1 pour miroir vertical
let currentIndex = -1;

// Fonction pour démarrer l'animation idle
function startIdleAnimation() {
    stopCurrentAnimation(); // S'assurer qu'aucune autre animation ne tourne
    idleInterval = setInterval(() => {
        currentSpriteIndex = (currentSpriteIndex + 1) % idleSprites.length;
        spriteElement.style.backgroundImage = `url('${idleSprites[currentSpriteIndex]}')`;
    }, 250); // Change de sprite toutes les 250ms
}

// Fonction pour arrêter toutes les animations en cours
function stopCurrentAnimation() {
    clearInterval(idleInterval);
    clearInterval(runInterval);
}

// Fonction pour démarrer l'animation de course
function startRunAnimation() {
    stopCurrentAnimation(); // Arrêter toute animation en cours
    runInterval = setInterval(() => {
        currentSpriteIndex = (currentSpriteIndex + 1) % runSprites.length;
        spriteElement.style.backgroundImage = `url('${runSprites[currentSpriteIndex]}')`;
    }, 80); // Change de sprite toutes les 80ms
}

// Fonction pour déplacer le sprite
function moveSprite(targetElement) {
    // Obtenir le data_index de l'élément cible
    const targetIndex = parseInt(targetElement.getAttribute('data_index'));
    
    if (currentIndex == -1){
        currentIndex = targetIndex;
    }

    console.log(`Cible: ${targetIndex}, Actuel: ${currentIndex}`);
    // Si le data_index de l'élément cliqué est inférieur à celui du sprite, on applique un miroir vertical
    if (targetIndex < currentIndex) {
        console.log("Direction inversée");
        currentDirection = -1; // Direction inversée (miroir vertical)
        spriteElement.style.transform = `scaleX(-1)`; // Changer l'orientation instantanément
    } else {
        console.log("Direction normale");
        currentDirection = 1; // Direction normale
        spriteElement.style.transform = `scaleX(1)`; // Changer l'orientation instantanément
    }

    // Obtenir la position de l'élément cible
    const targetRect = targetElement.getBoundingClientRect();
    const headerRect = document.querySelector("header").getBoundingClientRect();

    // Calculer la position du sprite par rapport au header
    const x = targetRect.left - headerRect.left + targetRect.width / 2 - spriteElement.offsetWidth / 2;

    // Appliquer la transition uniquement pour la translation horizontale
    spriteElement.style.transition = "transform 2s ease"; // Seulement pour la translation sur X
    spriteElement.style.transform = `translateX(${x}px)`; // Appliquer le déplacement

    // Lancer l'animation de course
    startRunAnimation();

    // Revenir à l'animation idle après 2 secondes (durée de la translation)
    setTimeout(() => {
        stopCurrentAnimation(); // Arrêter l'animation de course
        startIdleAnimation(); // Reprendre l'animation idle
    }, 2000); // 2 secondes

    currentIndex = targetIndex;
}

// Initialiser la position et l'animation idle au chargement
document.addEventListener("DOMContentLoaded", () => {
    moveSprite(navItems[0]); // Place le sprite au premier élément
    startIdleAnimation(); // Démarre l'animation idle
});

// Ajouter des écouteurs de clic aux éléments de navigation
navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du lien
        moveSprite(item); // Déplacer le sprite vers l'élément cliqué
    });
});
