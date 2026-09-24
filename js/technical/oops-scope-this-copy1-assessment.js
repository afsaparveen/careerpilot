import { auth, db }
  from "../firebase/firebase-config.js";

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
  "shallowDeepCopy";

const CHAPTER_ID =
  "oops-shallow-deep-copy";


const QUESTIONS = [

  {
    question:
      "What does a shallow copy copy according to the notes?",

    options: [
      "A completely new independent object",
      "The reference or address of dynamic members",
      "Only the class name",
      "Only the constructor"
    ],

    answer: 1
  },

  {
    question:
      "In a shallow copy, what happens to the memory of the copied dynamic member?",

    options: [
      "Each object gets completely separate memory",
      "Both objects share the same memory",
      "The original memory is immediately deleted",
      "No memory is allocated"
    ],

    answer: 1
  },

  {
    question:
      "What happens when shared data is modified in a shallow copy?",

    options: [
      "Only the copied object changes",
      "Neither object changes",
      "The change can affect both objects",
      "The program always terminates"
    ],

    answer: 2
  },

  {
    question:
      "What does a deep copy do?",

    options: [
      "Copies only the reference",
      "Creates new memory and copies the actual value",
      "Shares all memory between objects",
      "Deletes the original object"
    ],

    answer: 1
  },

  {
    question:
      "What is the relationship between objects after a deep copy according to the notes?",

    options: [
      "They share the same dynamic memory",
      "They are independent",
      "They must always have the same value",
      "One object becomes the parent of the other"
    ],

    answer: 1
  },

  {
    question:
      "In the C++ shallow-copy Student example, s1 initially has marks equal to:",

    options: [
      "20",
      "50",
      "90",
      "100"
    ],

    answer: 2
  },

  {
    question:
      "In the C++ shallow-copy example, what happens after *s2.marks = 50?",

    options: [
      "s1.show() prints 90",
      "s1.show() prints 50",
      "s2 cannot be modified",
      "Both objects are destroyed"
    ],

    answer: 1
  },

  {
    question:
      "In the C++ deep-copy example, after *s2.marks = 50, what does s1.show() print?",

    options: [
      "50",
      "90",
      "0",
      "It prints nothing"
    ],

    answer: 1
  },

  {
    question:
      "In the Java shallow-copy example, why does changing s2.marks[0] to 50 also affect s1?",

    options: [
      "Both objects refer to the same array",
      "Java copies every value automatically",
      "The constructor resets s1",
      "The array is static"
    ],

    answer: 0
  },

  {
    question:
      "What is the key result of the Java deep-copy example?",

    options: [
      "s1 and s2 share the same array",
      "Changing s2 causes s1 to become 50",
      "s1 remains 90 while s2 becomes 50",
      "Both values become 0"
    ],

    answer: 2
  }

];


const loadingState =
  document.getElementById(
    "loadingState"
  );

const assessmentForm =
  document.getElementById(
    "assessmentForm"
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

const scoreText =
  document.getElementById(
    "scoreText"
  );

const percentageText =
  document.getElementById(
    "percentageText"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const continueBtn =
  document.getElementById(
    "continueBtn"
  );


let currentUser = null;



function renderQuestions() {

  assessmentForm.innerHTML = "";


  QUESTIONS.forEach(
    (item, index) => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "question-card";


      card.innerHTML = `

        <div class="question-number">
          Question ${index + 1} of ${QUESTIONS.length}
        </div>

        <h3>
          ${item.question}
        </h3>

        <div class="options-group">

          ${item.options
            .map(
              (
                option,
                optionIndex
              ) => `

                <label class="option-label">

                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                  />

                  <span>
                    ${option}
                  </span>

                </label>

              `
            )
            .join("")}

        </div>
      `;


      assessmentForm.appendChild(
        card
      );

    }
  );


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "assessment-submit-wrapper";


  wrapper.innerHTML = `

    <button
      type="submit"
      class="btn btn-primary assessment-submit-btn"
    >
      Submit Assessment
    </button>

  `;


  assessmentForm.appendChild(
    wrapper
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


      if (
        Number(selected.value) ===
        question.answer
      ) {

        score++;

      }

    }
  );


  return score;

}



function calculatePercentage(
  score
) {

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

        question:
          question.question,

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



async function saveResult(
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


  const userData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const oopsProgress =
    userData.oopsProgress || {};


  const assessments =
    oopsProgress.assessments || {};


  const completedChapters =
    oopsProgress.completedChapters || {};


  const previous =
    assessments[
      ASSESSMENT_KEY
    ] || {};


  assessments[
    ASSESSMENT_KEY
  ] = {

    score,

    total:
      QUESTIONS.length,

    percentage,

    passed,

    attemptCount:
      (previous.attemptCount || 0) + 1,

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


  await setDoc(

    userRef,

    {
      oopsProgress: {

        ...oopsProgress,

        assessments,

        completedChapters

      }

    },

    {
      merge: true
    }

  );

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
      "Shallow & Deep Copy Completed!";

    resultMessage.textContent =
      "Great work! Continue to the Inheritance chapter.";

  } else {

    resultIcon.textContent =
      "📘";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review the chapter and retry.`;

  }

}



async function handleSubmit(
  event
) {

  event.preventDefault();


  const score =
    calculateScore();


  const percentage =
    calculatePercentage(
      score
    );


  const passed =
    percentage >=
    PASS_PERCENTAGE;


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


    await saveResult(
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

    console.error(error);

    alert(
      "Unable to save your result. Please try again."
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



retryBtn.addEventListener(
  "click",
  resetAssessment
);


continueBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "oops.html";

  }
);


assessmentForm.addEventListener(
  "submit",
  handleSubmit
);



onAuthStateChanged(
  auth,
  user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    renderQuestions();


    loadingState.classList.add(
      "hidden"
    );


    assessmentForm.classList.remove(
      "hidden"
    );

  }
);