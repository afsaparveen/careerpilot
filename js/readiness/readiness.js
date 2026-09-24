import { auth, db } from "../firebase/firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// DOM
// ======================================================

const targetRoleEl =
    document.getElementById("targetRole");

const readinessScoreEl =
    document.getElementById("readinessScore");

const readinessMessageEl =
    document.getElementById("readinessMessage");

const readinessScoreRing =
    document.querySelector(".readiness-score-ring");

const learningScoreEl =
    document.getElementById("learningScore");

const evidenceScoreEl =
    document.getElementById("evidenceScore");

const interviewScoreEl =
    document.getElementById("interviewScore");

const companyScoreEl =
    document.getElementById("companyScore");

const overallProgressBar =
    document.getElementById("overallProgressBar");

const overallProgressText =
    document.getElementById("overallProgressText");

const readinessAreas =
    document.getElementById("readinessAreas");

const nextActionTitle =
    document.getElementById("nextActionTitle");

const nextActionDescription =
    document.getElementById("nextActionDescription");

const nextActionButton =
    document.getElementById("nextActionButton");

const finalChecklist =
    document.getElementById("finalChecklist");


// ======================================================
// CONSTANTS
// ======================================================

const APTITUDE_TOPIC_COUNT = 4;
const DSA_TOPIC_COUNT = 37;


// ======================================================
// HELPERS
// ======================================================

function safeNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function clamp(value) {

    return Math.max(
        0,
        Math.min(
            100,
            Math.round(
                safeNumber(value)
            )
        )
    );
}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ======================================================
// GENERIC COURSE PROGRESS
// ======================================================

function getCourseProgress(progressObject) {

    if (!progressObject) {
        return 0;
    }


    if (
        typeof progressObject.percentage ===
        "number"
    ) {

        return clamp(
            progressObject.percentage
        );
    }


    if (
        typeof progressObject.progress ===
        "number"
    ) {

        return clamp(
            progressObject.progress
        );
    }


    const completedTopics =
        Array.isArray(
            progressObject.completedTopics
        )
            ? progressObject.completedTopics.length
            : (
                progressObject.completedTopics &&
                typeof progressObject.completedTopics ===
                    "object"
                    ? Object.values(
                        progressObject.completedTopics
                    ).filter(Boolean).length
                    : 0
            );


    const completedChapters =
        Array.isArray(
            progressObject.completedChapters
        )
            ? progressObject.completedChapters.length
            : (
                progressObject.completedChapters &&
                typeof progressObject.completedChapters ===
                    "object"
                    ? Object.values(
                        progressObject.completedChapters
                    ).filter(Boolean).length
                    : 0
            );


    const completedModules =
        Array.isArray(
            progressObject.completedModules
        )
            ? progressObject.completedModules.length
            : (
                progressObject.completedModules &&
                typeof progressObject.completedModules ===
                    "object"
                    ? Object.values(
                        progressObject.completedModules
                    ).filter(Boolean).length
                    : 0
            );


    if (completedTopics > 0) {

        return clamp(
            completedTopics * 10
        );
    }


    if (completedChapters > 0) {

        return clamp(
            completedChapters * 10
        );
    }


    if (completedModules > 0) {

        return clamp(
            completedModules * 15
        );
    }


    return 0;
}


// ======================================================
// RESUME
// ======================================================

function getResumeScore(data) {

    const exists =
        Boolean(
            data.resumeData ||
            data.resumeExtractedText
        );


    if (!exists) {
        return 0;
    }


    if (
        typeof data.resumeEvidence?.score ===
        "number"
    ) {

        return clamp(
            data.resumeEvidence.score
        );
    }


    return 50;
}


// ======================================================
// VERIFIED SKILLS
// ======================================================

function getVerifiedSkills(data) {

    if (
        Array.isArray(
            data.skillVerification?.verifiedSkills
        )
    ) {

        return data.skillVerification
            .verifiedSkills
            .filter(Boolean);
    }


    if (
        Array.isArray(
            data.verifiedSkills
        )
    ) {

        return data.verifiedSkills
            .filter(Boolean);
    }


    if (
        data.verifiedSkills &&
        typeof data.verifiedSkills ===
            "object"
    ) {

        return Object.entries(
            data.verifiedSkills
        )
            .filter(
                ([, value]) =>
                    Boolean(value)
            )
            .map(
                ([key]) =>
                    key
            );
    }


    return [];
}


