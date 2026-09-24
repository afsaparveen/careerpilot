import { auth, db } from "../firebase/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const QUESTIONS = [

  {
    id: 1,
    topic: "protocols",
    title:
      "Can you name and briefly describe any five common network protocols and their purposes?"
  },

  {
    id: 2,
    topic: "protocols",
    title:
      "Which protocol ensures reliable communication between two endpoints on a network?"
  },

  {
    id: 3,
    topic: "networks",
    title:
      "What is the difference between LAN, MAN, and WAN? Give examples."
  },

  {
    id: 4,
    topic: "networks",
    title:
      "Where would you typically use a PAN or CAN?"
  },

  {
    id: 5,
    topic: "networks",
    title:
      "How does a client-server model differ from a peer-to-peer model?"
  },

  {
    id: 6,
    topic: "networks",
    title:
      "Which architecture is more scalable and why?"
  },

  {
    id: 7,
    topic: "topology",
    title:
      "What are the different types of network topologies and their advantages/disadvantages?"
  },

  {
    id: 8,
    topic: "topology",
    title:
      "Why is star topology more commonly used than bus topology in modern networks?"
  },

  {
    id: 9,
    topic: "devices",
    title:
      "What are the functions of the following devices: Hub, Switch, Router, Modem, Repeater?"
  },

  {
    id: 10,
    topic: "devices",
    title:
      "How is a switch different from a hub in handling network traffic?"
  },

  {
    id: 11,
    topic: "devices",
    title:
      "How does a router determine the best path to route a packet?"
  },

  {
    id: 12,
    topic: "devices",
    title:
      "What’s the difference between a router and a switch in terms of OSI layer and functionality?"
  },

  {
    id: 13,
    topic: "devices",
    title:
      "What is a firewall and how does it protect a network?"
  },

  {
    id: 14,
    topic: "devices",
    title:
      "Can a firewall block internal threats? Why or why not?"
  },

  {
    id: 15,
    topic: "tcp",
    title:
      "Explain the TCP 3-way handshake step by step."
  },

  {
    id: 16,
    topic: "tcp",
    title:
      "What happens if the final ACK is lost during the handshake?"
  },

  {
    id: 17,
    topic: "delays",
    title:
      "What are the four types of delays in a network? Explain each briefly."
  },

  {
    id: 18,
    topic: "delays",
    title:
      "Which delay is affected by congestion in the network?"
  },

  {
    id: 19,
    topic: "ip",
    title:
      "What are the main differences between IPv4 and IPv6?"
  },

  {
    id: 20,
    topic: "ip",
    title:
      "What is the purpose of private IP addresses?"
  },

  {
    id: 21,
    topic: "ip",
    title:
      "Can a device with a private IP access the internet directly? Why or why not?"
  },

  {
    id: 22,
    topic: "dns",
    title:
      "Describe step-by-step what happens when you hit enter after typing www.google.com in your browser."
  },

  {
    id: 23,
    topic: "communication",
    title:
      "What is the difference between unicast, multicast, broadcast, and anycast? Give real-life examples."
  },

  {
    id: 24,
    topic: "devices",
    title:
      "Why is a switch preferred over a hub in modern LANs?"
  },

  {
    id: 25,
    topic: "osi",
    title:
      "In what form is data represented at each layer of the OSI model (bits, frames, packets, etc.)?"
  },

  {
    id: 26,
    topic: "ip",
    title:
      "How does subnetting help in efficient IP address management?"
  },

  {
    id: 27,
    topic: "dns",
    title:
      "What is DNS and how does it resolve domain names to IP addresses?"
  },

  {
    id: 28,
    topic: "dns",
    title:
      "What is the difference between recursive and iterative DNS queries?"
  },

  {
    id: 29,
    topic: "ip",
    title:
      "Why does a device need both MAC and IP addresses?"
  },

  {
    id: 30,
    topic: "tcp",
    title:
      "What is flow control in networking? Name two protocols that provide flow control."
  },

  {
    id: 31,
    topic: "tcp",
    title:
      "What are two methods used for error detection and correction?"
  },

  {
    id: 32,
    topic: "tcp",
    title:
      "How does checksum differ from CRC in detecting errors?"
  },

  {
    id: 33,
    topic: "tcp",
    title:
      "Compare TCP and UDP in terms of reliability, speed, and use cases."
  },

  {
    id: 34,
    topic: "protocols",
    title:
      "Which protocol would you use for live video streaming and why?"
  },

  {
    id: 35,
    topic: "osi",
    title:
      "What are the responsibilities of the session layer in the OSI model?"
  },

  {
    id: 36,
    topic: "osi",
    title:
      "What functions does the presentation layer perform in data communication?"
  },

  {
    id: 37,
    topic: "osi",
    title:
      "Why do we need data encryption?"
  },

  {
    id: 38,
    topic: "delays",
    title:
      "Explain how propagation delay and transmission delay differ."
  },

  {
    id: 39,
    topic: "delays",
    title:
      "Which delay is dependent on bandwidth and which on distance?"
  },

  {
    id: 40,
    topic: "vpn",
    title:
      "What is a VPN and how does it work?"
  },

  {
    id: 41,
    topic: "vpn",
    title:
      "What are some advantages and limitations of using a VPN?"
  }

];


