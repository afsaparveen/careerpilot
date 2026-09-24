import { auth, db } from "../firebase/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const PASS_PERCENTAGE = 75;
const PASS_SCORE = 27;

const ASSESSMENT_KEY = "finalAssessment";

const QUESTIONS = [

  {
    question:
      "Which protocol ensures reliable communication?",

    options: [
      "UDP",
      "IP",
      "TCP",
      "FTP"
    ],

    answer: 2
  },


  {
    question:
      "Which protocol is used to transfer files over a network?",

    options: [
      "HTTP",
      "FTP",
      "DHCP",
      "SNMP"
    ],

    answer: 1
  },


  {
    question:
      "Which network is used within a single room or device range?",

    options: [
      "PAN",
      "LAN",
      "MAN",
      "WAN"
    ],

    answer: 0
  },


  {
    question:
      "Campus-wide network is an example of:",

    options: [
      "WAN",
      "MAN",
      "CAN",
      "PAN"
    ],

    answer: 2
  },


  {
    question:
      "Which architecture offers centralized control and better security?",

    options: [
      "Peer-to-peer",
      "Client-server"
    ],

    answer: 1
  },


  {
    question:
      "In peer-to-peer networks, devices are both:",

    options: [
      "Clients only",
      "Servers only",
      "Clients and Servers",
      "None of the above"
    ],

    answer: 2
  },


  {
    question:
      "Which topology connects all nodes to a central device?",

    options: [
      "Bus",
      "Ring",
      "Star",
      "Mesh"
    ],

    answer: 2
  },


  {
    question:
      "Which topology provides full redundancy?",

    options: [
      "Mesh",
      "Star",
      "Bus",
      "Ring"
    ],

    answer: 0
  },


  {
    question:
      "Which device works at the Data Link Layer (Layer 2)?",

    options: [
      "Router",
      "Switch",
      "Modem",
      "Repeater"
    ],

    answer: 1
  },


  {
    question:
      "What does a router do?",

    options: [
      "Broadcasts data",
      "Forwards packets between networks",
      "Encrypts data",
      "Stores web pages"
    ],

    answer: 1
  },


  {
    question:
      "Switches are better than hubs because they:",

    options: [
      "Use more power",
      "Flood all ports",
      "Forward data intelligently",
      "Are cheaper"
    ],

    answer: 2
  },


  {
    question:
      "Which device connects two different networks?",

    options: [
      "Switch",
      "Repeater",
      "Router",
      "Hub"
    ],

    answer: 2
  },


  {
    question:
      "Routers operate on which OSI layer?",

    options: [
      "Transport",
      "Network",
      "Session",
      "Data Link"
    ],

    answer: 1
  },


  {
    question:
      "What is the primary function of a firewall?",

    options: [
      "Speed up connection",
      "Filter network traffic",
      "Provide IP addresses",
      "Store files"
    ],

    answer: 1
  },


  {
    question:
      "Firewalls can block:",

    options: [
      "Outgoing only",
      "Incoming only",
      "Both incoming and outgoing",
      "None"
    ],

    answer: 2
  },


  {
    question:
      "The first step in a TCP 3-way handshake is:",

    options: [
      "SYN",
      "ACK",
      "SYN-ACK",
      "FIN"
    ],

    answer: 0
  },


  {
    question:
      "If the last ACK in handshake is lost, the sender:",

    options: [
      "Closes connection",
      "Retransmits SYN",
      "Retransmits ACK",
      "Waits or times out"
    ],

    answer: 3
  },


  {
    question:
      "Which delay is caused by the time to push data into the link?",

    options: [
      "Propagation",
      "Queuing",
      "Transmission",
      "Processing"
    ],

    answer: 2
  },


  {
    question:
      "Congestion mainly affects which type of delay?",

    options: [
      "Processing",
      "Propagation",
      "Queuing",
      "Transmission"
    ],

    answer: 2
  },


  {
    question:
      "IPv6 address size is:",

    options: [
      "32-bit",
      "64-bit",
      "128-bit",
      "256-bit"
    ],

    answer: 2
  },


  {
    question:
      "What is a benefit of using private IPs?",

    options: [
      "Global accessibility",
      "Cost saving",
      "Easy routing",
      "No need of NAT"
    ],

    answer: 1
  },


  {
    question:
      "Can a private IP access the Internet directly?",

    options: [
      "Yes",
      "No"
    ],

    answer: 1
  },


  {
    question:
      "What is the first thing that happens when we visit www.google.com?",

    options: [
      "TCP connection",
      "DNS resolution",
      "HTTP request",
      "IP assignment"
    ],

    answer: 1
  },


  {
    question:
      "Which is an example of one-to-many communication?",

    options: [
      "Unicast",
      "Multicast",
      "Anycast",
      "Broadcast"
    ],

    answer: 1
  },


  {
    question:
      "Which communication sends data to all nodes in the network?",

    options: [
      "Unicast",
      "Broadcast",
      "Multicast",
      "Anycast"
    ],

    answer: 1
  },


  {
    question:
      "A VPN provides:",

    options: [
      "Physical security",
      "Encrypted remote access",
      "Faster internet",
      "Static IP"
    ],

    answer: 1
  },


  {
    question:
      "Data at the Network layer is called:",

    options: [
      "Frame",
      "Segment",
      "Packet",
      "Bit"
    ],

    answer: 2
  },


  {
    question:
      "Subnetting is used to:",

    options: [
      "Combine IPs",
      "Allocate bandwidth",
      "Divide IP space efficiently",
      "Reduce security"
    ],

    answer: 2
  },


  {
    question:
      "DNS converts:",

    options: [
      "IP to MAC",
      "Domain to IP",
      "Port to MAC",
      "IP to Domain"
    ],

    answer: 1
  },


  {
    question:
      "Which DNS query type returns the full IP resolution to the client?",

    options: [
      "Recursive",
      "Iterative",
      "Redundant",
      "Cache-only"
    ],

    answer: 0
  },


  {
    question:
      "MAC address is unique to:",

    options: [
      "IP",
      "User",
      "Device",
      "Port"
    ],

    answer: 2
  },


  {
    question:
      "IP address is used for:",

    options: [
      "Local communication only",
      "Internet routing",
      "Encryption",
      "Hardware control"
    ],

    answer: 1
  },


  {
    question:
      "Flow control prevents:",

    options: [
      "Packet loss from congestion",
      "Address resolution",
      "Network discovery",
      "IP conflict"
    ],

    answer: 0
  },


  {
    question:
      "Which protocol provides no flow control or error correction?",

    options: [
      "TCP",
      "UDP",
      "FTP",
      "ICMP"
    ],

    answer: 1
  },


  {
    question:
      "Session layer is responsible for:",

    options: [
      "Logical addressing",
      "End-to-end delivery",
      "Dialog control",
      "Data encryption"
    ],

    answer: 2
  }

];


