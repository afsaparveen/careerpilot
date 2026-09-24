/* =========================================================
   OPERATING SYSTEMS LEARNING MODULE
   CareerPilot AI

   Source:
   ../data/os-curriculum.json

   FLOW:

   Chapter 1
      ↓
   Learn Topics
      ↓
   Complete Topics
      ↓
   Assessment
      ↓
   Score >= 75%
      ↓
   Chapter Completed
      ↓
   Next Chapter Unlocked
========================================================= */

import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const chapterList =
    document.getElementById("chapterList");

const chapterCount =
    document.getElementById("chapterCount");

const coursePercent =
    document.getElementById("coursePercent");

const emptyState =
    document.getElementById("emptyState");

const courseView =
    document.getElementById("courseView");

const loadError =
    document.getElementById("loadError");

const chapterBadge =
    document.getElementById("chapterBadge");

const chapterTitle =
    document.getElementById("chapterTitle");

const topicTitle =
    document.getElementById("topicTitle");

const topicCounter =
    document.getElementById("topicCounter");

const topicNav =
    document.getElementById("topicNav");

const learnText =
    document.getElementById("learnText");

const exampleText =
    document.getElementById("exampleText");

const keyPoints =
    document.getElementById("keyPoints");

const selfCheck =
    document.getElementById("selfCheck");

const selfCheckCount =
    document.getElementById("selfCheckCount");

const completeTopicBtn =
    document.getElementById("completeTopicBtn");

const completeMessage =
    document.getElementById("completeMessage");

const prevTopicBtn =
    document.getElementById("prevTopicBtn");

const nextTopicBtn =
    document.getElementById("nextTopicBtn");

const assessmentBtn =
    document.getElementById("assessmentBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   STATE
========================================================= */

let user = null;

let curriculum = null;

let currentChapterIndex = 0;

let currentTopicIndex = 0;

let progress = {
    completedTopics: {},
    selfChecks: {},
    completedChapters: {},
    assessments: {}
};


/* =========================================================
   DOM CHECK
========================================================= */

function checkRequiredElements() {

    const required = {
        chapterList,
        chapterCount,
        coursePercent,
        emptyState,
        courseView,
        loadError,
        chapterBadge,
        chapterTitle,
        topicTitle,
        topicCounter,
        topicNav,
        learnText,
        exampleText,
        keyPoints,
        selfCheck,
        selfCheckCount,
        completeTopicBtn,
        completeMessage,
        prevTopicBtn,
        nextTopicBtn,
        assessmentBtn,
        logoutBtn
    };

    const missing = [];

    Object.entries(required).forEach(
        ([name, element]) => {

            if (!element) {
                missing.push(name);
            }

        }
    );

    if (missing.length > 0) {

        console.error(
            "Missing OS HTML elements:",
            missing
        );

        return false;
    }

    return true;
}


/* =========================================================
   LOAD CURRICULUM
========================================================= */

async function loadCurriculum() {

    const response =
        await fetch(
            "../data/os-curriculum.json",
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `Could not load os-curriculum.json. HTTP ${response.status}`
        );
    }

    const data =
        await response.json();

    if (
        !data ||
        !Array.isArray(data.chapters) ||
        data.chapters.length === 0
    ) {

        throw new Error(
            "os-curriculum.json does not contain valid OS chapters."
        );
    }

    return data;
}


/* =========================================================
   LOAD FIRESTORE PROGRESS
========================================================= */

async function loadProgress() {

    if (!user) {
        return;
    }

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );

    const snapshot =
        await getDoc(
            userRef
        );

    if (!snapshot.exists()) {

        progress = {
            completedTopics: {},
            selfChecks: {},
            completedChapters: {},
            assessments: {}
        };

        return;
    }

    const data =
        snapshot.data();

    const saved =
        data.osProgress || {};

    progress = {

        completedTopics:
            saved.completedTopics || {},

        selfChecks:
            saved.selfChecks || {},

        completedChapters:
            saved.completedChapters || {},

        assessments:
            saved.assessments || {}

    };
}


/* =========================================================
   SAVE FIRESTORE PROGRESS
========================================================= */

async function saveProgress() {

    if (!user) {
        throw new Error(
            "User is not authenticated."
        );
    }

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );

    await setDoc(
        userRef,
        {
            osProgress: {
                completedTopics:
                    progress.completedTopics,

                selfChecks:
                    progress.selfChecks,

                completedChapters:
                    progress.completedChapters,

                assessments:
                    progress.assessments
            }
        },
        {
            merge: true
        }
    );
}


