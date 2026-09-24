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


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let currentUser = null;

let curriculum = [];

let currentPatternIndex = 0;

let currentPattern = null;


let progress = {

    completedProblems: {},

    openedProblems: {},

    masteredPatterns: {},

    dailyProblemDates: {}

};


const DAILY_TARGET = 3;


// =====================================================
// TWO POINTERS
// =====================================================

const twoPointersProblems = [

    {
        id: "tp01",
        number: 1,
        title: "Valid Palindrome",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/valid-palindrome/",

        explanation:
            "Check whether a string is a palindrome after ignoring non-alphanumeric characters and case.",

        approach:
            "Use one pointer from the left and another from the right. Compare the characters and move both pointers toward the center.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp02",
        number: 2,
        title: "Two Sum II - Input Array Is Sorted",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",

        explanation:
            "Find two numbers in a sorted array whose sum equals the target.",

        approach:
            "Keep left at the beginning and right at the end. Move left when the sum is too small and right when the sum is too large.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp03",
        number: 3,
        title: "Merge Sorted Array",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/merge-sorted-array/",

        explanation:
            "Merge two sorted arrays into the first array.",

        approach:
            "Compare values from the end of both arrays and place the larger value at the end.",

        complexity:
            "O(m+n) time and O(1) extra space."
    },


    {
        id: "tp04",
        number: 4,
        title: "Remove Duplicates from Sorted Array",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",

        explanation:
            "Remove duplicate values from a sorted array in-place.",

        approach:
            "Use a slow pointer for the next unique position and a fast pointer to scan the array.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp05",
        number: 5,
        title: "Move Zeroes",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/move-zeroes/",

        explanation:
            "Move all zeroes to the end of the array while maintaining the order of non-zero values.",

        approach:
            "Use a pointer to place every non-zero value in the next available position.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp06",
        number: 6,
        title: "3Sum",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/3sum/",

        explanation:
            "Find all unique triplets whose sum is zero.",

        approach:
            "Sort the array, fix one element and use two pointers for the remaining two values.",

        complexity:
            "O(n²) time."
    },


    {
        id: "tp07",
        number: 7,
        title: "Container With Most Water",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/container-with-most-water/",

        explanation:
            "Find two lines that can contain the maximum amount of water.",

        approach:
            "Start with pointers at both ends. Move the pointer with the smaller height.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp08",
        number: 8,
        title: "Sort Colors",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/sort-colors/",

        explanation:
            "Sort an array containing only 0, 1 and 2.",

        approach:
            "Use three pointers: low, mid and high.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp09",
        number: 9,
        title: "Squares of a Sorted Array",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/squares-of-a-sorted-array/",

        explanation:
            "Return the squares of the values in non-decreasing order.",

        approach:
            "Compare the absolute values at both ends and place the larger square at the end.",

        complexity:
            "O(n) time."
    },


    {
        id: "tp10",
        number: 10,
        title: "Boats to Save People",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/boats-to-save-people/",

        explanation:
            "Find the minimum number of boats required to carry all people.",

        approach:
            "Sort the weights and try to pair the lightest person with the heaviest person.",

        complexity:
            "O(n log n) time."
    },


    {
        id: "tp11",
        number: 11,
        title: "Backspace String Compare",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/backspace-string-compare/",

        explanation:
            "Compare two strings after processing backspace characters.",

        approach:
            "Traverse from right to left and skip characters that are removed by backspaces.",

        complexity:
            "O(n+m) time and O(1) extra space."
    },


    {
        id: "tp12",
        number: 12,
        title: "Partition Labels",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/partition-labels/",

        explanation:
            "Partition a string so that each character appears in only one partition.",

        approach:
            "Track the last occurrence of each character and extend the current partition until all characters are complete.",

        complexity:
            "O(n) time."
    },


    {
        id: "tp13",
        number: 13,
        title: "Trapping Rain Water",
        difficulty: "Hard",

        url:
            "https://leetcode.com/problems/trapping-rain-water/",

        explanation:
            "Calculate the amount of rainwater that can be trapped between elevation bars.",

        approach:
            "Use left and right pointers with leftMax and rightMax.",

        complexity:
            "O(n) time and O(1) extra space."
    },


    {
        id: "tp14",
        number: 14,
        title: "4Sum",
        difficulty: "Hard",

        url:
            "https://leetcode.com/problems/4sum/",

        explanation:
            "Find all unique quadruplets whose sum equals the target.",

        approach:
            "Sort the array, fix two elements and use two pointers for the remaining two elements.",

        complexity:
            "O(n³) time."
    },


    {
        id: "tp15",
        number: 15,
        title: "3Sum Closest",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/3sum-closest/",

        explanation:
            "Find three numbers whose sum is closest to the target.",

        approach:
            "Sort the array, fix one element and use two pointers while tracking the closest sum.",

        complexity:
            "O(n²) time."
    }

];


