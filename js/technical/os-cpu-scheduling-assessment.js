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
   CPU SCHEDULING QUESTIONS
   Source: OS PDF pages 21-22
========================================================= */

const questions = [

  {
    question:
      "Which of the following determines the next process to be executed on the CPU?",

    options: [
      "Long-term scheduler",
      "Short-term scheduler",
      "Dispatcher",
      "Medium-term scheduler"
    ],

    answer: 1
  },

  {
    question:
      "Which of the following is true about CPU-bound processes?",

    options: [
      "Spend most of the time waiting for I/O",
      "Always have higher priority",
      "Perform most of their operations using the CPU",
      "Require minimal CPU usage"
    ],

    answer: 2
  },

  {
    question:
      "Which component gives control of the CPU to the process selected by the scheduler?",

    options: [
      "Long-term scheduler",
      "Dispatcher",
      "CPU controller",
      "Ready queue"
    ],

    answer: 1
  },

  {
    question:
      "Which scheduling algorithm may lead to the convoy effect?",

    options: [
      "First-Come, First-Served",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling"
    ],

    answer: 0
  },

  {
    question:
      "Which algorithm gives the minimum average waiting time if all burst times are known?",

    options: [
      "FCFS",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling"
    ],

    answer: 1
  },

  {
    question:
      "In Round Robin, if the time quantum is too small, it leads to:",

    options: [
      "Convoy effect",
      "Process starvation",
      "High context switching overhead",
      "Better performance"
    ],

    answer: 2
  },

  {
    question:
      "Which algorithm is preemptive and selects the process with the least remaining burst time?",

    options: [
      "FCFS",
      "SJF",
      "Shortest Remaining Time First (SRTF)",
      "Round Robin"
    ],

    answer: 2
  },

  {
    question:
      "Which scheduling algorithm may cause starvation for low-priority processes?",

    options: [
      "FCFS",
      "Round Robin",
      "Priority Scheduling",
      "SJF"
    ],

    answer: 2
  },

  {
    question:
      "The scheduler that decides which job to admit into the system is called:",

    options: [
      "Long-term scheduler",
      "Short-term scheduler",
      "Medium-term scheduler",
      "Dispatcher"
    ],

    answer: 0
  },

  {
    question:
      "Which queue stores processes that are waiting to be assigned to the CPU?",

    options: [
      "Job Queue",
      "Ready Queue",
      "Waiting Queue",
      "Device Queue"
    ],

    answer: 1
  },

  {
    question:
      "Processes waiting for I/O are placed in the:",

    options: [
      "Ready Queue",
      "Waiting Queue",
      "Swapped Queue",
      "CPU Queue"
    ],

    answer: 1
  },

  {
    question:
      "Which scheduler may suspend and swap out processes to manage memory?",

    options: [
      "Long-term",
      "Medium-term",
      "Short-term",
      "I/O scheduler"
    ],

    answer: 1
  },

  {
    question:
      "In Multilevel Feedback Queue, processes can:",

    options: [
      "Only run in one fixed queue",
      "Not change priority",
      "Move between queues based on behavior",
      "Only run once"
    ],

    answer: 2
  },

  {
    question:
      "Which scheduling algorithm is best for time-sharing systems?",

    options: [
      "FCFS",
      "Round Robin",
      "SJF",
      "Priority Scheduling"
    ],

    answer: 1
  },

  {
    question:
      "A major disadvantage of SJF is:",

    options: [
      "High overhead",
      "Starvation of longer processes",
      "Low CPU utilization",
      "Low throughput"
    ],

    answer: 1
  },

  {
    question:
      "A Gantt chart is used to show:",

    options: [
      "Memory allocation",
      "I/O operations",
      "Process execution order over time",
      "Cache usage"
    ],

    answer: 2
  },

  {
    question:
      "Which of the following is NOT a CPU scheduling criterion?",

    options: [
      "Turnaround time",
      "CPU utilization",
      "Throughput",
      "Disk space"
    ],

    answer: 3
  },

  {
    question:
      "Aging in scheduling is used to:",

    options: [
      "Refresh old processes",
      "Prevent starvation",
      "Increase time quantum",
      "Remove finished jobs"
    ],

    answer: 1
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


  assessments.cpuScheduling = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "cpu-scheduling"
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
        `Please answer all 18 questions.\n\nUnanswered: ${unanswered}`
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
      "Chapter 3 Passed!";


    resultMessage.textContent =
      "You scored 75% or above. CPU Scheduling is now completed and the next OS chapter can be unlocked.";

  } else {

    resultIcon.textContent =
      "📚";


    resultTitle.textContent =
      "Keep Practicing";


    resultMessage.textContent =
      "You need at least 75% to pass. Review CPU Scheduling and retry the assessment.";

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