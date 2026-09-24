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
   QUESTION BANK
========================================= */

const QUESTION_BANK = {

    quantitative: [

        {
            id: "q-percent-1",

            question:
                "A shirt marked at ₹800 is sold at a discount of 15%. What is the selling price?",

            options: [
                "₹650",
                "₹680",
                "₹700",
                "₹720"
            ],

            answer: 1,

            explanation:
                "15% of ₹800 is ₹120. Therefore, the selling price is ₹800 − ₹120 = ₹680."
        },


        {
            id: "q-ratio-1",

            question:
                "The ratio of two numbers is 3:5 and their sum is 64. What is the smaller number?",

            options: [
                "18",
                "21",
                "24",
                "30"
            ],

            answer: 2,

            explanation:
                "Total parts = 8. One part = 64/8 = 8. Smaller number = 3 × 8 = 24."
        },


        {
            id: "q-average-1",

            question:
                "The average of 10, 20, 30, 40 and 50 is:",

            options: [
                "25",
                "30",
                "35",
                "40"
            ],

            answer: 1,

            explanation:
                "Sum = 150. Average = 150/5 = 30."
        },


        {
            id: "q-profit-1",

            question:
                "A product is bought for ₹500 and sold for ₹575. What is the profit percentage?",

            options: [
                "10%",
                "12%",
                "15%",
                "20%"
            ],

            answer: 2,

            explanation:
                "Profit = ₹75. Profit percentage = 75/500 × 100 = 15%."
        },


        {
            id: "q-time-1",

            question:
                "A car travels 180 km in 3 hours. What is its average speed?",

            options: [
                "50 km/h",
                "55 km/h",
                "60 km/h",
                "65 km/h"
            ],

            answer: 2,

            explanation:
                "Speed = Distance / Time = 180/3 = 60 km/h."
        },


        {
            id: "q-simple-interest-1",

            question:
                "What is the simple interest on ₹2,000 at 5% per annum for 2 years?",

            options: [
                "₹100",
                "₹150",
                "₹200",
                "₹250"
            ],

            answer: 2,

            explanation:
                "SI = P × R × T / 100 = 2000 × 5 × 2 / 100 = ₹200."
        },


        {
            id: "q-work-1",

            question:
                "If a worker completes a task in 10 days at the same rate, what fraction of the task is completed in one day?",

            options: [
                "1/5",
                "1/10",
                "1/12",
                "1/20"
            ],

            answer: 1,

            explanation:
                "If the entire task takes 10 equal days, one day's work is 1/10."
        },


        {
            id: "q-fraction-1",

            question:
                "What is 25% of 240?",

            options: [
                "40",
                "50",
                "60",
                "80"
            ],

            answer: 2,

            explanation:
                "25% = 1/4. 240/4 = 60."
        }

    ],


    logical: [

        {
            id: "l-series-1",

            question:
                "Find the next number: 2, 4, 8, 16, 32, ?", 

            options: [
                "48",
                "56",
                "64",
                "72"
            ],

            answer: 2,

            explanation:
                "Each number is multiplied by 2. Therefore, the next number is 64."
        },


        {
            id: "l-series-2",

            question:
                "Find the next number: 3, 6, 11, 18, 27, ?", 

            options: [
                "36",
                "38",
                "40",
                "42"
            ],

            answer: 1,

            explanation:
                "The differences are 3, 5, 7, 9. The next difference is 11, giving 27 + 11 = 38."
        },


        {
            id: "l-odd-one-1",

            question:
                "Which is the odd one out?",

            options: [
                "Triangle",
                "Square",
                "Circle",
                "Rectangle"
            ],

            answer: 2,

            explanation:
                "Triangle, square and rectangle are polygons with straight sides. A circle has no straight sides."
        },


        {
            id: "l-direction-1",

            question:
                "A person walks 5 km north and then 5 km east. In which direction is the person from the starting point?",

            options: [
                "North-West",
                "South-East",
                "North-East",
                "South-West"
            ],

            answer: 2,

            explanation:
                "Moving north and then east places the person in the north-east direction."
        },


        {
            id: "l-coding-1",

            question:
                "If CAT is coded as DBU, how is DOG coded using the same pattern?",

            options: [
                "EPH",
                "EOG",
                "DPH",
                "FPH"
            ],

            answer: 0,

            explanation:
                "Each letter moves one position forward: D→E, O→P, G→H."
        },


        {
            id: "l-arrangement-1",

            question:
                "If A is taller than B, B is taller than C, and C is taller than D, who is the shortest?",

            options: [
                "A",
                "B",
                "C",
                "D"
            ],

            answer: 3,

            explanation:
                "The order is A > B > C > D, so D is the shortest."
        },


        {
            id: "l-analogy-1",

            question:
                "Book is to Reading as Fork is to:",

            options: [
                "Writing",
                "Eating",
                "Running",
                "Drawing"
            ],

            answer: 1,

            explanation:
                "A book is used for reading; a fork is commonly used for eating."
        },


        {
            id: "l-calendar-1",

            question:
                "If today is Monday, what day will it be after 10 days?",

            options: [
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],

            answer: 1,

            explanation:
                "10 days = 7 + 3 days. Monday + 3 days = Thursday."
        }

    ],


    verbal: [

        {
            id: "v-grammar-1",

            question:
                "Choose the grammatically correct sentence.",

            options: [
                "She don't like coffee.",
                "She doesn't likes coffee.",
                "She doesn't like coffee.",
                "She not like coffee."
            ],

            answer: 2,

            explanation:
                "With 'doesn't', the main verb remains in its base form: 'like'."
        },


        {
            id: "v-vocab-1",

            question:
                "Choose the word closest in meaning to 'rapid'.",

            options: [
                "Slow",
                "Quick",
                "Weak",
                "Late"
            ],

            answer: 1,

            explanation:
                "'Rapid' means happening quickly or at high speed."
        },


        {
            id: "v-antonym-1",

            question:
                "Choose the opposite of 'ancient'.",

            options: [
                "Old",
                "Historic",
                "Modern",
                "Traditional"
            ],

            answer: 2,

            explanation:
                "'Modern' is the opposite of 'ancient'."
        },


        {
            id: "v-fill-1",

            question:
                "Choose the correct word: 'The manager asked the team ___ the report before Friday.'",

            options: [
                "complete",
                "completed",
                "to complete",
                "completing"
            ],

            answer: 2,

            explanation:
                "The structure 'asked someone to do something' requires the infinitive 'to complete'."
        },


        {
            id: "v-synonym-1",

            question:
                "Choose the word closest in meaning to 'assist'.",

            options: [
                "Help",
                "Avoid",
                "Stop",
                "Delay"
            ],

            answer: 0,

            explanation:
                "'Assist' means to help someone."
        },


        {
            id: "v-grammar-2",

            question:
                "Choose the correct sentence.",

            options: [
                "Neither of the answers are correct.",
                "Neither of the answers is correct.",
                "Neither answers is correct.",
                "Neither answer are correct."
            ],

            answer: 1,

            explanation:
                "'Neither' is treated as singular in standard formal usage, so 'is' is used."
        },


        {
            id: "v-reading-1",

            question:
                "Choose the best completion: 'Although the task was difficult, the team ___ it successfully.'",

            options: [
                "complete",
                "completing",
                "completed",
                "completion"
            ],

            answer: 2,

            explanation:
                "The sentence is in the past tense, so 'completed' is correct."
        },


        {
            id: "v-vocab-2",

            question:
                "What does 'obvious' most nearly mean?",

            options: [
                "Hidden",
                "Clear",
                "Difficult",
                "Temporary"
            ],

            answer: 1,

            explanation:
                "'Obvious' means easy to see, understand or recognize."
        }

    ]

};


