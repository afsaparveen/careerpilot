import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   OOP ASSESSMENT ROUTES
========================================================= */

const assessmentRoutes = {

    "oops-introduction":
        "oops-introduction-assessment.html",

    "oops-classes-objects":
        "oops-classes-objects-assessment.html",

    "oops-access-friend":
        "oops-access-friend-assessment.html",

    "oops-four-pillars":
        "oops-four-pillars-assessment.html",

    "oops-encapsulation":
        "oops-encapsulation-assessment.html",

    "oops-constructors":
        "oops-constructors-assessment.html",

    "oops-destructor":
        "oops-destructor-assessment.html",

    "oops-scope-this-copy":
        "oops-scope-this-copy-assessment.html",

    "oops-shallow-deep-copy":
        "oops-scope-this-copy1-assessment.html",

    "oops-inheritance":
        "oops-inheritance-assessment.html",

    "oops-diamond":
        "oops-diamond-assessment.html",

    "oops-polymorphism":
        "oops-polymorphism-assessment.html",

    "oops-abstraction":
        "oops-abstraction-assessment.html",

    "oops-java-abstraction":
        "oops-java-abstraction-assessment.html",

    "oops-static":
        "oops-static-assessment.html"

};


/* =========================================================
   STATE
========================================================= */

let curriculum = [];

let progress = {
    completedTopics: {},
    completedChapters: {},
    assessments: {}
};

let currentChapterIndex = 0;

let currentUser = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const loadingState =
    document.getElementById(
        "loadingState"
    );

const chapterNavigation =
    document.getElementById(
        "chapterNavigation"
    );

const chapterContainer =
    document.getElementById(
        "chapterContainer"
    );

const topicCount =
    document.getElementById(
        "topicCount"
    );

const completedCount =
    document.getElementById(
        "completedCount"
    );

const chapterCount =
    document.getElementById(
        "chapterCount"
    );

const coursePercentage =
    document.getElementById(
        "coursePercentage"
    );


/* =========================================================
   LOAD OOP CURRICULUM
========================================================= */

async function loadCurriculum() {

    const response =
        await fetch(
            "../data/oops-curriculum.json",
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to load OOP curriculum."
        );

    }


    const data =
        await response.json();


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        throw new Error(
            "OOP curriculum is empty."
        );

    }


    curriculum =
        data;

}


/* =========================================================
   TOTAL TOPICS
========================================================= */

function totalTopics() {

    return curriculum.reduce(
        (
            total,
            chapter
        ) => {

            return (
                total +
                (
                    Array.isArray(
                        chapter.topics
                    )
                        ? chapter.topics.length
                        : 0
                )
            );

        },
        0
    );

}


/* =========================================================
   COMPLETED TOPICS COUNT
========================================================= */

function completedTopicsCount() {

    const completed =
        progress.completedTopics ||
        {};


    return Object.values(
        completed
    ).filter(
        value =>
            value === true
    ).length;

}


/* =========================================================
   UPDATE COURSE OVERVIEW
========================================================= */

function updateOverview() {

    const total =
        totalTopics();


    const completed =
        completedTopicsCount();


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    if (topicCount) {

        topicCount.textContent =
            total;

    }


    if (completedCount) {

        completedCount.textContent =
            completed;

    }


    if (chapterCount) {

        chapterCount.textContent =
            curriculum.length;

    }


    if (coursePercentage) {

        coursePercentage.textContent =
            `${percentage}%`;

    }

}


/* =========================================================
   CHECK CHAPTER ASSESSMENT
========================================================= */

function isChapterAssessmentPassed(
    chapterId
) {

    return (
        progress.completedChapters &&
        progress.completedChapters[
            chapterId
        ] === true
    );

}


/* =========================================================
   CHECK CHAPTER UNLOCK
========================================================= */

function isChapterUnlocked(
    index
) {

    /*
     * Chapter 1 is always unlocked.
     */

    if (index === 0) {

        return true;

    }


    const previousChapter =
        curriculum[
            index - 1
        ];


    if (!previousChapter) {

        return false;

    }


    return isChapterAssessmentPassed(
        previousChapter.id
    );

}


/* =========================================================
   CHECK TOPIC UNLOCK
========================================================= */

function isTopicUnlocked(
    chapter,
    topicIndex
) {

    /*
     * First topic of every chapter
     * is unlocked when the chapter is unlocked.
     */

    if (topicIndex === 0) {

        return true;

    }


    const previousTopic =
        chapter.topics[
            topicIndex - 1
        ];


    if (!previousTopic) {

        return false;

    }


    return (
        progress.completedTopics &&
        progress.completedTopics[
            previousTopic.id
        ] === true
    );

}


/* =========================================================
   RENDER CHAPTER NAVIGATION
========================================================= */

