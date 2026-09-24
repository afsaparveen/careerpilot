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


/* =========================================================
   DOM
========================================================= */

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


/* =========================================================
   CHAPTER 5 QUESTIONS
   Source: OS PDF pages 32-33
========================================================= */

const questions = [

  {
    question:
      "Which of the following best defines a deadlock in an operating system?",

    options: [
      "A condition where a process uses excessive CPU time",
      "A set of processes are waiting for each other indefinitely for resources",
      "When all system resources are used simultaneously",
      "When a process completes execution without releasing resources"
    ],

    answer: 1
  },

  {
    question:
      "Which of the following is not one of the necessary conditions for deadlock to occur?",

    options: [
      "Mutual Exclusion",
      "Preemption",
      "Hold and Wait",
      "Circular Wait"
    ],

    answer: 1
  },

  {
    question:
      "In the Hold and Wait condition for deadlock, a process:",

    options: [
      "Must request all resources at once",
      "Is preempted from all held resources",
      "Is holding at least one resource and waiting to acquire others",
      "Cannot proceed unless all resources are released"
    ],

    answer: 2
  },

  {
    question:
      "Which of the following strategies ensures deadlock prevention by avoiding Hold and Wait?",

    options: [
      "Request all resources at once before execution",
      "Allow circular wait to form",
      "Use a timer to preempt processes",
      "Randomly assign resources to processes"
    ],

    answer: 0
  },

  {
    question:
      "Which approach involves periodically checking for deadlocks by analyzing the system state?",

    options: [
      "Deadlock Avoidance",
      "Deadlock Detection",
      "Deadlock Prevention",
      "Deadlock Ignorance"
    ],

    answer: 1
  },

  {
    question:
      "What data structure is used in deadlock detection when each instance of a resource type is single?",

    options: [
      "Wait-for Graph",
      "Linked List",
      "Resource Matrix",
      "Allocation Table"
    ],

    answer: 0
  },

  {
    question:
      "Which statement correctly describes the Banker’s Algorithm?",

    options: [
      "It is used to detect circular wait conditions",
      "It allocates resources to maximize CPU utilization",
      "It ensures the system stays in a safe state before granting a request",
      "It kills a process immediately if it causes a deadlock"
    ],

    answer: 2
  },

  {
    question:
      "A system is said to be in a safe state if:",

    options: [
      "Deadlock is currently occurring",
      "No process is executing",
      "There exists a sequence to allocate resources such that all processes complete",
      "At least one process has no allocated resource"
    ],

    answer: 2
  },

  {
    question:
      "In the context of deadlock recovery, what does resource preemption involve?",

    options: [
      "Waiting for user input to release resources",
      "Forcing a process to release its held resources",
      "Avoiding the allocation of requested resources",
      "Killing all blocked processes"
    ],

    answer: 1
  },

  {
    question:
      "Which of the following is true about Resource Allocation Graphs (RAGs)?",

    options: [
      "Cycles always indicate a deadlock",
      "A cycle in a RAG is a necessary but not sufficient condition for a deadlock if resources have multiple instances.",
      "They help prevent race conditions",
      "In RAGs, edges are only drawn from resources to processes"
    ],

    answer: 1
  }

];


/* =========================================================
   RENDER
========================================================= */

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


/* =========================================================
   PROGRESS
========================================================= */

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


/* =========================================================
   SAVE RESULT
========================================================= */

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


  assessments.deadlock = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "deadlock"
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


/* =========================================================
   SUBMIT
========================================================= */

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


    const unanswered =
      answers.filter(
        answer =>
          answer === null
      ).length;


    if (
      unanswered > 0
    ) {

      alert(
        `Please answer all 10 questions.\n\nUnanswered: ${unanswered}`
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


    try {

      await saveAssessment(
        score,
        correct,
        total,
        passed
      );


      showResult(
        score,
        correct,
        total,
        passed
      );

    } catch (error) {

      console.error(
        "Assessment save error:",
        error
      );


      alert(
        "The score was calculated, but it could not be saved. Please try again."
      );

    }

  }
);


/* =========================================================
   RESULT
========================================================= */

function showResult(
  score,
  correct,
  total,
  passed
) {

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
      "Chapter 5 Passed!";

    resultMessage.textContent =
      "You scored 75% or above. Deadlock is now completed and the next OS chapter can be unlocked.";

  } else {

    resultIcon.textContent =
      "📚";

    resultTitle.textContent =
      "Keep Practicing";

    resultMessage.textContent =
      "You need at least 75% to pass. Review Deadlock and retry the assessment.";

  }


  resultCard.scrollIntoView({
    behavior: "smooth"
  });

}


/* =========================================================
   RETRY
========================================================= */

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


/* =========================================================
   LOGOUT
========================================================= */

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


/* =========================================================
   AUTH
========================================================= */

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