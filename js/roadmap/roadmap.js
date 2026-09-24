import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let currentUser = null;
let userData = {};


/* =========================================
   DOM
========================================= */

const targetRoleEl =
    document.getElementById("targetRole");

const overallProgressEl =
    document.getElementById("overallProgress");

const roadmapRing =
    document.getElementById("roadmapRing");

const resumeProgressEl =
    document.getElementById("resumeProgress");

const skillsProgressEl =
    document.getElementById("skillsProgress");

const projectsProgressEl =
    document.getElementById("projectsProgress");

const careerXPEl =
    document.getElementById("careerXP");

const roadmapList =
    document.getElementById("roadmapList");

const technicalProgress =
    document.getElementById("technicalProgress");

const nextActionTitle =
    document.getElementById("nextActionTitle");

const nextActionText =
    document.getElementById("nextActionText");

const nextActionButton =
    document.getElementById("nextActionButton");


/* =========================================
   CURRICULUM SOURCES
========================================= */

const courseSources = [

    {
        id: "dsa-learning",
        name: "DSA Learning",
        file: "../data/dsa-curriculum.json",
        progressKey: "dsaLearningProgress"
    },

    {
        id: "dbms",
        name: "DBMS",
        file: "../data/dbms-curriculum.json",
        progressKey: "dbmsProgress"
    },

    {
        id: "os",
        name: "Operating Systems",
        file: "../data/os-curriculum.json",
        progressKey: "osProgress"
    },

    {
        id: "oops",
        name: "OOP",
        file: "../data/oops-curriculum.json",
        progressKey: "oopsProgress"
    }

];


/* =========================================
   ROADMAP STAGES
========================================= */

const roadmapStages = [

    {
        id: "profile",

        number: "01",

        title: "Build Your Profile",

        description:
            "Set your target role and complete your core career profile information.",

        meta:
            [
                "Target role",
                "Profile"
            ]
    },

    {
        id: "resume",

        number: "02",

        title: "Resume Evidence",

        description:
            "Analyze your resume and build structured evidence from your experience, education and skills.",

        meta:
            [
                "Resume audit",
                "Career evidence"
            ]
    },

    {
        id: "skills",

        number: "03",

        title: "Verify Your Skills",

        description:
            "Review skills detected from your resume and explicitly verify the skills you want in your profile.",

        meta:
            [
                "Skill verification",
                "Technical profile"
            ]
    },

    {
        id: "projects",

        number: "04",

        title: "Build Project Evidence",

        description:
            "Add projects and connect them with the technical skills you have verified.",

        meta:
            [
                "Projects",
                "GitHub",
                "Evidence"
            ]
    },

    {
        id: "dsa",

        number: "05",

        title: "Master DSA",

        description:
            "Complete structured DSA learning and strengthen your problem-solving foundation.",

        meta:
            [
                "37 topics",
                "Assessments"
            ]
    },

    {
        id: "technical",

        number: "06",

        title: "Build Technical Foundations",

        description:
            "Progress through DBMS, Operating Systems and OOP technical preparation.",

        meta:
            [
                "DBMS",
                "OS",
                "OOP"
            ]
    },

    {
        id: "interview",

        number: "07",

        title: "Interview Preparation",

        description:
            "Practice technical explanations, HR questions and interview scenarios.",

        meta:
            [
                "Technical",
                "HR",
                "Communication"
            ]
    },

    {
        id: "placement",

        number: "08",

        title: "Placement Readiness",

        description:
            "Bring your profile, evidence, learning and interview preparation together.",

        meta:
            [
                "Career profile",
                "Readiness"
            ]
    }

];


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

        currentUser = user;

        await loadRoadmap();
    }
);


/* =========================================
   LOAD
========================================= */

async function loadRoadmap() {

    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        const snapshot =
            await getDoc(userRef);


        userData =
            snapshot.exists()
                ? snapshot.data()
                : {};


        const courses =
            await loadCourses();


        renderBasicSummary();

        renderRoadmap(
            courses
        );

        renderTechnical(
            courses
        );

        renderOverallProgress(
            courses
        );

        renderNextAction(
            courses
        );


    } catch (error) {

        console.error(
            "Roadmap loading error:",
            error
        );

        renderBasicSummary();

        renderEmptyRoadmap();
    }
}


/* =========================================
   LOAD COURSES
========================================= */

