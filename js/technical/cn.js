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


const DATA_URL =
  "../data/cn-curriculum.json";

const PROGRESS_KEY =
  "cnProgress";


/*
  Assessment files will be added after
  the learning chapters are complete.
*/
const assessmentRoutes = {
  "cn-introduction":
    "cn-introduction-assessment.html",

  "cn-devices":
    "cn-devices-assessment.html",

  "cn-physical-layer":
    "cn-physical-layer-assessment.html",

  "cn-data-link-layer":
    "cn-data-link-layer-assessment.html",

  "cn-network-layer":
    "cn-network-layer-assessment.html",

  "cn-transport-layer":
    "cn-transport-layer-assessment.html",

  "cn-session-layer":
    "cn-session-layer-assessment.html",

  "cn-presentation-layer":
    "cn-presentation-layer-assessment.html",

  "cn-application-layer":
    "cn-application-layer-assessment.html",

  "cn-delays":
    "cn-delays-assessment.html"
};


let curriculum = null;

let currentUser = null;

let progressData = {
  completedTopics: {},
  selfChecks: {},
  completedChapters: {},
  assessments: {}
};

let currentChapterIndex = 0;

let currentTopicIndex = 0;


/* =========================
   DOM
   ========================= */

const loadingBox =
  document.getElementById(
    "loadingBox"
  );

const errorBox =
  document.getElementById(
    "errorBox"
  );

const courseBox =
  document.getElementById(
    "courseBox"
  );

const chapterList =
  document.getElementById(
    "chapterList"
  );

const chapterCount =
  document.getElementById(
    "chapterCount"
  );

const coursePercent =
  document.getElementById(
    "coursePercent"
  );

const courseProgressBar =
  document.getElementById(
    "courseProgressBar"
  );

const chapterNumber =
  document.getElementById(
    "chapterNumber"
  );

const chapterTitle =
  document.getElementById(
    "chapterTitle"
  );

const chapterDescription =
  document.getElementById(
    "chapterDescription"
  );

const topicCounter =
  document.getElementById(
    "topicCounter"
  );

const topicNav =
  document.getElementById(
    "topicNav"
  );

const topicTitle =
  document.getElementById(
    "topicTitle"
  );

const learnContent =
  document.getElementById(
    "learnContent"
  );

const exampleContent =
  document.getElementById(
    "exampleContent"
  );

const keyPoints =
  document.getElementById(
    "keyPoints"
  );

const selfCheckInput =
  document.getElementById(
    "selfCheckInput"
  );

const selfCheckCount =
  document.getElementById(
    "selfCheckCount"
  );

const completeTopicBtn =
  document.getElementById(
    "completeTopicBtn"
  );

const completionMessage =
  document.getElementById(
    "completionMessage"
  );

const previousTopicBtn =
  document.getElementById(
    "previousTopicBtn"
  );

const nextTopicBtn =
  document.getElementById(
    "nextTopicBtn"
  );

const previousBtn =
  document.getElementById(
    "previousBtn"
  );

const nextBtn =
  document.getElementById(
    "nextBtn"
  );

const assessmentBtn =
  document.getElementById(
    "assessmentBtn"
  );

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );


/* =========================
   UTILITIES
   ========================= */

function showError(message) {
  errorBox.textContent =
    message;

  errorBox.hidden = false;
}


function hideError() {
  errorBox.textContent = "";

  errorBox.hidden = true;
}


