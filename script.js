let flashcards = []; // Almacén global de fichas
let currentIndex = 0;
let timer;
const TIME_LIMIT = 30; // 30 segundos
let timeLeft = TIME_LIMIT;
const ANSWER_DELIMITER = '-----'; // El separador único para respuestas largas

// 1. Elementos del DOM
const dataEntryEl = document.getElementById('data-entry');
const studyAreaEl = document.getElementById('study-area');
const questionsInput = document.getElementById('questions-input');
const answersInput = document.getElementById('answers-input');
const loadBtn = document.getElementById('load-btn');
const cardCountEl = document.getElementById('card-count');

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


// 2. Funciones de Carga de Datos (¡SIN LÍMITES!)

/** Lee las cajas de texto, separa las respuestas por el delimitador y comienza el estudio. */
function loadCustomCards() {
    // 1. Procesar Preguntas (una línea = una pregunta)
    // Filtra las líneas vacías para que no cuenten como preguntas.
    const qLines = questionsInput.value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // 2. Procesar Respuestas (separadas por el delimitador único)
    const aText = answersInput.value;
    // Divide usando el delimitador, ignorando espacios o saltos de línea alrededor del mismo.
    const aSections = aText.split(new RegExp('\\s*' + ANSWER_DELIMITER + '\\s*', 'g'))
                           .map(section => section.trim())
                           .filter(section => section.length > 0);

    if (qLines.length === 0 || aSections.length === 0) {
        alert("Error: Asegúrate de que ambas listas (Preguntas y Respuestas) no estén vacías.");
        return;
    }

    if (qLines.length !== aSections.length) {
        alert(`Error: El número de preguntas (${qLines.length}) no coincide con el número de respuestas (${aSections.length}). Asegúrate de usar el separador ----- correctamente después de CADA respuesta, ¡y de que el texto no finalice con el separador!`);
        return;
    }

    // 3. Empaquetar Fichas
    flashcards = []; 
    for (let i = 0; i < qLines.length; i++) {
        flashcards.push({
            question: qLines[i],
            answer: aSections[i] 
        });
    }

    // Inicia el proceso de estudio
    currentIndex = 0;
    cardCountEl.textContent = `${flashcards.length} fichas cargadas. ¡A estudiar!`;
    studyAreaEl.style.display = 'flex';
    dataEntryEl.style.display = 'none';
    endScreenEl.style.display = 'none';

    loadCard();
}

// 3. Funciones de Estudio

/** Carga la ficha actual en la interfaz y comienza el temporizador. */
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
    statusMessageEl.textContent = `Ficha ${currentIndex + 1} de ${flashcards.length}`;
    
    timeLeft = TIME_LIMIT;
    timerEl.textContent = timeLeft;
    startTimer();
}

/** Muestra las opciones al finalizar el mazo. */
function showEndScreen() {
    questionEl.textContent = "¡FIN DEL REPASO!";
    answerEl.textContent = "¡Repaso completo!";
    flashcardEl.classList.remove('flipped');
    stopTimer();
    document.querySelector('.feedback-area').style.display = 'none';
    skipBtn.style.display = 'none';
    statusMessageEl.textContent = `🥳 ¡Has terminado las ${flashcards.length} fichas!`;
    endScreenEl.style.display = 'flex';
}

/** Inicia la cuenta regresiva. */
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

/** Detiene la cuenta regresiva. */
function stopTimer() {
    clearInterval(timer);
}

/** Voltea la tarjeta para mostrar la respuesta. */
function flipCard() {
    stopTimer(); 
    flashcardEl.classList.add('flipped');
    document.querySelector('.feedback-area').style.display = 'flex';
    skipBtn.style.display = 'none';
    statusMessageEl.textContent = '¡Evalúate! Revisa la respuesta y califícate.';
}

/** Maneja la respuesta del usuario (Correcto/Incorrecto). */
function handleResponse(isCorrect) {
    if (isCorrect) {
        statusMessageEl.textContent = "✅ Correcto. ¡Avanzas!";
    } else {
        statusMessageEl.textContent = "❌ Incorrecto. Repasa la respuesta.";
    }

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
    currentIndex = 0;
    endScreenEl.style.display = 'none';
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
});