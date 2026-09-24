import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   APTITUDE CURRICULUM
========================================= */

const TOPICS = [

    {
        id:
            "percentage",

        number:
            "01",

        title:
            "Percentage",

        description:
            "Learn percentage basics, percentage changes and placement-style percentage problems.",

        videoId:
            "RWdNhJWwzSs",

        youtubeUrl:
            "https://www.youtube.com/watch?v=RWdNhJWwzSs",

        questions: [

            {
                id:
                    "percentage-1",

                question:
                    "A shirt marked at ₹800 is sold at a discount of 15%. What is the selling price?",

                options: [
                    "₹650",
                    "₹680",
                    "₹700",
                    "₹720"
                ],

                answer:
                    1,

                explanation:
                    "15% of ₹800 = ₹120. Therefore the selling price is ₹800 − ₹120 = ₹680."
            },


            {
                id:
                    "percentage-2",

                question:
                    "A number is increased by 20% and then decreased by 20%. What is the net change?",

                options: [
                    "No change",
                    "4% decrease",
                    "4% increase",
                    "2% decrease"
                ],

                answer:
                    1,

                explanation:
                    "Take 100. After a 20% increase it becomes 120. A 20% decrease gives 96, which is a 4% decrease from 100."
            },


            {
                id:
                    "percentage-3",

                question:
                    "If 15% of Y is equal to 21% of Z, then Y is what percentage of Z?",

                options: [
                    "120%",
                    "130%",
                    "140%",
                    "150%"
                ],

                answer:
                    2,

                explanation:
                    "15Y = 21Z, so Y/Z = 21/15 = 1.4. Therefore Y is 140% of Z."
            },


            {
                id:
                    "percentage-4",

                question:
                    "A student scores 240 marks out of 400. What is the percentage score?",

                options: [
                    "50%",
                    "55%",
                    "60%",
                    "65%"
                ],

                answer:
                    2,

                explanation:
                    "Percentage = 240/400 × 100 = 60%."
            },


            {
                id:
                    "percentage-5",

                question:
                    "A's salary is 50% more than B's salary. B's salary is what percentage less than A's salary?",

                options: [
                    "25%",
                    "33⅓%",
                    "40%",
                    "50%"
                ],

                answer:
                    1,

                explanation:
                    "Let B = 100. Then A = 150. Difference = 50. Percentage less compared with A = 50/150 × 100 = 33⅓%."
            }

        ]
    },


    {
        id:
            "ratio-proportion",

        number:
            "02",

        title:
            "Ratio & Proportion",

        description:
            "Learn ratios, proportions, cross multiplication and placement-style ratio problems.",

        videoId:
            "jfoJBivWlnQ",

        youtubeUrl:
            "https://www.youtube.com/watch?v=jfoJBivWlnQ",

        questions: [

            {
                id:
                    "ratio-1",

                question:
                    "The ratio of two numbers is 3:5 and their sum is 64. What is the smaller number?",

                options: [
                    "18",
                    "21",
                    "24",
                    "30"
                ],

                answer:
                    2,

                explanation:
                    "Total parts = 8. One part = 64/8 = 8. The smaller number = 3 × 8 = 24."
            },


            {
                id:
                    "ratio-2",

                question:
                    "If A:B = 3:7 and B:C = 9:5, what is A:B:C?",

                options: [
                    "27:63:35",
                    "3:7:5",
                    "27:7:35",
                    "9:21:5"
                ],

                answer:
                    0,

                explanation:
                    "Make B common. 3:7 becomes 27:63 and 9:5 becomes 63:35. Therefore A:B:C = 27:63:35."
            },


            {
                id:
                    "ratio-3",

                question:
                    "If A:B = 4:5 and B:C = 10:7, what is A:C?",

                options: [
                    "4:7",
                    "8:7",
                    "7:8",
                    "5:7"
                ],

                answer:
                    1,

                explanation:
                    "Make B common: 4:5 = 8:10. Therefore A:B:C = 8:10:7 and A:C = 8:7."
            },


            {
                id:
                    "ratio-4",

                question:
                    "If 4 pens cost the same as 3 notebooks, what is the ratio of the price of one pen to one notebook?",

                options: [
                    "3:4",
                    "4:3",
                    "1:1",
                    "2:3"
                ],

                answer:
                    0,

                explanation:
                    "4 pens = 3 notebooks. Therefore the cost of one pen : one notebook = 3:4."
            },


            {
                id:
                    "ratio-5",

                question:
                    "Two numbers are in the ratio 3:8. If 5 is added to both, the ratio becomes 2:5. What is the smaller number?",

                options: [
                    "12",
                    "15",
                    "18",
                    "21"
                ],

                answer:
                    1,

                explanation:
                    "Let the numbers be 3x and 8x. Then (3x+5)/(8x+5)=2/5. Solving gives x=5, so the smaller number is 15."
            }

        ]
    },


    {
        id:
            "averages",

        number:
            "03",

        title:
            "Averages",

        description:
            "Learn average basics and solve placement-style average questions.",

        videoId:
            "rhSxQ4ieAYc",

        youtubeUrl:
            "https://www.youtube.com/watch?v=rhSxQ4ieAYc",

        questions: [

            {
                id:
                    "average-1",

                question:
                    "What is the average of 10, 20, 30, 40 and 50?",

                options: [
                    "25",
                    "30",
                    "35",
                    "40"
                ],

                answer:
                    1,

                explanation:
                    "Sum = 150. There are 5 numbers. Average = 150/5 = 30."
            },


            {
                id:
                    "average-2",

                question:
                    "The average of 6 numbers is 20. What is their total?",

                options: [
                    "100",
                    "110",
                    "120",
                    "130"
                ],

                answer:
                    2,

                explanation:
                    "Total = Average × Number of values = 20 × 6 = 120."
            },


            {
                id:
                    "average-3",

                question:
                    "The average of 5 numbers is 24. If one number, 20, is removed, what is the average of the remaining numbers?",

                options: [
                    "24",
                    "25",
                    "26",
                    "27"
                ],

                answer:
                    2,

                explanation:
                    "Original total = 5 × 24 = 120. Remaining total = 100. Average = 100/4 = 25. Therefore the correct answer is 25."
            },


            {
                id:
                    "average-4",

                question:
                    "The average age of 4 people is 25 years. A fifth person joins and the average becomes 24 years. What is the age of the fifth person?",

                options: [
                    "18",
                    "20",
                    "22",
                    "24"
                ],

                answer:
                    1,

                explanation:
                    "First total = 4 × 25 = 100. New total = 5 × 24 = 120. Fifth person's age = 20."
            },


            {
                id:
                    "average-5",

                question:
                    "The average of three consecutive integers is 20. What is the largest integer?",

                options: [
                    "19",
                    "20",
                    "21",
                    "22"
                ],

                answer:
                    2,

                explanation:
                    "Three consecutive integers around 20 are 19, 20 and 21. Their average is 20."
            }

        ]
    },


    {
        id:
            "time-work",

        number:
            "04",

        title:
            "Time & Work",

        description:
            "Learn work rates, efficiency and combined-work problems.",

        videoId:
            "KE7tQf9spPg",

        youtubeUrl:
            "https://www.youtube.com/watch?v=KE7tQf9spPg",

        questions: [

            {
                id:
                    "work-1",

                question:
                    "If one worker can complete a job in 10 days, what fraction of the job is completed in one day?",

                options: [
                    "1/5",
                    "1/10",
                    "1/12",
                    "1/20"
                ],

                answer:
                    1,

                explanation:
                    "If the entire work takes 10 days, one day's work is 1/10."
            },


            {
                id:
                    "work-2",

                question:
                    "A can complete a work in 6 days and B can complete it in 12 days. How long will they take together?",

                options: [
                    "3 days",
                    "4 days",
                    "6 days",
                    "8 days"
                ],

                answer:
                    1,

                explanation:
                    "A's rate = 1/6 and B's rate = 1/12. Combined rate = 1/4, so they take 4 days."
            },


            {
                id:
                    "work-3",

                question:
                    "If 24 men can finish a work in 10 days, how many days will 30 men take, assuming equal efficiency?",

                options: [
                    "6 days",
                    "8 days",
                    "10 days",
                    "12 days"
                ],

                answer:
                    1,

                explanation:
                    "Men × days is constant. 24 × 10 = 30 × days. Days = 8."
            },


            {
                id:
                    "work-4",

                question:
                    "A can do a work in 3 days and B can do the same work in 6 days. How long do they take together?",

                options: [
                    "1 day",
                    "2 days",
                    "3 days",
                    "4 days"
                ],

                answer:
                    1,

                explanation:
                    "A's rate = 1/3 and B's rate = 1/6. Combined rate = 1/2, so they finish in 2 days."
            },


            {
                id:
                    "work-5",

                question:
                    "P can complete a work in 30 days. Q is 25% more efficient than P. How many days will Q take?",

                options: [
                    "20 days",
                    "24 days",
                    "25 days",
                    "27 days"
                ],

                answer:
                    1,

                explanation:
                    "Q is 1.25 times as efficient as P. Time = 30/1.25 = 24 days."
            }

        ]
    }

];


