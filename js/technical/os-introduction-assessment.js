import {
  auth,
  db
} from "../firebase/firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const questionContainer =
  document.getElementById(
    "questionContainer"
  );

const submitBtn =
  document.getElementById(
    "submitBtn"
  );

const retryBtn =
  document.getElementById(
    "retryBtn"
  );

const resultCard =
  document.getElementById(
    "resultCard"
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

const resultScore =
  document.getElementById(
    "resultScore"
  );

const correctCount =
  document.getElementById(
    "correctCount"
  );

const wrongCount =
  document.getElementById(
    "wrongCount"
  );

const totalCount =
  document.getElementById(
    "totalCount"
  );

const progressText =
  document.getElementById(
    "progressText"
  );

const progressFill =
  document.getElementById(
    "progressFill"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );


let currentUser = null;


/*
  Questions taken from the
  Chapter 1 MCQ section of
  Operating System Notes.pdf
*/
const questions = [

  {
    question:
      "What is the primary function of an Operating System?",

    options: [
      "Store user data",
      "Act as an interface between user and hardware",
      "Perform calculations",
      "Provide internet access"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is a type of real-time system?",

    options: [
      "Windows 10",
      "MS-DOS",
      "Airbag deployment system",
      "Android"
    ],

    answer: 2
  },


  {
    question:
      "In which mode does the OS have full access to hardware?",

    options: [
      "User Mode",
      "Safe Mode",
      "Kernel Mode",
      "BIOS Mode"
    ],

    answer: 2
  },


  {
    question:
      "A batch processing OS is best suited for:",

    options: [
      "Gaming",
      "Real-time response",
      "Processing payrolls",
      "Video calling"
    ],

    answer: 2
  },


  {
    question:
      "What is multiprogramming?",

    options: [
      "Running programs in sequence",
      "Running many programs with only one in memory",
      "Keeping multiple programs in memory to utilize CPU efficiently",
      "Running only one program at a time"
    ],

    answer: 2
  },


  {
    question:
      "A single process OS can?",

    options: [
      "Run multiple applications",
      "Only run one program at a time",
      "Schedule tasks concurrently",
      "Support real-time applications"
    ],

    answer: 1
  },


  {
    question:
      "Multitasking allows a user to?",

    options: [
      "Switch between OSes",
      "Run multiple programs at once",
      "Use the OS without memory",
      "Access admin features"
    ],

    answer: 1
  },


  {
    question:
      "Which OS structure runs everything in a single large kernel?",

    options: [
      "Microkernel",
      "Modular",
      "Monolithic",
      "Layered"
    ],

    answer: 2
  },


  {
    question:
      "Distributed systems are designed to?",

    options: [
      "Operate on a single device",
      "Manage databases",
      "Coordinate multiple machines as one system",
      "Replace cloud computing"
    ],

    answer: 2
  },


  {
    question:
      "What is a system call?",

    options: [
      "A call made to another computer",
      "An API for games",
      "A way for programs to request services from the OS",
      "A method to access kernel services from user programs"
    ],

    answer: 2
  },


  {
    question:
      "What does a microkernel do differently than a monolithic kernel?",

    options: [
      "Runs everything in one block",
      "Provides all services in kernel mode",
      "Runs minimal services in kernel mode",
      "Doesn’t use memory"
    ],

    answer: 2
  },


  {
    question:
      "In which mode do applications typically run?",

    options: [
      "Admin Mode",
      "Kernel Mode",
      "Safe Mode",
      "User Mode"
    ],

    answer: 3
  },


  {
    question:
      "Which OS type is best for controlling industrial robots?",

    options: [
      "Batch OS",
      "Time-sharing OS",
      "Real-Time OS",
      "Multiprogramming OS"
    ],

    answer: 2
  },


  {
    question:
      "An operating system that switches rapidly between tasks is?",

    options: [
      "Batch processing",
      "Single user",
      "Time-sharing",
      "Real-time"
    ],

    answer: 2
  },


  {
    question:
      "APIs in OS are used to?",

    options: [
      "Store data",
      "Develop UI",
      "Access hardware directly",
      "Allow programs to use OS services"
    ],

    answer: 3
  }

];


function renderQuestions() {

  questionContainer.innerHTML = "";


  questions.forEach(
    (question, index) => {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "question";


      const heading =
        document.createElement(
          "h3"
        );

      heading.textContent =
        `${index + 1}. ${question.question}`;


      card.appendChild(
        heading
      );


      question.options.forEach(
        (option, optionIndex) => {

          const label =
            document.createElement(
              "label"
            );

          label.className =
            "option";


          const input =
            document.createElement(
              "input"
            );

          input.type =
            "radio";

          input.name =
            `question-${index}`;

          input.value =
            optionIndex;


          input.addEventListener(
            "change",
            updateProgress
          );


          const span =
            document.createElement(
              "span"
            );

          span.textContent =
            option;


          label.appendChild(
            input
          );

          label.appendChild(
            span
          );


          card.appendChild(
            label
          );

        }
      );


      questionContainer.appendChild(
        card
      );

    }
  );


  updateProgress();

}


function updateProgress() {

  let answered = 0;


  questions.forEach(
    (_, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (selected) {

        answered++;

      }

    }
  );


  const percentage =
    Math.round(
      (
        answered /
        questions.length
      ) * 100
    );


  progressText.textContent =
    `${percentage}%`;

  progressFill.style.width =
    `${percentage}%`;

}


async function saveAssessment(
  score,
  correct,
  total,
  passed
) {

  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const snapshot =
    await getDoc(
      userRef
    );


  const userData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const osProgress =
    userData.osProgress || {};


  const assessments =
    osProgress.assessments || {};


  const completedChapters =
    osProgress.completedChapters || {};


  assessments.osIntroduction = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "os-introduction"
    ] = true;

  }


  await setDoc(
    userRef,
    {

      osProgress: {

        ...osProgress,

        assessments,

        completedChapters

      }

    },
    {
      merge: true
    }
  );

}


