import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   CONSTANTS
========================================================= */

const COURSE_CONFIG = [
    {
        id: "dsa-learning",
        title: "DSA Learning",
        description: "Structured DSA curriculum",
        icon: "🧠",
        progressKey: "dsaLearningProgress",
        curriculumPath: "../data/dsa-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedModules",
        assessmentsKey: "assessments",
        link: "dsa-learning.html",
        cssClass: "learning-dsa"
    },

    {
        id: "dbms",
        title: "DBMS",
        description: "Database management systems",
        icon: "🗄️",
        progressKey: "dbmsProgress",
        curriculumPath: "../data/dbms-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments",
        link: "dbms.html",
        cssClass: "learning-dbms"
    },

    {
        id: "os",
        title: "Operating Systems",
        description: "Processes, memory, files and more",
        icon: "💻",
        progressKey: "osProgress",
        curriculumPath: "../data/os-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments",
        link: "os.html",
        cssClass: "learning-os"
    },

    {
        id: "oops",
        title: "OOP",
        description: "Object-oriented programming",
        icon: "🧩",
        progressKey: "oopsProgress",
        curriculumPath: "../data/oops-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments",
        link: "oops.html",
        cssClass: "learning-oop"
    }
];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const userInitials =
    document.getElementById(
        "userInitials"
    );

const heroAvatar =
    document.getElementById(
        "heroAvatar"
    );

const heroName =
    document.getElementById(
        "heroName"
    );

const heroEmail =
    document.getElementById(
        "heroEmail"
    );

const profileStatus =
    document.getElementById(
        "profileStatus"
    );

const profileStatusText =
    document.getElementById(
        "profileStatusText"
    );

const overallProgress =
    document.getElementById(
        "overallProgress"
    );

const topicsCompleted =
    document.getElementById(
        "topicsCompleted"
    );

const modulesCompleted =
    document.getElementById(
        "modulesCompleted"
    );

const assessmentsPassed =
    document.getElementById(
        "assessmentsPassed"
    );

const learningGrid =
    document.getElementById(
        "learningGrid"
    );

const structuredLearningText =
    document.getElementById(
        "structuredLearningText"
    );

const assessmentEvidenceText =
    document.getElementById(
        "assessmentEvidenceText"
    );

const targetRoleText =
    document.getElementById(
        "targetRoleText"
    );

const careerXPText =
    document.getElementById(
        "careerXPText"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let userData = {};

let courseResults = [];


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        await loadCareerTwin();

    }
);


/* =========================================================
   MAIN LOAD
========================================================= */

async function loadCareerTwin() {

    try {

        setLoadingState();


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


        if (snapshot.exists()) {

            userData =
                snapshot.data();

        } else {

            userData = {};

        }


        updateUserIdentity();

        updateBasicEvidence();


        courseResults = [];


        for (
            const course
            of COURSE_CONFIG
        ) {

            const result =
                await buildCourseResult(
                    course
                );

            courseResults.push(
                result
            );

        }


        renderLearningCards();

        updateOverallSnapshot();

        updateCareerTwinStatus();

        updateStructuredEvidence();

    } catch (error) {

        console.error(
            "Career Twin loading error:",
            error
        );


        learningGrid.innerHTML = `
            <div class="progress-message">
                Could not load your progress.
                Please refresh the page.
            </div>
        `;

    }

}


/* =========================================================
   LOAD CURRICULUM
========================================================= */

