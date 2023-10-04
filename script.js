// Sélection DOM
const container = document.querySelector(".container");
const statsBlock = document.querySelector(".stats");
const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener('click', startGame);

// Variables jeu
const words = ["oisiveté","désinformation","calamiteuses","jérémiades","éclaircissements","gateaux","commentateurs","cathartique","chlamydia"];
let currentWord = 0;
let currentLetter = 0;
let keyPressed = 0;
let accuratePresses = 0;
let userWord = "";
let timer = 0;
let interval = 0;

// Initialisation
function startGame() {
    // réinitialiser les variables de jeu
    currentWord = 0;
    currentLetter = 0;
    keyPressed = 0;
    accuratePresses = 0;
    userWord = "";
    timer = 0;

    endGame();
    // vider le container et les statsblock
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    while(statsBlock.firstChild) {
        statsBlock.removeChild(statsBlock.firstChild);
    }
   
    // construire les éléments HTML pour la liste de mots
    words.forEach((word) => {
        let wordSlot = document.createElement("p");
        wordSlot.innerHTML = word;
        container.appendChild(wordSlot);
    })

    // Construire les stats
    const accuracyPar = document.createElement("p");
    accuracyPar.textContent = `0% de précision (0 sur 0)`;
    statsBlock.appendChild(accuracyPar);
    const timePar = document.createElement("p");
    statsBlock.appendChild(timePar);
    const cps = document.createElement("p");
    statsBlock.appendChild(cps);
    
    // Event listener pour le clavier utilisateur
    document.addEventListener('keyup', matchLetters);

    // Première transition
    container.style.top = `${-140 * currentWord - 10}px`;    

    startTimer()
}

// Fonctions jeu
function matchLetters(e) {
    userWord += e.key; // On concatène la lettre tapée
    keyPressed++;

    if(words[currentWord].startsWith(userWord)) { // Si le mot est bon

        // Incrémentation des variables utiles
        accuratePresses++;
        currentLetter++;

        // Modification visuelle
        container.children[currentWord].innerHTML = `<span class=validated>${userWord}</span>${words[currentWord].substring(userWord.length)}`;
        // Si le mot est terminé, on passe au suivant
        if (currentLetter == words[currentWord].length) {
            nextWord(true);
        }
    } 
    // Si faute de frappe, on passe au mot suivant
    else {
        nextWord(false);
    }

    updateStats();
}

function nextWord(validated) {
    if (validated) {
        container.children[currentWord].classList.toggle("validated");
    } else {
        container.children[currentWord].classList.toggle("invalidated");
    }

    currentWord++;
    currentLetter = 0;
    userWord = "";
    container.style.top = `${-140 * currentWord - 10}px`;
    if (currentWord == words.length) endGame() 
}

function updateStats() {
    statsBlock.children[0].textContent = `${(accuratePresses / keyPressed * 100).toFixed(0)}% de précision (${accuratePresses} sur ${keyPressed})`
    statsBlock.children[2].textContent = `${(accuratePresses/(timer-currentWord*0.2)*60).toFixed(0)} caractères par minute`;
}

function endGame() {
    document.removeEventListener('keyup', matchLetters);
    stopTimer();
}

// Timer
function startTimer() {
    interval = setInterval(() => {
        timer++;
        statsBlock.children[1].textContent = `${timer} secondes écoulées`
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}
