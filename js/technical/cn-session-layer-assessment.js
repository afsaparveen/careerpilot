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

const ASSESSMENT_KEY =
  "sessionLayer";

const CHAPTER_ID =
  "cn-session-layer";


/*
  Questions derived strictly from page 45
  of the uploaded Computer Networks Notes PDF.
*/


const questions = [

  {
    question:
      "What is the position of the Session Layer in the OSI model?",

    options: [
      "3rd layer from the bottom",
      "4th layer from the bottom",
      "5th layer from the bottom",
      "6th layer from the bottom"
    ],

    answer: 2
  },


  {
    question:
      "What is the main purpose of the Session Layer?",

    options: [
      "Routing packets",
      "Establishing, managing and terminating communication sessions",
      "Assigning IP addresses",
      "Detecting transmission errors"
    ],

    answer: 1
  },


  {
    question:
      "What does Session Establishment do?",

    options: [
      "Sets up and manages sessions between communicating devices",
      "Converts IP addresses into MAC addresses",
      "Divides packets into frames",
      "Assigns port numbers"
    ],

    answer: 0
  },


  {
    question:
      "What does communication synchronization use to help recovery after failures?",

    options: [
      "IP addresses",
      "MAC addresses",
      "Checkpoints or synchronization bits",
      "DNS records"
    ],

    answer: 2
  },


  {
    question:
      "What is the purpose of synchronization points?",

    options: [
      "To increase bandwidth",
      "To recover by rolling back to the last known good state",
      "To assign network addresses",
      "To encrypt the session"
    ],

    answer: 1
  },


  {
    question:
      "What is the role of dialog management?",

    options: [
      "Controls who sends and who receives",
      "Controls IP allocation",
      "Controls routing tables",
      "Controls packet fragmentation"
    ],

    answer: 0
  },


  {
    question:
      "In the Session Layer's half-duplex mode, who can transmit?",

    options: [
      "Both devices simultaneously",
      "Only the token holder",
      "Only the server",
      "Only the client"
    ],

    answer: 1
  },


  {
    question:
      "What does the Session Layer manage during data transfer?",

    options: [
      "Only packet routing",
      "The exchange of data within the session",
      "Only MAC addresses",
      "Only IP addresses"
    ],

    answer: 1
  },


  {
    question:
      "Which resynchronization mode sets new synchronization points?",

    options: [
      "Set",
      "Abandon",
      "Restart",
      "Reset"
    ],

    answer: 0
  },


  {
    question:
      "Which resynchronization mode restarts a session from a previously saved state?",

    options: [
      "Set",
      "Abandon",
      "Restart",
      "Resume"
    ],

    answer: 2
  }

];


let currentUser = null;
let submitted = false;


/* =========================
   DOM
   ========================= */

const form =
  document.getElementById(
    "assessmentForm"
  );

const questionsContainer =
  document.getElementById(
    "questionsContainer"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
  );

const backBtn =
  document.getElementById(
    "backBtn"
  );

const resultBox =
  document.getElementById(
    "resultBox"
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

const scoreValue =
  document.getElementById(
    "scoreValue"
  );

const percentageValue =
  document.getElementById(
    "percentageValue"
  );

const passValue =
  document.getElementById(
    "passValue"
  );

const continueBtn =
  document.getElementById(
    "continueBtn"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const progressText =
  document.getElementById(
    "progressText"
  );

const answeredText =
  document.getElementById(
    "answeredText"
  );

const progressBar =
  document.getElementById(
    "progressBar"
  );

const errorBox =
  document.getElementById(
    "errorBox"
  );


/* =========================
   ERROR
   ========================= */

function showError(message) {

  errorBox.textContent = message;
  errorBox.hidden = false;

}


function hideError() {

  errorBox.textContent = "";
  errorBox.hidden = true;

}


/* =========================
   ESCAPE HTML
   ========================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   RENDER
   ========================= */

function renderQuestions() {

  questionsContainer.innerHTML = "";

  questions.forEach(
    (item, index) => {

      const wrapper =
        document.createElement("div");

      wrapper.className = "question";

      wrapper.innerHTML = `

        <div class="question-header">
          <span class="question-number">
            Question ${index + 1}
          </span>
        </div>

        <h3>
          ${escapeHtml(item.question)}
        </h3>

        <div class="options">

          ${item.options
            .map(
              (option, optionIndex) => `
                <label class="option">

                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                  />

                  <span>
                    ${String.fromCharCode(65 + optionIndex)}.
                    ${escapeHtml(option)}
                  </span>

                </label>
              `
            )
            .join("")}

        </div>
      `;

      questionsContainer.appendChild(
        wrapper
      );
    }
  );


  document
    .querySelectorAll(
      'input[type="radio"]'
    )
    .forEach(
      (input) => {

        input.addEventListener(
          "change",
          updateProgress
        );

      }
    );


  updateProgress();
}


/* =========================
   PROGRESS
   ========================= */

function getAnsweredCount() {

  let answered = 0;

  questions.forEach(
    (_, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );

      if (selected) {
        answered++;
      }

    }
  );

  return answered;
}


function updateProgress() {

  const answered =
    getAnsweredCount();

  answeredText.textContent =
    `${answered} answered`;


  if (
    answered === questions.length
  ) {

    progressText.textContent =
      `All ${questions.length} questions answered`;

  } else {

    const nextQuestion =
      Math.min(
        answered + 1,
        questions.length
      );

    progressText.textContent =
      `Question ${nextQuestion} of ${questions.length}`;

  }


  const percentage =
    (
      answered /
      questions.length
    ) * 100;


  progressBar.style.width =
    `${Math.max(5, percentage)}%`;
}


/* =========================
   VALIDATION
   ========================= */

function validateAllAnswered() {

  const unanswered = [];

  questions.forEach(
    (_, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );

      if (!selected) {
        unanswered.push(index + 1);
      }

    }
  );


  if (unanswered.length > 0) {

    showError(
      `Please answer all questions before submitting. Unanswered question(s): ${unanswered.join(", ")}.`
    );


    const firstQuestion =
      document.querySelectorAll(
        ".question"
      )[unanswered[0] - 1];


    if (firstQuestion) {

      firstQuestion.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }


    return false;
  }


  hideError();

  return true;
}


