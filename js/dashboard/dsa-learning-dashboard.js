import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   CONSTANTS
========================================================= */

const TOTAL_DSA_TOPICS = 37;

const COURSE_CONFIG = [

    {
        id: "dsa-learning",
        progressKey: "dsaLearningProgress",
        curriculumPath: "../data/dsa-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedModules",
        assessmentsKey: "assessments"
    },

    {
        id: "dbms",
        progressKey: "dbmsProgress",
        curriculumPath: "../data/dbms-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments"
    },

    {
        id: "os",
        progressKey: "osProgress",
        curriculumPath: "../data/os-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments"
    },

    {
        id: "oops",
        progressKey: "oopsProgress",
        curriculumPath: "../data/oops-curriculum.json",
        completedTopicsKey: "completedTopics",
        completedUnitsKey: "completedChapters",
        assessmentsKey: "assessments"
    }

];


/* =========================================================
   DSA LEARNING CARD ELEMENTS
========================================================= */

const dsaLearningProgressText =
    document.getElementById(
        "dsaLearningProgressText"
    );

const dsaLearningProgressBar =
    document.getElementById(
        "dsaLearningProgressBar"
    );

const dsaLearningTopics =
    document.getElementById(
        "dsaLearningTopics"
    );

const dsaLearningModules =
    document.getElementById(
        "dsaLearningModules"
    );


/* =========================================================
   DASHBOARD STAT ELEMENTS
========================================================= */

const careerProgress =
    document.getElementById(
        "careerProgress"
    );

const streak =
    document.getElementById(
        "streak"
    );

const verifiedSkills =
    document.getElementById(
        "verifiedSkills"
    );

const careerXP =
    document.getElementById(
        "careerXP"
    );

const targetRole =
    document.getElementById(
        "targetRole"
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
            return;
        }

        currentUser =
            user;

        await loadDashboardMetrics();

    }
);


/* =========================================================
   MAIN LOAD
========================================================= */

async function loadDashboardMetrics() {

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

            userData =
                snapshot.data();

        } else {

            userData = {};

        }


        /*
            Build progress information
            for all currently implemented
            structured-learning systems.
        */

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


        updateDSALearningCard();

        updateCareerProgress();

        updateStudyStreak();

        updateVerifiedSkills();

        updateCareerXP();

        updateTargetRole();

        updateSkillVerificationCard();

        updateCareerTwinStatus();


    } catch (error) {

        console.error(
            "Dashboard metrics error:",
            error
        );

        setSafeDashboardDefaults();

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
                `Could not load curriculum: ${response.status}`
            );

        }


        return await response.json();

    } catch (error) {

        console.error(
            `Curriculum error for ${path}:`,
            error
        );

        return null;

    }

}


/* =========================================================
   GET CURRICULUM UNITS
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


/* =========================================================
   GET UNIT TOPICS
========================================================= */

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
   BUILD COURSE RESULT
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
        unit => {

            totalTopics +=
                getUnitTopics(
                    unit
                ).length;

        }
    );


    /*
        DSA Learning has a known total
        of 37 topics.
    */

    if (
        course.id ===
        "dsa-learning" &&
        totalTopics === 0
    ) {

        totalTopics =
            TOTAL_DSA_TOPICS;

    }


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


    const completedTopicCount =
        countTrueValues(
            completedTopicsObject
        );


    const completedUnitCount =
        countTrueValues(
            completedUnitsObject
        );


    const passedAssessmentCount =
        countPassedAssessments(
            assessmentsObject
        );


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

        id:
            course.id,

        totalTopics,

        completedTopicCount,

        totalUnits:
            units.length,

        completedUnitCount,

        passedAssessmentCount,

        percentage

    };

}


/* =========================================================
   COUNT TRUE VALUES
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


/* =========================================================
   COUNT PASSED ASSESSMENTS
========================================================= */

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
        result => {

            if (
                result === true
            ) {

                return true;

            }


            if (
                result &&
                typeof result === "object"
            ) {

                return (
                    result.passed === true
                );

            }


            return false;

        }
    )
    .length;

}


/* =========================================================
   DSA LEARNING CARD
========================================================= */

function updateDSALearningCard() {

    const result =
        courseResults.find(
            course =>
                course.id ===
                "dsa-learning"
        );


    if (!result) {

        updateDSAProgressUI(
            0,
            0,
            0
        );

        return;

    }


    updateDSAProgressUI(

        result.percentage,

        result.completedTopicCount,

        result.completedUnitCount

    );

}


/* =========================================================
   DSA CARD UI
========================================================= */

function updateDSAProgressUI(
    percentage,
    completedTopics,
    completedModules
) {

    if (
        dsaLearningProgressText
    ) {

        dsaLearningProgressText.textContent =
            `${percentage}%`;

    }


    if (
        dsaLearningProgressBar
    ) {

        dsaLearningProgressBar.style.width =
            `${percentage}%`;

    }


    if (
        dsaLearningTopics
    ) {

        dsaLearningTopics.textContent =
            `${completedTopics} / ${TOTAL_DSA_TOPICS} Topics`;

    }


    if (
        dsaLearningModules
    ) {

        dsaLearningModules.textContent =
            `${completedModules} / 6 Modules`;

    }

}


