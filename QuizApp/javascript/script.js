const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");

let quizCategory = "entertainment";
let currentQuestion = null;
let numberOfQuestions = 10;
const questionIndexHistory = [];

//Fetch a random question from based on the selected category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    //Show the result if all the questions have been completed.
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return console.log("Quiz Completed!");
    }

    //Filter out already asked questions and choose a random one
    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

//highlight correct answer
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-outlined">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.innerAdjacentHTML("beforeend", iconHTML);
}

//handle user's answer selection
const handleAnswer = (option, answerIndex) => {
    const isCorrect = currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct' : 'incorrect');
    !isCorrect ? highlightCorrectAnswer() : "";

    //Insert icon based on correctness
    const iconHTML = `<span class="material-symbols-outlined">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.innerAdjacentHTML("beforeend", iconHTML);

    //Disable all other answer option when one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
}

//render the current question and its options in the quiz
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion)
        return;
    console.log(currentQuestion);

    //Update the UI
    answerOptions.innerHTML = "";
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

renderQuestion();

nextQuestionBtn.addEventListener("click", renderQuestion);