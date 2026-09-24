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

const ASSESSMENT_KEY = "static";
const CHAPTER_ID = "oops-static";


const QUESTIONS = [

  {
    question:
      "What is a static data member?",

    options: [
      "A variable created separately for every object",
      "A variable shared by all objects of a class",
      "A variable that can only be local",
      "A variable that cannot be modified"
    ],

    answer: 1
  },


  {
    question:
      "How many copies of a static data member are allocated according to the notes?",

    options: [
      "One copy for every object",
      "Two copies for every object",
      "Only one copy",
      "No copy is allocated"
    ],

    answer: 2
  },


  {
    question:
      "What happens when one object changes a shared static data member?",

    options: [
      "Only that object sees the change",
      "The class is destroyed",
      "The change is reflected across all objects",
      "A new static member is created"
    ],

    answer: 2
  },


  {
    question:
      "A static data member is shared among:",

    options: [
      "Only derived classes",
      "All instances of the class",
      "Only one method",
      "Only constructors"
    ],

    answer: 1
  },


  {
    question:
      "According to the notes, when does a static data member exist?",

    options: [
      "Only after every object is created",
      "Only while a constructor runs",
      "Even before any object is created",
      "Only after main() ends"
    ],

    answer: 2
  },


  {
    question:
      "What is a static member function?",

    options: [
      "A function that belongs to a specific object only",
      "A function that belongs to the class rather than any object",
      "A constructor with no parameters",
      "A private function"
    ],

    answer: 1
  },


  {
    question:
      "Can a static member function be called without creating an object?",

    options: [
      "No",
      "Yes",
      "Only in C++",
      "Only in Java"
    ],

    answer: 1
  },


  {
    question:
      "Which members can a static member function directly access according to the notes?",

    options: [
      "Only non-static members",
      "Only static members",
      "Only constructors",
      "Only private members"
    ],

    answer: 1
  },


  {
    question:
      "How is a static member function called in C++ according to the notes?",

    options: [
      "object.showCount()",
      "ClassName::showCount()",
      "ClassName->showCount()",
      "static.showCount()"
    ],

    answer: 1
  },


  {
    question:
      "How is a static member function called in Java according to the notes?",

    options: [
      "ClassName.showCount()",
      "ClassName::showCount()",
      "object->showCount()",
      "static::showCount()"
    ],

    answer: 0
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
      Chapter 14 must be completed first.
    */

    const javaAbstractionCompleted =
      oopsProgress.completedChapters?.[
        "oops-java-abstraction"
      ] === true;

    if (!javaAbstractionCompleted) {

      alert(
        "Please complete the Java Abstract Class & Interface chapter assessment before attempting the Static Data Member & Function assessment."
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
      "Excellent! You completed all 15 OOP chapters.";

    resultDetails.innerHTML = `
      <div class="success-message">
        Chapter 15 is now completed.
        Your complete OOP learning path is finished.
        You are ready for the final OOP assessment.
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
        Review static data members, static member
        functions, shared class-level data, and
        static access rules, then try again.
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