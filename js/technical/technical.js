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


/* =========================================================
   CORE SUBJECTS
   These use the EXISTING subject pages.
========================================================= */

const coreSubjects = [

    {
        id: "dbms",
        name: "DBMS",
        code: "DB",
        description:
            "Database Management Systems, architecture, abstraction, data models, keys, normalization, transactions, SQL and indexing.",

        pages: [
            "dbms.html"
        ],

        progressKeys: [
            "dbmsProgress"
        ]
    },

    {
        id: "os",
        name: "Operating Systems",
        code: "OS",
        description:
            "Processes, CPU scheduling, synchronization, deadlocks, IPC, memory management, file systems and disk management.",

        pages: [
            "os.html",
            "operating-systems.html",
            "operating-system.html"
        ],

        progressKeys: [
            "osProgress"
        ]
    },

    {
        id: "cn",
        name: "Computer Networks",
        code: "CN",
        description:
            "Network fundamentals, devices, physical layer, data link, network layer, transport, application layer and delays.",

        pages: [
            "cn.html",
            "computer-networks.html",
            "computer_networks.html"
        ],

        progressKeys: [
            "cnProgress",
            "computerNetworksProgress"
        ]
    },

    {
        id: "oop",
        name: "OOP",
        code: "OP",
        description:
            "Objects, classes, access modifiers, constructors, inheritance, polymorphism, abstraction and OOP interview preparation.",

        pages: [
            "oop.html",
            "oops.html"
        ],

        progressKeys: [
            "oopProgress",
            "oopsProgress"
        ]
    }

];


/* =========================================================
   MATERIAL-ONLY SUBJECTS
========================================================= */

const materialSubjects = [

    {
        id: "sql",
        name: "SQL",
        code: "SQL",
        description:
            "Complete SQL study material from fundamentals through placement-level query solving."
    },

    {
        id: "javascript",
        name: "JavaScript",
        code: "JS",
        description:
            "JavaScript fundamentals, functions, arrays, objects, DOM, asynchronous programming, APIs and interview concepts."
    },

    {
        id: "git-github",
        name: "Git & GitHub",
        code: "GIT",
        description:
            "Git fundamentals, commits, branches, merging, remote repositories, GitHub workflow and collaboration."
    },

    {
        id: "rest-apis",
        name: "REST APIs",
        code: "API",
        description:
            "HTTP, REST resources, methods, status codes, JSON, authentication, CRUD, pagination, validation and API design."
    },

    {
        id: "linux",
        name: "Linux",
        code: "LNX",
        description:
            "Linux command line, filesystem, permissions, users, processes, pipes, networking, services and shell scripting."
    },

    {
        id: "system-design",
        name: "System Design",
        code: "SD",
        description:
            "System design fundamentals, requirements, estimation, load balancing, caching, databases, queues, scaling, reliability and real-world designs."
    }

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let userData = {};


/* =========================================================
   DOM
========================================================= */

const technicalSubjects =
    document.getElementById(
        "technicalSubjects"
    );

const futureSubjects =
    document.getElementById(
        "futureSubjects"
    );

const userInitials =
    document.getElementById(
        "userInitials"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value = ""
) {

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


/* =========================================================
   FIRESTORE USER DATA
========================================================= */

async function loadUserData() {

    if (!currentUser) {
        return;
    }


    try {

        const snapshot =
            await getDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                )
            );


        userData =
            snapshot.exists()
                ? snapshot.data()
                : {};

    } catch (error) {

        console.error(
            "Could not load technical progress:",
            error
        );

        userData = {};
    }
}


/* =========================================================
   PROGRESS
========================================================= */

function countCompleted(
    object
) {

    if (
        !object ||
        typeof object !== "object"
    ) {
        return 0;
    }


    return Object.values(object)
        .filter(
            value =>
                value === true
        )
        .length;
}


function getCoreProgress(
    subject
) {

    let progress = null;


    for (
        const key of subject.progressKeys
    ) {

        if (
            userData[key] &&
            typeof userData[key] === "object"
        ) {

            progress =
                userData[key];

            break;
        }
    }


    if (!progress) {

        return {
            topics: 0,
            chapters: 0,
            percentage: 0
        };
    }


    const topics =
        countCompleted(
            progress.completedTopics
        );


    const chapters =
        countCompleted(
            progress.completedChapters
        );


    /*
     * The actual core pages remain the source
     * of truth for their curriculum.
     */
    const activity =
        topics +
        chapters;


    return {

        topics,

        chapters,

        percentage:
            activity === 0
                ? 0
                : Math.min(
                    100,
                    activity * 5
                )
    };
}


