/* =========================================
   CAREERPILOT
   CHAPTER 1
   DBMS INTRODUCTION
========================================= */


/* =========================================
   CONFIGURATION
========================================= */

const CHAPTER_ID =
    "dbms-introduction";

const CHAPTER_NUMBER = 1;

const STORAGE_KEY =
    "careerPilotDBMSProgress";


/* =========================================
   VARIABLES
========================================= */

let curriculum = null;

let chapter = null;


let progress = {

    completedTopics: {},

    passedChapters: {},

    testScores: {}

};


/* =========================================
   CHAPTER 1 QUESTIONS
========================================= */

const questions = [

    {
        question:
            "What is a DBMS?",

        options: [
            "A programming language",
            "Software used to manage databases",
            "An operating system",
            "A computer network"
        ],

        answer: 1
    },


    {
        question:
            "Why do we need a DBMS?",

        options: [
            "To increase unnecessary data duplication",
            "To organize and control data",
            "To remove all security",
            "To prevent data storage"
        ],

        answer: 1
    },


    {
        question:
            "Which of the following is a DBMS security feature?",

        options: [
            "Giving every user full access",
            "Controlling user permissions",
            "Deleting user accounts automatically",
            "Removing database tables"
        ],

        answer: 1
    },


    {
        question:
            "What is data redundancy?",

        options: [
            "Data encryption",
            "Unnecessary repetition of data",
            "Data deletion",
            "Data sorting"
        ],

        answer: 1
    },


    {
        question:
            "Which ACID property means all-or-nothing execution?",

        options: [
            "Consistency",
            "Isolation",
            "Durability",
            "Atomicity"
        ],

        answer: 3
    },


    {
        question:
            "Which ACID property maintains database rules?",

        options: [
            "Atomicity",
            "Consistency",
            "Isolation",
            "Durability"
        ],

        answer: 1
    },


    {
        question:
            "What is the main purpose of an index?",

        options: [
            "To delete rows",
            "To duplicate rows",
            "To locate rows faster",
            "To remove tables"
        ],

        answer: 2
    },


    {
        question:
            "What does scalability mean?",

        options: [
            "The ability to handle increasing workload",
            "The ability to delete data",
            "The ability to remove users",
            "The ability to avoid storage"
        ],

        answer: 0
    },


    {
        question:
            "Which database type uses nodes and connections?",

        options: [
            "Relational database",
            "Document database",
            "Graph database",
            "Key-value database"
        ],

        answer: 2
    },


    {
        question:
            "Which database type stores data using key-value pairs?",

        options: [
            "Graph database",
            "Relational database",
            "Key-value database",
            "Object-oriented database"
        ],

        answer: 2
    }

];


/* =========================================
   HTML ELEMENTS
========================================= */

const chapterTitle =
    document.getElementById(
        "chapterTitle"
    );


const chapterPages =
    document.getElementById(
        "chapterPages"
    );


const topicList =
    document.getElementById(
        "topicList"
    );


const topicProgress =
    document.getElementById(
        "topicProgress"
    );


const percentage =
    document.getElementById(
        "percentage"
    );


const progressFill =
    document.getElementById(
        "progressFill"
    );


const testSection =
    document.getElementById(
        "testSection"
    );


const questionsContainer =
    document.getElementById(
        "questions"
    );


const testForm =
    document.getElementById(
        "testForm"
    );


const questionCount =
    document.getElementById(
        "questionCount"
    );


const passMarkElement =
    document.getElementById(
        "passMark"
    );


const resultSection =
    document.getElementById(
        "resultSection"
    );


const resultIcon =
    document.getElementById(
        "resultIcon"
    );


const resultTitle =
    document.getElementById(
        "resultTitle"
    );


const resultScore =
    document.getElementById(
        "resultScore"
    );


const resultMessage =
    document.getElementById(
        "resultMessage"
    );


const retryButton =
    document.getElementById(
        "retryButton"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


/* =========================================
   LOAD PROGRESS
========================================= */

function loadProgress() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (saved) {

            const data =
                JSON.parse(saved);


            progress = {

                completedTopics:
                    data.completedTopics || {},

                passedChapters:
                    data.passedChapters || {},

                testScores:
                    data.testScores || {}

            };

        }

    }

    catch (error) {

        console.error(
            "Progress loading error:",
            error
        );

    }

}


