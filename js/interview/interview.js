import { auth, db } from "../firebase/firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// QUESTION BANK
// ======================================================

const QUESTION_BANK = {

    technical: [

        {
            question:
                "What is normalization in DBMS and why is it used?",

            keywords: [
                "normalization",
                "redundancy",
                "duplicate",
                "dependency",
                "1nf",
                "2nf",
                "3nf"
            ],

            expected:
                "Explain that normalization organizes relational data to reduce redundancy and update anomalies. Mention functional dependencies and normal forms such as 1NF, 2NF and 3NF."
        },

        {
            question:
                "What is the difference between a process and a thread?",

            keywords: [
                "process",
                "thread",
                "memory",
                "address",
                "shared",
                "independent",
                "resource"
            ],

            expected:
                "Explain that a process has its own address space and resources, while threads are execution units within a process and typically share the process resources."
        },

        {
            question:
                "Explain the TCP three-way handshake.",

            keywords: [
                "tcp",
                "three",
                "handshake",
                "syn",
                "ack",
                "sequence"
            ],

            expected:
                "Explain SYN, SYN-ACK and ACK and that the exchange establishes the connection and synchronizes sequence information between the endpoints."
        },

        {
            question:
                "What are the four pillars of object-oriented programming?",

            keywords: [
                "encapsulation",
                "inheritance",
                "polymorphism",
                "abstraction"
            ],

            expected:
                "Mention encapsulation, inheritance, polymorphism and abstraction, and briefly explain the purpose of each."
        },

        {
            question:
                "What is the difference between a stack and a queue?",

            keywords: [
                "stack",
                "queue",
                "lifo",
                "fifo",
                "push",
                "pop",
                "enqueue",
                "dequeue"
            ],

            expected:
                "Explain that a stack follows LIFO and commonly uses push/pop, while a queue follows FIFO and commonly uses enqueue/dequeue."
        },

        {
            question:
                "What is deadlock in an operating system?",

            keywords: [
                "deadlock",
                "process",
                "resource",
                "circular",
                "wait",
                "mutual",
                "hold",
                "preemption"
            ],

            expected:
                "Explain that processes can become permanently blocked while waiting for resources. Mention the four conditions: mutual exclusion, hold and wait, no preemption and circular wait."
        },

        {
            question:
                "What is polymorphism in OOP?",

            keywords: [
                "polymorphism",
                "overloading",
                "overriding",
                "runtime",
                "compile",
                "same"
            ],

            expected:
                "Explain that polymorphism allows the same interface or operation to have different behavior. Discuss overloading and overriding where appropriate."
        },

        {
            question:
                "What is an index in a database?",

            keywords: [
                "index",
                "search",
                "query",
                "lookup",
                "performance",
                "b-tree",
                "storage"
            ],

            expected:
                "Explain that an index is an additional data structure that can speed up record lookup and query operations, at the cost of storage and maintenance overhead."
        },

        {
            question:
                "What is binary search and what condition is required to use it?",

            keywords: [
                "binary",
                "search",
                "sorted",
                "middle",
                "log",
                "logarithmic",
                "divide"
            ],

            expected:
                "Explain that binary search repeatedly checks the middle element and eliminates half the search space. The collection must be sorted."
        },

        {
            question:
                "What is the difference between TCP and UDP?",

            keywords: [
                "tcp",
                "udp",
                "connection",
                "reliable",
                "unreliable",
                "ordered",
                "datagram"
            ],

            expected:
                "Explain that TCP is connection-oriented and provides reliable ordered delivery, while UDP is connectionless with lower overhead and no built-in delivery guarantee."
        }

    ],


    project: [

        {
            question:
                "Tell me about one of your projects.",

            keywords: [
                "project",
                "problem",
                "solution",
                "technology",
                "feature",
                "role",
                "result"
            ],

            expected:
                "Use a clear structure: problem, your role, technologies used, important implementation decisions, challenges and result."
        },

        {
            question:
                "What was the most difficult problem you faced in your project?",

            keywords: [
                "problem",
                "challenge",
                "debug",
                "solution",
                "issue",
                "fix",
                "result"
            ],

            expected:
                "Describe one concrete technical or project challenge, how you investigated it, the solution you implemented and the result."
        },

        {
            question:
                "Why did you choose the technologies used in your project?",

            keywords: [
                "technology",
                "choice",
                "reason",
                "performance",
                "scalable",
                "database",
                "frontend",
                "backend"
            ],

            expected:
                "Connect each major technology choice to a concrete project requirement such as development speed, maintainability, performance or scalability."
        },

        {
            question:
                "How would you improve your project if you had more time?",

            keywords: [
                "improve",
                "feature",
                "performance",
                "security",
                "testing",
                "scaling",
                "user"
            ],

            expected:
                "Identify realistic improvements such as testing, security, scalability, performance or user experience and explain why they matter."
        },

        {
            question:
                "What exactly was your contribution to the project?",

            keywords: [
                "role",
                "responsibility",
                "implemented",
                "developed",
                "designed",
                "team",
                "contribution"
            ],

            expected:
                "Clearly separate your personal contribution from team work. Mention the features or responsibilities you personally handled."
        }

    ],


    hr: [

        {
            question:
                "Tell me about yourself.",

            keywords: [
                "education",
                "skills",
                "project",
                "experience",
                "goal",
                "interest"
            ],

            expected:
                "Give a concise introduction covering your education or background, relevant skills, project or experience highlights and your career direction."
        },

        {
            question:
                "Why do you want this role?",

            keywords: [
                "role",
                "skills",
                "interest",
                "career",
                "learning",
                "contribute",
                "growth"
            ],

            expected:
                "Connect the role to your skills, interests, career goals and the type of work you want to learn and contribute to."
        },

        {
            question:
                "What is one strength that will help you in this role?",

            keywords: [
                "strength",
                "example",
                "problem",
                "team",
                "learning",
                "communication",
                "adapt"
            ],

            expected:
                "State one specific strength and support it with a real example showing how that strength helped you solve a problem or achieve a result."
        },

        {
            question:
                "Tell me about a weakness you are working on.",

            keywords: [
                "weakness",
                "improve",
                "learning",
                "practice",
                "plan",
                "progress",
                "feedback"
            ],

            expected:
                "Choose a genuine but manageable development area, then explain the concrete steps you are taking to improve it."
        },

        {
            question:
                "Where do you see yourself in the next few years?",

            keywords: [
                "goal",
                "career",
                "learning",
                "skills",
                "responsibility",
                "growth",
                "contribute"
            ],

            expected:
                "Describe a realistic career direction focused on building skills, taking responsibility and contributing effectively."
        }

    ],


    mock: [

        {
            question:
                "Explain the difference between SQL DELETE, TRUNCATE and DROP.",

            keywords: [
                "delete",
                "truncate",
                "drop",
                "row",
                "table",
                "rollback",
                "structure"
            ],

            expected:
                "Explain that DELETE removes selected rows, TRUNCATE removes all rows while retaining the table structure, and DROP removes the table structure itself."
        },

        {
            question:
                "Explain how a browser reaches a website after a URL is entered.",

            keywords: [
                "url",
                "dns",
                "ip",
                "http",
                "https",
                "browser",
                "server",
                "request"
            ],

            expected:
                "Describe URL parsing, DNS resolution, connection establishment, the HTTP/HTTPS request and response, and browser rendering."
        },

        {
            question:
                "How would you optimize a slow application?",

            keywords: [
                "profile",
                "measure",
                "database",
                "query",
                "cache",
                "algorithm",
                "network",
                "performance"
            ],

            expected:
                "Start by measuring the bottleneck, then optimize the relevant layer such as algorithms, database queries, caching, network requests or rendering."
        },

        {
            question:
                "What is the difference between authentication and authorization?",

            keywords: [
                "authentication",
                "authorization",
                "identity",
                "permission",
                "access",
                "login",
                "role"
            ],

            expected:
                "Authentication verifies identity, while authorization determines what an authenticated user is allowed to access or do."
        },

        {
            question:
                "Describe a situation where you had to learn something quickly.",

            keywords: [
                "learn",
                "problem",
                "research",
                "practice",
                "apply",
                "result",
                "feedback"
            ],

            expected:
                "Explain the situation, what you needed to learn, how you learned it, how you applied it and what the result was."
        },

        {
            question:
                "How would you handle a disagreement with a teammate?",

            keywords: [
                "listen",
                "discuss",
                "evidence",
                "team",
                "solution",
                "communication",
                "feedback"
            ],

            expected:
                "Explain how you would listen to the other perspective, discuss the issue objectively, use evidence where possible and work toward a shared solution."
        }

    ]

};


