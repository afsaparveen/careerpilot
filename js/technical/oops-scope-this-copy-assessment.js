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
  "scopeThis";

const CHAPTER_ID =
  "oops-scope-this-copy";


const QUESTIONS = [

  {
    question:
      "The Scope Resolution Operator (::) is marked as being used in which language in the notes?",

    options: [
      "Java only",
      "C++ only",
      "Both Java and C++",
      "Python only"
    ],

    answer: 1
  },

  {
    question:
      "What is the main purpose of the C++ scope resolution operator ::?",

    options: [
      "To create objects dynamically",
      "To access members outside the current scope or belonging to a specific class or namespace",
      "To delete objects",
      "To overload constructors"
    ],

    answer: 1
  },

  {
    question:
      "In the global/local variable example, what does ::x access?",

    options: [
      "The local variable x",
      "The class variable x",
      "The global variable x",
      "A dynamically allocated x"
    ],

    answer: 2
  },

  {
    question:
      "Which operator is used when defining a class member function outside the class in C++?",

    options: [
      ".",
      "->",
      "::",
      "=>"
    ],

    answer: 2
  },

  {
    question:
      "What does A::value represent in the namespace example?",

    options: [
      "Access to value inside namespace A",
      "Access to a private class member",
      "A pointer to value",
      "A constructor call"
    ],

    answer: 0
  },

  {
    question:
      "What does the this keyword refer to?",

    options: [
      "The parent class",
      "The current object",
      "The next object created",
      "The class namespace"
    ],

    answer: 1
  },

  {
    question:
      "According to the notes, how is this described in C++ and Java?",

    options: [
      "Pointer in C++ and reference in Java",
      "Reference in C++ and pointer in Java",
      "Pointer in both",
      "Reference in both"
    ],

    answer: 0
  },

  {
    question:
      "When is this especially useful according to the notes?",

    options: [
      "When a parameter and a class attribute have the same name",
      "Only inside static methods",
      "Only when deleting an object",
      "Only when using inheritance"
    ],

    answer: 0
  },

  {
    question:
      "According to the notes, where is this available?",

    options: [
      "Only inside static methods",
      "Only inside non-static member functions",
      "Everywhere, including global functions",
      "Only inside constructors"
    ],

    answer: 1
  },

  {
    question:
      "Which statement correctly compares C++ and Java usage of this?",

    options: [
      "C++ uses this-> for member access, while Java uses this.",
      "C++ uses this., while Java uses this->",
      "Both always use this->",
      "Neither language uses this for current-object access"
    ],

    answer: 0
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
      "Scope Resolution & this Completed!";

    resultMessage.textContent =
      "Great work! Continue to Shallow and Deep Copy.";

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
  async user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      renderQuestions();

      loadingState.classList.add(
        "hidden"
      );

      assessmentForm.classList.remove(
        "hidden"
      );

    } catch (error) {

      console.error(error);

      loadingState.textContent =
        "Failed to load assessment.";

    }

  }
);