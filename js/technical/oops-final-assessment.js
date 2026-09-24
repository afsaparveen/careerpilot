import { auth, db } from "../firebase/firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =======================================================
   ASSESSMENT CONFIG
======================================================= */

const TOTAL_QUESTIONS = 45;

const PASS_PERCENTAGE = 75;

/*
  75% of 45 = 33.75
  Therefore minimum passing score = 34.
*/

const PASS_SCORE = 34;

const ASSESSMENT_KEY = "final";

const OOPS_COMPLETION_KEY = "oopsCompleted";


/* =======================================================
   QUESTIONS
   Source: OOPS Notes.pdf pages 30-33
======================================================= */

const QUESTIONS = [

  {
    question:
      "Which of the following is not a feature of OOP?",

    options: [
      "Encapsulation",
      "Polymorphism",
      "Compilation",
      "Inheritance"
    ],

    answer: 2
  },


  {
    question:
      "Which access modifier allows visibility within the same package only?",

    options: [
      "private",
      "protected",
      "public",
      "default"
    ],

    answer: 3
  },


  {
    question:
      "Which access specifier makes class members accessible to derived classes but not outside the class?",

    options: [
      "private",
      "protected",
      "public",
      "friend"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is true about 'protected' members?",

    options: [
      "Only accessible within the same class",
      "Accessible in same package and subclasses",
      "Accessible everywhere",
      "Accessible only in subclasses"
    ],

    answer: 1
  },


  {
    question:
      "Which statement is true about constructors in C++?",

    options: [
      "Constructor returns a value",
      "Constructor can be virtual",
      "Constructors can be overloaded",
      "Constructors cannot take parameters"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following is a correct way to overload constructors in Java?",

    options: [
      "By changing access specifiers",
      "By changing method name",
      "By changing return type",
      "By changing number/types of parameters"
    ],

    answer: 3
  },


  {
    question:
      "Which concept is violated if a constructor calls itself recursively without termination in C++/Java?",

    options: [
      "Encapsulation",
      "Abstraction",
      "Infinite recursion (stack overflow)",
      "Overloading"
    ],

    answer: 2
  },


  {
    question:
      "Which inheritance is not supported in Java but is in C++?",

    options: [
      "Single",
      "Multilevel",
      "Multiple",
      "Hierarchical"
    ],

    answer: 2
  },


  {
    question:
      "What keyword does Java use to resolve method conflicts in multiple inheritance via interfaces?",

    options: [
      "extends",
      "override",
      "implements",
      "super"
    ],

    answer: 3
  },


  {
    question:
      "In C++, what is the default visibility mode for class inheritance?",

    options: [
      "public",
      "private",
      "protected",
      "depends on access specifier"
    ],

    answer: 1
  },


  {
    question:
      "Which problem does virtual inheritance solve in C++?",

    options: [
      "Constructor overloading",
      "Diamond problem",
      "Ambiguous operator overloading",
      "Memory leak"
    ],

    answer: 1
  },


  {
    question:
      "Function overloading is resolved during which time?",

    options: [
      "Runtime",
      "Compile-time",
      "Execution",
      "Interpretation"
    ],

    answer: 1
  },


  {
    question:
      "Method overriding requires which condition in Java?",

    options: [
      "Different method names",
      "Same method signature in subclass",
      "Same return type only",
      "Final methods"
    ],

    answer: 1
  },


  {
    question:
      "Which method cannot be overridden in Java?",

    options: [
      "Static methods",
      "Abstract methods",
      "Public methods",
      "None"
    ],

    answer: 0
  },


  {
    question:
      "In C++, what happens if a virtual function is not overridden in a derived class?",

    options: [
      "Compile-time error",
      "Parent's version gets called",
      "Runtime error",
      "Object slicing occurs"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is true about abstract classes in Java?",

    options: [
      "Can be instantiated",
      "Must contain abstract methods",
      "Can contain constructors",
      "Cannot have variables"
    ],

    answer: 2
  },


  {
    question:
      "Which statement is false about interfaces in Java?",

    options: [
      "All methods are public and abstract by default",
      "Interfaces support multiple inheritance",
      "Can contain constructors",
      "Can contain static methods"
    ],

    answer: 2
  },


  {
    question:
      "In C++, what makes a class abstract?",

    options: [
      "A constructor",
      "A destructor",
      "At least one pure virtual function",
      "No methods at all"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following best represents encapsulation?",

    options: [
      "Hiding data behind methods",
      "Using inheritance",
      "Overriding methods",
      "Global variables"
    ],

    answer: 0
  },


  {
    question:
      "Which of the following cannot be achieved using abstraction?",

    options: [
      "Hiding internal logic",
      "Code modularity",
      "Tight coupling",
      "Implementation hiding"
    ],

    answer: 2
  },


  {
    question:
      "In Java, what happens if a subclass overrides a method and calls super.method() inside it?",

    options: [
      "Infinite recursion",
      "Calls parent class's method",
      "Compile-time error",
      "Method gets hidden"
    ],

    answer: 1
  },


  {
    question:
      "In C++, what happens if you delete a derived class object using a base class pointer without a virtual destructor?",

    options: [
      "Only base destructor called",
      "Both destructors called",
      "Segmentation fault",
      "Compile-time error"
    ],

    answer: 0
  },


  {
    question:
      "Which keyword is used in Java to prevent method overriding?",

    options: [
      "final",
      "static",
      "abstract",
      "protected"
    ],

    answer: 0
  },


  {
    question:
      "How much memory does a class occupy?",

    options: [
      "Memory equal to all its members",
      "Depends on number of member functions",
      "Zero until object is created",
      "Same as its parent class"
    ],

    answer: 2
  },


  {
    question:
      "Is it always necessary to create objects from a class?",

    options: [
      "Yes, for every class",
      "No, static members can be accessed without objects",
      "Only in C++, not in Java",
      "Only for abstract classes"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following is true about static methods in Java?",

    options: [
      "Can access instance variables",
      "Belong to the object",
      "Cannot be called from another static method",
      "Can be called without creating object"
    ],

    answer: 3
  },


  {
    question:
      "In C++, static members are shared across:",

    options: [
      "Only base class",
      "Only objects",
      "All objects of the class",
      "Inherited classes only"
    ],

    answer: 2
  },


  {
    question:
      "What is the size of an empty class in C++?",

    options: [
      "0",
      "1",
      "2",
      "Depends on compiler"
    ],

    answer: 1
  },


  {
    question:
      "Which of the following can be overloaded but not overridden?",

    options: [
      "static methods",
      "virtual functions",
      "constructors",
      "destructors"
    ],

    answer: 2
  },


  {
    question:
      "In Java, memory for objects is allocated using:",

    options: [
      "malloc",
      "new",
      "calloc",
      "constructor"
    ],

    answer: 1
  },


  {
    question:
      "Which C++ operator is used to deallocate memory?",

    options: [
      "free",
      "malloc",
      "delete",
      "clear"
    ],

    answer: 2
  },


  {
    question:
      "Java manages memory automatically using:",

    options: [
      "Smart pointers",
      "new/delete",
      "Garbage Collection",
      "Free ()"
    ],

    answer: 2
  },


  {
    question:
      "In Java, 'this' keyword refers to:",

    options: [
      "Parent object",
      "Static reference",
      "Current object",
      "Superclass"
    ],

    answer: 2
  },


  {
    question:
      "Which of the following can't be virtual in C++?",

    options: [
      "Constructor",
      "Member function",
      "Destructor",
      "Operator overload"
    ],

    answer: 0
  },


  {
    question:
      "Which of the following cannot be inherited in Java?",

    options: [
      "final class",
      "abstract class",
      "interface",
      "protected class"
    ],

    answer: 0
  },


  {
    question:
      `What will the following Java code output?

class Test {
  public static void main(String[] args) {
    Test t1 = new Test();
    Test t2 = t1;
    System.out.println(t1 == t2);
  }
}`,

    options: [
      "true",
      "false",
      "Compile error",
      "Runtime error"
    ],

    answer: 0
  },


  {
    question:
      "In C++, which constructor is invoked if no arguments are passed?",

    options: [
      "Copy constructor",
      "Parameterized constructor",
      "Default constructor",
      "None"
    ],

    answer: 2
  },


  {
    question:
      "In Java, what happens when we make an interface reference refer to a class object?",

    options: [
      "Only methods of interface are accessible",
      "All methods are accessible",
      "Throws error",
      "Calls constructor of interface"
    ],

    answer: 0
  },


  {
    question:
      "Can we create an object of abstract class in C++ using pointer?",

    options: [
      "Yes, always",
      "Yes, but only if not calling pure virtual methods",
      "No",
      "Yes, but can't instantiate it"
    ],

    answer: 2
  },


  {
    question:
      "Can an abstract class have a constructor in Java?",

    options: [
      "No",
      "Yes",
      "Only if all methods are abstract",
      "Only if it has no instance variables"
    ],

    answer: 1
  },


  {
    question:
      `What is the output of the following Java code?

class Parent {
  void show() {
    System.out.println("Parent");
  }
}

class Child extends Parent {
  void show() {
    System.out.println("Child");
  }
}

class Test {
  public static void main(String[] args) {
    Parent p = new Child();
    p.show();
  }
}`,

    options: [
      "Compile-time error",
      "Child",
      "Parent",
      "Runtime exception"
    ],

    answer: 1
  },


  {
    question:
      `What will the C++ code below print?

class Base {
public:
  virtual void show() {
    cout << "Base\\n";
  }
};

class Derived : public Base {
public:
  void show() {
    cout << "Derived\\n";
  }
};

int main() {
  Base obj;
  Derived d;
  obj = d;
  obj.show();
}`,

    options: [
      "Base",
      "Derived",
      "Compile error",
      "Undefined"
    ],

    answer: 0
  },


  {
    question:
      "Why use abstract class over interface in Java?",

    options: [
      "You need multiple inheritance",
      "You want to define method contracts only",
      "You want to share common code",
      "You want to use default methods"
    ],

    answer: 2
  },


  {
    question:
      "What is called automatically when an object goes out of scope in C++?",

    options: [
      "Destructor",
      "Garbage collector",
      "Free ()",
      "Finalize"
    ],

    answer: 0
  },


  {
    question:
      "Which of the following is true about finalize() in Java?",

    options: [
      "It must be manually called",
      "It is guaranteed to execute before object is garbage collected",
      "It is deprecated in Java 9+",
      "It is used in C++ for memory cleanup"
    ],

    answer: 2
  }

];


/* =======================================================
   STATE
======================================================= */

const state = {
  user: null,
  submitted: false,
  attemptCount: 0,
  previousResult: null
};


/* =======================================================
   DOM
======================================================= */

const loadingEl =
  document.getElementById("assessmentLoading");

const formEl =
  document.getElementById("assessmentForm");

const questionsContainer =
  document.getElementById("questionsContainer");

const resultSection =
  document.getElementById("resultSection");

const resultIcon =
  document.getElementById("resultIcon");

const resultTitle =
  document.getElementById("resultTitle");

const resultMessage =
  document.getElementById("resultMessage");

const scoreText =
  document.getElementById("scoreText");

const percentageText =
  document.getElementById("percentageText");

const resultDetails =
  document.getElementById("resultDetails");

const retryBtn =
  document.getElementById("retryBtn");

const continueBtn =
  document.getElementById("continueBtn");


/* =======================================================
   AUTH
======================================================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  state.user = user;

  const allowed =
    await loadProgress();

  if (!allowed) {
    return;
  }

  renderQuestions();

  loadingEl.classList.add("hidden");

  formEl.classList.remove("hidden");
});


/* =======================================================
   LOAD PROGRESS
======================================================= */

async function loadProgress() {

  const userRef =
    doc(db, "users", state.user.uid);

  try {

    const snapshot =
      await getDoc(userRef);

    if (!snapshot.exists()) {

      alert(
        "Your OOPs progress could not be found."
      );

      redirectToOops();

      return false;
    }


    const userData =
      snapshot.data();

    const oopsProgress =
      userData.oopsProgress || {};


    /*
      All 15 chapters must be completed
      before taking the final assessment.
    */

    const completedChapters =
      oopsProgress.completedChapters || {};


    const chapterIds = [

      "oops-introduction",

      "oops-classes-objects",

      "oops-access-friend",

      "oops-four-pillars",

      "oops-encapsulation",

      "oops-constructors",

      "oops-destructor",

      "oops-scope-this-copy",

      "oops-shallow-deep-copy",

      "oops-inheritance",

      "oops-diamond",

      "oops-polymorphism",

      "oops-abstraction",

      "oops-java-abstraction",

      "oops-static"

    ];


    const incompleteChapters =
      chapterIds.filter(
        (chapterId) =>
          completedChapters[chapterId] !== true
      );


    if (incompleteChapters.length > 0) {

      alert(
        "Please complete all 15 OOP chapters before attempting the final assessment."
      );

      redirectToOops();

      return false;
    }


    const assessment =
      oopsProgress.assessments?.[
        ASSESSMENT_KEY
      ];


    if (assessment) {

      state.attemptCount =
        assessment.attemptCount || 0;

      state.previousResult =
        assessment;
    }


    return true;

  } catch (error) {

    console.error(
      "Failed to load OOPs progress:",
      error
    );

    alert(
      "Unable to load your OOPs progress."
    );

    redirectToOops();

    return false;
  }
}


/* =======================================================
   RENDER QUESTIONS
======================================================= */

function renderQuestions() {

  questionsContainer.innerHTML = "";

  QUESTIONS.forEach(
    (question, index) => {

      const questionCard =
        document.createElement("div");

      questionCard.className =
        "question-card";


      questionCard.innerHTML = `

        <div class="question-header">

          <span class="question-number">
            Q${index + 1}
          </span>

          <h3>
            ${escapeHtml(
              question.question
            )}
          </h3>

        </div>


        <div class="options-list">

          ${question.options
            .map(
              (option, optionIndex) => {

                return `

                  <label class="option-item">

                    <input
                      type="radio"
                      name="question-${index}"
                      value="${optionIndex}"
                      required
                    />

                    <span class="option-letter">
                      ${String.fromCharCode(
                        65 + optionIndex
                      )}
                    </span>

                    <span class="option-text">
                      ${escapeHtml(option)}
                    </span>

                  </label>

                `;
              }
            )
            .join("")}

        </div>

      `;


      questionsContainer.appendChild(
        questionCard
      );
    }
  );
}


/* =======================================================
   SUBMIT
======================================================= */

formEl.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    if (state.submitted) {
      return;
    }


    const formData =
      new FormData(formEl);


    let score = 0;

    const answers = {};


    QUESTIONS.forEach(
      (question, index) => {

        const selected =
          formData.get(
            `question-${index}`
          );


        const selectedIndex =
          Number(selected);


        answers[index] =
          selectedIndex;


        if (
          selectedIndex ===
          question.answer
        ) {

          score++;
        }

      }
    );


    const percentage =
      Math.round(
        (score / TOTAL_QUESTIONS) * 100
      );


    const passed =
      score >= PASS_SCORE;


    state.submitted = true;


    await saveAssessment({

      score,

      percentage,

      passed,

      answers

    });


    showResult({

      score,

      percentage,

      passed

    });

  }
);


/* =======================================================
   SAVE ASSESSMENT
======================================================= */

async function saveAssessment({
  score,
  percentage,
  passed,
  answers
}) {

  const userRef =
    doc(
      db,
      "users",
      state.user.uid
    );


  try {

    const snapshot =
      await getDoc(userRef);


    const existingData =
      snapshot.exists()
        ? snapshot.data()
        : {};


    const currentProgress =
      existingData.oopsProgress || {};


    const currentAssessments =
      currentProgress.assessments || {};


    state.attemptCount += 1;


    const assessmentRecord = {

      score,

      totalQuestions:
        TOTAL_QUESTIONS,

      percentage,

      passed,

      attemptCount:
        state.attemptCount,

      lastAttemptAt:
        new Date().toISOString(),

      answers

    };


    const updatedProgress = {

      ...currentProgress,


      assessments: {

        ...currentAssessments,

        [ASSESSMENT_KEY]:
          assessmentRecord

      }

    };


    /*
      Only mark complete after passing.
    */

    if (passed) {

      updatedProgress[
        OOPS_COMPLETION_KEY
      ] = true;

    }


    await setDoc(

      userRef,

      {
        oopsProgress:
          updatedProgress
      },

      {
        merge: true
      }

    );

  } catch (error) {

    console.error(
      "Failed to save final OOPs assessment:",
      error
    );


    alert(
      "Your result could not be saved. Please try again."
    );
  }
}


/* =======================================================
   SHOW RESULT
======================================================= */

function showResult({
  score,
  percentage,
  passed
}) {

  formEl.classList.add(
    "hidden"
  );


  resultSection.classList.remove(
    "hidden"
  );


  scoreText.textContent =
    `${score} / ${TOTAL_QUESTIONS}`;


  percentageText.textContent =
    `${percentage}%`;


  if (passed) {

    resultIcon.textContent =
      "🏆";


    resultTitle.textContent =
      "OOPs Assessment Passed!";


    resultMessage.textContent =
      "Congratulations! You have successfully completed the complete OOPs learning path and final assessment.";


    resultDetails.innerHTML = `

      <div class="success-message">

        <strong>OOPs Completed 🎉</strong>

        <p>
          All 15 chapters and the final
          45-question assessment are completed.
        </p>

        <p>
          Your final result:
          <strong>
            ${score}/${TOTAL_QUESTIONS}
          </strong>
          (${percentage}%)
        </p>

      </div>

    `;


    continueBtn.textContent =
      "Continue to OOPs";


  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Final Assessment Not Passed";


    resultMessage.textContent =
      `You need at least ${PASS_SCORE}/${TOTAL_QUESTIONS} correct answers (${PASS_PERCENTAGE}%) to complete the OOPs assessment.`;


    resultDetails.innerHTML = `

      <div class="failure-message">

        <strong>Keep Practicing</strong>

        <p>
          Review the chapters where you
          need more confidence and retry
          the final assessment.
        </p>

        <p>
          Required:
          <strong>
            ${PASS_SCORE}/${TOTAL_QUESTIONS}
          </strong>
        </p>

      </div>

    `;


    continueBtn.textContent =
      "Back to OOPs";

  }
}


/* =======================================================
   RETRY
======================================================= */

retryBtn.addEventListener(
  "click",
  () => {

    state.submitted = false;


    resultSection.classList.add(
      "hidden"
    );


    formEl.classList.remove(
      "hidden"
    );


    renderQuestions();


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }
);


/* =======================================================
   CONTINUE
======================================================= */

continueBtn.addEventListener(
  "click",
  () => {

    redirectToOops();

  }
);


/* =======================================================
   REDIRECT
======================================================= */

function redirectToOops() {

  window.location.href =
    "oops.html";
}


/* =======================================================
   ESCAPE HTML
======================================================= */

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