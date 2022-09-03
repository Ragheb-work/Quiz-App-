// Elements Select
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
// Elements Select

// Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
// Set Option

function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questions = JSON.parse(this.responseText);

      // Create Bullets + counter of Question based On Length Of Object
      let questionCount = questions.length;

      createBullets(questionCount);

      // Function to add Data
      addQuestionData(questions[currentIndex], questionCount);

      // Start countDown
      countDown(60, questionCount);

      // click To Submit
      submitButton.addEventListener("click", () => {
        // get right answer
        let theRightAnswer = questions[currentIndex].right_answer;

        //  increase index
        currentIndex++;
        // check Answer
        checkAnswer(theRightAnswer, questionCount);

        // remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questions[currentIndex], questionCount);

        // handle bullets class
        handleBullets();

        // Start countDown
        clearInterval(countDownInterval);
        countDown(60, questionCount);

        // show Results
        showResults(questionCount);
      });
    }
  };

  myRequest.open("get", "questions.json", true);
  myRequest.send();
}
getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;

  // create Spans

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    // check if it's first span
    if (i === 0) {
      theBullet.classList = "on";
    }
    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2 question title
    let questionTitle = document.createElement("h2");

    // create question text
    let questionText = document.createTextNode(obj.title);

    // append text to h2
    questionTitle.appendChild(questionText);

    // append h2 to quiz area
    quizArea.appendChild(questionTitle);

    // create Answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // create radio input
      let radioInput = document.createElement("input");

      // add type + name + id + data-attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make first option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let label = document.createElement("label");

      // add "for" attr
      label.htmlFor = `answer_${i}`;

      // create label text
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      // add the text to label
      label.appendChild(labelText);

      // add input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);

      // append all divs to answer area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (theChosenAnswer === rAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  if (currentIndex === count) {
    let theResult;
    removeElement();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class='good'>Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class='perfect'>Perfect</span>, All Answers Is Good`;
    } else {
      theResult = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResult;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

function removeElement() {
  quizArea.remove();
  answersArea.remove();
  submitButton.remove();
  bullets.remove();
}
