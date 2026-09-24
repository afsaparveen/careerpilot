const CHAPTER_ID =
    "dbms-architecture";

const STORAGE_KEY =
    "careerPilotDBMSProgress";

const TOTAL_TOPICS = 6;


/* =========================
   GET HTML ELEMENTS
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


/* =========================
   LOAD SAVED PROGRESS
========================= */

function loadProgress() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (saved === null) {
        return;
    }


    try {

        progress =
            JSON.parse(saved);


        if (!progress.completedTopics) {

            progress.completedTopics = {};

        }


        if (!progress.passedChapters) {

            progress.passedChapters = {};

        }


        if (!progress.testScores) {

            progress.testScores = {};

        }

    }

    catch (error) {

        progress = {
            completedTopics: {},
            passedChapters: {},
            testScores: {}
        };

    }

}


/* =========================
   SAVE PROGRESS
========================= */

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
   CHECK CHAPTER 1
========================= */

function checkChapterAccess() {

    const chapter1Passed =
        progress.passedChapters[
            "dbms-introduction"
        ];


    if (!chapter1Passed) {

        document.body.innerHTML = `

            <div style="
                max-width:700px;
                margin:100px auto;
                padding:30px;
                text-align:center;
                font-family:Arial;
            ">

                <h1>
                    🔒 Chapter 2 Locked
                </h1>

                <p style="
                    margin:20px 0;
                    color:#64748b;
                    line-height:1.7;
                ">

                    You must pass Chapter 1
                    with at least 75%
                    before starting Chapter 2.

                </p>

                <a
                    href="chapter1.html"
                    style="
                        display:inline-block;
                        padding:13px 22px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:8px;
                        font-weight:bold;
                    ">

                    Go to Chapter 1

                </a>

            </div>

        `;


        return false;

    }


    return true;

}


/* =========================
   UPDATE TOPIC PROGRESS
========================= */

function updateProgress() {

    let completed = 0;


    for (
        let i = 1;
        i <= TOTAL_TOPICS;
        i++
    ) {

        const topicId =
            "topic" + i;


        const topicKey =
            getTopicKey(topicId);


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
            (completed / TOTAL_TOPICS) * 100
        );


    progressFill.style.width =
        percentage + "%";


    /*
       Test appears only after
       all 6 topics are completed.
    */

    if (
        completed === TOTAL_TOPICS
    ) {

        allTopicsMessage.classList.remove(
            "hidden"
        );

    }

    else {

        allTopicsMessage.classList.add(
            "hidden"
        );

    }

}


/* =========================
   TOPIC COMPLETION
========================= */

