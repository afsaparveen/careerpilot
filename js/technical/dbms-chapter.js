const CURRICULUM_FILE =
    "../data/dbms-curriculum.json";

const STORAGE_KEY =
    "dbmsProgress";


let curriculum = null;

let chapters = [];

let currentChapter = null;

let currentTopicIndex = 0;


let progress =
    loadProgress();


/* =========================
   LOAD PROGRESS
========================= */

function loadProgress() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!saved) {

        return {

            completedTopics: {},

            passedChapters: {},

            testScores: {}

        };

    }


    try {

        return JSON.parse(saved);

    } catch {

        return {

            completedTopics: {},

            passedChapters: {},

            testScores: {}

        };

    }

}


/* =========================
   SAVE
========================= */

function saveProgress() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(progress)

    );

}


/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    loadChapter
);


/* =========================
   LOAD CHAPTER
========================= */

async function loadChapter() {

    try {

        const response =
            await fetch(
                CURRICULUM_FILE
            );


        if (!response.ok) {

            throw new Error(
                "Curriculum HTTP error"
            );

        }


        curriculum =
            await response.json();


        chapters =
            curriculum.subject.chapters;


        const params =
            new URLSearchParams(
                window.location.search
            );


        const chapterId =
            params.get(
                "chapterId"
            );


        if (!chapterId) {

            goDashboard();

            return;

        }


        const index =
            chapters.findIndex(
                chapter =>
                    chapter.id ===
                    chapterId
            );


        if (index === -1) {

            alert(
                "Chapter not found."
            );

            goDashboard();

            return;

        }


        /*
           Check chapter unlock.
        */

        if (
            !isChapterUnlocked(index)
        ) {

            alert(
                "Complete the previous chapter first."
            );

            goDashboard();

            return;

        }


        currentChapter =
            chapters[index];


        currentTopicIndex =
            findFirstIncompleteTopic(
                currentChapter
            );


        renderChapter();

        renderTopic();

        updateChapterProgress();


    } catch (error) {

        console.error(error);

        alert(
            "Could not load DBMS curriculum."
        );

    }

}


/* =========================
   CHAPTER UNLOCK
========================= */

function isChapterUnlocked(index) {

    if (index === 0) {

        return true;

    }


    const previous =
        chapters[index - 1];


    return Boolean(
        progress.passedChapters[
            previous.id
        ]
    );

}


/* =========================
   RENDER CHAPTER
========================= */

function renderChapter() {

    document.getElementById(
        "chapterNumber"
    ).textContent =
        `Chapter ${currentChapter.number}`;


    document.getElementById(
        "chapterTitle"
    ).textContent =
        currentChapter.title;


    renderTopics();

}


/* =========================
   RENDER TOPICS
========================= */

