const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");

const Quiz_Time_Limit = 15;
let currentTime = Quiz_Time_Limit;
let timer = null;
let quizCategory = "entertainment";
let currentQuestion = null;
let numberOfQuestions = 5;
let isCorrect = true;
const questionIndexHistory = [];
let correctAnswerCount = 0;



//Display the quiz result and hide the container
const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const resultText = `You answered <b>${correctAnswerCount}</b> out if <b>${numberOfQuestions}</b> questions correctly. Great Effort!`;
    document.querySelector(".result-message").innerHTML = resultText;
}

//Reset timer
const resetTimer = () => {
    clearInterval(timer);
    currentTime = Quiz_Time_Limit;
    timerDisplay.textContent = `${currentTime}s`;
}

//Initialize and start the timer for the current question
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";

            //Disable all other answer option when one option is selected
            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
        }
    }, 1000);
}

//Fetch a random question from based on the selected category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    //Show the result if all the questions have been completed.
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return showQuizResult();
    }

    //Filter out already asked questions and choose a random one
    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

//highlight correct answer option and add icon
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-outlined">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

//handle user's answer selection
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);

    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;

    //Insert icon based on correctness
    const iconHTML = `<span class="material-symbols-outlined">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    //Disable all other answer option when one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");

    nextQuestionBtn.style.visibility = "visible";
}

//render the current question and its options in the quiz
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion)
        return;
    console.log(currentQuestion);

    resetTimer();
    startTimer();

    //Update the UI
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".question-text").textContent = currentQuestion.question;
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    //Create option <li> elements, append them, and add click event Listners
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);
        li.addEventListener("click", () => handleAnswer(li, index));
    });
}

//
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    renderQuestion();
}

//Reset the quiz and return to the config container.
const resetQuiz = () => {
    resetTimer();
    correctAnswerCount = 0;
    questionIndexHistory.length = 0;
    configContainer.style.display = "block";
    quizContainer.style.display = "none";
    resultContainer.style.display = "none";
}

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListner("click", resetQuiz);
document.querySelector(".start-quiz").addEventListner("click", startQuiz());