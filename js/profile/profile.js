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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =====================================================
   DOM
===================================================== */

const profileInitials =
    document.getElementById(
        "profileInitials"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

const profileRole =
    document.getElementById(
        "profileRole"
    );

const profileForm =
    document.getElementById(
        "profileForm"
    );

const fullNameInput =
    document.getElementById(
        "fullName"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const targetRoleInput =
    document.getElementById(
        "targetRole"
    );

const targetCompaniesInput =
    document.getElementById(
        "targetCompanies"
    );

const currentSkillsInput =
    document.getElementById(
        "currentSkills"
    );

const dailyStudyTimeInput =
    document.getElementById(
        "dailyStudyTime"
    );

const placementTimelineInput =
    document.getElementById(
        "placementTimeline"
    );

const learningPriorityInput =
    document.getElementById(
        "learningPriority"
    );

const profileMessage =
    document.getElementById(
        "profileMessage"
    );

const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );


/* Career information */

const careerRole =
    document.getElementById(
        "careerRole"
    );

const careerCompanies =
    document.getElementById(
        "careerCompanies"
    );

const careerSkills =
    document.getElementById(
        "careerSkills"
    );

const careerStudyTime =
    document.getElementById(
        "careerStudyTime"
    );

const careerTimeline =
    document.getElementById(
        "careerTimeline"
    );

const careerPriority =
    document.getElementById(
        "careerPriority"
    );


/* Statistics */

const profileStreak =
    document.getElementById(
        "profileStreak"
    );

const dsaCompleted =
    document.getElementById(
        "dsaCompleted"
    );

const dbmsCompleted =
    document.getElementById(
        "dbmsCompleted"
    );

const interviewCompleted =
    document.getElementById(
        "interviewCompleted"
    );


/* Account */

const accountUid =
    document.getElementById(
        "accountUid"
    );

const accountCreated =
    document.getElementById(
        "accountCreated"
    );

const authProvider =
    document.getElementById(
        "authProvider"
    );


/* =====================================================
   HELPERS
===================================================== */

function getInitials(name) {

    const words =
        String(name || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (!words.length) {

        return "CP";
    }


    if (words.length === 1) {

        return words[0]
            .slice(0, 2)
            .toUpperCase();
    }


    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}


function convertToArray(value) {

    if (Array.isArray(value)) {

        return value
            .map(item =>
                String(item).trim()
            )
            .filter(Boolean);
    }


    if (
        typeof value ===
        "string"
    ) {

        return value
            .split(",")
            .map(item =>
                item.trim()
            )
            .filter(Boolean);
    }


    return [];
}


function arrayToText(value) {

    return convertToArray(value)
        .join(", ");
}


function countObject(value) {

    if (!value) {

        return 0;
    }


    if (Array.isArray(value)) {

        return value.length;
    }


    if (
        typeof value ===
        "object"
    ) {

        return Object.keys(value)
            .filter(
                key =>
                    value[key] === true
            )
            .length;
    }


    return 0;
}


/* =====================================================
   STREAK
===================================================== */

function calculateStreak(data) {

    const dates =
        new Set();


    if (
        Array.isArray(
            data.studyDates
        )
    ) {

        data.studyDates.forEach(
            date => {

                if (date) {

                    dates.add(
                        String(date)
                    );
                }
            }
        );
    }


    if (
        Array.isArray(
            data.activityDates
        )
    ) {

        data.activityDates.forEach(
            date => {

                if (date) {

                    dates.add(
                        String(date)
                    );
                }
            }
        );
    }


    const dailyDates =
        data
            .dsaProgress
            ?.dailyProblemDates;


    if (
        dailyDates &&
        typeof dailyDates ===
        "object"
    ) {

        Object.values(
            dailyDates
        ).forEach(
            date => {

                if (date) {

                    dates.add(
                        String(date)
                    );
                }
            }
        );
    }


    if (!dates.size) {

        return 0;
    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    let streak = 0;


    const hasToday =
        dates.has(
            getDateKey(today)
        );


    if (!hasToday) {

        today.setDate(
            today.getDate() - 1
        );
    }


    while (
        dates.has(
            getDateKey(today)
        )
    ) {

        streak++;


        today.setDate(
            today.getDate() - 1
        );
    }


    return streak;
}


function getDateKey(date) {

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


/* =====================================================
   LOAD PROFILE
===================================================== */

async function loadProfile(
    user
) {

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


    if (
        !snapshot.exists()
    ) {

        window.location.replace(
            "./onboarding.html"
        );

        return;
    }


    const data =
        snapshot.data() || {};


    const name =
        data.fullName ||
        data.name ||
        user.displayName ||
        "Career Explorer";


    const email =
        data.email ||
        user.email ||
        "";


    const role =
        data.targetRole ||
        "Target role not selected";


    /* Header */

    profileInitials.textContent =
        getInitials(name);

    profileName.textContent =
        name;

    profileEmail.textContent =
        email;

    profileRole.textContent =
        role;


    /* Form */

    fullNameInput.value =
        name;

    emailInput.value =
        email;

    targetRoleInput.value =
        data.targetRole ||
        "";

    targetCompaniesInput.value =
        arrayToText(
            data.targetCompanies
        );

    currentSkillsInput.value =
        arrayToText(
            data.currentSkills
        );

    dailyStudyTimeInput.value =
        data.dailyStudyTime ||
        "";

    placementTimelineInput.value =
        data.placementTimeline ||
        "";

    learningPriorityInput.value =
        data.learningPriority ||
        "";


    /* Career */

    careerRole.textContent =
        data.targetRole ||
        "Not selected";


    careerCompanies.textContent =
        convertToArray(
            data.targetCompanies
        ).length;


    careerSkills.textContent =
        convertToArray(
            data.currentSkills
        ).length;


    careerStudyTime.textContent =
        data.dailyStudyTime ||
        "Not selected";


    careerTimeline.textContent =
        data.placementTimeline ||
        "Not selected";


    careerPriority.textContent =
        data.learningPriority ||
        "Not selected";


    /* Statistics */

    profileStreak.textContent =
        calculateStreak(data);


    dsaCompleted.textContent =
        countObject(
            data
                .dsaProgress
                ?.completedProblems
        );


    dbmsCompleted.textContent =
        countObject(
            data
                .dbmsProgress
                ?.completedTopics
        );


    interviewCompleted.textContent =
        Number(
            data
                .interviewProgress
                ?.questionsAttempted
        ) || 0;


    /* Account */

    accountUid.textContent =
        user.uid;


    if (
        data.createdAt &&
        typeof data.createdAt.toDate ===
        "function"
    ) {

        accountCreated.textContent =
            data.createdAt
                .toDate()
                .toLocaleDateString();

    } else {

        accountCreated.textContent =
            "Available from account creation";
    }


    const provider =
        user.providerData
            .map(
                item =>
                    item.providerId
            )
            .join(", ");


    authProvider.textContent =
        provider || "Firebase Authentication";
}


/* =====================================================
   SAVE PROFILE
===================================================== */

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const user =
            auth.currentUser;


        if (!user) {

            return;
        }


        const name =
            fullNameInput.value.trim();


        if (!name) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            return;
        }


        saveProfileBtn.disabled =
            true;

        saveProfileBtn.textContent =
            "Saving...";


        try {

            const targetCompanies =
                convertToArray(
                    targetCompaniesInput.value
                );


            const currentSkills =
                convertToArray(
                    currentSkillsInput.value
                );


            const profileData = {

                name: name,

                fullName: name,

                targetRole:
                    targetRoleInput.value.trim(),

                targetCompanies:
                    targetCompanies,

                currentSkills:
                    currentSkills,

                dailyStudyTime:
                    dailyStudyTimeInput.value,

                placementTimeline:
                    placementTimelineInput.value,

                learningPriority:
                    learningPriorityInput.value,

                updatedAt:
                    serverTimestamp()

            };


            await setDoc(

                doc(
                    db,
                    "users",
                    user.uid
                ),

                profileData,

                {
                    merge: true
                }

            );


            /*
             * Update Firebase Authentication
             * display name too.
             */

            if (
                user.displayName !==
                name
            ) {

                const {
                    updateProfile
                } =
                    await import(
                        "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"
                    );


                await updateProfile(
                    user,
                    {
                        displayName:
                            name
                    }
                );
            }


            showMessage(
                "Profile updated successfully.",
                "success"
            );


            profileInitials.textContent =
                getInitials(name);

            profileName.textContent =
                name;


            careerRole.textContent =
                profileData.targetRole ||
                "Not selected";


            careerCompanies.textContent =
                targetCompanies.length;


            careerSkills.textContent =
                currentSkills.length;


            careerStudyTime.textContent =
                profileData.dailyStudyTime ||
                "Not selected";


            careerTimeline.textContent =
                profileData.placementTimeline ||
                "Not selected";


            careerPriority.textContent =
                profileData.learningPriority ||
                "Not selected";


        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );


            showMessage(
                "Could not save your profile. Please try again.",
                "error"
            );

        } finally {

            saveProfileBtn.disabled =
                false;

            saveProfileBtn.textContent =
                "Save Profile";
        }

    }
);


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    type
) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        `profile-message ${type}`;


    setTimeout(
        () => {

            profileMessage.textContent =
                "";

            profileMessage.className =
                "profile-message";

        },
        4000
    );
}


/* =====================================================
   AUTH
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.replace(
                "./login.html"
            );

            return;
        }


        try {

            await loadProfile(
                user
            );

        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            showMessage(
                "Could not load your profile.",
                "error"
            );
        }

    }
);