/* =========================================
   SAVE PROGRESS
========================================= */

function saveProgress() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(progress)

    );

}


/* =========================================
   LOAD CURRICULUM
========================================= */

async function loadCurriculum() {

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
                "HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(
                data.chapters
            )
        ) {

            throw new Error(
                "Invalid DBMS curriculum."
            );

        }


        curriculum = data;


        chapter =
            curriculum.chapters.find(
                item =>
                    item.id ===
                    CHAPTER_ID
            );


        if (!chapter) {

            throw new Error(
                "Chapter 1 not found."
            );

        }


        renderChapter();

    }

    catch (error) {

        console.error(
            error
        );


        topicList.innerHTML = `

            <div class="error-box">

                <strong>
                    Could not load Chapter 1
                </strong>

                <br><br>

                ${escapeHtml(
                    error.message
                )}

                <br><br>

                Make sure this file exists:

                <br>

                <strong>
                    CareerPilot/data/dbms-curriculum.json
                </strong>

            </div>

        `;

    }

}


/* =========================================
   TOPIC KEY
========================================= */

function getTopicKey(topic) {

    return (
        CHAPTER_ID +
        "__" +
        topic.id
    );

}


/* =========================================
   CHECK TOPIC COMPLETION
========================================= */

function isTopicCompleted(topic) {

    return Boolean(

        progress.completedTopics[
            getTopicKey(topic)
        ]

    );

}


/* =========================================
   CHECK ALL TOPICS
========================================= */

function areAllTopicsCompleted() {

    for (
        let i = 0;
        i < chapter.topics.length;
        i++
    ) {

        if (
            !isTopicCompleted(
                chapter.topics[i]
            )
        ) {

            return false;

        }

    }


    return true;

}


/* =========================================
   RENDER CHAPTER
========================================= */

