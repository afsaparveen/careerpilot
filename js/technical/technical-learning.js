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
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   DOM
========================================================= */

const subjectGrid =
    document.getElementById("subjectGrid");

const learningArea =
    document.getElementById("learningArea");

const emptyLearningState =
    document.getElementById("emptyLearningState");

const currentSubjectLabel =
    document.getElementById("currentSubjectLabel");

const currentSubjectName =
    document.getElementById("currentSubjectName");

const currentSubjectDescription =
    document.getElementById("currentSubjectDescription");

const courseProgressPercent =
    document.getElementById("courseProgressPercent");

const courseProgressFill =
    document.getElementById("courseProgressFill");

const courseProgressText =
    document.getElementById("courseProgressText");

const topicCount =
    document.getElementById("topicCount");

const topicList =
    document.getElementById("topicList");

const topicNumber =
    document.getElementById("topicNumber");

const topicTitle =
    document.getElementById("topicTitle");

const topicStatus =
    document.getElementById("topicStatus");

const topicLearn =
    document.getElementById("topicLearn");

const topicExample =
    document.getElementById("topicExample");

const keyPointsList =
    document.getElementById("keyPointsList");

const previousTopicBtn =
    document.getElementById("previousTopicBtn");

const completeTopicBtn =
    document.getElementById("completeTopicBtn");

const nextTopicBtn =
    document.getElementById("nextTopicBtn");

const actionMessage =
    document.getElementById("actionMessage");

const userInitials =
    document.getElementById("userInitials");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let subjects = [];

let currentSubject = null;

let currentTopicIndex = 0;

let progress = {
    completedTopics: {},
    lastSubjectId: "",
    lastTopicIndex: 0
};


/* =========================================================
   URL SUBJECT
========================================================= */

function getRequestedSubjectId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("subject") || ""
    ).trim().toLowerCase();
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
    value = ""
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   LOAD CURRICULUM
========================================================= */