/* =========================================
   STATE
========================================= */

let currentUser = null;

let userData = {};

let progress = {

    watchedLessons: [],

    passedTopics: [],

    attempts: {},

    completedQuestions: {},

    xp: 0

};


let currentTopicIndex = 0;

let currentQuestionIndex = 0;

let selectedAnswer = null;

let questionSubmitted = false;

let sessionCorrect = 0;


/* =========================================
   DOM
========================================= */

const topicList =
    document.getElementById(
        "topicList"
    );

const topicBadge =
    document.getElementById(
        "topicBadge"
    );

const topicTitle =
    document.getElementById(
        "topicTitle"
    );

const topicDescription =
    document.getElementById(
        "topicDescription"
    );

const topicStatus =
    document.getElementById(
        "topicStatus"
    );

const youtubeFrame =
    document.getElementById(
        "youtubeFrame"
    );

const youtubeLink =
    document.getElementById(
        "youtubeLink"
    );

const finishLessonBtn =
    document.getElementById(
        "finishLessonBtn"
    );

const questionsLocked =
    document.getElementById(
        "questionsLocked"
    );

const quizContainer =
    document.getElementById(
        "quizContainer"
    );

const quizQuestion =
    document.getElementById(
        "quizQuestion"
    );

const quizOptions =
    document.getElementById(
        "quizOptions"
    );

