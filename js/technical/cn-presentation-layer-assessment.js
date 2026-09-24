import { auth, db } from "../firebase/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const PASS_PERCENTAGE = 75;
const PASS_SCORE = 8;

const ASSESSMENT_KEY = "presentationLayer";
const CHAPTER_ID = "cn-presentation-layer";

const QUESTIONS = [
  {
    question:
      "Where is the Presentation Layer located in the OSI Model?",
    options: [
      "5th layer from bottom; 3rd from top",
      "7th layer from bottom; 1st from top",
      "6th layer from bottom; 2nd from top",
      "4th layer from bottom; 4th from top"
    ],
    answer: 2
  },

  {
    question:
      "What is the main purpose of the Presentation Layer?",
    options: [
      "To route packets between networks",
      "To present data in a format that can be properly interpreted by the sender and receiver",
      "To establish a physical connection between devices",
      "To assign IP addresses to devices"
    ],
    answer: 1
  },

  {
    question:
      "Which Presentation Layer service translates data between different formats to ensure compatibility between systems?",
    options: [
      "Data Translation",
      "Data Compression",
      "Encryption",
      "Syntax Management"
    ],
    answer: 0
  },

  {
    question:
      "Data Translation is also known as what?",
    options: [
      "Encoding Layer",
      "Translation Layer",
      "Network Layer",
      "Compatibility Layer"
    ],
    answer: 1
  },

  {
    question:
      "What is the purpose of Data Compression in the Presentation Layer?",
    options: [
      "To increase the number of bytes sent",
      "To reduce data size and minimize the number of bytes sent over the network",
      "To assign ports to applications",
      "To encrypt the entire network"
    ],
    answer: 1
  },

  {
    question:
      "Which type of compression permanently removes some data, so the original file cannot be restored?",
    options: [
      "Lossless Compression",
      "Lossy Compression",
      "Reversible Compression",
      "Secure Compression"
    ],
    answer: 1
  },

  {
    question:
      "Which type of compression reduces file size without loss of data and allows the original file to be restored?",
    options: [
      "Lossy Compression",
      "Lossless Compression",
      "Irreversible Compression",
      "Encrypted Compression"
    ],
    answer: 1
  },

  {
    question:
      "What does encryption and decryption do in the Presentation Layer?",
    options: [
      "Converts data into unreadable format and back to readable format",
      "Converts packets into frames",
      "Changes IP addresses into MAC addresses",
      "Controls physical transmission speed"
    ],
    answer: 0
  },

  {
    question:
      "What is the purpose of Syntax Semantics Management?",
    options: [
      "To assign port numbers",
      "To agree on a common data syntax and semantics for smooth communication between devices",
      "To route packets to the destination",
      "To divide data into smaller frames"
    ],
    answer: 1
  },

  {
    question:
      "Which of the following is NOT listed as a service of the Presentation Layer in the notes?",
    options: [
      "Data Translation",
      "Data Compression",
      "Encryption & Decryption",
      "Packet Routing"
    ],
    answer: 3
  }
];


const loadingState = document.getElementById("loadingState");
const assessmentForm = document.getElementById("assessmentForm");
const resultSection = document.getElementById("resultSection");

const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const scoreText = document.getElementById("scoreText");
const percentageText = document.getElementById("percentageText");

const retryBtn = document.getElementById("retryBtn");
const continueBtn = document.getElementById("continueBtn");


let currentUser = null;
let existingProgress = {};



function renderQuestions() {
  assessmentForm.innerHTML = "";

  QUESTIONS.forEach((item, index) => {
    const questionCard = document.createElement("div");

    questionCard.className = "question-card";

    questionCard.innerHTML = `
      <div class="question-number">
        Question ${index + 1} of ${QUESTIONS.length}
      </div>

      <h3>${item.question}</h3>

      <div class="options-group">

        ${item.options
          .map(
            (option, optionIndex) => `
              <label class="option-label">
                <input
                  type="radio"
                  name="question-${index}"
                  value="${optionIndex}"
                />

                <span>${option}</span>
              </label>
            `
          )
          .join("")}

      </div>
    `;

    assessmentForm.appendChild(questionCard);
  });


  const submitWrapper = document.createElement("div");

  submitWrapper.className = "assessment-submit-wrapper";

  submitWrapper.innerHTML = `
    <button
      type="submit"
      class="btn btn-primary assessment-submit-btn"
    >
      Submit Assessment
    </button>
  `;

  assessmentForm.appendChild(submitWrapper);
}