async function loadCurriculum() {

    const response =
        await fetch(
            "../data/technical-curriculum.json",
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Could not load technical-curriculum.json (${response.status}).`
        );
    }


    const data =
        await response.json();


    if (
        !data ||
        !Array.isArray(data.subjects)
    ) {

        throw new Error(
            "technical-curriculum.json does not contain a valid subjects array."
        );
    }


    subjects =
        data.subjects.filter(
            subject =>
                subject &&
                subject.id &&
                subject.name &&
                Array.isArray(
                    subject.topics
                )
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


    if (!snapshot.exists()) {

        progress = {
            completedTopics: {},
            lastSubjectId: "",
            lastTopicIndex: 0
        };

        return;
    }


    const data =
        snapshot.data();


    const saved =
        data.technicalLearningProgress ||
        {};


    progress = {

        completedTopics:
            saved.completedTopics || {},

        lastSubjectId:
            saved.lastSubjectId || "",

        lastTopicIndex:
            Number.isInteger(
                saved.lastTopicIndex
            )
                ? saved.lastTopicIndex
                : 0

    };
}


/* =========================================================
   SAVE PROGRESS
========================================================= */

async function saveProgress() {

    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    await setDoc(
        userRef,
        {
            technicalLearningProgress: {

                completedTopics:
                    progress.completedTopics,

                lastSubjectId:
                    progress.lastSubjectId,

                lastTopicIndex:
                    progress.lastTopicIndex,

                updatedAt:
                    serverTimestamp()
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
    subjectId,
    topicId
) {

    return `${subjectId}__${topicId}`;
}


/* =========================================================
   COMPLETION
========================================================= */

function isTopicCompleted(
    subjectId,
    topicId
) {

    return (
        progress.completedTopics[
            getTopicKey(
                subjectId,
                topicId
            )
        ] === true
    );
}


function getSubjectProgress(
    subject
) {

    const total =
        subject.topics.length;


    const completed =
        subject.topics.filter(
            topic =>
                isTopicCompleted(
                    subject.id,
                    topic.id
                )
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                completed /
                total *
                100
            );


    return {
        total,
        completed,
        percentage
    };
}


/* =========================================================
   INITIALS
========================================================= */

function renderInitials() {

    if (
        !currentUser ||
        !userInitials
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


    if (
        parts.length >= 2
    ) {

        userInitials.textContent =
            (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();

    } else {

        userInitials.textContent =
            name
                .slice(0, 2)
                .toUpperCase();
    }
}


/* =========================================================
   SUBJECT CARDS
========================================================= */

function renderSubjectCards() {

    subjectGrid.innerHTML = "";


    subjects.forEach(
        subject => {

            const progressData =
                getSubjectProgress(
                    subject
                );


            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";

            card.className =
                "subject-card";


            if (
                currentSubject &&
                currentSubject.id ===
                    subject.id
            ) {

                card.classList.add(
                    "active"
                );
            }


            const code =
                subject.name
                    .replace(
                        /[^A-Za-z0-9]/g,
                        ""
                    )
                    .slice(0, 3)
                    .toUpperCase();


            card.innerHTML = `

                <div class="subject-card-top">

                    <div class="subject-code">
                        ${escapeHtml(code)}
                    </div>

                </div>


                <h3>
                    ${escapeHtml(
                        subject.name
                    )}
                </h3>


                <p>
                    ${escapeHtml(
                        subject.description ||
                        "Technical study material."
                    )}
                </p>


                <div class="subject-card-progress">

                    <div class="subject-progress-row">

                        <span>
                            Progress
                        </span>

                        <strong>
                            ${progressData.percentage}%
                        </strong>

                    </div>


                    <div class="subject-progress-track">

                        <div
                            class="subject-progress-fill"
                            style="width:${progressData.percentage}%">
                        </div>

                    </div>

                </div>
            `;


            card.addEventListener(
                "click",
                () => {
                    openSubject(
                        subject.id,
                        true
                    );
                }
            );


            subjectGrid.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   OPEN SUBJECT
========================================================= */

function openSubject(
    subjectId,
    scroll
) {

    const subject =
        subjects.find(
            item =>
                item.id === subjectId
        );


    if (!subject) {

        showError(
            `Subject "${subjectId}" was not found in technical-curriculum.json.`
        );

        return;
    }


    currentSubject =
        subject;


    /*
     * When coming directly from
     * Technical page, continue from
     * the first unfinished topic.
     *
     * When reopening the same subject,
     * continue from saved topic.
     */
    if (
        progress.lastSubjectId ===
        subject.id
    ) {

        currentTopicIndex =
            Math.min(
                Math.max(
                    progress.lastTopicIndex || 0,
                    0
                ),
                Math.max(
                    subject.topics.length - 1,
                    0
                )
            );

    } else {

        currentTopicIndex =
            findFirstIncompleteTopic(
                subject
            );
    }


    progress.lastSubjectId =
        subject.id;

    progress.lastTopicIndex =
        currentTopicIndex;


    learningArea.classList.remove(
        "hidden"
    );

    emptyLearningState.classList.add(
        "hidden"
    );


    renderSubjectCards();

    renderCourse();


    if (scroll) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* =========================================================
   FIRST INCOMPLETE TOPIC
========================================================= */

function findFirstIncompleteTopic(
    subject
) {

    const index =
        subject.topics.findIndex(
            topic =>
                !isTopicCompleted(
                    subject.id,
                    topic.id
                )
        );


    if (index < 0) {
        return 0;
    }


    return index;
}


/* =========================================================
   RENDER COURSE
========================================================= */

function renderCourse() {

    if (!currentSubject) {
        return;
    }


    const data =
        getSubjectProgress(
            currentSubject
        );


    currentSubjectLabel.textContent =
        "TECHNICAL LEARNING";


    currentSubjectName.textContent =
        currentSubject.name;


    currentSubjectDescription.textContent =
        currentSubject.description ||
        "Complete the study material topic by topic.";


    courseProgressPercent.textContent =
        `${data.percentage}%`;


    courseProgressFill.style.width =
        `${data.percentage}%`;


    courseProgressText.textContent =
        `${data.completed} / ${data.total} topics completed`;


    topicCount.textContent =
        data.total;


    renderTopicList();

    renderCurrentTopic();
}


/* =========================================================
   TOPIC LIST
========================================================= */

function renderTopicList() {

    topicList.innerHTML = "";


    currentSubject.topics.forEach(
        (
            topic,
            index
        ) => {

            const completed =
                isTopicCompleted(
                    currentSubject.id,
                    topic.id
                );


            const item =
                document.createElement(
                    "button"
                );


            item.type = "button";

            item.className =
                "topic-item";


            if (
                index ===
                currentTopicIndex
            ) {

                item.classList.add(
                    "active"
                );
            }


            if (completed) {

                item.classList.add(
                    "completed"
                );
            }


            item.innerHTML = `

                <span class="topic-index">
                    ${completed ? "✓" : index + 1}
                </span>

                <span class="topic-item-content">

                    <strong>
                        ${escapeHtml(
                            topic.title
                        )}
                    </strong>

                    <span>
                        ${
                            completed
                                ? "Completed"
                                : "Study material"
                        }
                    </span>

                </span>

            `;


            item.addEventListener(
                "click",
                async () => {

                    currentTopicIndex =
                        index;


                    progress.lastSubjectId =
                        currentSubject.id;

                    progress.lastTopicIndex =
                        currentTopicIndex;


                    try {

                        await saveProgress();

                    } catch (error) {

                        console.error(
                            "Could not save topic position:",
                            error
                        );
                    }


                    renderCourse();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );


            topicList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   CURRENT TOPIC
========================================================= */

function renderCurrentTopic() {

    const topic =
        currentSubject.topics[
            currentTopicIndex
        ];


    if (!topic) {

        topicTitle.textContent =
            "No topic available";

        topicLearn.textContent =
            "This subject does not contain any topics.";

        return;
    }


    const completed =
        isTopicCompleted(
            currentSubject.id,
            topic.id
        );


    topicNumber.textContent =
        `Topic ${currentTopicIndex + 1} of ${currentSubject.topics.length}`;


    topicTitle.textContent =
        topic.title;


    topicLearn.textContent =
        topic.learn ||
        "Study material has not been added for this topic yet.";


    topicExample.textContent =
        topic.example ||
        "No example has been added for this topic yet.";


    keyPointsList.innerHTML =
        "";


    const points =
        Array.isArray(
            topic.keyPoints
        )
            ? topic.keyPoints
            : [];


    if (points.length === 0) {

        const li =
            document.createElement(
                "li"
            );

        li.textContent =
            "Review the study material above carefully.";

        keyPointsList.appendChild(
            li
        );

    } else {

        points.forEach(
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
    }


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
            : "Mark Topic Read";


    previousTopicBtn.disabled =
        currentTopicIndex <= 0;


    nextTopicBtn.disabled =
        currentTopicIndex >=
        currentSubject.topics.length - 1;


    actionMessage.textContent =
        completed
            ? "This topic is already saved."
            : "Read the study material before marking it complete.";
}


/* =========================================================
   COMPLETE CURRENT TOPIC
========================================================= */

async function completeCurrentTopic() {

    if (!currentSubject) {
        return;
    }


    const topic =
        currentSubject.topics[
            currentTopicIndex
        ];


    if (!topic) {
        return;
    }


    const key =
        getTopicKey(
            currentSubject.id,
            topic.id
        );


    if (
        progress.completedTopics[key] ===
        true
    ) {
        return;
    }


    progress.completedTopics[key] =
        true;


    progress.lastSubjectId =
        currentSubject.id;


    progress.lastTopicIndex =
        currentTopicIndex;


    completeTopicBtn.disabled =
        true;

    completeTopicBtn.textContent =
        "Saving...";


    try {

        await saveProgress();


        /*
         * Re-render progress immediately.
         */
        renderSubjectCards();

        renderCourse();


        /*
         * Move to the next topic automatically.
         */
        if (
            currentTopicIndex <
            currentSubject.topics.length - 1
        ) {

            currentTopicIndex += 1;

            progress.lastTopicIndex =
                currentTopicIndex;


            try {

                await saveProgress();

            } catch (error) {

                console.error(
                    "Could not save next topic position:",
                    error
                );
            }


            renderCourse();


            actionMessage.textContent =
                "Topic completed. Next topic opened.";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            actionMessage.textContent =
                "All topics in this subject are completed.";
        }

    } catch (error) {

        console.error(
            "Could not save technical learning progress:",
            error
        );


        delete progress.completedTopics[key];


        completeTopicBtn.disabled =
            false;

        completeTopicBtn.textContent =
            "Mark Topic Read";


        actionMessage.textContent =
            "Could not save progress. Please try again.";
    }
}


/* =========================================================
   PREVIOUS TOPIC
========================================================= */

async function goPreviousTopic() {

    if (
        !currentSubject ||
        currentTopicIndex <= 0
    ) {
        return;
    }


    currentTopicIndex -= 1;


    progress.lastSubjectId =
        currentSubject.id;

    progress.lastTopicIndex =
        currentTopicIndex;


    try {

        await saveProgress();

    } catch (error) {

        console.error(
            "Could not save topic position:",
            error
        );
    }


    renderCourse();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   NEXT TOPIC
========================================================= */

async function goNextTopic() {

    if (
        !currentSubject ||
        currentTopicIndex >=
            currentSubject.topics.length - 1
    ) {
        return;
    }


    currentTopicIndex += 1;


    progress.lastSubjectId =
        currentSubject.id;

    progress.lastTopicIndex =
        currentTopicIndex;


    try {

        await saveProgress();

    } catch (error) {

        console.error(
            "Could not save topic position:",
            error
        );
    }


    renderCourse();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "./login.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showError(
    message
) {

    if (learningArea) {
        learningArea.classList.add(
            "hidden"
        );
    }


    if (emptyLearningState) {

        emptyLearningState.classList.remove(
            "hidden"
        );


        emptyLearningState.innerHTML = `

            <div class="empty-icon">
                !
            </div>

            <h2>
                Technical material could not load
            </h2>

            <p>
                ${escapeHtml(message)}
            </p>

        `;
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

async function initialize() {

    try {

        await loadCurriculum();

        await loadProgress();

        renderInitials();

        setupLogout();


        if (
            subjects.length === 0
        ) {

            throw new Error(
                "No technical subjects were found in technical-curriculum.json."
            );
        }


        renderSubjectCards();


        const requestedSubject =
            getRequestedSubjectId();


        /*
         * Direct link:
         * technical-learning.html?subject=linux
         */
        if (
            requestedSubject
        ) {

            const matchingSubject =
                subjects.find(
                    subject =>
                        subject.id.toLowerCase() ===
                        requestedSubject
                );


            if (!matchingSubject) {

                throw new Error(
                    `Subject "${requestedSubject}" is not available in technical-curriculum.json.`
                );
            }


            openSubject(
                matchingSubject.id,
                false
            );


        } else {

            /*
             * If no subject is specified,
             * continue from the saved subject.
             */
            if (
                progress.lastSubjectId
            ) {

                const savedSubject =
                    subjects.find(
                        subject =>
                            subject.id ===
                            progress.lastSubjectId
                    );


                if (savedSubject) {

                    openSubject(
                        savedSubject.id,
                        false
                    );

                    return;
                }
            }


            learningArea.classList.add(
                "hidden"
            );

            emptyLearningState.classList.remove(
                "hidden"
            );
        }

    } catch (error) {

        console.error(
            "Technical learning error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong while loading the technical learning page."
        );
    }
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (previousTopicBtn) {

    previousTopicBtn.addEventListener(
        "click",
        goPreviousTopic
    );
}


if (nextTopicBtn) {

    nextTopicBtn.addEventListener(
        "click",
        goNextTopic
    );
}


if (completeTopicBtn) {

    completeTopicBtn.addEventListener(
        "click",
        completeCurrentTopic
    );
}


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "./login.html";

            return;
        }


        currentUser =
            user;


        await initialize();
    }
);