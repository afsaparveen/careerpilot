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
  "dataLinkLayer";

const CHAPTER_ID =
  "cn-data-link-layer";


/*
  Questions derived strictly from the
  Data Link Layer chapter of the uploaded
  Computer Networks Notes PDF.

  Source pages:
  17-27
*/


const questions = [

  {
    question:
      "What is the position of the Data Link Layer in the OSI model?",

    options: [
      "1st layer from the bottom",
      "2nd layer from the bottom",
      "3rd layer from the bottom",
      "4th layer from the bottom"
    ],

    answer: 1
  },


  {
    question:
      "What is the form of data handled by the Data Link Layer?",

    options: [
      "Bits",
      "Frames",
      "Packets",
      "Segments"
    ],

    answer: 1
  },


  {
    question:
      "Which sublayer of the Data Link Layer manages access to the physical transmission medium?",

    options: [
      "LLC",
      "MAC",
      "TCP",
      "IP"
    ],

    answer: 1
  },


  {
    question:
      "In Stop-and-Wait flow control, what is the window size?",

    options: [
      "1",
      "2",
      "4",
      "Variable and unlimited"
    ],

    answer: 0
  },


  {
    question:
      "In Go-Back-N, the receiver sends:",

    options: [
      "No acknowledgments",
      "Only negative acknowledgments",
      "Cumulative acknowledgments",
      "Acknowledgments only after the entire file"
    ],

    answer: 2
  },


  {
    question:
      "Which statement correctly describes Selective Repeat ARQ?",

    options: [
      "All frames are retransmitted after any error",
      "Only lost or damaged frames are retransmitted",
      "No acknowledgments are used",
      "Only one frame can ever be transmitted"
    ],

    answer: 1
  },


  {
    question:
      "Which technique uses polynomial division for error detection?",

    options: [
      "Parity",
      "Checksum",
      "Cyclic Redundancy Check",
      "Hamming Code"
    ],

    answer: 2
  },


  {
    question:
      "In CSMA/CD, what does a station do after detecting a collision?",

    options: [
      "Immediately closes the network",
      "Sends a jam signal and waits for a random backoff",
      "Changes its IP address",
      "Sends the frame again immediately"
    ],

    answer: 1
  },


  {
    question:
      "Which channelization technique gives users separate time slots?",

    options: [
      "FDMA",
      "TDMA",
      "CDMA",
      "ALOHA"
    ],

    answer: 1
  },


  {
    question:
      "Which field of an Ethernet frame is used to detect corruption at the receiver?",

    options: [
      "Destination Address",
      "Payload",
      "Preamble",
      "CRC"
    ],

    answer: 3
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

  errorBox.textContent =
    message;

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
   RENDER QUESTIONS
   ========================= */

function renderQuestions() {

  questionsContainer.innerHTML = "";


  questions.forEach(
    (item, index) => {

      const wrapper =
        document.createElement(
          "div"
        );

      wrapper.className =
        "question";


      wrapper.innerHTML = `

        <div class="question-header">

          <span class="question-number">
            Question ${index + 1}
          </span>

        </div>


        <h3>
          ${escapeHtml(
            item.question
          )}
        </h3>


        <div class="options">

          ${item.options
            .map(
              (
                option,
                optionIndex
              ) => `

                <label class="option">

                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                  />

                  <span>

                    ${String.fromCharCode(
                      65 + optionIndex
                    )}.

                    ${escapeHtml(
                      option
                    )}

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
    answered ===
    questions.length
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
    `${Math.max(
      5,
      percentage
    )}%`;

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

        unanswered.push(
          index + 1
        );

      }

    }
  );


  if (
    unanswered.length > 0
  ) {

    showError(
      `Please answer all questions before submitting. Unanswered question(s): ${unanswered.join(", ")}.`
    );


    const firstQuestion =
      document.querySelectorAll(
        ".question"
      )[
        unanswered[0] - 1
      ];


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
   FIRESTORE
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
    await getDoc(
      userRef
    );


  const existingData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const existingProgress =
    existingData.cnProgress ||
    {};


  const existingAssessments =
    existingProgress.assessments ||
    {};


  const existingCompletedChapters =
    existingProgress.completedChapters ||
    {};


  const previousAssessment =
    existingAssessments[
      ASSESSMENT_KEY
    ] || {};


  const previousAttempts =
    previousAssessment.attempts ||
    [];


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


  if (
    !validateAllAnswered()
  ) {
    return;
  }


  submitBtn.disabled =
    true;

  submitBtn.textContent =
    "Checking...";


  let score = 0;


  questions.forEach(
    (
      question,
      index
    ) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (
        selected &&
        Number(
          selected.value
        ) ===
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
    percentage >=
    PASS_PERCENTAGE;


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


    submitBtn.disabled =
      false;

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

  resultBox.hidden =
    false;


  scoreValue.textContent =
    `${score}/${questions.length}`;


  percentageValue.textContent =
    `${percentage}%`;


  passValue.textContent =
    `${PASS_SCORE}/${questions.length}`;


  if (passed) {

    resultIcon.textContent =
      "✓";


    resultTitle.textContent =
      "Chapter 4 Passed!";


    resultMessage.textContent =
      `Great work! You scored ${score}/${questions.length} (${percentage}%). The Data Link Layer chapter is now completed and Chapter 5 — Network Layer is unlocked.`;

  } else {

    resultIcon.textContent =
      "!";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You scored ${score}/${questions.length} (${percentage}%). You need at least ${PASS_SCORE}/${questions.length} (75%) to pass this chapter. Review Data Link Layer and try again.`;

  }


  form.style.display =
    "none";


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


  resultBox.hidden =
    true;


  form.style.display =
    "";


  hideError();


  submitBtn.disabled =
    false;


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


    currentUser =
      user;

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