/* =========================================
   MIXED QUESTIONS
========================================= */

QUESTION_BANK.mixed = [

    ...QUESTION_BANK.quantitative.slice(
        0,
        2
    ),

    ...QUESTION_BANK.logical.slice(
        0,
        2
    ),

    ...QUESTION_BANK.verbal.slice(
        0,
        2
    ),

    {
        id: "m-ratio-1",

        question:
            "A number is increased from 80 to 100. What is the percentage increase?",

        options: [
            "20%",
            "25%",
            "30%",
            "40%"
        ],

        answer: 1,

        explanation:
            "Increase = 20. Percentage increase = 20/80 × 100 = 25%."
    },

    {
        id: "m-series-1",

        question:
            "Find the next number: 5, 10, 20, 40, ?", 

        options: [
            "60",
            "70",
            "80",
            "90"
        ],

        answer: 2,

        explanation:
            "Each number doubles, so the next number is 80."
    }

];


/* =========================================
   STATE
========================================= */

let currentUser = null;

let userData = {};

let currentCategory =
    "quantitative";

let currentQuestions = [];

let currentQuestionIndex = 0;

let selectedAnswer = null;

let answerSubmitted = false;

let sessionCorrect = 0;

let sessionAnswered = 0;


/* =========================================
   DOM
========================================= */

