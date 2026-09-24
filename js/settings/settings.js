import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithPopup,
    deleteUser
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =====================================================
   DOM
===================================================== */

const studyReminders =
    document.getElementById(
        "studyReminders"
    );

const emailNotifications =
    document.getElementById(
        "emailNotifications"
    );

const darkMode =
    document.getElementById(
        "darkMode"
    );

const compactMode =
    document.getElementById(
        "compactMode"
    );

const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );

const settingsMessage =
    document.getElementById(
        "settingsMessage"
    );

const currentEmail =
    document.getElementById(
        "currentEmail"
    );

const changeEmailBtn =
    document.getElementById(
        "changeEmailBtn"
    );

const emailChangeBox =
    document.getElementById(
        "emailChangeBox"
    );

const newEmail =
    document.getElementById(
        "newEmail"
    );

const emailPassword =
    document.getElementById(
        "emailPassword"
    );

const updateEmailBtn =
    document.getElementById(
        "updateEmailBtn"
    );

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );

const passwordChangeBox =
    document.getElementById(
        "passwordChangeBox"
    );

const currentPassword =
    document.getElementById(
        "currentPassword"
    );

const newPassword =
    document.getElementById(
        "newPassword"
    );

const updatePasswordBtn =
    document.getElementById(
        "updatePasswordBtn"
    );

const securityMessage =
    document.getElementById(
        "securityMessage"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const deleteAccountBtn =
    document.getElementById(
        "deleteAccountBtn"
    );


let currentUser = null;


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    element,
    message,
    type
) {

    element.textContent =
        message;

    element.className =
        `settings-message ${type}`;


    setTimeout(
        () => {

            element.textContent =
                "";

            element.className =
                "settings-message";

        },
        5000
    );
}


/* =====================================================
   PROVIDER
===================================================== */

function hasPasswordProvider() {

    if (!currentUser) {

        return false;
    }


    return currentUser.providerData
        .some(
            provider =>
                provider.providerId ===
                "password"
        );
}


function hasGoogleProvider() {

    if (!currentUser) {

        return false;
    }


    return currentUser.providerData
        .some(
            provider =>
                provider.providerId ===
                "google.com"
        );
}


/* =====================================================
   APPLY THEME
===================================================== */

function applyPreferences(
    preferences
) {

    if (
        preferences.darkMode ===
        true
    ) {

        document.body.classList.add(
            "dark-settings"
        );

    } else {

        document.body.classList.remove(
            "dark-settings"
        );
    }


    if (
        preferences.compactMode ===
        true
    ) {

        document.body.classList.add(
            "compact-settings"
        );

    } else {

        document.body.classList.remove(
            "compact-settings"
        );
    }
}


/* =====================================================
   LOAD SETTINGS
===================================================== */

async function loadSettings(
    user
) {

    currentUser =
        user;


    currentEmail.textContent =
        user.email ||
        "No email";


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


    const preferences =
        data.preferences ||
        {};


    studyReminders.checked =
        preferences.studyReminders !==
        false;


    emailNotifications.checked =
        preferences.emailNotifications !==
        false;


    darkMode.checked =
        preferences.darkMode ===
        true;


    compactMode.checked =
        preferences.compactMode ===
        true;


    applyPreferences(
        preferences
    );


    /*
     * Password settings only make sense
     * for accounts using email/password.
     */

    if (
        !hasPasswordProvider()
    ) {

        changePasswordBtn.textContent =
            "Password Managed by Provider";

        changePasswordBtn.disabled =
            true;
    }
}


/* =====================================================
   SAVE PREFERENCES
===================================================== */

saveSettingsBtn.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            return;
        }


        saveSettingsBtn.disabled =
            true;

        saveSettingsBtn.textContent =
            "Saving...";


        const preferences = {

            studyReminders:
                studyReminders.checked,

            emailNotifications:
                emailNotifications.checked,

            darkMode:
                darkMode.checked,

            compactMode:
                compactMode.checked

        };


        try {

            await setDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid
                ),

                {

                    preferences:
                        preferences,

                    updatedAt:
                        serverTimestamp()

                },

                {
                    merge: true
                }

            );


            applyPreferences(
                preferences
            );


            showMessage(
                settingsMessage,
                "Preferences saved successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Settings save error:",
                error
            );


            showMessage(
                settingsMessage,
                "Could not save preferences.",
                "error"
            );

        } finally {

            saveSettingsBtn.disabled =
                false;

            saveSettingsBtn.textContent =
                "Save Preferences";
        }

    }
);


/* =====================================================
   CHANGE EMAIL BOX
===================================================== */

changeEmailBtn.addEventListener(
    "click",
    () => {

        emailChangeBox.classList.toggle(
            "hidden"
        );

    }
);


/* =====================================================
   CHANGE PASSWORD BOX
===================================================== */

changePasswordBtn.addEventListener(
    "click",
    () => {

        if (
            changePasswordBtn.disabled
        ) {

            return;
        }


        passwordChangeBox.classList.toggle(
            "hidden"
        );

    }
);


/* =====================================================
   REAUTHENTICATE
===================================================== */

async function reauthenticateUser(
    password
) {

    if (!currentUser) {

        throw new Error(
            "No authenticated user."
        );
    }


    if (
        hasPasswordProvider()
    ) {

        if (!password) {

            throw new Error(
                "Current password is required."
            );
        }


        const credential =
            EmailAuthProvider.credential(
                currentUser.email,
                password
            );


        await reauthenticateWithCredential(
            currentUser,
            credential
        );


        return;
    }


    if (
        hasGoogleProvider()
    ) {

        const provider =
            new GoogleAuthProvider();


        await reauthenticateWithPopup(
            currentUser,
            provider
        );


        return;
    }


    throw new Error(
        "Please sign in again to continue."
    );
}


