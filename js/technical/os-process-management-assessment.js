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
   CHAPTER 2 QUESTIONS
   Taken from pages 13-14 of the uploaded OS PDF.
========================================================= */

const questions = [

  {
    question:
      "What is the primary difference between a process and a program?",

    options: [
      "A process is stored on disk, while a program runs in memory",
      "A program is an active entity, while a process is a passive entity",
      "A program is a passive entity, while a process is an active entity",
      "Both are active entities"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following best describes a process in an Operating System?",

    options: [
      "A system call made by the OS",
      "A static sequence of instructions",
      "An executing instance of a program",
      "A hardware-level operation"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following is not a part of the Process Control Block (PCB)?",

    options: [
      "CPU registers",
      "Program counter",
      "Stack pointer",
      "Instruction Set Architecture (ISA)"
    ],

    answer: 3
  },


  {
    question:
      "When a context switch occurs, what happens to the PCB of the currently running process?",

    options: [
      "It is deleted",
      "It is updated and stored",
      "It is moved to user space",
      "It is flushed from memory"
    ],

    answer: 1
  },


  {
    question:
      "What is the correct sequence of process states in its lifecycle?",

    options: [
      "Ready → Running → Terminated → Waiting",
      "New → Ready → Running → Waiting → Terminated",
      "Running → New → Waiting → Terminated",
      "Ready → Waiting → Running → Terminated"
    ],

    answer: 1
  },


  {
    question:
      "A process is in the waiting state when:",

    options: [
      "It is waiting to be assigned to the CPU",
      "It is executing",
      "It is waiting for I/O operation to complete",
      "It is being terminated"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following is true about threads?",

    options: [
      "Threads have separate code and data segments",
      "Each thread has its own PCB",
      "Threads share code, data, and open files",
      "Threads have less overhead than processes"
    ],

    answer: 2
  },


  {
    question:
      "Which component is unique to each thread and not shared?",

    options: [
      "Code section",
      "Data segment",
      "Open files",
      "Stack"
    ],

    answer: 3
  },


  {
    question:
      "Which of the following statements is true about threads vs processes?",

    options: [
      "Context switching between threads is more expensive than between processes",
      "Threads do not support parallelism",
      "Threads are lighter and share the same memory space",
      "Processes are preferred over threads for concurrent tasks"
    ],

    answer: 2
  },


  {
    question:
      "What is one advantage of user-level threads over kernel-level threads?",

    options: [
      "Better CPU utilization",
      "Kernel handles scheduling",
      "Faster context switching",
      "Direct access to hardware"
    ],

    answer: 2
  },


  {
    question:
      "In kernel-level threads, the thread management is done by:",

    options: [
      "Application developer",
      "Operating System",
      "Compiler",
      "Virtual machine"
    ],

    answer: 1
  },


  {
    question:
      "Which multithreading model maps many user threads to one kernel thread?",

    options: [
      "One-to-One",
      "Many-to-Many",
      "Many-to-One",
      "Two-Level Model"
    ],

    answer: 2
  },


  {
    question:
      "Which multithreading model allows the OS to create a sufficient number of kernel threads based on demand from user threads?",

    options: [
      "Many-to-One",
      "One-to-One",
      "Many-to-Many",
      "Two-to-One"
    ],

    answer: 2
  },


  {
    question:
      "Context switching is:",

    options: [
      "Creating a new process",
      "Saving and loading process state during a switch",
      "Deleting an existing thread",
      "Running two processes simultaneously"
    ],

    answer: 1
  },


  {
    question:
      "A CPU-bound process:",

    options: [
      "Spends most of its time doing I/O operations",
      "Requires minimal CPU and more I/O",
      "Frequently yields the CPU",
      "Spends most of its time performing computations"
    ],

    answer: 3
  }

];


/* =========================================================
   RENDER QUESTIONS
========================================================= */

function renderQuestions() {

  questionContainer.innerHTML =
    "";


  questions.forEach(
    (
      question,
      index
    ) => {

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
        (
          option,
          optionIndex
        ) => {

          const label =
            document.createElement(
              "label"
            );


          label.className =
            "option";


          const radio =
            document.createElement(
              "input"
            );


          radio.type =
            "radio";


          radio.name =
            `question-${index}`;


          radio.value =
            optionIndex;


          radio.addEventListener(
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
            radio
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
    (
      _,
      index
    ) => {

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
   SAVE ASSESSMENT
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


  assessments.processManagement = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "process-management"
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
        (
          _,
          index
        ) => {

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
        `Please answer all 15 questions.\n\nUnanswered: ${unanswered}`
      );

      return;

    }


    let correct = 0;


    answers.forEach(
      (
        answer,
        index
      ) => {

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
        "Assessment was calculated, but the result could not be saved. Please try again."
      );

    }

  }
);


/* =========================================================
   SHOW RESULT
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
      "Chapter 2 Passed!";


    resultMessage.textContent =
      "You scored 75% or above. Process Management is now completed and the next OS chapter can be unlocked.";

  } else {

    resultIcon.textContent =
      "📚";


    resultTitle.textContent =
      "Keep Practicing";


    resultMessage.textContent =
      "You need at least 75% to pass. Review Process Management and retry the assessment.";

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