async function loadCourses() {

    const results = [];


    for (
        const source
        of courseSources
    ) {

        try {

            const response =
                await fetch(
                    source.file
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            const curriculum =
                await response.json();


            const progress =
                userData[
                    source.progressKey
                ] || {};


            const total =
                countCurriculumUnits(
                    curriculum
                );


            const completed =
                countCompletedUnits(
                    progress
                );


            const percentage =
                total === 0
                    ? 0
                    : Math.min(
                        100,
                        Math.round(
                            completed /
                            total *
                            100
                        )
                    );


            results.push({

                ...source,

                curriculum,

                progress,

                total,

                completed,

                percentage,

                unavailable: false

            });


        } catch (error) {

            console.warn(
                `${source.name} unavailable:`,
                error
            );


            results.push({

                ...source,

                curriculum: null,

                progress:
                    userData[
                        source.progressKey
                    ] || {},

                total: 0,

                completed: 0,

                percentage: 0,

                unavailable: true

            });
        }
    }


    return results;
}


/* =========================================
   BASIC SUMMARY
========================================= */

function renderBasicSummary() {

    targetRoleEl.textContent =
        userData.targetRole ||
        userData.careerGoal ||
        "Not set";


    const resumeScore =
        Number(
            userData.resumeData?.score
        );


    const safeResumeScore =
        Number.isFinite(
            resumeScore
        )
            ? Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        resumeScore
                    )
                )
            )
            : 0;


    resumeProgressEl.textContent =
        `${safeResumeScore}%`;


    skillsProgressEl.textContent =
        getVerifiedSkills().length;


    projectsProgressEl.textContent =
        getProjects().length;


    careerXPEl.textContent =
        getCareerXP();
}


/* =========================================
   VERIFIED SKILLS
========================================= */

function getVerifiedSkills() {

    const verification =
        userData.skillVerification || {};


    if (
        Array.isArray(
            verification.verifiedSkills
        )
    ) {

        return uniqueStrings(
            verification.verifiedSkills
        );
    }


    if (
        userData.verifiedSkills &&
        typeof userData.verifiedSkills === "object"
    ) {

        return uniqueStrings(
            Object.entries(
                userData.verifiedSkills
            )
                .filter(
                    ([, value]) =>
                        value === true
                )
                .map(
                    ([skill]) =>
                        skill
                )
        );
    }


    if (
        Array.isArray(
            userData.verifiedSkills
        )
    ) {

        return uniqueStrings(
            userData.verifiedSkills
        );
    }


    return [];
}


/* =========================================
   PROJECTS
========================================= */

function getProjects() {

    return Array.isArray(
        userData.projects
    )
        ? userData.projects
        : [];
}


/* =========================================
   ROADMAP
========================================= */