/* =========================================================
   TOPIC KEY
========================================================= */

function getTopicKey(
    chapter,
    topic
) {

    return (
        `${chapter.id}__${topic.id}`
    );
}


/* =========================================================
   CHECK TOPIC COMPLETION
========================================================= */

function isTopicCompleted(
    chapter,
    topic
) {

    const key =
        getTopicKey(
            chapter,
            topic
        );

    return Boolean(
        progress.completedTopics[key]
    );
}


/* =========================================================
   CHECK CHAPTER COMPLETION
========================================================= */

function isChapterCompleted(
    chapter
) {

    return Boolean(
        progress.completedChapters[
            chapter.id
        ]
    );
}


/* =========================================================
   CHECK CHAPTER UNLOCK
========================================================= */

function isChapterUnlocked(
    index
) {

    /*
       Chapter 1 is always unlocked.
    */

    if (index === 0) {
        return true;
    }

    const previousChapter =
        curriculum.chapters[
            index - 1
        ];

    return isChapterCompleted(
        previousChapter
    );
}


/* =========================================================
   CHECK TOPIC UNLOCK
========================================================= */

function isTopicUnlocked(
    chapter,
    index
) {

    /*
       First topic is always unlocked.
    */

    if (index === 0) {
        return true;
    }

    const previousTopic =
        chapter.topics[
            index - 1
        ];

    return isTopicCompleted(
        chapter,
        previousTopic
    );
}


/* =========================================================
   CHECK ALL TOPICS
========================================================= */

function areAllTopicsCompleted(
    chapter
) {

    const topics =
        Array.isArray(
            chapter.topics
        )
            ? chapter.topics
            : [];

    if (topics.length === 0) {
        return false;
    }

    for (
        let i = 0;
        i < topics.length;
        i++
    ) {

        if (
            !isTopicCompleted(
                chapter,
                topics[i]
            )
        ) {

            return false;
        }
    }

    return true;
}


/* =========================================================
   FIND STARTING TOPIC
========================================================= */

function findStartingTopicIndex(
    chapter
) {

    const topics =
        Array.isArray(
            chapter.topics
        )
            ? chapter.topics
            : [];

    for (
        let i = 0;
        i < topics.length;
        i++
    ) {

        if (
            !isTopicCompleted(
                chapter,
                topics[i]
            )
        ) {

            return i;
        }
    }

    if (topics.length === 0) {
        return 0;
    }

    return topics.length - 1;
}


/* =========================================================
   COURSE PROGRESS
========================================================= */

function calculateCourseProgress() {

    let totalTopics = 0;

    let completedTopics = 0;

    let completedChapters = 0;

    curriculum.chapters.forEach(
        chapter => {

            const topics =
                Array.isArray(
                    chapter.topics
                )
                    ? chapter.topics
                    : [];

            totalTopics +=
                topics.length;

            topics.forEach(
                topic => {

                    if (
                        isTopicCompleted(
                            chapter,
                            topic
                        )
                    ) {

                        completedTopics++;
                    }
                }
            );

            if (
                isChapterCompleted(
                    chapter
                )
            ) {

                completedChapters++;
            }
        }
    );

    const percentage =
        totalTopics === 0
            ? 0
            : Math.round(
                (
                    completedTopics /
                    totalTopics
                ) * 100
            );

    return {
        totalTopics,
        completedTopics,
        completedChapters,
        percentage
    };
}


/* =========================================================
   RENDER COURSE PROGRESS
========================================================= */

function renderCourseProgress() {

    const info =
        calculateCourseProgress();

    coursePercent.textContent =
        `${info.percentage}%`;

    chapterCount.textContent =
        `${info.completedChapters} of ${curriculum.chapters.length} chapters completed`;

    const progressBar =
        document.getElementById(
            "courseProgressBar"
        );

    if (progressBar) {

        progressBar.style.width =
            `${info.percentage}%`;
    }

    const progressText =
        document.getElementById(
            "courseProgressText"
        );

    if (progressText) {

        progressText.textContent =
            `${info.completedTopics} / ${info.totalTopics} topics completed`;
    }
}


/* =========================================================
   RENDER CHAPTER LIST
========================================================= */

