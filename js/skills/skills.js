import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let currentUser = null;

let detectedSkills = [];

let verifiedSkills = new Set();


/* =========================================
   DOM
========================================= */

const skillsList = document.getElementById("skillsList");
const skillsMessage = document.getElementById("skillsMessage");

const detectedCount = document.getElementById("detectedCount");
const verifiedCount = document.getElementById("verifiedCount");

const summaryVerifiedCount =
    document.getElementById("summaryVerifiedCount");

const verificationPercent =
    document.getElementById("verificationPercent");


/* =========================================
   AUTH
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        currentUser = user;

        await loadSkills();
    }
);


/* =========================================
   LOAD FIRESTORE DATA
========================================= */

async function loadSkills() {

    showMessage(
        "Loading your resume skills..."
    );

    try {

        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );

        const snapshot =
            await getDoc(userRef);

        if (!snapshot.exists()) {

            detectedSkills = [];

            verifiedSkills =
                new Set();

            render();

            return;
        }

        const data =
            snapshot.data();


        /* ---------------------------------
           DETECTED SKILLS
        --------------------------------- */

        const resumeEvidence =
            data.resumeEvidence || {};

        const resumeData =
            data.resumeData || {};


        detectedSkills =
            Array.isArray(
                resumeEvidence.detectedSkills
            )
                ? resumeEvidence.detectedSkills
                : Array.isArray(
                    resumeData.detectedSkills
                )
                    ? resumeData.detectedSkills
                    : [];


        detectedSkills =
            [
                ...new Set(
                    detectedSkills
                        .map(skill => String(skill).trim())
                        .filter(Boolean)
                )
            ];


        /* ---------------------------------
           VERIFIED SKILLS
        --------------------------------- */

        const existingVerified =
            data.verifiedSkills;


        const skillVerification =
            data.skillVerification || {};


        let verifiedArray = [];


        if (
            Array.isArray(existingVerified)
        ) {

            verifiedArray =
                existingVerified;

        } else if (
            existingVerified &&
            typeof existingVerified === "object"
        ) {

            verifiedArray =
                Object.entries(existingVerified)
                    .filter(
                        ([, value]) =>
                            value === true
                    )
                    .map(
                        ([skill]) =>
                            skill
                    );

        } else if (
            Array.isArray(
                skillVerification.verifiedSkills
            )
        ) {

            verifiedArray =
                skillVerification.verifiedSkills;

        }


        verifiedSkills =
            new Set(
                verifiedArray
                    .map(
                        skill =>
                            String(skill).trim()
                    )
                    .filter(Boolean)
            );


        render();

    } catch (error) {

        console.error(
            "Skills loading error:",
            error
        );

        showMessage(
            "Could not load your skills. Please refresh the page.",
            true
        );
    }
}


/* =========================================
   RENDER
========================================= */

function render() {

    updateSummary();

    skillsList.innerHTML = "";

    hideMessage();


    if (!detectedSkills.length) {

        skillsList.innerHTML = `
            <div class="empty-skills">

                <div class="empty-skills-icon">
                    📄
                </div>

                <h3>
                    No resume skills found yet
                </h3>

                <p>
                    Upload and analyze your resume first.
                    Once technical skills are detected,
                    they will appear here for verification.
                </p>

                <a href="resume.html">
                    Analyze Resume
                </a>

            </div>
        `;

        return;
    }


    detectedSkills.forEach(
        skill => {

            const verified =
                verifiedSkills.has(skill);

            const card =
                document.createElement("div");

            card.className =
                "skill-card";


            card.innerHTML = `
                <div class="skill-main">

                    <div class="skill-name-row">

                        <span class="skill-name">
                            ${escapeHtml(skill)}
                        </span>

                        <span class="detected-badge">
                            Detected
                        </span>

                        ${
                            verified
                                ? `
                                    <span class="verified-badge">
                                        Verified
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                    <div class="skill-subtext">
                        ${
                            verified
                                ? "You verified this skill for your CareerPilot profile."
                                : "Detected from your resume. Review before verifying."
                        }
                    </div>

                </div>


                <button
                    class="verify-button ${
                        verified
                            ? "unverify"
                            : "verify"
                    }"
                    data-skill="${escapeHtml(skill)}"
                >
                    ${
                        verified
                            ? "✓ Verified"
                            : "Verify Skill"
                    }
                </button>
            `;


            const button =
                card.querySelector(
                    ".verify-button"
                );


            button.addEventListener(
                "click",
                async () => {

                    await toggleSkill(
                        skill
                    );
                }
            );


            skillsList.appendChild(card);
        }
    );
}


/* =========================================
   TOGGLE VERIFICATION
========================================= */

async function toggleSkill(skill) {

    if (!currentUser) {
        return;
    }


    const currentlyVerified =
        verifiedSkills.has(skill);


    if (currentlyVerified) {

        verifiedSkills.delete(skill);

    } else {

        verifiedSkills.add(skill);
    }


    render();


    try {

        await saveVerifiedSkills();

        showToast(
            currentlyVerified
                ? `${skill} removed from verified skills.`
                : `${skill} verified successfully.`,
            "success"
        );

    } catch (error) {

        console.error(
            "Verification save error:",
            error
        );


        /*
         * Revert UI change if Firestore
         * save fails.
         */

        if (currentlyVerified) {

            verifiedSkills.add(skill);

        } else {

            verifiedSkills.delete(skill);
        }


        render();


        showToast(
            "Could not save the verification. Please try again.",
            "error"
        );
    }
}


/* =========================================
   SAVE VERIFIED SKILLS
========================================= */

async function saveVerifiedSkills() {

    const verifiedArray =
        [...verifiedSkills]
            .sort(
                (a, b) =>
                    a.localeCompare(b)
            );


    const verifiedMap = {};

    verifiedArray.forEach(
        skill => {
            verifiedMap[skill] = true;
        }
    );


    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    await setDoc(
        userRef,
        {

            verifiedSkills:
                verifiedMap,

            skillVerification: {

                verifiedSkills:
                    verifiedArray,

                totalVerified:
                    verifiedArray.length,

                updatedAt:
                    new Date().toISOString()
            }

        },
        {
            merge: true
        }
    );
}


/* =========================================
   SUMMARY
========================================= */

function updateSummary() {

    const detectedTotal =
        detectedSkills.length;


    const verifiedTotal =
        verifiedSkills.size;


    const percent =
        detectedTotal === 0
            ? 0
            : Math.round(
                (
                    verifiedTotal /
                    detectedTotal
                ) * 100
            );


    detectedCount.textContent =
        detectedTotal;


    verifiedCount.textContent =
        verifiedTotal;


    summaryVerifiedCount.textContent =
        verifiedTotal;


    verificationPercent.textContent =
        `${percent}%`;
}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    isError = false
) {

    skillsMessage.textContent =
        message;

    skillsMessage.classList.add(
        "visible"
    );


    if (isError) {

        skillsMessage.classList.add(
            "error"
        );

    } else {

        skillsMessage.classList.remove(
            "error"
        );
    }
}


function hideMessage() {

    skillsMessage.classList.remove(
        "visible"
    );

    skillsMessage.textContent = "";
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
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.className =
        `toast show ${type}`.trim();


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.className =
                    "toast";

            },
            2600
        );
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

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