function calculateScore() {
  let score = 0;

  QUESTIONS.forEach((question, index) => {
    const selected = document.querySelector(
      `input[name="question-${index}"]:checked`
    );

    if (!selected) {
      return;
    }

    const selectedAnswer = Number(selected.value);

    if (selectedAnswer === question.answer) {
      score++;
    }
  });

  return score;
}



function calculatePercentage(score) {
  return Math.round((score / QUESTIONS.length) * 100);
}



function collectAnswers() {
  return QUESTIONS.map((question, index) => {
    const selected = document.querySelector(
      `input[name="question-${index}"]:checked`
    );

    return {
      question: question.question,
      selectedAnswer: selected
        ? Number(selected.value)
        : null,
      correctAnswer: question.answer
    };
  });
}



async function saveAssessmentResult(score, percentage, passed) {
  if (!currentUser) {
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);

  const latestSnapshot = await getDoc(userRef);

  const userData = latestSnapshot.exists()
    ? latestSnapshot.data()
    : {};

  const cnProgress = userData.cnProgress || {};

  const assessments = cnProgress.assessments || {};

  const completedChapters =
    cnProgress.completedChapters || {};

  const previousAssessment =
    assessments[ASSESSMENT_KEY] || {};

  const attemptCount =
    (previousAssessment.attemptCount || 0) + 1;


  assessments[ASSESSMENT_KEY] = {
    score,
    total: QUESTIONS.length,
    percentage,
    passed,
    attemptCount,
    lastAttemptAt: new Date(),
    answers: collectAnswers()
  };


  if (passed) {
    completedChapters[CHAPTER_ID] = true;
  }


  const updatedProgress = {
    ...cnProgress,
    assessments,
    completedChapters
  };


  await setDoc(
    userRef,
    {
      cnProgress: updatedProgress
    },
    {
      merge: true
    }
  );


  existingProgress = updatedProgress;
}



function showResult(score, percentage, passed) {
  assessmentForm.classList.add("hidden");

  resultSection.classList.remove("hidden");

  scoreText.textContent =
    `Score: ${score}/${QUESTIONS.length}`;

  percentageText.textContent =
    `Percentage: ${percentage}%`;


  if (passed) {
    resultIcon.textContent = "🎉";

    resultTitle.textContent =
      "Presentation Layer Completed!";

    resultMessage.textContent =
      "Great work! You passed the Presentation Layer assessment. Chapter 9 — Application Layer is now unlocked.";
  } else {
    resultIcon.textContent = "📘";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review the Presentation Layer and try again.`;
  }
}



async function handleSubmit(event) {
  event.preventDefault();

  const score = calculateScore();

  const percentage = calculatePercentage(score);

  const passed = percentage >= PASS_PERCENTAGE;


  try {
    const submitButton = assessmentForm.querySelector(
      ".assessment-submit-btn"
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Saving Result...";
    }


    await saveAssessmentResult(
      score,
      percentage,
      passed
    );

    showResult(
      score,
      percentage,
      passed
    );

  } catch (error) {
    console.error(
      "Failed to save assessment:",
      error
    );

    alert(
      "Your result could not be saved. Please check your Firebase connection and try again."
    );

    const submitButton = assessmentForm.querySelector(
      ".assessment-submit-btn"
    );

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Assessment";
    }
  }
}



function resetAssessment() {
  resultSection.classList.add("hidden");

  assessmentForm.classList.remove("hidden");

  renderQuestions();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



function continueToCN() {
  window.location.href = "cn.html";
}



retryBtn.addEventListener(
  "click",
  resetAssessment
);


continueBtn.addEventListener(
  "click",
  continueToCN
);


assessmentForm.addEventListener(
  "submit",
  handleSubmit
);



onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }


  currentUser = user;


  try {
    const userRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const data = snapshot.data();

      existingProgress =
        data.cnProgress || {};
    }


    renderQuestions();


    loadingState.classList.add("hidden");

    assessmentForm.classList.remove("hidden");

  } catch (error) {

    console.error(
      "Failed to load assessment:",
      error
    );

    loadingState.textContent =
      "Failed to load assessment. Please refresh and try again.";
  }

});