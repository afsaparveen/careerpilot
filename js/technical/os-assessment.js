/* =========================================================
   OPERATING SYSTEMS ASSESSMENT
   CareerPilot AI

   Flow:

   Learn Topics
        ↓
   Complete Topics
        ↓
   Assessment
        ↓
   Score >= 75%
        ↓
   Chapter Completed
        ↓
   Next Chapter Unlocked
========================================================= */

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
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const chapterId =
    params.get(
        "chapter"
    );


/* =========================================================
   DOM
========================================================= */

const title =
    document.getElementById(
        "assessmentTitle"
    );

const description =
    document.getElementById(
        "assessmentDescription"
    );

const questionContainer =
    document.getElementById(
        "questionContainer"
    );

const submitBtn =
    document.getElementById(
        "submitBtn"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

const resultTitle =
    document.getElementById(
        "resultTitle"
    );

const resultMessage =
    document.getElementById(
        "resultMessage"
    );

const resultScore =
    document.getElementById(
        "resultScore"
    );

const resultIcon =
    document.getElementById(
        "resultIcon"
    );

const correctCount =
    document.getElementById(
        "correctCount"
    );

const wrongCount =
    document.getElementById(
        "wrongCount"
    );

const totalCount =
    document.getElementById(
        "totalCount"
    );

const retryBtn =
    document.getElementById(
        "retryBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================================
   STATE
========================================================= */

let user = null;

let curriculum = null;

let chapter = null;

let questions = [];

let progress = {

    completedTopics: {},

    selfChecks: {},

    completedChapters: {},

    assessments: {}

};


/* =========================================================
   QUESTION BANK
========================================================= */

const questionBanks = {

    "os-introduction": [

        [
            "What is the primary role of an Operating System?",
            [
                "Interface between user and hardware",
                "Only a compiler",
                "Only a browser",
                "Only a database"
            ],
            0
        ],

        [
            "Which OS type processes groups of jobs without direct interaction during execution?",
            [
                "Batch OS",
                "Time Sharing OS",
                "Real Time OS",
                "Distributed OS"
            ],
            0
        ],

        [
            "Which mode has privileged access to hardware resources?",
            [
                "User mode",
                "Kernel mode",
                "Browser mode",
                "Application mode"
            ],
            1
        ],

        [
            "A process is:",
            [
                "A program under execution",
                "A file extension",
                "A folder",
                "A database"
            ],
            0
        ],

        [
            "Which OS type keeps multiple jobs in memory to improve CPU utilization?",
            [
                "Multiprogramming",
                "Batch",
                "Single-user",
                "Offline"
            ],
            0
        ],

        [
            "Real-time systems are designed to:",
            [
                "Meet required timing deadlines",
                "Avoid all memory use",
                "Only run browsers",
                "Only store files"
            ],
            0
        ]

    ],


    "process-management": [

        [
            "What does PCB stand for?",
            [
                "Process Control Block",
                "Program Cache Buffer",
                "Process Code Bus",
                "Program Control Board"
            ],
            0
        ],

        [
            "The Program Counter stores:",
            [
                "Address of the next instruction",
                "Disk size",
                "File name",
                "User password"
            ],
            0
        ],

        [
            "A running process is:",
            [
                "Currently using the CPU",
                "Waiting for input",
                "Already terminated",
                "Being created"
            ],
            0
        ],

        [
            "A process waiting for I/O is commonly in:",
            [
                "Waiting/Blocked state",
                "Running state",
                "New state",
                "Terminated state"
            ],
            0
        ],

        [
            "Which activity is part of process management?",
            [
                "Process creation and scheduling",
                "CSS rendering",
                "Image compression",
                "Web styling"
            ],
            0
        ],

        [
            "Ready state means a process is:",
            [
                "Waiting for CPU time",
                "Finished forever",
                "Deleted",
                "Running on disk"
            ],
            0
        ]

    ],


    "cpu-scheduling": [

        [
            "CPU scheduling selects:",
            [
                "Which ready process runs next",
                "Which file is deleted",
                "Which user logs in",
                "Which disk is formatted"
            ],
            0
        ],

        [
            "Which is non-preemptive?",
            [
                "A process keeps CPU until completion/blocking",
                "CPU is always forcibly removed",
                "Only high priority runs",
                "No scheduling happens"
            ],
            0
        ],

        [
            "Which scheduling algorithm uses a time quantum?",
            [
                "Round Robin",
                "FCFS",
                "SJF only",
                "FIFO disk scheduling"
            ],
            0
        ],

        [
            "FCFS schedules according to:",
            [
                "Arrival order",
                "File size",
                "Priority only",
                "Memory size"
            ],
            0
        ],

        [
            "A major goal of scheduling is to:",
            [
                "Reduce waiting and response time",
                "Increase starvation",
                "Keep CPU idle",
                "Delete processes"
            ],
            0
        ],

        [
            "Preemptive scheduling can improve:",
            [
                "Responsiveness",
                "Disk capacity",
                "File permissions",
                "Database indexing"
            ],
            0
        ]

    ],


    "process-synchronization": [

        [
            "A critical section is where:",
            [
                "Shared resources are accessed",
                "A file is compiled",
                "A disk is formatted",
                "A process is deleted"
            ],
            0
        ],

        [
            "A race condition depends on:",
            [
                "Timing of concurrent access",
                "Screen size",
                "Disk brand",
                "Keyboard layout"
            ],
            0
        ],

        [
            "Which is a critical section requirement?",
            [
                "Mutual exclusion",
                "Data deletion",
                "File mounting",
                "Disk formatting"
            ],
            0
        ],

        [
            "A mutex provides:",
            [
                "Exclusive access",
                "Multiple CPUs",
                "Disk storage",
                "Network routing"
            ],
            0
        ],

        [
            "A binary semaphore generally uses:",
            [
                "0 and 1",
                "1 and 2",
                "2 and 3",
                "Any string"
            ],
            0
        ],

        [
            "Producer-Consumer commonly uses a:",
            [
                "Shared buffer",
                "Kernel file",
                "Disk partition",
                "CPU cache only"
            ],
            0
        ]

    ],


    "deadlock": [

        [
            "Which is a necessary condition for deadlock?",
            [
                "Circular wait",
                "Sorting",
                "Caching",
                "Compilation"
            ],
            0
        ],

        [
            "P → R in a Resource Allocation Graph means:",
            [
                "Process requests resource",
                "Resource requests process",
                "Process terminates",
                "Resource is released"
            ],
            0
        ],

        [
            "Which algorithm is associated with deadlock avoidance?",
            [
                "Banker's Algorithm",
                "Round Robin",
                "FCFS",
                "SCAN"
            ],
            0
        ],

        [
            "Deadlock prevention attempts to:",
            [
                "Break at least one necessary condition",
                "Increase circular wait",
                "Remove all CPU scheduling",
                "Delete memory"
            ],
            0
        ],

        [
            "Detection and recovery means:",
            [
                "Allow deadlock, detect it and recover",
                "Never detect anything",
                "Disable the OS",
                "Only increase RAM"
            ],
            0
        ],

        [
            "R → P in a Resource Allocation Graph means:",
            [
                "Resource is assigned to process",
                "Process requests resource",
                "Process is terminated",
                "Disk is mounted"
            ],
            0
        ]

    ],


    /* =====================================================
       IMPORTANT:
       THIS ID MUST MATCH os-curriculum.json
    ===================================================== */

    "inter-process-communication": [

        [
            "IPC stands for:",
            [
                "Inter-process Communication",
                "Internal Program Cache",
                "Input Process Controller",
                "Internet Program Compiler"
            ],
            0
        ],

        [
            "Message passing communicates using:",
            [
                "Structured messages",
                "Shared files only",
                "Disk blocks",
                "Keyboard events"
            ],
            0
        ],

        [
            "Shared memory requires:",
            [
                "Synchronization to avoid clashes",
                "No OS support",
                "No memory",
                "Only a browser"
            ],
            0
        ],

        [
            "IPC is useful for:",
            [
                "Client-server communication",
                "CSS styling",
                "Image editing",
                "Font selection"
            ],
            0
        ],

        [
            "Which IPC approach can work across machines?",
            [
                "Message passing",
                "Only local shared memory",
                "CPU registers",
                "Screen sharing"
            ],
            0
        ],

        [
            "Shared memory can be fast because:",
            [
                "There is no message-copying overhead in the shared region",
                "It uses no RAM",
                "It removes the CPU",
                "It deletes all synchronization"
            ],
            0
        ]

    ],


    "memory-management": [

        [
            "Internal fragmentation is wasted space:",
            [
                "Inside allocated blocks",
                "Only on disk",
                "Between networks",
                "Inside files"
            ],
            0
        ],

        [
            "External fragmentation is wasted space:",
            [
                "Between allocated blocks",
                "Inside one allocated block",
                "Inside the CPU",
                "In the browser"
            ],
            0
        ],

        [
            "Variable partitioning can cause:",
            [
                "External fragmentation",
                "Only internal fragmentation",
                "No fragmentation",
                "Network fragmentation"
            ],
            0
        ],

        [
            "Fixed partitioning can cause:",
            [
                "Internal fragmentation",
                "No memory waste",
                "Only file fragmentation",
                "Only CPU fragmentation"
            ],
            0
        ],

        [
            "Paging uses:",
            [
                "Pages and frames",
                "Only partitions",
                "Only files",
                "Only registers"
            ],
            0
        ],

        [
            "Compaction is mainly used to reduce:",
            [
                "External fragmentation",
                "CPU starvation",
                "Disk rotation",
                "Race conditions"
            ],
            0
        ]

    ],


    "file-systems": [

        [
            "Which method uses a bit per disk block?",
            [
                "Bitmap",
                "Queue",
                "Stack",
                "Hash table"
            ],
            0
        ],

        [
            "A free list stores:",
            [
                "Linked free blocks",
                "CPU instructions",
                "User passwords",
                "Only file names"
            ],
            0
        ],

        [
            "Mounting a file system makes it:",
            [
                "Accessible to the OS",
                "Invisible to the OS",
                "A CPU process",
                "A database query"
            ],
            0
        ],

        [
            "A mount point is:",
            [
                "Directory where a file system is attached",
                "A CPU register",
                "A process state",
                "A scheduling algorithm"
            ],
            0
        ],

        [
            "In UFS, the inode stores:",
            [
                "File metadata",
                "Only file contents",
                "Only boot code",
                "Only directory names"
            ],
            0
        ],

        [
            "In UFS, data blocks contain:",
            [
                "Actual file contents",
                "Only permissions",
                "Only bootloader code",
                "Only file-system type"
            ],
            0
        ]

    ],


    "disk-management": [

        [
            "Disk scheduling determines:",
            [
                "Order of servicing disk requests",
                "Order of user logins",
                "Order of source files",
                "Order of CSS rules"
            ],
            0
        ],

        [
            "FCFS disk scheduling serves requests:",
            [
                "In arrival order",
                "By closest distance",
                "By highest priority only",
                "Randomly"
            ],
            0
        ],

        [
            "SSTF chooses the request with:",
            [
                "Shortest seek distance",
                "Longest seek distance",
                "Largest file size",
                "Highest CPU priority"
            ],
            0
        ],

        [
            "SCAN is often compared to:",
            [
                "An elevator movement pattern",
                "A queue stack",
                "A memory page",
                "A compiler"
            ],
            0
        ],

        [
            "Seek time is related to:",
            [
                "Moving the disk head to the required position",
                "Reading keyboard input",
                "Creating a process",
                "Loading CSS"
            ],
            0
        ],

        [
            "Rotational delay is waiting for:",
            [
                "The required sector to rotate under the head",
                "A process to terminate",
                "A file to mount",
                "The CPU to cool"
            ],
            0
        ]

    ]

};


/* =========================================================
   LOAD CURRICULUM
========================================================= */

async function loadCurriculum() {

    const response =
        await fetch(
            "../data/os-curriculum.json",
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            `Could not load OS curriculum. HTTP ${response.status}`
        );
    }

    const data =
        await response.json();

    if (
        !data ||
        !Array.isArray(data.chapters)
    ) {

        throw new Error(
            "Invalid OS curriculum."
        );
    }

    return data;
}


/* =========================================================
   LOAD PROGRESS
========================================================= */

async function loadProgress() {

    const ref =
        doc(
            db,
            "users",
            user.uid
        );

    const snapshot =
        await getDoc(
            ref
        );

    if (!snapshot.exists()) {
        return;
    }

    const data =
        snapshot.data();

    const saved =
        data.osProgress || {};

    progress = {

        completedTopics:
            saved.completedTopics || {},

        selfChecks:
            saved.selfChecks || {},

        completedChapters:
            saved.completedChapters || {},

        assessments:
            saved.assessments || {}

    };
}


/* =========================================================
   CHECK CHAPTER UNLOCK
========================================================= */

function isChapterUnlocked(
    index
) {

    if (index === 0) {
        return true;
    }

    const previous =
        curriculum.chapters[
            index - 1
        ];

    return Boolean(
        progress.completedChapters[
            previous.id
        ]
    );
}


/* =========================================================
   CHECK TOPIC COMPLETION
========================================================= */

function areAllTopicsCompleted(
    chapter
) {

    const topics =
        chapter.topics || [];

    if (topics.length === 0) {
        return false;
    }

    for (
        let i = 0;
        i < topics.length;
        i++
    ) {

        const key =
            `${chapter.id}__${topics[i].id}`;

        if (
            !progress.completedTopics[key]
        ) {

            return false;
        }
    }

    return true;
}


/* =========================================================
   RENDER QUESTIONS
========================================================= */

function renderQuestions() {

    questionContainer.innerHTML =
        "";

    questions.forEach(
        (
            question,
            index
        ) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "question";


            const heading =
                document.createElement(
                    "h3"
                );

            heading.textContent =
                `${index + 1}. ${question[0]}`;


            card.appendChild(
                heading
            );


            question[1].forEach(
                (
                    option,
                    optionIndex
                ) => {

                    const label =
                        document.createElement(
                            "label"
                        );

                    label.className =
                        "option";


                    const input =
                        document.createElement(
                            "input"
                        );

                    input.type =
                        "radio";

                    input.name =
                        `q${index}`;

                    input.value =
                        optionIndex;


                    input.addEventListener(
                        "change",
                        updateProgress
                    );


                    const span =
                        document.createElement(
                            "span"
                        );

                    span.textContent =
                        option;


                    label.appendChild(
                        input
                    );

                    label.appendChild(
                        span
                    );

                    card.appendChild(
                        label
                    );
                }
            );


            questionContainer.appendChild(
                card
            );
        }
    );

    updateProgress();
}


