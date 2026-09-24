import { auth, db } from "../firebase/firebase-config.js";

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

const ASSESSMENT_KEY = "polymorphism";
const CHAPTER_ID = "oops-polymorphism";


const QUESTIONS = [

  {
    question:
      "What does polymorphism mean in OOP?",

    options: [
      "One class can have only one method",
      "Objects can take different forms or behave differently depending on context",
      "A class cannot be inherited",
      "Data can only be stored privately"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is a type of compile-time polymorphism?",

    options: [
      "Method overriding",
      "Virtual functions",
      "Method overloading",
      "Dynamic method dispatch"
    ],

    answer: 2
  },


  {
    question:
      "Compile-time polymorphism is also known as:",

    options: [
      "Late binding",
      "Dynamic binding",
      "Early binding",
      "Runtime dispatch"
    ],

    answer: 2
  },


  {
    question:
      "Which rule is required for method overloading?",

    options: [
      "Method name must be different",
      "Parameters must be different in number, type, or order",
      "Return type alone must be different",
      "Inheritance is mandatory"
    ],

    answer: 1
  },


  {
    question:
      "Which statement about return type in method overloading is correct?",

    options: [
      "Return type alone can create overloading",
      "Return type must always be void",
      "Return type alone does not determine overloading",
      "Return type must be identical in every overload"
    ],

    answer: 2
  },


  {
    question:
      "Which feature allows operator behavior to be redefined for user-defined types in C++?",

    options: [
      "Method overriding",
      "Operator overloading",
      "Virtual inheritance",
      "Abstract classes"
    ],

    answer: 1
  },


  {
    question:
      "Which language does not support operator overloading, except for + with Strings?",

    options: [
      "C++",
      "Java",
      "Both C++ and Java",
      "Neither"
    ],

    answer: 1
  },


  {
    question:
      "What is method overriding?",

    options: [
      "Defining methods with different names",
      "Redefining a base-class method in a derived class using the same method name and parameters",
      "Defining several constructors in one class",
      "Changing only the return type of a method"
    ],

    answer: 1
  },


  {
    question:
      "What does the `virtual` keyword enable in C++?",

    options: [
      "Compile-time binding",
      "Static data members",
      "Runtime/dynamic binding",
      "Constructor overloading"
    ],

    answer: 2
  },


  {
    question:
      "In C++, what happens when a base-class pointer points to a derived object and the base method is virtual?",

    options: [
      "The base method is always called",
      "The compiler ignores the pointer",
      "The correct overridden derived method is called at runtime",
      "The program cannot compile"
    ],

    answer: 2
  }

];


const state = {
  user: null,
  submitted: false,
  attemptCount: 0,
  previousResult: null
};


const loadingEl =
  document.getElementById("assessmentLoading");

const formEl =
  document.getElementById("assessmentForm");

const questionsContainer =
  document.getElementById("questionsContainer");

const resultSection =
  document.getElementById("resultSection");

const resultIcon =
  document.getElementById("resultIcon");

const resultTitle =
  document.getElementById("resultTitle");

const resultMessage =
  document.getElementById("resultMessage");

const scoreText =
  document.getElementById("scoreText");

const percentageText =
  document.getElementById("percentageText");

const resultDetails =
  document.getElementById("resultDetails");

const retryBtn =
  document.getElementById("retryBtn");

const continueBtn =
  document.getElementById("continueBtn");


/* -------------------------------------------------------
   AUTH
------------------------------------------------------- */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  state.user = user;

  await loadProgress();

  renderQuestions();

  loadingEl.classList.add("hidden");
  formEl.classList.remove("hidden");
});


/* -------------------------------------------------------
   LOAD PROGRESS
------------------------------------------------------- */

async function loadProgress() {

  const userRef =
    doc(db, "users", state.user.uid);

  try {

    const snapshot =
      await getDoc(userRef);

    if (!snapshot.exists()) {
      redirectToOops();
      return;
    }

    const userData =
      snapshot.data();

    const oopsProgress =
      userData.oopsProgress || {};

    /*
      Chapter 11 must be completed first.
    */

    const diamondCompleted =
      oopsProgress.completedChapters?.[
        "oops-diamond"
      ] === true;

    if (!diamondCompleted) {

      alert(
        "Please complete the Diamond Problem chapter assessment before attempting the Polymorphism assessment."
      );

      redirectToOops();
      return;
    }

    const assessment =
      oopsProgress.assessments?.[
        ASSESSMENT_KEY
      ];

    if (assessment) {

      state.attemptCount =
        assessment.attemptCount || 0;

      state.previousResult =
        assessment;
    }

  } catch (error) {

    console.error(
      "Failed to load OOPs progress:",
      error
    );

    alert(
      "Unable to load your assessment progress."
    );

    redirectToOops();
  }
}


/* -------------------------------------------------------
   RENDER QUESTIONS
------------------------------------------------------- */

