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
   CHAPTER 6 QUESTIONS
   Source: OS PDF page 36
========================================================= */

const questions = [

  {
    question:
      "Which of the following is true about message passing in IPC?",

    options: [
      "It allows processes to share the same memory space",
      "It requires processes to be on the same machine",
      "Communication occurs through sending and receiving messages",
      "It is faster than shared memory communication in all cases"
    ],

    answer: 2
  },


  {
    question:
      "What is a key advantage of shared memory over message passing?",

    options: [
      "It offers better synchronization control",
      "It is more secure",
      "It avoids the need for synchronization",
      "It allows direct access to common data, leading to faster communication"
    ],

    answer: 3
  },


  {
    question:
      "Which IPC mechanism is unidirectional and used for parent-child communication?",

    options: [
      "Socket",
      "FIFO",
      "Pipe",
      "Signal"
    ],

    answer: 2
  },


  {
    question:
      "What distinguishes a FIFO (named pipe) from a regular pipe?",

    options: [
      "FIFO can only be used within the same process",
      "FIFO allows communication between unrelated processes",
      "FIFO is bidirectional",
      "FIFO doesn’t require any file system support"
    ],

    answer: 1
  },


  {
    question:
      "Signals are typically used for:",

    options: [
      "High-volume data transfer between processes",
      "Low-level process control and simple notifications",
      "Creating shared memory",
      "Managing sockets and FIFOs"
    ],

    answer: 1
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


  assessments.interProcessCommunication = {

    score,

    correct,

    total,

    passed,

    completedAt:
      new Date().toISOString()

  };


  if (passed) {

    completedChapters[
      "inter-process-communication"
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
        `Please answer all 5 questions.\n\nUnanswered: ${unanswered}`
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
      "Chapter 6 Passed!";


    resultMessage.textContent =
      "You scored 75% or above. Inter-process Communication is now completed and Memory Management can be unlocked.";

  } else {

    resultIcon.textContent =
      "📚";


    resultTitle.textContent =
      "Keep Practicing";


    resultMessage.textContent =
      "You need at least 75% to pass. Review Inter-process Communication and retry the assessment.";

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