// =====================================================
// SLIDING WINDOW
// =====================================================

const slidingWindowProblems = [

    {
        id: "sw01",
        number: 1,
        title: "Maximum Average Subarray I",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/maximum-average-subarray-i/",

        explanation:
            "Find the contiguous subarray of length k with the maximum average.",

        approach:
            "Maintain a fixed-size sliding window.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw02",
        number: 2,
        title: "Contains Duplicate II",
        difficulty: "Beginner",

        url:
            "https://leetcode.com/problems/contains-duplicate-ii/",

        explanation:
            "Check whether duplicate values occur within distance k.",

        approach:
            "Maintain the current window while scanning the array.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw03",
        number: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/longest-substring-without-repeating-characters/",

        explanation:
            "Find the longest substring without repeated characters.",

        approach:
            "Expand the right pointer and move the left pointer when a duplicate appears.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw04",
        number: 4,
        title: "Longest Repeating Character Replacement",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/longest-repeating-character-replacement/",

        explanation:
            "Find the longest substring that can become one repeated character using at most k replacements.",

        approach:
            "Maintain character frequency and shrink the window when replacements exceed k.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw05",
        number: 5,
        title: "Permutation in String",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/permutation-in-string/",

        explanation:
            "Check whether a permutation of one string occurs in another.",

        approach:
            "Use a fixed-size window and character frequencies.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw06",
        number: 6,
        title: "Find All Anagrams in a String",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/find-all-anagrams-in-a-string/",

        explanation:
            "Find all starting indexes of anagrams of a pattern.",

        approach:
            "Maintain a window with the same size as the pattern.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw07",
        number: 7,
        title: "Minimum Size Subarray Sum",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/minimum-size-subarray-sum/",

        explanation:
            "Find the smallest contiguous subarray whose sum is at least the target.",

        approach:
            "Expand the right side and shrink from the left whenever the target is reached.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw08",
        number: 8,
        title: "Minimum Window Substring",
        difficulty: "Hard",

        url:
            "https://leetcode.com/problems/minimum-window-substring/",

        explanation:
            "Find the smallest substring containing all characters of another string.",

        approach:
            "Expand until the window is valid, then shrink from the left.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw09",
        number: 9,
        title: "Max Consecutive Ones III",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/max-consecutive-ones-iii/",

        explanation:
            "Find the longest subarray containing at most k zeroes.",

        approach:
            "Use a sliding window and count zeroes.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw10",
        number: 10,
        title: "Fruit Into Baskets",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/fruit-into-baskets/",

        explanation:
            "Find the longest subarray containing at most two different values.",

        approach:
            "Expand the window and shrink it when there are more than two types.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw11",
        number: 11,
        title: "Subarray Product Less Than K",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/subarray-product-less-than-k/",

        explanation:
            "Count contiguous subarrays whose product is less than k.",

        approach:
            "Multiply the right value and shrink from the left when the product becomes too large.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw12",
        number: 12,
        title: "Sliding Window Maximum",
        difficulty: "Hard",

        url:
            "https://leetcode.com/problems/sliding-window-maximum/",

        explanation:
            "Find the maximum value in every window of size k.",

        approach:
            "Use a decreasing deque of indexes.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw13",
        number: 13,
        title: "Longest Subarray of 1's After Deleting One Element",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/",

        explanation:
            "Find the longest sequence of ones after deleting one element.",

        approach:
            "Maintain a window containing at most one zero.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw14",
        number: 14,
        title: "Binary Subarrays With Sum",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/binary-subarrays-with-sum/",

        explanation:
            "Count binary subarrays whose sum equals the goal.",

        approach:
            "Use prefix sums or at-most sliding-window counting.",

        complexity:
            "O(n) time."
    },


    {
        id: "sw15",
        number: 15,
        title: "Count Number of Nice Subarrays",
        difficulty: "Medium",

        url:
            "https://leetcode.com/problems/count-number-of-nice-subarrays/",

        explanation:
            "Count subarrays containing exactly k odd numbers.",

        approach:
            "Calculate subarrays with at most k odd numbers and subtract those with at most k-1.",

        complexity:
            "O(n) time."
    }

];