const quizFeedback =
    document.getElementById(
        "quizFeedback"
    );

const submitQuizAnswer =
    document.getElementById(
        "submitQuizAnswer"
    );

const nextQuizQuestion =
    document.getElementById(
        "nextQuizQuestion"
    );

const questionCounter =
    document.getElementById(
        "questionCounter"
    );

const topicResult =
    document.getElementById(
        "topicResult"
    );

const completedTopicsEl =
    document.getElementById(
        "completedTopics"
    );

const totalTopicsEl =
    document.getElementById(
        "totalTopics"
    );

const videosWatchedEl =
    document.getElementById(
        "videosWatched"
    );

const topicsPassedEl =
    document.getElementById(
        "topicsPassed"
    );

const learningXPEl =
    document.getElementById(
        "learningXP"
    );

const overallProgressEl =
    document.getElementById(
        "overallProgress"
    );

const learningProgressRing =
    document.getElementById(
        "learningProgressRing"
    );


/* =========================================
   AUTH
========================================= */

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


        await loadProgress();

        render();
    }
);


/* =========================================
   LOAD PROGRESS
========================================= */

async function loadProgress() {

    try {

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

            userData = {};

            progress = {

                watchedLessons: [],

                passedTopics: [],

                attempts: {},

                completedQuestions: {},

                xp: 0

            };

            return;
        }


        userData =
            snapshot.data();


        const saved =
            userData.aptitudeLearningProgress ||
            {};


        progress = {

            watchedLessons:
                Array.isArray(
                    saved.watchedLessons
                )
                    ? saved.watchedLessons
                    : [],

            passedTopics:
                Array.isArray(
                    saved.passedTopics
                )
                    ? saved.passedTopics
                    : [],

            attempts:
                saved.attempts &&
                typeof saved.attempts === "object"
                    ? saved.attempts
                    : {},

            completedQuestions:
                saved.completedQuestions &&
                typeof saved.completedQuestions === "object"
                    ? saved.completedQuestions
                    : {},

            xp:
                Number(
                    saved.xp
                ) || 0
        };

    } catch (error) {

        console.error(
            "Aptitude learning load error:",
            error
        );
    }
}


