const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentQuestionIndex = 0;
let questions = [];
let userAnswers = {}; // Store selected answers by index

// Fetch questions from the trivia API
fetch('https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple')
    .then((res) => res.json())
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.correct = loadedQuestion.correct_answer;

            // Insert correct answer into random position
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        startGame();
    })
    .catch((err) => console.error(err));

// Start the game
const startGame = () => {
    currentQuestionIndex = 0;
    userAnswers = {};
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    showQuestion();
};

// Show current question
const showQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    progressText.innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    progressBarFull.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
        choice.classList.remove('selected');

        // Highlight the selected choice if the user has answered
        if (userAnswers[currentQuestionIndex] == number) {
            choice.classList.add('selected');
        }
    });

    // Show/hide and enable/disable buttons appropriately
    prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline';
    prevButton.disabled = false; // Always enabled when visible
    nextButton.innerText = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
};


// Handle selecting an answer
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // Save the selected answer to the userAnswers object
        userAnswers[currentQuestionIndex] = selectedAnswer;

        // Update the UI to show the selected answer
        choices.forEach(c => c.classList.remove('selected'));
        selectedChoice.classList.add('selected');
    });
});

// Navigate to the previous question
prevButton.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--; // Decrease index to go to the previous question
        showQuestion(); // Show the previous question
    }
});

// Navigate to the next question or finish the quiz
nextButton.addEventListener('click', () => {
    // Only allow navigation if an answer is selected
    if (userAnswers[currentQuestionIndex]) {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++; // Move to the next question
            showQuestion(); // Show the next question
        } else {
            finishQuiz(); // Finish the quiz if it's the last question
        }
    } else {
        alert('Please select an answer before proceeding.');
    }
});

// Finish the quiz and calculate score
const finishQuiz = () => {
    let score = 0;

    questions.forEach((question, index) => {
        const userChoice = userAnswers[index];
        const correctAnswer = question.correct;

        // Check if the selected answer matches the correct answer
        if (question['choice' + userChoice] === correctAnswer) {
            score += 10;
        }
    });

    localStorage.setItem('mostRecentScore', score);
    window.location.assign('/end.html');
};