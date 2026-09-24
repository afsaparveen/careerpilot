import {
    auth,
    db
} from "../firebase/firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
    doc,
    getDoc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =========================================================
// DOM
// =========================================================

const planDate =
    document.getElementById("planDate");

const planContainer =
    document.getElementById("planContainer");

const emptyState =
    document.getElementById("emptyState");

const planProgressText =
    document.getElementById("planProgressText");

const planProgressBar =
    document.getElementById("planProgressBar");

const dailyPlanStreak =
    document.getElementById("dailyPlanStreak");

const dailyPlanXP =
    document.getElementById("dailyPlanXP");

const generatePlanButton =
    document.getElementById("generatePlan");

const toast =
    document.getElementById("toast");


// =========================================================
// STATE
// =========================================================

let currentUser = null;

let currentUserData = {};

let currentPlan = [];

let stopUserListener = null;


// =========================================================
// APTITUDE TOPICS
// =========================================================

const aptitudeTopics = [

    {
        id: "percentage",
        title: "Percentage"
    },

    {
        id: "ratio-proportion",
        title: "Ratio & Proportion"
    },

    {
        id: "averages",
        title: "Averages"
    },

    {
        id: "time-work",
        title: "Time & Work"
    }

];


// =========================================================
// TODAY
// =========================================================

function todayKey() {

    const date =
        new Date();


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


// =========================================================
// FORMAT DATE
// =========================================================

function formatToday() {

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date()
    );

}


// =========================================================
// TOAST
// =========================================================

function showToast(
    message
) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// =========================================================
// SVG TASK ICONS
// =========================================================

function getTaskIcon(
    task
) {

    const icons = {

        career: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                ></rect>

                <path
                    d="M8 7h8"
                ></path>

                <path
                    d="M8 11h8"
                ></path>

                <path
                    d="M8 15h5"
                ></path>

            </svg>
        `,


        dsa: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <path
                    d="M8 6L2 12l6 6"
                ></path>

                <path
                    d="M16 6l6 6-6 6"
                ></path>

                <path
                    d="M14 4l-4 16"
                ></path>

            </svg>
        `,


        aptitude: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <circle
                    cx="12"
                    cy="12"
                    r="8"
                ></circle>

                <path
                    d="M8 12h8"
                ></path>

                <path
                    d="M12 8v8"
                ></path>

            </svg>
        `,


        technical: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <rect
                    x="3"
                    y="4"
                    width="18"
                    height="13"
                    rx="2"
                ></rect>

                <path
                    d="M8 21h8"
                ></path>

                <path
                    d="M12 17v4"
                ></path>

                <path
                    d="M8 9l2 2-2 2"
                ></path>

                <path
                    d="M12 13h4"
                ></path>

            </svg>
        `,


        interview: `
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <rect
                    x="4"
                    y="5"
                    width="16"
                    height="14"
                    rx="3"
                ></rect>

                <path
                    d="M9 9h6"
                ></path>

                <path
                    d="M9 13h3"
                ></path>

                <path
                    d="M8 19l-2 3"
                ></path>

                <path
                    d="M16 19l2 3"
                ></path>

            </svg>
        `

    };


    return (
        icons[task.type] ||
        icons.career
    );

}


// =========================================================
// STATUS ICON
// =========================================================

function getStatusIcon(
    completed
) {

    if (completed) {

        return `
            <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >

                <circle
                    cx="12"
                    cy="12"
                    r="9"
                ></circle>

                <path
                    d="M8 12l2.5 2.5L16 9"
                ></path>

            </svg>
        `;

    }


    return `
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >

            <circle
                cx="12"
                cy="12"
                r="9"
            ></circle>

            <path
                d="M12 7v5l3 2"
            ></path>

        </svg>
    `;

}


// =========================================================
// XP ICON
// =========================================================

