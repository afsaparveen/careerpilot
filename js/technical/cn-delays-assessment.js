import { auth, db } from "../firebase/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const PASS_PERCENTAGE = 75;
const PASS_SCORE = 8;

const ASSESSMENT_KEY = "delays";
const CHAPTER_ID = "cn-delays";


const QUESTIONS = [

  {
    question:
      "What do delays in computer networks refer to?",

    options: [
      "Only the time required to route a packet",
      "The time taken during different stages of processing and transferring a packet",
      "Only the time required to establish a connection",
      "The time required to assign an IP address"
    ],

    answer: 1
  },


  {
    question:
      "What is Transmission Delay?",

    options: [
      "Time taken by the last bit to travel from sender to receiver",
      "Time a packet waits in a buffer queue",
      "Time required to push all bits of the packet onto the transmission medium",
      "Time required by a router to process the packet"
    ],

    answer: 2
  },


  {
    question:
      "What is the formula for Transmission Delay?",

    options: [
      "Tt = B / L",
      "Tt = L / B",
      "Tt = Distance / Velocity",
      "Tt = L × B"
    ],

    answer: 1
  },


  {
    question:
      "If packet size L = 20 bits and bandwidth B = 1 bps, what is the Transmission Delay?",

    options: [
      "0.05 seconds",
      "1 second",
      "20 seconds",
      "21 seconds"
    ],

    answer: 2
  },


  {
    question:
      "What is Propagation Delay?",

    options: [
      "Time a packet waits in a queue",
      "Time taken by the last bit to travel from sender to receiver through the medium",
      "Time needed to push all packet bits onto the medium",
      "Time taken by the processor to check packet headers"
    ],

    answer: 1
  },


  {
    question:
      "Which formula represents Propagation Delay?",

    options: [
      "Tp = L / B",
      "Tp = B / L",
      "Tp = Distance / Velocity",
      "Tp = Distance × Velocity"
    ],

    answer: 2
  },


  {
    question:
      "Which factor increases Queueing Delay according to the notes?",

    options: [
      "Higher bandwidth",
      "Longer queues",
      "Higher CPU speed",
      "Higher propagation velocity"
    ],

    answer: 1
  },


  {
    question:
      "What is Processing Delay?",

    options: [
      "Time taken by routers or destination systems to process the packet",
      "Time taken by the last bit to travel through the medium",
      "Time required to push packet bits onto the medium",
      "Time a packet spends waiting in a buffer"
    ],

    answer: 0
  },


  {
    question:
      "Which statement about Queueing Delay and Processing Delay is correct according to the notes?",

    options: [
      "Both always have fixed formulas",
      "Queueing Delay has no exact formula because it varies with traffic and system conditions, while Processing Delay depends on processor speed and system load",
      "Both depend only on distance",
      "Both are determined only by bandwidth"
    ],

    answer: 1
  },


  {
    question:
      "In the ideal case with no processing and queueing delay, what is the total delay?",

    options: [
      "Ttotal = Tt × Tp",
      "Ttotal = Tq + Tpro",
      "Ttotal = Tt + Tp",
      "Ttotal = Tt + Tq"
    ],

    answer: 2
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
      "Computer Networks Completed!";


    resultMessage.textContent =
      "Excellent work! You passed the final Delays assessment. All 10 Computer Networks chapters are now completed.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review the Delays chapter and try again.`;

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