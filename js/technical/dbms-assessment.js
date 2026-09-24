const STORAGE_KEY =
    "dbmsProgress";


const PASS_MARK = 75;


/* =========================
   QUESTION BANK
========================= */

const questionBank = {


    "dbms-introduction": [

        {
            q: "What is a DBMS?",
            options: [
                "Software used to manage databases",
                "An operating system",
                "A web browser",
                "A compiler"
            ],
            answer: 0
        },

        {
            q: "Which problem can a DBMS help reduce?",
            options: [
                "Data redundancy",
                "Screen brightness",
                "Keyboard size",
                "Internet speed"
            ],
            answer: 0
        },

        {
            q: "Which ACID property means all-or-nothing execution?",
            options: [
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability"
            ],
            answer: 0
        },

        {
            q: "Which ACID property maintains database rules?",
            options: [
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability"
            ],
            answer: 1
        },

        {
            q: "Which ACID property limits interference between transactions?",
            options: [
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability"
            ],
            answer: 2
        },

        {
            q: "Which ACID property preserves committed changes after failure?",
            options: [
                "Atomicity",
                "Consistency",
                "Isolation",
                "Durability"
            ],
            answer: 3
        },

        {
            q: "Why are indexes useful?",
            options: [
                "They improve lookup performance",
                "They delete tables",
                "They replace databases",
                "They create passwords"
            ],
            answer: 0
        },

        {
            q: "What does scalability refer to?",
            options: [
                "Ability to handle increasing workload",
                "Deleting data",
                "Changing usernames",
                "Removing indexes"
            ],
            answer: 0
        }

    ],


    "dbms-architecture": [

        {
            q: "In one-tier architecture, where does the application and database run?",
            options: [
                "Same machine",
                "Only cloud",
                "Three different machines",
                "No machine"
            ],
            answer: 0
        },

        {
            q: "In two-tier architecture, the client communicates directly with the:",
            options: [
                "Database server",
                "Printer",
                "Browser",
                "Operating system"
            ],
            answer: 0
        },

        {
            q: "In three-tier architecture, what sits between client and database?",
            options: [
                "Application server",
                "Keyboard",
                "Router only",
                "Compiler"
            ],
            answer: 0
        },

        {
            q: "What does CAP stand for?",
            options: [
                "Consistency, Availability, Partition Tolerance",
                "Control, Access, Processing",
                "Create, Alter, Primary",
                "Column, Attribute, Permission"
            ],
            answer: 0
        }

    ],


    "data-abstraction": [

        {
            q: "Which is the lowest level of data abstraction?",
            options: [
                "Physical level",
                "Logical level",
                "View level",
                "Application level"
            ],
            answer: 0
        },

        {
            q: "Which level describes tables and relationships?",
            options: [
                "Physical",
                "Logical",
                "View",
                "Hardware"
            ],
            answer: 1
        },

        {
            q: "Which level provides customized user views?",
            options: [
                "Physical",
                "Logical",
                "View",
                "Storage"
            ],
            answer: 2
        },

        {
            q: "Physical data independence allows changes to:",
            options: [
                "Physical storage",
                "User passwords",
                "Application names",
                "SQL keywords"
            ],
            answer: 0
        }

    ],


    "data-models": [

        {
            q: "Which model organizes data using tables?",
            options: [
                "Relational",
                "Hierarchical",
                "Network",
                "Object-only"
            ],
            answer: 0
        },

        {
            q: "Which model uses a tree structure?",
            options: [
                "Hierarchical",
                "Relational",
                "Graph",
                "Object-oriented"
            ],
            answer: 0
        },

        {
            q: "Which model represents entities and relationships conceptually?",
            options: [
                "ER model",
                "Binary model",
                "File model",
                "CPU model"
            ],
            answer: 0
        }

    ],


    "er-model": [

        {
            q: "What does an entity represent?",
            options: [
                "A real-world object",
                "A SQL command",
                "A database server",
                "An index"
            ],
            answer: 0
        },

        {
            q: "What describes properties of an entity?",
            options: [
                "Attribute",
                "Transaction",
                "Index",
                "Schedule"
            ],
            answer: 0
        },

        {
            q: "Which shape represents an entity set in a traditional ER diagram?",
            options: [
                "Rectangle",
                "Ellipse",
                "Diamond",
                "Circle"
            ],
            answer: 0
        },

        {
            q: "Which relationship represents many entities related to many entities?",
            options: [
                "M:N",
                "1:1",
                "1:N",
                "0:1"
            ],
            answer: 0
        }

    ],


    "relational-model": [

        {
            q: "In a relational table, a row is called:",
            options: [
                "Tuple",
                "Attribute",
                "Domain",
                "Schema"
            ],
            answer: 0
        },

        {
            q: "In a relational table, a column is called:",
            options: [
                "Attribute",
                "Tuple",
                "Instance",
                "Record set"
            ],
            answer: 0
        },

        {
            q: "What describes the structure of a relation?",
            options: [
                "Schema",
                "Instance",
                "Tuple",
                "Value"
            ],
            answer: 0
        }

    ],


    "types-of-keys": [

        {
            q: "What is a candidate key?",
            options: [
                "A minimal super key",
                "Any column",
                "A foreign table",
                "A duplicate key"
            ],
            answer: 0
        },

        {
            q: "Which key is selected as the official row identifier?",
            options: [
                "Primary key",
                "Foreign key",
                "Alternate key",
                "Secondary key"
            ],
            answer: 0
        },

        {
            q: "A key containing multiple columns is called:",
            options: [
                "Composite key",
                "Foreign key",
                "Alternate key",
                "Simple key"
            ],
            answer: 0
        },

        {
            q: "Which key links related tables?",
            options: [
                "Foreign key",
                "Candidate key",
                "Alternate key",
                "Super key"
            ],
            answer: 0
        }

    ],


    "normalisation": [

        {
            q: "What is the main purpose of normalization?",
            options: [
                "Reduce redundancy and anomalies",
                "Increase duplication",
                "Delete all tables",
                "Remove primary keys"
            ],
            answer: 0
        },

        {
            q: "1NF requires:",
            options: [
                "Atomic values",
                "Duplicate rows",
                "No tables",
                "Multiple values in one cell"
            ],
            answer: 0
        },

        {
            q: "2NF removes:",
            options: [
                "Partial dependency",
                "All primary keys",
                "All foreign keys",
                "Tables"
            ],
            answer: 0
        },

        {
            q: "3NF removes:",
            options: [
                "Transitive dependency",
                "Primary keys",
                "Attributes",
                "All relationships"
            ],
            answer: 0
        },

        {
            q: "In BCNF, every determinant must be a:",
            options: [
                "Candidate key",
                "Foreign key",
                "Tuple",
                "Domain"
            ],
            answer: 0
        }

    ],


    "denormalization": [

        {
            q: "What does denormalization intentionally introduce?",
            options: [
                "Controlled redundancy",
                "More normalization",
                "More primary keys",
                "No data"
            ],
            answer: 0
        },

        {
            q: "Denormalization can improve:",
            options: [
                "Read performance",
                "Keyboard speed",
                "Network cables",
                "Screen resolution"
            ],
            answer: 0
        },

        {
            q: "A major disadvantage of denormalization is:",
            options: [
                "Update complexity",
                "No storage",
                "No tables",
                "No queries"
            ],
            answer: 0
        }

    ],


    "transactions-concurrency": [

        {
            q: "A transaction is:",
            options: [
                "A complete unit of database work",
                "A database table",
                "A column",
                "An index"
            ],
            answer: 0
        },

        {
            q: "Which isolation problem reads uncommitted data?",
            options: [
                "Dirty read",
                "Phantom read",
                "Deadlock",
                "Lost schema"
            ],
            answer: 0
        },

        {
            q: "Which isolation level provides the strongest protection among those described?",
            options: [
                "Serializable",
                "Read Uncommitted",
                "Read Committed",
                "Repeatable Read"
            ],
            answer: 0
        },

        {
            q: "What does 2PL stand for?",
            options: [
                "Two-Phase Locking",
                "Two-Process Logic",
                "Two-Primary Link",
                "Two-Page Layout"
            ],
            answer: 0
        }

    ],


    "sql-commands": [

        {
            q: "Which SQL family defines database structure?",
            options: [
                "DDL",
                "DML",
                "DCL",
                "TCL"
            ],
            answer: 0
        },

        {
            q: "Which command adds rows?",
            options: [
                "INSERT",
                "ALTER",
                "GRANT",
                "COMMIT"
            ],
            answer: 0
        },

        {
            q: "Which command gives privileges?",
            options: [
                "GRANT",
                "INSERT",
                "UPDATE",
                "ROLLBACK"
            ],
            answer: 0
        },

        {
            q: "Which clause groups rows?",
            options: [
                "GROUP BY",
                "ORDER BY",
                "WHERE",
                "LIMIT"
            ],
            answer: 0
        },

        {
            q: "Which clause filters groups after aggregation?",
            options: [
                "HAVING",
                "WHERE",
                "SELECT",
                "FROM"
            ],
            answer: 0
        }

    ],


    "indexing-optimization-sharding": [

        {
            q: "Why are indexes used?",
            options: [
                "Faster lookup",
                "Delete tables",
                "Remove rows",
                "Create users"
            ],
            answer: 0
        },

        {
            q: "Which tree structure has linked leaf nodes for range scans?",
            options: [
                "B+-tree",
                "Binary tree",
                "Decision tree",
                "Heap"
            ],
            answer: 0
        },

        {
            q: "Adding CPU and RAM to one machine is:",
            options: [
                "Vertical scaling",
                "Horizontal scaling",
                "Sharding",
                "Replication"
            ],
            answer: 0
        },

        {
            q: "Adding more machines is:",
            options: [
                "Horizontal scaling",
                "Vertical scaling",
                "Normalization",
                "Indexing"
            ],
            answer: 0
        },

        {
            q: "What is sharding?",
            options: [
                "Dividing data into smaller pieces",
                "Deleting data",
                "Creating passwords",
                "Removing indexes"
            ],
            answer: 0
        },

        {
            q: "RBAC means:",
            options: [
                "Role-Based Access Control",
                "Row-Based Attribute Control",
                "Read-Based Access Column",
                "Relation-Based Application Control"
            ],
            answer: 0
        }

    ],


    "sql-practice": [

        {
            q: "Which keyword removes duplicate results?",
            options: [
                "DISTINCT",
                "UNIQUEALL",
                "REMOVE",
                "DELETE"
            ],
            answer: 0
        },

        {
            q: "Which clause filters rows?",
            options: [
                "WHERE",
                "GROUP BY",
                "ORDER BY",
                "HAVING"
            ],
            answer: 0
        },

        {
            q: "Which operator is useful for pattern matching?",
            options: [
                "LIKE",
                "BETWEEN",
                "SUM",
                "COUNT"
            ],
            answer: 0
        },

        {
            q: "Which keyword sorts query results?",
            options: [
                "ORDER BY",
                "GROUP BY",
                "WHERE",
                "JOIN"
            ],
            answer: 0
        },

        {
            q: "Which function returns the highest value?",
            options: [
                "MAX",
                "MIN",
                "COUNT",
                "AVG"
            ],
            answer: 0
        },

        {
            q: "Which SQL operation combines related tables?",
            options: [
                "JOIN",
                "LIMIT",
                "DISTINCT",
                "SUBSTRING"
            ],
            answer: 0
        }

    ]

};