/* =========================================================
   FIND EXISTING CORE PAGE
========================================================= */

async function findExistingPage(
    pages
) {

    for (
        const page of pages
    ) {

        try {

            const response =
                await fetch(
                    `./${page}`,
                    {
                        method: "HEAD",
                        cache: "no-store"
                    }
                );


            if (
                response.ok
            ) {

                return page;
            }

        } catch {
            /*
             * Try the next candidate.
             */
        }
    }


    return null;
}


/* =========================================================
   OPEN CORE SUBJECT
========================================================= */

async function openCoreSubject(
    subject
) {

    /*
     * OOP page is specifically named oops.html
     */
    if (subject.id === "oop") {

        window.location.href =
            "./oops.html";

        return;
    }


    const page =
        await findExistingPage(
            subject.pages
        );


    if (!page) {

        alert(
            `${subject.name} page could not be found.`
        );

        return;
    }


    window.location.href =
        `./${page}`;
}


/* =========================================================
   CREATE CORE CARD
========================================================= */

function createCoreCard(
    subject
) {

    const progress =
        getCoreProgress(
            subject
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "technical-subject-card available";


    card.tabIndex =
        0;


    card.innerHTML = `

        <div class="technical-subject-top">

            <div class="technical-subject-letter">
                ${escapeHtml(
                    subject.code
                )}
            </div>

            <span class="subject-type ready">
                CORE
            </span>

        </div>


        <h3>
            ${escapeHtml(
                subject.name
            )}
        </h3>


        <p>
            ${escapeHtml(
                subject.description
            )}
        </p>


        <div class="subject-progress">

            <div class="subject-progress-row">

                <span>
                    Current Progress
                </span>

                <strong>
                    ${progress.percentage}%
                </strong>

            </div>


            <div class="subject-progress-track">

                <div
                    class="subject-progress-fill"
                    style="width:${progress.percentage}%">
                </div>

            </div>


            <div class="subject-progress-row">

                <span>
                    ${progress.chapters}
                    chapters
                </span>

                <span>
                    ${progress.topics}
                    topics
                </span>

            </div>

        </div>


        <div class="subject-action">
            Open ${escapeHtml(
                subject.name
            )} →
        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            openCoreSubject(
                subject
            );
        }
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openCoreSubject(
                    subject
                );
            }
        }
    );


    return card;
}


/* =========================================================
   CREATE MATERIAL CARD
========================================================= */

function createMaterialCard(
    subject
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "technical-subject-card available";


    card.tabIndex =
        0;


    card.innerHTML = `

        <div class="technical-subject-top">

            <div class="technical-subject-letter">
                ${escapeHtml(
                    subject.code
                )}
            </div>

            <span class="subject-type">
                STUDY MATERIAL
            </span>

        </div>


        <h3>
            ${escapeHtml(
                subject.name
            )}
        </h3>


        <p>
            ${escapeHtml(
                subject.description
            )}
        </p>


        <div class="subject-action">
            Open Study Material →
        </div>

    `;


    function openMaterial() {

        window.location.href =
            `./technical-learning.html?subject=${encodeURIComponent(
                subject.id
            )}`;
    }


    card.addEventListener(
        "click",
        openMaterial
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openMaterial();
            }
        }
    );


    return card;
}


/* =========================================================
   RENDER SUBJECTS
========================================================= */

function renderSubjects() {

    if (
        technicalSubjects
    ) {

        technicalSubjects.innerHTML =
            "";

        coreSubjects.forEach(
            subject => {

                technicalSubjects
                    .appendChild(
                        createCoreCard(
                            subject
                        )
                    );
            }
        );
    }


    if (
        futureSubjects
    ) {

        futureSubjects.innerHTML =
            "";

        materialSubjects.forEach(
            subject => {

                futureSubjects
                    .appendChild(
                        createMaterialCard(
                            subject
                        )
                    );
            }
        );
    }
}


/* =========================================================
   USER INITIALS
========================================================= */

function renderUser() {

    if (
        !userInitials ||
        !currentUser
    ) {
        return;
    }


    const name =
        currentUser.displayName ||
        currentUser.email ||
        "CareerPilot";


    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        parts.length >= 2
    ) {

        userInitials.textContent =
            (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();

    } else {

        userInitials.textContent =
            name
                .slice(0, 2)
                .toUpperCase();
    }
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );

                window.location.href =
                    "./login.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );
            }
        }
    );
}


/* =========================================================
   AUTH
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "./login.html";

            return;
        }


        currentUser =
            user;


        await loadUserData();

        renderUser();

        renderSubjects();
    }
);