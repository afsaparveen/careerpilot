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
  "inheritance";

const CHAPTER_ID =
  "oops-inheritance";


const QUESTIONS = [

  {
    question:
      "What is inheritance in OOP?",

    options: [
      "A process where one class inherits properties and behavior from another class",
      "A process of deleting a class",
      "A way to make all data public",
      "A way to create only static functions"
    ],

    answer: 0
  },


  {
    question:
      "What are the two common names used for the class that inherits members and the class being inherited from?",

    options: [
      "Object and Method",
      "Derived/Child and Base/Parent",
      "Public and Private",
      "Interface and Function"
    ],

    answer: 1
  },


  {
    question:
      "What are two benefits of inheritance mentioned in the notes?",

    options: [
      "Code reuse and hierarchical structure",
      "Encryption and compression",
      "Memory deletion and garbage collection",
      "Compilation and interpretation"
    ],

    answer: 0
  },


  {
    question:
      "Which inheritance modes are supported in C++ according to the notes?",

    options: [
      "Public, protected and private",
      "Public, package and default",
      "Private, package and friend",
      "Protected, internal and package"
    ],

    answer: 0
  },


  {
    question:
      "What do C++ inheritance modes control?",

    options: [
      "How base-class members are treated in the derived class",
      "How many constructors a class must have",
      "How objects are stored on disk",
      "How methods are named"
    ],

    answer: 0
  },


  {
    question:
      "What is single inheritance?",

    options: [
      "One class inherits from one base class",
      "One class inherits from two or more base classes",
      "Multiple classes inherit from one base class",
      "A class inherits from itself"
    ],

    answer: 0
  },


  {
    question:
      "What is multilevel inheritance?",

    options: [
      "Multiple classes inherit from one base class",
      "A class is derived from a class that is already derived from another class",
      "One class inherits from two unrelated classes",
      "A class has multiple constructors"
    ],

    answer: 1
  },


  {
    question:
      "What is hierarchical inheritance?",

    options: [
      "One class inherits from two classes",
      "Multiple classes inherit from a single base class",
      "A class inherits from its grandchild",
      "A class implements multiple interfaces"
    ],

    answer: 1
  },


  {
    question:
      "According to the notes, how does Java support multiple inheritance?",

    options: [
      "Directly through multiple base classes",
      "Through constructors",
      "Through interfaces",
      "Through friend classes"
    ],

    answer: 2
  },


  {
    question:
      "What is hybrid inheritance?",

    options: [
      "Inheritance using only one base class",
      "A combination of two or more types of inheritance",
      "Inheritance without a derived class",
      "Inheritance used only in Java"
    ],

    answer: 1
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
      "Inheritance Completed!";

    resultMessage.textContent =
      "Great work! You passed the Inheritance assessment. Continue to the Diamond Problem chapter.";

  } else {

    resultIcon.textContent =
      "📘";

    resultTitle.textContent =
      "Assessment Not Passed";

    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review Inheritance and try again.`;

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

    console.error(
      "Failed to save assessment:",
      error
    );


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