const targetRoleEl =
    document.getElementById("targetRole");

const overallAccuracyEl =
    document.getElementById("overallAccuracy");

const questionsSolvedEl =
    document.getElementById("questionsSolved");

const correctAnswersEl =
    document.getElementById("correctAnswers");

const aptitudeStreakEl =
    document.getElementById("aptitudeStreak");

const aptitudeXPEl =
    document.getElementById("aptitudeXP");

const categoryTitleEl =
    document.getElementById("categoryTitle");

const questionNumberEl =
    document.getElementById("questionNumber");

const questionTotalEl =
    document.getElementById("questionTotal");

const questionBadgeEl =
    document.getElementById("questionBadge");

const questionProgressBar =
    document.getElementById("questionProgressBar");

const questionTextEl =
    document.getElementById("questionText");

const optionsListEl =
    document.getElementById("optionsList");

const feedbackEl =
    document.getElementById("feedback");

const submitAnswerBtn =
    document.getElementById("submitAnswer");

const nextQuestionBtn =
    document.getElementById("nextQuestion");

const sessionTitleEl =
    document.getElementById("sessionTitle");

const sessionMessageEl =
    document.getElementById("sessionMessage");


/* =========================================
   CATEGORY NAMES
========================================= */

const categoryNames = {

    quantitative:
        "Quantitative Aptitude",

    logical:
        "Logical Reasoning",

    verbal:
        "Verbal Ability",

    mixed:
        "Mixed Practice"

};


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


        await loadAptitudeData();


        setupCategories();


        startCategory(
            "quantitative"
        );
    }
);


/* =========================================
   LOAD DATA
========================================= */

async function loadAptitudeData() {

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


        userData =
            snapshot.exists()
                ? snapshot.data()
                : {};


        renderStats();

    } catch (error) {

        console.error(
            "Aptitude loading error:",
            error
        );


        userData = {};

        renderStats();
    }
}


/* =========================================
   CATEGORY BUTTONS
========================================= */

function setupCategories() {

    const categoryButtons =
        document.querySelectorAll(
            ".category-card"
        );


    categoryButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const category =
                        button.dataset.category;


                    categoryButtons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    startCategory(
                        category
                    );
                }
            );
        }
    );
}


/* =========================================
   START CATEGORY
========================================= */

function startCategory(
    category
) {

    currentCategory =
        category;


    currentQuestions =
        shuffle(
            QUESTION_BANK[
                category
            ] || []
        );


    currentQuestionIndex =
        0;


    selectedAnswer =
        null;


    answerSubmitted =
        false;


    sessionCorrect =
        0;


    sessionAnswered =
        0;


    sessionTitleEl.textContent =
        `${categoryNames[category]} session`;


    sessionMessageEl.textContent =
        "Solve the questions and review the explanations after submitting each answer.";


    renderQuestion();
}


/* =========================================
   RENDER QUESTION
========================================= */

