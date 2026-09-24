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
const PASS_SCORE = 12;

const ASSESSMENT_KEY = "fileSystems";
const CHAPTER_ID = "file-systems";


const questions = [
  {
    question:
      "What is the primary purpose of a file system in an operating system?",
    options: [
      "To compress data for storage",
      "To allocate CPU time",
      "To manage how data is stored and retrieved",
      "To enhance security"
    ],
    answer: 2
  },

  {
    question:
      "Which of the following is a major advantage of using a file system?",
    options: [
      "Unlimited memory allocation",
      "Direct hardware access",
      "Organized data storage and access",
      "Reduced execution time"
    ],
    answer: 2
  },

  {
    question:
      "A key disadvantage of file systems is:",
    options: [
      "Easy multi-user access",
      "File corruption risks",
      "Fixed file size",
      "Automatic sorting of files"
    ],
    answer: 1
  },

  {
    question:
      "The access time, modification time, and permissions of a file are all examples of:",
    options: [
      "File structure",
      "File attributes",
      "File types",
      "File extensions"
    ],
    answer: 1
  },

  {
    question:
      "In sequential access file method:",
    options: [
      "Records can be accessed in any order",
      "Each record has a unique index",
      "Records are accessed one by one, in order",
      "Records can be accessed using offset"
    ],
    answer: 2
  },

  {
    question:
      "Which access method allows direct jump to any block of a file?",
    options: [
      "Indexed",
      "Sequential",
      "Tree-based",
      "Paged"
    ],
    answer: 0
  },

  {
    question:
      "Indexed access is most efficient when:",
    options: [
      "Accessing records randomly",
      "Appending data continuously",
      "Using fixed-length records",
      "Accessing large directories"
    ],
    answer: 0
  },

  {
    question:
      "In the single-level directory structure:",
    options: [
      "Each user has their own directory",
      "Directories form a tree",
      "All files are placed in one directory",
      "Files can be nested"
    ],
    answer: 2
  },

  {
    question:
      "Which directory structure allows efficient searching and shared subdirectories?",
    options: [
      "Single-level",
      "Two-level",
      "Tree",
      "DAG (Directed Acyclic Graph)"
    ],
    answer: 3
  },

  {
    question:
      "A special file in a file system refers to:",
    options: [
      "A password-protected file",
      "A file used for backups",
      "Device files that represent hardware",
      "Encrypted text files"
    ],
    answer: 2
  },

  {
    question:
      "In contiguous allocation, a file:",
    options: [
      "Is stored in separate disk sectors",
      "Can be stored in any available block",
      "Occupies a sequence of adjacent blocks",
      "Is allocated using a hash table"
    ],
    answer: 2
  },

  {
    question:
      "What is a major problem with linked allocation?",
    options: [
      "It wastes memory",
      "It requires large tables",
      "Random access is inefficient/slow",
      "Files cannot be modified"
    ],
    answer: 2
  },

  {
    question:
      "In indexed allocation, each file has:",
    options: [
      "A pointer to the first block",
      "A linked list of blocks",
      "An index block containing pointers to all data blocks",
      "A tree of block numbers"
    ],
    answer: 2
  },

  {
    question:
      "Which of the following is not a free space management technique?",
    options: [
      "Bit vector",
      "Grouping",
      "Paging",
      "Counting"
    ],
    answer: 2
  },

  {
    question:
      "In Unix file systems, the mount operation is used to:",
    options: [
      "Compress files",
      "Rename a file",
      "Make a file system accessible under a directory",
      "Format the disk"
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
      "Chapter 8 Passed!";

    resultMessage.textContent =
      `Great work! You scored ${score}/${questions.length} (${percentage}%). File Systems is now completed, and the next OS chapter is unlocked.`;
  } else {
    resultIcon.textContent = "!";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You scored ${score}/${questions.length} (${percentage}%). You need at least ${PASS_SCORE}/${questions.length} (75%) to pass this chapter. Review File Systems and try again.`;
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