import { auth, db } from "../firebase/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const PASS_PERCENTAGE = 75;
const PASS_SCORE = 8;

const ASSESSMENT_KEY = "applicationLayer";
const CHAPTER_ID = "cn-application-layer";


const QUESTIONS = [

  {
    question:
      "Where is the Application Layer located in the OSI Model?",

    options: [
      "5th layer from bottom; 3rd from top",
      "6th layer from bottom; 2nd from top",
      "7th layer from bottom; 1st from top",
      "4th layer from bottom; 4th from top"
    ],

    answer: 2
  },


  {
    question:
      "What is the main purpose of the Application Layer?",

    options: [
      "To route packets between networks",
      "To provide functionality to send and receive data from users and act as the interface between the user and the application",
      "To convert frames into bits",
      "To assign MAC addresses to devices"
    ],

    answer: 1
  },


  {
    question:
      "Which protocol is the core protocol of the Web and normally uses port 80?",

    options: [
      "HTTP",
      "FTP",
      "DNS",
      "SMTP"
    ],

    answer: 0
  },


  {
    question:
      "Which HTTP method is used to request data from the server?",

    options: [
      "POST",
      "DELETE",
      "GET",
      "PUT"
    ],

    answer: 2
  },


  {
    question:
      "Which HTTP method submits data to be processed by the server?",

    options: [
      "POST",
      "HEAD",
      "CONNECT",
      "GET"
    ],

    answer: 0
  },


  {
    question:
      "Which protocol translates domain names into IP addresses?",

    options: [
      "DHCP",
      "DNS",
      "TELNET",
      "POP"
    ],

    answer: 1
  },


  {
    question:
      "Which DNS server holds the actual DNS records and returns the IP address for the domain?",

    options: [
      "Root Server",
      "TLD Server",
      "Authoritative Server",
      "DHCP Server"
    ],

    answer: 2
  },


  {
    question:
      "Which FTP port is used for the control connection?",

    options: [
      "20",
      "21",
      "53",
      "443"
    ],

    answer: 1
  },


  {
    question:
      "Which email protocol is described as pushing emails from the sender to the recipient mail server?",

    options: [
      "POP",
      "IMAP",
      "SMTP",
      "NFS"
    ],

    answer: 2
  },


  {
    question:
      "What is a key difference between persistent and non-persistent HTTP?",

    options: [
      "Persistent HTTP uses UDP while non-persistent HTTP uses TCP",
      "Persistent HTTP keeps the connection open after the response, while non-persistent HTTP closes it",
      "Persistent HTTP is only used for email",
      "Non-persistent HTTP does not use a network connection"
    ],

    answer: 1
  }

];


const loadingState =
  document.getElementById("loadingState");

const assessmentForm =
  document.getElementById("assessmentForm");

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


const retryBtn =
  document.getElementById("retryBtn");

const continueBtn =
  document.getElementById("continueBtn");


let currentUser = null;
let existingProgress = {};



function renderQuestions() {

  assessmentForm.innerHTML = "";


  QUESTIONS.forEach((item, index) => {

    const questionCard =
      document.createElement("div");


    questionCard.className =
      "question-card";


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


    assessmentForm.appendChild(
      questionCard
    );

  });


  const submitWrapper =
    document.createElement("div");


  submitWrapper.className =
    "assessment-submit-wrapper";


  submitWrapper.innerHTML = `
    <button
      type="submit"
      class="btn btn-primary assessment-submit-btn"
    >
      Submit Assessment
    </button>
  `;


  assessmentForm.appendChild(
    submitWrapper
  );
}



function calculateScore() {

  let score = 0;


  QUESTIONS.forEach(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (!selected) {
        return;
      }


      const selectedAnswer =
        Number(selected.value);


      if (
        selectedAnswer === question.answer
      ) {
        score++;
      }

    }
  );


  return score;
}



function calculatePercentage(score) {

  return Math.round(
    (score / QUESTIONS.length) * 100
  );

}



function collectAnswers() {

  return QUESTIONS.map(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      return {

        question: question.question,

        selectedAnswer:
          selected
            ? Number(selected.value)
            : null,

        correctAnswer:
          question.answer

      };

    }
  );

}



async function saveAssessmentResult(
  score,
  percentage,
  passed
) {

  if (!currentUser) {
    return;
  }


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const latestSnapshot =
    await getDoc(userRef);


  const userData =
    latestSnapshot.exists()
      ? latestSnapshot.data()
      : {};


  const cnProgress =
    userData.cnProgress || {};


  const assessments =
    cnProgress.assessments || {};


  const completedChapters =
    cnProgress.completedChapters || {};


  const previousAssessment =
    assessments[ASSESSMENT_KEY] || {};


  const attemptCount =
    (previousAssessment.attemptCount || 0) + 1;


  assessments[ASSESSMENT_KEY] = {

    score,

    total:
      QUESTIONS.length,

    percentage,

    passed,

    attemptCount,

    lastAttemptAt:
      new Date(),

    answers:
      collectAnswers()

  };


  if (passed) {

    completedChapters[
      CHAPTER_ID
    ] = true;

  }


  const updatedProgress = {

    ...cnProgress,

    assessments,

    completedChapters

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


  existingProgress =
    updatedProgress;

}



function showResult(
  score,
  percentage,
  passed
) {

  assessmentForm.classList.add(
    "hidden"
  );


  resultSection.classList.remove(
    "hidden"
  );


  scoreText.textContent =
    `Score: ${score}/${QUESTIONS.length}`;


  percentageText.textContent =
    `Percentage: ${percentage}%`;


  if (passed) {

    resultIcon.textContent =
      "🎉";


    resultTitle.textContent =
      "Application Layer Completed!";


    resultMessage.textContent =
      "Great work! You passed the Application Layer assessment. The Computer Networks course is now ready for its final Delays chapter.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review the Application Layer and try again.`;

  }

}



async function handleSubmit(event) {

  event.preventDefault();


  const score =
    calculateScore();


  const percentage =
    calculatePercentage(score);


  const passed =
    percentage >= PASS_PERCENTAGE;


  try {

    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Saving Result...";

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


    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Assessment";

    }

  }

}



function resetAssessment() {

  resultSection.classList.add(
    "hidden"
  );


  assessmentForm.classList.remove(
    "hidden"
  );


  renderQuestions();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}



function continueToCN() {

  window.location.href =
    "cn.html";

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



onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );


      const snapshot =
        await getDoc(userRef);


      if (snapshot.exists()) {

        const data =
          snapshot.data();


        existingProgress =
          data.cnProgress || {};

      }


      renderQuestions();


      loadingState.classList.add(
        "hidden"
      );


      assessmentForm.classList.remove(
        "hidden"
      );


    } catch (error) {

      console.error(
        "Failed to load assessment:",
        error
      );


      loadingState.textContent =
        "Failed to load assessment. Please refresh and try again.";

    }

  }
);