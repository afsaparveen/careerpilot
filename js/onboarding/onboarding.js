import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



/* =========================================================
   STATE
========================================================= */

let currentStep = 1;

const totalSteps = 4;

let isSaving = false;



/* =========================================================
   ELEMENTS
========================================================= */

const progressBar =
    document.getElementById(
        "progressBar"
    );


const currentStepText =
    document.getElementById(
        "currentStep"
    );


const onboardingMessage =
    document.getElementById(
        "onboardingMessage"
    );


const finishButton =
    document.getElementById(
        "finishBtn"
    );



/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    message,
    isError = false
) {

    if (!onboardingMessage) {
        return;
    }


    onboardingMessage.textContent =
        message;


    onboardingMessage.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";
}



/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearMessage() {

    if (!onboardingMessage) {
        return;
    }


    onboardingMessage.textContent =
        "";
}



/* =========================================================
   SHOW STEP
========================================================= */

function showStep(step) {


    document
        .querySelectorAll(
            ".onboarding-step"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    const selectedStep =
        document.getElementById(
            `step${step}`
        );


    if (selectedStep) {

        selectedStep.classList.add(
            "active"
        );
    }


    if (currentStepText) {

        currentStepText.textContent =
            step;
    }


    if (progressBar) {

        progressBar.style.width =
            `${(step / totalSteps) * 100}%`;

    }


    clearMessage();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* =========================================================
   VALIDATE STEP
========================================================= */

function validateStep(step) {


    clearMessage();



    /* ================================================
       STEP 1
    ================================================= */

    if (step === 1) {


        const name =
            document
                .getElementById("fullName")
                ?.value
                ?.trim();


        const role =
            document
                .getElementById("targetRole")
                ?.value;



        if (!name) {

            showMessage(
                "Please enter your name.",
                true
            );

            return false;
        }



        if (!role) {

            showMessage(
                "Please select your target role.",
                true
            );

            return false;
        }

    }



    /* ================================================
       STEP 2
    ================================================= */

    if (step === 2) {

        /*
         * Company selection is optional.
         *
         * The user can continue without
         * selecting a company.
         */

    }



    /* ================================================
       STEP 3
    ================================================= */

    if (step === 3) {

        /*
         * Skill selection is optional.
         *
         * The user can continue without
         * selecting a skill.
         */

    }



    /* ================================================
       STEP 4
    ================================================= */

    if (step === 4) {


        const dailyTime =
            document
                .getElementById("dailyTime")
                ?.value;


        const timeline =
            document
                .getElementById("timeline")
                ?.value;


        const priority =
            document
                .getElementById(
                    "learningPriority"
                )
                ?.value;



        if (!dailyTime) {

            showMessage(
                "Please select your daily study time.",
                true
            );

            return false;
        }



        if (!timeline) {

            showMessage(
                "Please select your placement timeline.",
                true
            );

            return false;
        }



        if (!priority) {

            showMessage(
                "Please select what you want to learn first.",
                true
            );

            return false;
        }

    }



    return true;
}



/* =========================================================
   NEXT STEP
========================================================= */

window.nextStep = function () {


    if (
        !validateStep(
            currentStep
        )
    ) {

        return;
    }



    if (
        currentStep <
        totalSteps
    ) {

        currentStep++;


        showStep(
            currentStep
        );

    }

};



/* =========================================================
   PREVIOUS STEP
========================================================= */

window.previousStep = function () {


    if (
        currentStep >
        1
    ) {

        currentStep--;


        showStep(
            currentStep
        );

    }

};



/* =========================================================
   GET SELECTED COMPANIES
========================================================= */

function getSelectedCompanies() {


    const checkboxes =
        document.querySelectorAll(
            '#step2 input[type="checkbox"]:checked'
        );


    const companies = [];


    checkboxes.forEach(
        checkbox => {

            companies.push(
                checkbox.value
            );

        }
    );


    return companies;
}



/* =========================================================
   GET SELECTED SKILLS
========================================================= */

function getSelectedSkills() {


    const checkboxes =
        document.querySelectorAll(
            '#step3 input[type="checkbox"]:checked'
        );


    const skills = [];


    checkboxes.forEach(
        checkbox => {

            skills.push(
                checkbox.value
            );

        }
    );


    return skills;
}



/* =========================================================
   COMPLETE ONBOARDING
========================================================= */

window.completeOnboarding =
    async function () {


        /* Prevent double click */

        if (isSaving) {

            return;
        }



        /* Validate final step */

        if (
            !validateStep(4)
        ) {

            return;
        }



        /* Check authentication */

        const user =
            auth.currentUser;



        if (!user) {

            showMessage(
                "Your login session has expired. Please login again.",
                true
            );

            return;
        }



        /* ================================================
           COLLECT USER DATA
        ================================================= */

        const name =
            document
                .getElementById("fullName")
                .value
                .trim();


        const targetRole =
            document
                .getElementById("targetRole")
                .value;


        const selectedCompanies =
            getSelectedCompanies();


        const selectedSkills =
            getSelectedSkills();


        const dailyTime =
            document
                .getElementById("dailyTime")
                .value;


        const timeline =
            document
                .getElementById("timeline")
                .value;


        const learningPriority =
            document
                .getElementById(
                    "learningPriority"
                )
                .value;



        /* ================================================
           START SAVING
        ================================================= */

        isSaving = true;



        if (finishButton) {

            finishButton.disabled =
                true;

            finishButton.textContent =
                "Building your plan...";
        }



        showMessage(
            "🚀 Building your personalized career plan...",
            false
        );



        try {


            /* ============================================
               USER DOCUMENT
            ============================================ */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );



            /* ============================================
               CHECK PROFILE
            ============================================ */

            const userSnapshot =
                await getDoc(
                    userRef
                );



            if (
                !userSnapshot.exists()
            ) {

                showMessage(
                    "Your account profile could not be found. Please login again.",
                    true
                );


                isSaving = false;


                if (finishButton) {

                    finishButton.disabled =
                        false;

                    finishButton.textContent =
                        "🚀 Build My Career Plan";
                }


                return;
            }



            /* ============================================
               SAVE ONBOARDING DATA
            ============================================ */

            await updateDoc(
                userRef,
                {

                    name:
                        name,

                    fullName:
                        name,

                    targetRole:
                        targetRole,

                    targetCompanies:
                        selectedCompanies,

                    currentSkills:
                        selectedSkills,

                    dailyStudyTime:
                        dailyTime,

                    placementTimeline:
                        timeline,

                    learningPriority:
                        learningPriority,

                    onboardingCompleted:
                        true,

                    onboardingCompletedAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }
            );



            /* ============================================
               SUCCESS
            ============================================ */

            showMessage(
                "🎉 Your CareerPilot profile is ready!",
                false
            );



            /*
             * Small delay so the user can
             * see the success message.
             */

            setTimeout(
                () => {

                    window.location.replace(
                        "dashboard.html"
                    );

                },
                1000
            );


        } catch (error) {


            console.error(
                "Onboarding error:",
                error
            );


            showMessage(
                "Unable to save your information. Please try again.",
                true
            );


            isSaving =
                false;


            if (finishButton) {

                finishButton.disabled =
                    false;

                finishButton.textContent =
                    "🚀 Build My Career Plan";
            }

        }

    };



/* =========================================================
   START
========================================================= */

showStep(
    currentStep
);