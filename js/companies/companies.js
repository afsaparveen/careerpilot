import { auth, db } from "../firebase/firebase-config.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ======================================================
// DOM
// ======================================================

const companyForm =
    document.getElementById(
        "companyForm"
    );

const companyNameInput =
    document.getElementById(
        "companyName"
    );

const roleInput =
    document.getElementById(
        "role"
    );

const statusInput =
    document.getElementById(
        "status"
    );

const interviewDateInput =
    document.getElementById(
        "interviewDate"
    );

const focusAreasInput =
    document.getElementById(
        "focusAreas"
    );

const notesInput =
    document.getElementById(
        "notes"
    );

const companiesList =
    document.getElementById(
        "companiesList"
    );

const searchCompany =
    document.getElementById(
        "searchCompany"
    );

const filterStatus =
    document.getElementById(
        "filterStatus"
    );

const totalCompanies =
    document.getElementById(
        "totalCompanies"
    );

const activeCompanies =
    document.getElementById(
        "activeCompanies"
    );

const interviewCompanies =
    document.getElementById(
        "interviewCompanies"
    );

const targetCount =
    document.getElementById(
        "targetCount"
    );

const applicationCount =
    document.getElementById(
        "applicationCount"
    );

const interviewCount =
    document.getElementById(
        "interviewCount"
    );

const completedCount =
    document.getElementById(
        "completedCount"
    );

const toast =
    document.getElementById(
        "toast"
    );


// ======================================================
// STATE
// ======================================================

let currentUser = null;

let companies = [];

let editingId = null;


// ======================================================
// STATUS
// ======================================================

const ACTIVE_STATUSES = [
    "Preparing",
    "Applied",
    "Shortlisted",
    "Interview"
];


// ======================================================
// HELPERS
// ======================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


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


function createId() {

    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2)
    );
}


function getInitials(name) {

    const parts =
        String(name || "")
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


function formatDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}


function getStatusClass(
    status
) {

    return (
        `status-${String(status || "Target")
            .toLowerCase()
            .replaceAll(" ", "-")}`
    );
}


// ======================================================
// LOAD
// ======================================================

async function loadCompanies() {

    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );

        const snapshot =
            await getDoc(
                userRef
            );

        if (!snapshot.exists()) {

            companies = [];

            render();

            return;
        }

        const data =
            snapshot.data();

        companies =
            Array.isArray(
                data.companies
            )
                ? data.companies
                : [];

        render();

    } catch (error) {

        console.error(
            "Companies loading error:",
            error
        );

        companies = [];

        render();
    }
}
// ======================================================
// SAVE
// ======================================================

async function saveCompanies() {

    const userRef =
        doc(
            db,
            "users",
            currentUser.uid
        );


    await updateDoc(
        userRef,
        {
            companies
        }
    );
}


// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    companyForm.reset();

    editingId = null;

    const submitButton =
        companyForm.querySelector(
            "button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "+ Add Company";
    }
}


// ======================================================
// EDIT FORM
// ======================================================

function populateForm(
    company
) {

    companyNameInput.value =
        company.companyName || "";

    roleInput.value =
        company.role || "";

    statusInput.value =
        company.status || "Target";

    interviewDateInput.value =
        company.interviewDate || "";

    focusAreasInput.value =
        company.focusAreas || "";

    notesInput.value =
        company.notes || "";


    editingId =
        company.id;


    const submitButton =
        companyForm.querySelector(
            "button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "Update Company";
    }


    companyForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ======================================================
// ADD / UPDATE
// ======================================================

companyForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        const companyName =
            companyNameInput.value.trim();

        const role =
            roleInput.value.trim();

        const status =
            statusInput.value;

        const interviewDate =
            interviewDateInput.value;

        const focusAreas =
            focusAreasInput.value.trim();

        const notes =
            notesInput.value.trim();


        if (
            !companyName ||
            !role
        ) {

            showToast(
                "Enter company name and target role."
            );

            return;
        }


        const existingCompany =
            companies.find(
                company =>
                    company.id ===
                    editingId
            );


        if (existingCompany) {

            existingCompany.companyName =
                companyName;

            existingCompany.role =
                role;

            existingCompany.status =
                status;

            existingCompany.interviewDate =
                interviewDate;

            existingCompany.focusAreas =
                focusAreas;

            existingCompany.notes =
                notes;

            existingCompany.updatedAt =
                new Date().toISOString();

            showToast(
                "Company updated successfully."
            );

        } else {

            companies.unshift({
                id: createId(),
                companyName,
                role,
                status,
                interviewDate,
                focusAreas,
                notes,
                createdAt:
                    new Date().toISOString(),
                updatedAt:
                    new Date().toISOString()
            });

            showToast(
                "Company added successfully."
            );
        }


        try {

            await saveCompanies();

            resetForm();

            render();

        } catch (error) {

            console.error(
                "Company save error:",
                error
            );

            showToast(
                "Could not save company."
            );
        }

    }
);


// ======================================================
// DELETE
// ======================================================

