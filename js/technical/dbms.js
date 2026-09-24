/* =========================================================
   CAREERPILOT AI
   DBMS LEARNING SYSTEM
   ========================================================= */

import { auth, db } from "../firebase/firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =========================================================
// GLOBAL STATE
// =========================================================

let currentUser = null;

let currentChapterIndex = 0;

let progress = {
    completedTopics: {},
    completedChapters: {},
    currentChapter: 0
};


// =========================================================
// DBMS CURRICULUM
// =========================================================

const dbmsChapters = [

    // =====================================================
    // CHAPTER 1
    // =====================================================

    {
        id: "dbms-basics",

        number: 1,

        title: "DBMS Basics",

        description:
            "Understand databases, DBMS, the need for database systems, advantages, disadvantages and basic database terminology.",

        topics: [

            {
                id: "what-is-database",

                title: "What is a Database?",

                description:
                    "A database is an organized collection of related data.",

                details:
                    "Examples include student records, employee information, bank accounts, products and customer information."
            },

            {
                id: "what-is-dbms",

                title: "What is DBMS?",

                description:
                    "A Database Management System is software used to create, store, organize, retrieve and manage data.",

                details:
                    "A DBMS provides an interface between users or applications and the database. Examples include MySQL, PostgreSQL, Oracle Database and Microsoft SQL Server."
            },

            {
                id: "need-for-dbms",

                title: "Why Do We Need DBMS?",

                description:
                    "DBMS helps organizations manage large amounts of data efficiently and securely.",

                details:
                    "Important benefits include organization, controlled access, reduced redundancy, consistency, backup, recovery and concurrent access."
            },

            {
                id: "dbms-vs-file-system",

                title: "DBMS vs File System",

                description:
                    "A file system stores information in separate files, while a DBMS provides structured database management.",

                details:
                    "DBMS provides mechanisms for security, concurrency, querying, integrity, backup and recovery."
            }

        ],

        quiz: [

            {
                question:
                    "What is the main purpose of a DBMS?",

                options: [
                    "To design computer hardware",
                    "To manage and organize data",
                    "To create operating systems",
                    "To compile Java programs"
                ],

                answer: 1
            },

            {
                question:
                    "Which of the following is an example of a DBMS?",

                options: [
                    "MySQL",
                    "HTML",
                    "CSS",
                    "Git"
                ],

                answer: 0
            },

            {
                question:
                    "Which is a benefit of using a DBMS?",

                options: [
                    "Data management",
                    "No data storage",
                    "No security",
                    "No querying"
                ],

                answer: 0
            },

            {
                question:
                    "A database is best described as:",

                options: [
                    "A programming language",
                    "An organized collection of data",
                    "A computer processor",
                    "A network cable"
                ],

                answer: 1
            },

            {
                question:
                    "Which system stores and manages structured data?",

                options: [
                    "DBMS",
                    "Keyboard",
                    "Monitor",
                    "Compiler"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 2
    // =====================================================

    {
        id: "dbms-architecture",

        number: 2,

        title: "DBMS Architecture",

        description:
            "Learn the three-schema architecture, levels of data abstraction and data independence.",

        topics: [

            {
                id: "three-schema",

                title: "Three-Schema Architecture",

                description:
                    "DBMS architecture separates the database into external, conceptual and internal levels.",

                details:
                    "The external level represents user views, the conceptual level represents the logical structure and the internal level describes physical storage."
            },

            {
                id: "external-level",

                title: "External Level",

                description:
                    "The external level describes how individual users or applications view the database.",

                details:
                    "Different users can have different views of the same underlying database."
            },

            {
                id: "conceptual-level",

                title: "Conceptual Level",

                description:
                    "The conceptual level describes the complete logical structure of the database.",

                details:
                    "It represents entities, relationships, attributes and constraints without focusing on physical storage."
            },

            {
                id: "internal-level",

                title: "Internal Level",

                description:
                    "The internal level describes how data is physically stored.",

                details:
                    "It deals with storage structures, files, indexes and physical implementation details."
            }

        ],

        quiz: [

            {
                question:
                    "Which level represents individual user views?",

                options: [
                    "External level",
                    "Conceptual level",
                    "Internal level",
                    "Physical device level"
                ],

                answer: 0
            },

            {
                question:
                    "Which level represents the complete logical structure?",

                options: [
                    "External",
                    "Conceptual",
                    "Internal",
                    "Hardware"
                ],

                answer: 1
            },

            {
                question:
                    "Which level deals with physical storage?",

                options: [
                    "External",
                    "Conceptual",
                    "Internal",
                    "User"
                ],

                answer: 2
            },

            {
                question:
                    "Three-schema architecture mainly separates:",

                options: [
                    "User views, logical structure and physical storage",
                    "HTML, CSS and JavaScript",
                    "CPU, RAM and keyboard",
                    "Java, Python and C"
                ],

                answer: 0
            },

            {
                question:
                    "Data independence is related to separating:",

                options: [
                    "Database levels",
                    "Computer monitors",
                    "Programming languages",
                    "Internet browsers"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 3
    // =====================================================

    {
        id: "data-models",

        number: 3,

        title: "Data Models",

        description:
            "Understand different ways of representing data and relationships in database systems.",

        topics: [

            {
                id: "hierarchical-model",

                title: "Hierarchical Model",

                description:
                    "The hierarchical model organizes data using a tree-like structure.",

                details:
                    "Data is represented using parent-child relationships."
            },

            {
                id: "network-model",

                title: "Network Model",

                description:
                    "The network model represents data using records connected through relationships.",

                details:
                    "It can represent more complex relationships than a simple tree structure."
            },

            {
                id: "relational-model",

                title: "Relational Model",

                description:
                    "The relational model represents data using tables consisting of rows and columns.",

                details:
                    "Tables are related using keys. SQL is widely used with relational databases."
            },

            {
                id: "object-oriented-model",

                title: "Object-Oriented Data Model",

                description:
                    "The object-oriented model represents data using objects and classes.",

                details:
                    "It can represent complex objects and concepts commonly found in object-oriented programming."
            }

        ],

        quiz: [

            {
                question:
                    "Which model represents data using tables?",

                options: [
                    "Hierarchical model",
                    "Relational model",
                    "Network model",
                    "Object model"
                ],

                answer: 1
            },

            {
                question:
                    "The hierarchical model mainly uses which structure?",

                options: [
                    "Tree",
                    "Graph only",
                    "Array only",
                    "Stack"
                ],

                answer: 0
            },

            {
                question:
                    "Rows in a relational table represent:",

                options: [
                    "Records",
                    "Databases",
                    "Servers",
                    "Programs"
                ],

                answer: 0
            },

            {
                question:
                    "Columns in a relational table represent:",

                options: [
                    "Attributes",
                    "Databases",
                    "Servers",
                    "Users only"
                ],

                answer: 0
            },

            {
                question:
                    "Which model uses objects and classes?",

                options: [
                    "Relational",
                    "Hierarchical",
                    "Object-oriented",
                    "Network"
                ],

                answer: 2
            }

        ]
    },


    // =====================================================
    // CHAPTER 4
    // =====================================================

    {
        id: "er-model",

        number: 4,

        title: "ER Model",

        description:
            "Learn entities, attributes, relationships and cardinality.",

        topics: [

            {
                id: "entity",

                title: "Entity",

                description:
                    "An entity is a distinguishable real-world object or concept about which data is stored.",

                details:
                    "Examples include Student, Employee, Customer, Product and Department."
            },

            {
                id: "attribute",

                title: "Attribute",

                description:
                    "An attribute describes a property of an entity.",

                details:
                    "For a Student entity, attributes could include student_id, name, age and department."
            },

            {
                id: "relationship",

                title: "Relationship",

                description:
                    "A relationship describes an association between entities.",

                details:
                    "For example, a Student ENROLLS in a Course."
            },

            {
                id: "cardinality",

                title: "Cardinality",

                description:
                    "Cardinality describes how many instances of one entity can be associated with another.",

                details:
                    "Common relationship types include one-to-one, one-to-many and many-to-many."
            }

        ],

        quiz: [

            {
                question:
                    "Which represents a real-world object in an ER model?",

                options: [
                    "Entity",
                    "Attribute",
                    "Query",
                    "Index"
                ],

                answer: 0
            },

            {
                question:
                    "Name and age of a student are examples of:",

                options: [
                    "Entities",
                    "Attributes",
                    "Relationships",
                    "Databases"
                ],

                answer: 1
            },

            {
                question:
                    "A relationship represents:",

                options: [
                    "An association between entities",
                    "A database server",
                    "A programming language",
                    "A file extension"
                ],

                answer: 0
            },

            {
                question:
                    "1:N represents:",

                options: [
                    "One-to-one",
                    "One-to-many",
                    "Many-to-many",
                    "Zero-to-zero"
                ],

                answer: 1
            },

            {
                question:
                    "Which is an example of an entity?",

                options: [
                    "Student",
                    "Student name",
                    "Student age",
                    "Student ID value"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 5
    // =====================================================

    {
        id: "relational-model",

        number: 5,

        title: "Relational Model",

        description:
            "Understand relations, tuples, attributes and domains.",

        topics: [

            {
                id: "relation",

                title: "Relation",

                description:
                    "In the relational model, a relation is represented as a table.",

                details:
                    "A relation consists of tuples and attributes."
            },

            {
                id: "tuple",

                title: "Tuple",

                description:
                    "A tuple represents a single record or row in a relation.",

                details:
                    "One complete student record can be represented as one tuple."
            },

            {
                id: "attribute-relational",

                title: "Attribute",

                description:
                    "An attribute represents a column of a relational table.",

                details:
                    "Examples include StudentID, Name, Age and Department."
            },

            {
                id: "domain",

                title: "Domain",

                description:
                    "A domain represents the set of valid values that an attribute can contain.",

                details:
                    "For example, an Age attribute may have a domain containing valid integer values within an allowed range."
            }

        ],

        quiz: [

            {
                question:
                    "A relation is represented as a:",

                options: [
                    "Table",
                    "Tree",
                    "Program",
                    "File only"
                ],

                answer: 0
            },

            {
                question:
                    "A tuple corresponds to a:",

                options: [
                    "Column",
                    "Row",
                    "Database",
                    "Server"
                ],

                answer: 1
            },

            {
                question:
                    "An attribute corresponds to a:",

                options: [
                    "Row",
                    "Column",
                    "Database",
                    "Server"
                ],

                answer: 1
            },

            {
                question:
                    "A domain defines:",

                options: [
                    "Valid values for an attribute",
                    "The database server",
                    "The number of databases",
                    "The operating system"
                ],

                answer: 0
            },

            {
                question:
                    "A relational database primarily stores data in:",

                options: [
                    "Tables",
                    "Images",
                    "Videos",
                    "Folders"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 6
    // =====================================================

    {
        id: "keys-constraints",

        number: 6,

        title: "Keys & Constraints",

        description:
            "Learn primary keys, foreign keys, candidate keys, super keys and constraints.",

        topics: [

            {
                id: "super-key",

                title: "Super Key",

                description:
                    "A super key is a set of one or more attributes that can uniquely identify a tuple.",

                details:
                    "A super key may contain additional attributes that are not necessary for uniqueness."
            },

            {
                id: "candidate-key",

                title: "Candidate Key",

                description:
                    "A candidate key is a minimal super key.",

                details:
                    "It uniquely identifies records and contains no unnecessary attributes."
            },

            {
                id: "primary-key",

                title: "Primary Key",

                description:
                    "A primary key is the candidate key selected to uniquely identify records.",

                details:
                    "A primary key uniquely identifies rows and cannot contain NULL values."
            },

            {
                id: "foreign-key",

                title: "Foreign Key",

                description:
                    "A foreign key references a key in another table.",

                details:
                    "Foreign keys are commonly used to establish relationships between tables and enforce referential integrity."
            }

        ],

        quiz: [

            {
                question:
                    "A minimal super key is called:",

                options: [
                    "Primary key",
                    "Candidate key",
                    "Foreign key",
                    "Composite table"
                ],

                answer: 1
            },

            {
                question:
                    "Which key uniquely identifies rows in a table?",

                options: [
                    "Primary key",
                    "Foreign key",
                    "Domain",
                    "View"
                ],

                answer: 0
            },

            {
                question:
                    "A foreign key is mainly used to:",

                options: [
                    "Create relationships between tables",
                    "Delete the database",
                    "Compile programs",
                    "Create operating systems"
                ],

                answer: 0
            },

            {
                question:
                    "A super key must:",

                options: [
                    "Uniquely identify a tuple",
                    "Always contain one attribute",
                    "Always be a foreign key",
                    "Always contain NULL"
                ],

                answer: 0
            },

            {
                question:
                    "Which key references another table?",

                options: [
                    "Primary key",
                    "Foreign key",
                    "Candidate key",
                    "Super key"
                ],

                answer: 1
            }

        ]
    },


    // =====================================================
    // CHAPTER 7
    // =====================================================

    {
        id: "sql",

        number: 7,

        title: "SQL",

        description:
            "Learn SQL fundamentals including SELECT, INSERT, UPDATE, DELETE and filtering.",

        topics: [

            {
                id: "select",

                title: "SELECT",

                description:
                    "SELECT is used to retrieve data from one or more tables.",

                details:
                    "Example: SELECT name FROM students; retrieves the name column from the students table."
            },

            {
                id: "insert",

                title: "INSERT",

                description:
                    "INSERT is used to add new rows to a table.",

                details:
                    "Example: INSERT INTO students(id, name) VALUES (1, 'Afsa');"
            },

            {
                id: "update",

                title: "UPDATE",

                description:
                    "UPDATE modifies existing records in a table.",

                details:
                    "An UPDATE statement normally uses a WHERE condition when only selected records should be changed."
            },

            {
                id: "delete",

                title: "DELETE",

                description:
                    "DELETE removes rows from a table.",

                details:
                    "A WHERE condition can be used to control which rows are deleted."
            }

        ],

        quiz: [

            {
                question:
                    "Which SQL command retrieves data?",

                options: [
                    "SELECT",
                    "INSERT",
                    "DELETE",
                    "UPDATE"
                ],

                answer: 0
            },

            {
                question:
                    "Which command adds new rows?",

                options: [
                    "SELECT",
                    "INSERT",
                    "UPDATE",
                    "DELETE"
                ],

                answer: 1
            },

            {
                question:
                    "Which command modifies existing records?",

                options: [
                    "UPDATE",
                    "SELECT",
                    "INSERT",
                    "CREATE"
                ],

                answer: 0
            },

            {
                question:
                    "Which command removes rows?",

                options: [
                    "DELETE",
                    "SELECT",
                    "INSERT",
                    "UPDATE"
                ],

                answer: 0
            },

            {
                question:
                    "Which clause is commonly used to filter rows?",

                options: [
                    "WHERE",
                    "TABLE",
                    "DATABASE",
                    "COLUMN"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 8
    // =====================================================

    {
        id: "normalization",

        number: 8,

        title: "Normalization",

        description:
            "Understand normalization, functional dependencies and normal forms.",

        topics: [

            {
                id: "why-normalization",

                title: "Why Normalization?",

                description:
                    "Normalization organizes relational data to reduce unnecessary redundancy and improve consistency.",

                details:
                    "It helps structure tables and can reduce insertion, update and deletion anomalies."
            },

            {
                id: "first-normal-form",

                title: "First Normal Form — 1NF",

                description:
                    "A relation in 1NF has atomic values and does not contain repeating groups in a single field.",

                details:
                    "Each cell should contain a single value rather than a collection of multiple values."
            },

            {
                id: "second-normal-form",

                title: "Second Normal Form — 2NF",

                description:
                    "A relation in 2NF is in 1NF and has no partial dependency of a non-key attribute on part of a composite candidate key.",

                details:
                    "2NF is especially relevant when a table has a composite key."
            },

            {
                id: "third-normal-form",

                title: "Third Normal Form — 3NF",

                description:
                    "A relation in 3NF is in 2NF and does not have problematic transitive dependency of non-key attributes on a key.",

                details:
                    "3NF further reduces dependency-related redundancy."
            }

        ],

        quiz: [

            {
                question:
                    "The main purpose of normalization is to:",

                options: [
                    "Reduce redundancy and anomalies",
                    "Increase duplicate data",
                    "Remove all tables",
                    "Create hardware"
                ],

                answer: 0
            },

            {
                question:
                    "1NF requires values to be:",

                options: [
                    "Atomic",
                    "Duplicated",
                    "Encrypted",
                    "Unsorted"
                ],

                answer: 0
            },

            {
                question:
                    "2NF deals with:",

                options: [
                    "Partial dependency",
                    "HTML structure",
                    "Network routing",
                    "CPU scheduling"
                ],

                answer: 0
            },

            {
                question:
                    "3NF addresses:",

                options: [
                    "Transitive dependency",
                    "Image compression",
                    "Memory allocation",
                    "Network packets"
                ],

                answer: 0
            },

            {
                question:
                    "Normalization is primarily related to:",

                options: [
                    "Database design",
                    "Computer graphics",
                    "Operating systems",
                    "Web styling"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 9
    // =====================================================

    {
        id: "transactions",

        number: 9,

        title: "Transactions",

        description:
            "Learn database transactions and ACID properties.",

        topics: [

            {
                id: "transaction",

                title: "Transaction",

                description:
                    "A transaction is a logical unit of database work consisting of one or more operations.",

                details:
                    "A transaction should move the database from one consistent state to another according to defined rules."
            },

            {
                id: "atomicity",

                title: "Atomicity",

                description:
                    "Atomicity means a transaction is treated as an all-or-nothing operation.",

                details:
                    "If part of a transaction fails, the transaction can be rolled back."
            },

            {
                id: "consistency",

                title: "Consistency",

                description:
                    "Consistency means a transaction should preserve database rules and constraints.",

                details:
                    "A successful transaction should leave the database in a valid state."
            },

            {
                id: "isolation-durability",

                title: "Isolation and Durability",

                description:
                    "Isolation controls transaction interaction, while durability concerns persistence of committed changes.",

                details:
                    "Together with atomicity and consistency, isolation and durability form the ACID properties."
            }

        ],

        quiz: [

            {
                question:
                    "A transaction is:",

                options: [
                    "A logical unit of database work",
                    "A programming language",
                    "A computer device",
                    "A network protocol"
                ],

                answer: 0
            },

            {
                question:
                    "Atomicity means:",

                options: [
                    "All-or-nothing execution",
                    "Only partial execution",
                    "No execution",
                    "Random execution"
                ],

                answer: 0
            },

            {
                question:
                    "Consistency means the database should:",

                options: [
                    "Remain valid according to its rules",
                    "Delete all data",
                    "Always contain duplicates",
                    "Ignore constraints"
                ],

                answer: 0
            },

            {
                question:
                    "Which ACID property concerns concurrent transaction interaction?",

                options: [
                    "Isolation",
                    "Atomicity",
                    "Consistency",
                    "Durability"
                ],

                answer: 0
            },

            {
                question:
                    "Which property concerns persistence of committed changes?",

                options: [
                    "Durability",
                    "Isolation",
                    "Atomicity",
                    "Consistency"
                ],

                answer: 0
            }

        ]
    },


    // =====================================================
    // CHAPTER 10
    // =====================================================

    {
        id: "indexing",

        number: 10,

        title: "Indexing",

        description:
            "Understand database indexes, their advantages and their trade-offs.",

        topics: [

            {
                id: "what-is-index",

                title: "What is an Index?",

                description:
                    "An index is a data structure maintained by a database system to help locate rows efficiently.",

                details:
                    "Indexes can reduce the amount of data that must be examined for suitable queries."
            },

            {
                id: "index-search",

                title: "Index and Searching",

                description:
                    "Indexes can make searching for records more efficient for suitable queries.",

                details:
                    "The database can use an index to locate relevant records rather than scanning every row."
            },

            {
                id: "index-advantages",

                title: "Advantages of Indexing",

                description:
                    "Indexes can improve the performance of certain read operations.",

                details:
                    "Indexes are particularly useful for frequently searched or filtered columns."
            },

            {
                id: "index-tradeoff",

                title: "Index Trade-offs",

                description:
                    "Indexes require storage and may add overhead to data modification operations.",

                details:
                    "INSERT, UPDATE and DELETE operations may need index maintenance."
            }

        ],

        quiz: [

            {
                question:
                    "The main purpose of an index is to:",

                options: [
                    "Help locate data efficiently",
                    "Delete a database",
                    "Replace a database",
                    "Create HTML pages"
                ],

                answer: 0
            },

            {
                question:
                    "Indexes are mainly useful for:",

                options: [
                    "Certain data retrieval operations",
                    "Changing the operating system",
                    "Creating images",
                    "Compiling Java"
                ],

                answer: 0
            },

            {
                question:
                    "Indexes require:",

                options: [
                    "Additional storage",
                    "No resources",
                    "No maintenance",
                    "No database"
                ],

                answer: 0
            },

            {
                question:
                    "Indexes can add overhead to:",

                options: [
                    "INSERT, UPDATE and DELETE",
                    "Only SELECT",
                    "Only login",
                    "Only HTML"
                ],

                answer: 0
            },

            {
                question:
                    "Should every possible column automatically have an index?",

                options: [
                    "Not necessarily",
                    "Always",
                    "Never use indexes",
                    "Only use indexes for images"
                ],

                answer: 0
            }

        ]
    }

];


// =========================================================
// DOM ELEMENTS
// =========================================================

const userInitials =
    document.getElementById("userInitials");

const logoutBtn =
    document.getElementById("logoutBtn");

const dbmsProgressText =
    document.getElementById("dbmsProgressText");

const dbmsProgressFill =
    document.getElementById("dbmsProgressFill");

const progressCircleText =
    document.getElementById("progressCircleText");

const progressMessage =
    document.getElementById("progressMessage");

const chapterCount =
    document.getElementById("chapterCount");

const chapterList =
    document.getElementById("chapterList");

const emptyLesson =
    document.getElementById("emptyLesson");

const lessonContainer =
    document.getElementById("lessonContainer");

const chapterNumber =
    document.getElementById("chapterNumber");

const chapterTitle =
    document.getElementById("chapterTitle");

const chapterDescription =
    document.getElementById("chapterDescription");

const chapterStatus =
    document.getElementById("chapterStatus");

const topicProgressText =
    document.getElementById("topicProgressText");

const topicList =
    document.getElementById("topicList");

const quizSection =
    document.getElementById("quizSection");

const quizForm =
    document.getElementById("quizForm");

const quizQuestions =
    document.getElementById("quizQuestions");

const quizResult =
    document.getElementById("quizResult");

const submitQuizBtn =
    document.getElementById("submitQuizBtn");

const nextChapterSection =
    document.getElementById("nextChapterSection");

const nextChapterTitle =
    document.getElementById("nextChapterTitle");

const nextChapterBtn =
    document.getElementById("nextChapterBtn");


// =========================================================
// AUTH STATE
// =========================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "./login.html";

            return;
        }


        currentUser = user;


        displayUser(user);


        await loadProgress();


        /*
           If saved current chapter is valid,
           open that chapter.
        */

        if (
            typeof progress.currentChapter ===
            "number"
        ) {

            if (
                progress.currentChapter >= 0 &&
                progress.currentChapter <
                dbmsChapters.length
            ) {

                if (
                    isChapterUnlocked(
                        progress.currentChapter
                    )
                ) {

                    currentChapterIndex =
                        progress.currentChapter;

                }

            }

        }


        renderEverything();

    }
);


// =========================================================
// DISPLAY USER
// =========================================================

function displayUser(user) {

    let name = "User";


    if (user.displayName) {

        name = user.displayName;

    } else if (user.email) {

        name =
            user.email.split("@")[0];

    }


    const parts =
        name.trim().split(/\s+/);


    let initials = "";


    if (parts.length >= 2) {

        initials =
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0);

    } else {

        initials =
            parts[0].substring(0, 2);

    }


    userInitials.textContent =
        initials.toUpperCase();

}


// =========================================================
// LOGOUT
// =========================================================

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "./login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);


// =========================================================
// LOAD FIREBASE PROGRESS
// =========================================================

async function loadProgress() {

    if (!currentUser) {
        return;
    }


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

            return;
        }


        const data =
            snapshot.data();


        if (!data.dbmsProgress) {

            return;
        }


        const savedProgress =
            data.dbmsProgress;


        progress = {

            completedTopics:
                savedProgress.completedTopics || {},

            completedChapters:
                savedProgress.completedChapters || {},

            currentChapter:
                typeof savedProgress.currentChapter ===
                "number"

                    ? savedProgress.currentChapter

                    : 0

        };


    } catch (error) {

        console.error(
            "Error loading DBMS progress:",
            error
        );

    }

}


// =========================================================
// SAVE FIREBASE PROGRESS
// =========================================================

async function saveProgress() {

    if (!currentUser) {
        return false;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        await setDoc(
            userRef,
            {

                dbmsProgress: {

                    completedTopics:
                        progress.completedTopics,

                    completedChapters:
                        progress.completedChapters,

                    currentChapter:
                        progress.currentChapter

                },

                updatedAt:
                    serverTimestamp()

            },
            {
                merge: true
            }
        );


        return true;


    } catch (error) {

        console.error(
            "Error saving DBMS progress:",
            error
        );


        alert(
            "Unable to save your DBMS progress. Please check your Firebase configuration and Firestore rules."
        );


        return false;

    }

}


// =========================================================
// CHAPTER UNLOCK
// =========================================================

function isChapterUnlocked(index) {

    /*
       Chapter 1 is always unlocked.
    */

    if (index === 0) {

        return true;

    }


    const previousChapter =
        dbmsChapters[index - 1];


    return Boolean(
        progress.completedChapters[
            previousChapter.id
        ]
    );

}


// =========================================================
// TOPIC COMPLETION
// =========================================================

function isTopicCompleted(topicId) {

    return Boolean(
        progress.completedTopics[
            topicId
        ]
    );

}


// =========================================================
// CHAPTER COMPLETION
// =========================================================

function isChapterCompleted(chapterId) {

    return Boolean(
        progress.completedChapters[
            chapterId
        ]
    );

}


// =========================================================
// COUNT COMPLETED TOPICS
// =========================================================

function getCompletedTopicCount(chapter) {

    let count = 0;


    for (
        let i = 0;
        i < chapter.topics.length;
        i++
    ) {

        const topic =
            chapter.topics[i];


        if (
            isTopicCompleted(
                topic.id
            )
        ) {

            count++;

        }

    }


    return count;

}


// =========================================================
// ALL TOPICS COMPLETE?
// =========================================================

function areAllTopicsCompleted(chapter) {

    return (
        getCompletedTopicCount(chapter) ===
        chapter.topics.length
    );

}


// =========================================================
// CALCULATE OVERALL PROGRESS
// =========================================================

function calculateOverallProgress() {

    let totalTopics = 0;

    let completedTopics = 0;

    let completedChapters = 0;


    for (
        let i = 0;
        i < dbmsChapters.length;
        i++
    ) {

        const chapter =
            dbmsChapters[i];


        totalTopics +=
            chapter.topics.length;


        completedTopics +=
            getCompletedTopicCount(
                chapter
            );


        if (
            isChapterCompleted(
                chapter.id
            )
        ) {

            completedChapters++;

        }

    }


    const totalActivities =
        totalTopics +
        dbmsChapters.length;


    const completedActivities =
        completedTopics +
        completedChapters;


    if (totalActivities === 0) {

        return 0;

    }


    return Math.round(
        (
            completedActivities /
            totalActivities
        ) * 100
    );

}


// =========================================================
// RENDER EVERYTHING
// =========================================================

function renderEverything() {

    renderOverallProgress();

    renderChapterList();

    renderChapter(
        currentChapterIndex
    );

}


// =========================================================
// RENDER OVERALL PROGRESS
// =========================================================

function renderOverallProgress() {

    const percentage =
        calculateOverallProgress();


    dbmsProgressText.textContent =
        `${percentage}%`;


    progressCircleText.textContent =
        `${percentage}%`;


    dbmsProgressFill.style.width =
        `${percentage}%`;


    let completedChapters = 0;


    for (
        let i = 0;
        i < dbmsChapters.length;
        i++
    ) {

        if (
            isChapterCompleted(
                dbmsChapters[i].id
            )
        ) {

            completedChapters++;

        }

    }


    chapterCount.textContent =
        `${completedChapters} / ${dbmsChapters.length}`;


    if (percentage === 0) {

        progressMessage.textContent =
            "Start Chapter 1 to begin your DBMS journey.";

    } else if (percentage < 30) {

        progressMessage.textContent =
            "Good start! Keep learning consistently.";

    } else if (percentage < 60) {

        progressMessage.textContent =
            "You're making progress. Keep going!";

    } else if (percentage < 100) {

        progressMessage.textContent =
            "Great work! You're getting closer to completing DBMS.";

    } else {

        progressMessage.textContent =
            "🎉 Congratulations! You completed the DBMS learning path.";

    }

}


// =========================================================
// RENDER CHAPTER LIST
// =========================================================

function renderChapterList() {

    chapterList.innerHTML = "";


    for (
        let index = 0;
        index < dbmsChapters.length;
        index++
    ) {

        const chapter =
            dbmsChapters[index];


        const unlocked =
            isChapterUnlocked(index);


        const completed =
            isChapterCompleted(
                chapter.id
            );


        const active =
            index === currentChapterIndex;


        const completedTopicCount =
            getCompletedTopicCount(
                chapter
            );


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "chapter-item";


        if (active) {

            button.classList.add(
                "active"
            );

        }


        if (completed) {

            button.classList.add(
                "completed"
            );

        }


        if (!unlocked) {

            button.classList.add(
                "locked"
            );

        }


        let statusIcon = "›";


        if (completed) {

            statusIcon = "✓";

        } else if (!unlocked) {

            statusIcon = "🔒";

        }


        button.innerHTML = `

            <div class="chapter-number">
                ${chapter.number}
            </div>

            <div class="chapter-info">

                <h3>
                    ${escapeHtml(
                        chapter.title
                    )}
                </h3>

                <span>
                    ${completedTopicCount}/${chapter.topics.length}
                    topics
                </span>

            </div>

            <div class="chapter-status-icon">
                ${statusIcon}
            </div>

        `;


        if (unlocked) {

            button.addEventListener(
                "click",
                () => {

                    currentChapterIndex =
                        index;


                    progress.currentChapter =
                        index;


                    renderEverything();


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }


        chapterList.appendChild(
            button
        );

    }

}


// =========================================================
// RENDER CURRENT CHAPTER
// =========================================================

function renderChapter(index) {

    const chapter =
        dbmsChapters[index];


    if (!chapter) {

        return;

    }


    emptyLesson.classList.add(
        "hidden"
    );


    lessonContainer.classList.remove(
        "hidden"
    );


    chapterNumber.textContent =
        `CHAPTER ${chapter.number}`;


    chapterTitle.textContent =
        chapter.title;


    chapterDescription.textContent =
        chapter.description;


    const completed =
        isChapterCompleted(
            chapter.id
        );


    if (completed) {

        chapterStatus.textContent =
            "✓ Completed";


        chapterStatus.className =
            "chapter-status completed";

    } else {

        chapterStatus.textContent =
            "Learning";


        chapterStatus.className =
            "chapter-status learning";

    }


    renderTopics(chapter);

    renderQuiz(chapter);

    renderNextChapter(chapter);

}


// =========================================================
// RENDER TOPICS
// =========================================================

function renderTopics(chapter) {

    topicList.innerHTML = "";


    const completedCount =
        getCompletedTopicCount(
            chapter
        );


    topicProgressText.textContent =
        `${completedCount} / ${chapter.topics.length} completed`;


    for (
        let index = 0;
        index < chapter.topics.length;
        index++
    ) {

        const topic =
            chapter.topics[index];


        const completed =
            isTopicCompleted(
                topic.id
            );


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "topic-card";


        if (completed) {

            card.classList.add(
                "completed"
            );

        }


        card.innerHTML = `

            <div class="topic-top">

                <div class="topic-number">

                    ${
                        completed
                            ? "✓"
                            : index + 1
                    }

                </div>

                <div class="topic-content">

                    <h3>
                        ${escapeHtml(
                            topic.title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            topic.description
                        )}
                    </p>

                </div>

            </div>


            <div class="topic-details">

                <strong>
                    Key Point:
                </strong>

                ${escapeHtml(
                    topic.details
                )}

            </div>


            <button
                type="button"
                class="topic-complete-btn ${
                    completed
                        ? "completed"
                        : ""
                }"
                data-topic-id="${escapeHtml(
                    topic.id
                )}"
                ${completed ? "disabled" : ""}
            >

                ${
                    completed
                        ? "✓ Completed"
                        : "Mark Topic Complete"
                }

            </button>

        `;


        topicList.appendChild(
            card
        );

    }


    const buttons =
        document.querySelectorAll(
            "[data-topic-id]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const topicId =
                        button.dataset.topicId;


                    await completeTopic(
                        topicId,
                        chapter
                    );

                }
            );

        }
    );

}


// =========================================================
// COMPLETE TOPIC
// =========================================================

async function completeTopic(
    topicId,
    chapter
) {

    if (
        isTopicCompleted(topicId)
    ) {

        return;

    }


    progress.completedTopics[
        topicId
    ] = true;


    const saved =
        await saveProgress();


    if (!saved) {

        /*
           If Firebase save failed,
           remove local completion.
        */

        delete progress.completedTopics[
            topicId
        ];


        return;

    }


    renderEverything();

}


// =========================================================
// RENDER QUIZ
// =========================================================

function renderQuiz(chapter) {

    quizQuestions.innerHTML = "";


    quizResult.classList.add(
        "hidden"
    );


    quizResult.classList.remove(
        "pass",
        "fail"
    );


    submitQuizBtn.disabled = false;


    submitQuizBtn.textContent =
        "Submit Quiz";


    /*
       If all topics are not complete,
       hide quiz.
    */

    if (
        !areAllTopicsCompleted(
            chapter
        )
    ) {

        quizSection.classList.add(
            "hidden"
        );


        return;

    }


    quizSection.classList.remove(
        "hidden"
    );


    for (
        let questionIndex = 0;
        questionIndex < chapter.quiz.length;
        questionIndex++
    ) {

        const question =
            chapter.quiz[
                questionIndex
            ];


        const questionDiv =
            document.createElement(
                "div"
            );


        questionDiv.className =
            "quiz-question";


        let optionsHTML = "";


        for (
            let optionIndex = 0;
            optionIndex < question.options.length;
            optionIndex++
        ) {

            const option =
                question.options[
                    optionIndex
                ];


            optionsHTML += `

                <label class="quiz-option">

                    <input
                        type="radio"
                        name="question-${questionIndex}"
                        value="${optionIndex}"
                    >

                    <span>
                        ${escapeHtml(option)}
                    </span>

                </label>

            `;

        }


        questionDiv.innerHTML = `

            <h3>
                ${questionIndex + 1}.
                ${escapeHtml(
                    question.question
                )}
            </h3>

            ${optionsHTML}

        `;


        quizQuestions.appendChild(
            questionDiv
        );

    }

}


// =========================================================
// SUBMIT QUIZ
// =========================================================

quizForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const chapter =
            dbmsChapters[
                currentChapterIndex
            ];


        if (!chapter) {

            return;

        }


        if (
            !areAllTopicsCompleted(
                chapter
            )
        ) {

            showQuizResult(
                "Complete all topics before attempting the quiz.",
                false
            );


            return;

        }


        let score = 0;

        let unanswered = 0;


        for (
            let index = 0;
            index < chapter.quiz.length;
            index++
        ) {

            const selected =
                document.querySelector(
                    `input[name="question-${index}"]:checked`
                );


            if (!selected) {

                unanswered++;

                continue;

            }


            const selectedAnswer =
                Number(
                    selected.value
                );


            if (
                selectedAnswer ===
                chapter.quiz[index].answer
            ) {

                score++;

            }

        }


        if (unanswered > 0) {

            showQuizResult(
                `Please answer all ${chapter.quiz.length} questions before submitting.`,
                false
            );


            return;

        }


        const total =
            chapter.quiz.length;


        const percentage =
            Math.round(
                (score / total) * 100
            );


        // =================================================
        // PASS
        // =================================================

        if (percentage >= 70) {

            progress.completedChapters[
                chapter.id
            ] = true;


            if (
                currentChapterIndex <
                dbmsChapters.length - 1
            ) {

                progress.currentChapter =
                    currentChapterIndex + 1;

            }


            const saved =
                await saveProgress();


            if (!saved) {

                delete progress.completedChapters[
                    chapter.id
                ];


                return;

            }


            submitQuizBtn.disabled =
                true;


            submitQuizBtn.textContent =
                "✓ Quiz Passed";


            showQuizResult(
                `🎉 Congratulations! You scored ${score}/${total} (${percentage}%). Chapter completed successfully!`,
                true
            );


            renderOverallProgress();

            renderChapterList();

            renderNextChapter(chapter);


            setTimeout(
                () => {

                    quizResult.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                },
                100
            );


        }


        // =================================================
        // FAIL
        // =================================================

        else {

            showQuizResult(
                `You scored ${score}/${total} (${percentage}%). You need at least 70% to pass. Review the topics and try again.`,
                false
            );

        }

    }
);


// =========================================================
// SHOW QUIZ RESULT
// =========================================================

function showQuizResult(
    message,
    passed
) {

    quizResult.textContent =
        message;


    quizResult.classList.remove(
        "hidden",
        "pass",
        "fail"
    );


    quizResult.classList.add(
        passed
            ? "pass"
            : "fail"
    );


    quizResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =========================================================
// RENDER NEXT CHAPTER
// =========================================================

function renderNextChapter(chapter) {

    nextChapterSection.classList.add(
        "hidden"
    );


    if (
        !isChapterCompleted(
            chapter.id
        )
    ) {

        return;

    }


    const nextIndex =
        currentChapterIndex + 1;


    // =====================================================
    // FINAL CHAPTER
    // =====================================================

    if (
        nextIndex >=
        dbmsChapters.length
    ) {

        nextChapterSection.classList.remove(
            "hidden"
        );


        nextChapterTitle.textContent =
            "DBMS Learning Path Completed 🎉";


        nextChapterBtn.textContent =
            "Back to Technical →";


        nextChapterBtn.onclick =
            () => {

                window.location.href =
                    "./technical.html";

            };


        return;

    }


    // =====================================================
    // NEXT CHAPTER
    // =====================================================

    const nextChapter =
        dbmsChapters[nextIndex];


    nextChapterSection.classList.remove(
        "hidden"
    );


    nextChapterTitle.textContent =
        `Chapter ${nextChapter.number}: ${nextChapter.title}`;


    nextChapterBtn.textContent =
        "Continue →";


    nextChapterBtn.onclick =
        async () => {

            currentChapterIndex =
                nextIndex;


            progress.currentChapter =
                nextIndex;


            await saveProgress();


            renderEverything();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    if (
        typeof value !==
        "string"
    ) {

        return "";

    }


    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}