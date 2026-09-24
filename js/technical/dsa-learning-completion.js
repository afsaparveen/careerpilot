import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   MODULE DATA
========================= */

const modules = [
  {
    id: "dsa-foundations",
    title: "DSA Foundations",
    icon: "🧠"
  },
  {
    id: "dsa-linear",
    title: "Linear Data Structures",
    icon: "🔗"
  },
  {
    id: "dsa-search-sort-hash",
    title: "Searching, Sorting & Hashing",
    icon: "🔎"
  },
  {
    id: "dsa-trees-heaps",
    title: "Trees & Heaps",
    icon: "🌳"
  },
  {
    id: "dsa-graphs",
    title: "Graphs",
    icon: "🕸️"
  },
  {
    id: "dsa-advanced",
    title: "Advanced Problem Solving",
    icon: "🚀"
  }
];


/* =========================
   DOM
========================= */

const loadingMessage =
  document.getElementById(
    "loadingMessage"
  );

const errorMessage =
  document.getElementById(
    "errorMessage"
  );

const moduleResultsList =
  document.getElementById(
    "moduleResultsList"
  );

const moduleCount =
  document.getElementById(
    "moduleCount"
  );

const topicCount =
  document.getElementById(
    "topicCount"
  );

const assessmentCount =
  document.getElementById(
    "assessmentCount"
  );

const averageScore =
  document.getElementById(
    "averageScore"
  );

const completionPercentage =
  document.getElementById(
    "completionPercentage"
  );

const userName =
  document.getElementById(
    "userName"
  );

const userEmail =
  document.getElementById(
    "userEmail"
  );

const userAvatar =
  document.getElementById(
    "userAvatar"
  );

const practiceBtn =
  document.getElementById(
    "practiceBtn"
  );

const learningBtn =
  document.getElementById(
    "learningBtn"
  );

const dashboardBtn =
  document.getElementById(
    "dashboardBtn"
  );


/* =========================
   AUTH
========================= */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }

    await loadCompletion(user);

  }
);


/* =========================
   LOAD COMPLETION
========================= */

async function loadCompletion(
  user
) {

  try {

    userName.textContent =
      user.displayName ||
      "CareerPilot Learner";

    userEmail.textContent =
      user.email ||
      "";

    userAvatar.textContent =
      getInitial(
        user.displayName ||
        user.email ||
        "U"
      );


    const userRef =
      doc(
        db,
        "users",
        user.uid
      );

    const snapshot =
      await getDoc(userRef);

    if (!snapshot.exists()) {

      showNotCompleted();

      return;

    }


    const data =
      snapshot.data();

    const progress =
      data.dsaLearningProgress;


    if (!progress) {

      showNotCompleted();

      return;

    }


    const allModulesCompleted =
      modules.every(
        (module) =>
          progress.completedModules?.[
            module.id
          ] === true
      );


    const finalFlag =
      progress.dsaCompleted === true;


    /*
     * We require both the individual six
     * modules and the final completion flag.
     */

    if (
      !allModulesCompleted ||
      !finalFlag
    ) {

      showNotCompleted();

      return;

    }


    renderCompletion(
      progress
    );


  } catch (error) {

    console.error(
      "Error loading DSA completion:",
      error
    );

    loadingMessage.style.display =
      "none";

    errorMessage.style.display =
      "block";

    errorMessage.textContent =
      "Unable to verify your DSA completion. Please try again.";

  }

}


/* =========================
   RENDER COMPLETION
========================= */

function renderCompletion(
  progress
) {

  loadingMessage.style.display =
    "none";

  errorMessage.style.display =
    "none";


  const assessments =
    progress.assessments || {};


  const completedModules =
    modules.filter(
      (module) =>
        progress.completedModules?.[
          module.id
        ] === true
    );


  const passedAssessments =
    modules.filter(
      (module) =>
        assessments[
          module.id
        ]?.passed === true
    );


  let totalScore = 0;

  let scoreCount = 0;


  modules.forEach(
    (module) => {

      const result =
        assessments[
          module.id
        ];

      if (
        result &&
        typeof result.percentage ===
          "number"
      ) {

        totalScore +=
          result.percentage;

        scoreCount++;

      }

    }
  );


  const avg =
    scoreCount > 0
      ? Math.round(
          totalScore /
          scoreCount
        )
      : 0;


  moduleCount.textContent =
    `${completedModules.length} / ${modules.length}`;


  assessmentCount.textContent =
    `${passedAssessments.length} / ${modules.length}`;


  averageScore.textContent =
    `${avg}%`;


  /*
   * The curriculum contains:
   * 10 + 5 + 6 + 5 + 6 + 5 = 37 topics.
   */

  const totalTopics = 37;

  topicCount.textContent =
    totalTopics;


  completionPercentage.textContent =
    "100%";


  renderModuleResults(
    assessments
  );

}


/* =========================
   MODULE RESULTS
========================= */

function renderModuleResults(
  assessments
) {

  moduleResultsList.innerHTML = "";


  modules.forEach(
    (module, index) => {

      const result =
        assessments[
          module.id
        ] || {};


      const score =
        typeof result.percentage ===
          "number"
          ? `${result.percentage}%`
          : "Completed";


      const total =
        result.total
          ? `${result.score} / ${result.total}`
          : "";


      const item =
        document.createElement(
          "div"
        );

      item.className =
        "module-result";


      item.innerHTML = `

        <div class="module-result-icon">
          ${module.icon}
        </div>

        <div>

          <h3>
            Module ${index + 1}:
            ${module.title}
          </h3>

          <p>
            Assessment completed successfully
          </p>

        </div>

        <div class="module-score">

          <strong>
            ✓ ${score}
          </strong>

          <small>
            ${total}
          </small>

        </div>

      `;


      moduleResultsList.appendChild(
        item
      );

    }
  );

}


/* =========================
   NOT COMPLETED
========================= */

function showNotCompleted() {

  loadingMessage.style.display =
    "none";

  errorMessage.style.display =
    "block";

  errorMessage.textContent =
    "Complete all 6 DSA modules and pass their assessments to unlock this page.";

}


/* =========================
   INITIAL
========================= */

function getInitial(
  value
) {

  return value
    .trim()
    .charAt(0)
    .toUpperCase();

}


/* =========================
   ACTIONS
========================= */

practiceBtn.addEventListener(
  "click",
  () => {

    /*
     * This intentionally goes to
     * the existing LeetCode / DSA
     * practice system.
     */

    window.location.href =
      "dsa.html";

  }
);


learningBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "dsa-learning.html";

  }
);


dashboardBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "dashboard.html";

  }
);