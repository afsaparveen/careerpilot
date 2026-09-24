import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = [".pdf", ".docx"];

const SKILL_LIST = [
    "JavaScript",
    "TypeScript",
    "Java",
    "Python",
    "C++",
    "C#",
    "React",
    "Node.js",
    "Express",
    "HTML",
    "CSS",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "Azure",
    "Machine Learning",
    "Deep Learning",
    "Data Structures",
    "Algorithms",
    "DSA",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "OOP"
];

let currentUser = null;
let currentExtractedText = "";
let currentFile = null;

/* =========================================
   BASIC DOM HELPERS
========================================= */

function firstExisting(selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }

    return null;
}

function getOrCreateResultContainer() {
    let container = firstExisting([
        "#resume-results",
        "#results",
        ".resume-results",
        ".results-container"
    ]);

    if (container) return container;

    container = document.createElement("div");
    container.id = "resume-results";

    const main =
        document.querySelector("main") ||
        document.body;

    main.appendChild(container);

    return container;
}

function getStatusElement() {
    return firstExisting([
        "#resume-status",
        "#upload-status",
        ".resume-status",
        ".upload-status"
    ]);
}

function setStatus(message, type = "") {
    const status = getStatusElement();

    if (!status) return;

    status.textContent = message;

    status.className = `resume-status ${type}`.trim();
}

/* =========================================
   FILE INPUT / DROPZONE
========================================= */

function getFileInput() {
    return firstExisting([
        "#resumeFile",
        "#resume-file",
        "#resumeInput",
        "#resume-input",
        "#fileInput",
        'input[type="file"]'
    ]);
}

function getDropzone() {
    return firstExisting([
        "#resumeDropzone",
        "#resume-dropzone",
        ".resume-dropzone",
        ".drop-zone",
        ".upload-area"
    ]);
}

function setupFileUpload() {
    const input = getFileInput();
    const dropzone = getDropzone();

    if (input) {
        input.addEventListener("change", async (event) => {
            const file = event.target.files?.[0];

            if (file) {
                await processResume(file);
            }
        });
    }

    if (dropzone) {
        dropzone.addEventListener("click", () => {
            if (input) {
                input.click();
            }
        });

        dropzone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropzone.classList.add("drag-over");
        });

        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove("drag-over");
        });

        dropzone.addEventListener("drop", async (event) => {
            event.preventDefault();

            dropzone.classList.remove("drag-over");

            const file = event.dataTransfer.files?.[0];

            if (file) {
                await processResume(file);
            }
        });
    }
}

/* =========================================
   FILE VALIDATION
========================================= */

function getExtension(fileName) {
    const index = fileName.lastIndexOf(".");

    if (index === -1) {
        return "";
    }

    return fileName
        .slice(index)
        .toLowerCase();
}

function validateFile(file) {
    if (!file) {
        return {
            valid: false,
            message: "Please select a resume file."
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            message: "Resume must be smaller than 10 MB."
        };
    }

    const extension = getExtension(file.name);

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            message: "Only PDF and DOCX files are supported."
        };
    }

    return {
        valid: true,
        extension
    };
}

/* =========================================
   PDF EXTRACTION
========================================= */

async function extractPdfText(file) {
    const pdfjsLib = await import(
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
    );

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const pageText = content.items
            .map(item => item.str || "")
            .join(" ");

        fullText += `${pageText}\n`;
    }

    return fullText.trim();
}

/* =========================================
   DOCX EXTRACTION
========================================= */

async function extractDocxText(file) {
    const mammoth = await import(
        "https://cdn.jsdelivr.net/npm/mammoth@1.9.0/+esm"
    );

    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
        arrayBuffer
    });

    return (result.value || "").trim();
}

/* =========================================
   GENERAL TEXT EXTRACTION
========================================= */

async function extractResumeText(file) {
    const extension = getExtension(file.name);

    if (extension === ".pdf") {
        return await extractPdfText(file);
    }

    if (extension === ".docx") {
        return await extractDocxText(file);
    }

    throw new Error("Unsupported resume format.");
}

