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

const careerHealth =
    document.getElementById("careerHealth");

const careerHealthBar =
    document.getElementById("careerHealthBar");

const verifiedSkillsElement =
    document.getElementById("verifiedSkills");

const projectCountElement =
    document.getElementById("projectCount");

const resumeScoreElement =
    document.getElementById("resumeScore");

const careerXPElement =
    document.getElementById("careerXP");

const sideCareerXPElement =
    document.getElementById("sideCareerXP");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const targetRole =
    document.getElementById("targetRole");

const resumeStatus =
    document.getElementById("resumeStatus");

const verifiedSkillsList =
    document.getElementById("verifiedSkillsList");

const recentProjects =
    document.getElementById("recentProjects");

const learningCourses =
    document.getElementById("learningCourses");

const twinStatus =
    document.getElementById("twinStatus");

const twinMessage =
    document.getElementById("twinMessage");


/* =========================================
   CURRICULUM SOURCES
========================================= */

const curriculumSources = [
    {
        id: "dsa-learning",
        name: "DSA Learning",
        path: "../data/dsa-curriculum.json",
        progressKey: "dsaLearningProgress"
    },

    {
        id: "dbms",
        name: "DBMS",
        path: "../data/dbms-curriculum.json",
        progressKey: "dbmsProgress"
    },

    {
        id: "operating-systems",
        name: "Operating Systems",
        path: "../data/os-curriculum.json",
        progressKey: "osProgress"
    },

    {
        id: "oops",
        name: "OOP",
        path: "../data/oops-curriculum.json",
        progressKey: "oopsProgress"
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

        await loadProfile();
    }
);


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

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


        renderProfile();

    } catch (error) {

        console.error(
            "Career Twin loading error:",
            error
        );

        renderProfile();
    }
}


/* =========================================
   MAIN RENDER
========================================= */

async function renderProfile() {

    renderBasicProfile();

    const verifiedSkills =
        getVerifiedSkills();

    const projects =
        getProjects();

    const resumeScore =
        getResumeScore();

    const careerXP =
        getCareerXP();

    const learningData =
        await loadLearningProgress();


    verifiedSkillsElement.textContent =
        verifiedSkills.length;


    projectCountElement.textContent =
        projects.length;


    resumeScoreElement.textContent =
        `${resumeScore}%`;


    careerXPElement.textContent =
        careerXP;


    sideCareerXPElement.textContent =
        careerXP;


    renderVerifiedSkills(
        verifiedSkills
    );


    renderProjects(
        projects
    );


    renderLearning(
        learningData
    );


    const profileHealth =
        calculateProfileHealth({
            verifiedSkills,
            projects,
            resumeScore,
            learningData
        });


    renderCareerHealth(
        profileHealth
    );


    renderTwinStatus(
        profileHealth
    );
}


/* =========================================
   BASIC PROFILE
========================================= */