function renderRoadmap(
    courses
) {

    roadmapList.innerHTML = "";


    const stages =
        getStageStates(
            courses
        );


    stages.forEach(
        stage => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "roadmap-card";


            if (stage.completed) {

                card.classList.add(
                    "completed"
                );
            }


            if (stage.locked) {

                card.classList.add(
                    "locked"
                );
            }


            const statusClass =
                stage.completed
                    ? "complete"
                    : stage.locked
                        ? "locked"
                        : "progress";


            const statusText =
                stage.completed
                    ? "Completed"
                    : stage.locked
                        ? "Locked"
                        : "In Progress";


            card.innerHTML = `

                <div class="roadmap-number">

                    ${
                        stage.completed
                            ? "✓"
                            : escapeHtml(
                                stage.number
                            )
                    }

                </div>


                <div class="roadmap-content">

                    <h3>
                        ${escapeHtml(
                            stage.title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            stage.description
                        )}
                    </p>


                    <div class="roadmap-meta">

                        ${
                            stage.meta
                                .map(
                                    item =>
                                        `
                                        <span>
                                            ${escapeHtml(item)}
                                        </span>
                                        `
                                )
                                .join("")
                        }

                    </div>

                </div>


                <div class="roadmap-status">

                    <span
                        class="status-label ${statusClass}"
                    >
                        ${statusText}
                    </span>


                    <div class="stage-progress">
                        ${stage.percentage}%
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    if (
                        stage.link &&
                        !stage.locked
                    ) {

                        window.location.href =
                            stage.link;
                    }
                }
            );


            if (
                stage.link &&
                !stage.locked
            ) {

                card.style.cursor =
                    "pointer";
            }


            roadmapList.appendChild(
                card
            );
        }
    );
}


/* =========================================
   STAGE STATES
========================================= */

function getStageStates(
    courses
) {

    const profileComplete =
        Boolean(
            userData.targetRole ||
            userData.careerGoal
        );


    const resumeScore =
        Number(
            userData.resumeData?.score
        ) || 0;


    const resumeComplete =
        Boolean(
            userData.resumeData
        );


    const skills =
        getVerifiedSkills();


    const skillsComplete =
        skills.length > 0;


    const projects =
        getProjects();


    const projectsComplete =
        projects.length > 0;


    const dsa =
        getCourse(
            courses,
            "dsa-learning"
        );


    const dsaPercent =
        dsa?.percentage || 0;


    const dsaComplete =
        dsaPercent >= 100;


    const technicalCourses =
        courses.filter(
            course =>
                [
                    "dbms",
                    "os",
                    "oops"
                ].includes(
                    course.id
                )
        );


    const technicalPercent =
        technicalCourses.length
            ? Math.round(
                technicalCourses.reduce(
                    (
                        total,
                        course
                    ) =>
                        total +
                        course.percentage,
                    0
                ) /
                technicalCourses.length
            )
            : 0;


    const technicalComplete =
        technicalPercent >= 100;


    /*
     * Interview is considered available
     * after the core technical foundation
     * reaches 50%.
     */

    const interviewAvailable =
        technicalPercent >= 50;


    /*
     * Final placement readiness:
     *
     * profile
     * resume
     * skills
     * projects
     * DSA
     * technical
     * interview availability
     */

    const placementPercent =
        Math.round(
            average([
                profileComplete
                    ? 100
                    : 0,

                resumeScore,

                skillsComplete
                    ? 100
                    : 0,

                projectsComplete
                    ? 100
                    : 0,

                dsaPercent,

                technicalPercent,

                interviewAvailable
                    ? 50
                    : 0
            ])
        );


    return [

        {
            ...roadmapStages[0],

            percentage:
                profileComplete
                    ? 100
                    : 0,

            completed:
                profileComplete,

            locked:
                false,

            link:
                "onboarding.html"
        },


        {
            ...roadmapStages[1],

            percentage:
                resumeScore,

            completed:
                resumeComplete,

            locked:
                !profileComplete,

            link:
                "resume.html"
        },


        {
            ...roadmapStages[2],

            percentage:
                skillsComplete
                    ? 100
                    : 0,

            completed:
                skillsComplete,

            locked:
                !resumeComplete,

            link:
                "skills.html"
        },


        {
            ...roadmapStages[3],

            percentage:
                projectsComplete
                    ? 100
                    : 0,

            completed:
                projectsComplete,

            locked:
                !skillsComplete,

            link:
                "projects.html"
        },


        {
            ...roadmapStages[4],

            percentage:
                dsaPercent,

            completed:
                dsaComplete,

            locked:
                !projectsComplete,

            link:
                "dsa-learning.html"
        },


        {
            ...roadmapStages[5],

            percentage:
                technicalPercent,

            completed:
                technicalComplete,

            locked:
                !dsaComplete,

            link:
                "technical.html"
        },


        {
            ...roadmapStages[6],

            percentage:
                interviewAvailable
                    ? 50
                    : 0,

            completed:
                false,

            locked:
                !interviewAvailable,

            link:
                "interview.html"
        },


        {
            ...roadmapStages[7],

            percentage:
                placementPercent,

            completed:
                placementPercent >= 100,

            locked:
                !interviewAvailable,

            link:
                "progress.html"
        }

    ];
}


/* =========================================
   TECHNICAL PROGRESS
========================================= */

function renderTechnical(
    courses
) {

    technicalProgress.innerHTML = "";


    const ids = [
        "dbms",
        "os",
        "oops"
    ];


    ids.forEach(
        id => {

            const course =
                getCourse(
                    courses,
                    id
                );


            if (!course) {
                return;
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "technical-card";


            card.innerHTML = `

                <div
                    class="technical-card-top"
                >

                    <h3>
                        ${escapeHtml(
                            course.name
                        )}
                    </h3>

                    <span
                        class="technical-percent"
                    >
                        ${course.percentage}%
                    </span>

                </div>


                <div class="technical-bar">

                    <div
                        class="technical-fill"
                        style="width:${course.percentage}%"
                    ></div>

                </div>


                <p>
                    ${course.completed}
                    / ${course.total}
                    learning units completed
                </p>

            `;


            technicalProgress.appendChild(
                card
            );
        }
    );
}


/* =========================================
   OVERALL PROGRESS
========================================= */

function renderOverallProgress(
    courses
) {

    const values = [];


    const resumeScore =
        Number(
            userData.resumeData?.score
        );


    values.push(
        Number.isFinite(
            resumeScore
        )
            ? resumeScore
            : 0
    );


    values.push(
        getVerifiedSkills().length > 0
            ? 100
            : 0
    );


    values.push(
        getProjects().length > 0
            ? 100
            : 0
    );


    courses.forEach(
        course => {

            if (
                !course.unavailable &&
                course.total > 0
            ) {

                values.push(
                    course.percentage
                );
            }
        }
    );


    const percentage =
        Math.round(
            average(values)
        );


    overallProgressEl.textContent =
        `${percentage}%`;


    updateRing(
        percentage
    );
}


function updateRing(
    percentage
) {

    const degrees =
        Math.round(
            percentage * 3.6
        );


    roadmapRing.style.background =
        `conic-gradient(
            #7c3aed 0deg,
            #a855f7 ${degrees}deg,
            #ece8f7 ${degrees}deg
        )`;
}


/* =========================================
   NEXT ACTION
========================================= */

function renderNextAction(
    courses
) {

    const resumeExists =
        Boolean(
            userData.resumeData
        );


    const skillsExist =
        getVerifiedSkills().length > 0;


    const projectsExist =
        getProjects().length > 0;


    const dsa =
        getCourse(
            courses,
            "dsa-learning"
        );


    const technicalCourses =
        courses.filter(
            course =>
                [
                    "dbms",
                    "os",
                    "oops"
                ].includes(
                    course.id
                )
        );


    const technicalPercent =
        technicalCourses.length
            ? average(
                technicalCourses.map(
                    course =>
                        course.percentage
                )
            )
            : 0;


    if (
        !userData.targetRole &&
        !userData.careerGoal
    ) {

        nextActionTitle.textContent =
            "Set your target role";


        nextActionText.textContent =
            "Choose the role you are preparing for so CareerPilot can organize your journey around it.";


        nextActionButton.href =
            "onboarding.html";


        return;
    }


    if (!resumeExists) {

        nextActionTitle.textContent =
            "Analyze your resume";


        nextActionText.textContent =
            "Upload your resume to create your first career evidence layer.";


        nextActionButton.href =
            "resume.html";


        return;
    }


    if (!skillsExist) {

        nextActionTitle.textContent =
            "Verify your skills";


        nextActionText.textContent =
            "Review the skills detected in your resume and verify the ones you want in your profile.";


        nextActionButton.href =
            "skills.html";


        return;
    }


    if (!projectsExist) {

        nextActionTitle.textContent =
            "Add your first project";


        nextActionText.textContent =
            "Connect your verified skills to a real project.";


        nextActionButton.href =
            "projects.html";


        return;
    }


    if (
        dsa &&
        dsa.percentage < 100
    ) {

        nextActionTitle.textContent =
            "Continue DSA Learning";


        nextActionText.textContent =
            `You have completed ${dsa.completed} of ${dsa.total} DSA learning units.`;


        nextActionButton.href =
            "dsa-learning.html";


        return;
    }


    if (
        technicalPercent < 100
    ) {

        nextActionTitle.textContent =
            "Continue Technical Preparation";


        nextActionText.textContent =
            "Keep progressing through DBMS, Operating Systems and OOP.";


        nextActionButton.href =
            "technical.html";


        return;
    }


    nextActionTitle.textContent =
        "Practice your interview";


    nextActionText.textContent =
        "Your core profile is built. Continue with interview preparation.";


    nextActionButton.href =
        "interview.html";
}


/* =========================================
   CAREER XP
========================================= */

function getCareerXP() {

    const explicit =
        Number(
            userData.careerXP ??
            userData.xp
        );


    if (
        Number.isFinite(explicit) &&
        explicit >= 0
    ) {

        return Math.round(
            explicit
        );
    }


    let xp = 0;


    xp +=
        countCompletedLearningUnits() *
        10;


    xp +=
        countCompletedModules() *
        25;


    xp +=
        countPassedAssessments() *
        50;


    xp +=
        getVerifiedSkills().length *
        15;


    xp +=
        getProjects().length *
        50;


    if (
        userData.resumeData
    ) {

        xp += 50;
    }


    return xp;
}


function countCompletedLearningUnits() {

    let total = 0;


    courseSources.forEach(
        source => {

            total +=
                countCompletedUnits(
                    userData[
                        source.progressKey
                    ]
                );
        }
    );


    return total;
}


function countCompletedModules() {

    let total = 0;


    courseSources.forEach(
        source => {

            const progress =
                userData[
                    source.progressKey
                ] || {};


            if (
                Array.isArray(
                    progress.completedModules
                )
            ) {

                total +=
                    progress.completedModules.length;
            }


            if (
                Array.isArray(
                    progress.completedChapters
                )
            ) {

                total +=
                    progress.completedChapters.length;
            }
        }
    );


    return total;
}


function countPassedAssessments() {

    let total = 0;


    courseSources.forEach(
        source => {

            const progress =
                userData[
                    source.progressKey
                ] || {};


            if (
                Array.isArray(
                    progress.assessments
                )
            ) {

                total +=
                    progress.assessments.filter(
                        isPassedAssessment
                    ).length;

            } else if (
                progress.assessments &&
                typeof progress.assessments === "object"
            ) {

                total +=
                    Object.values(
                        progress.assessments
                    )
                        .filter(
                            isPassedAssessment
                        )
                        .length;
            }
        }
    );


    return total;
}


function isPassedAssessment(
    value
) {

    if (value === true) {
        return true;
    }


    if (
        !value ||
        typeof value !== "object"
    ) {

        return false;
    }


    return (
        value.passed === true ||
        value.completed === true ||
        value.status === "passed"
    );
}


/* =========================================
   COURSE HELPERS
========================================= */

function getCourse(
    courses,
    id
) {

    return courses.find(
        course =>
            course.id === id
    );
}


function countCurriculumUnits(
    curriculum
) {

    if (!curriculum) {
        return 0;
    }


    if (
        Array.isArray(
            curriculum.modules
        )
    ) {

        return curriculum.modules.reduce(
            (
                total,
                module
            ) => {

                if (
                    Array.isArray(
                        module.topics
                    )
                ) {

                    return total +
                        module.topics.length;
                }


                if (
                    Array.isArray(
                        module.chapters
                    )
                ) {

                    return total +
                        module.chapters.length;
                }


                return total + 1;
            },
            0
        );
    }


    if (
        Array.isArray(
            curriculum.chapters
        )
    ) {

        return curriculum.chapters.reduce(
            (
                total,
                chapter
            ) => {

                if (
                    Array.isArray(
                        chapter.topics
                    )
                ) {

                    return total +
                        chapter.topics.length;
                }


                return total + 1;
            },
            0
        );
    }


    if (
        Array.isArray(
            curriculum
        )
    ) {

        return curriculum.length;
    }


    return recursiveCount(
        curriculum
    );
}


function recursiveCount(
    value
) {

    if (!value) {
        return 0;
    }


    if (Array.isArray(value)) {

        return value.reduce(
            (
                total,
                item
            ) =>
                total +
                recursiveCount(item),
            0
        );
    }


    if (
        typeof value !== "object"
    ) {

        return 0;
    }


    let count = 0;


    if (
        typeof value.id === "string" &&
        typeof value.title === "string"
    ) {

        count = 1;
    }


    [
        "modules",
        "chapters",
        "topics",
        "lessons"
    ].forEach(
        key => {

            if (
                Array.isArray(
                    value[key]
                )
            ) {

                count +=
                    value[key].reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            recursiveCount(item),
                        0
                    );
            }
        }
    );


    return count;
}


function countCompletedUnits(
    progress
) {

    if (!progress) {
        return 0;
    }


    if (
        Array.isArray(
            progress.completedTopics
        )
    ) {

        return progress.completedTopics.length;
    }


    if (
        progress.completedTopics &&
        typeof progress.completedTopics === "object"
    ) {

        return Object.values(
            progress.completedTopics
        )
            .filter(
                value =>
                    value === true
            )
            .length;
    }


    if (
        Array.isArray(
            progress.completedChapters
        )
    ) {

        return progress.completedChapters.length;
    }


    if (
        progress.completedChapters &&
        typeof progress.completedChapters === "object"
    ) {

        return Object.values(
            progress.completedChapters
        )
            .filter(
                value =>
                    value === true
            )
            .length;
    }


    if (
        Array.isArray(
            progress.completedLessons
        )
    ) {

        return progress.completedLessons.length;
    }


    return 0;
}


/* =========================================
   EMPTY
========================================= */

function renderEmptyRoadmap() {

    roadmapList.innerHTML = `

        <div class="empty-roadmap">

            Your roadmap could not be loaded.
            Please refresh the page.

        </div>
    `;
}


/* =========================================
   UTILITIES
========================================= */

function average(
    values
) {

    const valid =
        values
            .map(Number)
            .filter(
                value =>
                    Number.isFinite(value)
            );


    if (!valid.length) {
        return 0;
    }


    return (
        valid.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        ) /
        valid.length
    );
}


function uniqueStrings(
    values
) {

    return [
        ...new Set(
            values
                .map(
                    value =>
                        String(value).trim()
                )
                .filter(Boolean)
        )
    ];
}


function escapeHtml(
    value
) {

    return String(value)

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