function getXPIcon() {

    return `
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >

            <path
                d="
                    M12 3
                    l2.2 4.6
                    5 .7
                    -3.6 3.5
                    .9 5
                    -4.5-2.4
                    -4.5 2.4
                    .9-5
                    -3.6-3.5
                    5-.7
                    L12 3z
                "
            ></path>

        </svg>
    `;

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// GET STUDY DATES
// =========================================================

function getStudyDates() {

    if (
        Array.isArray(
            currentUserData.studyDates
        )
    ) {

        return currentUserData.studyDates;

    }


    if (
        Array.isArray(
            currentUserData.activityDates
        )
    ) {

        return currentUserData.activityDates;

    }


    return [];

}


// =========================================================
// CALCULATE STREAK
// =========================================================

function calculateStreak() {

    const dates =
        getStudyDates();


    if (
        dates.length === 0
    ) {

        return 0;

    }


    const uniqueDates =
        [
            ...new Set(
                dates
            )
        ]
            .filter(
                Boolean
            )
            .sort()
            .reverse();


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let streak = 0;


    for (
        let i = 0;
        i < uniqueDates.length;
        i++
    ) {

        const date =
            new Date(
                uniqueDates[i]
            );


        date.setHours(
            0,
            0,
            0,
            0
        );


        const expected =
            new Date(
                today
            );


        expected.setDate(
            today.getDate() -
            streak
        );


        const difference =
            Math.round(
                (
                    expected -
                    date
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (
            difference !== 0
        ) {

            break;

        }


        streak++;

    }


    return streak;

}


// =========================================================
// MARK STUDY DATE
// =========================================================

function markStudyDate() {

    const today =
        todayKey();

    const dates =
        [
            ...getStudyDates()
        ];

    if (
        !dates.includes(today)
    ) {

        dates.push(today);

    }

    dates.sort();

    currentUserData.studyDates =
        dates;
}
// =========================================================
// PROFILE TASK
// =========================================================

function getProfileTask() {

    const hasResume =
        Boolean(
            currentUserData.resumeData ||
            currentUserData.resumeExtractedText
        );


    const skills =
        currentUserData.verifiedSkills;


    const hasSkills =
        Array.isArray(
            skills
        )
            ? skills.length > 0
            : Boolean(
                skills
            );


    const projects =
        Array.isArray(
            currentUserData.projects
        )
            ? currentUserData.projects.length
            : 0;


    if (
        !hasResume
    ) {

        return {

            id:
                "resume",

            type:
                "career",

            icon:
                "📄",

            label:
                "Career Profile",

            title:
                "Build Your Resume Evidence",

            description:
                "Upload and review your resume to strengthen your placement profile.",

            action:
                "Open Resume",

            href:
                "resume.html",

            points:
                20

        };

    }


    if (
        !hasSkills
    ) {

        return {

            id:
                "skills",

            type:
                "career",

            icon:
                "✅",

            label:
                "Career Profile",

            title:
                "Verify Your Skills",

            description:
                "Review the skills detected from your profile and verify the skills you can demonstrate.",

            action:
                "Verify Skills",

            href:
                "skills.html",

            points:
                20

        };

    }


    if (
        projects === 0
    ) {

        return {

            id:
                "projects",

            type:
                "career",

            icon:
                "🚀",

            label:
                "Career Profile",

            title:
                "Add a Project",

            description:
                "Add one strong academic, personal or portfolio project.",

            action:
                "Add Project",

            href:
                "projects.html",

            points:
                25

        };

    }


    return null;

}


// =========================================================
// DSA TASK
// =========================================================

function getDSATask() {

    return {

        id:
            "dsa-practice",

        type:
            "dsa",

        icon:
            "🧩",

        label:
            "DSA Learning",

        title:
            "Practice Today's DSA Problem",

        description:
            "Open your DSA learning path and continue the current pattern with LeetCode practice.",

        action:
            "Practice DSA",

        href:
            "dsa.html",

        points:
            30

    };

}


// =========================================================
// APTITUDE TASK
// =========================================================

function getAptitudeTask() {

    const progress =
        currentUserData
            .aptitudeLearningProgress
        || {};


    const passedTopics =
        Array.isArray(
            progress.passedTopics
        )
            ? progress.passedTopics
            : [];


    const watchedLessons =
        Array.isArray(
            progress.watchedLessons
        )
            ? progress.watchedLessons
            : [];


    for (
        const topic of aptitudeTopics
    ) {

        if (
            passedTopics.includes(
                topic.id
            )
        ) {

            continue;

        }


        if (
            !watchedLessons.includes(
                topic.id
            )
        ) {

            return {

                id:
                    `aptitude-${topic.id}`,

                type:
                    "aptitude",

                icon:
                    "📚",

                label:
                    "Aptitude Learning",

                title:
                    `Learn ${topic.title}`,

                description:
                    `Study the ${topic.title} concept and understand the fundamentals.`,

                action:
                    "Open Aptitude",

                href:
                    "aptitude-learning.html",

                points:
                    20

            };

        }


        return {

            id:
                `aptitude-practice-${topic.id}`,

            type:
                "aptitude",

            icon:
                "🧠",

            label:
                "Aptitude Practice",

            title:
                `Practice ${topic.title}`,

            description:
                `Solve practice questions based on ${topic.title}.`,

            action:
                "Practice",

            href:
                "aptitude-learning.html",

            points:
                25

        };

    }


    return null;

}


// =========================================================
// TECHNICAL TASK
// =========================================================

function getTechnicalTask() {

    const dbms =
        Number(
            currentUserData
                .dbmsProgress?.percentage
            ||
            currentUserData
                .dbmsProgress?.progress
            ||
            0
        );


    const os =
        Number(
            currentUserData
                .osProgress?.percentage
            ||
            currentUserData
                .osProgress?.progress
            ||
            0
        );


    const oopData =
        currentUserData.oopProgress
        ||
        currentUserData.oopsProgress
        ||
        {};


    const oop =
        Number(
            oopData.percentage
            ||
            oopData.progress
            ||
            0
        );


    const courses = [

        {
            name:
                "DBMS",

            progress:
                dbms

        },

        {
            name:
                "Operating Systems",

            progress:
                os

        },

        {
            name:
                "OOP",

            progress:
                oop

        }

    ];


    courses.sort(
        (
            a,
            b
        ) =>
            a.progress -
            b.progress
    );


    const course =
        courses[0];


    return {

        id:
            `technical-${course.name}`,

        type:
            "technical",

        icon:
            "💻",

        label:
            "Technical Learning",

        title:
            `Continue ${course.name}`,

        description:
            `${course.name} is currently at ${course.progress}% progress. Continue with the next topic.`,

        action:
            "Open Technical",

        href:
            "technical.html",

        points:
            25

    };

}


// =========================================================
// INTERVIEW TASK
// =========================================================

function getInterviewTask() {

    const progress =
        currentUserData
            .interviewProgress
        || {};


    const attempted =
        Number(
            progress.questionsAttempted
            ||
            0
        );


    if (
        attempted < 5
    ) {

        return {

            id:
                "interview-practice",

            type:
                "interview",

            icon:
                "🎤",

            label:
                "Interview Preparation",

            title:
                "Practice an Interview Question",

            description:
                "Answer one technical, project or HR interview question.",

            action:
                "Practice Interview",

            href:
                "interview.html",

            points:
                25

        };

    }


    return {

        id:
            "interview-improve",

        type:
            "interview",

        icon:
            "🎤",

        label:
            "Interview Preparation",

        title:
            "Improve Your Interview Answers",

        description:
            "Practice structured answers and improve your interview confidence.",

        action:
            "Practice Interview",

        href:
            "interview.html",

        points:
            25

    };

}


// =========================================================
// GENERATE PLAN
// =========================================================

function generatePlan() {

    const possibleTasks = [

        getProfileTask(),

        getDSATask(),

        getAptitudeTask(),

        getTechnicalTask(),

        getInterviewTask()

    ];


    const tasks =
        possibleTasks
            .filter(
                task =>
                    task !== null
            );


    return tasks
        .slice(
            0,
            5
        )
        .map(
            task => ({

                ...task,

                completed:
                    false

            })
        );

}


// =========================================================
// KEEP COMPLETION STATUS
// =========================================================

function preserveCompletedTasks(
    oldPlan,
    newPlan
) {

    return newPlan.map(
        newTask => {

            const oldTask =
                oldPlan.find(
                    task =>
                        task.id ===
                        newTask.id
                );


            if (
                oldTask
            ) {

                return {

                    ...newTask,

                    completed:
                        oldTask.completed === true

                };

            }


            return newTask;

        }
    );

}


// =========================================================
// LOAD USER
// =========================================================

async function loadUserData() {

    if (
        !currentUser
    ) {

        return;

    }


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

    }

}


// =========================================================
// LOAD DAILY PLAN
// =========================================================

async function loadDailyPlan() {

    try {

        await loadUserData();


        const savedPlan =
            currentUserData.dailyPlan;


        if (
            savedPlan &&
            savedPlan.date ===
                todayKey() &&
            Array.isArray(
                savedPlan.tasks
            )
        ) {

            currentPlan =
                savedPlan.tasks;

        } else {

            currentPlan =
                generatePlan();


            await savePlan();

        }


        renderAll();

    } catch (
        error
    ) {

        console.error(
            "Daily Plan Error:",
            error
        );


        showToast(
            "Could not load today's plan."
        );

    }

}


// =========================================================
// SAVE PLAN
// =========================================================

async function savePlan() {

    if (!currentUser) {
        return;
    }


    const dailyPlan = {

        date:
            todayKey(),

        tasks:
            currentPlan,

        updatedAt:
            new Date()
                .toISOString()

    };


    const studyDates =
        Array.isArray(
            currentUserData.studyDates
        )
            ? currentUserData.studyDates
            : [];


    await setDoc(

        doc(
            db,
            "users",
            currentUser.uid
        ),

        {

            dailyPlan:
                dailyPlan,

            studyDates:
                studyDates

        },

        {

            merge:
                true

        }

    );


    currentUserData.dailyPlan =
        dailyPlan;

    currentUserData.studyDates =
        studyDates;

}
// =========================================================
// COMPLETE TASK
// =========================================================

async function completeTask(
    index
) {

    const task =
        currentPlan[index];


    if (
        !task ||
        task.completed
    ) {

        return;

    }


    const confirmed =
        confirm(
            `Did you complete "${task.title}"?`
        );


    if (!confirmed) {

        return;

    }


    currentPlan[index] = {

        ...task,

        completed:
            true

    };


    try {

        markStudyDate();


        await savePlan();


        renderAll();


        showToast(
            `Completed: ${task.title}`
        );

    } catch (error) {

        console.error(
            "Complete task error:",
            error
        );


        currentPlan[index] = {

            ...task,

            completed:
                false

        };


        renderAll();


        showToast(
            "Could not save your progress."
        );

    }

}

// =========================================================
// REFRESH PLAN
// =========================================================

async function refreshPlan() {

    if (
        !currentUser
    ) {

        return;

    }


    try {

        const oldPlan =
            currentPlan;


        const newPlan =
            generatePlan();


        currentPlan =
            preserveCompletedTasks(
                oldPlan,
                newPlan
            );


        await savePlan();


        renderAll();


        showToast(
            "Today's plan has been refreshed."
        );

    } catch (
        error
    ) {

        console.error(
            "Refresh error:",
            error
        );


        showToast(
            "Could not refresh the plan."
        );

    }

}


// =========================================================
// RENDER HEADER
// =========================================================

function renderHeader() {

    if (
        planDate
    ) {

        planDate.textContent =
            formatToday();

    }

}


// =========================================================
// RENDER TASKS
// =========================================================

function renderPlan() {

    if (
        !planContainer
    ) {

        return;

    }


    if (
        currentPlan.length === 0
    ) {

        planContainer.innerHTML =
            "";


        if (
            emptyState
        ) {

            emptyState.style.display =
                "block";

        }


        return;

    }


    if (
        emptyState
    ) {

        emptyState.style.display =
            "none";

    }


    planContainer.innerHTML =

        currentPlan
            .map(
                (
                    task,
                    index
                ) => {

                    const completed =
                        task.completed === true;


                    return `

                        <article
                            class="
                                daily-task-card
                                ${completed ? "completed" : ""}
                            "
                        >

                            <div
                                class="daily-task-number"
                            >

                                ${String(
                                    index + 1
                                ).padStart(
                                    2,
                                    "0"
                                )}

                            </div>


                            <div
                                class="daily-task-icon"
                                aria-hidden="true"
                            >

                                ${getTaskIcon(
                                    task
                                )}

                            </div>


                            <div
                                class="daily-task-content"
                            >

                                <span
                                    class="daily-task-label"
                                >

                                    ${escapeHtml(
                                        task.label
                                    )}

                                </span>


                                <h3>

                                    ${escapeHtml(
                                        task.title
                                    )}

                                </h3>


                                <p>

                                    ${escapeHtml(
                                        task.description
                                    )}

                                </p>


                                <div
                                    class="daily-task-meta"
                                >

                                    <span
                                        class="daily-task-status"
                                    >

                                        ${getXPIcon()}

                                        ${Number(
                                            task.points ||
                                            0
                                        )}

                                        XP

                                    </span>


                                    <span
                                        class="daily-task-status"
                                    >

                                        ${getStatusIcon(
                                            completed
                                        )}

                                        ${
                                            completed
                                                ? "Done"
                                                : "Pending"
                                        }

                                    </span>

                                </div>

                            </div>


                            <div
                                class="daily-task-actions"
                            >

                                <a
                                    class="daily-open-button"
                                    href="${escapeHtml(
                                        task.href
                                    )}"
                                >

                                    ${escapeHtml(
                                        task.action
                                    )}

                                    →

                                </a>


                                <button
                                    type="button"
                                    class="daily-complete-button"
                                    data-index="${index}"
                                    ${completed ? "disabled" : ""}
                                >

                                    ${
                                        completed
                                            ? "Completed"
                                            : "Mark Complete"
                                    }

                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join(
                ""
            );


    document
        .querySelectorAll(
            "[data-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        button.disabled =
                            true;


                        await completeTask(
                            index
                        );

                    }
                );

            }
        );

}


// =========================================================
// RENDER STATS
// =========================================================

function renderStats() {

    const total =
        currentPlan.length;


    const completed =
        currentPlan.filter(
            task =>
                task.completed === true
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    if (
        planProgressText
    ) {

        planProgressText.textContent =
            `${completed}/${total} tasks completed`;

    }


    if (
        planProgressBar
    ) {

        planProgressBar.style.width =
            `${percentage}%`;

    }


    if (
        dailyPlanStreak
    ) {

        dailyPlanStreak.textContent =
            calculateStreak();

    }


    const existingXP =
        Number(
            currentUserData.careerXP ||
            currentUserData.xp ||
            0
        );


    const todayXP =
        currentPlan
            .filter(
                task =>
                    task.completed === true
            )
            .reduce(
                (
                    total,
                    task
                ) =>
                    total +
                    Number(
                        task.points ||
                        0
                    ),
                0
            );


    if (
        dailyPlanXP
    ) {

        dailyPlanXP.textContent =
            existingXP +
            todayXP;

    }

}


// =========================================================
// RENDER ALL
// =========================================================

function renderAll() {

    renderHeader();

    renderPlan();

    renderStats();

}


// =========================================================
// LIVE FIRESTORE UPDATES
// =========================================================

function startLiveUserUpdates() {

    if (
        !currentUser
    ) {

        return;

    }


    if (
        typeof stopUserListener ===
        "function"
    ) {

        stopUserListener();

    }


    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    stopUserListener =
        onSnapshot(
            userRef,

            snapshot => {

                if (
                    !snapshot.exists()
                ) {

                    return;

                }


                currentUserData =
                    snapshot.data();


                const savedPlan =
                    currentUserData.dailyPlan;


                /*
                 * Generate the latest plan from
                 * the latest Firestore data.
                 *
                 * Keep tasks that the user has
                 * already completed today.
                 */

                if (
                    savedPlan &&
                    savedPlan.date ===
                        todayKey() &&
                    Array.isArray(
                        savedPlan.tasks
                    )
                ) {

                    const latestPlan =
                        generatePlan();


                    currentPlan =
                        preserveCompletedTasks(
                            savedPlan.tasks,
                            latestPlan
                        );

                } else {

                    currentPlan =
                        generatePlan();

                }


                renderAll();

            },

            error => {

                console.error(
                    "Daily Plan live update error:",
                    error
                );

            }
        );

}


// =========================================================
// AUTH
// =========================================================

onAuthStateChanged(
    auth,

    async user => {

        if (
            !user
        ) {

            if (
                typeof stopUserListener ===
                "function"
            ) {

                stopUserListener();

                stopUserListener =
                    null;

            }


            window.location.href =
                "login.html";


            return;

        }


        currentUser =
            user;


        await loadDailyPlan();


        startLiveUserUpdates();

    }
);


// =========================================================
// REFRESH BUTTON
// =========================================================

if (
    generatePlanButton
) {

    generatePlanButton.addEventListener(
        "click",
        refreshPlan
    );

}