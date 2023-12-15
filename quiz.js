document.addEventListener('DOMContentLoaded', function() {
    let allQuestions = [];
    const startButton = document.getElementById('start');
    const submitButton = document.getElementById('submit');
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const newQuizButton = document.createElement('button');
    newQuizButton.textContent = 'התחל חידון חדש';
    newQuizButton.style.display = 'none';
    document.body.appendChild(newQuizButton);

    startButton.addEventListener('click', function() {
        fetch('questions.json')
            .then(response => response.json())
            .then(loadedQuestions => {
                allQuestions = loadedQuestions;
                startNewQuiz();
            });
    });

    newQuizButton.addEventListener('click', startNewQuiz);

    submitButton.addEventListener('click', function() {
        const userAnswers = getUserAnswers(5);
        const numCorrect = checkAnswers(allQuestions, userAnswers);
        resultsContainer.innerHTML = `קיבלת ${numCorrect} תשובות נכונות מתוך 5.`;
        submitButton.style.display = 'none';
        newQuizButton.style.display = 'block';
    });

    function startNewQuiz() {
        const selectedQuestions = getRandomQuestions(allQuestions, 5);
        displayQuiz(selectedQuestions);
        startButton.style.display = 'none';
        submitButton.style.display = 'block';
        newQuizButton.style.display = 'none';
        resultsContainer.innerHTML = '';
    }

    function getRandomQuestions(questions, num) {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    function displayQuiz(questions) {
        quizContainer.innerHTML = '';
        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            const questionText = document.createElement('h2');
            questionText.textContent = `שאלה ${index + 1}: ${question.question}`;
            questionElement.appendChild(questionText);
            question.options.forEach(option => {
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'question' + index;
                radio.value = option;
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                questionElement.appendChild(label);
                questionElement.appendChild(document.createElement('br'));
            });
            quizContainer.appendChild(questionElement);
        });
    }

    function getUserAnswers(numQuestions) {
        let userAnswers = [];
        for (let i = 0; i < numQuestions; i++) {
            const selectedOption = document.querySelector(`input[name='question${i}']:checked`);
            userAnswers.push(selectedOption ? selectedOption.value : null);
        }
        return userAnswers;
    }

    function checkAnswers(questions, userAnswers) {
        let correctCount = 0;
        questions.slice(0, 5).forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                correctCount++;
            }
        });
        return correctCount;
    }
});
