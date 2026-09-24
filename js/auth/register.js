import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
========================================================= */

const registerForm =
    document.getElementById("registerForm");

const googleRegisterBtn =
    document.getElementById("googleRegisterBtn");

const registerBtn =
    document.getElementById("registerBtn");

const messageBox =
    document.getElementById("registerMessage");


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type = "error"
) {

    if (!messageBox) {
        return;
    }

    messageBox.textContent =
        message;

    messageBox.className =
        `auth-message ${type}`;
}


function clearMessage() {

    if (!messageBox) {
        return;
    }

    messageBox.textContent =
        "";

    messageBox.className =
        "auth-message";
}


/* =========================================================
   LOADING
========================================================= */

function setLoading(
    button,
    loading,
    defaultText
) {

    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Please wait...";

    } else {

        button.textContent =
            button.dataset.originalText ||
            defaultText;

    }
}


/* =========================================================
   FIREBASE ERROR MESSAGE
========================================================= */

function getFirebaseErrorMessage(error) {

    console.error(
        "Firebase error:",
        error
    );


    switch (error.code) {

        case "auth/email-already-in-use":

            return "An account already exists with this email. Please use Login.";


        case "auth/invalid-email":

            return "Please enter a valid email address.";


        case "auth/weak-password":

            return "Password must contain at least 6 characters.";


        case "auth/network-request-failed":

            return "Network error. Please check your internet connection.";


        case "auth/popup-closed-by-user":

            return "Google sign-in was cancelled.";


        case "auth/popup-blocked":

            return "Your browser blocked the Google sign-in popup. Please allow popups for this site.";


        case "auth/cancelled-popup-request":

            return "Google sign-in was cancelled.";


        case "auth/account-exists-with-different-credential":

            return "An account already exists with this email using another sign-in method.";


        case "auth/unauthorized-domain":

            return "This domain is not authorized for Google sign-in.";


        default:

            return error.message ||
                "Something went wrong. Please try again.";
    }
}


/* =========================================================
   CREATE FIRESTORE PROFILE
========================================================= */

async function createUserProfile(
    user,
    fullName
) {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );


    await setDoc(
        userRef,
        {

            uid:
                user.uid,

            fullName:
                fullName ||
                user.displayName ||
                "",

            name:
                fullName ||
                user.displayName ||
                "",

            email:
                user.email ||
                "",

            targetRole:
                "",

            targetCompanies:
                [],

            currentSkills:
                [],

            dailyStudyTime:
                "",

            placementTimeline:
                "",

            learningPriority:
                "",

            onboardingCompleted:
                false,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp()

        },
        {
            merge: true
        }
    );
}


/* =========================================================
   EMAIL + PASSWORD REGISTER
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            clearMessage();


            const fullName =
                document
                    .getElementById("fullName")
                    ?.value
                    ?.trim() || "";


            const email =
                document
                    .getElementById("email")
                    ?.value
                    ?.trim()
                    ?.toLowerCase() || "";


            const password =
                document
                    .getElementById("password")
                    ?.value || "";


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    ?.value || "";


            /* =============================================
               VALIDATION
            ============================================== */

            if (!fullName) {

                showMessage(
                    "Please enter your full name."
                );

                return;
            }


            if (!email) {

                showMessage(
                    "Please enter your email address."
                );

                return;
            }


            if (!password) {

                showMessage(
                    "Please create a password."
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match."
                );

                return;
            }


            setLoading(
                registerBtn,
                true,
                "Create Account"
            );


            try {

                /* =========================================
                   CREATE FIREBASE ACCOUNT
                ========================================== */

                const credential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    credential.user;


                /* =========================================
                   SAVE DISPLAY NAME
                ========================================== */

                await updateProfile(
                    user,
                    {
                        displayName:
                            fullName
                    }
                );


                /* =========================================
                   CREATE FIRESTORE PROFILE
                ========================================== */

                await createUserProfile(
                    user,
                    fullName
                );


                /* =========================================
                   NEW ACCOUNT → ONBOARDING
                ========================================== */

                window.location.replace(
                    "./onboarding.html"
                );


            } catch (error) {

                showMessage(
                    getFirebaseErrorMessage(
                        error
                    )
                );


                setLoading(
                    registerBtn,
                    false,
                    "Create Account"
                );

            }

        }
    );

}


/* =========================================================
   GOOGLE CREATE ACCOUNT
========================================================= */

if (googleRegisterBtn) {

    googleRegisterBtn.addEventListener(
        "click",
        async function () {

            clearMessage();


            setLoading(
                googleRegisterBtn,
                true,
                "Continue with Google"
            );


            try {

                /* =========================================
                   GOOGLE PROVIDER
                ========================================== */

                const provider =
                    new GoogleAuthProvider();


                provider.setCustomParameters({
                    prompt:
                        "select_account"
                });


                /* =========================================
                   GOOGLE POPUP
                ========================================== */

                const result =
                    await signInWithPopup(
                        auth,
                        provider
                    );


                const user =
                    result.user;


                if (!user) {

                    throw new Error(
                        "Google account could not be obtained."
                    );
                }


                /* =========================================
                   CHECK FIRESTORE
                ========================================== */

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


                /* =========================================
                   NEW GOOGLE USER
                ========================================== */

                if (
                    !snapshot.exists()
                ) {

                    /*
                     * This is a brand-new
                     * CareerPilot account.
                     *
                     * Create the Firestore
                     * profile first.
                     */

                    await createUserProfile(
                        user,
                        user.displayName || ""
                    );


                    /*
                     * IMPORTANT:
                     *
                     * New Google user must
                     * complete onboarding.
                     */

                    window.location.replace(
                        "./onboarding.html"
                    );


                    return;
                }


                /* =========================================
                   EXISTING GOOGLE USER
                ========================================== */

                const userData =
                    snapshot.data() || {};


                const onboardingCompleted =
                    userData.onboardingCompleted === true ||
                    userData.onboardingComplete === true;


                /* =========================================
                   EXISTING + ONBOARDING COMPLETE
                ========================================== */

                if (
                    onboardingCompleted
                ) {

                    window.location.replace(
                        "./dashboard.html"
                    );


                    return;
                }


                /* =========================================
                   EXISTING + ONBOARDING NOT COMPLETE
                ========================================== */

                window.location.replace(
                    "./onboarding.html"
                );

            } catch (error) {

                showMessage(
                    getFirebaseErrorMessage(
                        error
                    )
                );


                setLoading(
                    googleRegisterBtn,
                    false,
                    "Continue with Google"
                );

            }

        }
    );

}