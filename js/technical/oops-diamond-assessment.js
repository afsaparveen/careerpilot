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

const ASSESSMENT_KEY = "diamond";
const CHAPTER_ID = "oops-diamond";

const QUESTIONS = [

  {
    question:
      "What is the Diamond Problem in multiple inheritance?",
    options: [
      "A problem caused by constructor overloading",
      "A problem where a class inherits from two classes that share a common base class, causing ambiguity",
      "A problem caused by private inheritance only",
      "A problem related to memory allocation"
    ],
    answer: 1
  },

  {
    question:
      "In the classic Diamond Problem example, which two classes inherit from class A?",
    options: [
      "A and D",
      "B and D",
      "B and C",
      "C and D"
    ],
    answer: 2
  },

  {
    question:
      "In the Diamond Problem example, which class inherits from both B and C?",
    options: [
      "A",
      "B",
      "C",
      "D"
    ],
    answer: 3
  },

  {
    question:
      "Why does `obj.show()` become ambiguous in the C++ Diamond Problem example?",
    options: [
      "Because show() is private",
      "Because D has no constructor",
      "Because the compiler cannot decide whether to use the copy inherited through B or through C",
      "Because C++ does not support inheritance"
    ],
    answer: 2
  },

  {
    question:
      "Which syntax can manually resolve the ambiguity in the C++ example?",
    options: [
      "obj.show(A)",
      "obj.B::show()",
      "obj::B.show()",
      "B.obj.show()"
    ],
    answer: 1
  },

  {
    question:
      "What does virtual inheritance in C++ ensure in the Diamond Problem?",
    options: [
      "Each derived class gets a different copy of the base class",
      "Only one copy of the shared base class is inherited",
      "Multiple constructors are created",
      "The base class becomes private"
    ],
    answer: 1
  },

  {
    question:
      "Which declaration demonstrates virtual inheritance in C++?",
    options: [
      "class B : public virtual A { };",
      "class B : virtual public A { };",
      "class B : private virtual A { };",
      "class B : A virtual { };"
    ],
    answer: 1
  },

  {
    question:
      "How does Java avoid the Diamond Problem with classes?",
    options: [
      "By allowing unlimited multiple class inheritance",
      "By automatically choosing the first parent class",
      "By not allowing multiple class inheritance",
      "By making every method static"
    ],
    answer: 2
  },

  {
    question:
      "What does Java use for safe multiple inheritance?",
    options: [
      "Packages",
      "Interfaces",
      "Constructors",
      "Namespaces"
    ],
    answer: 1
  },

  {
    question:
      "In the Java interface example, why is there no ambiguity?",
    options: [
      "Because interfaces cannot contain methods",
      "Because class D is forced to define its own `show()` method",
      "Because Java ignores inherited methods",
      "Because B and C are converted into objects"
    ],
    answer: 1
  }

];


const state = {
  user: null,
  answers: {},
  submitted: false,
  attemptCount: 0,
  previousResult: null
};


const loadingEl = document.getElementById("assessmentLoading");
const formEl = document.getElementById("assessmentForm");
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

  await loadProgress();

  renderQuestions();

  loadingEl.classList.add("hidden");
  formEl.classList.remove("hidden");
});


/* -------------------------------------------------------
   LOAD OOPS PROGRESS
------------------------------------------------------- */

async function loadProgress() {

  const userRef = doc(db, "users", state.user.uid);

  try {

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      redirectToOops();
      return;
    }

    const userData = snapshot.data();

    const oopsProgress =
      userData.oopsProgress || {};

    /*
      Chapter 10 must be completed before Chapter 11.
    */

    const chapter10Completed =
      oopsProgress.completedChapters?.[
        "oops-inheritance"
      ] === true;

    if (!chapter10Completed) {
      alert(
        "Please complete the Inheritance chapter assessment before attempting the Diamond Problem assessment."
      );

      redirectToOops();
      return;
    }

    const assessment =
      oopsProgress.assessments?.[ASSESSMENT_KEY];

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

    const questionNumber = index + 1;

    const questionCard =
      document.createElement("div");

    questionCard.className =
      "question-card";

    questionCard.innerHTML = `
      <div class="question-header">
        <span class="question-number">
          Q${questionNumber}
        </span>

        <h3>
          ${escapeHtml(question.question)}
        </h3>
      </div>

      <div class="options-list">

        ${question.options
          .map((option, optionIndex) => {

            return `
              <label class="option-item">

                <input
                  type="radio"
                  name="question-${index}"
                  value="${optionIndex}"
                  required
                />

                <span class="option-letter">
                  ${String.fromCharCode(65 + optionIndex)}
                </span>

                <span class="option-text">
                  ${escapeHtml(option)}
                </span>

              </label>
            `;

          })
          .join("")}

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

formEl.addEventListener("submit", async (event) => {

  event.preventDefault();

  if (state.submitted) {
    return;
  }

  const formData =
    new FormData(formEl);

  let score = 0;

  const answers = {};

  QUESTIONS.forEach((question, index) => {

    const selected =
      formData.get(`question-${index}`);

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
  });

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
    passed,
    answers
  });
});


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
  passed,
  answers
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
      "Excellent! You completed the Diamond Problem assessment successfully.";

    resultDetails.innerHTML = `
      <div class="success-message">
        Chapter 11 is now completed.
        You can continue to the Polymorphism chapter.
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
        Review the Diamond Problem topic and try the assessment again.
      </div>
    `;

    continueBtn.textContent =
      "Back to OOPs";
  }
}


/* -------------------------------------------------------
   RETRY
------------------------------------------------------- */

retryBtn.addEventListener("click", () => {

  state.answers = {};
  state.submitted = false;

  resultSection.classList.add("hidden");
  formEl.classList.remove("hidden");

  renderQuestions();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


/* -------------------------------------------------------
   CONTINUE
------------------------------------------------------- */

continueBtn.addEventListener("click", () => {

  redirectToOops();
});


/* -------------------------------------------------------
   REDIRECT
------------------------------------------------------- */

function redirectToOops() {

  window.location.href =
    "oops.html";
}


/* -------------------------------------------------------
   HTML ESCAPE
------------------------------------------------------- */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}