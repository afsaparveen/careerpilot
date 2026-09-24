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

const ASSESSMENT_KEY = "abstraction";
const CHAPTER_ID = "oops-abstraction";


const QUESTIONS = [

  {
    question:
      "What is the main purpose of abstraction?",

    options: [
      "To expose all internal implementation details",
      "To hide unnecessary implementation details and show essential features",
      "To prevent inheritance",
      "To make every method private"
    ],

    answer: 1
  },


  {
    question:
      "In C++, full abstraction in the notes is implemented through:",

    options: [
      "Constructors only",
      "Static data members",
      "Abstract classes with pure virtual functions",
      "Friend classes"
    ],

    answer: 2
  },


  {
    question:
      "What is an abstract class in C++?",

    options: [
      "A class that can always be instantiated",
      "A class that cannot be instantiated and contains at least one pure virtual function",
      "A class containing only static functions",
      "A class that cannot have derived classes"
    ],

    answer: 1
  },


  {
    question:
      "What is a pure virtual function?",

    options: [
      "A function that has no name",
      "A function declared in a base class with no definition there and meant to be overridden by derived classes",
      "A function that must be static",
      "A private constructor"
    ],

    answer: 1
  },


  {
    question:
      "What syntax makes a function a pure virtual function in C++?",

    options: [
      "virtual void area() = 0;",
      "pure void area();",
      "abstract void area();",
      "void area() == 0;"
    ],

    answer: 0
  },


  {
    question:
      "Can an object of an abstract C++ class be created directly?",

    options: [
      "Yes, always",
      "Yes, only using a pointer",
      "No",
      "Only inside main()"
    ],

    answer: 2
  },


  {
    question:
      "In the Shape example, why is Shape made abstract?",

    options: [
      "Because Shape should never contain methods",
      "Because only specific shapes such as Circle or Rectangle should be created",
      "Because C++ does not support classes",
      "Because Shape is a static class"
    ],

    answer: 1
  },


  {
    question:
      "Which statement about a Java abstract class is correct?",

    options: [
      "It can always be instantiated directly",
      "It can contain abstract methods and concrete methods",
      "It cannot contain fields",
      "It cannot have constructors"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is true about a Java abstract class according to the notes?",

    options: [
      "It can contain fields, constructors, and access modifiers",
      "It can only contain abstract methods",
      "It cannot have concrete methods",
      "It must contain only static fields"
    ],

    answer: 0
  },


  {
    question:
      "What must a derived C++ class do when it inherits an abstract class containing a pure virtual function?",

    options: [
      "Delete the base class",
      "Make every method static",
      "Implement/override the required pure virtual function",
      "Create an object of the abstract base class"
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
      Chapter 12 must be completed first.
    */

    const polymorphismCompleted =
      oopsProgress.completedChapters?.[
        "oops-polymorphism"
      ] === true;

    if (!polymorphismCompleted) {

      alert(
        "Please complete the Polymorphism chapter assessment before attempting the Abstraction assessment."
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
      "Great work! You completed the Abstraction assessment successfully.";

    resultDetails.innerHTML = `
      <div class="success-message">
        Chapter 13 is now completed.
        You can continue to the Java Abstraction /
        Interface chapter.
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
        Review abstraction, abstract classes,
        and pure virtual functions, then try again.
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