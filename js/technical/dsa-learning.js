import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================
   DOM
========================= */

const moduleStrip =
  document.getElementById("moduleStrip");

const topicList =
  document.getElementById("topicList");

const currentModuleTitle =
  document.getElementById("currentModuleTitle");

const topicNumber =
  document.getElementById("topicNumber");

const topicTitle =
  document.getElementById("topicTitle");

const topicStatus =
  document.getElementById("topicStatus");

const learnContent =
  document.getElementById("learnContent");

const exampleContent =
  document.getElementById("exampleContent");

const keyPointsList =
  document.getElementById("keyPointsList");

const selfCheckInput =
  document.getElementById("selfCheckInput");

const completeTopicBtn =
  document.getElementById("completeTopicBtn");

const overallProgressText =
  document.getElementById("overallProgressText");

const overallProgressBar =
  document.getElementById("overallProgressBar");

const assessmentTitle =
  document.getElementById("assessmentTitle");

const assessmentDescription =
  document.getElementById("assessmentDescription");

const assessmentBtn =
  document.getElementById("assessmentBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const toast =
  document.getElementById("toast");


/* =========================
   STATE
========================= */

let curriculum = null;

let currentUser = null;

let currentModuleIndex = 0;

let currentTopicIndex = 0;

let dsaLearningProgress = {
  completedTopics: {},
  selfChecks: {},
  completedModules: {},
  assessments: {}
};


/* =========================
   ASSESSMENT ROUTES
========================= */

const assessmentRoutes = {
  "dsa-foundations":
    "dsa-foundations-assessment.html",

  "dsa-linear":
    "dsa-linear-assessment.html",

  "dsa-search-sort-hash":
    "dsa-search-sort-hash-assessment.html",

  "dsa-trees-heaps":
    "dsa-trees-heaps-assessment.html",

  "dsa-graphs":
    "dsa-graphs-assessment.html",

  "dsa-advanced":
    "dsa-advanced-assessment.html"
};


/* =========================
   AUTH
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  await loadCurriculum();

  await loadProgress();

  renderEverything();

});


/* =========================
   LOAD CURRICULUM
========================= */

async function loadCurriculum() {

  try {

    const response = await fetch(
      "../data/dsa-curriculum.json"
    );

    if (!response.ok) {
      throw new Error(
        "Unable to load DSA curriculum."
      );
    }

    curriculum = await response.json();

  } catch (error) {

    console.error(error);

    showToast(
      "Could not load DSA curriculum."
    );

  }

}


/* =========================
   LOAD FIRESTORE PROGRESS
========================= */

async function loadProgress() {

  if (!currentUser) {
    return;
  }

  try {

    const userRef = doc(
      db,
      "users",
      currentUser.uid
    );

    const snapshot =
      await getDoc(userRef);

    if (!snapshot.exists()) {
      return;
    }

    const data = snapshot.data();

    if (data.dsaLearningProgress) {

      dsaLearningProgress = {
        completedTopics:
          data.dsaLearningProgress.completedTopics || {},

        selfChecks:
          data.dsaLearningProgress.selfChecks || {},

        completedModules:
          data.dsaLearningProgress.completedModules || {},

        assessments:
          data.dsaLearningProgress.assessments || {}
      };

    }

  } catch (error) {

    console.error(
      "Error loading DSA learning progress:",
      error
    );

    showToast(
      "Could not load saved progress."
    );

  }

}


/* =========================
   SAVE PROGRESS
========================= */

async function saveProgress() {

  if (!currentUser) {
    return;
  }

  try {

    const userRef = doc(
      db,
      "users",
      currentUser.uid
    );

    await setDoc(
      userRef,
      {
        dsaLearningProgress
      },
      {
        merge: true
      }
    );

  } catch (error) {

    console.error(
      "Error saving DSA learning progress:",
      error
    );

    showToast(
      "Could not save your progress."
    );

  }

}


/* =========================
   RENDER EVERYTHING
========================= */

function renderEverything() {

  if (!curriculum) {
    return;
  }

  renderModules();

  renderTopics();

  renderCurrentTopic();

  updateOverallProgress();

  updateAssessmentState();

}


/* =========================
   MODULES
========================= */

function renderModules() {

  moduleStrip.innerHTML = "";

  curriculum.modules.forEach(
    (module, index) => {

      const card =
        document.createElement("button");

      card.type = "button";

      card.className =
        "module-card";

      const unlocked =
        isModuleUnlocked(index);

      const completed =
        isModuleCompleted(module.id);

      if (index === currentModuleIndex) {
        card.classList.add("active");
      }

      if (!unlocked) {
        card.classList.add("locked");
      }

      const progress =
        getModuleProgress(module);

      card.innerHTML = `
        <div class="module-icon">
          ${module.icon}
        </div>

        <span class="module-number">
          Module ${index + 1}
        </span>

        <h4>
          ${module.title}
        </h4>

        <div class="module-mini-progress">
          <div
            class="module-mini-fill"
            style="width: ${progress}%"
          ></div>
        </div>

        <small>
          ${
            completed
              ? "Completed"
              : `${progress}%`
          }
        </small>
      `;

      if (unlocked) {

        card.addEventListener(
          "click",
          () => {

            currentModuleIndex = index;

            currentTopicIndex = getFirstAvailableTopic(
              module
            );

            renderEverything();

          }
        );

      }

      moduleStrip.appendChild(card);

    }
  );

}


/* =========================
   TOPICS
========================= */

function renderTopics() {

  const module =
    curriculum.modules[currentModuleIndex];

  currentModuleTitle.textContent =
    module.title;

  topicList.innerHTML = "";

  module.topics.forEach(
    (topic, index) => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className = "topic-item";

      const completed =
        isTopicCompleted(
          module.id,
          topic.id
        );

      const unlocked =
        isTopicUnlocked(
          module,
          index
        );

      if (index === currentTopicIndex) {
        button.classList.add("active");
      }

      if (completed) {
        button.classList.add("completed");
      }

      if (!unlocked) {
        button.classList.add("locked");
      }

      button.innerHTML = `

        <span class="topic-check">
          ${
            completed
              ? "✓"
              : unlocked
              ? index + 1
              : "🔒"
          }
        </span>

        <span>
          ${topic.title}
        </span>

      `;

      if (unlocked) {

        button.addEventListener(
          "click",
          () => {

            currentTopicIndex =
              index;

            renderTopics();

            renderCurrentTopic();

            updateAssessmentState();

          }
        );

      }

      topicList.appendChild(button);

    }
  );

}


