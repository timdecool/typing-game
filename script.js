// Sélection DOM
const container = document.querySelector(".container");
const statsBlock = document.querySelector(".stats");
const startBtn = document.querySelector("#startBtn");
startBtn.addEventListener('click', startGame);

// Variables jeu
let dico = [];
let words = [];
let currentWord = 0;
let currentLetter = 0;
let keyPressed = 0;
let accuratePresses = 0;
let userWord = "";
let timePassed = 0;
let totalTime = 0;
let interval = 0;

// Initialisation
function startGame() {
    // réinitialiser les variables de jeu
    currentWord = 0;
    currentLetter = 0;
    keyPressed = 0;
    accuratePresses = 0;
    userWord = "";
    totalTime = 30;
    timePassed = 0;
    words = []

    endGame();
    // vider le container et les statsblock
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    while(statsBlock.firstChild) {
        statsBlock.removeChild(statsBlock.firstChild);
    }

    // Construire les stats
    const accuracyPar = document.createElement("p");
    accuracyPar.textContent = `0% de précision (0 sur 0)`;
    statsBlock.appendChild(accuracyPar);
    const cps = document.createElement("p");
    statsBlock.appendChild(cps);
    const wordsCompleted = document.createElement("p");
    statsBlock.appendChild(wordsCompleted);
    const timePar = document.createElement("p");
    statsBlock.appendChild(timePar);
    
    // Event listener pour le clavier utilisateur
    document.addEventListener('keydown', matchLetters);

    nextWord();
    updateStats();
    startTimer();
}

// Fonctions jeu
function matchLetters(e) {
    if (e.key == " ") {
        e.preventDefault();
    }
    if (e.key != "Dead" && e.key != "Shift" && e.key != "Backspace" && e.key != " ") {
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
                nextWord();
            }
            if(container.children[currentWord].classList.contains("invalidated")) {
                container.children[currentWord].classList.toggle("invalidated");
            }
        }
        // Si faute de frappe, on annule le dernier coup et on indique l'erreur
        else {
            if(!container.children[currentWord].classList.contains("invalidated")) {
                container.children[currentWord].classList.toggle("invalidated");
            }
            userWord = userWord.substring(0, userWord.length-1)
        }
            updateStats();
        }
    }

function nextWord() {
    if (words.length != 0) {
        addTime();
        currentWord++;
    }
    addWord();
    currentLetter = 0;
    userWord = "";
    container.style.top = `${-380 * currentWord - 10}px`;
}

function addWord() {
        words.push(randomWord());
        let wordSlot = document.createElement("p");
        wordSlot.innerHTML = words.at(-1);
        container.appendChild(wordSlot);
}

function updateStats() {
    statsBlock.children[0].textContent = `${(accuratePresses / keyPressed * 100).toFixed(0)}% de précision (${accuratePresses} sur ${keyPressed})`
    statsBlock.children[1].textContent = `${(accuratePresses/(timePassed-currentWord*0.2)*60).toFixed(0)} caractères par minute`;
    statsBlock.children[2].textContent = `${words.length-1} mots complétés`

}

function endGame() {
    document.removeEventListener('keydown', matchLetters);
    stopTimer();
}

// Timer
function startTimer() {
    interval = setInterval(() => {
        timePassed++;
        displayTimer();
        updateStats();
        if (totalTime - timePassed == 0) endGame();
    }, 1000);
}

function displayTimer() {
    statsBlock.children[3].textContent = `${totalTime - timePassed} secondes restantes`;
}

function stopTimer() {
    clearInterval(interval);
}

function addTime() {
    totalTime = totalTime + 2;
    displayTimer();
}

// Fonctions dictionnaire
(async function importDictionary() {
    try {
        const reponse = await fetch('mots.txt');
        const contenu = await reponse.text();

        const lines = contenu.split('\n');
        const lines2 = lines.map(line => line.replace ('\r', ''));
        dico = [...new Set(lines2)].filter((word) => word.length>7);
    } catch(error) {
        console.error('Une erreur s\'est produite lors de l\'importation du fichier :', error);
    }
}) ();

function randomWord() {
    return dico[Math.floor(Math.random()*dico.length)];
}
