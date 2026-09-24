import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   CONFIG
========================= */

const MODULE_ID =
  "dsa-search-sort-hash";

const TOTAL_QUESTIONS = 6;

const PASS_MARK = 5;


/* =========================
   ANSWER KEY
========================= */

const correctAnswers = {
  q1: "C",
  q2: "A",
  q3: "B",
  q4: "B",
  q5: "B",
  q6: "A"
};


/* =========================
   DOM
========================= */

const assessmentForm =
  document.getElementById(
    "assessmentForm"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
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

const scoreDisplay =
  document.getElementById(
    "scoreDisplay"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const backLearningBtn =
  document.getElementById(
    "backLearningBtn"
  );


/* =========================
   STATE
========================= */

let currentUser = null;


/* =========================
   AUTH
========================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }

    currentUser = user;

    await checkExistingResult();

  }
);


/* =========================
   CHECK EXISTING RESULT
========================= */

async function checkExistingResult() {

  try {

    const userRef =
      doc(
        db,
        "users",
        currentUser.uid
      );

    const snapshot =
      await getDoc(userRef);

    if (!snapshot.exists()) {
      return;
    }

    const data =
      snapshot.data();

    const progress =
      data.dsaLearningProgress;

    if (!progress) {
      return;
    }

    const result =
      progress.assessments?.[MODULE_ID];

    if (
      result &&
      result.passed === true
    ) {

      showResult(
        result.score || PASS_MARK,
        true,
        true
      );

    }

  } catch (error) {

    console.error(
      "Error checking previous assessment:",
      error
    );

  }

}


/* =========================
   SUBMIT
========================= */

assessmentForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const answers =
      getAnswers();

    const unanswered =
      Object.keys(correctAnswers)
        .filter(
          (question) =>
            !answers[question]
        );

    if (
      unanswered.length > 0
    ) {

      alert(
        `Please answer all questions. ${unanswered.length} question(s) are unanswered.`
      );

      return;

    }

    submitBtn.disabled = true;

    submitBtn.textContent =
      "Submitting...";

    const score =
      calculateScore(
        answers
      );

    const percentage =
      Math.round(
        (score /
          TOTAL_QUESTIONS) *
          100
      );

    const passed =
      score >= PASS_MARK;

    try {

      await saveAssessmentResult(
        score,
        percentage,
        passed
      );

      showResult(
        score,
        passed,
        false
      );

    } catch (error) {

      console.error(
        "Assessment save error:",
        error
      );

      alert(
        "Unable to save your result. Please try again."
      );

      submitBtn.disabled = false;

      submitBtn.textContent =
        "Submit Assessment";

    }

  }
);


/* =========================
   GET ANSWERS
========================= */

function getAnswers() {

  const answers = {};

  Object.keys(
    correctAnswers
  ).forEach(
    (question) => {

      const selected =
        document.querySelector(
          `input[name="${question}"]:checked`
        );

      answers[question] =
        selected
          ? selected.value
          : null;

    }
  );

  return answers;

}


/* =========================
   CALCULATE SCORE
========================= */

function calculateScore(
  answers
) {

  let score = 0;

  Object.keys(
    correctAnswers
  ).forEach(
    (question) => {

      if (
        answers[question] ===
        correctAnswers[question]
      ) {

        score++;

      }

    }
  );

  return score;

}


/* =========================
   SAVE RESULT
========================= */

async function saveAssessmentResult(
  score,
  percentage,
  passed
) {

  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );

  const snapshot =
    await getDoc(userRef);

  let progress = {
    completedTopics: {},
    selfChecks: {},
    completedModules: {},
    assessments: {}
  };

  if (snapshot.exists()) {

    const data =
      snapshot.data();

    if (data.dsaLearningProgress) {

      progress = {

        completedTopics:
          data.dsaLearningProgress
            .completedTopics || {},

        selfChecks:
          data.dsaLearningProgress
            .selfChecks || {},

        completedModules:
          data.dsaLearningProgress
            .completedModules || {},

        assessments:
          data.dsaLearningProgress
            .assessments || {}

      };

    }

  }


  progress.assessments[
    MODULE_ID
  ] = {

    score,

    total:
      TOTAL_QUESTIONS,

    percentage,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    progress.completedModules[
      MODULE_ID
    ] = true;

  }


  await setDoc(
    userRef,
    {
      dsaLearningProgress:
        progress
    },
    {
      merge: true
    }
  );

}


/* =========================
   SHOW RESULT
========================= */

function showResult(
  score,
  passed,
  existingResult
) {

  assessmentForm.style.display =
    "none";

  resultSection.style.display =
    "block";

  scoreDisplay.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;


  if (passed) {

    resultIcon.textContent =
      "🎉";

    resultTitle.textContent =
      existingResult
        ? "Assessment Already Passed"
        : "Searching, Sorting & Hashing Completed!";

    resultMessage.textContent =
      existingResult
        ? "You have already passed this module assessment."
        : "Excellent! Module 4 is now unlocked.";

    retryBtn.style.display =
      "none";

  } else {

    resultIcon.textContent =
      "📚";

    resultTitle.textContent =
      "Keep Practicing";

    resultMessage.textContent =
      `You need at least ${PASS_MARK}/${TOTAL_QUESTIONS} to pass. Review the module topics and try again.`;

    retryBtn.style.display =
      "inline-flex";

  }

}


/* =========================
   RETRY
========================= */

retryBtn.addEventListener(
  "click",
  () => {

    resultSection.style.display =
      "none";

    assessmentForm.style.display =
      "block";

    submitBtn.disabled =
      false;

    submitBtn.textContent =
      "Submit Assessment";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/* =========================
   BACK TO LEARNING
========================= */

backLearningBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "dsa-learning.html";

  }
);