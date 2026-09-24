import { auth, db }
  from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const PASS_PERCENTAGE = 75;
const PASS_SCORE = 8;

const ASSESSMENT_KEY =
  "classesObjects";

const CHAPTER_ID =
  "oops-classes-objects";


const QUESTIONS = [

  {
    question:
      "What is a class in OOP?",

    options: [
      "A runtime instance of another class",
      "A blueprint or template that defines the structure and behavior of objects",
      "Only a collection of variables",
      "Only a collection of functions"
    ],

    answer: 1
  },


  {
    question:
      "What does a class define for its objects?",

    options: [
      "Only memory addresses",
      "Only object names",
      "The structure and behavior, including data and functions",
      "Only constructors"
    ],

    answer: 2
  },


  {
    question:
      "What is an object?",

    options: [
      "A blueprint used to define classes",
      "A real-world entity or instance of a class",
      "A function inside a class",
      "An access modifier"
    ],

    answer: 1
  },


  {
    question:
      "Which terms are used in the notes for the characteristics of an object?",

    options: [
      "Attributes / properties / variables",
      "Packets / frames / bits",
      "Routers / switches / hubs",
      "Constructors / destructors only"
    ],

    answer: 0
  },


  {
    question:
      "Which terms are used for the behaviors of an object?",

    options: [
      "Properties",
      "Attributes",
      "Methods",
      "Namespaces"
    ],

    answer: 2
  },


  {
    question:
      "Which statement best describes the relationship between a class and an object?",

    options: [
      "A class is an instance of an object",
      "An object is the blueprint of a class",
      "A class is the blueprint and an object is an instance created from that blueprint",
      "There is no relationship"
    ],

    answer: 2
  },


  {
    question:
      "In the Car example from the notes, what represents the class?",

    options: [
      "An actual car",
      "The Car blueprint",
      "The drive method",
      "The color value"
    ],

    answer: 1
  },


  {
    question:
      "In the Car example, which pair represents attributes/data?",

    options: [
      "Drive and Brake",
      "Color and Engine",
      "Car and Blueprint",
      "Start and Stop"
    ],

    answer: 1
  },


  {
    question:
      "In the Car example, which pair represents behaviors/methods?",

    options: [
      "Color and Engine",
      "Car and Vehicle",
      "Drive and Brake",
      "Class and Object"
    ],

    answer: 2
  },


  {
    question:
      "Which statement matches the note about an object?",

    options: [
      "It is only a logical representation and is never created in memory",
      "It is created in memory and can be used to perform operations",
      "It cannot contain attributes",
      "It cannot perform methods"
    ],

    answer: 1
  }

];


const loadingState =
  document.getElementById(
    "loadingState"
  );

const assessmentForm =
  document.getElementById(
    "assessmentForm"
  );

const resultSection =
  document.getElementById(
    "resultSection"
  );

const resultIcon =
  document.getElementById(
    "resultIcon"
  );

const resultTitle =
  document.getElementById(
    "resultTitle"
  );

const resultMessage =
  document.getElementById(
    "resultMessage"
  );

const scoreText =
  document.getElementById(
    "scoreText"
  );

const percentageText =
  document.getElementById(
    "percentageText"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const continueBtn =
  document.getElementById(
    "continueBtn"
  );


let currentUser = null;



function renderQuestions() {

  assessmentForm.innerHTML = "";


  QUESTIONS.forEach(
    (item, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "question-card";


      card.innerHTML = `

        <div class="question-number">
          Question ${index + 1} of ${QUESTIONS.length}
        </div>


        <h3>
          ${item.question}
        </h3>


        <div class="options-group">

          ${item.options
            .map(
              (
                option,
                optionIndex
              ) => `

                <label class="option-label">

                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                  />

                  <span>
                    ${option}
                  </span>

                </label>

              `
            )
            .join("")}

        </div>

      `;


      assessmentForm.appendChild(
        card
      );

    }
  );


  const submitWrapper =
    document.createElement(
      "div"
    );


  submitWrapper.className =
    "assessment-submit-wrapper";


  submitWrapper.innerHTML = `

    <button
      type="submit"
      class="btn btn-primary assessment-submit-btn"
    >
      Submit Assessment
    </button>

  `;


  assessmentForm.appendChild(
    submitWrapper
  );

}



function calculateScore() {

  let score = 0;


  QUESTIONS.forEach(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (!selected) {
        return;
      }


      if (
        Number(selected.value) ===
        question.answer
      ) {

        score++;

      }

    }
  );


  return score;

}