async function deleteCompany(
    companyId
) {

    const company =
        companies.find(
            item =>
                item.id ===
                companyId
        );


    if (!company) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete ${company.companyName} from your tracker?`
        );


    if (!confirmed) {
        return;
    }


    companies =
        companies.filter(
            item =>
                item.id !==
                companyId
        );


    try {

        await saveCompanies();

        render();

        showToast(
            "Company removed."
        );

    } catch (error) {

        console.error(
            "Company delete error:",
            error
        );

        showToast(
            "Could not delete company."
        );
    }
}


// ======================================================
// FILTER
// ======================================================

function getFilteredCompanies() {

    const query =
        searchCompany
            ? searchCompany.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        filterStatus
            ? filterStatus.value
            : "all";


    return companies.filter(
        company => {

            const matchesSearch =
                !query ||
                String(
                    company.companyName
                )
                    .toLowerCase()
                    .includes(query) ||

                String(
                    company.role
                )
                    .toLowerCase()
                    .includes(query) ||

                String(
                    company.focusAreas
                )
                    .toLowerCase()
                    .includes(query);


            const matchesStatus =
                selectedStatus === "all" ||
                company.status ===
                    selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );
}


// ======================================================
// STATS
// ======================================================

function renderStats() {

    const total =
        companies.length;


    const active =
        companies.filter(
            company =>
                ACTIVE_STATUSES.includes(
                    company.status
                )
        ).length;


    const interviews =
        companies.filter(
            company =>
                company.status ===
                "Interview"
        ).length;


    const targets =
        companies.filter(
            company =>
                company.status ===
                    "Target" ||
                company.status ===
                    "Preparing"
        ).length;


    const applications =
        companies.filter(
            company =>
                company.status ===
                    "Applied" ||
                company.status ===
                    "Shortlisted" ||
                company.status ===
                    "Interview" ||
                company.status ===
                    "Selected" ||
                company.status ===
                    "Rejected"
        ).length;


    const completed =
        companies.filter(
            company =>
                company.status ===
                "Selected"
        ).length;


    if (totalCompanies) {
        totalCompanies.textContent =
            total;
    }


    if (activeCompanies) {
        activeCompanies.textContent =
            active;
    }


    if (interviewCompanies) {
        interviewCompanies.textContent =
            interviews;
    }


    if (targetCount) {
        targetCount.textContent =
            targets;
    }


    if (applicationCount) {
        applicationCount.textContent =
            applications;
    }


    if (interviewCount) {
        interviewCount.textContent =
            interviews;
    }


    if (completedCount) {
        completedCount.textContent =
            completed;
    }
}


// ======================================================
// RENDER
// ======================================================

function render() {

    renderStats();

    renderList();
}


// ======================================================
// RENDER LIST
// ======================================================

function renderList() {

    if (!companiesList) {
        return;
    }


    const filtered =
        getFilteredCompanies();


    if (
        filtered.length === 0
    ) {

        companiesList.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    🏢
                </div>

                <h3>
                    No companies found
                </h3>

                <p>
                    Add a company above to start
                    building your placement tracker.
                </p>

            </div>
        `;

        return;
    }


    companiesList.innerHTML =
        filtered.map(
            company => {

                const initials =
                    getInitials(
                        company.companyName
                    );


                const statusClass =
                    getStatusClass(
                        company.status
                    );


                const focus =
                    company.focusAreas
                        ? escapeHtml(
                            company.focusAreas
                        )
                        : "No focus areas added";


                const interview =
                    company.interviewDate
                        ? `
                            <span class="meta-chip">
                                📅 ${escapeHtml(
                                    formatDate(
                                        company.interviewDate
                                    )
                                )}
                            </span>
                        `
                        : "";


                const notes =
                    company.notes
                        ? `
                            <p class="company-notes">
                                ${escapeHtml(
                                    company.notes
                                )}
                            </p>
                        `
                        : "";


                return `
                    <article class="company-card">

                        <div class="company-logo">
                            ${escapeHtml(initials)}
                        </div>


                        <div class="company-main">

                            <div class="company-topline">

                                <h3>
                                    ${escapeHtml(
                                        company.companyName
                                    )}
                                </h3>

                                <span
                                    class="status-badge ${statusClass}"
                                >
                                    ${escapeHtml(
                                        company.status
                                    )}
                                </span>

                            </div>


                            <div class="company-role">
                                ${escapeHtml(
                                    company.role
                                )}
                            </div>


                            <div class="company-meta">

                                <span class="meta-chip">
                                    📚 ${focus}
                                </span>

                                ${interview}

                            </div>


                            ${notes}

                        </div>


                        <div class="company-actions">

                            <button
                                type="button"
                                class="company-action-button edit-company"
                                data-edit-id="${escapeHtml(
                                    company.id
                                )}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="company-action-button delete-company"
                                data-delete-id="${escapeHtml(
                                    company.id
                                )}"
                            >
                                Delete
                            </button>

                        </div>

                    </article>
                `;
            }
        )
        .join("");


    document
        .querySelectorAll(
            "[data-edit-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.editId;

                    const company =
                        companies.find(
                            item =>
                                item.id === id
                        );

                    if (company) {
                        populateForm(
                            company
                        );
                    }

                }
            );

        });


    document
        .querySelectorAll(
            "[data-delete-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    await deleteCompany(
                        button.dataset.deleteId
                    );

                }
            );

        });
}


// ======================================================
// FILTER EVENTS
// ======================================================

if (searchCompany) {

    searchCompany.addEventListener(
        "input",
        renderList
    );
}


if (filterStatus) {

    filterStatus.addEventListener(
        "change",
        renderList
    );
}


// ======================================================
// AUTH
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

        await loadCompanies();

        if (
            companies.length === 0 &&
            companiesList
        ) {
            companiesList.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-icon">
                        🏢
                    </div>

                    <h3>
                        No companies found
                    </h3>

                    <p>
                        Add a company above to start
                        building your placement tracker.
                    </p>

                </div>
            `;
        }
    }
);