// ======================================================
// PROJECTS
// ======================================================

function getProjects(data) {

    return Array.isArray(data.projects)
        ? data.projects
        : [];
}


// ======================================================
// DSA PROGRESS
// ======================================================

function getDSAProgress(data) {

    const progress =
        data.dsaLearningProgress || {};


    if (
        progress.dsaCompleted === true
    ) {

        return 100;
    }


    const completedTopics =
        Array.isArray(
            progress.completedTopics
        )
            ? progress.completedTopics.length
            : 0;


    if (completedTopics > 0) {

        return clamp(
            (
                completedTopics /
                DSA_TOPIC_COUNT
            ) * 100
        );
    }


    const completedModules =
        Array.isArray(
            progress.completedModules
        )
            ? progress.completedModules.length
            : 0;


    if (completedModules > 0) {

        return clamp(
            completedModules * 15
        );
    }


    return 0;
}


// ======================================================
// APTITUDE PROGRESS
// ======================================================

function getAptitudeProgress(data) {

    const progress =
        data.aptitudeLearningProgress || {};


    const passedTopics =
        Array.isArray(
            progress.passedTopics
        )
            ? progress.passedTopics.length
            : 0;


    return clamp(
        (
            passedTopics /
            APTITUDE_TOPIC_COUNT
        ) * 100
    );
}


// ======================================================
// INTERVIEW PROGRESS
// ======================================================

function getInterviewProgress(data) {

    const progress =
        data.interviewProgress || {};


    const questionsAttempted =
        safeNumber(
            progress.questionsAttempted
        );


    if (
        questionsAttempted === 0
    ) {

        return 0;
    }


    return clamp(
        safeNumber(
            progress.accuracy
        )
    );
}


// ======================================================
// COMPANY PROGRESS
// ======================================================

function getCompanyProgress(data) {

    const companies =
        Array.isArray(data.companies)
            ? data.companies
            : [];


    if (companies.length === 0) {
        return 0;
    }


    const preparationStatuses = [
        "Preparing",
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected"
    ];


    const prepared =
        companies.filter(
            company =>
                preparationStatuses.includes(
                    company.status
                )
        ).length;


    return clamp(
        (
            prepared /
            companies.length
        ) * 100
    );
}


// ======================================================
// TECHNICAL PROGRESS
// ======================================================

function getTechnicalProgress(data) {

    const subjects = [

        getCourseProgress(
            data.dbmsProgress
        ),

        getCourseProgress(
            data.osProgress
        ),

        getCourseProgress(
            data.cnProgress ||
            data.computerNetworksProgress
        ),

        getCourseProgress(
            data.oopProgress ||
            data.oopsProgress
        )

    ];


    return clamp(
        subjects.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        ) /
        subjects.length
    );
}


// ======================================================
// CALCULATE ALL SCORES
// ======================================================

function calculateData(data) {

    const resume =
        getResumeScore(data);


    const verifiedSkills =
        getVerifiedSkills(data);


    const skillProgress =
        clamp(
            Math.min(
                (
                    verifiedSkills.length /
                    8
                ) * 100,
                100
            )
        );


    const projects =
        getProjects(data);


    const projectProgress =
        clamp(
            Math.min(
                (
                    projects.length /
                    2
                ) * 100,
                100
            )
        );


    const dsa =
        getDSAProgress(data);


    const aptitude =
        getAptitudeProgress(data);


    const technical =
        getTechnicalProgress(data);


    const interview =
        getInterviewProgress(data);


    const companies =
        getCompanyProgress(data);


    /*
        Overall readiness is based on:

        DSA            15%
        Aptitude       10%
        Technical      15%
        Resume         10%
        Skills         10%
        Projects       10%
        Interview      15%
        Companies       5%
    */

    const overall =
        clamp(
            dsa * 0.15 +
            aptitude * 0.10 +
            technical * 0.15 +
            resume * 0.10 +
            skillProgress * 0.10 +
            projectProgress * 0.10 +
            interview * 0.15 +
            companies * 0.05
        );


    const learning =
        clamp(
            (
                dsa +
                aptitude +
                technical
            ) / 3
        );


    const evidence =
        clamp(
            (
                resume +
                skillProgress +
                projectProgress
            ) / 3
        );


    return {

        overall,

        learning,

        evidence,

        interview,

        companies,

        areas: {

            resume,

            skills: skillProgress,

            projects: projectProgress,

            dsa,

            aptitude,

            technical,

            interview,

            companies

        }

    };
}


