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

const ASSESSMENT_KEY = "diskManagement";
const CHAPTER_ID = "disk-management";


const questions = [
  {
    question:
      "What is the primary purpose of disk management in an operating system?",

    options: [
      "To manage RAM allocation",
      "To control access to CPU registers",
      "To manage storage devices and data organization",
      "To schedule processes"
    ],

    answer: 2
  },

  {
    question:
      "Which of the following is not a component of disk structure?",

    options: [
      "Platter",
      "Track",
      "Sector",
      "Register"
    ],

    answer: 3
  },

  {
    question:
      "What does disk management do in an OS?",

    options: [
      "Controls CPU frequency",
      "Handles memory paging",
      "Manages disk formatting, partitioning, and file system handling",
      "Schedules I/O interrupts"
    ],

    answer: 2
  },

  {
    question:
      "In the context of disk scheduling, seek time refers to:",

    options: [
      "Time to transfer data from disk to memory",
      "Time to locate the correct sector on a track",
      "Time to rotate the disk under the read/write head",
      "Time to move the read/write head to the correct track"
    ],

    answer: 3
  },

  {
    question:
      "Which of the following is a disk scheduling algorithm that processes requests in the order they arrive?",

    options: [
      "SSTF",
      "SCAN",
      "FCFS",
      "C-LOOK"
    ],

    answer: 2
  },

  {
    question:
      "Which algorithm selects the disk I/O request closest to the current head position?",

    options: [
      "FCFS",
      "SSTF",
      "C-SCAN",
      "LOOK"
    ],

    answer: 1
  },

  {
    question:
      "Which disk scheduling algorithm moves the head in one direction, servicing requests, and then reverses direction?",

    options: [
      "LOOK",
      "SSTF",
      "SCAN",
      "C-LOOK"
    ],

    answer: 2
  },

  {
    question:
      "The C-SCAN algorithm differs from SCAN in that:",

    options: [
      "It services requests only in one direction and jumps to the start",
      "It ignores all incoming I/O requests",
      "It sorts requests in ascending order",
      "It provides better seek time than SSTF in all cases"
    ],

    answer: 0
  },

  {
    question:
      "In the LOOK algorithm, the disk arm:",

    options: [
      "Goes to the end of the disk before reversing",
      "Stops where there are no further requests in the current direction",
      "Ignores the last track",
      "Moves continuously without reversing"
    ],

    answer: 1
  },

  {
    question:
      "Which of the following algorithms is designed to reduce starvation in disk scheduling?",

    options: [
      "FCFS",
      "SSTF",
      "SCAN",
      "Random"
    ],

    answer: 2
  }
];


let currentUser = null;
let submitted = false;


const form =
  document.getElementById("assessmentForm");

const questionsContainer =
  document.getElementById("questionsContainer");

const submitBtn =
  document.getElementById("submitBtn");

const backBtn =
  document.getElementById("backBtn");

const resultBox =
  document.getElementById("resultBox");

const resultIcon =
  document.getElementById("resultIcon");

const resultTitle =
  document.getElementById("resultTitle");

const resultMessage =
  document.getElementById("resultMessage");

const scoreValue =
  document.getElementById("scoreValue");

const percentageValue =
  document.getElementById("percentageValue");

const passValue =
  document.getElementById("passValue");

const continueBtn =
  document.getElementById("continueBtn");

const retryBtn =
  document.getElementById("retryBtn");

const progressText =
  document.getElementById("progressText");

const answeredText =
  document.getElementById("answeredText");

const progressBar =
  document.getElementById("progressBar");

const errorBox =
  document.getElementById("errorBox");


function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}


function hideError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function renderQuestions() {
  questionsContainer.innerHTML = "";

  questions.forEach((item, index) => {
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

    questionsContainer.appendChild(wrapper);
  });

  document
    .querySelectorAll('input[type="radio"]')
    .forEach((input) => {
      input.addEventListener(
        "change",
        updateProgress
      );
    });

  updateProgress();
}


function getAnsweredCount() {
  let answered = 0;

  questions.forEach((_, index) => {
    const selected =
      document.querySelector(
        `input[name="question-${index}"]:checked`
      );

    if (selected) {
      answered++;
    }
  });

  return answered;
}


function updateProgress() {
  const answered =
    getAnsweredCount();

  answeredText.textContent =
    `${answered} answered`;

  if (answered === questions.length) {
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
    (answered / questions.length) * 100;

  progressBar.style.width =
    `${Math.max(5, percentage)}%`;
}


function validateAllAnswered() {
  const unanswered = [];

  questions.forEach((_, index) => {
    const selected =
      document.querySelector(
        `input[name="question-${index}"]:checked`
      );

    if (!selected) {
      unanswered.push(index + 1);
    }
  });

  if (unanswered.length > 0) {
    showError(
      `Please answer all questions before submitting. Unanswered question(s): ${unanswered.join(", ")}.`
    );

    const firstQuestion =
      document.querySelectorAll(".question")[
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
    existingData.osProgress || {};

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
    total: questions.length,
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
        total: questions.length,
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

      [CHAPTER_ID]: passed
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
      osProgress: updatedProgress
    },
    {
      merge: true
    }
  );
}


async function submitAssessment() {
  if (submitted) {
    return;
  }

  if (!validateAllAnswered()) {
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent =
    "Checking...";

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
      (score / questions.length) * 100
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
      "Chapter 9 Passed!";

    resultMessage.textContent =
      `Excellent! You scored ${score}/${questions.length} (${percentage}%). Disk Management is now completed, which completes all 9 OS learning chapters and their chapter assessments.`;

  } else {
    resultIcon.textContent = "!";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You scored ${score}/${questions.length} (${percentage}%). You need at least ${PASS_SCORE}/${questions.length} (75%) to pass this chapter. Review Disk Management and try again.`;
  }

  form.style.display = "none";

  resultBox.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


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


function initialize() {
  renderQuestions();

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
}


submitBtn.addEventListener(
  "click",
  submitAssessment
);


backBtn.addEventListener(
  "click",
  () => {
    window.location.href =
      "os.html";
  }
);


continueBtn.addEventListener(
  "click",
  () => {
    window.location.href =
      "os.html";
  }
);


retryBtn.addEventListener(
  "click",
  resetAssessment
);


initialize();