const loadingState =
  document.getElementById("loadingState");

const assessmentForm =
  document.getElementById("assessmentForm");

const progressBarContainer =
  document.getElementById("progressBarContainer");

const progressBar =
  document.getElementById("progressBar");

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

const retryBtn =
  document.getElementById("retryBtn");

const continueBtn =
  document.getElementById("continueBtn");


let currentUser = null;
let currentQuestions = [];



function shuffleArray(array) {

  const copy =
    [...array];


  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );


    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];

  }


  return copy;

}



function prepareQuestions() {

  /*
   * Shuffle question order for each attempt.
   *
   * Option order is preserved because
   * the source answer key is based on
   * the original option order.
   */

  currentQuestions =
    shuffleArray(QUESTIONS);

}



function updateProgress() {

  const answered =
    currentQuestions.filter(
      (_, index) => {

        return Boolean(
          document.querySelector(
            `input[name="question-${index}"]:checked`
          )
        );

      }
    ).length;


  const percentage =
    Math.round(
      (answered / currentQuestions.length) * 100
    );


  progressBar.style.width =
    `${percentage}%`;

}



function renderQuestions() {

  assessmentForm.innerHTML = "";


  currentQuestions.forEach(
    (item, index) => {

      const questionCard =
        document.createElement("div");


      questionCard.className =
        "question-card";


      questionCard.innerHTML = `

        <div class="question-number">
          Question ${index + 1} of ${currentQuestions.length}
        </div>


        <h3>
          ${item.question}
        </h3>


        <div class="options-group">

          ${item.options
            .map(
              (option, optionIndex) => `

                <label class="option-label">

                  <input
                    type="radio"
                    name="question-${index}"
                    value="${optionIndex}"
                  />

                  <span>
                    ${option}
                  </span>

                </label>

              `
            )
            .join("")}

        </div>

      `;


      assessmentForm.appendChild(
        questionCard
      );

    }
  );


  const submitWrapper =
    document.createElement("div");


  submitWrapper.className =
    "assessment-submit-wrapper";


  submitWrapper.innerHTML = `

    <button
      type="submit"
      class="btn btn-primary assessment-submit-btn"
    >
      Submit Final Assessment
    </button>

  `;


  assessmentForm.appendChild(
    submitWrapper
  );


  assessmentForm
    .querySelectorAll(
      "input[type='radio']"
    )
    .forEach(
      input => {

        input.addEventListener(
          "change",
          updateProgress
        );

      }
    );


  updateProgress();

}