/* =====================================================
   UPDATE EMAIL
===================================================== */

updateEmailBtn.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            return;
        }


        const email =
            newEmail.value.trim();


        const password =
            emailPassword.value;


        if (!email) {

            showMessage(
                securityMessage,
                "Enter your new email address.",
                "error"
            );

            return;
        }


        if (
            email ===
            currentUser.email
        ) {

            showMessage(
                securityMessage,
                "This is already your current email.",
                "error"
            );

            return;
        }


        updateEmailBtn.disabled =
            true;

        updateEmailBtn.textContent =
            "Updating...";


        try {

            await reauthenticateUser(
                password
            );


            await updateEmail(
                currentUser,
                email
            );


            await setDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid
                ),

                {

                    email:
                        email,

                    updatedAt:
                        serverTimestamp()

                },

                {
                    merge: true
                }

            );


            currentEmail.textContent =
                email;


            newEmail.value =
                "";

            emailPassword.value =
                "";


            emailChangeBox.classList.add(
                "hidden"
            );


            showMessage(
                securityMessage,
                "Email updated successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Email update error:",
                error
            );


            if (
                error.code ===
                "auth/wrong-password"
            ) {

                showMessage(
                    securityMessage,
                    "Current password is incorrect.",
                    "error"
                );

            } else if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                showMessage(
                    securityMessage,
                    "That email is already in use.",
                    "error"
                );

            } else if (
                error.code ===
                "auth/invalid-email"
            ) {

                showMessage(
                    securityMessage,
                    "Please enter a valid email address.",
                    "error"
                );

            } else {

                showMessage(
                    securityMessage,
                    error.message ||
                    "Could not update email.",
                    "error"
                );
            }

        } finally {

            updateEmailBtn.disabled =
                false;

            updateEmailBtn.textContent =
                "Update Email";
        }

    }
);


/* =====================================================
   UPDATE PASSWORD
===================================================== */

updatePasswordBtn.addEventListener(
    "click",
    async () => {

        if (
            !currentUser ||
            !hasPasswordProvider()
        ) {

            return;
        }


        const current =
            currentPassword.value;

        const next =
            newPassword.value;


        if (!current) {

            showMessage(
                securityMessage,
                "Enter your current password.",
                "error"
            );

            return;
        }


        if (
            next.length < 6
        ) {

            showMessage(
                securityMessage,
                "New password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        updatePasswordBtn.disabled =
            true;

        updatePasswordBtn.textContent =
            "Updating...";


        try {

            await reauthenticateUser(
                current
            );


            await updatePassword(
                currentUser,
                next
            );


            currentPassword.value =
                "";

            newPassword.value =
                "";


            passwordChangeBox.classList.add(
                "hidden"
            );


            showMessage(
                securityMessage,
                "Password updated successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Password update error:",
                error
            );


            if (
                error.code ===
                "auth/wrong-password"
            ) {

                showMessage(
                    securityMessage,
                    "Current password is incorrect.",
                    "error"
                );

            } else {

                showMessage(
                    securityMessage,
                    error.message ||
                    "Could not update password.",
                    "error"
                );
            }

        } finally {

            updatePasswordBtn.disabled =
                false;

            updatePasswordBtn.textContent =
                "Update Password";
        }

    }
);


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    async () => {

        logoutBtn.disabled =
            true;

        logoutBtn.textContent =
            "Signing out...";


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


            logoutBtn.disabled =
                false;

            logoutBtn.textContent =
                "Sign Out";


            showMessage(
                settingsMessage,
                "Could not sign out.",
                "error"
            );
        }

    }
);


/* =====================================================
   DELETE ACCOUNT
===================================================== */

deleteAccountBtn.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            return;
        }


        const confirmed =
            window.confirm(
                "Delete your CareerPilot account permanently?\n\nYour profile data will also be deleted.\n\nThis action cannot be undone."
            );


        if (!confirmed) {

            return;
        }


        let password = "";


        if (
            hasPasswordProvider()
        ) {

            password =
                window.prompt(
                    "Enter your current password to confirm account deletion:"
                );


            if (
                password ===
                null
            ) {

                return;
            }
        }


        deleteAccountBtn.disabled =
            true;

        deleteAccountBtn.textContent =
            "Deleting...";


        try {

            /*
             * Recent authentication required.
             */

            await reauthenticateUser(
                password
            );


            /*
             * Delete Firestore profile.
             */

            await deleteDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                )
            );


            /*
             * Delete Firebase Authentication account.
             */

            await deleteUser(
                currentUser
            );


            window.location.replace(
                "./register.html"
            );


        } catch (error) {

            console.error(
                "Account deletion error:",
                error
            );


            deleteAccountBtn.disabled =
                false;

            deleteAccountBtn.textContent =
                "Delete Account";


            showMessage(
                securityMessage,
                error.message ||
                "Could not delete the account.",
                "error"
            );
        }

    }
);


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

            await loadSettings(
                user
            );

        } catch (error) {

            console.error(
                "Settings loading error:",
                error
            );


            showMessage(
                settingsMessage,
                "Could not load settings.",
                "error"
            );
        }

    }
);