submitBtn.addEventListener(
  "click",
  async () => {

    const answers =
      questions.map(
        (_, index) => {

          const selected =
            document.querySelector(
              `input[name="question-${index}"]:checked`
            );


          return selected
            ? Number(
                selected.value
              )
            : null;

        }
      );


    if (
      answers.some(
        answer =>
          answer === null
      )
    ) {

      alert(
        "Please answer all 15 questions before submitting."
      );

      return;

    }


    let correct = 0;


    answers.forEach(
      (answer, index) => {

        if (
          answer ===
          questions[index].answer
        ) {

          correct++;

        }

      }
    );


    const total =
      questions.length;


    const score =
      Math.round(
        (
          correct /
          total
        ) * 100
      );


    const passed =
      score >= 75;


    await saveAssessment(
      score,
      correct,
      total,
      passed
    );


    resultCard.hidden =
      false;


    submitBtn.disabled =
      true;


    correctCount.textContent =
      correct;


    wrongCount.textContent =
      total - correct;


    totalCount.textContent =
      total;


    resultScore.textContent =
      `${score}%`;


    if (passed) {

      resultIcon.textContent =
        "🎉";

      resultTitle.textContent =
        "Chapter 1 Passed!";

      resultMessage.textContent =
        "You scored at least 75%. Chapter 1 is now completed and Chapter 2 can be unlocked.";

    } else {

      resultIcon.textContent =
        "📚";

      resultTitle.textContent =
        "Keep Practicing";

      resultMessage.textContent =
        "You need at least 75% to pass this chapter assessment. Review Chapter 1 and retry.";

    }


    resultCard.scrollIntoView({
      behavior: "smooth"
    });

  }
);


retryBtn.addEventListener(
  "click",
  () => {

    resultCard.hidden =
      true;


    submitBtn.disabled =
      false;


    renderQuestions();


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


logoutBtn.addEventListener(
  "click",
  async () => {

    await signOut(
      auth
    );

    window.location.href =
      "login.html";

  }
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

  }
);