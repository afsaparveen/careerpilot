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


/* =========================================
   ELEMENTS
========================================= */

const userInitials =
    document.getElementById("userInitials");

const userName =
    document.getElementById("userName");

const menuInitials =
    document.getElementById("menuInitials");

const menuUserName =
    document.getElementById("menuUserName");

const targetRole =
    document.getElementById("targetRole");

const careerProgress =
    document.getElementById("careerProgress");

const streak =
    document.getElementById("streak");

const verifiedSkills =
    document.getElementById("verifiedSkills");

const careerXP =
    document.getElementById("careerXP");

const logoutBtn =
    document.getElementById("logoutBtn");

const liveSkillsContainer =
    document.getElementById(
        "liveSkillsContainer"
    );

const skillsLearnedCount =
    document.getElementById(
        "skillsLearnedCount"
    );

const resumeMatchCircle =
    document.getElementById(
        "resumeMatchCircle"
    );

const resumeMatchTitle =
    document.getElementById(
        "resumeMatchTitle"
    );

const resumeMatchText =
    document.getElementById(
        "resumeMatchText"
    );

const resumeMatchDetails =
    document.getElementById(
        "resumeMatchDetails"
    );

const careerTwinStatus =
    document.getElementById(
        "careerTwinStatus"
    );


/* =========================================
   AUTH
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.replace(
                "./login.html"
            );

            return;
        }


        try {

            await loadDashboard(user);

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        }

    }
);


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard(user) {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    const snapshot =
        await getDoc(userRef);


    if (!snapshot.exists()) {

        window.location.replace(
            "./onboarding.html"
        );

        return;
    }


    const data =
        snapshot.data() || {};


    /*
     * If onboarding has not been completed,
     * send the user back.
     */

    const completed =
        data.onboardingCompleted === true ||
        data.onboardingComplete === true;


    if (!completed) {

        window.location.replace(
            "./onboarding.html"
        );

        return;
    }


    renderUser(
        data,
        user
    );

    renderLearningProgress(
        data
    );

    renderResumeMatch(
        data
    );

    renderCareerProgress(
        data
    );

}


/* =========================================
   USER DETAILS
========================================= */

function renderUser(
    data,
    user
) {

    const name =
        data.name ||
        data.fullName ||
        user.displayName ||
        "Career Explorer";


    const role =
        data.targetRole ||
        "Target role not selected";


    if (userName) {

        userName.textContent =
            name;

    }


    if (targetRole) {

        targetRole.textContent =
            role;

    }


    const initials =
        getInitials(name);


    if (userInitials) {

        userInitials.textContent =
            initials;

    }


    /*
     * PROFILE DROPDOWN
     *
     * These elements are used by the
     * clickable AP profile menu.
     */

    if (menuInitials) {

        menuInitials.textContent =
            initials;

    }


    if (menuUserName) {

        menuUserName.textContent =
            name;

    }

}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    const words =
        String(name)
            .trim()
            .split(/\s+/);


    if (words.length === 1) {

        return words[0]
            .charAt(0)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[words.length - 1]
            .charAt(0)
    ).toUpperCase();

}


/* =========================================
   LEARNING PROGRESS
========================================= */

function renderLearningProgress(data) {

    const dsa =
        data.dsaProgress || {};

    const dbms =
        data.dbmsProgress || {};


    /*
     * DSA
     */

    const completedDSA =
        countObject(
            dsa.completedProblems
        );


    const masteredDSA =
        countObject(
            dsa.masteredPatterns
        );


    /*
     * DBMS
     */

    const completedDBMSTopics =
        countObject(
            dbms.completedTopics
        );


    const completedDBMSChapters =
        countObject(
            dbms.completedChapters
        );


    /*
     * Other learning modules
     */

    const aptitude =
        data.aptitudeProgress || {};

    const technical =
        data.technicalProgress || {};

    const interview =
        data.interviewProgress || {};

    const resume =
        data.resumeProgress || {};


    const completedAptitude =
        getProgressCount(
            aptitude
        );

    const completedTechnical =
        getProgressCount(
            technical
        );

    const completedInterview =
        getProgressCount(
            interview
        );


    /*
     * Calculate total activity.
     */

    const totalActivity =
        completedDSA +
        masteredDSA +
        completedDBMSTopics +
        completedDBMSChapters +
        completedAptitude +
        completedTechnical +
        completedInterview;


    /*
     * Career XP
     */

    const storedXP =
        Number(
            data.careerXP
        ) || 0;


    const calculatedXP =
        (
            completedDSA * 10
        ) +
        (
            masteredDSA * 25
        ) +
        (
            completedDBMSTopics * 8
        ) +
        (
            completedDBMSChapters * 30
        ) +
        (
            completedAptitude * 8
        ) +
        (
            completedTechnical * 10
        ) +
        (
            completedInterview * 15
        );


    const finalXP =
        Math.max(
            storedXP,
            calculatedXP
        );


    if (careerXP) {

        careerXP.textContent =
            finalXP;

    }


    /*
     * Verified skills
     *
     * A skill becomes active when
     * the user has actual learning activity
     * related to it.
     */

    const skillData =
        buildSkillData(
            data,
            completedDSA,
            completedDBMSTopics
        );


    renderSkills(
        skillData
    );


    /*
     * Skill count
     */

    const activeSkills =
        skillData.filter(
            skill =>
                skill.progress > 0
        ).length;


    if (verifiedSkills) {

        verifiedSkills.textContent =
            activeSkills;

    }


    if (skillsLearnedCount) {

        skillsLearnedCount.textContent =
            activeSkills;

    }


    /*
     * Study streak
     */

    const studyStreak =
        calculateStreak(
            data
        );


    if (streak) {

        streak.textContent =
            studyStreak;

    }

}