function renderChapter() {


    chapterTitle.textContent =
        chapter.title;


    chapterPages.textContent =
        "Source pages: " +
        chapter.pages;


    const passingPercentage =
        Number(
            chapter
                .completionRules
                ?.passingPercentage
            ?? 75
        );


    passMarkElement.textContent =
        passingPercentage + "%";


    topicList.innerHTML = "";


    chapter.topics.forEach(
        (topic, index) => {


            const completed =
                isTopicCompleted(
                    topic
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "topic-card";


            if (completed) {

                card.classList.add(
                    "completed"
                );

            }


            let keyPointsHTML = "";


            topic.keyPoints.forEach(
                point => {

                    keyPointsHTML += `

                        <li>
                            ${escapeHtml(
                                point
                            )}
                        </li>

                    `;

                }
            );


            card.innerHTML = `

                <div class="topic-header">


                    <div class="topic-number">

                        ${index + 1}

                    </div>


                    <div class="topic-content">


                        <h2>

                            ${escapeHtml(
                                topic.title
                            )}

                        </h2>


                        <div class="content-title">

                            Learn

                        </div>


                        <p class="learn-text">

                            ${escapeHtml(
                                topic.learn
                            )}

                        </p>


                        <div class="content-title">

                            Example

                        </div>


                        <div class="example-box">

                            ${escapeHtml(
                                topic.example
                            )}

                        </div>


                        <div class="content-title">

                            Key Points

                        </div>


                        <ul class="key-points">

                            ${keyPointsHTML}

                        </ul>


                        <button
                            class="complete-btn
                            ${
                                completed
                                    ? "completed"
                                    : ""
                            }"
                        >

                            ${
                                completed
                                    ? "✓ Topic Completed"
                                    : "Mark Topic Complete"
                            }

                        </button>


                        ${
                            completed
                                ? `
                                    <span
                                        class="completed-text"
                                    >
                                        Completed
                                    </span>
                                  `
                                : ""
                        }


                    </div>


                </div>

            `;


            const completeButton =
                card.querySelector(
                    ".complete-btn"
                );


            completeButton.addEventListener(
                "click",
                () => {

                    if (!completed) {

                        completeTopic(
                            topic
                        );

                    }

                }
            );


            topicList.appendChild(
                card
            );

        }
    );


    updateProgress();


    updateTestAvailability();

}


/* =========================================
   COMPLETE TOPIC
========================================= */

function completeTopic(topic) {

    const key =
        getTopicKey(topic);


    progress.completedTopics[
        key
    ] = true;


    saveProgress();


    renderChapter();

}


/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress() {

    let completed = 0;


    const total =
        chapter.topics.length;


    chapter.topics.forEach(
        topic => {

            if (
                isTopicCompleted(
                    topic
                )
            ) {

                completed++;

            }

        }
    );


    const value =
        Math.round(
            completed /
            total *
            100
        );


    topicProgress.textContent =
        `${completed} / ${total} topics completed`;


    percentage.textContent =
        value + "%";


    progressFill.style.width =
        value + "%";

}


/* =========================================
   TEST AVAILABILITY
========================================= */

function updateTestAvailability() {

    const complete =
        areAllTopicsCompleted();


    if (complete) {

        testSection.classList.remove(
            "hidden"
        );


        renderQuestions();

    }

    else {

        testSection.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   RENDER TEST QUESTIONS
========================================= */

function renderQuestions() {

    questionsContainer.innerHTML = "";


    questionCount.textContent =
        questions.length;


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

                            ${escapeHtml(
                                option
                            )}

                        </label>

                    `;

                }
            );


            card.innerHTML = `

                <div class="question-number">

                    QUESTION ${index + 1}

                </div>


                <div class="question-text">

                    ${escapeHtml(
                        question.question
                    )}

                </div>


                ${optionsHTML}

            `;


            questionsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================
   SUBMIT TEST
========================================= */

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


                if (!selected) {

                    return;

                }


                const selectedAnswer =
                    Number(
                        selected.value
                    );


                if (
                    selectedAnswer ===
                    question.answer
                ) {

                    correct++;

                }

            }
        );


        const score =
            Math.round(
                correct /
                questions.length *
                100
            );


        showResult(
            correct,
            score
        );

    }
);


/* =========================================
   SHOW RESULT
========================================= */

function showResult(
    correct,
    score
) {


    resultSection.classList.remove(
        "hidden"
    );


    resultScore.textContent =
        score + "%";


    const passingPercentage =
        Number(
            chapter
                .completionRules
                ?.passingPercentage
            ?? 75
        );


    if (
        score >=
        passingPercentage
    ) {


        /* =========================
           PASS
        ========================== */


        resultIcon.textContent =
            "🎉";


        resultTitle.textContent =
            "Chapter 1 Passed!";


        resultScore.style.color =
            "#16a34a";


        resultMessage.textContent =
            `You scored ${correct} out of ${
                questions.length
            }. You passed with ${
                score
            }%. Chapter 2 is now unlocked.`;


        retryButton.classList.add(
            "hidden"
        );


        nextButton.classList.remove(
            "hidden"
        );


        saveChapterPass(
            score
        );

    }

    else {


        /* =========================
           FAIL
        ========================== */


        resultIcon.textContent =
            "❌";


        resultTitle.textContent =
            "Test Not Passed";


        resultScore.style.color =
            "#dc2626";


        resultMessage.textContent =
            `You scored ${correct} out of ${
                questions.length
            }. You need ${
                passingPercentage
            }% or above to unlock Chapter 2.`;


        retryButton.classList.remove(
            "hidden"
        );


        nextButton.classList.add(
            "hidden"
        );

    }


    resultSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   SAVE CHAPTER PASS
========================================= */

function saveChapterPass(score) {


    progress.passedChapters[
        CHAPTER_ID
    ] = true;


    progress.testScores[
        CHAPTER_ID
    ] = score;


    saveProgress();

}


/* =========================================
   RETRY TEST
========================================= */

retryButton.addEventListener(
    "click",
    () => {


        resultSection.classList.add(
            "hidden"
        );


        testForm.reset();


        window.scrollTo({

            top: testSection.offsetTop,

            behavior: "smooth"

        });

    }
);


/* =========================================
   GO TO CHAPTER 2
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        window.location.href =
            "chapter2.html";

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}


/* =========================================
   START
========================================= */

loadProgress();

loadCurriculum();