/* =========================
   CURRENT TOPIC
========================= */

function renderCurrentTopic() {

  const module =
    curriculum.modules[currentModuleIndex];

  const topic =
    module.topics[currentTopicIndex];

  if (!topic) {
    return;
  }

  topicNumber.textContent =
    `Topic ${currentTopicIndex + 1} of ${module.topics.length}`;

  topicTitle.textContent =
    topic.title;

  learnContent.innerHTML =
    topic.content;

  exampleContent.innerHTML =
    topic.example;

  keyPointsList.innerHTML = "";

  topic.keyPoints.forEach(
    (point) => {

      const li =
        document.createElement("li");

      li.textContent = point;

      keyPointsList.appendChild(li);

    }
  );

  const completed =
    isTopicCompleted(
      module.id,
      topic.id
    );

  topicStatus.textContent =
    completed
      ? "Completed"
      : "Not completed";

  topicStatus.classList.toggle(
    "completed",
    completed
  );

  const topicKey =
    getTopicKey(
      module.id,
      topic.id
    );

  selfCheckInput.value =
    dsaLearningProgress
      .selfChecks[topicKey] || "";

  completeTopicBtn.disabled =
    completed;

  completeTopicBtn.textContent =
    completed
      ? "✓ Topic Completed"
      : "Mark Topic Complete";

}


/* =========================
   COMPLETE TOPIC
========================= */

completeTopicBtn.addEventListener(
  "click",
  async () => {

    if (!curriculum) {
      return;
    }

    const module =
      curriculum.modules[currentModuleIndex];

    const topic =
      module.topics[currentTopicIndex];

    const selfCheck =
      selfCheckInput.value.trim();

    if (selfCheck.length < 10) {

      showToast(
        "Write a short explanation before completing the topic."
      );

      selfCheckInput.focus();

      return;

    }

    const key =
      getTopicKey(
        module.id,
        topic.id
      );

    dsaLearningProgress
      .selfChecks[key] = selfCheck;

    dsaLearningProgress
      .completedTopics[key] = true;

    await saveProgress();

    showToast(
      "Topic completed successfully! 🎉"
    );

    const nextTopicIndex =
      currentTopicIndex + 1;

    if (
      nextTopicIndex <
      module.topics.length
    ) {

      currentTopicIndex =
        nextTopicIndex;

    } else {

      showToast(
        "All topics completed. Assessment unlocked! 🎯"
      );

    }

    renderEverything();

  }
);


/* =========================
   ASSESSMENT STATE
========================= */