/* =========================================
   SKILL DATA
========================================= */

function buildSkillData(
    data,
    completedDSA,
    completedDBMS
) {

    const currentSkills =
        Array.isArray(
            data.currentSkills
        )
            ? data.currentSkills
            : [];


    const skills =
        [];


    /*
     * DSA
     */

    if (
        completedDSA > 0 ||
        hasSkill(
            currentSkills,
            "DSA"
        )
    ) {

        skills.push({

            name: "DSA",

            progress:
                calculateLearningPercentage(
                    completedDSA,
                    50
                ),

            className:
                "dsa-fill"

        });

    }


    /*
     * DBMS
     */

    if (
        completedDBMS > 0 ||
        hasSkill(
            currentSkills,
            "DBMS"
        )
    ) {

        skills.push({

            name: "DBMS",

            progress:
                calculateLearningPercentage(
                    completedDBMS,
                    50
                ),

            className:
                "dbms-fill"

        });

    }


    /*
     * Java
     */

    if (
        hasSkill(
            currentSkills,
            "Java"
        )
    ) {

        skills.push({

            name: "Java",

            progress:
                Number(
                    data.javaProgressPercentage
                ) || 0,

            className:
                "java-fill"

        });

    }


    /*
     * Python
     */

    if (
        hasSkill(
            currentSkills,
            "Python"
        )
    ) {

        skills.push({

            name: "Python",

            progress:
                Number(
                    data.pythonProgressPercentage
                ) || 0,

            className:
                "python-fill"

        });

    }


    /*
     * JavaScript
     */

    if (
        hasSkill(
            currentSkills,
            "JavaScript"
        )
    ) {

        skills.push({

            name: "JavaScript",

            progress:
                Number(
                    data.javascriptProgressPercentage
                ) || 0,

            className:
                "js-fill"

        });

    }


    /*
     * SQL
     */

    if (
        hasSkill(
            currentSkills,
            "SQL"
        )
    ) {

        skills.push({

            name: "SQL",

            progress:
                Number(
                    data.sqlProgressPercentage
                ) || 0,

            className:
                "sql-fill"

        });

    }


    /*
     * React
     */

    if (
        hasSkill(
            currentSkills,
            "React"
        )
    ) {

        skills.push({

            name: "React",

            progress:
                Number(
                    data.reactProgressPercentage
                ) || 0,

            className:
                "react-fill"

        });

    }


    /*
     * HTML/CSS
     */

    if (
        hasSkill(
            currentSkills,
            "HTML/CSS"
        )
    ) {

        skills.push({

            name: "HTML/CSS",

            progress:
                Number(
                    data.htmlCssProgressPercentage
                ) || 0,

            className:
                "html-fill"

        });

    }


    /*
     * Git/GitHub
     */

    if (
        hasSkill(
            currentSkills,
            "Git/GitHub"
        )
    ) {

        skills.push({

            name: "Git/GitHub",

            progress:
                Number(
                    data.gitProgressPercentage
                ) || 0,

            className:
                "git-fill"

        });

    }


    /*
     * If user has no selected skills,
     * show learning modules instead.
     */

    if (skills.length === 0) {

        skills.push({

            name: "DSA",

            progress:
                calculateLearningPercentage(
                    completedDSA,
                    50
                ),

            className:
                "dsa-fill"

        });


        skills.push({

            name: "DBMS",

            progress:
                calculateLearningPercentage(
                    completedDBMS,
                    50
                ),

            className:
                "dbms-fill"

        });

    }


    return skills;

}


/* =========================================
   RENDER SKILLS
========================================= */

