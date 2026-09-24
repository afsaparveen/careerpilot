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
   SUBJECT CONFIGURATION
========================================================= */

const SUBJECTS = {
    dbms: {
        name: "DBMS",
        description:
            "Complete Database Management System preparation using your existing DBMS curriculum.",
        curriculumFiles: [
            "../data/dbms-curriculum.json"
        ],
        progressKey: "dbmsProgress"
    },

    os: {
        name: "Operating Systems",
        description:
            "Complete Operating Systems preparation chapter by chapter.",
        curriculumFiles: [
            "../data/os-curriculum.json"
        ],
        progressKey: "osProgress"
    },

    cn: {
        name: "Computer Networks",
        description:
            "Complete Computer Networks preparation chapter by chapter.",
        curriculumFiles: [
            "../data/cn-curriculum.json",
            "../data/computer-networks-curriculum.json"
        ],
        progressKey: "cnProgress"
    },

    oop: {
        name: "OOP",
        description:
            "Complete Object-Oriented Programming preparation chapter by chapter.",
        curriculumFiles: [
            "../data/oop-curriculum.json",
            "../data/oops-curriculum.json"
        ],
        progressKey: "oopProgress"
    }
};


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let subjectId = "";
let config = null;

let curriculum = {
    title: "",
    description: "",
    chapters: []
};

let progress = {
    completedTopics: {},
    completedChapters: {},
    assessments: {}
};

let currentChapterIndex = 0;
let currentTopicIndex = 0;


/* =========================================================
   DOM
========================================================= */

const courseTitle =
    document.getElementById("courseTitle");

const courseDescription =
    document.getElementById("courseDescription");

const coursePercent =
    document.getElementById("coursePercent");

const courseProgressFill =
    document.getElementById("courseProgressFill");

const courseProgressText =
    document.getElementById("courseProgressText");

const chapterCount =
    document.getElementById("chapterCount");

const chapterList =
    document.getElementById("chapterList");

const chapterBadge =
    document.getElementById("chapterBadge");

const chapterTitle =
    document.getElementById("chapterTitle");

const chapterPages =
    document.getElementById("chapterPages");

const topicList =
    document.getElementById("topicList");

const topicTitle =
    document.getElementById("topicTitle");

const topicStatus =
    document.getElementById("topicStatus");

const topicLearn =
    document.getElementById("topicLearn");

const exampleSection =
    document.getElementById("exampleSection");

const topicExample =
    document.getElementById("topicExample");

const keyPointsList =
    document.getElementById("keyPointsList");

const completeTopicBtn =
    document.getElementById("completeTopicBtn");

const topicMessage =
    document.getElementById("topicMessage");

const chapterTestMessage =
    document.getElementById("chapterTestMessage");

const chapterTestBtn =
    document.getElementById("chapterTestBtn");

const nextChapterTitle =
    document.getElementById("nextChapterTitle");

const nextChapterMessage =
    document.getElementById("nextChapterMessage");

const nextChapterBtn =
    document.getElementById("nextChapterBtn");

const userInitials =
    document.getElementById("userInitials");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   SUBJECT FROM URL
========================================================= */

function getSubjectId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("subject") ||
        ""
    ).trim().toLowerCase();
}


/* =========================================================
   NORMALIZE CURRICULUM
========================================================= */

function normalizeCurriculum(
    raw
) {

    /*
     * Existing files may be:
     *
     * {
     *   title: "...",
     *   chapters: [...]
     * }
     *
     * OR
     *
     * {
     *   subject: "...",
     *   curriculum: [...]
     * }
     *
     * OR simply:
     *
     * [...]
     */

    if (Array.isArray(raw)) {

        return {
            title:
                config.name,

            description:
                config.description,

            chapters:
                raw
        };
    }


    if (
        raw &&
        Array.isArray(
            raw.chapters
        )
    ) {

        return {
            title:
                raw.title ||
                raw.name ||
                config.name,

            description:
                raw.description ||
                raw.summary ||
                config.description,

            chapters:
                raw.chapters
        };
    }


    if (
        raw &&
        Array.isArray(
            raw.curriculum
        )
    ) {

        return {
            title:
                raw.title ||
                raw.name ||
                config.name,

            description:
                raw.description ||
                raw.summary ||
                config.description,

            chapters:
                raw.curriculum
        };
    }


    throw new Error(
        `${config.name} curriculum does not contain a valid chapters array.`
    );
}