function renderChapterList() {

    chapterList.innerHTML = "";

    curriculum.chapters.forEach(
        (
            chapter,
            index
        ) => {

            const unlocked =
                isChapterUnlocked(
                    index
                );

            const completed =
                isChapterCompleted(
                    chapter
                );

            const item =
                document.createElement(
                    "button"
                );

            item.type =
                "button";

            item.className =
                "os-chapter";

            if (
                index ===
                currentChapterIndex
            ) {

                item.classList.add(
                    "active"
                );
            }

            if (!unlocked) {

                item.classList.add(
                    "locked"
                );
            }

            if (completed) {

                item.classList.add(
                    "completed"
                );
            }


            /* =================================================
               TITLE
            ================================================= */

            const titleRow =
                document.createElement(
                    "div"
                );

            titleRow.className =
                "os-chapter-title";


            const title =
                document.createElement(
                    "span"
                );

            title.textContent =
                `${chapter.number}. ${chapter.title}`;


            const status =
                document.createElement(
                    "span"
                );

            if (completed) {

                status.textContent =
                    "✓";

            } else if (unlocked) {

                status.textContent =
                    "›";

            } else {

                status.textContent =
                    "🔒";
            }

            titleRow.appendChild(
                title
            );

            titleRow.appendChild(
                status
            );


            /* =================================================
               META
            ================================================= */

            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "os-chapter-meta";

            const topicCount =
                Array.isArray(
                    chapter.topics
                )
                    ? chapter.topics.length
                    : 0;

            meta.textContent =
                `${topicCount} topics`;


            item.appendChild(
                titleRow
            );

            item.appendChild(
                meta
            );


            /* =================================================
               CLICK
            ================================================= */

            if (unlocked) {

                item.addEventListener(
                    "click",
                    () => {

                        currentChapterIndex =
                            index;

                        currentTopicIndex =
                            findStartingTopicIndex(
                                chapter
                            );

                        renderAll();

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    }
                );
            }


            chapterList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   RENDER TOPIC NAVIGATION
========================================================= */

function renderTopicNavigation(
    chapter
) {

    topicNav.innerHTML = "";

    const topics =
        Array.isArray(
            chapter.topics
        )
            ? chapter.topics
            : [];

    topics.forEach(
        (
            topic,
            index
        ) => {

            const pill =
                document.createElement(
                    "button"
                );

            pill.type =
                "button";

            pill.className =
                "os-topic-pill";

            if (
                index ===
                currentTopicIndex
            ) {

                pill.classList.add(
                    "current"
                );
            }

            const completed =
                isTopicCompleted(
                    chapter,
                    topic
                );

            if (completed) {

                pill.classList.add(
                    "completed"
                );
            }

            const unlocked =
                isTopicUnlocked(
                    chapter,
                    index
                );

            if (!unlocked) {

                pill.classList.add(
                    "locked"
                );
            }

            pill.textContent =
                `${index + 1}. ${topic.title}`;


            if (unlocked) {

                pill.addEventListener(
                    "click",
                    () => {

                        currentTopicIndex =
                            index;

                        renderAll();

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    }
                );
            }

            topicNav.appendChild(
                pill
            );
        }
    );
}


/* =========================================================
   RENDER CURRENT TOPIC
========================================================= */

function renderCurrentTopic(
    chapter
) {

    const topics =
        Array.isArray(
            chapter.topics
        )
            ? chapter.topics
            : [];

    if (topics.length === 0) {

        topicTitle.textContent =
            "No topics available.";

        return;
    }


    if (
        currentTopicIndex < 0
    ) {

        currentTopicIndex = 0;
    }

    if (
        currentTopicIndex >=
        topics.length
    ) {

        currentTopicIndex =
            topics.length - 1;
    }


    const topic =
        topics[
            currentTopicIndex
        ];


    chapterBadge.textContent =
        `CHAPTER ${chapter.number}`;

    chapterTitle.textContent =
        chapter.title;

    topicTitle.textContent =
        topic.title;

    topicCounter.textContent =
        `Topic ${currentTopicIndex + 1} of ${topics.length}`;


    /* =================================================
       LEARN
    ================================================= */

    learnText.textContent =
        topic.learn ||
        topic.content ||
        topic.description ||
        "Study the material provided for this topic.";


    /* =================================================
       EXAMPLE
    ================================================= */

    exampleText.textContent =
        topic.example ||
        "Review the topic carefully before completing it.";


    /* =================================================
       KEY POINTS
    ================================================= */

    keyPoints.innerHTML = "";

    const points =
        Array.isArray(
            topic.keyPoints
        )
            ? topic.keyPoints
            : [];

    points.forEach(
        point => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                point;

            keyPoints.appendChild(
                li
            );
        }
    );


    /* =================================================
       SELF CHECK
    ================================================= */

    const key =
        getTopicKey(
            chapter,
            topic
        );

    selfCheck.value =
        progress.selfChecks[key] || "";

    selfCheckCount.textContent =
        `${selfCheck.value.length} characters`;


    /* =================================================
       COMPLETION
    ================================================= */

    const completed =
        isTopicCompleted(
            chapter,
            topic
        );

    if (completed) {

        completeTopicBtn.disabled =
            true;

        completeTopicBtn.textContent =
            "✓ Topic Completed";

        completeMessage.textContent =
            "This topic is completed.";

    } else {

        completeTopicBtn.disabled =
            false;

        completeTopicBtn.textContent =
            "Complete Topic";

        completeMessage.textContent =
            "Read the topic and write your self-check before completing it.";
    }


    /* =================================================
       PREVIOUS
    ================================================= */

    prevTopicBtn.disabled =
        currentTopicIndex === 0;


    /* =================================================
       NEXT
    ================================================= */

    const lastTopic =
        currentTopicIndex ===
        topics.length - 1;

    nextTopicBtn.disabled =
        !completed ||
        lastTopic;


    /* =================================================
       ASSESSMENT
    ================================================= */

    renderAssessmentButton(
        chapter
    );
}


/* =========================================================
   RENDER ASSESSMENT BUTTON
========================================================= */

function renderAssessmentButton(
    chapter
) {

    const topicsComplete =
        areAllTopicsCompleted(
            chapter
        );

    const chapterCompleted =
        isChapterCompleted(
            chapter
        );

    if (chapterCompleted) {

        assessmentBtn.disabled =
            true;

        assessmentBtn.hidden =
            false;

        assessmentBtn.textContent =
            "✓ Chapter Passed";

        return;
    }

    assessmentBtn.hidden =
        false;

    assessmentBtn.disabled =
        !topicsComplete;

    if (topicsComplete) {

        assessmentBtn.textContent =
            "📝 Take Chapter Assessment";

    } else {

        assessmentBtn.textContent =
            "🔒 Complete All Topics First";
    }
}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    if (!curriculum) {
        return;
    }

    const chapter =
        curriculum.chapters[
            currentChapterIndex
        ];

    if (!chapter) {
        return;
    }

    renderCourseProgress();

    renderChapterList();

    renderTopicNavigation(
        chapter
    );

    renderCurrentTopic(
        chapter
    );
}


/* =========================================================
   SELF CHECK COUNTER
========================================================= */

selfCheck.addEventListener(
    "input",
    () => {

        selfCheckCount.textContent =
            `${selfCheck.value.length} characters`;
    }
);


/* =========================================================
   COMPLETE TOPIC
========================================================= */

completeTopicBtn.addEventListener(
    "click",
    async () => {

        if (!curriculum) {
            return;
        }

        const chapter =
            curriculum.chapters[
                currentChapterIndex
            ];

        const topic =
            chapter?.topics[
                currentTopicIndex
            ];

        if (!chapter || !topic) {
            return;
        }


        /* =================================================
           REQUIRE SELF CHECK
        ================================================= */

        const answer =
            selfCheck.value.trim();

        if (answer.length < 40) {

            completeMessage.textContent =
                "Please write at least 40 characters in the self-check.";

            selfCheck.focus();

            return;
        }


        const key =
            getTopicKey(
                chapter,
                topic
            );


        if (
            isTopicCompleted(
                chapter,
                topic
            )
        ) {

            return;
        }


        /* =================================================
           SAVE LOCALLY FIRST
        ================================================= */

        progress.selfChecks[key] =
            answer;

        progress.completedTopics[key] =
            true;


        completeTopicBtn.disabled =
            true;

        completeTopicBtn.textContent =
            "Saving...";

        completeMessage.textContent =
            "Saving your progress...";


        try {

            await saveProgress();


            /* =================================================
               NEXT TOPIC
            ================================================= */

            if (
                currentTopicIndex <
                chapter.topics.length - 1
            ) {

                currentTopicIndex++;

                renderAll();

                completeMessage.textContent =
                    "✓ Topic completed. Next topic opened.";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                renderAll();

                completeMessage.textContent =
                    "🎉 All topics completed! You can now take the chapter assessment.";
            }

        } catch (error) {

            console.error(
                "OS topic save error:",
                error
            );


            /* =================================================
               ROLLBACK
            ================================================= */

            delete progress.completedTopics[key];

            delete progress.selfChecks[key];


            completeTopicBtn.disabled =
                false;

            completeTopicBtn.textContent =
                "Complete Topic";

            completeMessage.textContent =
                "Could not save progress. Please try again.";
        }
    }
);


/* =========================================================
   PREVIOUS TOPIC
========================================================= */

prevTopicBtn.addEventListener(
    "click",
    () => {

        if (
            currentTopicIndex <= 0
        ) {

            return;
        }

        currentTopicIndex--;

        renderAll();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   NEXT TOPIC
========================================================= */

nextTopicBtn.addEventListener(
    "click",
    () => {

        const chapter =
            curriculum?.chapters[
                currentChapterIndex
            ];

        if (!chapter) {
            return;
        }

        const topic =
            chapter.topics[
                currentTopicIndex
            ];

        if (!topic) {
            return;
        }

        if (
            !isTopicCompleted(
                chapter,
                topic
            )
        ) {

            completeMessage.textContent =
                "Complete this topic before moving to the next topic.";

            return;
        }

        if (
            currentTopicIndex >=
            chapter.topics.length - 1
        ) {

            return;
        }

        currentTopicIndex++;

        renderAll();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   OPEN ASSESSMENT
========================================================= */

assessmentBtn.addEventListener(
    "click",
    () => {

        const chapter =
            curriculum?.chapters[
                currentChapterIndex
            ];

        if (!chapter) {
            return;
        }

        if (
            !areAllTopicsCompleted(
                chapter
            )
        ) {

            alert(
                "Complete all topics before taking the assessment."
            );

            return;
        }

        if (
            isChapterCompleted(
                chapter
            )
        ) {

            return;
        }


        const url =
            `os-assessment.html?chapter=${encodeURIComponent(
                chapter.id
            )}`;

        window.location.href =
            url;
    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(
                auth
            );

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );
        }
    }
);


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(
    error
) {

    console.error(
        "OS course failed to load:",
        error
    );

    emptyState.hidden =
        true;

    courseView.hidden =
        true;

    loadError.hidden =
        false;

    loadError.textContent =
        `OS course failed to load.

${error.message}

Please make sure:
1. You are logged in.
2. os-curriculum.json exists.
3. You are running the project through Vite.
4. Firebase configuration is correct.`;
}


/* =========================================================
   AUTH + INITIALIZATION
========================================================= */

onAuthStateChanged(
    auth,
    async currentUser => {

        if (!currentUser) {

            window.location.href =
                "login.html";

            return;
        }

        user =
            currentUser;


        try {

            /* =================================================
               LOAD CURRICULUM
            ================================================= */

            curriculum =
                await loadCurriculum();


            /* =================================================
               LOAD FIRESTORE PROGRESS
            ================================================= */

            await loadProgress();


            /* =================================================
               FIND FIRST UNLOCKED + INCOMPLETE CHAPTER
            ================================================= */

            currentChapterIndex =
                -1;

            for (
                let i = 0;
                i < curriculum.chapters.length;
                i++
            ) {

                if (
                    isChapterUnlocked(i) &&
                    !isChapterCompleted(
                        curriculum.chapters[i]
                    )
                ) {

                    currentChapterIndex =
                        i;

                    break;
                }
            }


            /*
               If all 9 chapters are completed,
               open Chapter 9.
            */

            if (
                currentChapterIndex === -1
            ) {

                currentChapterIndex =
                    curriculum.chapters.length - 1;
            }


            const currentChapter =
                curriculum.chapters[
                    currentChapterIndex
                ];


            currentTopicIndex =
                findStartingTopicIndex(
                    currentChapter
                );


            emptyState.hidden =
                true;

            courseView.hidden =
                false;

            loadError.hidden =
                true;


            renderAll();

        } catch (error) {

            showError(
                error
            );
        }
    }
);


/* =========================================================
   FINAL CHECK
========================================================= */

if (
    !checkRequiredElements()
) {

    console.error(
        "OS module stopped because os.html and os.js do not match."
    );
}