/* =========================
   GET CHAPTER
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const chapterId =
    params.get(
        "chapterId"
    );


const questions =
    questionBank[
        chapterId
    ] || [];


/* =========================
   LOAD CURRICULUM
========================= */

async function loadAssessment() {

    try {

        const response =
            await fetch(
                "../data/dbms-curriculum.json"
            );


        const data =
            await response.json();


        const chapter =
            data.subject.chapters.find(
                item =>
                    item.id ===
                    chapterId
            );


        if (!chapter) {

            throw new Error(
                "Chapter not found"
            );

        }


        document.getElementById(
            "assessmentTitle"
        ).textContent =
            `${chapter.title} - Test`;


        renderQuestions();


    } catch (error) {

        console.error(error);

        alert(
            "Could not load assessment."
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadAssessment
);


/* =========================
   RENDER QUESTIONS
========================= */

function renderQuestions() {

    const container =
        document.getElementById(
            "questionsContainer"
        );


    container.innerHTML = "";


    if (questions.length === 0) {

        container.innerHTML = `

            <div class="question-card">

                <h3>
                    Assessment questions are being prepared for this chapter.
                </h3>

            </div>

        `;

        return;

    }


    questions.forEach(
        (question, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";


            let options = "";


            question.options.forEach(
                (option, optionIndex) => {

                    options += `

                        <label class="option">

                            <input
                                type="radio"
                                name="q${index}"
                                value="${optionIndex}">

                            ${option}

                        </label>

                    `;

                }
            );


            card.innerHTML = `

                <h3>

                    ${index + 1}.
                    ${question.q}

                </h3>

                ${options}

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================
   SUBMIT
========================= */

document.getElementById(
    "submitBtn"
).addEventListener(
    "click",
    submitTest
);


function submitTest() {

    if (questions.length === 0) {

        alert(
            "Assessment questions are not available yet."
        );

        return;

    }


    let score = 0;


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
                `Please answer question ${i + 1}.`
            );

            return;

        }


        if (
            Number(
                selected.value
            ) ===
            questions[i].answer
        ) {

            score++;

        }

    }


    const percentage =
        Math.round(
            score /
            questions.length *
            100
        );


    const passed =
        percentage >= PASS_MARK;


    saveResult(
        percentage
    );


    showResult(
        score,
        percentage,
        passed
    );

}


/* =========================
   SAVE RESULT
========================= */

function saveResult(
    percentage
) {

    let progress;


    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (saved) {

        progress =
            JSON.parse(saved);

    } else {

        progress = {

            completedTopics: {},

            passedChapters: {},

            testScores: {}

        };

    }


    if (!progress.testScores) {

        progress.testScores = {};

    }


    if (!progress.passedChapters) {

        progress.passedChapters = {};

    }


    progress.testScores[
        chapterId
    ] = percentage;


    if (
        percentage >= PASS_MARK
    ) {

        progress.passedChapters[
            chapterId
        ] = true;

    } else {

        delete progress.passedChapters[
            chapterId
        ];

    }


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );

}


/* =========================
   RESULT
========================= */

function showResult(
    score,
    percentage,
    passed
) {

    const result =
        document.getElementById(
            "result"
        );


    result.className =
        passed
        ? "result pass"
        : "result fail";


    if (passed) {

        result.innerHTML = `

            🎉 TEST PASSED!

            <br><br>

            Score:
            ${score}/${questions.length}

            <br>

            Percentage:
            ${percentage}%

            <br><br>

            ✓ You passed with the required
            75%.

        `;


        document.getElementById(
            "backBtn"
        ).style.display =
            "block";


    } else {

        result.innerHTML = `

            ❌ TEST FAILED

            <br><br>

            Score:
            ${score}/${questions.length}

            <br>

            Percentage:
            ${percentage}%

            <br><br>

            Required:
            75%

            <br><br>

            You must retake the test.

        `;


        document.getElementById(
            "retryBtn"
        ).style.display =
            "block";

    }

}


/* =========================
   RETRY
========================= */

document.getElementById(
    "retryBtn"
).addEventListener(
    "click",
    () => {

        window.location.reload();

    }
);


/* =========================
   BACK
========================= */

document.getElementById(
    "backBtn"
).addEventListener(
    "click",
    () => {

        window.location.href =
            `dbms-chapter.html?chapterId=${encodeURIComponent(
                chapterId
            )}`;

    }
);