// ======================================================
// DOM
// ======================================================

const targetRoleEl =
    document.getElementById(
        "targetRole"
    );

const questionsAttemptedEl =
    document.getElementById(
        "questionsAttempted"
    );

const strongAnswersEl =
    document.getElementById(
        "strongAnswers"
    );

const interviewAccuracyEl =
    document.getElementById(
        "interviewAccuracy"
    );

const statQuestionsEl =
    document.getElementById(
        "statQuestions"
    );

const statStrongEl =
    document.getElementById(
        "statStrong"
    );

const statAccuracyEl =
    document.getElementById(
        "statAccuracy"
    );

const interviewXPEl =
    document.getElementById(
        "interviewXP"
    );

const categoryTitleEl =
    document.getElementById(
        "categoryTitle"
    );

const questionNumberEl =
    document.getElementById(
        "questionNumber"
    );

const questionTotalEl =
    document.getElementById(
        "questionTotal"
    );

const questionProgressBarEl =
    document.getElementById(
        "questionProgressBar"
    );

const questionBadgeEl =
    document.getElementById(
        "questionBadge"
    );

const questionTextEl =
    document.getElementById(
        "questionText"
    );

const answerInputEl =
    document.getElementById(
        "answerInput"
    );

const submitAnswerButton =
    document.getElementById(
        "submitAnswer"
    );