function calculatePercentage(
  score
) {

  return Math.round(
    (score / QUESTIONS.length) * 100
  );

}



function collectAnswers() {

  return QUESTIONS.map(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      return {

        question:
          question.question,

        selectedAnswer:
          selected
            ? Number(
                selected.value
              )
            : null,

        correctAnswer:
          question.answer

      };

    }
  );

}



async function saveResult(
  score,
  percentage,
  passed
) {

  if (!currentUser) {
    return;
  }


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const snapshot =
    await getDoc(userRef);


  const userData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const oopsProgress =
    userData.oopsProgress || {};


  const assessments =
    oopsProgress.assessments || {};


  const completedChapters =
    oopsProgress.completedChapters || {};


  const previous =
    assessments[
      ASSESSMENT_KEY
    ] || {};


  const attemptCount =
    (previous.attemptCount || 0) + 1;


  assessments[
    ASSESSMENT_KEY
  ] = {

    score,

    total:
      QUESTIONS.length,

    percentage,

    passed,

    attemptCount,

    lastAttemptAt:
      new Date(),

    answers:
      collectAnswers()

  };


  if (passed) {

    completedChapters[
      CHAPTER_ID
    ] = true;

  }


  const updatedProgress = {

    ...oopsProgress,

    assessments,

    completedChapters

  };


  await setDoc(

    userRef,

    {
      oopsProgress:
        updatedProgress
    },

    {
      merge: true
    }

  );

}



function showResult(
  score,
  percentage,
  passed
) {

  assessmentForm.classList.add(
    "hidden"
  );


  resultSection.classList.remove(
    "hidden"
  );


  scoreText.textContent =
    `Score: ${score}/${QUESTIONS.length}`;


  percentageText.textContent =
    `Percentage: ${percentage}%`;


  if (passed) {

    resultIcon.textContent =
      "🎉";


    resultTitle.textContent =
      "Classes & Objects Completed!";


    resultMessage.textContent =
      "Great work! You passed the Classes & Objects assessment. Continue to the next OOP chapter.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review Classes & Objects and try again.`;

  }

}



async function handleSubmit(
  event
) {

  event.preventDefault();


  const score =
    calculateScore();


  const percentage =
    calculatePercentage(
      score
    );


  const passed =
    percentage >=
    PASS_PERCENTAGE;


  try {

    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Saving Result...";

    }


    await saveResult(
      score,
      percentage,
      passed
    );


    showResult(
      score,
      percentage,
      passed
    );


  } catch (error) {

    console.error(
      "Failed to save assessment:",
      error
    );


    alert(
      "Your result could not be saved. Please check your Firebase connection and try again."
    );


    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Assessment";

    }

  }

}



function resetAssessment() {

  resultSection.classList.add(
    "hidden"
  );


  assessmentForm.classList.remove(
    "hidden"
  );


  renderQuestions();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}



function continueToOOP() {

  window.location.href =
    "oops.html";

}



retryBtn.addEventListener(
  "click",
  resetAssessment
);


continueBtn.addEventListener(
  "click",
  continueToOOP
);


assessmentForm.addEventListener(
  "submit",
  handleSubmit
);



onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );


      renderQuestions();


      loadingState.classList.add(
        "hidden"
      );


      assessmentForm.classList.remove(
        "hidden"
      );


    } catch (error) {

      console.error(
        "Failed to load assessment:",
        error
      );


      loadingState.textContent =
        "Failed to load assessment. Please refresh and try again.";

    }

  }
);