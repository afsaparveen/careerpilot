const CHAPTER_ID =
    "data-abstraction";

const STORAGE_KEY =
    "careerPilotDBMSProgress";

const TOTAL_TOPICS = 7;


/* =========================
   ELEMENTS
========================= */

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");

const allTopicsMessage =
    document.getElementById("allTopicsMessage");

const startTestButton =
    document.getElementById("startTestButton");

const testSection =
    document.getElementById("testSection");

const testForm =
    document.getElementById("testForm");

const questionsContainer =
    document.getElementById("questionsContainer");

const resultSection =
    document.getElementById("resultSection");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const scoreText =
    document.getElementById("scoreText");

const retryButton =
    document.getElementById("retryButton");

const nextChapterButton =
    document.getElementById("nextChapterButton");


/* =========================
   PROGRESS
========================= */

let progress = {
    completedTopics: {},
    passedChapters: {},
    testScores: {}
};


function loadProgress() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);

        progress = data;

        if (!progress.completedTopics) {
            progress.completedTopics = {};
        }

        if (!progress.passedChapters) {
            progress.passedChapters = {};
        }

        if (!progress.testScores) {
            progress.testScores = {};
        }

    } catch (error) {

        console.error(
            "Progress loading error:",
            error
        );

    }
}


function saveProgress() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );

}


/* =========================
   TOPIC KEY
========================= */

function getTopicKey(topicId) {

    return (
        CHAPTER_ID +
        "__" +
        topicId
    );

}


/* =========================
   CHAPTER ACCESS
========================= */

function checkChapterAccess() {

    const chapter2Passed =
        progress.passedChapters[
            "dbms-architecture"
        ];

    if (!chapter2Passed) {

        document.body.innerHTML = `

            <div style="
                max-width:700px;
                margin:100px auto;
                text-align:center;
                font-family:Arial;
                padding:30px;
            ">

                <h1>
                    🔒 Chapter 3 Locked
                </h1>

                <p style="
                    margin:20px 0;
                    color:#64748b;
                    line-height:1.6;
                ">

                    You must pass Chapter 2
                    with at least 75% before
                    starting Chapter 3.

                </p>

                <a
                    href="chapter2.html"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                    ">

                    Go to Chapter 2

                </a>

            </div>

        `;

        return false;
    }

    return true;
}


/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress() {

    let completed = 0;


    for (
        let i = 1;
        i <= TOTAL_TOPICS;
        i++
    ) {

        const topicKey =
            getTopicKey(
                "topic" + i
            );

        if (
            progress.completedTopics[
                topicKey
            ]
        ) {

            completed++;

        }

    }


    progressText.textContent =
        completed +
        " / " +
        TOTAL_TOPICS;


    const percentage =
        Math.round(
            (completed / TOTAL_TOPICS) *
            100
        );


    progressFill.style.width =
        percentage + "%";


    if (
        completed === TOTAL_TOPICS
    ) {

        allTopicsMessage.classList.remove(
            "hidden"
        );

    } else {

        allTopicsMessage.classList.add(
            "hidden"
        );

    }

}


/* =========================
   TOPIC BUTTONS
========================= */

function setupTopicButtons() {

    const buttons =
        document.querySelectorAll(
            ".complete-btn"
        );


    buttons.forEach(
        button => {

            const topicId =
                button.dataset.topic;

            const topicKey =
                getTopicKey(topicId);


            if (
                progress.completedTopics[
                    topicKey
                ]
            ) {

                button.classList.add(
                    "completed"
                );

                button.textContent =
                    "✓ Completed";

            }


            button.addEventListener(
                "click",
                function() {

                    progress.completedTopics[
                        topicKey
                    ] = true;


                    saveProgress();


                    button.classList.add(
                        "completed"
                    );

                    button.textContent =
                        "✓ Completed";


                    updateProgress();

                }
            );

        }
    );

}


/* =========================
   QUESTIONS
========================= */

