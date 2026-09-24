import {
    auth,
    db
} from "../firebase/firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const params =
    new URLSearchParams(
        window.location.search
    );


const subjectId =
    params.get("subject") || "";


const chapterId =
    params.get("chapter") || "";


const configs = {

    dbms: {
        curriculum:
            "../data/dbms-curriculum.json",
        progressKey:
            "dbmsProgress",
        title:
            "DBMS"
    },

    os: {
        curriculum:
            "../data/os-curriculum.json",
        progressKey:
            "osProgress",
        title:
            "Operating Systems"
    },

    cn: {
        curriculumCandidates: [
            "../data/cn-curriculum.json",
            "../data/computer-networks-curriculum.json"
        ],
        progressKey:
            "cnProgress",
        title:
            "Computer Networks"
    },

    oop: {
        curriculumCandidates: [
            "../data/oop-curriculum.json",
            "../data/oops-curriculum.json"
        ],
        progressKey:
            "oopProgress",
        title:
            "OOP"
    }

};


const config =
    configs[
        subjectId
    ];


let currentUser = null;

let chapter = null;

let questions = [];


/* =========================================================
   DOM
========================================================= */

const testTitle =
    document.getElementById(
        "testTitle"
    );

const testDescription =
    document.getElementById(
        "testDescription"
    );

const questionsContainer =
    document.getElementById(
        "questionsContainer"
    );

const submitTestBtn =
    document.getElementById(
        "submitTestBtn"
    );

const resultCard =
    document.getElementById(
        "resultCard"
    );

const resultIcon =
    document.getElementById(
        "resultIcon"
    );

const resultTitle =
    document.getElementById(
        "resultTitle"
    );

const resultScore =
    document.getElementById(
        "resultScore"
    );

const resultMessage =
    document.getElementById(
        "resultMessage"
    );

const continueButton =
    document.getElementById(
        "continueButton"
    );


/* =========================================================
   LOAD JSON
========================================================= */

async function loadJSON() {

    const files =
        config.curriculumCandidates ||
        [config.curriculum];


    for (
        const file of files
    ) {

        try {

            const response =
                await fetch(
                    file,
                    {
                        cache: "no-store"
                    }
                );


            if (
                !response.ok
            ) {
                continue;
            }


            return await response.json();

        } catch {
        }
    }


    throw new Error(
        "Curriculum could not be loaded."
    );
}


/* =========================================================
   BUILD SOURCE-BASED TEST
========================================================= */

function buildQuestions(
    targetChapter
) {

    const topics =
        targetChapter.topics ||
        [];


    /*
     * Prefer one question from each
     * of the first five topics.
     *
     * Every question is directly based
     * on the existing topic material.
     */
    const selected =
        topics.slice(
            0,
            Math.min(
                5,
                topics.length
            )
        );


    return selected.map(
        (
            topic,
            index
        ) => {

            const correctPoint =
                (
                    topic.keyPoints &&
                    topic.keyPoints.length
                )
                    ? topic.keyPoints[0]
                    : topic.learn;


            const distractors =
                selected
                    .filter(
                        (
                            other,
                            otherIndex
                        ) =>
                            otherIndex !==
                                index
                    )
                    .slice(
                        0,
                        3
                    )
                    .map(
                        other =>
                            other.keyPoints?.[0] ||
                            other.title
                    );


            const options = [
                correctPoint,
                ...distractors
            ];


            return {

                id:
                    `question-${index + 1}`,

                text:
                    `Which statement belongs to the topic "${topic.title}"?`,

                options,

                answer:
                    0,

                explanation:
                    correctPoint

            };

        }
    );
}


/* =========================================================
   RENDER
========================================================= */

function renderQuestions() {

    questionsContainer.innerHTML =
        questions.map(
            (
                question,
                index
            ) => `

                <article
                    class="question-card">

                    <h3>
                        ${index + 1}.
                        ${escapeHtml(
                            question.text
                        )}
                    </h3>

                    ${
                        question.options
                            .map(
                                (
                                    option,
                                    optionIndex
                                ) => `

                                    <label
                                        class="option">

                                        <input
                                            type="radio"
                                            name="${escapeHtml(
                                                question.id
                                            )}"
                                            value="${optionIndex}">

                                        <span>
                                            ${escapeHtml(
                                                option
                                            )}
                                        </span>

                                    </label>

                                `
                            )
                            .join("")
                    }

                </article>

            `
        )
        .join("");
}


