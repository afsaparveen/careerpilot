import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================
   DSA LEARNING CONFIGURATION
========================================= */

const TOTAL_TOPICS = 37;

const TOTAL_MODULES = 6;


/* =========================================
   DOM ELEMENTS
========================================= */

const progressText =
    document.getElementById(
        "dsaLearningProgressText"
    );

const progressBar =
    document.getElementById(
        "dsaLearningProgressBar"
    );

const topicsText =
    document.getElementById(
        "dsaLearningTopics"
    );

const modulesText =
    document.getElementById(
        "dsaLearningModules"
    );


/* =========================================
   AUTH STATE
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            return;

        }

        await loadDSALearningProgress(
            user
        );

    }
);


/* =========================================
   LOAD DSA LEARNING PROGRESS
========================================= */

async function loadDSALearningProgress(
    user
) {

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


        /*
         * User document does not exist yet.
         */

        if (!snapshot.exists()) {

            updateProgressUI(
                0,
                0,
                0
            );

            return;

        }


        const data =
            snapshot.data();


        const progress =
            data.dsaLearningProgress || {};


        const completedTopics =
            progress.completedTopics || {};


        const completedModules =
            progress.completedModules || {};


        /*
         * Count completed topics.
         */

        const completedTopicCount =
            Object.values(
                completedTopics
            )
            .filter(
                value =>
                    value === true
            )
            .length;


        /*
         * Count completed modules.
         */

        const completedModuleCount =
            Object.values(
                completedModules
            )
            .filter(
                value =>
                    value === true
            )
            .length;


        /*
         * Calculate percentage from
         * the 37 DSA Learning topics.
         */

        const percentage =
            Math.min(
                100,
                Math.round(
                    (
                        completedTopicCount /
                        TOTAL_TOPICS
                    ) * 100
                )
            );


        updateProgressUI(
            percentage,
            completedTopicCount,
            completedModuleCount
        );


    } catch (error) {

        console.error(
            "DSA Learning dashboard progress error:",
            error
        );


        /*
         * Keep the dashboard usable
         * even if Firestore cannot be read.
         */

        updateProgressUI(
            0,
            0,
            0
        );

    }

}


/* =========================================
   UPDATE DASHBOARD UI
========================================= */

function updateProgressUI(
    percentage,
    completedTopics,
    completedModules
) {

    /*
     * Percentage text
     */

    if (progressText) {

        progressText.textContent =
            `${percentage}%`;

    }


    /*
     * Progress bar
     */

    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }


    /*
     * Topic count
     */

    if (topicsText) {

        topicsText.textContent =
            `${completedTopics} / ${TOTAL_TOPICS} Topics`;

    }


    /*
     * Module count
     */

    if (modulesText) {

        modulesText.textContent =
            `${completedModules} / ${TOTAL_MODULES} Modules`;

    }

}