/* =========================================
   SKILL DETECTION
========================================= */

function detectSkills(text) {
    const normalizedText = text.toLowerCase();

    const detectedSkills = [];

    for (const skill of SKILL_LIST) {
        const skillLower = skill.toLowerCase();

        if (normalizedText.includes(skillLower)) {
            detectedSkills.push(skill);
        }
    }

    return [...new Set(detectedSkills)];
}

/* =========================================
   SECTION DETECTION
========================================= */

function hasAny(text, values) {
    return values.some(value =>
        text.toLowerCase().includes(value.toLowerCase())
    );
}

function detectSections(text) {
    return {
        contactInfo: hasAny(text, [
            "@",
            "email",
            "phone",
            "mobile",
            "contact"
        ]),

        education: hasAny(text, [
            "education",
            "b.tech",
            "b.e.",
            "bachelor",
            "master",
            "degree",
            "university",
            "college"
        ]),

        skills: hasAny(text, [
            "skills",
            "technical skills",
            "technologies",
            "technical expertise"
        ]),

        projects: hasAny(text, [
            "projects",
            "project experience",
            "academic project"
        ]),

        experience: hasAny(text, [
            "experience",
            "work experience",
            "professional experience",
            "internship",
            "intern"
        ]),

        linkedIn: text.toLowerCase().includes("linkedin.com"),

        github: text.toLowerCase().includes("github.com")
    };
}

/* =========================================
   RESUME AUDIT
========================================= */

function runResumeAudit(text, file) {
    const sections = detectSections(text);

    const lowerText = text.toLowerCase();

    const quantifiedResults =
        /\b\d+(\.\d+)?\s*(%|percent|users|projects|clients|days|months|years|hours|requests|records|items)\b/i.test(
            text
        ) ||
        /\b(increased|decreased|improved|reduced|grew|saved)\b.{0,60}\b\d+/i.test(
            text
        );

    const actionWords = [
        "built",
        "developed",
        "created",
        "implemented",
        "designed",
        "optimized",
        "improved",
        "automated",
        "led",
        "managed",
        "integrated",
        "deployed",
        "tested",
        "analyzed"
    ];

    const actionWordCount = actionWords.reduce(
        (count, word) => {
            const matches = lowerText.match(
                new RegExp(`\\b${word}\\b`, "g")
            );

            return count + (matches ? matches.length : 0);
        },
        0
    );

    const wordCount = text
        .split(/\s+/)
        .filter(Boolean).length;

    const estimatedPages =
        wordCount <= 700 ? 1 :
        wordCount <= 1400 ? 2 :
        3;

    const checks = [
        {
            key: "contactInfo",
            label: "Contact information",
            passed: sections.contactInfo,
            detail: sections.contactInfo
                ? "Contact details were detected."
                : "Add email address and phone/contact details."
        },

        {
            key: "education",
            label: "Education",
            passed: sections.education,
            detail: sections.education
                ? "Education section detected."
                : "Add a clear education section."
        },

        {
            key: "skills",
            label: "Skills section",
            passed: sections.skills,
            detail: sections.skills
                ? "Skills section detected."
                : "Add a dedicated technical skills section."
        },

        {
            key: "projects",
            label: "Projects",
            passed: sections.projects,
            detail: sections.projects
                ? "Project experience detected."
                : "Add 2–4 relevant projects."
        },

        {
            key: "experience",
            label: "Experience",
            passed: sections.experience,
            detail: sections.experience
                ? "Experience or internship section detected."
                : "Add experience, internship, or relevant work."
        },

        {
            key: "linkedin",
            label: "LinkedIn",
            passed: sections.linkedIn,
            detail: sections.linkedIn
                ? "LinkedIn profile detected."
                : "Consider adding your LinkedIn profile."
        },

        {
            key: "github",
            label: "GitHub",
            passed: sections.github,
            detail: sections.github
                ? "GitHub profile detected."
                : "Add GitHub for technical projects."
        },

        {
            key: "quantifiedResults",
            label: "Quantified achievements",
            passed: quantifiedResults,
            detail: quantifiedResults
                ? "Some measurable results were detected."
                : "Add numbers, percentages, scale, or measurable outcomes."
        },

        {
            key: "actionWriting",
            label: "Action-oriented writing",
            passed: actionWordCount >= 3,
            detail: actionWordCount >= 3
                ? "Action-oriented language detected."
                : "Start more bullets with strong action verbs."
        },

        {
            key: "resumeLength",
            label: "Resume length",
            passed: estimatedPages <= 2,
            detail: estimatedPages <= 2
                ? "Estimated length is within a common 1–2 page range."
                : "Consider reducing the resume to 1–2 pages."
        }
    ];

    const passedCount = checks.filter(check => check.passed).length;

    const score = Math.round(
        (passedCount / checks.length) * 100
    );

    const recommendations = checks
        .filter(check => !check.passed)
        .map(check => check.detail);

    if (score >= 85) {
        recommendations.unshift(
            "Your resume has strong structural coverage. Focus next on tailoring it to each job description."
        );
    } else if (score >= 65) {
        recommendations.unshift(
            "Your resume has a solid base. Strengthen the missing sections and add more measurable impact."
        );
    } else {
        recommendations.unshift(
            "Build a stronger resume foundation by adding the missing sections and clearer evidence."
        );
    }

    return {
        fileName: file.name,
        fileType: getExtension(file.name),
        fileSize: file.size,
        wordCount,
        estimatedPages,
        score,
        checks,
        recommendations,
        sections,
        actionWordCount,
        quantifiedResults,
        auditedAt: new Date().toISOString()
    };
}