/* =========================================
   RENDER
========================================= */

function render() {

    totalTopicsEl.textContent =
        TOPICS.length;


    renderSidebar();

    renderTopic();

    renderStats();

    updateOverallProgress();
}


/* =========================================
   SIDEBAR
========================================= */

function renderSidebar() {

    topicList.innerHTML =
        "";


    TOPICS.forEach(
        (
            topic,
            index
        ) => {

            const unlocked =
                isTopicUnlocked(
                    index
                );


            const completed =
                progress.passedTopics.includes(
                    topic.id
                );


            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


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


            if (
                !unlocked
            ) {

                item.classList.add(
                    "locked"
                );
            }


            if (
                completed
            ) {

                item.classList.add(
                    "completed"
                );
            }


            item.innerHTML = `

                <div class="topic-number">

                    ${
                        completed
                            ? "✓"
                            : topic.number
                    }

                </div>


                <div class="topic-item-title">

                    <strong>
                        ${escapeHtml(
                            topic.title
                        )}
                    </strong>

                    <span>
                        ${
                            completed
                                ? "Completed"
                                : unlocked
                                    ? "Start lesson"
                                    : "Locked"
                        }
                    </span>

                </div>


                ${
                    completed
                        ? `
                            <span class="topic-check">
                                ✓
                            </span>
                          `
                        : ""
                }

            `;


            item.addEventListener(
                "click",
                () => {

                    if (
                        !isTopicUnlocked(
                            index
                        )
                    ) {

                        showToast(
                            "Complete the previous topic first.",
                            "error"
                        );

                        return;
                    }


                    currentTopicIndex =
                        index;


                    render();
                }
            );


            topicList.appendChild(
                item
            );
        }
    );
}


/* =========================================
   TOPIC UNLOCK
========================================= */

function isTopicUnlocked(
    index
) {

    if (
        index === 0
    ) {

        return true;
    }


    const previousTopic =
        TOPICS[
            index - 1
        ];


    return progress.passedTopics.includes(
        previousTopic.id
    );
}


/* =========================================
   RENDER TOPIC
========================================= */

function renderTopic() {

    const topic =
        TOPICS[
            currentTopicIndex
        ];


    if (!topic) {
        return;
    }


    const watched =
        progress.watchedLessons.includes(
            topic.id
        );


    const completed =
        progress.passedTopics.includes(
            topic.id
        );


    topicBadge.textContent =
        `TOPIC ${topic.number}`;


    topicTitle.textContent =
        topic.title;


    topicDescription.textContent =
        topic.description;


    youtubeFrame.src =
        `https://www.youtube.com/embed/${topic.videoId}`;


    youtubeLink.href =
        topic.youtubeUrl;


    if (completed) {

        topicStatus.textContent =
            "Completed";

        topicStatus.className =
            "status-pill completed";

    } else if (watched) {

        topicStatus.textContent =
            "Questions Unlocked";

        topicStatus.className =
            "status-pill watched";

    } else {

        topicStatus.textContent =
            "Lesson Required";

        topicStatus.className =
            "status-pill locked";
    }


    if (watched) {

        finishLessonBtn.disabled =
            true;

        finishLessonBtn.textContent =
            "Lesson Completed ✓";

    } else {

        finishLessonBtn.disabled =
            false;

        finishLessonBtn.textContent =
            "I Finished the Lesson ✓";
    }


    if (
        watched ||
        completed
    ) {

        questionsLocked.classList.add(
            "hidden"
        );

        quizContainer.classList.remove(
            "hidden"
        );


        /*
         * When switching topics,
         * reset the quiz.
         */

        startQuiz();

    } else {

        questionsLocked.classList.remove(
            "hidden"
        );

        quizContainer.classList.add(
            "hidden"
        );

        topicResult.classList.add(
            "hidden"
        );

        questionCounter.textContent =
            "0 / 5";
    }
}


/* =========================================
   FINISH LESSON
========================================= */