// =====================================================
// CURRICULUM
// =====================================================

function buildCurriculum() {

    return [

        {
            id: "two-pointers",

            name: "Two Pointers",

            what:
                "Two Pointers uses two indexes to process arrays or strings efficiently.",

            recognize:
                "Look for sorted arrays, pair problems, opposite-end comparisons and problems involving two positions.",

            how:
                "Start with left and right pointers and move them according to the condition.",

            problems:
                twoPointersProblems
        },


        {
            id: "sliding-window",

            name: "Sliding Window",

            what:
                "Sliding Window maintains a continuous range of elements while processing a problem efficiently.",

            recognize:
                "Look for longest substring, shortest substring, maximum sum, minimum sum and contiguous subarray problems.",

            how:
                "Expand the right side and shrink the left side whenever the window becomes invalid.",

            problems:
                slidingWindowProblems
        }

    ];

}


// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "./login.html";

            return;
        }


        currentUser = user;

        await initializeDSA();

    }
);


// =====================================================
// INITIALIZE
// =====================================================

async function initializeDSA() {

    curriculum =
        buildCurriculum();

    await loadProgress();

    selectCurrentPattern();

    renderAll();

    renderUserInitials();

    setupLogout();

}


// =====================================================
// LOAD FIRESTORE
// =====================================================
async function loadProgress() {

    try {

        const reference = doc(
            db,
            "users",
            currentUser.uid
        );

        const snapshot = await getDoc(reference);

        if (snapshot.exists()) {

            const data = snapshot.data();

            const dsaData =
                data.dsaProgress || {};

            progress = {

                completedProblems:
                    dsaData.completedProblems || {},

                openedProblems:
                    dsaData.openedProblems || {},

                masteredPatterns:
                    dsaData.masteredPatterns || {},

                dailyProblemDates:
                    dsaData.dailyProblemDates || {}

            };

        }

    } catch (error) {

        console.error(
            "Error loading DSA progress:",
            error
        );

    }

}

// =====================================================
// SAVE FIRESTORE
// =====================================================

async function saveProgress() {

    const reference = doc(
        db,
        "users",
        currentUser.uid
    );

    await setDoc(
        reference,
        {

            dsaProgress: {

                completedProblems:
                    progress.completedProblems,

                openedProblems:
                    progress.openedProblems,

                masteredPatterns:
                    progress.masteredPatterns,

                dailyProblemDates:
                    progress.dailyProblemDates,

                updatedAt:
                    serverTimestamp()

            }

        },
        {
            merge: true
        }
    );

}

// =====================================================
// SELECT PATTERN
// =====================================================

function selectCurrentPattern() {

    currentPatternIndex = 0;


    for (
        let i = 0;
        i < curriculum.length;
        i++
    ) {

        if (
            !isPatternCompleted(
                curriculum[i]
            )
        ) {

            currentPatternIndex = i;

            break;
        }


        currentPatternIndex = i;

    }


    currentPattern =
        curriculum[
            currentPatternIndex
        ];

}


// =====================================================
// PROBLEM COMPLETED?
// =====================================================

function isProblemCompleted(
    id
) {

    return (
        progress.completedProblems[id]
        === true
    );

}


// =====================================================
// PATTERN COMPLETED?
// =====================================================

function isPatternCompleted(
    pattern
) {

    for (
        let i = 0;
        i < pattern.problems.length;
        i++
    ) {

        if (
            !isProblemCompleted(
                pattern.problems[i].id
            )
        ) {

            return false;
        }

    }


    return true;

}


// =====================================================
// RENDER ALL
// =====================================================

function renderAll() {

    renderProgress();

    renderLesson();

    renderDailyTarget();

    renderProblems();

    renderNextPattern();

}


// =====================================================
// RENDER PROGRESS
// =====================================================

function renderProgress() {

    const total =
        currentPattern.problems.length;


    let completed = 0;


    for (
        let i = 0;
        i < total;
        i++
    ) {

        if (
            isProblemCompleted(
                currentPattern.problems[i].id
            )
        ) {

            completed++;

        }

    }


    const percentage =
        Math.round(
            completed / total * 100
        );


    document.getElementById(
        "currentPatternName"
    ).textContent =
        currentPattern.name;


    document.getElementById(
        "progressPercent"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "progressCount"
    ).textContent =
        `${completed} / ${total} problems`;


    document.getElementById(
        "stageProgress"
    ).textContent =
        `${completed} / ${total}`;


    document.getElementById(
        "patternProgressBar"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "patternStatus"
    ).textContent =
        completed === total
            ? "Completed"
            : "In Progress";


    document.getElementById(
        "progressMessage"
    ).textContent =
        completed === total
            ? "🎉 Pattern completed!"
            : `${total - completed} problems remaining.`;

}