const nextQuestionButton =
    document.getElementById(
        "nextQuestion"
    );

const feedbackPanel =
    document.getElementById(
        "feedbackPanel"
    );

const answerScoreEl =
    document.getElementById(
        "answerScore"
    );

const scoreMessageEl =
    document.getElementById(
        "scoreMessage"
    );

const matchedConceptsEl =
    document.getElementById(
        "matchedConcepts"
    );

const missingConceptsEl =
    document.getElementById(
        "missingConcepts"
    );

const feedbackTextEl =
    document.getElementById(
        "feedbackText"
    );

const expectedAnswerEl =
    document.getElementById(
        "expectedAnswer"
    );

const historyListEl =
    document.getElementById(
        "historyList"
    );

const toastEl =
    document.getElementById(
        "toast"
    );


// ======================================================
// STATE
// ======================================================

let currentUser = null;

let currentUserData = {};

let currentCategory =
    "technical";

let currentQuestions = [];

let currentQuestionIndex = 0;

let questionAnswered = false;


// ======================================================
// HELPERS
// ======================================================

function showToast(message) {

    if (!toastEl) {
        return;
    }

    toastEl.textContent =
        message;

    toastEl.classList.add(
        "show"
    );

    setTimeout(
        () => {

            toastEl.classList.remove(
                "show"
            );

        },
        2500
    );
}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function shuffle(array) {

    const copy =
        [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];
    }

    return copy;
}


function getCategoryName(
    category
) {

    const names = {

        technical:
            "Technical Interview",

        project:
            "Project Interview",

        hr:
            "HR Interview",

        mock:
            "Mock Interview"

    };

    return (
        names[category] ||
        "Interview"
    );
}


// ======================================================
// INITIALIZE QUESTIONS
// ======================================================

function loadCategory(
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

    currentQuestionIndex = 0;

    questionAnswered = false;

    renderCategory();

    renderQuestion();

    hideFeedback();
}


function renderCategory() {

    if (categoryTitleEl) {

        categoryTitleEl.textContent =
            getCategoryName(
                currentCategory
            );
    }


    if (questionTotalEl) {

        questionTotalEl.textContent =
            currentQuestions.length;
    }
}


// ======================================================
// RENDER QUESTION
// ======================================================

