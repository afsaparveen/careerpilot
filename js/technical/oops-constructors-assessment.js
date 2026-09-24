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
  "constructors";

const CHAPTER_ID =
  "oops-constructors";


const QUESTIONS = [

  {
    question:
      "What is a constructor?",

    options: [
      "A special method invoked automatically at object creation",
      "A method used only to destroy objects",
      "A normal method that must always be called manually",
      "A class variable"
    ],

    answer: 0
  },


  {
    question:
      "When is a constructor invoked according to the notes?",

    options: [
      "Only when a program terminates",
      "Automatically at the time of object creation",
      "Only after the destructor",
      "Only when a method is overridden"
    ],

    answer: 1
  },


  {
    question:
      "What is the primary purpose of a constructor?",

    options: [
      "To initialize an object",
      "To delete an object",
      "To inherit a class",
      "To hide all methods"
    ],

    answer: 0
  },


  {
    question:
      "A constructor has what relationship with the class name?",

    options: [
      "It must have a different name",
      "It has the same name as the class",
      "It must be named main",
      "It must be named init"
    ],

    answer: 1
  },


  {
    question:
      "What return type does a constructor have?",

    options: [
      "void",
      "int",
      "The class type",
      "No return type"
    ],

    answer: 3
  },


  {
    question:
      "According to the notes, when does memory allocation for an object happen relative to the constructor call?",

    options: [
      "After the constructor call",
      "Before the constructor call",
      "Only after the destructor",
      "At the same time as the return statement"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is NOT one of the three constructor types listed in the notes?",

    options: [
      "Non-Parameterized / Default Constructor",
      "Parameterized Constructor",
      "Copy Constructor",
      "Virtual Constructor"
    ],

    answer: 3
  },


  {
    question:
      "What is a non-parameterized or default constructor?",

    options: [
      "A constructor having no parameters",
      "A constructor that always copies an existing object",
      "A constructor that must have three parameters",
      "A constructor that cannot initialize an object"
    ],

    answer: 0
  },


  {
    question:
      "What is the purpose of a parameterized constructor?",

    options: [
      "To initialize object values by accepting parameters at creation time",
      "To destroy the object",
      "To prevent object creation",
      "To access only static members"
    ],

    answer: 0
  },


  {
    question:
      "What does a copy constructor do?",

    options: [
      "Deletes an existing object",
      "Creates a new object as a copy of an existing object",
      "Converts a class into an interface",
      "Makes all members private"
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


  const submitWrapper =
    document.createElement(
      "div"
    );


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
            ? Number(
                selected.value
              )
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

  if (!currentUser) {
    return;
  }


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


  const attemptCount =
    (previous.attemptCount || 0) + 1;


  assessments[
    ASSESSMENT_KEY
  ] = {

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

    ...oopsProgress,

    assessments,

    completedChapters

  };


  await setDoc(

    userRef,

    {
      oopsProgress:
        updatedProgress
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
      "Constructor Completed!";


    resultMessage.textContent =
      "Great work! You passed the Constructor assessment. Continue to the Destructor chapter.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review Constructors and try again.`;

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



function continueToOOP() {

  window.location.href =
    "oops.html";

}



retryBtn.addEventListener(
  "click",
  resetAssessment
);


continueBtn.addEventListener(
  "click",
  continueToOOP
);


assessmentForm.addEventListener(
  "submit",
  handleSubmit
);



onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );


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