// =====================================================
// LESSON
// =====================================================

function renderLesson() {

    document.getElementById(
        "lessonWhat"
    ).textContent =
        currentPattern.what;


    document.getElementById(
        "lessonRecognize"
    ).textContent =
        currentPattern.recognize;


    document.getElementById(
        "lessonHow"
    ).textContent =
        currentPattern.how;

}


// =====================================================
// DAILY TARGET
// =====================================================

function renderDailyTarget() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    let count = 0;


    for (
        let i = 0;
        i < currentPattern.problems.length;
        i++
    ) {

        const id =
            currentPattern.problems[i].id;


        if (
            progress.dailyProblemDates[id]
            === today
        ) {

            count++;

        }

    }


    const percentage =
        Math.min(
            100,
            Math.round(
                count /
                DAILY_TARGET *
                100
            )
        );


    document.getElementById(
        "dailyCompletedCount"
    ).textContent =
        `${Math.min(count, DAILY_TARGET)} / ${DAILY_TARGET}`;


    document.getElementById(
        "dailyTargetProgress"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "dailyTargetMessage"
    ).textContent =
        count >= DAILY_TARGET
            ? "🎉 Today's target completed!"
            : `${DAILY_TARGET - count} more problem(s) to complete today's target.`;

}


// =====================================================
// RENDER EACH PROBLEM
// =====================================================

function renderProblems() {

    const container =
        document.getElementById(
            "problemList"
        );


    if (!container) {

        console.error(
            "problemList element not found"
        );

        return;
    }


    container.innerHTML = "";


    currentPattern.problems.forEach(
        (problem) => {

            const completed =
                isProblemCompleted(
                    problem.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                completed
                    ? "problem-card problem-completed"
                    : "problem-card";


            // ==========================================
            // HEADER
            // ==========================================

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "problem-card-header";


            header.innerHTML = `

                <div class="problem-card-left">

                    <span class="problem-number">
                        ${problem.number}
                    </span>


                    <div class="problem-title-wrap">

                        <h3>
                            ${escapeHtml(
                                problem.title
                            )}
                        </h3>


                        <div class="problem-meta">

                            <span
                                class="difficulty-badge ${getDifficultyClass(problem.difficulty)}"
                            >
                                ${problem.difficulty}
                            </span>


                            <span class="problem-box-status">
                                LeetCode Practice
                            </span>

                        </div>

                    </div>

                </div>


                <span class="problem-toggle-icon">
                    +
                </span>

            `;


            // ==========================================
            // BODY
            // ==========================================

            const body =
                document.createElement(
                    "div"
                );


            body.className =
                "problem-card-body";


            body.innerHTML = `

                <div class="problem-explanation">


                    <div class="problem-detail-block">

                        <h4>
                            What is the problem?
                        </h4>

                        <p>
                            ${escapeHtml(
                                problem.explanation
                            )}
                        </p>

                    </div>


                    <div class="problem-detail-block">

                        <h4>
                            Approach
                        </h4>

                        <p>
                            ${escapeHtml(
                                problem.approach
                            )}
                        </p>

                    </div>


                    <div class="problem-detail-block">

                        <h4>
                            Complexity
                        </h4>

                        <p>
                            ${escapeHtml(
                                problem.complexity
                            )}
                        </p>

                    </div>


                </div>


                <div class="problem-actions">


                    <a
                        class="problem-link"
                        href="${problem.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Practice on LeetCode →
                    </a>


                    <button
                        type="button"
                        class="solve-problem-btn"
                    >
                        ${
                            completed
                                ? "✓ Solved"
                                : "I Solved It"
                        }
                    </button>


                </div>


                ${
                    completed
                        ? `
                            <div class="problem-solved-today">
                                ✓ Problem completed
                            </div>
                        `
                        : ""
                }

            `;


            card.appendChild(header);

            card.appendChild(body);

            container.appendChild(card);


            // ==========================================
            // OPEN PROBLEM
            // ==========================================

            header.addEventListener(
                "click",
                () => {

                    const isOpen =
                        body.classList.contains(
                            "open"
                        );


                    if (isOpen) {

                        body.classList.remove(
                            "open"
                        );


                        header.querySelector(
                            ".problem-toggle-icon"
                        ).textContent =
                            "+";

                    } else {

                        body.classList.add(
                            "open"
                        );


                        header.querySelector(
                            ".problem-toggle-icon"
                        ).textContent =
                            "−";


                        progress.openedProblems[
                            problem.id
                        ] = true;


                        saveProgress()
                            .catch(
                                error => console.error(
                                    error
                                )
                            );

                    }

                }
            );


            // ==========================================
            // SOLVE BUTTON
            // ==========================================

            const solveButton =
                body.querySelector(
                    ".solve-problem-btn"
                );


            solveButton.addEventListener(
                "click",
                async (event) => {

                    event.stopPropagation();


                    if (
                        isProblemCompleted(
                            problem.id
                        )
                    ) {

                        return;
                    }


                    progress.completedProblems[
                        problem.id
                    ] = true;


                    const today =
                        new Date()
                            .toISOString()
                            .split("T")[0];


                    progress.dailyProblemDates[
                        problem.id
                    ] = today;


                    try {

                        await saveProgress();


                        if (
                            isPatternCompleted(
                                currentPattern
                            )
                        ) {

                            progress.masteredPatterns[
                                currentPattern.id
                            ] = true;


                            await saveProgress();


                            if (
                                currentPatternIndex <
                                curriculum.length - 1
                            ) {

                                const completedPattern =
                                    currentPattern.name;


                                currentPatternIndex++;


                                currentPattern =
                                    curriculum[
                                        currentPatternIndex
                                    ];


                                renderAll();


                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });


                                alert(
                                    `🎉 ${completedPattern} completed!\n\nNext pattern unlocked: ${currentPattern.name}`
                                );

                            } else {

                                renderAll();


                                alert(
                                    "🎉 Congratulations! You completed all patterns!"
                                );

                            }

                        } else {

                            renderAll();

                        }

                    } catch (error) {

                        console.error(
                            "Save error:",
                            error
                        );


                        delete progress.completedProblems[
                            problem.id
                        ];


                        delete progress.dailyProblemDates[
                            problem.id
                        ];


                        renderAll();


                        alert(
                            "Could not save your progress."
                        );

                    }

                }
            );

        }
    );

}