function showCourse() {
  loadingBox.hidden = true;
  courseBox.hidden = false;
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function topicKey(
  chapterId,
  topicId
) {
  return `${chapterId}:${topicId}`;
}


function isTopicCompleted(
  chapterId,
  topicId
) {
  return Boolean(
    progressData.completedTopics[
      topicKey(
        chapterId,
        topicId
      )
    ]
  );
}


function isChapterCompleted(
  chapterId
) {
  return Boolean(
    progressData.completedChapters[
      chapterId
    ]
  );
}


/* =========================
   UNLOCK LOGIC
   ========================= */

function isChapterUnlocked(index) {

  if (index === 0) {
    return true;
  }

  const previousChapter =
    curriculum.chapters[
      index - 1
    ];

  return isChapterCompleted(
    previousChapter.id
  );
}


function isTopicUnlocked(
  chapter,
  topicIndex
) {

  if (topicIndex === 0) {
    return true;
  }

  const previousTopic =
    chapter.topics[
      topicIndex - 1
    ];

  return isTopicCompleted(
    chapter.id,
    previousTopic.id
  );
}


/* =========================
   COURSE PROGRESS
   ========================= */

function getTotalTopics() {

  return curriculum.chapters
    .reduce(
      (total, chapter) =>
        total + chapter.topics.length,
      0
    );
}


function getCompletedTopicCount() {

  let count = 0;

  curriculum.chapters.forEach(
    (chapter) => {

      chapter.topics.forEach(
        (topic) => {

          if (
            isTopicCompleted(
              chapter.id,
              topic.id
            )
          ) {
            count++;
          }

        }
      );

    }
  );

  return count;
}


function updateCourseProgress() {

  const total =
    getTotalTopics();

  const completed =
    getCompletedTopicCount();

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  coursePercent.textContent =
    `${percentage}%`;

  courseProgressBar.style.width =
    `${percentage}%`;


  const completedChapters =
    curriculum.chapters.filter(
      (chapter) =>
        isChapterCompleted(
          chapter.id
        )
    ).length;


  chapterCount.textContent =
    `${completedChapters}/${curriculum.chapters.length}`;
}


/* =========================
   SIDEBAR
   ========================= */

function renderChapterList() {

  chapterList.innerHTML = "";

  curriculum.chapters.forEach(
    (chapter, index) => {

      const unlocked =
        isChapterUnlocked(index);

      const completed =
        isChapterCompleted(
          chapter.id
        );

      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "cn-chapter-item";

      if (
        index === currentChapterIndex
      ) {
        button.classList.add(
          "active"
        );
      }

      if (completed) {
        button.classList.add(
          "completed"
        );
      }

      if (!unlocked) {
        button.classList.add(
          "locked"
        );

        button.disabled = true;
      }


      const statusText =
        completed
          ? "Completed"
          : unlocked
            ? "Available"
            : "Locked";


      button.innerHTML = `
        <span class="cn-chapter-number">
          ${
            completed
              ? "✓"
              : index + 1
          }
        </span>

        <span class="cn-chapter-info">

          <span class="cn-chapter-item-title">
            ${escapeHtml(
              chapter.title
            )}
          </span>

          <span class="cn-chapter-status">
            ${statusText}
          </span>

        </span>
      `;


      if (unlocked) {

        button.addEventListener(
          "click",
          () => {

            currentChapterIndex =
              index;

            currentTopicIndex =
              0;

            renderChapter();

            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          }
        );

      }


      chapterList.appendChild(
        button
      );

    }
  );
}


/* =========================
   TOPIC NAVIGATION
   ========================= */

function renderTopicNavigation(
  chapter
) {

  topicNav.innerHTML = "";

  chapter.topics.forEach(
    (topic, index) => {

      const unlocked =
        isTopicUnlocked(
          chapter,
          index
        );

      const completed =
        isTopicCompleted(
          chapter.id,
          topic.id
        );


      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "cn-topic-dot";


      if (
        index === currentTopicIndex
      ) {

        button.classList.add(
          "active"
        );

      }


      if (completed) {

        button.classList.add(
          "completed"
        );

      }


      if (!unlocked) {

        button.classList.add(
          "locked"
        );

        button.disabled = true;

      }


      button.textContent =
        completed
          ? "✓"
          : index + 1;


      button.title =
        `${index + 1}. ${topic.title}`;


      if (unlocked) {

        button.addEventListener(
          "click",
          () => {

            currentTopicIndex =
              index;

            renderTopic();

          }
        );

      }


      topicNav.appendChild(
        button
      );

    }
  );
}


/* =========================
   TOPIC RENDER
   ========================= */

function renderTopic() {

  const chapter =
    curriculum.chapters[
      currentChapterIndex
    ];

  const topic =
    chapter.topics[
      currentTopicIndex
    ];


  chapterNumber.textContent =
    `Chapter ${
      currentChapterIndex + 1
    }`;

  chapterTitle.textContent =
    chapter.title;

  chapterDescription.textContent =
    chapter.description;


  topicCounter.textContent =
    `${
      currentTopicIndex + 1
    } / ${
      chapter.topics.length
    }`;


  topicTitle.textContent =
    topic.title;


  learnContent.textContent =
    topic.learn;


  exampleContent.textContent =
    topic.example;


  keyPoints.innerHTML =
    topic.keyPoints
      .map(
        (point) =>
          `<li>${escapeHtml(point)}</li>`
      )
      .join("");


  const key =
    topicKey(
      chapter.id,
      topic.id
    );


  selfCheckInput.value =
    progressData.selfChecks[
      key
    ] || "";


  updateSelfCheckCount();


  const completed =
    isTopicCompleted(
      chapter.id,
      topic.id
    );


  if (completed) {

    completionMessage.hidden =
      false;

    completeTopicBtn.disabled =
      true;

    completeTopicBtn.textContent =
      "Topic Completed";

  } else {

    completionMessage.hidden =
      true;

    completeTopicBtn.disabled =
      false;

    completeTopicBtn.textContent =
      "Complete Topic";

  }


  renderTopicNavigation(
    chapter
  );


  updateNavigationButtons(
    chapter
  );


  updateAssessmentButton(
    chapter
  );


  renderChapterList();
}


/* =========================
   NAVIGATION BUTTONS
   ========================= */

function updateNavigationButtons(
  chapter
) {

  const hasPreviousTopic =
    currentTopicIndex > 0 ||
    currentChapterIndex > 0;


  previousTopicBtn.disabled =
    !hasPreviousTopic;

  previousBtn.disabled =
    !hasPreviousTopic;


  const currentTopicCompleted =
    isTopicCompleted(
      chapter.id,
      chapter.topics[
        currentTopicIndex
      ].id
    );


  const hasNextTopic =
    currentTopicIndex <
      chapter.topics.length - 1;


  nextTopicBtn.disabled =
    !hasNextTopic ||
    !currentTopicCompleted;


  nextBtn.disabled =
    !hasNextTopic ||
    !currentTopicCompleted;
}


/* =========================
   ASSESSMENT
   ========================= */

function allChapterTopicsCompleted(
  chapter
) {

  return chapter.topics.every(
    (topic) =>
      isTopicCompleted(
        chapter.id,
        topic.id
      )
  );
}


function updateAssessmentButton(
  chapter
) {

  const allCompleted =
    allChapterTopicsCompleted(
      chapter
    );


  const route =
    assessmentRoutes[
      chapter.id
    ];


  if (
    allCompleted &&
    route &&
    !isChapterCompleted(
      chapter.id
    )
  ) {

    assessmentBtn.hidden =
      false;

  } else {

    assessmentBtn.hidden =
      true;

  }
}


/* =========================
   SELF CHECK
   ========================= */

function updateSelfCheckCount() {

  const length =
    selfCheckInput.value.length;

  selfCheckCount.textContent =
    `${length} characters`;

}


async function saveProgress() {

  if (!currentUser) {
    throw new Error(
      "User is not authenticated."
    );
  }


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  await setDoc(
    userRef,
    {
      cnProgress: progressData
    },
    {
      merge: true
    }
  );
}


async function completeCurrentTopic() {

  const chapter =
    curriculum.chapters[
      currentChapterIndex
    ];

  const topic =
    chapter.topics[
      currentTopicIndex
    ];


  const answer =
    selfCheckInput.value.trim();


  if (answer.length < 40) {

    showError(
      "Please write at least 40 characters in the self-check before completing this topic."
    );

    selfCheckInput.focus();

    return;
  }


  hideError();


  const key =
    topicKey(
      chapter.id,
      topic.id
    );


  progressData.selfChecks[
    key
  ] = answer;


  progressData.completedTopics[
    key
  ] = true;


  completeTopicBtn.disabled =
    true;

  completeTopicBtn.textContent =
    "Saving...";


  try {

    await saveProgress();


    completionMessage.hidden =
      false;

    completeTopicBtn.textContent =
      "Topic Completed";


    updateCourseProgress();

    renderChapterList();

    updateNavigationButtons(
      chapter
    );

    updateAssessmentButton(
      chapter
    );


  } catch (error) {

    console.error(error);


    delete progressData
      .completedTopics[key];


    showError(
      "The topic could not be saved. Please check your Firebase connection and try again."
    );


    completeTopicBtn.disabled =
      false;

    completeTopicBtn.textContent =
      "Complete Topic";

  }

}


/* =========================
   MOVE TOPIC
   ========================= */

function goNextTopic() {

  const chapter =
    curriculum.chapters[
      currentChapterIndex
    ];


  if (
    currentTopicIndex <
    chapter.topics.length - 1
  ) {

    if (
      !isTopicCompleted(
        chapter.id,
        chapter.topics[
          currentTopicIndex
        ].id
      )
    ) {
      return;
    }


    currentTopicIndex++;

    renderTopic();

    return;
  }


  if (
    isChapterCompleted(
      chapter.id
    )
  ) {

    if (
      currentChapterIndex <
      curriculum.chapters.length - 1
    ) {

      currentChapterIndex++;

      currentTopicIndex =
        0;

      renderChapter();

    }

  }

}


function goPreviousTopic() {

  if (
    currentTopicIndex > 0
  ) {

    currentTopicIndex--;

    renderTopic();

    return;
  }


  if (
    currentChapterIndex > 0
  ) {

    currentChapterIndex--;

    const previousChapter =
      curriculum.chapters[
        currentChapterIndex
      ];

    currentTopicIndex =
      previousChapter.topics.length - 1;

    renderChapter();

  }

}


/* =========================
   CHAPTER
   ========================= */

function renderChapter() {

  if (
    !isChapterUnlocked(
      currentChapterIndex
    )
  ) {
    currentChapterIndex = 0;
    currentTopicIndex = 0;
  }


  const chapter =
    curriculum.chapters[
      currentChapterIndex
    ];


  if (
    !isTopicUnlocked(
      chapter,
      currentTopicIndex
    )
  ) {

    currentTopicIndex = 0;

    while (
      currentTopicIndex <
        chapter.topics.length - 1 &&
      isTopicCompleted(
        chapter.id,
        chapter.topics[
          currentTopicIndex
        ].id
      )
    ) {

      currentTopicIndex++;

    }

  }


  hideError();

  renderTopic();

  updateCourseProgress();

  showCourse();

}


/* =========================
   LOAD CURRICULUM
   ========================= */

async function loadCurriculum() {

  const response =
    await fetch(
      DATA_URL,
      {
        cache: "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      `Failed to load curriculum (${response.status})`
    );

  }


  curriculum =
    await response.json();


  if (
    !curriculum.chapters ||
    !Array.isArray(
      curriculum.chapters
    )
  ) {

    throw new Error(
      "Invalid CN curriculum structure."
    );

  }

}


/* =========================
   LOAD PROGRESS
   ========================= */

async function loadProgress() {

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


  if (
    snapshot.exists()
  ) {

    const data =
      snapshot.data();


    progressData = {
      completedTopics:
        data.cnProgress
          ?.completedTopics ||
        {},

      selfChecks:
        data.cnProgress
          ?.selfChecks ||
        {},

      completedChapters:
        data.cnProgress
          ?.completedChapters ||
        {},

      assessments:
        data.cnProgress
          ?.assessments ||
        {}
    };

  }

}


/* =========================
   LOGOUT
   ========================= */

async function logout() {

  try {

    await signOut(auth);

    window.location.href =
      "login.html";

  } catch (error) {

    console.error(error);

    showError(
      "Unable to log out. Please try again."
    );

  }

}


/* =========================
   INITIALIZE
   ========================= */

async function initialize() {

  try {

    await loadCurriculum();

    await loadProgress();


    currentChapterIndex =
      0;

    currentTopicIndex =
      0;


    renderChapter();


  } catch (error) {

    console.error(error);

    showError(
      "Unable to load the Computer Networks course. Please check that cn-curriculum.json exists and try again."
    );

    loadingBox.hidden =
      true;

  }

}


/* =========================
   EVENTS
   ========================= */

selfCheckInput.addEventListener(
  "input",
  () => {

    updateSelfCheckCount();

    hideError();

  }
);


completeTopicBtn.addEventListener(
  "click",
  completeCurrentTopic
);


nextTopicBtn.addEventListener(
  "click",
  () => {

    goNextTopic();

  }
);


nextBtn.addEventListener(
  "click",
  () => {

    goNextTopic();

  }
);


previousTopicBtn.addEventListener(
  "click",
  () => {

    goPreviousTopic();

  }
);


previousBtn.addEventListener(
  "click",
  () => {

    goPreviousTopic();

  }
);


assessmentBtn.addEventListener(
  "click",
  () => {

    const chapter =
      curriculum.chapters[
        currentChapterIndex
      ];

    const route =
      assessmentRoutes[
        chapter.id
      ];


    if (route) {

      window.location.href =
        route;

    }

  }
);


logoutBtn.addEventListener(
  "click",
  logout
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


    currentUser =
      user;


    await initialize();

  }
);