function renderQuestion() {

    if (
        currentQuestions.length === 0
    ) {
        return;
    }


    const question =
        currentQuestions[
            currentQuestionIndex
        ];


    const questionNumber =
        currentQuestionIndex + 1;


    if (questionNumberEl) {

        questionNumberEl.textContent =
            questionNumber;
    }


    if (questionBadgeEl) {

        questionBadgeEl.textContent =
            questionNumber;
    }


    if (questionTotalEl) {

        questionTotalEl.textContent =
            currentQuestions.length;
    }


    if (questionTextEl) {

        questionTextEl.textContent =
            question.question;
    }


    if (answerInputEl) {

        answerInputEl.value =
            "";

        answerInputEl.disabled =
            false;
    }


    if (submitAnswerButton) {

        submitAnswerButton.disabled =
            false;

        submitAnswerButton.textContent =
            "Evaluate Answer";
    }


    if (nextQuestionButton) {

        nextQuestionButton.disabled =
            true;
    }


    questionAnswered =
        false;


    if (questionProgressBarEl) {

        const percentage =
            (
                questionNumber /
                currentQuestions.length
            ) * 100;

        questionProgressBarEl.style.width =
            `${percentage}%`;
    }


    hideFeedback();
}


// ======================================================
// FEEDBACK
// ======================================================

function hideFeedback() {

    if (!feedbackPanel) {
        return;
    }

    feedbackPanel.classList.add(
        "hidden"
    );
}


function showFeedback(
    evaluation
) {

    if (!feedbackPanel) {
        return;
    }


    feedbackPanel.classList.remove(
        "hidden"
    );


    if (answerScoreEl) {

        answerScoreEl.textContent =
            `${evaluation.score}/100`;
    }


    if (scoreMessageEl) {

        scoreMessageEl.textContent =
            evaluation.message;
    }


    if (matchedConceptsEl) {

        matchedConceptsEl.textContent =
            evaluation.matched.length > 0
                ? evaluation.matched.join(
                    ", "
                )
                : "None detected";
    }


    if (missingConceptsEl) {

        missingConceptsEl.textContent =
            evaluation.missing.length > 0
                ? evaluation.missing.join(
                    ", "
                )
                : "No major concepts missing";
    }


    if (feedbackTextEl) {

        feedbackTextEl.textContent =
            evaluation.feedback;
    }


    if (expectedAnswerEl) {

        expectedAnswerEl.textContent =
            evaluation.expected;
    }


    feedbackPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ======================================================
// EVALUATION
// ======================================================

function evaluateAnswer(
    question,
    answer
) {

    const normalized =
        String(answer || "")
            .toLowerCase()
            .trim();


    if (!normalized) {

        return {

            score: 0,

            matched: [],

            missing:
                question.keywords,

            message:
                "No answer",

            feedback:
                "Provide a complete answer before evaluating it.",

            expected:
                question.expected

        };
    }


    const matched =
        question.keywords.filter(
            keyword =>
                normalized.includes(
                    keyword.toLowerCase()
                )
        );


    const missing =
        question.keywords.filter(
            keyword =>
                !normalized.includes(
                    keyword.toLowerCase()
                )
        );


    const keywordScore =
        (
            matched.length /
            question.keywords.length
        ) * 100;


    const lengthBonus =
        normalized.length >= 180
            ? 10
            : normalized.length >= 100
                ? 5
                : 0;


    const sentenceBonus =
        normalized.includes(".") &&
        normalized.includes(" ")
            ? 5
            : 0;


    let score =
        Math.round(
            Math.min(
                100,
                keywordScore +
                lengthBonus +
                sentenceBonus
            )
        );


    /*
        Avoid giving an apparently strong score
        to extremely short answers.
    */

    if (
        normalized.length < 40
    ) {

        score =
            Math.min(
                score,
                35
            );
    }


    let message;
    let feedback;


    if (score >= 80) {

        message =
            "Strong answer";

        feedback =
            "Your answer covers most of the expected concepts. Keep the same structure and support important points with examples when appropriate.";

    } else if (score >= 60) {

        message =
            "Good answer";

        feedback =
            "Your answer contains several relevant concepts. Strengthen it by covering the missing concepts and making the explanation more structured.";

    } else if (score >= 40) {

        message =
            "Needs improvement";

        feedback =
            "You have some relevant points, but the response needs more technical detail, clearer structure and stronger coverage of the expected concepts.";

    } else {

        message =
            "Needs more preparation";

        feedback =
            "Review the topic and try answering again using a simple structure: definition, explanation, example and conclusion where appropriate.";
    }


    return {

        score,

        matched,

        missing,

        message,

        feedback,

        expected:
            question.expected

    };
}


// ======================================================
// LOAD USER PROGRESS
// ======================================================

async function loadUserProgress() {

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


        if (
            snapshot.exists()
        ) {

            currentUserData =
                snapshot.data();

        } else {

            currentUserData =
                {};
        }


        renderUserStats();

        renderHistory();


    } catch (error) {

        console.error(
            "Interview progress loading error:",
            error
        );
    }
}