// =====================================================
// NEXT PATTERN
// =====================================================

function renderNextPattern() {

    const next =
        curriculum[
            currentPatternIndex + 1
        ];


    const button =
        document.getElementById(
            "nextPatternButton"
        );


    if (!next) {

        document.getElementById(
            "nextPatternName"
        ).textContent =
            "All Patterns Completed 🎉";


        document.getElementById(
            "nextPatternDescription"
        ).textContent =
            "You completed the DSA curriculum.";


        button.disabled = true;

        button.textContent =
            "Completed";

        return;
    }


    const completed =
        isPatternCompleted(
            currentPattern
        );


    document.getElementById(
        "nextPatternName"
    ).textContent =
        next.name;


    document.getElementById(
        "nextPatternDescription"
    ).textContent =
        completed
            ? `${next.name} is unlocked.`
            : `Complete all ${currentPattern.problems.length} problems to unlock ${next.name}.`;


    button.disabled =
        !completed;


    button.textContent =
        completed
            ? `Start ${next.name} →`
            : "Locked";


    button.onclick =
        () => {

            if (!completed) {
                return;
            }


            currentPatternIndex++;


            currentPattern =
                curriculum[
                    currentPatternIndex
                ];


            renderAll();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

}


// =====================================================
// USER INITIALS
// =====================================================

function renderUserInitials() {

    const element =
        document.getElementById(
            "userInitials"
        );


    if (!element || !currentUser) {
        return;
    }


    const name =
        currentUser.displayName ||
        currentUser.email ||
        "User";


    const parts =
        name.trim().split(/\s+/);


    if (parts.length >= 2) {

        element.textContent =
            (
                parts[0][0] +
                parts[parts.length - 1][0]
            ).toUpperCase();

    } else {

        element.textContent =
            name
                .substring(0, 2)
                .toUpperCase();

    }

}


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const button =
        document.getElementById(
            "logoutBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
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

}


// =====================================================
// DIFFICULTY
// =====================================================

function getDifficultyClass(
    difficulty
) {

    if (difficulty === "Beginner") {
        return "beginner";
    }

    if (difficulty === "Medium") {
        return "medium";
    }

    if (difficulty === "Hard") {
        return "hard";
    }

    return "";

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}