/* =========================================================
   CAREER PROGRESS
========================================================= */

function updateCareerProgress() {

    let totalTopics =
        0;

    let completedTopics =
        0;


    courseResults.forEach(
        result => {

            totalTopics +=
                result.totalTopics;

            completedTopics +=
                result.completedTopicCount;

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


    if (
        careerProgress
    ) {

        careerProgress.textContent =
            `${percentage}%`;

    }

}


/* =========================================================
   STUDY STREAK
========================================================= */

/* =========================================================
   STUDY STREAK
========================================================= */

function updateStudyStreak() {

    const dates = [];


    /* Dashboard study dates */

    if (
        Array.isArray(
            userData.studyDates
        )
    ) {

        dates.push(
            ...userData.studyDates
        );

    }


    /* Dashboard activity dates */

    if (
        Array.isArray(
            userData.activityDates
        )
    ) {

        dates.push(
            ...userData.activityDates
        );

    }


    /* DSA solved dates */

    const dsaDates =
        userData
            .dsaProgress
            ?.dailyProblemDates;


    if (
        dsaDates &&
        typeof dsaDates === "object"
    ) {

        Object.values(
            dsaDates
        ).forEach(
            date => {

                dates.push(
                    date
                );

            }
        );

    }


    const result =
        calculateStudyStreak(
            dates
        );


    if (streak) {

        streak.textContent =
            String(result);

    }

}
/* =========================================================
   NORMALIZE DATE
========================================================= */

function normalizeDate(
    value
) {

    let date;


    if (
        value instanceof Date
    ) {

        date =
            value;

    } else {

        date =
            new Date(
                value
            );

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        ),
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )
    ].join("-");

}


/* =========================================================
   DATE DIFFERENCE
========================================================= */