function renderQuestions() {

  questionsContainer.innerHTML = "";

  QUESTIONS.forEach((question, index) => {

    const questionCard =
      document.createElement("div");

    questionCard.className =
      "question-card";

    questionCard.innerHTML = `
      <div class="question-header">

        <span class="question-number">
          Q${index + 1}
        </span>

        <h3>
          ${escapeHtml(question.question)}
        </h3>

      </div>

      <div class="options-list">

        ${question.options.map(
          (option, optionIndex) => `
            <label class="option-item">

              <input
                type="radio"
                name="question-${index}"
                value="${optionIndex}"
                required
              />

              <span class="option-letter">
                ${String.fromCharCode(
                  65 + optionIndex
                )}
              </span>

              <span class="option-text">
                ${escapeHtml(option)}
              </span>

            </label>
          `
        ).join("")}

      </div>
    `;

    questionsContainer.appendChild(
      questionCard
    );
  });
}


/* -------------------------------------------------------
   SUBMIT
------------------------------------------------------- */

formEl.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (state.submitted) {
      return;
    }

    const formData =
      new FormData(formEl);

    let score = 0;

    const answers = {};

    QUESTIONS.forEach(
      (question, index) => {

        const selected =
          formData.get(
            `question-${index}`
          );

        const selectedIndex =
          Number(selected);

        answers[index] =
          selectedIndex;

        if (
          selectedIndex ===
          question.answer
        ) {
          score++;
        }
      }
    );

    const percentage =
      Math.round(
        (score / QUESTIONS.length) * 100
      );

    const passed =
      percentage >= PASS_PERCENTAGE;

    state.submitted = true;

    await saveAssessment({
      score,
      percentage,
      passed,
      answers
    });

    showResult({
      score,
      percentage,
      passed
    });
  }
);


/* -------------------------------------------------------
   SAVE ASSESSMENT
------------------------------------------------------- */

async function saveAssessment({
  score,
  percentage,
  passed,
  answers
}) {

  const userRef =
    doc(db, "users", state.user.uid);

  try {

    const snapshot =
      await getDoc(userRef);

    const existingData =
      snapshot.exists()
        ? snapshot.data()
        : {};

    const currentProgress =
      existingData.oopsProgress || {};

    const currentAssessments =
      currentProgress.assessments || {};

    const currentCompletedChapters =
      currentProgress.completedChapters || {};

    state.attemptCount += 1;

    const assessmentRecord = {

      score,

      totalQuestions:
        QUESTIONS.length,

      percentage,

      passed,

      attemptCount:
        state.attemptCount,

      lastAttemptAt:
        new Date().toISOString(),

      answers

    };


    if (passed) {

      currentCompletedChapters[
        CHAPTER_ID
      ] = true;
    }


    const updatedProgress = {

      ...currentProgress,

      assessments: {

        ...currentAssessments,

        [ASSESSMENT_KEY]:
          assessmentRecord
      },

      completedChapters:
        currentCompletedChapters

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

  } catch (error) {

    console.error(
      "Failed to save assessment:",
      error
    );

    alert(
      "Your result could not be saved. Please try again."
    );
  }
}


/* -------------------------------------------------------
   SHOW RESULT
------------------------------------------------------- */

function showResult({
  score,
  percentage,
  passed
}) {

  formEl.classList.add("hidden");
  resultSection.classList.remove("hidden");

  scoreText.textContent =
    `${score} / ${QUESTIONS.length}`;

  percentageText.textContent =
    `${percentage}%`;


  if (passed) {

    resultIcon.textContent = "🎉";

    resultTitle.textContent =
      "Assessment Passed!";

    resultMessage.textContent =
      "Great work! You completed the Polymorphism assessment successfully.";

    resultDetails.innerHTML = `
      <div class="success-message">
        Chapter 12 is now completed.
        You can continue to the Abstraction chapter.
      </div>
    `;

    continueBtn.textContent =
      "Continue to OOPs";

  } else {

    resultIcon.textContent = "📘";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers to pass.`;

    resultDetails.innerHTML = `
      <div class="failure-message">
        Review static polymorphism, dynamic polymorphism,
        overloading, overriding, and virtual functions,
        then try again.
      </div>
    `;

    continueBtn.textContent =
      "Back to OOPs";
  }
}


/* -------------------------------------------------------
   RETRY
------------------------------------------------------- */

retryBtn.addEventListener(
  "click",
  () => {

    state.submitted = false;

    resultSection.classList.add(
      "hidden"
    );

    formEl.classList.remove(
      "hidden"
    );

    renderQuestions();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
);


/* -------------------------------------------------------
   CONTINUE
------------------------------------------------------- */

continueBtn.addEventListener(
  "click",
  () => {
    redirectToOops();
  }
);


/* -------------------------------------------------------
   REDIRECT
------------------------------------------------------- */

function redirectToOops() {

  window.location.href =
    "oops.html";
}


/* -------------------------------------------------------
   ESCAPE HTML
------------------------------------------------------- */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}