/* =========================================================
   UPDATE TEST PROGRESS
========================================================= */

function updateProgress() {

    if (
        questions.length === 0
    ) {

        progressText.textContent =
            "0%";

        progressFill.style.width =
            "0%";

        return;
    }


    let answered = 0;


    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        const selected =
            document.querySelector(
                `input[name="q${i}"]:checked`
            );

        if (selected) {
            answered++;
        }
    }


    const percentage =
        Math.round(
            (
                answered /
                questions.length
            ) * 100
        );


    progressText.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;
}


/* =========================================================
   SAVE ASSESSMENT RESULT
========================================================= */

async function saveResult(
    score,
    correct,
    total,
    passed
) {

    const ref =
        doc(
            db,
            "users",
            user.uid
        );

    const snapshot =
        await getDoc(
            ref
        );

    const data =
        snapshot.exists()
            ? snapshot.data()
            : {};


    const osProgress =
        data.osProgress || {};


    const assessments =
        osProgress.assessments || {};


    const completedChapters =
        osProgress.completedChapters || {};


    assessments[chapter.id] = {

        score,

        correct,

        total,

        passed,

        completedAt:
            new Date().toISOString()

    };


    /*
       ONLY a passing assessment
       completes the chapter.
    */

    if (passed) {

        completedChapters[
            chapter.id
        ] = true;
    }


    await setDoc(
        ref,
        {
            osProgress: {

                ...osProgress,

                assessments,

                completedChapters

            }
        },
        {
            merge: true
        }
    );


    /*
       Update local state immediately.
    */

    progress.assessments =
        assessments;

    progress.completedChapters =
        completedChapters;
}