/* =========================================================
   LOAD CURRICULUM
========================================================= */

async function loadCurriculum() {

    let lastError = null;


    for (
        const file of
        config.curriculumFiles
    ) {

        try {

            const response =
                await fetch(
                    file,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                lastError =
                    new Error(
                        `${file} returned HTTP ${response.status}.`
                    );

                continue;
            }


            const raw =
                await response.json();


            return normalizeCurriculum(
                raw
            );


        } catch (error) {

            lastError =
                error;
        }
    }


    throw (
        lastError ||
        new Error(
            `Could not load ${config.name} curriculum.`
        )
    );
}


/* =========================================================
   LOAD FIRESTORE PROGRESS
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
        !snapshot.exists()
    ) {

        progress = {
            completedTopics: {},
            completedChapters: {},
            assessments: {}
        };

        return;
    }


    const data =
        snapshot.data();


    const saved =
        data[
            config.progressKey
        ] || {};


    progress = {

        completedTopics:
            saved.completedTopics ||
            {},

        completedChapters:
            saved.completedChapters ||
            {},

        assessments:
            saved.assessments ||
            {}

    };
}


/* =========================================================
   SAVE PROGRESS
========================================================= */

async function saveProgress() {

    await setDoc(

        doc(
            db,
            "users",
            currentUser.uid
        ),

        {
            [config.progressKey]: {

                completedTopics:
                    progress.completedTopics,

                completedChapters:
                    progress.completedChapters,

                assessments:
                    progress.assessments,

                updatedAt:
                    new Date().toISOString()
            }
        },

        {
            merge: true
        }
    );
}


/* =========================================================
   KEYS
========================================================= */

function topicKey(
    chapter,
    topic
) {

    return (
        `${chapter.id}__${topic.id}`
    );
}


function isTopicCompleted(
    chapter,
    topic
) {

    return (
        progress.completedTopics[
            topicKey(
                chapter,
                topic
            )
        ] === true
    );
}


function isChapterCompleted(
    chapter
) {

    return (
        progress.completedChapters[
            chapter.id
        ] === true
    );
}


function areAllTopicsCompleted(
    chapter
) {

    const topics =
        chapter.topics || [];


    return (
        topics.length > 0 &&
        topics.every(
            topic =>
                isTopicCompleted(
                    chapter,
                    topic
                )
        )
    );
}


/* =========================================================
   CHAPTER UNLOCK
========================================================= */

function isChapterUnlocked(
    index
) {

    if (
        index === 0
    ) {
        return true;
    }


    const previous =
        curriculum.chapters[
            index - 1
        ];


    return isChapterCompleted(
        previous
    );
}


/* =========================================================
   COURSE PROGRESS
========================================================= */