function renderTopics() {

    const container =
        document.getElementById(
            "topicList"
        );


    container.innerHTML = "";


    currentChapter.topics.forEach(
        (topic, index) => {

            const completed =
                isTopicCompleted(
                    topic.id
                );


            const item =
                document.createElement(
                    "div"
                );


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

                <div class="topic-number">

                    ${
                        completed
                        ? "✓"
                        : index + 1
                    }

                </div>


                <div>

                    ${topic.title}

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    /*
                       User can revisit
                       completed topics.

                       But cannot skip
                       to an uncompleted
                       future topic.
                    */

                    if (
                        index >
                        findFirstIncompleteTopic(
                            currentChapter
                        )
                    ) {

                        showMessage(
                            "Complete the previous topics first.",
                            "info"
                        );

                        return;

                    }


                    currentTopicIndex =
                        index;


                    renderTopics();

                    renderTopic();

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


/* =========================
   FIND FIRST INCOMPLETE
========================= */

function findFirstIncompleteTopic(
    chapter
) {

    for (
        let i = 0;
        i < chapter.topics.length;
        i++
    ) {

        if (
            !isTopicCompleted(
                chapter.topics[i].id
            )
        ) {

            return i;

        }

    }


    return chapter.topics.length - 1;

}


/* =========================
   TOPIC COMPLETE
========================= */

function isTopicCompleted(
    topicId
) {

    return Boolean(

        progress.completedTopics[
            `${currentChapter.id}:${topicId}`
        ]

    );

}


/* =========================
   ALL TOPICS
========================= */

function allTopicsCompleted() {

    return currentChapter.topics.every(
        topic =>
            isTopicCompleted(
                topic.id
            )
    );

}


/* =========================
   RENDER TOPIC
========================= */

function renderTopic() {

    const topic =
        currentChapter.topics[
            currentTopicIndex
        ];


    if (!topic) {

        return;

    }


    document.getElementById(
        "breadcrumb"
    ).textContent =
        currentChapter.title;


    document.getElementById(
        "topicCounter"
    ).textContent =
        `Topic ${currentTopicIndex + 1} of ${currentChapter.topics.length}`;


    document.getElementById(
        "topicTitle"
    ).textContent =
        topic.title;


    document.getElementById(
        "learnText"
    ).textContent =
        topic.learn;


    document.getElementById(
        "exampleText"
    ).textContent =
        topic.example;


    const list =
        document.getElementById(
            "keyPoints"
        );


    list.innerHTML = "";


    topic.keyPoints.forEach(
        point => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                point;


            list.appendChild(
                li
            );

        }
    );


    updateButtons();

}


/* =========================
   BUTTONS
========================= */

function updateButtons() {

    const topic =
        currentChapter.topics[
            currentTopicIndex
        ];


    const completed =
        isTopicCompleted(
            topic.id
        );


    const completeBtn =
        document.getElementById(
            "completeBtn"
        );


    if (completed) {

        completeBtn.textContent =
            "✓ Topic Completed";

        completeBtn.disabled =
            true;

    } else {

        completeBtn.textContent =
            "Complete Topic";

        completeBtn.disabled =
            false;

    }


    const previousBtn =
        document.getElementById(
            "previousBtn"
        );


    previousBtn.disabled =
        currentTopicIndex === 0;


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    if (
        currentTopicIndex <
        currentChapter.topics.length - 1
    ) {

        nextBtn.style.display =
            "block";

        nextBtn.disabled =
            !completed;

    } else {

        nextBtn.style.display =
            "none";

    }


    const testBtn =
        document.getElementById(
            "testBtn"
        );


    if (
        allTopicsCompleted()
    ) {

        testBtn.style.display =
            "block";

    } else {

        testBtn.style.display =
            "none";

    }

}


/* =========================
   COMPLETE
========================= */

document.getElementById(
    "completeBtn"
).addEventListener(
    "click",
    completeTopic
);


function completeTopic() {

    const topic =
        currentChapter.topics[
            currentTopicIndex
        ];


    progress.completedTopics[
        `${currentChapter.id}:${topic.id}`
    ] = true;


    saveProgress();


    renderTopics();

    updateButtons();

    updateChapterProgress();


    showMessage(
        "Topic completed! ✓",
        "success"
    );

}


/* =========================
   NEXT
========================= */

document.getElementById(
    "nextBtn"
).addEventListener(
    "click",
    nextTopic
);


function nextTopic() {

    const topic =
        currentChapter.topics[
            currentTopicIndex
        ];


    if (
        !isTopicCompleted(
            topic.id
        )
    ) {

        showMessage(
            "Complete this topic first.",
            "info"
        );

        return;

    }


    if (
        currentTopicIndex <
        currentChapter.topics.length - 1
    ) {

        currentTopicIndex++;

        renderTopics();

        renderTopic();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =========================
   PREVIOUS
========================= */

document.getElementById(
    "previousBtn"
).addEventListener(
    "click",
    () => {

        if (
            currentTopicIndex > 0
        ) {

            currentTopicIndex--;

            renderTopics();

            renderTopic();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


/* =========================
   TEST
========================= */

document.getElementById(
    "testBtn"
).addEventListener(
    "click",
    openTest
);


function openTest() {

    if (
        !allTopicsCompleted()
    ) {

        alert(
            "Complete all topics first."
        );

        return;

    }


    window.location.href =
        `dbms-assessment.html?chapterId=${encodeURIComponent(
            currentChapter.id
        )}`;

}


/* =========================
   CHAPTER PROGRESS
========================= */

function updateChapterProgress() {

    const total =
        currentChapter.topics.length;


    let completed = 0;


    currentChapter.topics.forEach(
        topic => {

            if (
                isTopicCompleted(
                    topic.id
                )
            ) {

                completed++;

            }

        }
    );


    const percentage =
        Math.round(
            completed /
            total *
            100
        );


    document.getElementById(
        "chapterProgressText"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "chapterProgressFill"
    ).style.width =
        `${percentage}%`;

}


/* =========================
   MESSAGE
========================= */

function showMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.className =
        `message ${type}`;


    setTimeout(
        () => {

            message.className =
                "message";

        },
        2500
    );

}


/* =========================
   DASHBOARD
========================= */

function goDashboard() {

    window.location.href =
        "dbms.html";

}