/* =========================================================
   SHOW RESULT
========================================================= */

function showResult(
    score,
    correct,
    total,
    passed
) {

    resultCard.hidden =
        false;

    resultScore.textContent =
        `${score}%`;

    correctCount.textContent =
        correct;

    wrongCount.textContent =
        total - correct;

    totalCount.textContent =
        total;


    if (passed) {

        resultIcon.textContent =
            "🎉";

        resultTitle.textContent =
            "Chapter Passed";

        resultMessage.textContent =
            "Excellent! You scored at least 75%. This chapter is now completed and the next chapter is unlocked.";

    } else {

        resultIcon.textContent =
            "📚";

        resultTitle.textContent =
            "Keep Practicing";

        resultMessage.textContent =
            "You need at least 75% to pass. Review the chapter and try the assessment again.";
    }


    resultCard.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================================
   SUBMIT ASSESSMENT
========================================================= */

submitBtn.addEventListener(
    "click",
    async () => {

        if (!questions.length) {
            return;
        }


        const answers = [];


        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const selected =
                document.querySelector(
                    `input[name="q${i}"]:checked`
                );

            if (!selected) {

                alert(
                    "Please answer all questions before submitting."
                );

                return;
            }

            answers.push(
                Number(
                    selected.value
                )
            );
        }


        let correct = 0;


        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            if (
                answers[i] ===
                questions[i][2]
            ) {

                correct++;
            }
        }


        const total =
            questions.length;


        const score =
            Math.round(
                (
                    correct /
                    total
                ) * 100
            );


        const passed =
            score >= 75;


        submitBtn.disabled =
            true;

        submitBtn.textContent =
            "Saving Result...";


        try {

            await saveResult(
                score,
                correct,
                total,
                passed
            );


            showResult(
                score,
                correct,
                total,
                passed
            );


            if (passed) {

                submitBtn.textContent =
                    "✓ Assessment Passed";

            } else {

                submitBtn.textContent =
                    "Assessment Submitted";
            }

        } catch (error) {

            console.error(
                "Assessment save error:",
                error
            );

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Submit Assessment";

            alert(
                "The result could not be saved. Please try again."
            );
        }
    }
);