function renderQuestion() {

    if (
        !currentQuestions.length
    ) {

        questionTextEl.textContent =
            "No questions available.";

        return;
    }


    const question =
        currentQuestions[
            currentQuestionIndex
        ];


    selectedAnswer =
        null;


    answerSubmitted =
        false;


    questionNumberEl.textContent =
        currentQuestionIndex + 1;


    questionTotalEl.textContent =
        currentQuestions.length;


    questionBadgeEl.textContent =
        currentQuestionIndex + 1;


    categoryTitleEl.textContent =
        categoryNames[
            currentCategory
        ];


    questionTextEl.textContent =
        question.question;


    questionProgressBar.style.width =
        `${
            (
                currentQuestionIndex /
                currentQuestions.length
            ) * 100
        }%`;


    optionsListEl.innerHTML =
        "";


    feedbackEl.className =
        "question-feedback";


    feedbackEl.innerHTML =
        "";


    submitAnswerBtn.disabled =
        false;


    nextQuestionBtn.disabled =
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
                "option";


            label.innerHTML = `

                <input
                    type="radio"
                    name="aptitude-answer"
                    value="${index}"
                >

                <span class="option-text">
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
                            ".option"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "selected"
                                )
                        );


                    label.classList.add(
                        "selected"
                    );
                }
            );


            optionsListEl.appendChild(
                label
            );
        }
    );
}


/* =========================================
   SUBMIT
========================================= */

submitAnswerBtn.addEventListener(
    "click",
    async () => {

        if (
            answerSubmitted
        ) {

            return;
        }


        if (
            selectedAnswer === null
        ) {

            showToast(
                "Select an answer first.",
                "error"
            );

            return;
        }


        const question =
            currentQuestions[
                currentQuestionIndex
            ];


        const correct =
            selectedAnswer ===
            question.answer;


        answerSubmitted =
            true;


        sessionAnswered +=
            1;


        if (correct) {

            sessionCorrect +=
                1;
        }


        showFeedback(
            question,
            correct
        );


        submitAnswerBtn.disabled =
            true;


        nextQuestionBtn.disabled =
            false;


        await saveAnswer(
            question,
            correct
        );
    }
);


/* =========================================
   FEEDBACK
========================================= */

function showFeedback(
    question,
    correct
) {

    feedbackEl.className =
        `question-feedback show ${
            correct
                ? "correct"
                : "wrong"
        }`;


    if (correct) {

        feedbackEl.innerHTML = `

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

        feedbackEl.innerHTML = `

            <strong>
                ❌ Incorrect
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

nextQuestionBtn.addEventListener(
    "click",
    () => {

        if (
            currentQuestionIndex <
            currentQuestions.length - 1
        ) {

            currentQuestionIndex +=
                1;


            renderQuestion();


            return;
        }


        finishSession();
    }
);


/* =========================================
   FINISH SESSION
========================================= */

function finishSession() {

    const percentage =
        currentQuestions.length === 0
            ? 0
            : Math.round(
                sessionCorrect /
                currentQuestions.length *
                100
            );


    sessionTitleEl.textContent =
        `${categoryNames[currentCategory]} complete`;


    sessionMessageEl.textContent =
        `You answered ${sessionCorrect} of ${currentQuestions.length} correctly (${percentage}%). Choose a category above to practice again.`;


    questionProgressBar.style.width =
        "100%";


    showToast(
        `Session complete: ${percentage}%`,
        "success"
    );


    window.scrollTo({
        top:
            document.body.scrollHeight,
        behavior:
            "smooth"
    });
}


/* =========================================
   SAVE ANSWER
========================================= */

async function saveAnswer(
    question,
    correct
) {

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


        const snapshot =
            await getDoc(
                userRef
            );


        const existing =
            snapshot.exists()
                ? snapshot.data()
                : {};


        const aptitude =
            existing.aptitudeProgress ||
            {};


        const totalSolved =
            Number(
                aptitude.questionsSolved
            ) || 0;


        const totalCorrect =
            Number(
                aptitude.correctAnswers
            ) || 0;


        const newSolved =
            totalSolved + 1;


        const newCorrect =
            totalCorrect +
            (
                correct
                    ? 1
                    : 0
            );


        const accuracy =
            Math.round(
                newCorrect /
                newSolved *
                100
            );


        const answerHistory =
            Array.isArray(
                aptitude.answerHistory
            )
                ? [
                    ...aptitude.answerHistory
                ]
                : [];


        answerHistory.push({

            questionId:
                question.id,

            category:
                currentCategory,

            correct,

            answeredAt:
                new Date().toISOString()

        });


        /*
         * Keep the Firestore document
         * reasonably small.
         */

        const trimmedHistory =
            answerHistory.slice(
                -100
            );


        await setDoc(
            userRef,
            {

                aptitudeProgress: {

                    questionsSolved:
                        newSolved,

                    correctAnswers:
                        newCorrect,

                    accuracy,

                    aptitudeXP:
                        calculateAptitudeXP(
                            newSolved,
                            newCorrect
                        ),

                    answerHistory:
                        trimmedHistory,

                    lastPracticeDate:
                        getDateKey(
                            new Date()
                        )

                }

            },
            {
                merge: true
            }
        );


        userData =
            {
                ...existing,

                aptitudeProgress: {

                    ...(existing.aptitudeProgress || {}),

                    questionsSolved:
                        newSolved,

                    correctAnswers:
                        newCorrect,

                    accuracy,

                    aptitudeXP:
                        calculateAptitudeXP(
                            newSolved,
                            newCorrect
                        ),

                    answerHistory:
                        trimmedHistory,

                    lastPracticeDate:
                        getDateKey(
                            new Date()
                        )
                }
            };


        renderStats();

    } catch (error) {

        console.error(
            "Aptitude save error:",
            error
        );


        showToast(
            "Your answer could not be saved.",
            "error"
        );
    }
}


/* =========================================
   STATS
========================================= */

function renderStats() {

    const progress =
        userData.aptitudeProgress ||
        {};


    const solved =
        Number(
            progress.questionsSolved
        ) || 0;


    const correct =
        Number(
            progress.correctAnswers
        ) || 0;


    const accuracy =
        solved === 0
            ? 0
            : Math.round(
                correct /
                solved *
                100
            );


    const xp =
        Number(
            progress.aptitudeXP
        ) ||
        calculateAptitudeXP(
            solved,
            correct
        );


    targetRoleEl.textContent =
        userData.targetRole ||
        userData.careerGoal ||
        "Not set";


    questionsSolvedEl.textContent =
        solved;


    correctAnswersEl.textContent =
        correct;


    overallAccuracyEl.textContent =
        `${accuracy}%`;


    aptitudeStreakEl.textContent =
        calculateAptitudeStreak();


    aptitudeXPEl.textContent =
        xp;
}


/* =========================================
   APTITUDE XP
========================================= */

function calculateAptitudeXP(
    solved,
    correct
) {

    return (
        solved * 5 +
        correct * 10
    );
}


/* =========================================
   APTITUDE STREAK
========================================= */

function calculateAptitudeStreak() {

    const progress =
        userData.aptitudeProgress ||
        {};


    const history =
        Array.isArray(
            progress.answerHistory
        )
            ? progress.answerHistory
            : [];


    if (
        history.length === 0
    ) {

        return 0;
    }


    const dates =
        [
            ...new Set(
                history
                    .map(
                        item =>
                            getDateKey(
                                item.answeredAt
                            )
                    )
                    .filter(Boolean)
            )
        ]
            .sort()
            .reverse();


    if (
        !dates.length
    ) {

        return 0;
    }


    const today =
        getDateKey(
            new Date()
        );


    let expected =
        today;


    if (
        dates[0] !==
        today
    ) {

        expected =
            shiftDate(
                today,
                -1
            );


        if (
            dates[0] !==
            expected
        ) {

            return 0;
        }
    }


    let streak = 0;


    for (
        const date of dates
    ) {

        if (
            date !==
            expected
        ) {

            break;
        }


        streak += 1;


        expected =
            shiftDate(
                expected,
                -1
            );
    }


    return streak;
}


/* =========================================
   DATE HELPERS
========================================= */

function getDateKey(
    value
) {

    const date =
        value instanceof Date
            ? value
            : new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


function shiftDate(
    dateString,
    days
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    date.setDate(
        date.getDate() +
        days
    );


    return getDateKey(
        date
    );
}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(
    items
) {

    const copy =
        [
            ...items
        ];


    for (
        let index =
            copy.length - 1;
        index > 0;
        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (
                    index + 1
                )
            );


        [
            copy[index],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[index]
        ];
    }


    return copy;
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


    if (!toast) {
        return;
    }


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
            2500
        );
}


/* =========================================
   ESCAPE HTML
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