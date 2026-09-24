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

let verifiedSkills = [];

let projects = [];


const projectForm =
    document.getElementById("projectForm");

const projectTitle =
    document.getElementById("projectTitle");

const projectDescription =
    document.getElementById("projectDescription");

const projectRole =
    document.getElementById("projectRole");

const projectDuration =
    document.getElementById("projectDuration");

const projectTech =
    document.getElementById("projectTech");

const githubUrl =
    document.getElementById("githubUrl");

const liveUrl =
    document.getElementById("liveUrl");

const verifiedSkillsPicker =
    document.getElementById("verifiedSkillsPicker");

const skillsPickerMessage =
    document.getElementById("skillsPickerMessage");

const projectsList =
    document.getElementById("projectsList");

const projectCount =
    document.getElementById("projectCount");

const formMessage =
    document.getElementById("formMessage");

const saveProjectButton =
    document.getElementById("saveProjectButton");

const descriptionCount =
    document.getElementById("descriptionCount");


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

        await loadProjectData();
    }
);


/* =========================================
   DESCRIPTION COUNTER
========================================= */

projectDescription.addEventListener(
    "input",
    () => {

        descriptionCount.textContent =
            `${projectDescription.value.length} / 900`;
    }
);


/* =========================================
   LOAD DATA
========================================= */

async function loadProjectData() {

    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        const snapshot =
            await getDoc(userRef);


        if (!snapshot.exists()) {

            verifiedSkills = [];

            projects = [];

            renderVerifiedSkills();

            renderProjects();

            return;
        }


        const data =
            snapshot.data();


        /* -----------------------------
           VERIFIED SKILLS
        ----------------------------- */

        if (
            Array.isArray(
                data.skillVerification?.verifiedSkills
            )
        ) {

            verifiedSkills =
                [
                    ...new Set(
                        data.skillVerification.verifiedSkills
                            .map(
                                skill =>
                                    String(skill).trim()
                            )
                            .filter(Boolean)
                    )
                ];

        } else if (
            data.verifiedSkills &&
            typeof data.verifiedSkills === "object"
        ) {

            verifiedSkills =
                Object.entries(
                    data.verifiedSkills
                )
                    .filter(
                        ([, value]) =>
                            value === true
                    )
                    .map(
                        ([skill]) =>
                            skill
                    );
        }


        /* -----------------------------
           PROJECTS
        ----------------------------- */

        projects =
            Array.isArray(data.projects)
                ? data.projects
                : [];


        renderVerifiedSkills();

        renderProjects();

    } catch (error) {

        console.error(
            "Project data loading error:",
            error
        );

        showFormMessage(
            "Could not load your project profile.",
            "error"
        );
    }
}


/* =========================================
   VERIFIED SKILL PICKER
========================================= */

function renderVerifiedSkills() {

    verifiedSkillsPicker.innerHTML = "";

    if (!verifiedSkills.length) {

        skillsPickerMessage.textContent =
            "No verified skills yet. Verify skills from the Skills page first.";

        skillsPickerMessage.classList.add(
            "error"
        );

        return;
    }


    skillsPickerMessage.textContent =
        "Select the verified skills you used in this project.";

    skillsPickerMessage.classList.remove(
        "error"
    );


    verifiedSkills.forEach(
        skill => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "skill-option";

            button.dataset.skill =
                skill;

            button.textContent =
                skill;


            button.addEventListener(
                "click",
                () => {

                    button.classList.toggle(
                        "selected"
                    );
                }
            );


            verifiedSkillsPicker.appendChild(
                button
            );
        }
    );
}


/* =========================================
   GET SELECTED SKILLS
========================================= */

function getSelectedSkills() {

    return [
        ...document.querySelectorAll(
            ".skill-option.selected"
        )
    ].map(
        button =>
            button.dataset.skill
    );
}


/* =========================================
   SAVE PROJECT
========================================= */

projectForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const title =
            projectTitle.value.trim();

        const description =
            projectDescription.value.trim();

        const role =
            projectRole.value.trim();

        const duration =
            projectDuration.value.trim();

        const technologies =
            projectTech.value
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean);

        const selectedSkills =
            getSelectedSkills();

        const github =
            githubUrl.value.trim();

        const live =
            liveUrl.value.trim();


        if (!title) {

            showFormMessage(
                "Enter a project title.",
                "error"
            );

            return;
        }


        if (description.length < 30) {

            showFormMessage(
                "Write a project description of at least 30 characters.",
                "error"
            );

            return;
        }


        if (
            github &&
            !isValidUrl(github)
        ) {

            showFormMessage(
                "Enter a valid GitHub URL.",
                "error"
            );

            return;
        }


        if (
            live &&
            !isValidUrl(live)
        ) {

            showFormMessage(
                "Enter a valid live project URL.",
                "error"
            );

            return;
        }


        saveProjectButton.disabled =
            true;

        saveProjectButton.textContent =
            "Saving...";


        try {

            const newProject = {

                id:
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`,

                title,

                description,

                role,

                duration,

                technologies,

                verifiedSkills:
                    selectedSkills,

                githubUrl:
                    github || "",

                liveUrl:
                    live || "",

                createdAt:
                    new Date().toISOString()
            };


            projects = [
                newProject,
                ...projects
            ];


            /*
             * Keep the latest 12 projects
             * in the user document.
             */

            projects =
                projects.slice(0, 12);


            await saveProjects();


            projectForm.reset();

            descriptionCount.textContent =
                "0 / 900";


            document
                .querySelectorAll(
                    ".skill-option.selected"
                )
                .forEach(
                    button =>
                        button.classList.remove(
                            "selected"
                        )
                );


            renderProjects();


            showFormMessage(
                "Project saved to your CareerPilot profile.",
                "success"
            );


            showToast(
                "Project added successfully.",
                "success"
            );


            window.scrollTo({
                top:
                    document.body.scrollHeight,
                behavior:
                    "smooth"
            });


        } catch (error) {

            console.error(
                "Project save error:",
                error
            );


            /*
             * Remove optimistic project
             * if Firestore fails.
             */

            projects =
                projects.filter(
                    project =>
                        project.id !==
                        undefined
                );


            showFormMessage(
                "Could not save the project. Please try again.",
                "error"
            );


        } finally {

            saveProjectButton.disabled =
                false;

            saveProjectButton.textContent =
                "Save Project";
        }
    }
);


/* =========================================
   SAVE PROJECT ARRAY
========================================= */

async function saveProjects() {

    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    await setDoc(
        userRef,
        {
            projects
        },
        {
            merge: true
        }
    );
}


/* =========================================
   DELETE PROJECT
========================================= */

async function deleteProject(projectId) {

    const originalProjects =
        [...projects];


    projects =
        projects.filter(
            project =>
                project.id !== projectId
        );


    renderProjects();


    try {

        await saveProjects();

        showToast(
            "Project removed.",
            "success"
        );

    } catch (error) {

        console.error(
            "Project delete error:",
            error
        );

        projects =
            originalProjects;

        renderProjects();

        showToast(
            "Could not remove the project.",
            "error"
        );
    }
}


/* =========================================
   RENDER PROJECTS
========================================= */

function renderProjects() {

    projectCount.textContent =
        projects.length;


    projectsList.innerHTML = "";


    if (!projects.length) {

        projectsList.innerHTML = `
            <div class="projects-empty">

                <div class="projects-empty-icon">
                    🚀
                </div>

                <h3>
                    No projects added yet
                </h3>

                <p>
                    Add your strongest academic, personal,
                    internship, or placement projects above.
                </p>

            </div>
        `;

        return;
    }


    projects.forEach(
        project => {

            const card =
                document.createElement("article");

            card.className =
                "project-card";


            const technologies =
                Array.isArray(
                    project.technologies
                )
                    ? project.technologies
                    : [];


            const projectSkills =
                Array.isArray(
                    project.verifiedSkills
                )
                    ? project.verifiedSkills
                    : [];


            const technologyHtml =
                technologies.length
                    ? `
                        <div class="project-tech-list">
                            ${technologies
                                .map(
                                    item => `
                                        <span class="project-tag">
                                            ${escapeHtml(item)}
                                        </span>
                                    `
                                )
                                .join("")}
                        </div>
                      `
                    : "";


            const skillHtml =
                projectSkills.length
                    ? `
                        <div class="project-skill-list">
                            ${projectSkills
                                .map(
                                    skill => `
                                        <span class="project-skill-tag">
                                            ✓ ${escapeHtml(skill)}
                                        </span>
                                    `
                                )
                                .join("")}
                        </div>
                      `
                    : "";


            const linksHtml = `
                <div class="project-links">

                    ${
                        project.githubUrl
                            ? `
                                <a
                                    href="${safeUrl(project.githubUrl)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub ↗
                                </a>
                              `
                            : ""
                    }

                    ${
                        project.liveUrl
                            ? `
                                <a
                                    href="${safeUrl(project.liveUrl)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Live Project ↗
                                </a>
                              `
                            : ""
                    }

                    <a
                        href="#"
                        class="delete-project"
                        data-id="${escapeHtml(project.id)}"
                    >
                        Delete
                    </a>

                </div>
            `;


            card.innerHTML = `
                <div class="project-card-top">

                    <div>

                        <h3>
                            ${escapeHtml(project.title)}
                        </h3>

                        ${
                            project.role
                                ? `
                                    <div class="project-role">
                                        ${escapeHtml(project.role)}
                                    </div>
                                  `
                                : ""
                        }

                    </div>

                    <div class="project-date">
                        ${formatDate(project.createdAt)}
                    </div>

                </div>


                ${
                    project.duration
                        ? `
                            <div class="project-role">
                                ${escapeHtml(project.duration)}
                            </div>
                          `
                        : ""
                }


                <p class="project-description">
                    ${escapeHtml(project.description)}
                </p>


                ${technologyHtml}

                ${skillHtml}

                ${linksHtml}
            `;


            const deleteButton =
                card.querySelector(
                    ".delete-project"
                );


            deleteButton.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();

                    const confirmed =
                        window.confirm(
                            "Remove this project from your CareerPilot profile?"
                        );

                    if (!confirmed) {
                        return;
                    }

                    await deleteProject(
                        project.id
                    );
                }
            );


            projectsList.appendChild(
                card
            );
        }
    );
}


/* =========================================
   URL VALIDATION
========================================= */

function isValidUrl(value) {

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;
    }
}


function safeUrl(value) {

    if (!isValidUrl(value)) {
        return "#";
    }

    return escapeHtml(value);
}


/* =========================================
   DATE
========================================= */

function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/* =========================================
   FORM MESSAGE
========================================= */

function showFormMessage(
    message,
    type
) {

    formMessage.textContent =
        message;

    formMessage.className =
        `form-message show ${type}`;
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


    clearTimeout(
        toastTimer
    );


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
   HTML ESCAPE
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