// ======================================================
// AREA DEFINITIONS
// ======================================================

function buildAreas(scores) {

    return [

        {
            id: "resume",

            title: "Resume",

            description:
                "Resume analysis and evidence quality",

            icon: "📄",

            score:
                scores.resume,

            href:
                "resume.html",

            action:
                "Improve Resume"
        },


        {
            id: "skills",

            title: "Verified Skills",

            description:
                "Skills you have explicitly verified",

            icon: "✅",

            score:
                scores.skills,

            href:
                "skills.html",

            action:
                "Verify Skills"
        },


        {
            id: "projects",

            title: "Projects",

            description:
                "Project evidence for your profile",

            icon: "🚀",

            score:
                scores.projects,

            href:
                "projects.html",

            action:
                "Build Project"
        },


        {
            id: "dsa",

            title: "DSA Learning",

            description:
                "Structured DSA topics and assessments",

            icon: "🧩",

            score:
                scores.dsa,

            href:
                "dsa-learning.html",

            action:
                "Continue DSA"
        },


        {
            id: "aptitude",

            title: "Aptitude Learning",

            description:
                "Lessons followed by topic questions",

            icon: "🧮",

            score:
                scores.aptitude,

            href:
                "aptitude-learning.html",

            action:
                "Continue Aptitude"
        },


        {
            id: "technical",

            title: "Technical Subjects",

            description:
                "DBMS, OS, CN and OOP preparation",

            icon: "💻",

            score:
                scores.technical,

            href:
                "technical.html",

            action:
                "Continue Technical"
        },


        {
            id: "interview",

            title: "Interview",

            description:
                "Technical, project, HR and mock practice",

            icon: "🎤",

            score:
                scores.interview,

            href:
                "interview.html",

            action:
                "Practice Interview"
        },


        {
            id: "companies",

            title: "Company Preparation",

            description:
                "Companies, applications and interviews",

            icon: "🏢",

            score:
                scores.companies,

            href:
                "companies.html",

            action:
                "Track Companies"
        }

    ];
}


// ======================================================
// STATUS
// ======================================================

function getStatus(score) {

    if (score >= 100) {

        return {
            label: "Complete",
            className: "status-complete"
        };
    }


    if (score > 0) {

        return {
            label: "In Progress",
            className: "status-progress"
        };
    }


    return {
        label: "Not Started",
        className: "status-start"
    };
}


// ======================================================
// RENDER AREA CARDS
// ======================================================

function renderAreas(areas) {

    if (!readinessAreas) {
        return;
    }


    readinessAreas.innerHTML =
        areas
            .map(area => {

                const status =
                    getStatus(
                        area.score
                    );


                return `
                    <article class="readiness-area">

                        <div
                            class="readiness-area-top"
                        >

                            <div class="area-icon">
                                ${area.icon}
                            </div>


                            <div class="area-info">

                                <h3>
                                    ${escapeHtml(
                                        area.title
                                    )}
                                </h3>

                                <p>
                                    ${escapeHtml(
                                        area.description
                                    )}
                                </p>

                            </div>


                            <strong
                                class="area-percentage"
                            >
                                ${area.score}%
                            </strong>

                        </div>


                        <div
                            class="area-progress-track"
                        >

                            <div
                                class="area-progress-fill"
                                style="
                                    width:${area.score}%;
                                "
                            ></div>

                        </div>


                        <div
                            class="area-footer"
                        >

                            <span
                                class="
                                    area-status
                                    ${status.className}
                                "
                            >
                                ${status.label}
                            </span>


                            <a
                                href="${escapeHtml(
                                    area.href
                                )}"
                                class="area-link"
                            >
                                ${escapeHtml(
                                    area.action
                                )}
                                →
                            </a>

                        </div>

                    </article>
                `;
            })
            .join("");
}


// ======================================================
// NEXT ACTION
// ======================================================

function getNextAction(areas) {

    const unfinished =
        [...areas]
            .sort(
                (a, b) =>
                    a.score -
                    b.score
            );


    const next =
        unfinished[0];


    if (!next) {

        return {

            title:
                "Review your placement preparation",

            description:
                "Continue practicing and maintaining your preparation across all areas.",

            href:
                "dashboard.html",

            button:
                "Open Dashboard"

        };
    }


    return {

        title:
            next.action,

        description:
            `${next.title} is currently at ${next.score}%. Continue this area to strengthen your placement preparation.`,

        href:
            next.href,

        button:
            "Continue →"

    };
}