finishLessonBtn.addEventListener(
    "click",
    async () => {

        const topic =
            TOPICS[
                currentTopicIndex
            ];


        if (
            !progress.watchedLessons.includes(
                topic.id
            )
        ) {

            progress.watchedLessons.push(
                topic.id
            );
        }


        finishLessonBtn.disabled =
            true;


        finishLessonBtn.textContent =
            "Lesson Completed ✓";


        topicStatus.textContent =
            "Questions Unlocked";


        topicStatus.className =
            "status-pill watched";


        questionsLocked.classList.add(
            "hidden"
        );


        quizContainer.classList.remove(
            "hidden"
        );


        startQuiz();


        await saveProgress();


        renderSidebar();

        renderStats();


        showToast(
            "Lesson completed. Questions unlocked! 🎯",
            "success"
        );
    }
);


/* =========================================
   START QUIZ
========================================= */

function startQuiz() {

    const topic =
        TOPICS[
            currentTopicIndex
        ];


    currentQuestionIndex =
        0;


    selectedAnswer =
        null;


    questionSubmitted =
        false;


    sessionCorrect =
        0;


    topicResult.classList.add(
        "hidden"
    );


    renderQuizQuestion();
}


/* =========================================
   RENDER QUESTION
========================================= */

function renderQuizQuestion() {

    const topic =
        TOPICS[
            currentTopicIndex
        ];


    const questions =
        topic.questions;


    const question =
        questions[
            currentQuestionIndex
        ];


    selectedAnswer =
        null;


    questionSubmitted =
        false;


    quizQuestion.textContent =
        `${currentQuestionIndex + 1}. ${question.question}`;


    questionCounter.textContent =
        `${currentQuestionIndex + 1} / ${questions.length}`;


    quizOptions.innerHTML =
        "";


    quizFeedback.className =
        "quiz-feedback";


    quizFeedback.innerHTML =
        "";


    submitQuizAnswer.disabled =
        false;


    nextQuizQuestion.disabled =
        true;


    question.options.forEach(
        (
            option,
            index
        ) => {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "quiz-option";


            label.innerHTML = `

                <input
                    type="radio"
                    name="aptitude-learning-question"
                    value="${index}"
                >

                <span>
                    ${escapeHtml(
                        option
                    )}
                </span>
            `;


            const input =
                label.querySelector(
                    "input"
                );


            input.addEventListener(
                "change",
                () => {

                    selectedAnswer =
                        Number(
                            input.value
                        );


                    document
                        .querySelectorAll(
                            ".quiz-option"
                        )
                        .forEach(
                            optionElement =>
                                optionElement.classList.remove(
                                    "selected"
                                )
                        );


                    label.classList.add(
                        "selected"
                    );
                }
            );


            quizOptions.appendChild(
                label
            );
        }
    );
}


/* =========================================
   SUBMIT QUESTION
========================================= */

submitQuizAnswer.addEventListener(
    "click",
    async () => {

        if (
            questionSubmitted
        ) {

            return;
        }


        if (
            selectedAnswer === null
        ) {

            showToast(
                "Please select an answer.",
                "error"
            );

            return;
        }


        const topic =
            TOPICS[
                currentTopicIndex
            ];


        const question =
            topic.questions[
                currentQuestionIndex
            ];


        const correct =
            selectedAnswer ===
            question.answer;


        questionSubmitted =
            true;


        if (correct) {

            sessionCorrect +=
                1;
        }


        const questionKey =
            `${topic.id}_${question.id}`;


        progress.completedQuestions[
            questionKey
        ] =
            correct;


        showQuizFeedback(
            question,
            correct
        );


        submitQuizAnswer.disabled =
            true;


        nextQuizQuestion.disabled =
            false;


        await saveProgress();

        renderStats();
    }
);


/* =========================================
   FEEDBACK
========================================= */

function showQuizFeedback(
    question,
    correct
) {

    quizFeedback.className =
        `quiz-feedback show ${
            correct
                ? "correct"
                : "wrong"
        }`;


    if (correct) {

        quizFeedback.innerHTML = `

            <strong>
                ✅ Correct!
            </strong>

            <div>
                ${escapeHtml(
                    question.explanation
                )}
            </div>

        `;

    } else {

        quizFeedback.innerHTML = `

            <strong>
                ❌ Not quite.
            </strong>

            <div>
                Correct answer:
                <strong>
                    ${escapeHtml(
                        question.options[
                            question.answer
                        ]
                    )}
                </strong>
            </div>

            <div>
                ${escapeHtml(
                    question.explanation
                )}
            </div>

        `;
    }
}


