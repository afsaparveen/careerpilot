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
  "introduction";

const CHAPTER_ID =
  "oops-introduction";


const QUESTIONS = [

  {
    question:
      "What is Object-Oriented Programming (OOP)?",

    options: [
      "A database management system",
      "A programming paradigm based on objects and classes",
      "A type of operating system",
      "A networking protocol"
    ],

    answer: 1
  },


  {
    question:
      "What do objects in OOP contain according to the notes?",

    options: [
      "Only data",
      "Only methods",
      "Both data and code that manipulates the data",
      "Only memory addresses"
    ],

    answer: 2
  },


  {
    question:
      "Which statement best describes OOP according to the notes?",

    options: [
      "It revolves around objects and classes",
      "It is only used for database programming",
      "It eliminates the need for functions",
      "It is only applicable to C++"
    ],

    answer: 0
  },


  {
    question:
      "Which of the following is given as an example of a real-world entity that can be modelled using OOP?",

    options: [
      "Car",
      "Router table only",
      "CPU instruction only",
      "Compiler token only"
    ],

    answer: 0
  },


  {
    question:
      "What is the problem in procedural programming that OOP addresses through classes?",

    options: [
      "No clear modular structure",
      "Too many operating systems",
      "Lack of network protocols",
      "Lack of hardware"
    ],

    answer: 0
  },


  {
    question:
      "How does OOP address poor code reuse?",

    options: [
      "By using inheritance",
      "By removing classes",
      "By using only global variables",
      "By avoiding objects"
    ],

    answer: 0
  },


  {
    question:
      "Which OOP concept is associated with hiding sensitive internal data?",

    options: [
      "Inheritance",
      "Encapsulation",
      "Compilation",
      "Iteration"
    ],

    answer: 1
  },


  {
    question:
      "Which OOP feature helps model real-world entities?",

    options: [
      "Classes and objects",
      "Only loops",
      "Only arrays",
      "Only operators"
    ],

    answer: 0
  },


  {
    question:
      "Which of the following is listed as an advantage of OOP?",

    options: [
      "Modularity",
      "Elimination of all memory usage",
      "Removal of all functions",
      "No need for maintenance"
    ],

    answer: 0
  },


  {
    question:
      "Which set contains only advantages of OOP mentioned in the notes?",

    options: [
      "Modularity, reusability, maintainability and scalability",
      "Compilation, linking and execution",
      "Routing, switching and modulation",
      "Paging, segmentation and deadlock"
    ],

    answer: 0
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
      "Introduction Completed!";


    resultMessage.textContent =
      "Great work! You passed the OOP Introduction assessment. Chapter 2 — Classes & Objects is now available.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review the Introduction chapter and try again.`;

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