async function loadCurriculum(
    path
) {

    try {

        const response =
            await fetch(
                path,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Curriculum request failed: ${response.status}`
            );

        }


        return await response.json();

    } catch (error) {

        console.error(
            `Curriculum load failed for ${path}:`,
            error
        );


        return null;

    }

}


/* =========================================================
   CURRICULUM UNIT HELPERS
========================================================= */

function getCurriculumUnits(
    curriculum
) {

    if (!curriculum) {
        return [];
    }


    if (
        Array.isArray(
            curriculum.modules
        )
    ) {

        return curriculum.modules;

    }


    if (
        Array.isArray(
            curriculum.chapters
        )
    ) {

        return curriculum.chapters;

    }


    if (
        Array.isArray(
            curriculum.sections
        )
    ) {

        return curriculum.sections;

    }


    return [];

}


function getUnitTopics(
    unit
) {

    if (!unit) {
        return [];
    }


    if (
        Array.isArray(
            unit.topics
        )
    ) {

        return unit.topics;

    }


    return [];

}


/* =========================================================
   COURSE RESULT
========================================================= */

async function buildCourseResult(
    course
) {

    const curriculum =
        await loadCurriculum(
            course.curriculumPath
        );


    const progress =
        userData[
            course.progressKey
        ] || {};


    const units =
        getCurriculumUnits(
            curriculum
        );


    let totalTopics = 0;


    units.forEach(
        (unit) => {

            totalTopics +=
                getUnitTopics(
                    unit
                ).length;

        }
    );


    const completedTopicsObject =
        progress[
            course.completedTopicsKey
        ] || {};


    const completedUnitsObject =
        progress[
            course.completedUnitsKey
        ] || {};


    const assessmentsObject =
        progress[
            course.assessmentsKey
        ] || {};


    let completedTopicCount =
        countTrueValues(
            completedTopicsObject
        );


    let completedUnitCount =
        countTrueValues(
            completedUnitsObject
        );


    let passedAssessmentCount =
        countPassedAssessments(
            assessmentsObject
        );


    /*
        DSA Learning uses the curriculum module list.
        If its total topics could not be read,
        retain the known curriculum size.
    */

    if (
        course.id === "dsa-learning" &&
        totalTopics === 0
    ) {

        totalTopics = 37;

    }


    if (
        course.id === "dsa-learning" &&
        units.length === 0
    ) {

        completedUnitCount =
            countTrueValues(
                completedUnitsObject
            );

    }


    const percentage =
        totalTopics > 0
            ? Math.min(
                100,
                Math.round(
                    (
                        completedTopicCount /
                        totalTopics
                    ) * 100
                )
            )
            : 0;


    return {

        ...course,

        totalTopics,

        completedTopicCount,

        totalUnits:
            units.length,

        completedUnitCount,

        passedAssessmentCount,

        percentage,

        completed:
            percentage === 100

    };

}


/* =========================================================
   COUNT HELPERS
========================================================= */

function countTrueValues(
    object
) {

    if (
        !object ||
        typeof object !== "object"
    ) {

        return 0;

    }


    return Object.values(
        object
    )
    .filter(
        value =>
            value === true
    )
    .length;

}


function countPassedAssessments(
    assessments
) {

    if (
        !assessments ||
        typeof assessments !== "object"
    ) {

        return 0;

    }


    return Object.values(
        assessments
    )
    .filter(
        assessment => {

            if (
                assessment === true
            ) {

                return true;

            }


            if (
                assessment &&
                typeof assessment === "object"
            ) {

                return (
                    assessment.passed === true
                );

            }


            return false;

        }
    )
    .length;

}


/* =========================================================
   USER INFO
========================================================= */

function updateUserIdentity() {

    const firstName =
        userData.firstName ||
        userData.firstname ||
        userData.name ||
        currentUser.displayName ||
        "Career Explorer";


    const lastName =
        userData.lastName ||
        userData.lastname ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const initials =
        getInitials(
            fullName
        );


    if (userInitials) {

        userInitials.textContent =
            initials;

    }


    if (heroAvatar) {

        heroAvatar.textContent =
            initials;

    }


    if (heroName) {

        heroName.textContent =
            fullName;

    }


    if (heroEmail) {

        heroEmail.textContent =
            currentUser.email ||
            "No email available";

    }

}


/* =========================================================
   BASIC EVIDENCE
========================================================= */

function updateBasicEvidence() {

    const targetRole =
        userData.targetRole ||
        userData.role ||
        userData.target ||
        "";


    const careerXP =
        Number(
            userData.careerXP ||
            userData.xp ||
            0
        );


    if (targetRoleText) {

        targetRoleText.textContent =
            targetRole
                ? targetRole
                : "Target role not set yet.";

    }


    if (careerXPText) {

        careerXPText.textContent =
            `${careerXP} XP recorded.`;

    }

}


/* =========================================================
   OVERALL SNAPSHOT
========================================================= */

function updateOverallSnapshot() {

    let totalTopics = 0;

    let completedTopics = 0;

    let totalUnits = 0;

    let completedUnits = 0;

    let totalAssessmentsPassed = 0;


    courseResults.forEach(
        result => {

            totalTopics +=
                result.totalTopics;

            completedTopics +=
                result.completedTopicCount;

            totalUnits +=
                result.totalUnits;

            completedUnits +=
                result.completedUnitCount;

            totalAssessmentsPassed +=
                result.passedAssessmentCount;

        }
    );


    const percentage =
        totalTopics > 0
            ? Math.min(
                100,
                Math.round(
                    (
                        completedTopics /
                        totalTopics
                    ) * 100
                )
            )
            : 0;


    if (overallProgress) {

        overallProgress.textContent =
            `${percentage}%`;

    }


    if (topicsCompleted) {

        topicsCompleted.textContent =
            `${completedTopics}`;

    }


    if (modulesCompleted) {

        modulesCompleted.textContent =
            `${completedUnits}`;

    }


    if (assessmentsPassed) {

        assessmentsPassed.textContent =
            `${totalAssessmentsPassed}`;

    }

}


/* =========================================================
   LEARNING CARDS
========================================================= */

function renderLearningCards() {

    if (!learningGrid) {
        return;
    }


    if (
        courseResults.length === 0
    ) {

        learningGrid.innerHTML = `
            <div class="progress-message">
                No learning data available yet.
            </div>
        `;

        return;

    }


    learningGrid.innerHTML =
        courseResults
            .map(
                result =>
                    createLearningCard(
                        result
                    )
            )
            .join("");

}


/* =========================================================
   LEARNING CARD HTML
========================================================= */

function createLearningCard(
    result
) {

    const unitLabel =
        result.id === "dsa-learning"
            ? "Modules"
            : "Chapters";


    const totalUnitText =
        result.totalUnits > 0
            ? `${result.completedUnitCount} / ${result.totalUnits} ${unitLabel}`
            : `${result.completedUnitCount} ${unitLabel}`;


    return `

        <article
            class="learning-card ${result.cssClass}"
        >

            <div
                class="learning-card-top"
            >


                <div
                    class="learning-icon"
                >
                    ${result.icon}
                </div>


                <div
                    class="learning-title-wrap"
                >

                    <h3>
                        ${escapeHtml(
                            result.title
                        )}
                    </h3>


                    <p>
                        ${escapeHtml(
                            result.description
                        )}
                    </p>

                </div>


                <strong
                    class="learning-percent"
                >
                    ${result.percentage}%
                </strong>


            </div>


            <div
                class="learning-progress"
            >

                <div
                    class="learning-progress-fill"
                    style="width:${result.percentage}%"
                ></div>

            </div>


            <div
                class="learning-meta"
            >

                <span>
                    ${result.completedTopicCount}
                    / ${result.totalTopics}
                    Topics
                </span>


                <span>
                    ${totalUnitText}
                </span>


                <span>
                    ${result.passedAssessmentCount}
                    Assessments
                </span>

            </div>


            <a
                href="${result.link}"
                class="learning-card-link"
            >
                Continue →
            </a>

        </article>

    `;

}


/* =========================================================
   CAREER TWIN STATUS
========================================================= */

function updateCareerTwinStatus() {

    const totalCompletedTopics =
        courseResults.reduce(
            (
                total,
                result
            ) =>
                total +
                result.completedTopicCount,
            0
        );


    const totalPassedAssessments =
        courseResults.reduce(
            (
                total,
                result
            ) =>
                total +
                result.passedAssessmentCount,
            0
        );


    const fullyCompletedCourses =
        courseResults.filter(
            result =>
                result.completed === true
        ).length;


    if (
        fullyCompletedCourses > 0
    ) {

        if (profileStatus) {

            profileStatus.textContent =
                "Evidence growing";

        }


        if (
            profileStatusText
        ) {

            profileStatusText.textContent =
                `${fullyCompletedCourses} learning track${
                    fullyCompletedCourses === 1
                        ? ""
                        : "s"
                } completed. Keep building your preparation history.`;

        }

        return;

    }


    if (
        totalPassedAssessments > 0
    ) {

        if (profileStatus) {

            profileStatus.textContent =
                "Profile developing";

        }


        if (
            profileStatusText
        ) {

            profileStatusText.textContent =
                `${totalPassedAssessments} assessment${
                    totalPassedAssessments === 1
                        ? ""
                        : "s"
                } passed with ${totalCompletedTopics} completed topics.`;

        }

        return;

    }


    if (
        totalCompletedTopics > 0
    ) {

        if (profileStatus) {

            profileStatus.textContent =
                "Learning active";

        }


        if (
            profileStatusText
        ) {

            profileStatusText.textContent =
                `${totalCompletedTopics} completed learning topics are now part of your progress record.`;

        }

        return;

    }


    if (profileStatus) {

        profileStatus.textContent =
            "Profile building";

    }


    if (profileStatusText) {

        profileStatusText.textContent =
            "Start learning and completing assessments to build your career evidence.";

    }

}


/* =========================================================
   STRUCTURED EVIDENCE TEXT
========================================================= */

function updateStructuredEvidence() {

    const totalTopics =
        courseResults.reduce(
            (
                total,
                result
            ) =>
                total +
                result.completedTopicCount,
            0
        );


    const totalUnits =
        courseResults.reduce(
            (
                total,
                result
            ) =>
                total +
                result.completedUnitCount,
            0
        );


    const totalAssessments =
        courseResults.reduce(
            (
                total,
                result
            ) =>
                total +
                result.passedAssessmentCount,
            0
        );


    if (
        structuredLearningText
    ) {

        if (
            totalTopics === 0
        ) {

            structuredLearningText.textContent =
                "No completed learning topics yet.";

        } else {

            structuredLearningText.textContent =
                `${totalTopics} learning topics and ${totalUnits} completed modules or chapters are currently recorded.`;

        }

    }


    if (
        assessmentEvidenceText
    ) {

        if (
            totalAssessments === 0
        ) {

            assessmentEvidenceText.textContent =
                "No passed assessments recorded yet.";

        } else {

            assessmentEvidenceText.textContent =
                `${totalAssessments} passed assessments are recorded in your learning history.`;

        }

    }

}


/* =========================================================
   LOADING STATE
========================================================= */

function setLoadingState() {

    if (!learningGrid) {
        return;
    }


    learningGrid.innerHTML = `

        <div class="loading-card">

            <div
                class="loading-spinner"
            ></div>

            <p>
                Loading your progress...
            </p>

        </div>

    `;

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Could not log out. Please try again."
                );

            }

        }
    );

}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(
    name
) {

    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        words.length === 0
    ) {

        return "CP";

    }


    if (
        words.length === 1
    ) {

        return words[0]
            .slice(
                0,
                2
            )
            .toUpperCase();

    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    )
        .toUpperCase();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(value)

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