const questions = [

    {
        question:
            "What is data abstraction?",

        options: [

            "Deleting unnecessary data",

            "Hiding implementation details while showing relevant information",

            "Creating duplicate databases",

            "Removing database tables"

        ],

        answer: 1
    },


    {
        question:
            "Which is the lowest level of data abstraction?",

        options: [

            "View level",

            "Logical level",

            "Physical level",

            "User level"

        ],

        answer: 2
    },


    {
        question:
            "Which level describes file structures, indexes and data blocks?",

        options: [

            "Physical level",

            "Logical level",

            "View level",

            "Application level"

        ],

        answer: 0
    },


    {
        question:
            "Which level describes tables, columns, relationships and constraints?",

        options: [

            "Physical level",

            "Logical level",

            "View level",

            "Storage level"

        ],

        answer: 1
    },


    {
        question:
            "Which is the highest level of data abstraction?",

        options: [

            "Physical level",

            "Logical level",

            "View level",

            "Storage level"

        ],

        answer: 2
    },


    {
        question:
            "A warden sees Roll No, Name and Fee Status while the examination branch sees marks. Which level is this?",

        options: [

            "Physical level",

            "Logical level",

            "View level",

            "File level"

        ],

        answer: 2
    },


    {
        question:
            "What does logical data independence allow?",

        options: [

            "Physical storage changes without logical changes",

            "Logical schema changes without rewriting application programs",

            "Removing all database security",

            "Changing hardware without a database"

        ],

        answer: 1
    },


    {
        question:
            "Splitting Address into Street, City and Pin Code without rewriting dependent applications illustrates:",

        options: [

            "Physical data independence",

            "Logical data independence",

            "Data redundancy",

            "Data security"

        ],

        answer: 1
    },


    {
        question:
            "What does physical data independence allow?",

        options: [

            "Changing physical storage without affecting the logical schema",

            "Changing users without changing passwords",

            "Changing SQL into HTML",

            "Changing tables into files"

        ],

        answer: 0
    },


    {
        question:
            "Moving attendance data from HDD to SSD without changing SQL queries is an example of:",

        options: [

            "Logical data independence",

            "Physical data independence",

            "View level",

            "Data redundancy"

        ],

        answer: 1
    },


    {
        question:
            "What is the correct abstraction hierarchy?",

        options: [

            "View → Logical → Physical",

            "Physical → Logical → View",

            "Logical → Physical → View",

            "Physical → View → Logical"

        ],

        answer: 1
    },


    {
        question:
            "Which level is mainly concerned with user-specific information?",

        options: [

            "Physical",

            "Logical",

            "View",

            "Storage"

        ],

        answer: 2
    }

];


/* =========================
   RENDER TEST
========================= */

function renderTest() {

    questionsContainer.innerHTML = "";


    questions.forEach(
        (question, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "question-card";


            let optionsHTML = "";


            question.options.forEach(
                (option, optionIndex) => {

                    optionsHTML += `

                        <label class="option">

                            <input
                                type="radio"
                                name="question${index}"
                                value="${optionIndex}"
                            >

                            ${option}

                        </label>

                    `;

                }
            );


            card.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${question.question}
                </h3>

                ${optionsHTML}

            `;


            questionsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================
   START TEST
========================= */

startTestButton.addEventListener(
    "click",
    function() {

        testSection.classList.remove(
            "hidden"
        );

        renderTest();

        testSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   SUBMIT
========================= */

testForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        let correct = 0;


        questions.forEach(
            (question, index) => {

                const selected =
                    document.querySelector(
                        `input[name="question${index}"]:checked`
                    );


                if (
                    selected &&
                    Number(selected.value) ===
                    question.answer
                ) {

                    correct++;

                }

            }
        );


        const total =
            questions.length;


        const score =
            Math.round(
                (correct / total) *
                100
            );


        progress.testScores[
            CHAPTER_ID
        ] = score;


        /* =================
           PASS
        ================= */

        if (score >= 75) {

            progress.passedChapters[
                CHAPTER_ID
            ] = true;

            saveProgress();


            resultIcon.textContent =
                "🎉";

            resultTitle.textContent =
                "Chapter 3 Passed!";


            resultMessage.textContent =
                "You scored " +
                score +
                "%. Chapter 4 is now unlocked.";


            scoreText.textContent =
                score + "%";


            retryButton.classList.add(
                "hidden"
            );

            nextChapterButton.classList.remove(
                "hidden"
            );

        }


        /* =================
           FAIL
        ================= */

        else {

            saveProgress();


            resultIcon.textContent =
                "❌";

            resultTitle.textContent =
                "Chapter 3 Not Passed";


            resultMessage.textContent =
                "You scored " +
                score +
                "%. You need 75%. Review the topics and retry the test.";


            scoreText.textContent =
                score + "%";


            retryButton.classList.remove(
                "hidden"
            );

            nextChapterButton.classList.add(
                "hidden"
            );

        }


        resultSection.classList.remove(
            "hidden"
        );


        resultSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   RETRY
========================= */

retryButton.addEventListener(
    "click",
    function() {

        testForm.reset();

        resultSection.classList.add(
            "hidden"
        );

        testSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   INITIALIZE
========================= */

loadProgress();


if (
    checkChapterAccess()
) {

    setupTopicButtons();

    updateProgress();

}