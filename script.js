let flashcards = []; 
let currentIndex = 0;
let timer;
const TIME_LIMIT = 15; // ¡CAMBIADO A 15 SEGUNDOS!
let timeLeft = TIME_LIMIT;
const ANSWER_DELIMITER = '-----'; 

// NUEVAS VARIABLES DE PUNTUACIÓN
let scoreCorrect = 0;
let scoreIncorrect = 0;

// 1. Elementos del DOM
const dataEntryEl = document.getElementById('data-entry');
const studyAreaEl = document.getElementById('study-area');
const questionsInput = document.getElementById('questions-input');
const answersInput = document.getElementById('answers-input');
const loadBtn = document.getElementById('load-btn');
const cardCountEl = document.getElementById('card-count');

// Nuevos elementos de seguimiento de estado
const currentCardDisplayEl = document.getElementById('current-card-display');
const scoreDisplayEl = document.getElementById('score-display');
const finalSummaryEl = document.getElementById('final-summary');

const flashcardEl = document.querySelector('.flashcard');
const questionEl = document.getElementById('card-question');
const answerEl = document.getElementById('card-answer');
const timerEl = document.getElementById('timer');
const correctBtn = document.getElementById('correct-btn');
const incorrectBtn = document.getElementById('incorrect-btn');
const skipBtn = document.getElementById('skip-btn');
const statusMessageEl = document.getElementById('status-message');

const endScreenEl = document.getElementById('end-screen-options');
const restartSetBtn = document.getElementById('restart-set-btn');
const newSetBtn = document.getElementById('new-set-btn');

// Función auxiliar para actualizar el marcador
function updateScoreDisplay() {
    scoreDisplayEl.textContent = `✅ Aciertos: ${scoreCorrect} | ❌ Errores: ${scoreIncorrect}`;
}


// 2. Funciones de Carga de Datos

function loadCustomCards() {
    const qLines = questionsInput.value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const aText = answersInput.value;
    const aSections = aText.split(new RegExp('\\s*' + ANSWER_DELIMITER + '\\s*', 'g'))
                           .map(section => section.trim())
                           .filter(section => section.length > 0);

    if (qLines.length === 0 || aSections.length === 0) {
        alert("Error: Asegúrate de que ambas listas (Preguntas y Respuestas) no estén vacías.");
        return;
    }

    if (qLines.length !== aSections.length) {
        alert(`Error: El número de preguntas (${qLines.length}) no coincide con el número de respuestas (${aSections.length}).`);
        return;
    }

    // Reiniciar puntuación al cargar nuevas fichas
    scoreCorrect = 0;
    scoreIncorrect = 0;

    flashcards = []; 
    for (let i = 0; i < qLines.length; i++) {
        flashcards.push({
            question: qLines[i],
            answer: aSections[i] 
        });
    }

    // Inicia el proceso de estudio
    currentIndex = 0;
    cardCountEl.textContent = `${flashcards.length} fichas cargadas. ¡Listo para empezar!`;
    studyAreaEl.style.display = 'flex';
    dataEntryEl.style.display = 'none';
    endScreenEl.style.display = 'none';
    updateScoreDisplay(); // Muestra el marcador inicializado
    loadCard();
}

// 3. Funciones de Estudio

function loadCard() {
    if (currentIndex >= flashcards.length) {
        showEndScreen();
        return;
    }

    const currentCard = flashcards[currentIndex];
    
    questionEl.textContent = currentCard.question;
    flashcardEl.classList.remove('flipped');
    
    answerEl.textContent = currentCard.answer;
    document.querySelector('.feedback-area').style.display = 'none';
    skipBtn.style.display = 'block';

    // ¡Contador de fichas visible!
    currentCardDisplayEl.textContent = `Ficha ${currentIndex + 1} de ${flashcards.length}`;
    statusMessageEl.textContent = '¡Concentración! El tiempo corre...';
    
    timeLeft = TIME_LIMIT;
    timerEl.textContent = timeLeft;
    startTimer();
}

/** Muestra las opciones y el resumen final al terminar. */
function showEndScreen() {
    questionEl.textContent = "¡REPASO COMPLETO!";
    answerEl.textContent = "¡Excelente trabajo!";
    flashcardEl.classList.remove('flipped');
    stopTimer();
    document.querySelector('.feedback-area').style.display = 'none';
    skipBtn.style.display = 'none';
    statusMessageEl.textContent = `🥳 ¡Has terminado las ${flashcards.length} fichas!`;
    
    // Generar el resumen final
    const totalFichas = flashcards.length;
    finalSummaryEl.innerHTML = `
        <p>Total de Fichas: <strong>${totalFichas}</strong></p>
        <p style="color: #28a745;">✅ Aciertos: <strong>${scoreCorrect}</strong></p>
        <p style="color: #dc3545;">❌ Errores: <strong>${scoreIncorrect}</strong></p>
    `;
    
    endScreenEl.style.display = 'flex';
}

function startTimer() {
    stopTimer(); 
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            stopTimer();
            flipCard();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function flipCard() {
    stopTimer(); 
    flashcardEl.classList.add('flipped');
    document.querySelector('.feedback-area').style.display = 'flex';
    skipBtn.style.display = 'none';
    statusMessageEl.textContent = '¡Evalúate! Califícate para avanzar.';
}

/** Maneja la respuesta del usuario (Actualiza la puntuación). */
function handleResponse(isCorrect) {
    if (isCorrect) {
        scoreCorrect++;
        statusMessageEl.textContent = "✅ ¡Bien hecho! Avanzas.";
    } else {
        scoreIncorrect++;
        statusMessageEl.textContent = "❌ No hay problema, a repasar. Avanzas.";
    }
    
    updateScoreDisplay(); // Actualiza el marcador

    setTimeout(() => {
        currentIndex++;
        loadCard();
    }, 1500); 
}

// 4. Listeners de Eventos

loadBtn.addEventListener('click', loadCustomCards);
skipBtn.addEventListener('click', flipCard);
correctBtn.addEventListener('click', () => handleResponse(true));
incorrectBtn.addEventListener('click', () => handleResponse(false));

// Nuevos Listeners para reiniciar
restartSetBtn.addEventListener('click', () => {
    // Resetear puntuación y el índice para empezar de nuevo con el mismo set
    scoreCorrect = 0;
    scoreIncorrect = 0;
    currentIndex = 0;
    endScreenEl.style.display = 'none';
    updateScoreDisplay();
    loadCard();
});

newSetBtn.addEventListener('click', () => {
    studyAreaEl.style.display = 'none';
    dataEntryEl.style.display = 'block';
    endScreenEl.style.display = 'none';
    cardCountEl.textContent = 'Carga un nuevo set de fichas.';
    questionsInput.value = ''; 
    answersInput.value = ''; 
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    timerEl.textContent = TIME_LIMIT;
    studyAreaEl.style.display = 'none'; 
    updateScoreDisplay(); 
});