/* =========================================
   NEXT QUESTION
========================================= */

nextQuizQuestion.addEventListener(
    "click",
    () => {

        const topic =
            TOPICS[
                currentTopicIndex
            ];


        if (
            currentQuestionIndex <
            topic.questions.length - 1
        ) {

            currentQuestionIndex +=
                1;


            renderQuizQuestion();


            return;
        }


        finishTopic();
    }
);


/* =========================================
   FINISH TOPIC
========================================= */

async function finishTopic() {

    const topic =
        TOPICS[
            currentTopicIndex
        ];


    const total =
        topic.questions.length;


    const percentage =
        Math.round(
            sessionCorrect /
            total *
            100
        );


    const passed =
        percentage >= 75;


    progress.attempts[
        topic.id
    ] = {

        score:
            sessionCorrect,

        total,

        percentage,

        passed,

        completedAt:
            new Date().toISOString()
    };


    if (
        passed &&
        !progress.passedTopics.includes(
            topic.id
        )
    ) {

        progress.passedTopics.push(
            topic.id
        );
    }


    if (passed) {

        progress.xp =
            Math.max(
                Number(
                    progress.xp
                ) || 0,

                Number(
                    progress.xp
                ) || 0
            ) + 50;


        topicResult.className =
            "topic-result";


        topicResult.innerHTML = `

            <strong>
                🎉 ${percentage}%
            </strong>

            <h3>
                Topic Passed
            </h3>

            <p>
                Great work! The next aptitude lesson
                is now unlocked.
            </p>

        `;

    } else {

        topicResult.className =
            "topic-result fail";


        topicResult.innerHTML = `

            <strong>
                ${percentage}%
            </strong>

            <h3>
                Review and Try Again
            </h3>

            <p>
                You need at least 75% to pass this topic.
                Rewatch the lesson and attempt the questions again.
            </p>

        `;
    }


    topicResult.classList.remove(
        "hidden"
    );


    await saveProgress();


    renderSidebar();

    renderStats();

    updateOverallProgress();


    showToast(
        passed
            ? "Topic passed! 🚀"
            : "Review the lesson and try again.",
        passed
            ? "success"
            : "error"
    );


    if (
        passed
    ) {

        window.scrollTo({

            top:
                document.body.scrollHeight,

            behavior:
                "smooth"
        });
    }
}


/* =========================================
   SAVE PROGRESS
========================================= */

async function saveProgress() {

    if (!currentUser) {
        return;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        await setDoc(
            userRef,
            {

                aptitudeLearningProgress: {

                    watchedLessons:
                        progress.watchedLessons,

                    passedTopics:
                        progress.passedTopics,

                    attempts:
                        progress.attempts,

                    completedQuestions:
                        progress.completedQuestions,

                    xp:
                        progress.xp,

                    updatedAt:
                        new Date().toISOString()
                }

            },
            {
                merge: true
            }
        );

    } catch (error) {

        console.error(
            "Aptitude progress save error:",
            error
        );


        showToast(
            "Progress could not be saved.",
            "error"
        );
    }
}


/* =========================================
   STATS
========================================= */

function renderStats() {

    const completed =
        progress.passedTopics.length;


    const watched =
        progress.watchedLessons.length;


    completedTopicsEl.textContent =
        completed;


    videosWatchedEl.textContent =
        watched;


    topicsPassedEl.textContent =
        completed;


    learningXPEl.textContent =
        Number(
            progress.xp
        ) || 0;


    updateOverallProgress();
}


/* =========================================
   OVERALL PROGRESS
========================================= */

function updateOverallProgress() {

    const percentage =
        Math.round(
            progress.passedTopics.length /
            TOPICS.length *
            100
        );


    overallProgressEl.textContent =
        `${percentage}%`;


    const degrees =
        percentage *
        3.6;


    learningProgressRing.style.background =
        `conic-gradient(
            #7c3aed 0deg,
            #a855f7 ${degrees}deg,
            #ece8f7 ${degrees}deg
        )`;
}


/* =========================================
   TOAST
========================================= */

let toastTimer = null;


function showToast(
    message,
    type = ""
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.className =
        `toast show ${type}`.trim();


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.className =
                    "toast";

            },
            2700
        );
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(
    value
) {

    return String(
        value
    )

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