function differenceInDays(
    first,
    second
) {

    const firstDate =
        new Date(
            `${first}T00:00:00`
        );


    const secondDate =
        new Date(
            `${second}T00:00:00`
        );


    const difference =
        Math.abs(
            (
                firstDate.getTime() -
                secondDate.getTime()
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    return Math.round(
        difference
    );

}


/* =========================================================
   VERIFIED SKILLS
========================================================= */

function updateVerifiedSkills() {

    /*
        Prefer actual saved verified-skill
        information.

        Supported formats:

        verifiedSkills: 5

        verifiedSkills: [
            "JavaScript",
            "SQL"
        ]

        skillVerification.verifiedSkills: 5

        When no explicit verified-skill
        record exists, keep the dashboard
        truthful at 0 rather than treating
        completed lessons as verified skills.
    */


    let verifiedCount =
        extractVerifiedSkillCount(
            userData
        );


    if (
        verifiedCount === null
    ) {

        verifiedCount = 0;

    }


    if (
        verifiedSkills
    ) {

        verifiedSkills.textContent =
            String(
                verifiedCount
            );

    }

}


/* =========================================================
   EXTRACT VERIFIED SKILLS
========================================================= */

function extractVerifiedSkillCount(
    data
) {

    const direct =
        data.verifiedSkills;


    if (
        typeof direct ===
        "number"
    ) {

        return Math.max(
            0,
            Math.round(
                direct
            )
        );

    }


    if (
        Array.isArray(
            direct
        )
    ) {

        return direct.length;

    }


    const verification =
        data.skillVerification;


    if (
        verification &&
        typeof verification ===
        "object"
    ) {

        if (
            typeof verification.verifiedSkills ===
            "number"
        ) {

            return Math.max(
                0,
                Math.round(
                    verification.verifiedSkills
                )
            );

        }


        if (
            Array.isArray(
                verification.verifiedSkills
            )
        ) {

            return (
                verification
                    .verifiedSkills
                    .length
            );

        }


        if (
            Array.isArray(
                verification.skills
            )
        ) {

            return verification.skills
                .filter(
                    skill => {

                        if (
                            !skill ||
                            typeof skill !== "object"
                        ) {

                            return false;

                        }


                        return (
                            skill.verified === true
                        );

                    }
                )
                .length;

        }

    }


    return null;

}


/* =========================================================
   CAREER XP
========================================================= */

function updateCareerXP() {

    let xp =
        Number(
            userData.careerXP
        );


    if (
        !Number.isFinite(
            xp
        )
    ) {

        xp =
            Number(
                userData.xp
            );

    }


    /*
        When the user already has an
        explicit XP value, always use it.

        Otherwise derive a live XP number
        from completed preparation activity.
    */

    if (
        !Number.isFinite(
            xp
        )
    ) {

        xp =
            calculateDerivedXP();

    }


    if (
        careerXP
    ) {

        careerXP.textContent =
            String(
                Math.max(
                    0,
                    Math.round(
                        xp
                    )
                )
            );

    }

}


/* =========================================================
   DERIVED XP
========================================================= */

function calculateDerivedXP() {

    let topics =
        0;

    let units =
        0;

    let assessments =
        0;


    courseResults.forEach(
        result => {

            topics +=
                result.completedTopicCount;

            units +=
                result.completedUnitCount;

            assessments +=
                result.passedAssessmentCount;

        }
    );


    /*
        Current derived XP model:

        +10 XP per completed topic
        +25 XP per completed module/chapter
        +50 XP per passed assessment
    */

    return (
        topics * 10
        +
        units * 25
        +
        assessments * 50
    );

}


/* =========================================================
   TARGET ROLE
========================================================= */

function updateTargetRole() {

    if (!targetRole) {
        return;
    }


    const role =
        userData.targetRole ||
        userData.role ||
        userData.target ||
        "Not set yet";


    targetRole.textContent =
        role;

}


/* =========================================================
   SKILL VERIFICATION CARD
========================================================= */

function updateSkillVerificationCard() {

    const skillRows =
        document.querySelectorAll(
            ".skill-row"
        );


    if (
        !skillRows ||
        skillRows.length === 0
    ) {

        return;

    }


    const dsaResult =
        courseResults.find(
            result =>
                result.id ===
                "dsa-learning"
        );


    const dbmsResult =
        courseResults.find(
            result =>
                result.id ===
                "dbms"
        );


    const savedSkillScores =
        userData.skillScores ||
        {};


    skillRows.forEach(
        row => {

            const nameElement =
                row.querySelector(
                    ".skill-name span"
                );


            const valueElement =
                row.querySelector(
                    ".skill-name strong"
                );


            const fillElement =
                row.querySelector(
                    ".skill-fill"
                );


            if (
                !nameElement ||
                !valueElement ||
                !fillElement
            ) {

                return;

            }


            const skillName =
                nameElement
                    .textContent
                    .trim()
                    .toLowerCase();


            let percentage =
                0;


            /*
                JavaScript
            */

            if (
                skillName ===
                "javascript"
            ) {

                percentage =
                    getSkillScore(
                        savedSkillScores,
                        "javascript"
                    );

            }


            /*
                DSA
            */

            else if (
                skillName ===
                "dsa"
            ) {

                percentage =
                    dsaResult
                        ? dsaResult.percentage
                        : getSkillScore(
                            savedSkillScores,
                            "dsa"
                        );

            }


            /*
                SQL
            */

            else if (
                skillName ===
                "sql"
            ) {

                percentage =
                    getSkillScore(
                        savedSkillScores,
                        "sql"
                    );

            }


            /*
                DBMS
            */

            else if (
                skillName ===
                "dbms"
            ) {

                percentage =
                    dbmsResult
                        ? dbmsResult.percentage
                        : getSkillScore(
                            savedSkillScores,
                            "dbms"
                        );

            }


            percentage =
                clampPercentage(
                    percentage
                );


            valueElement.textContent =
                `${percentage}%`;


            fillElement.style.width =
                `${percentage}%`;

        }
    );

}


/* =========================================================
   GET SAVED SKILL SCORE
========================================================= */

function getSkillScore(
    skillScores,
    key
) {

    if (
        !skillScores ||
        typeof skillScores !==
        "object"
    ) {

        return 0;

    }


    const raw =
        skillScores[key];


    if (
        typeof raw ===
        "number"
    ) {

        return raw;

    }


    if (
        raw &&
        typeof raw ===
        "object"
    ) {

        if (
            typeof raw.percentage ===
            "number"
        ) {

            return raw.percentage;

        }


        if (
            typeof raw.score ===
            "number"
        ) {

            return raw.score;

        }

    }


    return 0;

}


/* =========================================================
   CLAMP PERCENTAGE
========================================================= */

function clampPercentage(
    value
) {

    const numeric =
        Number(
            value
        );


    if (
        !Number.isFinite(
            numeric
        )
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                numeric
            )
        )
    );

}


/* =========================================================
   CAREER TWIN STATUS
========================================================= */

function updateCareerTwinStatus() {

    const statusStrong =
        document.querySelector(
            ".career-twin-card .twin-status strong"
        );


    if (!statusStrong) {
        return;
    }


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
        totalTopics === 0
    ) {

        statusStrong.textContent =
            "Profile building";

        return;

    }


    if (
        totalAssessments > 0
    ) {

        statusStrong.textContent =
            "Evidence growing";

        return;

    }


    statusStrong.textContent =
        "Learning active";

}


/* =========================================================
   SAFE DEFAULTS
========================================================= */

function setSafeDashboardDefaults() {

    updateDSAProgressUI(
        0,
        0,
        0
    );


    if (
        careerProgress
    ) {

        careerProgress.textContent =
            "0%";

    }


    if (
        streak
    ) {

        streak.textContent =
            "0";

    }


    if (
        verifiedSkills
    ) {

        verifiedSkills.textContent =
            "0";

    }


    if (
        careerXP
    ) {

        careerXP.textContent =
            "0";

    }


    if (
        targetRole
    ) {

        targetRole.textContent =
            "Not set yet";

    }

}


/* =========================================================
   END
========================================================= */