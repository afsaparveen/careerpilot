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

const ASSESSMENT_KEY = "javaAbstraction";
const CHAPTER_ID = "oops-java-abstraction";


const QUESTIONS = [

  {
    question:
      "What is an interface according to the notes?",

    options: [
      "A class that must always contain constructors",
      "A contract that defines what a class must do, but not how",
      "A class used only for storing variables",
      "A class that can always be instantiated"
    ],

    answer: 1
  },


  {
    question:
      "Which type of method can a Java interface contain according to the notes?",

    options: [
      "Only abstract methods",
      "Abstract, default, and static methods",
      "Only constructors",
      "Only private instance methods"
    ],

    answer: 1
  },


  {
    question:
      "Which method in the Flyable interface has a body?",

    options: [
      "fly()",
      "land()",
      "Both fly() and land()",
      "Neither"
    ],

    answer: 1
  },


  {
    question:
      "Which method in the Flyable example is static?",

    options: [
      "fly()",
      "land()",
      "info()",
      "None"
    ],

    answer: 2
  },


  {
    question:
      "Which statement about constructors in an interface is correct according to the notes?",

    options: [
      "Interfaces must have one constructor",
      "Interfaces can have multiple constructors",
      "Interfaces cannot have constructors",
      "Interfaces have protected constructors"
    ],

    answer: 2
  },


  {
    question:
      "What kind of fields does the notes specify for a Java interface?",

    options: [
      "Only private instance fields",
      "Only protected fields",
      "Only public static final constants",
      "Instance and static fields of any type"
    ],

    answer: 2
  },


  {
    question:
      "What is true about abstract classes in Java according to the notes?",

    options: [
      "They cannot have concrete methods",
      "They cannot have fields",
      "They can have abstract methods, concrete methods, fields, constructors, and access modifiers",
      "They must contain only static methods"
    ],

    answer: 2
  },


  {
    question:
      "Which keyword is used when a class inherits from an abstract class?",

    options: [
      "implements",
      "extends",
      "inherits",
      "interface"
    ],

    answer: 1
  },


  {
    question:
      "Which keyword is used when a class implements an interface?",

    options: [
      "extends",
      "inherits",
      "implements",
      "abstract"
    ],

    answer: 2
  },


  {
    question:
      "Which statement about multiple inheritance is given in the notes?",

    options: [
      "Abstract classes support multiple inheritance",
      "Interfaces support multiple inheritance",
      "Neither abstract classes nor interfaces can be inherited",
      "Only constructors support multiple inheritance"
    ],

    answer: 1
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
   AUTHENTICATION
------------------------------------------------------- */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  state.user = user;

  const allowed =
    await loadProgress();

  if (!allowed) {
    return;
  }

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
      return false;
    }

    const userData =
      snapshot.data();

    const oopsProgress =
      userData.oopsProgress || {};

    /*
      Chapter 13 must be completed first.
    */

    const abstractionCompleted =
      oopsProgress.completedChapters?.[
        "oops-abstraction"
      ] === true;

    if (!abstractionCompleted) {

      alert(
        "Please complete the Abstraction chapter assessment before attempting the Java Abstract Class & Interface assessment."
      );

      redirectToOops();
      return false;
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

    return true;

  } catch (error) {

    console.error(
      "Failed to load OOPs progress:",
      error
    );

    alert(
      "Unable to load your assessment progress."
    );

    redirectToOops();

    return false;
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

  resultSection.classList.remove(
    "hidden"
  );

  scoreText.textContent =
    `${score} / ${QUESTIONS.length}`;

  percentageText.textContent =
    `${percentage}%`;


  if (passed) {

    resultIcon.textContent =
      "🎉";

    resultTitle.textContent =
      "Assessment Passed!";

    resultMessage.textContent =
      "Excellent! You completed the Java Abstract Class & Interface assessment.";

    resultDetails.innerHTML = `
      <div class="success-message">
        Chapter 14 is now completed.
        You can continue to the Static Data Member & Function chapter.
      </div>
    `;

    continueBtn.textContent =
      "Continue to OOPs";

  } else {

    resultIcon.textContent =
      "📘";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers to pass.`;

    resultDetails.innerHTML = `
      <div class="failure-message">
        Review Java abstract classes, interfaces,
        default methods, static methods, fields,
        constructors, and multiple inheritance.
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