import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =======================================================
   CONFIG
======================================================= */

const TOTAL_CHAPTERS = 15;
const TOTAL_QUESTIONS = 45;

const FINAL_ASSESSMENT_KEY = "final";

const COMPLETION_KEY =
  "oopsCompleted";


/* =======================================================
   CHAPTERS
======================================================= */

const CHAPTERS = [

  {
    id: "oops-introduction",
    title: "Introduction"
  },

  {
    id: "oops-classes-objects",
    title: "Classes & Objects"
  },

  {
    id: "oops-access-friend",
    title: "Access Specifiers & Friend Class"
  },

  {
    id: "oops-four-pillars",
    title: "Four Pillars of OOP"
  },

  {
    id: "oops-encapsulation",
    title: "Encapsulation"
  },

  {
    id: "oops-constructors",
    title: "Constructors"
  },

  {
    id: "oops-destructor",
    title: "Destructor"
  },

  {
    id: "oops-scope-this-copy",
    title: "Scope Resolution & this Pointer"
  },

  {
    id: "oops-shallow-deep-copy",
    title: "Shallow & Deep Copy"
  },

  {
    id: "oops-inheritance",
    title: "Inheritance"
  },

  {
    id: "oops-diamond",
    title: "Diamond Problem"
  },

  {
    id: "oops-polymorphism",
    title: "Polymorphism"
  },

  {
    id: "oops-abstraction",
    title: "Abstraction"
  },

  {
    id: "oops-java-abstraction",
    title: "Java Abstract Class & Interface"
  },

  {
    id: "oops-static",
    title: "Static Data Member & Function"
  }

];


/* =======================================================
   DOM
======================================================= */

const loadingState =
  document.getElementById(
    "loadingState"
  );

const completionContent =
  document.getElementById(
    "completionContent"
  );

const errorState =
  document.getElementById(
    "errorState"
  );

const errorMessage =
  document.getElementById(
    "errorMessage"
  );

const finalScore =
  document.getElementById(
    "finalScore"
  );

const finalPercentage =
  document.getElementById(
    "finalPercentage"
  );

const attemptCount =
  document.getElementById(
    "attemptCount"
  );

const chapterGrid =
  document.getElementById(
    "chapterGrid"
  );


/* =======================================================
   AUTH
======================================================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;
    }

    await loadCompletion(
      user.uid
    );
  }
);


/* =======================================================
   LOAD COMPLETION
======================================================= */

async function loadCompletion(uid) {

  try {

    const userRef =
      doc(
        db,
        "users",
        uid
      );

    const snapshot =
      await getDoc(
        userRef
      );


    if (!snapshot.exists()) {

      showError(
        "No OOPs progress was found for your account."
      );

      return;
    }


    const userData =
      snapshot.data();


    const oopsProgress =
      userData.oopsProgress || {};


    const completedChapters =
      oopsProgress.completedChapters || {};


    const finalAssessment =
      oopsProgress.assessments?.[
        FINAL_ASSESSMENT_KEY
      ];


    const allChaptersCompleted =
      CHAPTERS.every(
        chapter =>
          completedChapters[
            chapter.id
          ] === true
      );


    const finalAssessmentPassed =
      finalAssessment?.passed === true;


    const officiallyCompleted =
      oopsProgress[
        COMPLETION_KEY
      ] === true;


    if (
      !allChaptersCompleted ||
      !finalAssessmentPassed ||
      !officiallyCompleted
    ) {

      showError(
        "Complete all 15 OOPs chapters and pass the final assessment first."
      );

      return;
    }


    renderCompletion(
      finalAssessment,
      completedChapters
    );

  } catch (error) {

    console.error(
      "OOPs completion loading error:",
      error
    );

    showError(
      "Unable to load your OOPs completion status."
    );
  }
}


/* =======================================================
   RENDER COMPLETION
======================================================= */

function renderCompletion(
  finalAssessment,
  completedChapters
) {

  const score =
    finalAssessment.score ?? 0;


  const percentage =
    finalAssessment.percentage ?? 0;


  const attempts =
    finalAssessment.attemptCount ?? 1;


  finalScore.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;


  finalPercentage.textContent =
    `${percentage}% — Passed`;


  attemptCount.textContent =
    attempts;


  renderChapters(
    completedChapters
  );


  loadingState.style.display =
    "none";


  completionContent.style.display =
    "block";
}


/* =======================================================
   RENDER CHAPTERS
======================================================= */

function renderChapters(
  completedChapters
) {

  chapterGrid.innerHTML = "";


  CHAPTERS.forEach(
    (chapter, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "chapter-item completed";


      item.innerHTML = `
        ✓ Chapter ${index + 1}
        — ${escapeHtml(
          chapter.title
        )}
      `;


      chapterGrid.appendChild(
        item
      );
    }
  );
}


/* =======================================================
   ERROR
======================================================= */

function showError(
  message
) {

  loadingState.style.display =
    "none";


  completionContent.style.display =
    "none";


  errorMessage.textContent =
    message;


  errorState.style.display =
    "block";
}


/* =======================================================
   ESCAPE HTML
======================================================= */

function escapeHtml(
  value
) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );
}