/* =========================================
   CAREER EVIDENCE
========================================= */

function buildResumeEvidence(text, detectedSkills, audit) {
    return {
        source: "resume",
        detectedSkills,
        verifiedSkills: [],
        sectionsFound: audit.sections,
        resumeScore: audit.score,
        projectEvidence: audit.sections.projects,
        experienceEvidence: audit.sections.experience,
        skillEvidence: detectedSkills.map(skill => ({
            skill,
            source: "resume",
            verified: false
        })),
        updatedAt: new Date().toISOString()
    };
}

/* =========================================
   FIRESTORE SAVE
========================================= */

async function saveResumeData(audit, extractedText, evidence) {
    if (!currentUser) {
        throw new Error("You must be signed in.");
    }

    const userRef = doc(
        db,
        "users",
        currentUser.uid
    );

    const existingSnap = await getDoc(userRef);

    const existingData = existingSnap.exists()
        ? existingSnap.data()
        : {};

    await setDoc(
        userRef,
        {
            ...existingData,

            resumeData: audit,

            resumeExtractedText: extractedText,

            resumeEvidence: evidence,

            resumeUpdatedAt: new Date().toISOString()
        },
        {
            merge: true
        }
    );
}

/* =========================================
   RENDER RESULT
========================================= */

function renderAudit(audit, evidence) {
    const container = getOrCreateResultContainer();

    const scoreClass =
        audit.score >= 80
            ? "good"
            : audit.score >= 60
                ? "medium"
                : "needs-work";

    const checksHtml = audit.checks
        .map(check => `
            <div class="resume-check ${check.passed ? "passed" : "failed"}">
                <div>
                    <strong>
                        ${check.passed ? "✅" : "⚠️"}
                        ${escapeHtml(check.label)}
                    </strong>

                    <p>
                        ${escapeHtml(check.detail)}
                    </p>
                </div>
            </div>
        `)
        .join("");

    const skillsHtml = evidence.detectedSkills.length
        ? evidence.detectedSkills
            .map(skill => `
                <div class="resume-skill-chip">
                    ${escapeHtml(skill)}
                    <span>Detected</span>
                </div>
            `)
            .join("")
        : `
            <p class="empty-state">
                No supported technical skills were detected.
            </p>
        `;

    const recommendationsHtml =
        audit.recommendations
            .map(item => `
                <li>${escapeHtml(item)}</li>
            `)
            .join("");

    container.innerHTML = `
        <section class="resume-result-panel">

            <div class="resume-result-header">
                <div>
                    <p class="section-label">RESUME AUDIT</p>

                    <h2>
                        ${escapeHtml(audit.fileName)}
                    </h2>

                    <p>
                        ${audit.wordCount} words ·
                        estimated ${audit.estimatedPages} page${audit.estimatedPages === 1 ? "" : "s"}
                    </p>
                </div>

                <div class="resume-score ${scoreClass}">
                    <strong>${audit.score}%</strong>
                    <span>Resume Score</span>
                </div>
            </div>

            <div class="resume-result-grid">

                <div class="resume-result-card">
                    <h3>Audit Checks</h3>

                    <div class="resume-check-list">
                        ${checksHtml}
                    </div>
                </div>

                <div class="resume-result-card">
                    <h3>Detected Skills</h3>

                    <p class="muted">
                        These skills were detected in the resume.
                        They are <strong>not automatically verified</strong>.
                    </p>

                    <div class="resume-skill-list">
                        ${skillsHtml}
                    </div>
                </div>

            </div>

            <div class="resume-result-card">
                <h3>Recommendations</h3>

                <ul class="resume-recommendations">
                    ${recommendationsHtml}
                </ul>
            </div>

            <div class="resume-result-card resume-evidence-card">

                <div>
                    <p class="section-label">CAREER EVIDENCE</p>

                    <h3>Resume Evidence Saved</h3>

                    <p>
                        Your resume audit and detected skills were saved
                        to your CareerPilot profile.
                    </p>
                </div>

                <div class="evidence-stat">
                    <strong>${evidence.detectedSkills.length}</strong>
                    <span>Skills detected</span>
                </div>

                <div class="evidence-stat">
                    <strong>${audit.score}%</strong>
                    <span>Resume score</span>
                </div>

            </div>

            <div class="resume-storage-note">
                🔒 Original resume file was processed in your browser.
                It was <strong>not uploaded to Firebase Storage</strong>.
            </div>

        </section>
    `;
}