function updateAssessmentState() {

  const module =
    curriculum.modules[currentModuleIndex];

  const allTopicsCompleted =
    areAllTopicsCompleted(module);

  const assessmentResult =
    dsaLearningProgress
      .assessments[module.id];

  if (assessmentResult?.passed) {

    assessmentTitle.textContent =
      "Module assessment passed 🎉";

    assessmentDescription.textContent =
      `Score: ${assessmentResult.score || 0}%`;

    assessmentBtn.disabled = true;

    assessmentBtn.textContent =
      "✓ Assessment Passed";

    return;

  }

  if (!allTopicsCompleted) {

    assessmentTitle.textContent =
      "Complete all topics to unlock the assessment.";

    assessmentDescription.textContent =
      "Finish every topic in this module first.";

    assessmentBtn.disabled = true;

    assessmentBtn.textContent =
      "Assessment Locked";

    return;

  }

  assessmentTitle.textContent =
    "All topics completed!";

  assessmentDescription.textContent =
    "You can now take the module assessment.";

  assessmentBtn.disabled = false;

  assessmentBtn.textContent =
    "Start Assessment →";

}


/* =========================
   START ASSESSMENT
========================= */

assessmentBtn.addEventListener(
  "click",
  () => {

    const module =
      curriculum.modules[currentModuleIndex];

    const route =
      assessmentRoutes[module.id];

    if (!route) {

      showToast(
        "Assessment is being prepared."
      );

      return;

    }

    window.location.href =
      route;

  }
);


/* =========================
   MODULE UNLOCK
========================= */

function isModuleUnlocked(index) {

  if (index === 0) {
    return true;
  }

  const previousModule =
    curriculum.modules[index - 1];

  return Boolean(
    dsaLearningProgress.completedModules[
      previousModule.id
    ]
  );

}


/* =========================
   TOPIC UNLOCK
========================= */

function isTopicUnlocked(
  module,
  index
) {

  if (index === 0) {
    return true;
  }

  const previousTopic =
    module.topics[index - 1];

  return isTopicCompleted(
    module.id,
    previousTopic.id
  );

}


/* =========================
   FIRST AVAILABLE TOPIC
========================= */

function getFirstAvailableTopic(
  module
) {

  for (
    let i = 0;
    i < module.topics.length;
    i++
  ) {

    if (
      isTopicUnlocked(
        module,
        i
      )
    ) {

      if (
        !isTopicCompleted(
          module.id,
          module.topics[i].id
        )
      ) {
        return i;
      }

    }

  }

  return module.topics.length - 1;

}


/* =========================
   TOPIC COMPLETION
========================= */

function isTopicCompleted(
  moduleId,
  topicId
) {

  return Boolean(
    dsaLearningProgress.completedTopics[
      getTopicKey(
        moduleId,
        topicId
      )
    ]
  );

}


/* =========================
   ALL TOPICS COMPLETED
========================= */

function areAllTopicsCompleted(
  module
) {

  return module.topics.every(
    (topic) =>
      isTopicCompleted(
        module.id,
        topic.id
      )
  );

}


/* =========================
   MODULE COMPLETION
========================= */

function isModuleCompleted(
  moduleId
) {

  return Boolean(
    dsaLearningProgress.completedModules[
      moduleId
    ]
  );

}


/* =========================
   MODULE PROGRESS
========================= */

function getModuleProgress(
  module
) {

  if (!module.topics.length) {
    return 0;
  }

  const completed =
    module.topics.filter(
      (topic) =>
        isTopicCompleted(
          module.id,
          topic.id
        )
    ).length;

  return Math.round(
    (completed /
      module.topics.length) *
      100
  );

}


/* =========================
   OVERALL PROGRESS
========================= */

function updateOverallProgress() {

  let totalTopics = 0;

  let completedTopics = 0;

  curriculum.modules.forEach(
    (module) => {

      totalTopics +=
        module.topics.length;

      completedTopics +=
        module.topics.filter(
          (topic) =>
            isTopicCompleted(
              module.id,
              topic.id
            )
        ).length;

    }
  );

  const percentage =
    totalTopics === 0
      ? 0
      : Math.round(
          (completedTopics /
            totalTopics) *
            100
        );

  overallProgressText.textContent =
    `${percentage}%`;

  overallProgressBar.style.width =
    `${percentage}%`;

}


/* =========================
   TOPIC KEY
========================= */

function getTopicKey(
  moduleId,
  topicId
) {

  return `${moduleId}_${topicId}`;

}


/* =========================
   TOAST
========================= */

function showToast(
  message
) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout =
    setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      2500
    );

}


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

      window.location.href =
        "login.html";

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      showToast(
        "Unable to logout."
      );

    }

  }
);