/* =========================================================
   RETRY
========================================================= */

retryBtn.addEventListener(
    "click",
    () => {

        resultCard.hidden =
            true;

        submitBtn.disabled =
            false;

        submitBtn.textContent =
            "Submit Assessment";

        renderQuestions();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutBtn.addEventListener(
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
        }
    }
);


/* =========================================================
   SHOW ASSESSMENT ERROR
========================================================= */

function showAssessmentError(
    message
) {

    questionContainer.innerHTML =
        "";

    const box =
        document.createElement(
            "div"
        );

    box.className =
        "question";

    const heading =
        document.createElement(
            "h3"
        );

    heading.textContent =
        "Assessment cannot be opened";

    const text =
        document.createElement(
            "p"
        );

    text.textContent =
        message;

    box.appendChild(
        heading
    );

    box.appendChild(
        text
    );

    questionContainer.appendChild(
        box
    );

    submitBtn.disabled =
        true;
}


/* =========================================================
   INITIALIZE
========================================================= */

onAuthStateChanged(
    auth,
    async currentUser => {

        if (!currentUser) {

            window.location.href =
                "login.html";

            return;
        }


        user =
            currentUser;


        try {

            /* =================================================
               REQUIRE CHAPTER ID
            ================================================= */

            if (!chapterId) {

                throw new Error(
                    "No chapter was selected for this assessment."
                );
            }


            /* =================================================
               LOAD CURRICULUM
            ================================================= */

            curriculum =
                await loadCurriculum();


            /* =================================================
               FIND CHAPTER
            ================================================= */

            chapter =
                curriculum.chapters.find(
                    item =>
                        item.id ===
                        chapterId
                );


            if (!chapter) {

                throw new Error(
                    "The selected OS chapter does not exist."
                );
            }


            /* =================================================
               LOAD USER PROGRESS
            ================================================= */

            await loadProgress();


            /* =================================================
               CHECK CHAPTER UNLOCK
            ================================================= */

            const chapterIndex =
                curriculum.chapters.findIndex(
                    item =>
                        item.id ===
                        chapter.id
                );


            if (
                !isChapterUnlocked(
                    chapterIndex
                )
            ) {

                showAssessmentError(
                    "This chapter is locked. Complete the previous chapter assessment first."
                );

                return;
            }


            /* =================================================
               CHECK ALL TOPICS
            ================================================= */

            if (
                !areAllTopicsCompleted(
                    chapter
                )
            ) {

                showAssessmentError(
                    "Complete all topics in this chapter before taking the assessment."
                );

                return;
            }


            /* =================================================
               LOAD QUESTIONS
            ================================================= */

            questions =
                questionBanks[
                    chapter.id
                ] || [];


            if (
                questions.length === 0
            ) {

                throw new Error(
                    `No assessment questions are configured for "${chapter.title}".`
                );
            }


            /* =================================================
               HEADER
            ================================================= */

            title.textContent =
                `Chapter ${chapter.number}: ${chapter.title}`;

            description.textContent =
                `Assessment for ${chapter.title}. Passing score: 75%.`;


            /* =================================================
               RENDER
            ================================================= */

            resultCard.hidden =
                true;

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "Submit Assessment";

            renderQuestions();

        } catch (error) {

            console.error(
                "OS assessment error:",
                error
            );

            showAssessmentError(
                error.message
            );
        }
    }
);