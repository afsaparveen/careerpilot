const pageChapterNumber =
    document.body.dataset.chapter;


let curriculum = null;

let chapter = null;

let topicIndex = 0;


let progress =
    JSON.parse(
        localStorage.getItem(
            "dbmsProgress"
        ) || "{}"
    );


if (!progress.completedTopics)
    progress.completedTopics = {};

if (!progress.completedChapters)
    progress.completedChapters = {};

if (!progress.passedChapters)
    progress.passedChapters = {};

if (!progress.testScores)
    progress.testScores = {};


/* ELEMENTS */

const title =
    document.getElementById(
        "chapterTitle"
    );

const pages =
    document.getElementById(
        "chapterPages"
    );

const topicNav =
    document.getElementById(
        "topicNav"
    );

const topicTitle =
    document.getElementById(
        "topicTitle"
    );

const learn =
    document.getElementById(
        "learn"
    );

const example =
    document.getElementById(
        "example"
    );

const points =
    document.getElementById(
        "points"
    );

const selfCheck =
    document.getElementById(
        "selfCheck"
    );

const complete =
    document.getElementById(
        "complete"
    );

const previous =
    document.getElementById(
        "previous"
    );

const next =
    document.getElementById(
        "next"
    );


/* ASSESSMENTS */

const assessmentRoutes = {

    1: "dbms-assessment.html",

    2: "dbms-architecture-assessment.html",

    3: "dbms-data-abstraction-assessment.html",

    4: "dbms-data-models-assessment.html",

    5: "dbms-er-model-assessment.html",

    6: "dbms-relational-assessment.html",

    7: "dbms-keys-assessment.html",

    8: "dbms-normalisation-assessment.html",

    9: "dbms-denormalization-assessment.html",

    10: "dbms-transactions-assessment.html",

    11: "dbms-sql-assessment.html",

    12: "dbms-indexing-assessment.html",

    13: "dbms-sql-practice-assessment.html",

    14: "dbms-final-assessment.html"

};


/* TEST BUTTON */

const assessment =
    document.createElement(
        "button"
    );

assessment.className =
    "action";

assessment.textContent =
    "Chapter Test";

assessment.disabled =
    true;


document
    .querySelector(".actions")
    .appendChild(
        assessment
    );


/* TOPIC KEY */

function key(topic) {

    return `${chapter.id}__${topic.id}`;

}


/* DONE */

function done(topic) {

    return !!progress.completedTopics[
        key(topic)
    ];

}


/* SAVE */

function save() {

    localStorage.setItem(
        "dbmsProgress",
        JSON.stringify(
            progress
        )
    );

}


/* RENDER TOPICS */

function renderTopicButtons() {

    topicNav.innerHTML = "";


    chapter.topics.forEach(
        (topic, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                `${index + 1}. ${topic.title}`;


            if (
                index === topicIndex
            ) {

                button.classList.add(
                    "active"
                );

            }


            if (
                done(topic)
            ) {

                button.classList.add(
                    "completed"
                );

            }


            button.onclick =
                () => {

                    topicIndex =
                        index;

                    renderTopic();

                };


            topicNav.appendChild(
                button
            );

        }
    );

}


/* RENDER TOPIC */

function renderTopic() {

    const topic =
        chapter.topics[
            topicIndex
        ];


    topicTitle.textContent =
        topic.title;


    learn.innerHTML =
        topic.learn || "";


    example.innerHTML =
        topic.example || "";


    points.innerHTML =
        "";


    (
        topic.keyPoints || []
    ).forEach(
        point => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                point;

            points.appendChild(
                li
            );

        }
    );


    selfCheck.value =
        "";


    complete.disabled =
        done(topic);


    complete.textContent =
        done(topic)
            ? "✓ Topic Completed"
            : "Complete Topic";


    previous.disabled =
        topicIndex === 0;


    next.disabled =
        !done(topic) ||
        topicIndex ===
        chapter.topics.length - 1;


    const allCompleted =
        chapter.topics.every(
            t => done(t)
        );


    assessment.disabled =
        !allCompleted;


    if (
        progress.passedChapters[
            chapter.id
        ]
    ) {

        assessment.textContent =
            `✓ Test Passed (${progress.testScores[chapter.id]}%)`;

    }

    else {

        assessment.textContent =
            "Chapter Test";

    }


    renderTopicButtons();

}


/* COMPLETE */

complete.onclick =
    () => {

        const topic =
            chapter.topics[
                topicIndex
            ];


        if (
            selfCheck.value
                .trim()
                .length < 40
        ) {

            alert(
                "Please write at least 40 characters."
            );

            selfCheck.focus();

            return;

        }


        progress.completedTopics[
            key(topic)
        ] = true;


        if (
            chapter.topics.every(
                t => done(t)
            )
        ) {

            progress.completedChapters[
                chapter.id
            ] = true;

        }


        save();

        renderTopic();


        if (
            chapter.topics.every(
                t => done(t)
            )
        ) {

            alert(
                "🎉 All topics completed! Chapter test is unlocked."
            );

        }

        else {

            alert(
                "✓ Topic completed!"
            );

        }

    };


/* PREVIOUS */

previous.onclick =
    () => {

        if (
            topicIndex > 0
        ) {

            topicIndex--;

            renderTopic();

        }

    };


/* NEXT */

next.onclick =
    () => {

        if (
            topicIndex <
            chapter.topics.length - 1
        ) {

            if (
                done(
                    chapter.topics[
                        topicIndex
                    ]
                )
            ) {

                topicIndex++;

                renderTopic();

            }

        }

    };


/* TEST */

assessment.onclick =
    () => {

        if (
            !chapter.topics.every(
                t => done(t)
            )
        ) {

            alert(
                "Complete all topics first."
            );

            return;

        }


        const route =
            assessmentRoutes[
                Number(
                    pageChapterNumber
                )
            ];


        if (!route) {

            alert(
                "Assessment page not found."
            );

            return;

        }


        window.location.href =
            `${route}?chapterId=${encodeURIComponent(chapter.id)}`;

    };


/* LOAD */

async function start() {

    try {

        const response =
            await fetch(
                "../data/dbms-curriculum.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        curriculum =
            await response.json();


        chapter =
            curriculum.chapters.find(
                c =>
                    String(c.number) ===
                    String(pageChapterNumber)
            );


        if (!chapter) {

            throw new Error(
                "Chapter not found."
            );

        }


        title.textContent =
            `Chapter ${chapter.number}: ${chapter.title}`;


        pages.textContent =
            chapter.pages
                ? `Pages ${chapter.pages}`
                : "";


        renderTopic();

    }

    catch (error) {

        title.textContent =
            "Failed to load chapter";

        learn.textContent =
            error.message;

        console.error(error);

    }

}


start();