// ======================================================
// SAVE RESULT
// ======================================================

async function saveInterviewResult(
    question,
    evaluation
) {

    const existing =
        currentUserData
            .interviewProgress ||
        {};


    const oldQuestions =
        Number(
            existing.questionsAttempted ||
            0
        );


    const oldStrong =
        Number(
            existing.strongAnswers ||
            0
        );


    const oldXP =
        Number(
            existing.interviewXP ||
            0
        );


    const answerHistory =
        Array.isArray(
            existing.answerHistory
        )
            ? [
                ...existing.answerHistory
            ]
            : [];


    const isStrong =
        evaluation.score >= 60;


    if (isStrong) {
        answerHistory.push({
            category:
                currentCategory,

            question:
                question.question,

            score:
                evaluation.score,

            passed:
                true,

            attemptedAt:
                new Date()
                    .toISOString()
        });
    } else {
        answerHistory.push({
            category:
                currentCategory,

            question:
                question.question,

            score:
                evaluation.score,

            passed:
                false,

            attemptedAt:
                new Date()
                    .toISOString()
        });
    }


    /*
        Keep only the latest 30 attempts.
    */

    const trimmedHistory =
        answerHistory.slice(-30);


    const questionsAttempted =
        oldQuestions + 1;


    const strongAnswers =
        oldStrong +
        (
            isStrong
                ? 1
                : 0
        );


    const accuracy =
        Math.round(
            (
                strongAnswers /
                questionsAttempted
            ) * 100
        );


    const xpEarned =
        evaluation.score >= 80
            ? 25
            : evaluation.score >= 60
                ? 15
                : 5;


    const interviewXP =
        oldXP +
        xpEarned;


    const interviewProgress = {

        questionsAttempted,

        strongAnswers,

        accuracy,

        interviewXP,

        answerHistory:
            trimmedHistory,

        lastPracticeDate:
            new Date()
                .toISOString()

    };


    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    await setDoc(
        userRef,
        {
            interviewProgress
        },
        {
            merge: true
        }
    );


    currentUserData = {

        ...currentUserData,

        interviewProgress

    };


    renderUserStats();
    renderHistory();


    return xpEarned;
}


// ======================================================
// RENDER STATS
// ======================================================

function renderUserStats() {

    const progress =
        currentUserData
            .interviewProgress ||
        {};


    const attempted =
        Number(
            progress.questionsAttempted ||
            0
        );


    const strong =
        Number(
            progress.strongAnswers ||
            0
        );


    const accuracy =
        Number(
            progress.accuracy ||
            0
        );


    const xp =
        Number(
            progress.interviewXP ||
            0
        );


    if (questionsAttemptedEl) {

        questionsAttemptedEl.textContent =
            attempted;
    }


    if (strongAnswersEl) {

        strongAnswersEl.textContent =
            strong;
    }


    if (interviewAccuracyEl) {

        interviewAccuracyEl.textContent =
            `${accuracy}%`;
    }


    if (statQuestionsEl) {

        statQuestionsEl.textContent =
            attempted;
    }


    if (statStrongEl) {

        statStrongEl.textContent =
            strong;
    }


    if (statAccuracyEl) {

        statAccuracyEl.textContent =
            `${accuracy}%`;
    }


    if (interviewXPEl) {

        interviewXPEl.textContent =
            xp;
    }


    if (targetRoleEl) {

        targetRoleEl.textContent =
            currentUserData.targetRole ||
            currentUserData.careerGoal ||
            "Not selected";
    }
}


