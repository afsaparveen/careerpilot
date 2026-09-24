import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   ELEMENTS
========================================================= */

const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const loginForm =
    document.getElementById("loginForm");


const loginButton =
    document.getElementById("loginBtn");


const googleButton =
    document.getElementById("googleLoginBtn");


const errorMessage =
    document.getElementById("loginError");


/* =========================================================
   STATE
========================================================= */

let loginInProgress = false;


/* =========================================================
   SHOW ERROR
========================================================= */

function showError(message) {

    if (!errorMessage) {

        alert(message);

        return;
    }


    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


/* =========================================================
   CLEAR ERROR
========================================================= */

function clearError() {

    if (!errorMessage) {
        return;
    }


    errorMessage.textContent =
        "";

    errorMessage.style.display =
        "none";
}


/* =========================================================
   LOADING
========================================================= */

function setLoading(
    loading,
    buttonText = "Login"
) {

    loginInProgress =
        loading;


    if (loginButton) {

        loginButton.disabled =
            loading;

        loginButton.textContent =
            loading
                ? "Signing in..."
                : buttonText;
    }


    if (googleButton) {

        googleButton.disabled =
            loading;
    }
}


/* =========================================================
   ROUTE USER
========================================================= */

async function routeUser(user) {

    if (!user) {

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


        /* ================================================
           FIRESTORE PROFILE EXISTS
        ================================================= */

        if (snapshot.exists()) {

            const data =
                snapshot.data() || {};


            /*
             * IMPORTANT:
             *
             * Only the explicit onboarding flag
             * decides whether the user has completed
             * onboarding.
             *
             * We DO NOT use targetRole or
             * targetCompany here because those
             * fields may be saved before onboarding
             * is actually completed.
             */

            const onboardingCompleted =
                data.onboardingCompleted === true ||
                data.onboardingComplete === true;


            /* ============================================
               ONBOARDING COMPLETED
            ============================================ */

            if (onboardingCompleted) {

                window.location.replace(
                    "./dashboard.html"
                );

                return;
            }


            /* ============================================
               ONBOARDING NOT COMPLETED
            ============================================ */

            window.location.replace(
                "./onboarding.html"
            );

            return;
        }


        /* ================================================
           NO FIRESTORE PROFILE
        ================================================= */

        /*
         * This can happen with a Google account
         * that authenticated successfully but does
         * not yet have a CareerPilot profile.
         *
         * Send them to onboarding.
         */

        window.location.replace(
            "./onboarding.html"
        );


    } catch (error) {

        console.error(
            "Error checking user profile:",
            error
        );


        /*
         * DO NOT automatically send the user
         * to dashboard when Firestore fails.
         *
         * Otherwise a database/network problem
         * could incorrectly bypass onboarding.
         */

        showError(
            "Unable to load your account details. Please try again."
        );


        setLoading(
            false
        );
    }
}


/* =========================================================
   EMAIL + PASSWORD LOGIN
========================================================= */

async function loginWithEmail() {

    clearError();


    /* Prevent double click */

    if (loginInProgress) {

        return;
    }


    const email =
        emailInput?.value
            ?.trim()
            ?.toLowerCase();


    const password =
        passwordInput?.value || "";


    /* ================================================
       EMAIL VALIDATION
    ================================================= */

    if (!email) {

        showError(
            "Please enter your email."
        );

        return;
    }


    /* ================================================
       PASSWORD VALIDATION
    ================================================= */

    if (!password) {

        showError(
            "Please enter your password."
        );

        return;
    }


    /* ================================================
       START LOADING
    ================================================= */

    setLoading(
        true
    );


    try {

        /*
         * Firebase authentication happens
         * ONLY after the user presses Login.
         */

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        /*
         * Login successful.
         *
         * Now check Firestore and decide:
         *
         * Dashboard
         * OR
         * Onboarding
         */

        await routeUser(
            credential.user
        );


    } catch (error) {

        console.error(
            "Email login error:",
            error
        );


        let message =
            "Wrong email or password.";


        switch (error.code) {

            case "auth/user-not-found":

                message =
                    "Wrong email or password.";

                break;


            case "auth/wrong-password":

                message =
                    "Wrong email or password.";

                break;


            case "auth/invalid-credential":

                message =
                    "Wrong email or password.";

                break;


            case "auth/invalid-email":

                message =
                    "Please enter a valid email address.";

                break;


            case "auth/too-many-requests":

                message =
                    "Too many login attempts. Please try again later.";

                break;


            case "auth/network-request-failed":

                message =
                    "Network error. Please check your internet connection.";

                break;


            case "auth/user-disabled":

                message =
                    "This account has been disabled.";

                break;


            default:

                message =
                    "Login failed. Please try again.";

                break;
        }


        showError(
            message
        );


        setLoading(
            false
        );
    }
}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

async function loginWithGoogle() {

    clearError();


    if (loginInProgress) {

        return;
    }


    setLoading(
        true
    );


    try {

        /*
         * Use popup instead of redirect.
         *
         * This avoids:
         *
         * login.html
         *      ↓
         * Google page
         *      ↓
         * login.html
         *
         * and makes the login feel much faster.
         */

        const provider =
            new GoogleAuthProvider();


        provider.setCustomParameters({

            prompt:
                "select_account"

        });


        const result =
            await signInWithPopup(
                auth,
                provider
            );


        /*
         * Google authentication completed.
         */

        const user =
            result.user;


        if (!user) {

            showError(
                "Google login failed. Please try again."
            );

            setLoading(
                false
            );

            return;
        }


        /*
         * Now determine whether the user
         * needs onboarding or dashboard.
         */

        await routeUser(
            user
        );


    } catch (error) {

        console.error(
            "Google login error:",
            error
        );


        let message =
            "Google sign-in failed. Please try again.";


        switch (error.code) {

            case "auth/popup-closed-by-user":

                message =
                    "Google sign-in was cancelled.";

                break;


            case "auth/popup-blocked":

                message =
                    "Your browser blocked the Google sign-in popup. Please allow popups for this site.";

                break;


            case "auth/cancelled-popup-request":

                message =
                    "Google sign-in was cancelled.";

                break;


            case "auth/account-exists-with-different-credential":

                message =
                    "An account already exists with this email using another sign-in method.";

                break;


            case "auth/network-request-failed":

                message =
                    "Network error. Please check your internet connection.";

                break;


            case "auth/unauthorized-domain":

                message =
                    "This domain is not authorized for Google sign-in.";

                break;


            default:

                message =
                    "Google sign-in failed. Please try again.";

                break;
        }


        showError(
            message
        );


        setLoading(
            false
        );
    }
}


/* =========================================================
   LOGIN FORM
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            loginWithEmail();

        }
    );
}


/* =========================================================
   GOOGLE BUTTON
========================================================= */

if (googleButton) {

    googleButton.addEventListener(
        "click",
        loginWithGoogle
    );
}


/* =========================================================
   IMPORTANT
========================================================= */

/*
 * DO NOT use onAuthStateChanged() here.
 *
 * Firebase keeps users signed in between page loads.
 *
 * If we use onAuthStateChanged() on the login page,
 * a previously authenticated user will immediately
 * be sent to the dashboard before they enter their
 * email and password.
 *
 * Login must happen only when the user presses:
 *
 *     Login
 *
 * or:
 *
 *     Continue with Google
 */