// ======================================================
// READINESS MESSAGE
// ======================================================

function getReadinessMessage(score) {

    if (score >= 90) {

        return "Most of your preparation areas are well developed. Keep practicing and maintaining your progress.";
    }


    if (score >= 75) {

        return "Your preparation has reached an advanced stage. Focus on the remaining weaker areas.";
    }


    if (score >= 50) {

        return "You have established a solid preparation base. Continue strengthening unfinished areas.";
    }


    if (score >= 25) {

        return "Your placement preparation is underway. Keep building evidence and learning consistently.";
    }


    return "Start with your resume, skills, learning and interview foundation.";
}


// ======================================================
// SCORE RING
// ======================================================

function updateScoreRing(score) {

    if (!readinessScoreRing) {
        return;
    }


    const degrees =
        Math.round(
            score * 3.6
        );


    readinessScoreRing.style.background =
        `
            conic-gradient(
                #7c3aed 0deg,
                #a855f7 ${Math.round(
                    degrees * 0.65
                )}deg,
                #ec4899 ${degrees}deg,
                #eeeaf7 ${degrees}deg
            )
        `;
}


// ======================================================
// FINAL CHECKLIST
// ======================================================

function renderChecklist(areas) {

    if (!finalChecklist) {
        return;
    }


    finalChecklist.innerHTML =
        areas
            .map(area => {

                const complete =
                    area.score >= 100;


                return `
                    <div
                        class="
                            check-item
                            ${
                                complete
                                    ? "check-complete"
                                    : "check-pending"
                            }
                        "
                    >

                        <div class="check-icon">
                            ${
                                complete
                                    ? "✓"
                                    : "!"
                            }
                        </div>


                        <span>
                            ${escapeHtml(
                                area.title
                            )}
                        </span>


                        <strong>
                            ${area.score}%
                        </strong>

                    </div>
                `;
            })
            .join("");
}


// ======================================================
// RENDER DASHBOARD
// ======================================================

function renderDashboard(data) {

    const result =
        calculateData(data);


    const areas =
        buildAreas(
            result.areas
        );


    // Target role

    if (targetRoleEl) {

        targetRoleEl.textContent =
            data.targetRole ||
            data.careerGoal ||
            "Not selected";
    }


    // Overall score

    if (readinessScoreEl) {

        readinessScoreEl.textContent =
            `${result.overall}%`;
    }


    if (overallProgressText) {

        overallProgressText.textContent =
            `${result.overall}%`;
    }


    if (overallProgressBar) {

        overallProgressBar.style.width =
            `${result.overall}%`;
    }


    updateScoreRing(
        result.overall
    );


    if (readinessMessageEl) {

        readinessMessageEl.textContent =
            getReadinessMessage(
                result.overall
            );
    }


    // Summary

    if (learningScoreEl) {

        learningScoreEl.textContent =
            `${result.learning}%`;
    }


    if (evidenceScoreEl) {

        evidenceScoreEl.textContent =
            `${result.evidence}%`;
    }


    if (interviewScoreEl) {

        interviewScoreEl.textContent =
            `${result.interview}%`;
    }


    if (companyScoreEl) {

        companyScoreEl.textContent =
            `${result.companies}%`;
    }


    // Areas

    renderAreas(
        areas
    );


    // Next action

    const nextAction =
        getNextAction(
            areas
        );


    if (nextActionTitle) {

        nextActionTitle.textContent =
            nextAction.title;
    }


    if (nextActionDescription) {

        nextActionDescription.textContent =
            nextAction.description;
    }


    if (nextActionButton) {

        nextActionButton.href =
            nextAction.href;

        nextActionButton.textContent =
            nextAction.button;
    }


    // Checklist

    renderChecklist(
        areas
    );
}


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


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const snapshot =
                await getDoc(
                    userRef
                );


            const data =
                snapshot.exists()
                    ? snapshot.data()
                    : {};


            renderDashboard(
                data
            );


        } catch (error) {

            console.error(
                "Readiness loading error:",
                error
            );


            if (readinessAreas) {

                readinessAreas.innerHTML = `
                    <div class="loading-state">

                        <p>
                            Could not calculate readiness.
                            Please refresh and try again.
                        </p>

                    </div>
                `;
            }
        }

    }
);