function renderChapterNavigation() {

    if (!chapterNavigation) {

        return;

    }


    chapterNavigation.innerHTML =
        "";


    curriculum.forEach(
        (
            chapter,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "chapter-nav-btn";


            const unlocked =
                isChapterUnlocked(
                    index
                );


            const completed =
                isChapterAssessmentPassed(
                    chapter.id
                );


            if (!unlocked) {

                button.disabled =
                    true;

                button.style.opacity =
                    "0.45";

                button.style.cursor =
                    "not-allowed";

            }


            if (completed) {

                button.classList.add(
                    "completed"
                );

            }


            if (
                index ===
                currentChapterIndex
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                `${index + 1}. ${chapter.title}`;


            if (completed) {

                button.textContent +=
                    " ✓";

            }


            button.addEventListener(
                "click",
                () => {

                    if (
                        !isChapterUnlocked(
                            index
                        )
                    ) {

                        return;

                    }


                    currentChapterIndex =
                        index;


                    renderChapterNavigation();

                    renderChapter();

                }
            );


            chapterNavigation.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   RENDER CURRENT CHAPTER
========================================================= */

function renderChapter() {

    const chapter =
        curriculum[
            currentChapterIndex
        ];


    if (!chapter) {

        return;

    }


    if (
        !isChapterUnlocked(
            currentChapterIndex
        )
    ) {

        currentChapterIndex =
            Math.max(
                currentChapterIndex - 1,
                0
            );


        renderChapter();

        return;

    }


    const completed =
        progress.completedTopics ||
        {};


    const completedInChapter =
        chapter.topics.filter(
            topic =>
                completed[
                    topic.id
                ] === true
        ).length;


    const allTopicsCompleted =
        completedInChapter ===
        chapter.topics.length;


    chapterContainer.innerHTML =
        "";


    const chapterTitleCard =
        document.createElement(
            "div"
        );


    chapterTitleCard.className =
        "chapter-title-card";


    chapterTitleCard.innerHTML = `

        <h2>
            Chapter ${currentChapterIndex + 1}
            — ${chapter.title}
        </h2>

        <p>
            ${completedInChapter}
            /
            ${chapter.topics.length}
            topics completed
        </p>

    `;


    chapterContainer.appendChild(
        chapterTitleCard
    );


    /* =====================================================
       TOPICS
    ===================================================== */

    chapter.topics.forEach(
        (
            topic,
            topicIndex
        ) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "topic-card";


            const isCompleted =
                completed[
                    topic.id
                ] === true;


            const unlocked =
                isTopicUnlocked(
                    chapter,
                    topicIndex
                );


            if (unlocked) {

                card.innerHTML = `

                    <h3>
                        ${topicIndex + 1}.
                        ${topic.title}
                    </h3>

                    <p class="topic-learn">
                        ${topic.learn}
                    </p>

                    <div class="topic-example">

                        <strong>
                            Example:
                        </strong>

                        ${topic.example}

                    </div>

                    <div class="topic-points">

                        ${topic.keyPoints
                            .map(
                                point => `

                                    <span
                                        class="topic-point">

                                        ${point}

                                    </span>

                                `
                            )
                            .join("")}

                    </div>

                    <div class="topic-actions">

                        <button
                            class="complete-topic-btn ${
                                isCompleted
                                    ? "completed"
                                    : ""
                            }"
                            type="button">

                            ${
                                isCompleted
                                    ? "✓ Completed"
                                    : "Mark Topic Complete"
                            }

                        </button>

                    </div>

                `;


                const button =
                    card.querySelector(
                        ".complete-topic-btn"
                    );


                if (button) {

                    button.addEventListener(
                        "click",
                        async () => {

                            await toggleTopicCompletion(
                                topic.id
                            );

                        }
                    );

                }

            } else {

                card.innerHTML = `

                    <h3>
                        ${topicIndex + 1}.
                        ${topic.title}
                    </h3>

                    <p class="topic-learn">

                        🔒 Complete the previous
                        topic first.

                    </p>

                `;

            }


            chapterContainer.appendChild(
                card
            );

        }
    );


    /* =====================================================
       ASSESSMENT BUTTON
    ===================================================== */

    if (allTopicsCompleted) {

        const assessmentKey =
            getAssessmentKey(
                chapter.id
            );


        const existingAssessment =
            progress.assessments?.[
                assessmentKey
            ];


        const assessmentPassed =
            existingAssessment?.passed === true;


        const assessmentButton =
            document.createElement(
                "button"
            );


        assessmentButton.type =
            "button";


        assessmentButton.className =
            "btn btn-primary";


        assessmentButton.style.marginTop =
            "20px";


        assessmentButton.textContent =
            assessmentPassed
                ? "✓ Assessment Passed"
                : "Take Chapter Assessment";


        assessmentButton.disabled =
            assessmentPassed;


        if (!assessmentPassed) {

            assessmentButton.addEventListener(
                "click",
                () => {

                    const route =
                        assessmentRoutes[
                            chapter.id
                        ];


                    if (!route) {

                        alert(
                            "Assessment page is not available for this chapter."
                        );

                        return;

                    }


                    window.location.href =
                        `./${route}`;

                }
            );

        }


        chapterContainer.appendChild(
            assessmentButton
        );

    }

}


/* =========================================================
   ASSESSMENT KEY
========================================================= */

function getAssessmentKey(
    chapterId
) {

    const mapping = {

        "oops-introduction":
            "introduction",

        "oops-classes-objects":
            "classesObjects",

        "oops-access-friend":
            "accessFriend",

        "oops-four-pillars":
            "fourPillars",

        "oops-encapsulation":
            "encapsulation",

        "oops-constructors":
            "constructors",

        "oops-destructor":
            "destructor",

        "oops-scope-this-copy":
            "scopeThis",

        "oops-shallow-deep-copy":
            "shallowDeepCopy",

        "oops-inheritance":
            "inheritance",

        "oops-diamond":
            "diamond",

        "oops-polymorphism":
            "polymorphism",

        "oops-abstraction":
            "abstraction",

        "oops-java-abstraction":
            "javaAbstraction",

        "oops-static":
            "static"

    };


    return mapping[
        chapterId
    ];

}


/* =========================================================
   TOGGLE TOPIC COMPLETION
========================================================= */

async function toggleTopicCompletion(
    topicId
) {

    const completed =
        progress.completedTopics ||
        {};


    completed[topicId] =
        completed[topicId] !== true;


    progress.completedTopics =
        completed;


    try {

        await saveProgress();

    } catch (error) {

        console.error(
            "Failed to save OOP progress:",
            error
        );

        /*
         * Roll back if Firestore save fails.
         */

        completed[topicId] =
            !completed[topicId];

        progress.completedTopics =
            completed;

        return;

    }


    updateOverview();

    renderChapterNavigation();

    renderChapter();

}


/* =========================================================
   SAVE PROGRESS
========================================================= */

async function saveProgress() {

    if (!currentUser) {

        return;

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
            oopsProgress:
                progress
        },
        {
            merge: true
        }
    );

}


/* =========================================================
   LOAD PROGRESS
========================================================= */

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


        if (
            data.oopsProgress
        ) {

            progress =
                data.oopsProgress;

        }

    }


    if (
        !progress.completedTopics
    ) {

        progress.completedTopics =
            {};

    }


    if (
        !progress.completedChapters
    ) {

        progress.completedChapters =
            {};

    }


    if (
        !progress.assessments
    ) {

        progress.assessments =
            {};

    }

}


