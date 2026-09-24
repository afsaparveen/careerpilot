import { auth, db } from "../firebase/firebase-config.js";

import {
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// DOM
// ======================================================

const profileForm =
    document.getElementById("profileForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const targetRoleInput =
    document.getElementById("targetRole");

const experienceLevelInput =
    document.getElementById("experienceLevel");

const graduationYearInput =
    document.getElementById("graduationYear");

const preferredLanguageInput =
    document.getElementById("preferredLanguage");

const locationInput =
    document.getElementById("location");

const bioInput =
    document.getElementById("bio");

const dailyPlanPreference =
    document.getElementById(
        "dailyPlanPreference"
    );

const interviewPreference =
    document.getElementById(
        "interviewPreference"
    );

const aptitudePreference =
    document.getElementById(
        "aptitudePreference"
    );

const dsaPreference =
    document.getElementById(
        "dsaPreference"
    );

const savePreferencesButton =
    document.getElementById(
        "savePreferences"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profilePreviewName =
    document.getElementById(
        "profilePreviewName"
    );

const profilePreviewRole =
    document.getElementById(
        "profilePreviewRole"
    );

const profileCompletion =
    document.getElementById(
        "profileCompletion"
    );

const profileCompletionBar =
    document.getElementById(
        "profileCompletionBar"
    );

const profileCompletionMessage =
    document.getElementById(
        "profileCompletionMessage"
    );

const accountEmail =
    document.getElementById(
        "accountEmail"
    );

const toast =
    document.getElementById("toast");


// ======================================================
// STATE
// ======================================================

let currentUser = null;

let currentUserData = {};


// ======================================================
// HELPERS
// ======================================================

function showToast(message) {

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


function getInitials(name) {

    const parts =
        String(
            name || "Career Explorer"
        )
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        parts.length === 0
    ) {
        return "CP";
    }


    if (
        parts.length === 1
    ) {

        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


function getName() {

    return (
        currentUserData.fullName ||
        currentUserData.name ||
        currentUser?.displayName ||
        "Career Explorer"
    );
}


function getRole() {

    return (
        currentUserData.targetRole ||
        currentUserData.careerGoal ||
        "Target role not selected"
    );
}


// ======================================================
// PROFILE COMPLETION
// ======================================================

function calculateCompletion() {

    const fields = [

        currentUserData.fullName,

        currentUserData.targetRole,

        currentUserData.experienceLevel,

        currentUserData.graduationYear,

        currentUserData.preferredLanguage,

        currentUserData.location,

        currentUserData.bio

    ];


    const completed =
        fields.filter(
            value =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
        ).length;


    return Math.round(
        (
            completed /
            fields.length
        ) * 100
    );
}


function renderCompletion() {

    const percentage =
        calculateCompletion();


    if (profileCompletion) {

        profileCompletion.textContent =
            `${percentage}%`;
    }


    if (profileCompletionBar) {

        profileCompletionBar.style.width =
            `${percentage}%`;
    }


    if (
        profileCompletionMessage
    ) {

        if (percentage >= 100) {

            profileCompletionMessage.textContent =
                "Your profile is complete.";

        } else if (percentage >= 70) {

            profileCompletionMessage.textContent =
                "Your profile is almost complete. Add the remaining details.";

        } else if (percentage >= 40) {

            profileCompletionMessage.textContent =
                "Good start. Add more career information to improve personalization.";

        } else {

            profileCompletionMessage.textContent =
                "Add your career information to build a useful profile.";
        }
    }
}


// ======================================================
// PREVIEW
// ======================================================

function renderPreview() {

    const name =
        getName();

    const role =
        getRole();


    if (profileAvatar) {

        profileAvatar.textContent =
            getInitials(name);
    }


    if (profilePreviewName) {

        profilePreviewName.textContent =
            name;
    }


    if (profilePreviewRole) {

        profilePreviewRole.textContent =
            role;
    }
}


// ======================================================
// FORM
// ======================================================

function renderForm() {

    if (fullNameInput) {

        fullNameInput.value =
            currentUserData.fullName ||
            currentUserData.name ||
            currentUser?.displayName ||
            "";
    }


    if (emailInput) {

        emailInput.value =
            currentUser?.email ||
            "";
    }


    if (targetRoleInput) {

        targetRoleInput.value =
            currentUserData.targetRole ||
            "";
    }


    if (experienceLevelInput) {

        experienceLevelInput.value =
            currentUserData.experienceLevel ||
            "";
    }


    if (graduationYearInput) {

        graduationYearInput.value =
            currentUserData.graduationYear ||
            "";
    }


    if (preferredLanguageInput) {

        preferredLanguageInput.value =
            currentUserData.preferredLanguage ||
            "";
    }


    if (locationInput) {

        locationInput.value =
            currentUserData.location ||
            "";
    }


    if (bioInput) {

        bioInput.value =
            currentUserData.bio ||
            "";
    }
}


// ======================================================
// PREFERENCES
// ======================================================

function renderPreferences() {

    const preferences =
        currentUserData.preferences ||
        {};


    if (dailyPlanPreference) {

        dailyPlanPreference.checked =
            preferences.dailyPlan !== false;
    }


    if (interviewPreference) {

        interviewPreference.checked =
            preferences.interview !== false;
    }


    if (aptitudePreference) {

        aptitudePreference.checked =
            preferences.aptitude !== false;
    }


    if (dsaPreference) {

        dsaPreference.checked =
            preferences.dsa !== false;
    }
}


// ======================================================
// SAVE PROFILE
// ======================================================

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        const fullName =
            fullNameInput.value.trim();

        const targetRole =
            targetRoleInput.value.trim();

        const experienceLevel =
            experienceLevelInput.value;

        const graduationYear =
            graduationYearInput.value;

        const preferredLanguage =
            preferredLanguageInput.value;

        const location =
            locationInput.value.trim();

        const bio =
            bioInput.value.trim();


        if (!fullName) {

            showToast(
                "Please enter your name."
            );

            fullNameInput.focus();

            return;
        }


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    currentUser.uid
                );


            await setDoc(
                userRef,
                {

                    fullName,

                    targetRole,

                    experienceLevel,

                    graduationYear,

                    preferredLanguage,

                    location,

                    bio,

                    email:
                        currentUser.email ||
                        "",

                    updatedAt:
                        new Date()
                            .toISOString()

                },
                {
                    merge: true
                }
            );


            await updateProfile(
                currentUser,
                {
                    displayName:
                        fullName
                }
            );


            currentUserData = {
                ...currentUserData,

                fullName,

                targetRole,

                experienceLevel,

                graduationYear,

                preferredLanguage,

                location,

                bio
            };


            renderPreview();
            renderCompletion();


            showToast(
                "Profile saved successfully."
            );


        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );

            showToast(
                "Could not save your profile."
            );
        }

    }
);


