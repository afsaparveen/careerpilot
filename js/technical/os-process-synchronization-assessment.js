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
   CHAPTER 4 QUESTIONS
   Source: OS PDF pages 27-28
========================================================= */

const questions = [

  {
    question:
      "What is the main purpose of process synchronization in an operating system?",

    options: [
      "To increase memory size",
      "To avoid deadlocks",
      "To ensure correct sequence of execution when processes share resources",
      "To reduce context switch time"
    ],

    answer: 2
  },

  {
    question:
      "Which of the following describes a race condition?",

    options: [
      "Two processes access different resources simultaneously",
      "A situation where concurrent access to shared data leads to unpredictable results depending on timing.",
      "A deadlock due to two processes waiting for each other",
      "A starvation scenario where one process never gets CPU time"
    ],

    answer: 1
  },

  {
    question:
      "In process synchronization, the Critical Section is:",

    options: [
      "The part of the OS code that handles system calls",
      "The segment where shared resources are accessed",
      "The waiting queue of the process",
      "The code segment responsible for I/O operations"
    ],

    answer: 1
  },

  {
    question:
      "Which of the following is not a condition for a solution to the Critical Section Problem?",

    options: [
      "Mutual Exclusion",
      "Deadlock Prevention",
      "Progress",
      "Bounded Waiting"
    ],

    answer: 1
  },

  {
    question:
      "Peterson’s Solution works for how many processes?",

    options: [
      "Only one",
      "Two",
      "Any number of processes",
      "Exactly four"
    ],

    answer: 1
  },

  {
    question:
      "The Bakery Algorithm is mainly designed to:",

    options: [
      "Eliminate starvation in CPU scheduling",
      "Implement non-preemptive scheduling",
      "Ensure fair access to the critical section",
      "Detect and recover from deadlock"
    ],

    answer: 2
  },

  {
    question:
      "A binary semaphore can have how many possible values?",

    options: [
      "Any non-negative integer",
      "0 and 1",
      "1 and 2",
      "0 and -1"
    ],

    answer: 1
  },

  {
    question:
      "What distinguishes a counting semaphore from a binary semaphore?",

    options: [
      "Binary semaphore allows multiple processes; counting allows only one",
      "Counting semaphore uses only 0 and 1",
      "Counting semaphore allows multiple instances of a resource",
      "Binary semaphore is implemented using mutex"
    ],

    answer: 2
  },

  {
    question:
      "Which of the following hardware synchronization methods involves disabling interrupts?",

    options: [
      "Compare and Swap",
      "Test and Set",
      "Spinlock",
      "Disable Interrupts"
    ],

    answer: 3
  },

  {
    question:
      "The Test-and-Set instruction is used to:",

    options: [
      "Enable interrupt handling",
      "Avoid deadlocks",
      "Set a flag to true and return its old value",
      "Schedule CPU for I/O bound processes"
    ],

    answer: 2
  },

  {
    question:
      "In the Producer-Consumer problem, the shared buffer is used to:",

    options: [
      "Store OS logs",
      "Communicate between kernel and hardware",
      "Synchronize output to printer",
      "Pass data between two processes using shared memory"
    ],

    answer: 3
  },

  {
    question:
      "What is the role of a mutex in synchronization?",

    options: [
      "Used only for file protection",
      "Ensures exclusive access to shared resources",
      "Used to count waiting processes",
      "Terminates processes after execution"
    ],

    answer: 1
  },

  {
    question:
      "A spinlock is most suitable when:",

    options: [
      "Processes wait for a very long time",
      "Lock is expected to be held briefly",
      "Context switch overhead is negligible",
      "Multithreading is not supported"
    ],

    answer: 1
  },

  {
    question:
      "A monitor in operating systems is:",

    options: [
      "A physical device to watch processes",
      "A low-level hardware synchronization tool",
      "A high-level synchronization construct that provides mutual exclusion and condition synchronization",
      "Used only in single-threaded environments"
    ],

    answer: 2
  },

  {
    question:
      "What is the purpose of a condition variable inside a monitor?",

    options: [
      "To lock critical sections",
      "To keep track of CPU-bound processes",
      "To block a process until a certain condition is true",
      "To switch the process to kernel mode"
    ],

    answer: 2
  }

];


/* =========================================================
   RENDER QUESTIONS
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


  assessments.processSynchronization = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "process-synchronization"
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
        `Please answer all 15 questions.\n\nUnanswered: ${unanswered}`
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
      "Chapter 4 Passed!";

    resultMessage.textContent =
      "You scored 75% or above. Process Synchronization is now completed and the next OS chapter can be unlocked.";

  } else {

    resultIcon.textContent =
      "📚";

    resultTitle.textContent =
      "Keep Practicing";

    resultMessage.textContent =
      "You need at least 75% to pass. Review Process Synchronization and retry the assessment.";

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