/* =========================================================
   FIND STARTING CHAPTER
========================================================= */

function findStartingChapter() {

    for (
        let i = 0;
        i < curriculum.length;
        i++
    ) {

        if (
            isChapterUnlocked(i) &&
            !isChapterAssessmentPassed(
                curriculum[i].id
            )
        ) {

            return i;

        }

    }


    /*
     * If every chapter is completed,
     * open the final chapter.
     */

    return Math.max(
        curriculum.length - 1,
        0
    );

}


/* =========================================================
   INITIALIZE OOP
========================================================= */

async function initialize() {

    await loadCurriculum();

    await loadProgress();


    currentChapterIndex =
        findStartingChapter();


    updateOverview();

    renderChapterNavigation();

    renderChapter();


    if (loadingState) {

        loadingState.classList.add(
            "hidden"
        );

    }


    if (chapterContainer) {

        chapterContainer.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   AUTHENTICATION
========================================================= */

/*
 * Use the already authenticated Firebase user.
 *
 * This prevents the OOP page from unnecessarily
 * sending an authenticated user back to login.
 */

function startOOP() {

    const existingUser =
        auth.currentUser;


    if (existingUser) {

        currentUser =
            existingUser;


        initialize()
            .catch(
                error => {

                    console.error(
                        "Failed to initialize OOP:",
                        error
                    );


                    if (loadingState) {

                        loadingState.textContent =
                            "Failed to load OOP curriculum. Please refresh and try again.";

                    }

                }
            );

        return;

    }


    onAuthStateChanged(
        auth,
        async user => {

            if (!user) {

                /*
                 * Do not immediately redirect.
                 * Firebase may still be restoring
                 * the existing session.
                 */

                return;

            }


            currentUser =
                user;


            try {

                await initialize();

            } catch (error) {

                console.error(
                    "Failed to initialize OOP:",
                    error
                );


                if (loadingState) {

                    loadingState.textContent =
                        "Failed to load OOP curriculum. Please refresh and try again.";

                }

            }

        }
    );

}


/* =========================================================
   START
========================================================= */

startOOP();