/* =========================================
   MAIN PROCESS
========================================= */

async function processResume(file) {
    if (!currentUser) {
        setStatus("Please sign in before uploading a resume.", "error");
        return;
    }

    const validation = validateFile(file);

    if (!validation.valid) {
        setStatus(validation.message, "error");
        return;
    }

    currentFile = file;

    try {
        setStatus("Reading your resume...", "loading");

        const extractedText = await extractResumeText(file);

        if (!extractedText || extractedText.length < 50) {
            throw new Error(
                "We could not extract enough text from this resume."
            );
        }

        currentExtractedText = extractedText;

        setStatus("Analyzing your resume...", "loading");

        const detectedSkills = detectSkills(extractedText);

        const audit = runResumeAudit(
            extractedText,
            file
        );

        const evidence = buildResumeEvidence(
            extractedText,
            detectedSkills,
            audit
        );

        setStatus("Saving your resume evidence...", "loading");

        await saveResumeData(
            audit,
            extractedText,
            evidence
        );

        renderAudit(
            audit,
            evidence
        );

        setStatus(
            "Resume analysis complete.",
            "success"
        );

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });

    } catch (error) {
        console.error(
            "Resume processing error:",
            error
        );

        setStatus(
            error.message ||
            "Something went wrong while processing the resume.",
            "error"
        );
    }
}

/* =========================================
   LOAD EXISTING RESUME DATA
========================================= */

async function loadExistingResume() {
    if (!currentUser) return;

    try {
        const userRef = doc(
            db,
            "users",
            currentUser.uid
        );

        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            return;
        }

        const data = snapshot.data();

        if (
            data.resumeData &&
            data.resumeEvidence
        ) {
            renderAudit(
                data.resumeData,
                data.resumeEvidence
            );

            setStatus(
                "Previous resume analysis loaded.",
                "success"
            );
        }

    } catch (error) {
        console.error(
            "Could not load previous resume:",
            error
        );
    }
}

/* =========================================
   SAFE HTML
========================================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================
   AUTH
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        currentUser = user;

        setupFileUpload();

        await loadExistingResume();
    }
);