/* =========================================================
   SAVE RESULT
========================================================= */

async function saveResult(
    score,
    passed
) {

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


    const data =
        snapshot.exists()
            ? snapshot.data()
            : {};


    const oldProgress =
        data[
            config.progressKey
        ] || {};


    const newProgress = {

        ...oldProgress,

        completedTopics:
            oldProgress.completedTopics ||
            {},

        completedChapters:
            oldProgress.completedChapters ||
            {},

        assessments:
            oldProgress.assessments ||
            {}

    };


    newProgress.assessments[
        chapter.id
    ] = {

        score,

        passed,

        total:
            questions.length,

        completedAt:
            new Date().toISOString()

    };


    if (
        passed
    ) {

        newProgress.completedChapters[
            chapter.id
        ] = true;
    }


    await setDoc(
        userRef,
        {
            [config.progressKey]:
                newProgress
        },
        {
            merge: true
        }
    );
}


/* =========================================================
   SUBMIT
========================================================= */

submitTestBtn.addEventListener(
    "click",
    async () => {

        let correct = 0;

        let unanswered = 0;


        questions.forEach(
            question => {

                const selected =
                    document.querySelector(
                        `input[name="${question.id}"]:checked`
                    );


                if (
                    !selected
                ) {

                    unanswered++;

                    return;
                }


                if (
                    Number(
                        selected.value
                    ) ===
                    question.answer
                ) {

                    correct++;
                }
            }
        );


        if (
            unanswered > 0
        ) {

            alert(
                `Please answer all questions. ${unanswered} question(s) are unanswered.`
            );

            return;
        }


        const score =
            Math.round(
                (
                    correct /
                    questions.length
                ) * 100
            );


        const passed =
            score >= 75;


        submitTestBtn.disabled =
            true;


        try {

            await saveResult(
                score,
                passed
            );


            resultCard.classList.remove(
                "hidden"
            );


            resultScore.textContent =
                `${score}%`;


            if (
                passed
            ) {

                resultIcon.textContent =
                    "✓";


                resultTitle.textContent =
                    "Chapter Passed";


                resultMessage.textContent =
                    "You passed this chapter test. The next chapter is now unlocked.";


                continueButton.textContent =
                    "Continue to Next Chapter";

            } else {

                resultIcon.textContent =
                    "↻";


                resultTitle.textContent =
                    "Test Not Passed";


                resultMessage.textContent =
                    "You need at least 75% to unlock the next chapter. Review the study material and try again.";


                continueButton.textContent =
                    "Return to Chapter";
            }


            continueButton.onclick =
                () => {

                    window.location.href =
                        `technical-core.html?subject=${encodeURIComponent(
                            subjectId
                        )}`;
                };


        } catch (
            error
        ) {

            console.error(
                error
            );


            submitTestBtn.disabled =
                false;


            alert(
                "The test result could not be saved."
            );
        }
    }
);


/* =========================================================
   ESCAPE
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
   AUTH + INIT
========================================================= */

onAuthStateChanged(
    auth,
    async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        if (!config) {

            window.location.href =
                "technical.html";

            return;
        }


        currentUser =
            user;


        try {

            const curriculum =
                await loadJSON();


            chapter =
                curriculum.chapters
                    .find(
                        item =>
                            item.id ===
                            chapterId
                    );


            if (!chapter) {

                throw new Error(
                    "Chapter could not be found."
                );
            }


            questions =
                buildQuestions(
                    chapter
                );


            testTitle.textContent =
                `Chapter ${chapter.number}: ${chapter.title}`;


            testDescription.textContent =
                `Complete the chapter test to unlock the next chapter. Passing score: 75%.`;


            renderQuestions();

        } catch (
            error
        ) {

            console.error(
                error
            );


            testTitle.textContent =
                "Test could not load";


            testDescription.textContent =
                error.message;
        }
    }
);