/* =========================
   SAVE RESULT
   ========================= */

async function saveAssessmentResult(
  score,
  percentage,
  passed
) {

  if (!currentUser) {

    throw new Error(
      "User is not authenticated."
    );

  }


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const snapshot =
    await getDoc(userRef);


  const existingData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const existingProgress =
    existingData.cnProgress || {};


  const existingAssessments =
    existingProgress.assessments || {};


  const existingCompletedChapters =
    existingProgress.completedChapters || {};


  const previousAssessment =
    existingAssessments[
      ASSESSMENT_KEY
    ] || {};


  const previousAttempts =
    previousAssessment.attempts || [];


  const attempt = {

    score,

    total:
      questions.length,

    percentage,

    passed,

    completedAt:
      new Date().toISOString()

  };


  const updatedProgress = {

    ...existingProgress,

    assessments: {

      ...existingAssessments,

      [ASSESSMENT_KEY]: {

        score,

        total:
          questions.length,

        percentage,

        passed,

        attempts: [
          ...previousAttempts,
          attempt
        ]

      }

    },

    completedChapters: {

      ...existingCompletedChapters,

      [CHAPTER_ID]:
        passed
          ? true
          : Boolean(
              existingCompletedChapters[
                CHAPTER_ID
              ]
            )

    }

  };


  await setDoc(
    userRef,
    {
      cnProgress:
        updatedProgress
    },
    {
      merge: true
    }
  );
}


/* =========================
   SUBMIT
   ========================= */

async function submitAssessment() {

  if (submitted) {
    return;
  }


  if (!validateAllAnswered()) {
    return;
  }


  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";


  let score = 0;


  questions.forEach(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (
        selected &&
        Number(selected.value) ===
          question.answer
      ) {

        score++;

      }

    }
  );


  const percentage =
    Math.round(
      (
        score /
        questions.length
      ) * 100
    );


  const passed =
    percentage >= PASS_PERCENTAGE;


  try {

    await saveAssessmentResult(
      score,
      percentage,
      passed
    );


    submitted = true;


    showResult(
      score,
      percentage,
      passed
    );

  } catch (error) {

    console.error(error);


    showError(
      "Your result could not be saved. Please check your Firebase connection and try again."
    );


    submitBtn.disabled = false;
    submitBtn.textContent =
      "Submit Assessment";
  }
}


/* =========================
   RESULT
   ========================= */

function showResult(
  score,
  percentage,
  passed
) {

  resultBox.hidden = false;


  scoreValue.textContent =
    `${score}/${questions.length}`;


  percentageValue.textContent =
    `${percentage}%`;


  passValue.textContent =
    `${PASS_SCORE}/${questions.length}`;


  if (passed) {

    resultIcon.textContent = "✓";

    resultTitle.textContent =
      "Chapter 7 Passed!";

    resultMessage.textContent =
      `Great work! You scored ${score}/${questions.length} (${percentage}%). The Session Layer chapter is now completed and Chapter 8 — Presentation Layer is unlocked.`;

  } else {

    resultIcon.textContent = "!";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You scored ${score}/${questions.length} (${percentage}%). You need at least ${PASS_SCORE}/${questions.length} (75%) to pass this chapter. Review Session Layer and try again.`;
  }


  form.style.display = "none";


  resultBox.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================
   RETRY
   ========================= */

function resetAssessment() {

  submitted = false;

  form.reset();

  resultBox.hidden = true;

  form.style.display = "";

  hideError();

  submitBtn.disabled = false;

  submitBtn.textContent =
    "Submit Assessment";

  updateProgress();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   AUTH
   ========================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;
    }

    currentUser = user;
  }
);


/* =========================
   EVENTS
   ========================= */

submitBtn.addEventListener(
  "click",
  submitAssessment
);


backBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "cn.html";

  }
);


continueBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "cn.html";

  }
);


retryBtn.addEventListener(
  "click",
  resetAssessment
);


renderQuestions();