function calculateScore() {

  let score = 0;


  currentQuestions.forEach(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      if (!selected) {
        return;
      }


      const selectedAnswer =
        Number(selected.value);


      if (
        selectedAnswer === question.answer
      ) {

        score++;

      }

    }
  );


  return score;
}



function calculatePercentage(score) {

  return Math.round(
    (score / currentQuestions.length) * 100
  );

}



function collectAnswers() {

  return currentQuestions.map(
    (question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );


      return {

        question:
          question.question,

        selectedAnswer:
          selected
            ? Number(selected.value)
            : null,

        correctAnswer:
          question.answer

      };

    }
  );

}



async function saveResult(
  score,
  percentage,
  passed
) {

  if (!currentUser) {
    return;
  }


  const userRef =
    doc(
      db,
      "users",
      currentUser.uid
    );


  const snapshot =
    await getDoc(userRef);


  const userData =
    snapshot.exists()
      ? snapshot.data()
      : {};


  const cnProgress =
    userData.cnProgress || {};


  const assessments =
    cnProgress.assessments || {};


  const previous =
    assessments[
      ASSESSMENT_KEY
    ] || {};


  const attemptCount =
    (previous.attemptCount || 0) + 1;


  assessments[
    ASSESSMENT_KEY
  ] = {

    score,

    total:
      currentQuestions.length,

    percentage,

    passed,

    attemptCount,

    lastAttemptAt:
      new Date(),

    answers:
      collectAnswers()

  };


  const updatedProgress = {

    ...cnProgress,

    assessments

  };


  await setDoc(

    userRef,

    {
      cnProgress:
        updatedProgress
    },

    {
      merge: true
    }

  );

}



function showResult(
  score,
  percentage,
  passed
) {

  assessmentForm.classList.add(
    "hidden"
  );


  progressBarContainer.classList.add(
    "hidden"
  );


  resultSection.classList.remove(
    "hidden"
  );


  scoreText.textContent =
    `Score: ${score}/${currentQuestions.length}`;


  percentageText.textContent =
    `Percentage: ${percentage}%`;


  if (passed) {

    resultIcon.textContent =
      "🏆";


    resultTitle.textContent =
      "Final Assessment Passed!";


    resultMessage.textContent =
      "Excellent! You passed the Computer Networks final assessment. Your complete CN learning journey is now recorded.";

  } else {

    resultIcon.textContent =
      "📘";


    resultTitle.textContent =
      "Final Assessment Not Passed";


    resultMessage.textContent =
      `You scored ${score}/${currentQuestions.length}. You need ${PASS_SCORE}/${currentQuestions.length} (${PASS_PERCENTAGE}%) to pass. Review the chapters and try again.`;

  }

}



async function handleSubmit(event) {

  event.preventDefault();


  const answered =
    currentQuestions.filter(
      (_, index) => {

        return Boolean(
          document.querySelector(
            `input[name="question-${index}"]:checked`
          )
        );

      }
    ).length;


  if (
    answered < currentQuestions.length
  ) {

    alert(
      `Please answer all ${currentQuestions.length} questions before submitting.`
    );

    return;

  }


  const score =
    calculateScore();


  const percentage =
    calculatePercentage(score);


  const passed =
    score >= PASS_SCORE;


  try {

    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Saving Result...";

    }


    await saveResult(
      score,
      percentage,
      passed
    );


    showResult(
      score,
      percentage,
      passed
    );


  } catch (error) {

    console.error(
      "Failed to save final assessment:",
      error
    );


    alert(
      "Your assessment result could not be saved. Please check your Firebase connection and try again."
    );


    const submitButton =
      assessmentForm.querySelector(
        ".assessment-submit-btn"
      );


    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Final Assessment";

    }

  }

}



function resetAssessment() {

  resultSection.classList.add(
    "hidden"
  );


  assessmentForm.classList.remove(
    "hidden"
  );


  progressBarContainer.classList.remove(
    "hidden"
  );


  prepareQuestions();

  renderQuestions();


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}



function continueToCompletion() {

  window.location.href =
    "cn-complete.html";

}



retryBtn.addEventListener(
  "click",
  resetAssessment
);


continueBtn.addEventListener(
  "click",
  continueToCompletion
);


assessmentForm.addEventListener(
  "submit",
  handleSubmit
);



onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );


      prepareQuestions();

      renderQuestions();


      loadingState.classList.add(
        "hidden"
      );


      progressBarContainer.classList.remove(
        "hidden"
      );


      assessmentForm.classList.remove(
        "hidden"
      );


    } catch (error) {

      console.error(
        "Failed to load final assessment:",
        error
      );


      loadingState.textContent =
        "Failed to load final assessment. Please refresh and try again.";

    }

  }
);