function setupTopicButtons() {

    const buttons =
        document.querySelectorAll(
            ".complete-btn"
        );


    buttons.forEach(
        function(button) {

            const topicId =
                button.dataset.topic;


            const topicKey =
                getTopicKey(topicId);


            /*
               Restore previous completion
            */

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


            /*
               Mark topic completed
            */

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
   TEST QUESTIONS
========================= */

const questions = [

    {
        question:
            "What does DBMS architecture describe?",

        options: [

            "Only database tables",

            "Where software components reside and how they communicate",

            "Only SQL commands",

            "Only database security"

        ],

        answer: 1
    },


    {
        question:
            "In which architecture do the user interface and database engine run on the same machine?",

        options: [

            "One-Tier",

            "Two-Tier",

            "Three-Tier",

            "Distributed"

        ],

        answer: 0
    },


    {
        question:
            "Which is an example of one-tier architecture?",

        options: [

            "Mobile App → REST API → PostgreSQL",

            "Java Client → MySQL Server",

            "Python Application → SQLite on one computer",

            "Browser → Application Server → Database"

        ],

        answer: 2
    },


    {
        question:
            "In two-tier architecture, what communicates directly with the database server?",

        options: [

            "Client application",

            "Application server",

            "Operating system",

            "Another database"

        ],

        answer: 0
    },


    {
        question:
            "Which technologies may be used to manage database connections in two-tier architecture?",

        options: [

            "HTML and CSS",

            "JDBC or ODBC",

            "JSON and XML",

            "Git and GitHub"

        ],

        answer: 1
    },


    {
        question:
            "What is the main characteristic of three-tier architecture?",

        options: [

            "Client directly accesses database",

            "UI and database are on the same machine",

            "Application server is placed between client and database",

            "There is no database server"

        ],

        answer: 2
    },


    {
        question:
            "Which layer usually contains business logic in three-tier architecture?",

        options: [

            "Client layer",

            "Application layer",

            "Database layer",

            "Storage layer"

        ],

        answer: 1
    },


    {
        question:
            "What is an advantage of three-tier architecture?",

        options: [

            "Database is directly exposed to clients",

            "Business logic and security can be centralized",

            "Only one user can connect",

            "Database is removed"

        ],

        answer: 1
    },


    {
        question:
            "What is a distributed database?",

        options: [

            "A database containing only one table",

            "A database storing data on geographically separated servers while presenting it as one logical database",

            "A database without security",

            "A database stored only on one computer"

        ],

        answer: 1
    },


    {
        question:
            "What does C represent in CAP theorem?",

        options: [

            "Connection",

            "Consistency",

            "Control",

            "Communication"

        ],

        answer: 1
    },


    {
        question:
            "What does A represent in CAP theorem?",

        options: [

            "Availability",

            "Authentication",

            "Application",

            "Architecture"

        ],

        answer: 0
    },


    {
        question:
            "What does P represent in CAP theorem?",

        options: [

            "Performance",

            "Processing",

            "Partition Tolerance",

            "Programming"

        ],

        answer: 2
    },


    {
        question:
            "What does Consistency mean in CAP theorem?",

        options: [

            "Every node reflects identical data at a given moment",

            "Every request is rejected",

            "Only one user can access the database",

            "All data is stored on one server"

        ],

        answer: 0
    },


    {
        question:
            "What does Availability mean in CAP theorem?",

        options: [

            "Every request receives a timely response",

            "Every node must be offline",

            "Only administrators can access the database",

            "Data can only exist on one server"

        ],

        answer: 0
    },


    {
        question:
            "What does Partition Tolerance mean?",

        options: [

            "The database has no tables",

            "The system continues operating despite communication disruption between nodes",

            "The database has only one user",

            "All data is deleted during a network failure"

        ],

        answer: 1
    }

];


/* =========================
   RENDER QUESTIONS
========================= */

function renderTest() {

    questionsContainer.innerHTML = "";


    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        const question =
            questions[i];


        const questionCard =
            document.createElement(
                "div"
            );


        questionCard.className =
            "question-card";


        let optionsHTML = "";


        for (
            let j = 0;
            j < question.options.length;
            j++
        ) {

            optionsHTML += `

                <label class="option">

                    <input
                        type="radio"
                        name="question${i}"
                        value="${j}"
                        required
                    >

                    ${question.options[j]}

                </label>

            `;

        }


        questionCard.innerHTML = `

            <h3>
                ${i + 1}.
                ${question.question}
            </h3>

            ${optionsHTML}

        `;


        questionsContainer.appendChild(
            questionCard
        );

    }

}


/* =========================
   START TEST
========================= */

startTestButton.addEventListener(
    "click",
    function() {

        renderTest();


        testSection.classList.remove(
            "hidden"
        );


        testSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================
   SUBMIT TEST
========================= */

testForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        let correct = 0;


        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const selected =
                document.querySelector(
                    `input[name="question${i}"]:checked`
                );


            if (
                selected &&
                Number(selected.value) ===
                questions[i].answer
            ) {

                correct++;

            }

        }


        const total =
            questions.length;


        const score =
            Math.round(
                (correct / total) * 100
            );


        /*
           Save test score
        */

        progress.testScores[
            CHAPTER_ID
        ] = score;


        /* =========================
           PASS
        ========================== */

        if (score >= 75) {

            progress.passedChapters[
                CHAPTER_ID
            ] = true;


            saveProgress();


            resultIcon.textContent =
                "🎉";


            resultTitle.textContent =
                "Chapter 2 Passed!";


            resultMessage.textContent =
                "You scored " +
                score +
                "%. You passed Chapter 2. Chapter 3 is now unlocked.";


            scoreText.textContent =
                score + "%";


            /*
               Hide Retry
            */

            retryButton.classList.add(
                "hidden"
            );


            /*
               SHOW CHAPTER 3 BUTTON
            */

            nextChapterButton.classList.remove(
                "hidden"
            );

        }


        /* =========================
           FAIL
        ========================== */

        else {

            saveProgress();


            resultIcon.textContent =
                "❌";


            resultTitle.textContent =
                "Chapter 2 Not Passed";


            resultMessage.textContent =
                "You scored " +
                score +
                "%. You need at least 75% to pass. Review the study material and try again.";


            scoreText.textContent =
                score + "%";


            /*
               Show Retry
            */

            retryButton.classList.remove(
                "hidden"
            );


            /*
               Do NOT show Chapter 3
            */

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
   RETRY TEST
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