// ======================================================
// SAVE PREFERENCES
// ======================================================

if (savePreferencesButton) {

    savePreferencesButton.addEventListener(
        "click",
        async () => {

            if (!currentUser) {
                return;
            }


            const preferences = {

                dailyPlan:
                    dailyPlanPreference?.checked ??
                    true,

                interview:
                    interviewPreference?.checked ??
                    true,

                aptitude:
                    aptitudePreference?.checked ??
                    true,

                dsa:
                    dsaPreference?.checked ??
                    true

            };


            try {

                const userRef =
                    doc(
                        db,
                        "users",
                        currentUser.uid
                    );


                await setDoc(
                    userRef,
                    {
                        preferences,
                        updatedAt:
                            new Date()
                                .toISOString()
                    },
                    {
                        merge: true
                    }
                );


                currentUserData = {
                    ...currentUserData,
                    preferences
                };


                showToast(
                    "Preferences saved."
                );


            } catch (error) {

                console.error(
                    "Preferences save error:",
                    error
                );

                showToast(
                    "Could not save preferences."
                );
            }

        }
    );
}


// ======================================================
// LOGOUT
// ======================================================

if (logoutButton) {

    logoutButton.addEventListener(
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

                showToast(
                    "Could not log out."
                );
            }

        }
    );
}


// ======================================================
// LOAD USER
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


            currentUserData =
                snapshot.exists()
                    ? snapshot.data()
                    : {};


            renderForm();

            renderPreferences();

            renderPreview();

            renderCompletion();


            if (accountEmail) {

                accountEmail.textContent =
                    user.email ||
                    "Not available";
            }


        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            showToast(
                "Could not load your profile."
            );
        }

    }
);