// ======================================================
// HISTORY
// ======================================================

function renderHistory() {

    if (!historyListEl) {
        return;
    }


    const history =
        currentUserData
            .interviewProgress
            ?.answerHistory || [];


    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        historyListEl.innerHTML = `

            <div class="empty-history">

                <div>
                    🎤
                </div>

                <p>
                    No interview questions attempted yet.
                </p>

            </div>

        `;

        return;
    }


    const recent =
        [...history]
            .reverse()
            .slice(0, 8);


    historyListEl.innerHTML =
        recent
            .map(
                item => {

                    const score =
                        Number(
                            item.score || 0
                        );


                    return `
                        <div
                            class="history-item"
                        >

                            <div
                                class="history-score"
                            >
                                ${score}
                            </div>


                            <div
                                class="history-question"
                            >

                                <strong>
                                    ${escapeHtml(
                                        item.question
                                    )}
                                </strong>

                                <span>
                                    ${
                                        item.passed
                                            ? "Strong answer"
                                            : "Needs improvement"
                                    }
                                </span>

                            </div>


                            <span
                                class="history-category"
                            >
                                ${escapeHtml(
                                    getCategoryName(
                                        item.category
                                    )
                                )}
                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


// ======================================================
// SUBMIT ANSWER
// ======================================================

if (
    submitAnswerButton
) {

    submitAnswerButton.addEventListener(
        "click",
        async () => {

            if (
                questionAnswered
            ) {
                return;
            }


            const answer =
                answerInputEl
                    ?.value
                    ?.trim() ||
                "";


            if (
                answer.length < 10
            ) {

                showToast(
                    "Write a more complete answer first."
                );

                return;
            }


            const question =
                currentQuestions[
                    currentQuestionIndex
                ];


            const evaluation =
                evaluateAnswer(
                    question,
                    answer
                );


            try {

                submitAnswerButton.disabled =
                    true;

                answerInputEl.disabled =
                    true;


                showFeedback(
                    evaluation
                );


                const xpEarned =
                    await saveInterviewResult(
                        question,
                        evaluation
                    );


                if (
                    nextQuestionButton
                ) {

                    nextQuestionButton.disabled =
                        false;
                }


                questionAnswered =
                    true;


                showToast(
                    `Answer evaluated. +${xpEarned} XP`
                );


            } catch (error) {

                console.error(
                    "Interview answer save error:",
                    error
                );


                submitAnswerButton.disabled =
                    false;

                answerInputEl.disabled =
                    false;


                showToast(
                    "Could not save your interview result."
                );
            }

        }
    );
}


// ======================================================
// NEXT QUESTION
// ======================================================

if (
    nextQuestionButton
) {

    nextQuestionButton.addEventListener(
        "click",
        () => {

            if (
                currentQuestionIndex <
                currentQuestions.length - 1
            ) {

                currentQuestionIndex +=
                    1;

                renderQuestion();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                /*
                    Restart the same category with
                    a newly shuffled order.
                */

                currentQuestions =
                    shuffle(
                        QUESTION_BANK[
                            currentCategory
                        ] || []
                    );

                currentQuestionIndex =
                    0;

                renderQuestion();

                showToast(
                    "New question set started."
                );
            }

        }
    );
}


// ======================================================
// CATEGORY BUTTONS
// ======================================================

document
    .querySelectorAll(
        ".category-tab"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-tab"
                        )
                        .forEach(
                            tab =>
                                tab.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    loadCategory(
                        button.dataset.category
                    );

                }
            );

        }
    );


// ======================================================
// AUTH
// ======================================================

auth.onAuthStateChanged(
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser =
            user;


        await loadUserProgress();


        loadCategory(
            "technical"
        );

    }
);