function renderBasicProfile() {

    const name =
        userData.name ||
        userData.displayName ||
        userData.fullName ||
        currentUser.displayName ||
        "Career Explorer";


    profileName.textContent =
        name;


    profileEmail.textContent =
        userData.email ||
        currentUser.email ||
        "Not available";


    targetRole.textContent =
        userData.targetRole ||
        userData.careerGoal ||
        "Not set";


    const resumeExists =
        Boolean(
            userData.resumeData
        );


    resumeStatus.textContent =
        resumeExists
            ? "Analyzed"
            : "Not analyzed";


    if (resumeExists) {

        resumeStatus.className =
            "resume-complete";
    }
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


function renderVerifiedSkills(skills) {

    verifiedSkillsList.innerHTML = "";


    if (!skills.length) {

        verifiedSkillsList.innerHTML = `
            <div class="empty-content">
                No verified skills yet.
                <br>
                Review your skills and verify them.
            </div>
        `;

        return;
    }


    skills.forEach(
        skill => {

            const chip =
                document.createElement("span");

            chip.className =
                "profile-chip";

            chip.textContent =
                `✓ ${skill}`;

            verifiedSkillsList.appendChild(
                chip
            );
        }
    );
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


function renderProjects(projects) {

    recentProjects.innerHTML = "";


    if (!projects.length) {

        recentProjects.innerHTML = `
            <div class="empty-content">
                No projects added yet.
                <br>
                Add projects to strengthen your career evidence.
            </div>
        `;

        return;
    }


    projects
        .slice(0, 4)
        .forEach(
            project => {

                const card =
                    document.createElement("article");

                card.className =
                    "mini-project";


                const skills =
                    Array.isArray(
                        project.verifiedSkills
                    )
                        ? project.verifiedSkills
                        : [];


                card.innerHTML = `
                    <h3>
                        ${escapeHtml(
                            project.title ||
                            "Untitled Project"
                        )}
                    </h3>

                    ${
                        project.role
                            ? `
                                <div
                                    class="project-role"
                                >
                                    ${escapeHtml(
                                        project.role
                                    )}
                                </div>
                              `
                            : ""
                    }

                    <p>
                        ${escapeHtml(
                            project.description ||
                            "No description provided."
                        )}
                    </p>

                    ${
                        skills.length
                            ? `
                                <div class="project-mini-tags">
                                    ${skills
                                        .slice(0, 5)
                                        .map(
                                            skill =>
                                                `
                                                    <span class="project-mini-tag">
                                                        ✓ ${escapeHtml(skill)}
                                                    </span>
                                                `
                                        )
                                        .join("")}
                                </div>
                              `
                            : ""
                    }
                `;


                recentProjects.appendChild(
                    card
                );
            }
        );
}


/* =========================================
   RESUME SCORE
========================================= */

function getResumeScore() {

    const score =
        Number(
            userData.resumeData?.score
        );


    if (
        Number.isFinite(score) &&
        score >= 0
    ) {

        return Math.min(
            100,
            Math.round(score)
        );
    }


    return 0;
}


/* =========================================
   CAREER XP
========================================= */

function getCareerXP() {

    const explicitXP =
        Number(
            userData.careerXP ??
            userData.xp
        );


    if (
        Number.isFinite(explicitXP) &&
        explicitXP >= 0
    ) {

        return Math.round(
            explicitXP
        );
    }


    let xp = 0;


    /*
     * Verified skills
     */

    xp +=
        getVerifiedSkills().length *
        15;


    /*
     * Projects
     */

    xp +=
        getProjects().length *
        50;


    /*
     * Resume
     */

    if (
        userData.resumeData
    ) {

        xp += 50;
    }


    /*
     * Learning progress
     */

    xp +=
        countCompletedLearningUnits() *
        10;


    return xp;
}


/* =========================================
   LEARNING
========================================= */

async function loadLearningProgress() {

    const results = [];


    for (
        const source
        of curriculumSources
    ) {

        try {

            const response =
                await fetch(
                    source.path
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


            const percent =
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

                id:
                    source.id,

                name:
                    source.name,

                total,

                completed,

                percent
            });


        } catch (error) {

            console.warn(
                `Could not load ${source.name}:`,
                error
            );


            results.push({

                id:
                    source.id,

                name:
                    source.name,

                total: 0,

                completed: 0,

                percent: 0,

                unavailable: true
            });
        }
    }


    return results;
}


function renderLearning(courses) {

    learningCourses.innerHTML = "";


    if (!courses.length) {

        learningCourses.innerHTML = `
            <div class="empty-content">
                Learning progress will appear here.
            </div>
        `;

        return;
    }


    courses.forEach(
        course => {

            const row =
                document.createElement("div");

            row.className =
                "learning-course";


            row.innerHTML = `
                <div
                    class="learning-course-top"
                >

                    <strong>
                        ${escapeHtml(
                            course.name
                        )}
                    </strong>

                    <span
                        class="learning-percent"
                    >
                        ${course.percent}%
                    </span>

                </div>

                <div class="learning-bar">

                    <div
                        class="learning-fill"
                        style="width:${course.percent}%"
                    ></div>

                </div>
            `;


            learningCourses.appendChild(
                row
            );
        }
    );
}


/* =========================================
   CURRICULUM COUNTING
========================================= */

function countCurriculumUnits(
    curriculum
) {

    /*
     * DSA-style structure:
     * modules[] -> topics[]
     *
     * DBMS/OS/OOP structures can vary,
     * so this function checks multiple
     * common curriculum shapes.
     */

    if (
        curriculum?.modules &&
        Array.isArray(
            curriculum.modules
        )
    ) {

        return curriculum.modules.reduce(
            (total, module) => {

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
        curriculum?.chapters &&
        Array.isArray(
            curriculum.chapters
        )
    ) {

        return curriculum.chapters.reduce(
            (total, chapter) => {

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
        Array.isArray(curriculum)
    ) {

        return curriculum.length;
    }


    /*
     * Generic recursive count.
     */

    return recursiveTopicCount(
        curriculum
    );
}


function recursiveTopicCount(
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
                recursiveTopicCount(item),
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


    const nestedKeys = [
        "modules",
        "chapters",
        "topics",
        "lessons"
    ];


    nestedKeys.forEach(
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
                            recursiveTopicCount(item),
                        0
                    );
            }
        }
    );


    return count;
}


/* =========================================
   COMPLETED COUNT
========================================= */

function countCompletedUnits(
    progress
) {

    if (!progress) {
        return 0;
    }


    let total = 0;


    const arrays = [

        progress.completedTopics,

        progress.completedChapters,

        progress.completedLessons,

        progress.completedUnits

    ];


    arrays.forEach(
        array => {

            if (
                Array.isArray(array)
            ) {

                total +=
                    array.length;
            }
        }
    );


    /*
     * Avoid double-counting when
     * completedTopics is present.
     */

    if (
        Array.isArray(
            progress.completedTopics
        )
    ) {

        return progress.completedTopics.length;
    }


    if (
        Array.isArray(
            progress.completedChapters
        )
    ) {

        return progress.completedChapters.length;
    }


    return total;
}


function countCompletedLearningUnits() {

    let total = 0;


    [
        "dsaLearningProgress",
        "dbmsProgress",
        "osProgress",
        "oopsProgress"
    ].forEach(
        key => {

            total +=
                countCompletedUnits(
                    userData[key]
                );
        }
    );


    return total;
}


/* =========================================
   PROFILE HEALTH
========================================= */

function calculateProfileHealth({
    verifiedSkills,
    projects,
    resumeScore,
    learningData
}) {

    /*
     * Profile completeness is calculated
     * from transparent profile signals.
     */

    const components = [

        verifiedSkills.length > 0
            ? 25
            : 0,

        projects.length > 0
            ? 25
            : 0,

        resumeScore >= 70
            ? 25
            : resumeScore > 0
                ? 15
                : 0,

        averageLearningPercent(
            learningData
        ) >= 50
            ? 25
            : averageLearningPercent(
                learningData
            ) > 0
                ? 15
                : 0

    ];


    return Math.min(
        100,
        components.reduce(
            (a, b) => a + b,
            0
        )
    );
}


function averageLearningPercent(
    courses
) {

    const available =
        courses.filter(
            course =>
                !course.unavailable
        );


    if (!available.length) {
        return 0;
    }


    return Math.round(
        available.reduce(
            (
                total,
                course
            ) =>
                total +
                course.percent,
            0
        ) /
        available.length
    );
}


/* =========================================
   CAREER HEALTH UI
========================================= */

function renderCareerHealth(
    health
) {

    careerHealth.textContent =
        `${health}%`;


    careerHealthBar.style.width =
        `${health}%`;


    const ring =
        document.querySelector(
            ".health-ring"
        );


    if (ring) {

        const degrees =
            Math.round(
                health * 3.6
            );


        ring.style.background =
            `conic-gradient(
                #7c3aed 0deg,
                #a855f7 ${degrees}deg,
                #ece8f8 ${degrees}deg
            )`;
    }
}


/* =========================================
   TWIN STATUS
========================================= */

function renderTwinStatus(
    health
) {

    if (health >= 80) {

        twinStatus.textContent =
            "Profile well built";


        twinMessage.textContent =
            "Your resume, skills, projects and learning evidence are creating a strong Career Twin.";

        return;
    }


    if (health >= 50) {

        twinStatus.textContent =
            "Profile developing";


        twinMessage.textContent =
            "You have a useful career profile. Keep adding evidence and completing preparation.";

        return;
    }


    if (health >= 25) {

        twinStatus.textContent =
            "Profile building";


        twinMessage.textContent =
            "Add verified skills, projects and learning progress to build your Career Twin.";

        return;
    }


    twinStatus.textContent =
        "Getting started";


    twinMessage.textContent =
        "Begin with your resume, verify your skills and add your first project.";
}


/* =========================================
   UTILITIES
========================================= */

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