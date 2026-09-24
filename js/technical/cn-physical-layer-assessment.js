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
  "physicalLayer";

const CHAPTER_ID =
  "cn-physical-layer";


/*
  These questions are derived directly from
  the Physical Layer chapter on pages 15-16
  of the uploaded Computer Networks Notes PDF.

  Topics covered by the source:
  - OSI Layer 1
  - Bits
  - Cables / Hub / Repeater
  - Encoding / Decoding
  - Signal transmission
  - Modulation / Demodulation
  - Modem
  - Point-to-point / Multipoint
  - Unicast / Anycast / Multicast / Broadcast
*/


const questions = [

  {
    question:
      "Where is the Physical Layer located in the OSI model?",

    options: [
      "1st layer from the bottom",
      "2nd layer from the bottom",
      "3rd layer from the bottom",
      "4th layer from the bottom"
    ],

    answer: 0
  },


  {
    question:
      "What is the form of data handled by the Physical Layer?",

    options: [
      "Frames",
      "Packets",
      "Bits",
      "Segments"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following is associated with the Physical Layer according to the notes?",

    options: [
      "Router only",
      "Cables, hub and repeater",
      "Switch and bridge only",
      "DNS server"
    ],

    answer: 1
  },


  {
    question:
      "What does encoding do at the Physical Layer?",

    options: [
      "Converts data into suitable signals for transmission",
      "Converts IP addresses into MAC addresses",
      "Selects the routing path",
      "Creates TCP connections"
    ],

    answer: 0
  },


  {
    question:
      "What does decoding do?",

    options: [
      "Chooses a network topology",
      "Converts received signals into a form interpretable as data",
      "Assigns an IP address",
      "Creates a routing table"
    ],

    answer: 1
  },


  {
    question:
      "Which device performs modulation and demodulation?",

    options: [
      "Repeater",
      "Hub",
      "Bridge",
      "Modem"
    ],

    answer: 3
  },


  {
    question:
      "A point-to-point connection directly connects:",

    options: [
      "Exactly two devices",
      "Only three devices",
      "All devices in a LAN",
      "All devices in a WAN"
    ],

    answer: 0
  },


  {
    question:
      "In a multipoint connection:",

    options: [
      "Only one device can ever communicate",
      "Exactly two devices share the link",
      "Multiple devices share a single link",
      "Devices must use separate physical links"
    ],

    answer: 2
  },


  {
    question:
      "If a message is sent from one source to a subset of nodes, it is called:",

    options: [
      "Unicasting",
      "Anycasting",
      "Multicasting",
      "Broadcasting"
    ],

    answer: 2
  },


  {
    question:
      "If a message is sent from a source to all nodes in a network, it is called:",

    options: [
      "Unicasting",
      "Anycasting",
      "Multicasting",
      "Broadcasting"
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
   RENDER
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
      "Chapter 3 Passed!";


    resultMessage.textContent =
      `Great work! You scored ${score}/${questions.length} (${percentage}%). The Physical Layer chapter is now completed and Chapter 4 — Data Link Layer is unlocked.`;

  } else {

    resultIcon.textContent =
      "!";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You scored ${score}/${questions.length} (${percentage}%). You need at least ${PASS_SCORE}/${questions.length} (75%) to pass this chapter. Review Physical Layer and try again.`;

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