function renderSkills(
    skills
) {

    if (!liveSkillsContainer) {

        return;
    }


    liveSkillsContainer.innerHTML =
        "";


    skills.forEach(
        skill => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "skill-row";


            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            skill.progress
                        ) || 0
                    )
                );


            row.innerHTML = `

                <div class="skill-name">

                    <span>
                        ${escapeHtml(
                            skill.name
                        )}
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

                <div class="skill-bar">

                    <div
                        class="skill-fill ${skill.className}"
                        style="width:${percentage}%"
                    ></div>

                </div>

            `;


            liveSkillsContainer.appendChild(
                row
            );

        }
    );

}


/* =========================================
   RESUME MATCH
========================================= */

function renderResumeMatch(
    data
) {

    /*
     * Accept several possible field names
     * so this works with the existing
     * resume implementation.
     */

    const resume =
        data.resumeAnalysis ||
        data.resumeData ||
        data.resume ||
        {};


    let score =
        firstNumber(
            resume.matchScore,
            resume.resumeMatchScore,
            resume.score,
            data.resumeMatchScore,
            data.resumeScore
        );


    /*
     * If there is no score, use the
     * resume analysis score.
     */

    if (
        score === null &&
        resume.analysisScore !== undefined
    ) {

        score =
            Number(
                resume.analysisScore
            );

    }


    if (
        score === null ||
        Number.isNaN(score)
    ) {

        if (resumeMatchCircle) {

            resumeMatchCircle.textContent =
                "--";

        }


        if (resumeMatchTitle) {

            resumeMatchTitle.textContent =
                "Resume not analyzed";

        }


        if (resumeMatchText) {

            resumeMatchText.textContent =
                "Upload your resume to see how well it matches your target role.";

        }


        return;
    }


    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(score)
            )
        );


    /*
     * Circle
     */

    if (resumeMatchCircle) {

        resumeMatchCircle.textContent =
            `${score}%`;


        const degree =
            score * 3.6;


        resumeMatchCircle.style.background =
            `
            conic-gradient(
                #7c3aed 0deg,
                #ec4899 ${degree}deg,
                #f3f4f6 ${degree}deg,
                #f3f4f6 360deg
            )
            `;

    }


    if (resumeMatchTitle) {

        resumeMatchTitle.textContent =
            `${score}% Resume Match`;

    }


    if (resumeMatchText) {

        resumeMatchText.textContent =
            "Your resume analysis is available for your target role.";

    }


    /*
     * Matched / missing skills
     */

    const matched =
        getArray(
            resume.matchedSkills,
            resume.matchingSkills,
            data.resumeMatchedSkills
        );


    const missing =
        getArray(
            resume.missingSkills,
            resume.skillsToImprove,
            data.resumeMissingSkills
        );


    if (resumeMatchDetails) {

        resumeMatchDetails.innerHTML =
            "";


        matched
            .slice(0, 5)
            .forEach(
                skill => {

                    addResumeTag(
                        skill,
                        false
                    );

                }
            );


        missing
            .slice(0, 5)
            .forEach(
                skill => {

                    addResumeTag(
                        skill,
                        true
                    );

                }
            );

    }

}


/* =========================================
   RESUME TAG
========================================= */

function addResumeTag(
    skill,
    missing
) {

    if (!resumeMatchDetails) {

        return;
    }


    const tag =
        document.createElement(
            "span"
        );


    tag.className =
        missing
            ? "resume-match-tag missing"
            : "resume-match-tag";


    tag.textContent =
        missing
            ? `Need: ${skill}`
            : `✓ ${skill}`;


    resumeMatchDetails.appendChild(
        tag
    );

}


/* =========================================
   CAREER PROGRESS
========================================= */

function renderCareerProgress(
    data
) {

    const dsa =
        data.dsaProgress || {};

    const dbms =
        data.dbmsProgress || {};


    const dsaCompleted =
        countObject(
            dsa.completedProblems
        );


    const dsaMastered =
        countObject(
            dsa.masteredPatterns
        );


    const dbmsTopics =
        countObject(
            dbms.completedTopics
        );


    const dbmsChapters =
        countObject(
            dbms.completedChapters
        );


    /*
     * Resume contribution
     */

    const resume =
        data.resumeAnalysis ||
        data.resumeData ||
        data.resume ||
        {};


    const resumeScore =
        firstNumber(
            resume.matchScore,
            resume.resumeMatchScore,
            resume.score,
            data.resumeMatchScore,
            data.resumeScore
        );


    /*
     * Calculate activity progress.
     */

    let progressPoints =
        0;


    progressPoints +=
        Math.min(
            30,
            dsaCompleted * 1
        );


    progressPoints +=
        Math.min(
            20,
            dsaMastered * 4
        );


    progressPoints +=
        Math.min(
            20,
            dbmsTopics * 2
        );


    progressPoints +=
        Math.min(
            15,
            dbmsChapters * 3
        );


    if (
        resumeScore !== null
    ) {

        progressPoints +=
            Math.round(
                resumeScore * 0.15
            );

    }


    /*
     * Onboarding itself contributes
     * a small base amount.
     */

    if (
        data.onboardingCompleted === true
    ) {

        progressPoints += 10;

    }


    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    progressPoints
                )
            )
        );


    if (careerProgress) {

        careerProgress.textContent =
            `${percentage}%`;

    }


    if (careerTwinStatus) {

        if (percentage >= 75) {

            careerTwinStatus.textContent =
                "Career profile advanced";

        } else if (
            percentage >= 40
        ) {

            careerTwinStatus.textContent =
                "Career profile growing";

        } else {

            careerTwinStatus.textContent =
                "Profile building";

        }

    }

}


