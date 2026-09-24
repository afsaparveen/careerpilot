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
  "encapsulation";

const CHAPTER_ID =
  "oops-encapsulation";


const QUESTIONS = [

  {
    question:
      "What is encapsulation in OOP according to the notes?",

    options: [
      "Wrapping data and methods into a single unit called a class while restricting direct access to internal data",
      "Creating multiple classes without methods",
      "Making every variable public",
      "Copying one object into another"
    ],

    answer: 0
  },


  {
    question:
      "Which OOP concept is directly associated with encapsulation in the notes?",

    options: [
      "Data hiding",
      "Operator overloading",
      "Multiple inheritance",
      "Runtime binding"
    ],

    answer: 0
  },


  {
    question:
      "Which access modifier is used in the notes to ensure data hiding?",

    options: [
      "Public",
      "Protected",
      "Private",
      "Friend"
    ],

    answer: 2
  },


  {
    question:
      "What is the purpose of keeping internal data private?",

    options: [
      "To allow unrestricted direct access",
      "To restrict direct access to internal data",
      "To prevent methods from being created",
      "To eliminate classes"
    ],

    answer: 1
  },


  {
    question:
      "In the Student example, which member is kept private?",

    options: [
      "setAge()",
      "getAge()",
      "age",
      "main()"
    ],

    answer: 2
  },


  {
    question:
      "What does the setAge() method do in the example?",

    options: [
      "Returns the current age",
      "Sets age if the supplied value is greater than 0",
      "Makes age public",
      "Deletes the Student object"
    ],

    answer: 1
  },


  {
    question:
      "What does getAge() return in the Student example?",

    options: [
      "The current value of age",
      "A new Student object",
      "The address of the class",
      "The value of setAge()"
    ],

    answer: 0
  },


  {
    question:
      "In the C++ example, which statement is explicitly not allowed because age is private?",

    options: [
      "s.setAge(20);",
      "cout << s.getAge();",
      "s.age = 25;",
      "Student s;"
    ],

    answer: 2
  },


  {
    question:
      "What is the purpose of getter and setter methods in the encapsulation example?",

    options: [
      "To provide controlled access to private data",
      "To make private data disappear",
      "To replace classes with functions",
      "To create multiple inheritance"
    ],

    answer: 0
  },


  {
    question:
      "Which statement best matches the capsule analogy used in the notes?",

    options: [
      "A class exposes every internal detail directly",
      "A class hides internal data and exposes access through methods",
      "A class is only a memory address",
      "A class cannot contain data"
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
      "Encapsulation Completed!";


    resultMessage.textContent =
      "Great work! You passed the Encapsulation assessment. Continue to the Constructor chapter.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${QUESTIONS.length} correct answers (${PASS_PERCENTAGE}%). Review Encapsulation and try again.`;

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