function calculateProgress() {

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
   RENDER COURSE
========================================================= */

function renderCourse() {

    courseTitle.textContent =
        curriculum.title ||
        config.name;


    courseDescription.textContent =
        curriculum.description ||
        config.description;


    chapterCount.textContent =
        curriculum.chapters.length;


    renderProgress();

    renderChapterList();


    /*
     * Resume at the first incomplete chapter.
     */
    currentChapterIndex =
        findResumeChapter();


    openChapter(
        currentChapterIndex
    );
}


/* =========================================================
   FIND RESUME CHAPTER
========================================================= */

function findResumeChapter() {

    const index =
        curriculum.chapters.findIndex(
            chapter =>
                !isChapterCompleted(
                    chapter
                )
        );


    return index >= 0
        ? index
        : Math.max(
            0,
            curriculum.chapters.length - 1
        );
}


/* =========================================================
   RENDER PROGRESS
========================================================= */

function renderProgress() {

    const data =
        calculateProgress();


    coursePercent.textContent =
        `${data.percentage}%`;


    courseProgressFill.style.width =
        `${data.percentage}%`;


    courseProgressText.textContent =
        `${data.completedTopics} / ${data.totalTopics} topics completed • ${data.completedChapters} chapters completed`;
}


/* =========================================================
   RENDER CHAPTER LIST
========================================================= */

function renderChapterList() {

    chapterList.innerHTML =
        "";


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


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "chapter-item";


            if (
                index ===
                currentChapterIndex
            ) {

                button.classList.add(
                    "active"
                );
            }


            if (
                completed
            ) {

                button.classList.add(
                    "completed"
                );
            }


            if (
                !unlocked
            ) {

                button.classList.add(
                    "locked"
                );
            }


            button.innerHTML = `

                <span class="chapter-number">

                    ${
                        completed
                            ? "✓"
                            : (
                                chapter.number ||
                                index + 1
                            )
                    }

                </span>


                <span class="chapter-info">

                    <strong>
                        ${escapeHtml(
                            chapter.title ||
                            `Chapter ${index + 1}`
                        )}
                    </strong>

                    <small>

                        ${
                            completed
                                ? "Completed"
                                : unlocked
                                    ? "Available"
                                    : "Locked"
                        }

                    </small>

                </span>

            `;


            if (
                unlocked
            ) {

                button.addEventListener(
                    "click",
                    () => {

                        currentChapterIndex =
                            index;

                        currentTopicIndex =
                            findResumeTopic(
                                curriculum.chapters[
                                    index
                                ]
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
                button
            );
        }
    );
}


/* =========================================================
   FIND TOPIC TO RESUME
========================================================= */

function findResumeTopic(
    chapter
) {

    const topics =
        chapter.topics || [];


    const incomplete =
        topics.findIndex(
            topic =>
                !isTopicCompleted(
                    chapter,
                    topic
                )
        );


    if (
        incomplete >= 0
    ) {

        return incomplete;
    }


    return Math.max(
        0,
        topics.length - 1
    );
}


/* =========================================================
   OPEN CHAPTER
========================================================= */

function openChapter(
    index
) {

    if (
        index < 0 ||
        index >=
        curriculum.chapters.length
    ) {

        return;
    }


    if (
        !isChapterUnlocked(
            index
        )
    ) {

        return;
    }


    currentChapterIndex =
        index;


    const chapter =
        curriculum.chapters[
            index
        ];


    currentTopicIndex =
        findResumeTopic(
            chapter
        );


    renderAll();
}


/* =========================================================
   RENDER ALL CHAPTER CONTENT
========================================================= */

function renderAll() {

    const chapter =
        curriculum.chapters[
            currentChapterIndex
        ];


    if (!chapter) {
        return;
    }


    chapterBadge.textContent =
        `CHAPTER ${
            chapter.number ||
            currentChapterIndex + 1
        }`;


    chapterTitle.textContent =
        chapter.title ||
        `Chapter ${currentChapterIndex + 1}`;


    chapterPages.textContent =
        chapter.pages
            ? `Pages ${chapter.pages}`
            : (
                chapter.description ||
                chapter.summary ||
                ""
            );


    renderChapterList();

    renderTopics(
        chapter
    );

    renderCurrentTopic(
        chapter
    );

    renderChapterTest(
        chapter
    );

    renderNextChapter();
}


/* =========================================================
   RENDER TOPICS
========================================================= */

function renderTopics(
    chapter
) {

    topicList.innerHTML =
        "";


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

            const completed =
                isTopicCompleted(
                    chapter,
                    topic
                );


            const unlocked =
                (
                    index === 0 ||
                    isTopicCompleted(
                        chapter,
                        topics[
                            index - 1
                        ]
                    )
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "topic-item";


            if (
                index ===
                currentTopicIndex
            ) {

                button.classList.add(
                    "active"
                );
            }


            if (
                completed
            ) {

                button.classList.add(
                    "completed"
                );
            }


            if (
                !unlocked
            ) {

                button.classList.add(
                    "locked"
                );
            }


            button.innerHTML = `

                <span>
                    ${
                        completed
                            ? "✓"
                            : unlocked
                                ? "○"
                                : "🔒"
                    }
                </span>

                <span>
                    ${escapeHtml(
                        topic.title ||
                        `Topic ${index + 1}`
                    )}
                </span>

            `;


            if (
                unlocked
            ) {

                button.addEventListener(
                    "click",
                    () => {

                        currentTopicIndex =
                            index;

                        renderAll();

                        window.scrollTo({
                            top: 0,
                            behavior:
                                "smooth"
                        });
                    }
                );
            }


            topicList.appendChild(
                button
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

    const topic =
        (
            chapter.topics ||
            []
        )[
            currentTopicIndex
        ];


    if (!topic) {

        topicTitle.textContent =
            "No topic available";


        topicLearn.textContent =
            "This chapter does not contain topic material.";


        return;
    }


    const completed =
        isTopicCompleted(
            chapter,
            topic
        );


    topicTitle.textContent =
        topic.title ||
        "Current Topic";


    topicLearn.textContent =
        topic.learn ||
        topic.content ||
        topic.description ||
        "Read this topic carefully before continuing.";


    if (
        topic.example
    ) {

        exampleSection.style.display =
            "block";

        topicExample.textContent =
            topic.example;

    } else {

        exampleSection.style.display =
            "none";
    }


    keyPointsList.innerHTML =
        "";


    (
        topic.keyPoints ||
        topic.points ||
        []
    ).forEach(
        point => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                point;


            keyPointsList.appendChild(
                li
            );
        }
    );


    topicStatus.textContent =
        completed
            ? "Completed"
            : "Study this topic";


    topicStatus.classList.toggle(
        "completed",
        completed
    );


    completeTopicBtn.disabled =
        completed;


    completeTopicBtn.textContent =
        completed
            ? "✓ Topic Completed"
            : "I Finished Studying This Topic";


    topicMessage.textContent =
        completed
            ? "This topic is saved."
            : "Read the complete material, then mark the topic as studied.";


    completeTopicBtn.onclick =
        () => completeTopic(
            chapter,
            topic
        );
}


/* =========================================================
   COMPLETE TOPIC
========================================================= */

async function completeTopic(
    chapter,
    topic
) {

    const key =
        topicKey(
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


    progress.completedTopics[
        key
    ] = true;


    completeTopicBtn.disabled =
        true;


    completeTopicBtn.textContent =
        "Saving...";


    try {

        await saveProgress();


        /*
         * If there is another topic,
         * automatically open it.
         */
        const nextIndex =
            currentTopicIndex + 1;


        if (
            nextIndex <
            chapter.topics.length
        ) {

            currentTopicIndex =
                nextIndex;

        }


        renderAll();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (
        error
    ) {

        console.error(
            "Topic save error:",
            error
        );


        delete progress.completedTopics[
            key
        ];


        completeTopicBtn.disabled =
            false;


        completeTopicBtn.textContent =
            "I Finished Studying This Topic";


        topicMessage.textContent =
            "Could not save progress. Please try again.";
    }
}


/* =========================================================
   CHAPTER TEST
========================================================= */

function renderChapterTest(
    chapter
) {

    const allTopicsDone =
        areAllTopicsCompleted(
            chapter
        );


    const chapterDone =
        isChapterCompleted(
            chapter
        );


    if (
        chapterDone
    ) {

        chapterTestMessage.textContent =
            "Chapter test passed. The next chapter is unlocked.";


        chapterTestBtn.textContent =
            "✓ Test Passed";


        chapterTestBtn.disabled =
            true;


        return;
    }


    if (
        allTopicsDone
    ) {

        chapterTestMessage.textContent =
            "You have finished all topics. Take the chapter test to unlock the next chapter.";


        chapterTestBtn.textContent =
            "Take Chapter Test";


        chapterTestBtn.disabled =
            false;


        chapterTestBtn.onclick =
            () => {

                window.location.href =
                    `technical-core-test.html?subject=${encodeURIComponent(
                        subjectId
                    )}&chapter=${encodeURIComponent(
                        chapter.id
                    )}`;
            };


    } else {

        chapterTestMessage.textContent =
            "Complete every topic in this chapter before taking the test.";


        chapterTestBtn.textContent =
            "Complete Topics First";


        chapterTestBtn.disabled =
            true;
    }
}


/* =========================================================
   NEXT CHAPTER
========================================================= */

function renderNextChapter() {

    const nextIndex =
        currentChapterIndex + 1;


    if (
        nextIndex >=
        curriculum.chapters.length
    ) {

        nextChapterTitle.textContent =
            "Subject Complete";


        nextChapterMessage.textContent =
            isChapterCompleted(
                curriculum.chapters[
                    currentChapterIndex
                ]
            )
                ? `You have completed ${config.name}.`
                : "Pass this chapter test to complete the subject.";


        nextChapterBtn.textContent =
            "Subject Complete";


        nextChapterBtn.disabled =
            true;


        return;
    }


    const nextChapter =
        curriculum.chapters[
            nextIndex
        ];


    nextChapterTitle.textContent =
        `Chapter ${
            nextChapter.number ||
            nextIndex + 1
        }: ${
            nextChapter.title ||
            ""
        }`;


    const currentChapter =
        curriculum.chapters[
            currentChapterIndex
        ];


    if (
        isChapterCompleted(
            currentChapter
        )
    ) {

        nextChapterMessage.textContent =
            "This chapter is unlocked.";


        nextChapterBtn.textContent =
            "Next Chapter →";


        nextChapterBtn.disabled =
            false;


        nextChapterBtn.onclick =
            () => {

                currentChapterIndex =
                    nextIndex;


                currentTopicIndex =
                    findResumeTopic(
                        nextChapter
                    );


                renderAll();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            };


    } else {

        nextChapterMessage.textContent =
            "Pass the current chapter test to unlock this chapter.";


        nextChapterBtn.textContent =
            "Locked";


        nextChapterBtn.disabled =
            true;
    }
}


/* =========================================================
   USER
========================================================= */

function renderInitials() {

    if (
        !userInitials ||
        !currentUser
    ) {
        return;
    }


    const name =
        currentUser.displayName ||
        currentUser.email ||
        "CareerPilot";


    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    userInitials.textContent =
        (
            parts.length >= 2
                ? parts[0][0] +
                  parts[parts.length - 1][0]
                : parts[0].slice(0, 2)
        ).toUpperCase();
}


/* =========================================================
   LOGOUT
========================================================= */

if (
    logoutBtn
) {

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
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value = ""
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


/* =========================================================
   INITIALIZE
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            user;


        subjectId =
            getSubjectId();


        config =
            SUBJECTS[
                subjectId
            ];


        if (!config) {

            window.location.href =
                "technical.html";

            return;
        }


        try {

            curriculum =
                await loadCurriculum();


            if (
                !curriculum ||
                !Array.isArray(
                    curriculum.chapters
                ) ||
                curriculum.chapters.length === 0
            ) {

                throw new Error(
                    `${config.name} has no chapters in its curriculum file.`
                );
            }


            await loadProgress();

            renderInitials();

            renderCourse();

        } catch (
            error
        ) {

            console.error(
                "Core technical course error:",
                error
            );


            courseTitle.textContent =
                "Course could not load";


            courseDescription.textContent =
                error.message;


            chapterCount.textContent =
                "0";


            chapterList.innerHTML = `
                <div style="
                    padding:16px;
                    color:#b91c1c;
                    font-size:13px;
                ">
                    ${escapeHtml(
                        error.message
                    )}
                </div>
            `;
        }
    }
);