/* =========================================
   STUDY STREAK
========================================= */

function calculateStreak(
    data
) {

    /*
     * Study activity can come from:
     *
     * 1. studyDates
     * 2. activityDates
     * 3. dsaProgress.dailyProblemDates
     */

    const studyDates =
        new Set();


    /* -----------------------------------------
       1. STUDY DATES
    ----------------------------------------- */

    if (
        Array.isArray(
            data.studyDates
        )
    ) {

        data.studyDates.forEach(
            date => {

                const normalized =
                    normalizeDate(date);

                if (normalized) {

                    studyDates.add(
                        normalized
                    );

                }

            }
        );

    }


    /* -----------------------------------------
       2. ACTIVITY DATES
    ----------------------------------------- */

    if (
        Array.isArray(
            data.activityDates
        )
    ) {

        data.activityDates.forEach(
            date => {

                const normalized =
                    normalizeDate(date);

                if (normalized) {

                    studyDates.add(
                        normalized
                    );

                }

            }
        );

    }


    /* -----------------------------------------
       3. DSA DAILY PROBLEM DATES
    ----------------------------------------- */

    const dailyProblemDates =
        data
            .dsaProgress
            ?.dailyProblemDates;


    if (
        dailyProblemDates &&
        typeof dailyProblemDates === "object"
    ) {

        Object.values(
            dailyProblemDates
        ).forEach(
            date => {

                const normalized =
                    normalizeDate(date);

                if (normalized) {

                    studyDates.add(
                        normalized
                    );

                }

            }
        );

    }


    /* -----------------------------------------
       NO STUDY ACTIVITY
    ----------------------------------------- */

    if (
        studyDates.size === 0
    ) {

        return 0;

    }


    /* -----------------------------------------
       TODAY
    ----------------------------------------- */

    const today =
        normalizeDate(
            new Date()
        );


    /*
     * If the user studied today,
     * start counting from today.
     *
     * If the user has not studied today,
     * start from yesterday so an existing
     * streak is not immediately lost.
     */

    let expected =
        today;


    if (
        !studyDates.has(
            today
        )
    ) {

        expected =
            previousDate(
                today
            );

    }


    /* -----------------------------------------
       COUNT STREAK
    ----------------------------------------- */

    let currentStreak =
        0;


    while (
        studyDates.has(
            expected
        )
    ) {

        currentStreak++;


        expected =
            previousDate(
                expected
            );

    }


    return currentStreak;

}


/* =========================================
   HELPERS
========================================= */

function countObject(
    object
) {

    if (
        !object ||
        typeof object !== "object"
    ) {

        return 0;

    }


    return Object.keys(
        object
    ).length;

}


function getProgressCount(
    data
) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        return 0;

    }


    if (
        Number.isFinite(
            Number(
                data.completed
            )
        )
    ) {

        return Number(
            data.completed
        );

    }


    return (
        countObject(
            data.completedTopics
        ) +
        countObject(
            data.completedProblems
        ) +
        countObject(
            data.completedQuestions
        )
    );

}


function calculateLearningPercentage(
    completed,
    target
) {

    if (
        completed <= 0
    ) {

        return 0;

    }


    return Math.min(
        100,
        Math.round(
            (
                completed /
                target
            ) * 100
        )
    );

}


function hasSkill(
    skills,
    wanted
) {

    return skills.some(
        skill =>
            String(skill)
                .toLowerCase()
                .includes(
                    wanted
                        .toLowerCase()
                )
    );

}


function firstNumber(
    ...values
) {

    for (
        const value
        of values
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            !Number.isNaN(
                Number(value)
            )
        ) {

            return Number(
                value
            );

        }

    }


    return null;

}


function getArray(
    ...values
) {

    for (
        const value
        of values
    ) {

        if (
            Array.isArray(value)
        ) {

            return value;

        }

    }


    return [];

}


function normalizeDate(
    value
) {

    const date =
        new Date(value);


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
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");

}


function previousDate(
    value
) {

    const date =
        new Date(
            `${value}T00:00:00`
        );


    date.setDate(
        date.getDate() - 1
    );


    return normalizeDate(
        date
    );

}


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


/* =========================================
   LOGOUT
========================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.replace(
                    "./login.html"
                );


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}