const TOPIC_NAMES = {

  protocols:
    "Protocols & Architecture",

  networks:
    "Network Types & Models",

  topology:
    "Topologies",

  devices:
    "Devices & Security",

  tcp:
    "TCP & Reliability",

  delays:
    "Delays",

  ip:
    "IP & Subnetting",

  dns:
    "DNS",

  communication:
    "Communication Types",

  osi:
    "OSI Layers",

  vpn:
    "VPN"

};


const searchInput =
  document.getElementById("searchInput");

const topicFilter =
  document.getElementById("topicFilter");

const questionList =
  document.getElementById("questionList");

const emptyState =
  document.getElementById("emptyState");

const loadingState =
  document.getElementById("loadingState");

const totalQuestions =
  document.getElementById("totalQuestions");

const answeredCount =
  document.getElementById("answeredCount");

const backBtn =
  document.getElementById("backBtn");

const completionBtn =
  document.getElementById("completionBtn");


let currentUser = null;

let practicedQuestions = new Set();



function renderQuestions() {

  const searchTerm =
    searchInput.value
      .trim()
      .toLowerCase();


  const selectedTopic =
    topicFilter.value;


  const filtered =
    QUESTIONS.filter(
      question => {

        const matchesSearch =
          question.title
            .toLowerCase()
            .includes(searchTerm);


        const matchesTopic =
          selectedTopic === "all" ||
          question.topic === selectedTopic;


        return (
          matchesSearch &&
          matchesTopic
        );

      }
    );


  questionList.innerHTML = "";


  if (filtered.length === 0) {

    emptyState.classList.remove(
      "hidden"
    );

    return;

  }


  emptyState.classList.add(
    "hidden"
  );


  filtered.forEach(
    question => {

      const card =
        document.createElement("article");


      card.className =
        "question-card";


      card.dataset.id =
        question.id;


      const isPracticed =
        practicedQuestions.has(
          question.id
        );


      card.innerHTML = `

        <button
          class="question-header"
          type="button"
        >

          <div class="question-number">
            ${question.id}
          </div>


          <div class="question-title">
            ${question.title}
          </div>


          <div class="question-arrow">
            ▼
          </div>

        </button>


        <div class="question-answer">

          <span class="topic-pill">
            ${TOPIC_NAMES[question.topic]}
          </span>


          <p class="answer-placeholder">
            Use your Computer Networks notes to
            explain this question aloud. Focus on
            definitions, working steps, examples,
            comparisons, formulas, and practical
            reasoning where applicable.
          </p>


          <button
            class="mark-practiced-btn ${
              isPracticed
                ? "practiced"
                : ""
            }"
            type="button"
          >
            ${
              isPracticed
                ? "✓ Practiced"
                : "Mark as Practiced"
            }
          </button>

        </div>

      `;


      const header =
        card.querySelector(
          ".question-header"
        );


      const practiceButton =
        card.querySelector(
          ".mark-practiced-btn"
        );


      header.addEventListener(
        "click",
        () => {

          card.classList.toggle(
            "open"
          );

        }
      );


      practiceButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          if (
            practicedQuestions.has(
              question.id
            )
          ) {

            practicedQuestions.delete(
              question.id
            );

          } else {

            practicedQuestions.add(
              question.id
            );

          }


          updatePracticeUI();

          savePracticeProgress();
        }
      );


      questionList.appendChild(
        card
      );

    }
  );

}



function updatePracticeUI() {

  answeredCount.textContent =
    practicedQuestions.size;


  document
    .querySelectorAll(
      ".mark-practiced-btn"
    )
    .forEach(button => {

      const card =
        button.closest(
          ".question-card"
        );


      const questionId =
        Number(card.dataset.id);


      const practiced =
        practicedQuestions.has(
          questionId
        );


      button.classList.toggle(
        "practiced",
        practiced
      );


      button.textContent =
        practiced
          ? "✓ Practiced"
          : "Mark as Practiced";

    });

}



async function savePracticeProgress() {

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


    const data =
      snapshot.exists()
        ? snapshot.data()
        : {};


    const cnProgress =
      data.cnProgress || {};


    await setDoc(

      userRef,

      {
        cnProgress: {

          ...cnProgress,

          interviewPracticed:
            Array.from(
              practicedQuestions
            )

        }

      },

      {
        merge: true
      }

    );

  } catch (error) {

    console.error(
      "Failed to save interview progress:",
      error
    );

  }

}



async function loadPracticeProgress(user) {

  const userRef =
    doc(
      db,
      "users",
      user.uid
    );


  const snapshot =
    await getDoc(userRef);


  if (!snapshot.exists()) {
    return;
  }


  const data =
    snapshot.data();


  const saved =
    data.cnProgress?.interviewPracticed;


  if (
    Array.isArray(saved)
  ) {

    practicedQuestions =
      new Set(
        saved.map(Number)
      );

  }

}



searchInput.addEventListener(
  "input",
  renderQuestions
);


topicFilter.addEventListener(
  "change",
  renderQuestions
);


backBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "cn.html";

  }
);


completionBtn.addEventListener(
  "click",
  () => {

    window.location.href =
      "cn-complete.html";

  }
);



totalQuestions.textContent =
  QUESTIONS.length;



onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      window.location.href =
        "login.html";

      return;

    }


    currentUser =
      user;


    try {

      await loadPracticeProgress(
        user
      );


      renderQuestions();

      updatePracticeUI();


      loadingState.classList.add(
        "hidden"
      );

    } catch (error) {

      console.error(
        "Failed to load interview questions:",
        error
      );


      loadingState.textContent =
        "Failed to load interview questions. Please refresh and try again.";

    }

  }
);