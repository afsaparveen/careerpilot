$ErrorActionPreference = "Stop"

$root = Get-Location

function Write-Utf8File {
    param(
        [string]$RelativePath,
        [string]$Content
    )

    $full = Join-Path $root $RelativePath
    $dir = Split-Path $full -Parent

    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    Set-Content -Path $full -Value $Content -Encoding UTF8
    Write-Host "Updated: $RelativePath" -ForegroundColor Green
}

# ---------------------------------------------------------
# OS CURRICULUM
# ---------------------------------------------------------

$curriculum = @'
{
  "courseId": "operating-systems",
  "title": "Operating Systems",
  "passingScore": 75,
  "chapters": [
    {
      "id": "os-introduction",
      "number": 1,
      "title": "Introduction to Operating System",
      "topics": [
        {
          "id": "what-is-os",
          "title": "What is an Operating System?",
          "learn": "An Operating System is an interface between the user and hardware. It is responsible for process execution, resource allocation, CPU management, file management and other system tasks.",
          "example": "When you open a browser, the OS manages the program's execution, CPU time, memory, files and interaction with hardware.",
          "keyPoints": [
            "Acts as an interface between user and hardware.",
            "Manages processes and CPU.",
            "Manages files and system resources.",
            "Provides a convenient environment for programs."
          ]
        },
        {
          "id": "os-types",
          "title": "Types of Operating Systems",
          "learn": "The notes cover Batch OS, Multiprogramming OS, Multitasking OS, Time Sharing OS and Real Time OS. The notes also discuss distributed OS in the later overview.",
          "example": "In a multiprogramming system, if one process waits for I/O, the OS can select another ready process so the CPU does not remain idle.",
          "keyPoints": [
            "Batch OS processes groups of jobs.",
            "Multiprogramming keeps multiple jobs in memory.",
            "Multitasking rapidly switches between tasks.",
            "Time sharing supports interactive users.",
            "Real-time systems respond within required deadlines."
          ]
        },
        {
          "id": "kernel-modes",
          "title": "Kernel and User Mode",
          "learn": "The kernel is the part of the OS that interacts directly with hardware and performs critical tasks. Kernel mode is privileged; user mode restricts application access to protect system resources.",
          "example": "A normal application runs in user mode, while an OS routine performing a privileged hardware operation runs in kernel mode.",
          "keyPoints": [
            "Kernel is the core of the OS.",
            "Kernel mode has privileged access.",
            "User mode has restricted access.",
            "The separation improves safety and stability."
          ]
        }
      ]
    },
    {
      "id": "process-management",
      "number": 2,
      "title": "Process Management",
      "topics": [
        {
          "id": "process-definition",
          "title": "Process and PCB",
          "learn": "A process is a program under execution. The Program Counter stores the address of the next instruction. Each process is represented by a Process Control Block (PCB).",
          "example": "When a program starts running, the OS creates a process and maintains information about it in its PCB.",
          "keyPoints": [
            "Process = program under execution.",
            "Program Counter points to the next instruction.",
            "PCB stores process management information."
          ]
        },
        {
          "id": "process-states",
          "title": "Process States",
          "learn": "A process moves through states such as New, Ready, Running, Waiting or Blocked, and Terminated depending on its execution and resource needs.",
          "example": "A running process that requests disk I/O may move to the waiting state until the I/O operation completes.",
          "keyPoints": [
            "New means the process is being created.",
            "Ready means it is waiting for CPU time.",
            "Running means it currently uses the CPU.",
            "Waiting or blocked means it waits for an event or resource.",
            "Terminated means execution is complete."
          ]
        },
        {
          "id": "process-operations",
          "title": "Process Operations",
          "learn": "Operating systems create, schedule, block, resume and terminate processes. Process management coordinates these activities so system resources are used effectively.",
          "example": "A parent process may create a child process to perform another task while both are managed by the OS.",
          "keyPoints": [
            "Process creation and termination are OS responsibilities.",
            "The scheduler chooses processes for execution.",
            "Blocked processes wait for events such as I/O."
          ]
        }
      ]
    },
    {
      "id": "cpu-scheduling",
      "number": 3,
      "title": "CPU Scheduling",
      "topics": [
        {
          "id": "scheduling-basics",
          "title": "CPU Scheduling Basics",
          "learn": "CPU scheduling decides which process in the ready queue should execute next. Goals include high CPU utilization and throughput and low turnaround, waiting and response time, while maintaining fairness.",
          "example": "When several processes are ready, the scheduler chooses one according to the selected scheduling algorithm.",
          "keyPoints": [
            "Scheduler selects the next process.",
            "Important goals include utilization, throughput and response.",
            "Fairness helps avoid starvation."
          ]
        },
        {
          "id": "preemptive-nonpreemptive",
          "title": "Preemptive vs Non-Preemptive",
          "learn": "In non-preemptive scheduling, a process keeps the CPU until it finishes or blocks. In preemptive scheduling, the OS can take the CPU away and assign it to another process.",
          "example": "A short urgent process arriving while a long process is executing may be handled through preemption.",
          "keyPoints": [
            "Non-preemptive scheduling has less context-switch overhead.",
            "Preemptive scheduling generally improves responsiveness.",
            "Preemption introduces additional overhead."
          ]
        },
        {
          "id": "scheduling-algorithms",
          "title": "Scheduling Algorithms",
          "learn": "Common scheduling algorithms studied in operating systems include FCFS, SJF, Priority and Round Robin. Each gives different behavior for waiting time, response and fairness.",
          "example": "Round Robin gives each ready process a time quantum before moving to another process.",
          "keyPoints": [
            "FCFS follows arrival order.",
            "SJF prefers the shortest job.",
            "Priority scheduling uses priority.",
            "Round Robin uses a time quantum."
          ]
        }
      ]
    },
    {
      "id": "process-synchronization",
      "number": 4,
      "title": "Process Synchronization",
      "topics": [
        {
          "id": "critical-section",
          "title": "Critical Section and Race Condition",
          "learn": "A critical section is the part of a program where shared resources are accessed. A race condition can occur when concurrent access to shared data produces results dependent on timing.",
          "example": "Two processes updating the same shared counter without synchronization may overwrite each other's changes.",
          "keyPoints": [
            "Critical sections access shared resources.",
            "Race conditions produce timing-dependent results.",
            "Synchronization aims to make concurrent access correct."
          ]
        },
        {
          "id": "synchronization-requirements",
          "title": "Critical Section Requirements",
          "learn": "A solution to the critical section problem should satisfy mutual exclusion, progress and bounded waiting.",
          "example": "Mutual exclusion prevents two processes from entering a protected critical section simultaneously.",
          "keyPoints": [
            "Mutual exclusion.",
            "Progress.",
            "Bounded waiting."
          ]
        },
        {
          "id": "semaphores-mutex",
          "title": "Mutex and Semaphores",
          "learn": "A mutex provides exclusive access to a shared resource. A binary semaphore can take 0 and 1, while a counting semaphore can represent multiple resource instances.",
          "example": "A mutex can protect a shared data structure so only one thread modifies it at a time.",
          "keyPoints": [
            "Mutex is used for exclusive access.",
            "Binary semaphore uses 0 and 1.",
            "Counting semaphore can represent multiple instances."
          ]
        },
        {
          "id": "classic-synchronization",
          "title": "Producer-Consumer and Monitors",
          "learn": "The Producer-Consumer problem uses a shared buffer. The notes also cover monitors, condition variables, spinlocks and hardware synchronization such as Test-and-Set.",
          "example": "A producer places data into a shared buffer and a consumer removes it, requiring synchronization around buffer access.",
          "keyPoints": [
            "Producer-Consumer uses a shared buffer.",
            "Condition variables block until a condition is true.",
            "Monitors provide a high-level synchronization construct.",
            "Spinlocks are useful when a lock is expected to be held briefly."
          ]
        }
      ]
    },
    {
      "id": "deadlock",
      "number": 5,
      "title": "Deadlock",
      "topics": [
        {
          "id": "deadlock-basics",
          "title": "Deadlock and Necessary Conditions",
          "learn": "Deadlock is a state in which processes are unable to continue because each is waiting for resources or events that cannot be obtained. The classic necessary conditions are mutual exclusion, hold and wait, no preemption and circular wait.",
          "example": "Process P1 holds R1 and waits for R2 while P2 holds R2 and waits for R1.",
          "keyPoints": [
            "Mutual exclusion.",
            "Hold and wait.",
            "No preemption.",
            "Circular wait."
          ]
        },
        {
          "id": "rag",
          "title": "Resource Allocation Graph",
          "learn": "A Resource Allocation Graph represents processes and resources using nodes and directed edges. Request and assignment edges describe waiting and allocation.",
          "example": "P → R means the process requests a resource, while R → P means that resource is assigned to the process.",
          "keyPoints": [
            "Processes and resources are represented as graph nodes.",
            "Request edge: process to resource.",
            "Assignment edge: resource to process."
          ]
        },
        {
          "id": "deadlock-handling",
          "title": "Deadlock Handling",
          "learn": "The notes describe prevention, avoidance, detection and recovery, and the ignore-the-problem approach. Banker’s Algorithm is discussed for avoidance with multiple resource instances.",
          "example": "Deadlock avoidance grants a request only when the resulting state remains safe.",
          "keyPoints": [
            "Prevention breaks at least one necessary condition.",
            "Avoidance checks whether allocation keeps the system safe.",
            "Detection and recovery allow deadlock and then handle it.",
            "The notes mention the Ostrich approach."
          ]
        }
      ]
    },
    {
      "id": "ipc",
      "number": 6,
      "title": "Inter-process Communication",
      "topics": [
        {
          "id": "ipc-overview",
          "title": "IPC Overview",
          "learn": "Inter-process communication is used when processes need to exchange data or coordinate. The notes discuss client-server communication, component-based applications, parallel processing, synchronization and transaction systems.",
          "example": "A client process can send a request to a server process and receive a response.",
          "keyPoints": [
            "IPC supports process communication and coordination.",
            "It is useful in client-server systems.",
            "It is useful in parallel processing and shared-data coordination."
          ]
        },
        {
          "id": "message-passing",
          "title": "Message Passing",
          "learn": "In message passing, processes communicate by sending and receiving structured messages. They do not need to share the same memory region.",
          "example": "A client sends a request message to a server and receives a response message.",
          "keyPoints": [
            "No shared memory is required.",
            "Works well across machines and distributed systems.",
            "Messages provide structured communication."
          ]
        },
        {
          "id": "shared-memory",
          "title": "Shared Memory",
          "learn": "In shared memory, processes access a common memory region. It can be fast because there is no message-copying overhead, but synchronization is required to avoid data clashes.",
          "example": "Two processes can exchange data through a shared buffer in memory protected by synchronization primitives.",
          "keyPoints": [
            "Processes share a memory region.",
            "Can be very fast.",
            "Requires synchronization."
          ]
        }
      ]
    },
    {
      "id": "memory-management",
      "number": 7,
      "title": "Memory Management",
      "topics": [
        {
          "id": "memory-basics",
          "title": "Memory Management Basics",
          "learn": "Memory management controls allocation and deallocation of memory for processes so multiple programs can use RAM efficiently.",
          "example": "When a new process starts, the OS finds suitable memory and tracks which portions are allocated and free.",
          "keyPoints": [
            "Allocates memory to processes.",
            "Tracks free and occupied memory.",
            "Supports efficient multiprogramming."
          ]
        },
        {
          "id": "fragmentation",
          "title": "Internal and External Fragmentation",
          "learn": "Internal fragmentation is wasted space inside allocated blocks. External fragmentation is wasted free space between allocated blocks, where enough total space may exist but not as one contiguous area.",
          "example": "A process using 6 KB inside an 8 KB block leaves 2 KB of internal fragmentation.",
          "keyPoints": [
            "Internal fragmentation occurs inside allocated blocks.",
            "External fragmentation occurs between allocated blocks.",
            "Compaction can reduce external fragmentation."
          ]
        },
        {
          "id": "contiguous-allocation",
          "title": "Contiguous Memory Allocation",
          "learn": "In contiguous memory allocation, each process gets one continuous block. The notes cover fixed partitioning and variable partitioning.",
          "example": "Fixed partitioning divides memory into fixed-size partitions before processes are assigned.",
          "keyPoints": [
            "Fixed partitions are simple but can cause internal fragmentation.",
            "Variable partitions better match process size.",
            "Variable partitioning can produce external fragmentation."
          ]
        },
        {
          "id": "paging",
          "title": "Paging",
          "learn": "Paging divides logical memory into pages and physical memory into frames so a process does not need one contiguous block of physical memory.",
          "example": "A process can have pages placed in different frames while the OS maps logical addresses to physical locations.",
          "keyPoints": [
            "Pages belong to logical memory.",
            "Frames belong to physical memory.",
            "Paging helps avoid external fragmentation."
          ]
        }
      ]
    },
    {
      "id": "file-systems",
      "number": 8,
      "title": "File Systems",
      "topics": [
        {
          "id": "file-system-basics",
          "title": "File System Basics",
          "learn": "A file system organizes files and directories and provides methods for storing, locating and accessing file data.",
          "example": "A directory can contain multiple files and subdirectories, forming a hierarchical structure.",
          "keyPoints": [
            "Files hold stored data.",
            "Directories organize files.",
            "File systems provide access and management mechanisms."
          ]
        },
        {
          "id": "free-space-management",
          "title": "Free Space Management",
          "learn": "The notes describe bitmaps, free lists, grouping and counting as methods for managing free disk blocks.",
          "example": "In a bitmap, one bit corresponds to a disk block and the bit records whether the block is allocated or free.",
          "keyPoints": [
            "Bitmap uses bits for disk blocks.",
            "Free list links free blocks.",
            "Grouping stores addresses in groups.",
            "Counting stores a starting address and a count."
          ]
        },
        {
          "id": "file-system-mounting",
          "title": "File System Mounting",
          "learn": "Mounting makes a file system accessible to the OS. A mount point is the directory where the new file system is attached.",
          "example": "A USB drive can be mounted under a directory such as /media/usb.",
          "keyPoints": [
            "Mounting attaches a file system.",
            "Mount point is the attachment directory.",
            "The OS verifies and records the mounted file system."
          ]
        },
        {
          "id": "ufs",
          "title": "Unix File System",
          "learn": "The notes describe UFS as a foundational Unix file system with Boot Block, Superblock, Inode Table and Data Blocks.",
          "example": "The inode stores metadata such as file permissions and size, while data blocks hold file contents.",
          "keyPoints": [
            "Boot Block contains bootloader information.",
            "Superblock contains file-system metadata.",
            "Inode table stores individual file metadata.",
            "Data blocks contain actual file contents."
          ]
        }
      ]
    },
    {
      "id": "disk-management",
      "number": 9,
      "title": "Disk Management",
      "topics": [
        {
          "id": "disk-basics",
          "title": "Disk Management Basics",
          "learn": "Disk management concerns organizing and accessing secondary storage efficiently. The OS manages disk space and chooses how disk requests are serviced.",
          "example": "When several processes request disk access, the OS uses a disk scheduling policy to decide service order.",
          "keyPoints": [
            "Disk management handles secondary storage.",
            "Request ordering affects performance.",
            "Disk scheduling can reduce unnecessary head movement."
          ]
        },
        {
          "id": "disk-scheduling",
          "title": "Disk Scheduling",
          "learn": "Disk scheduling algorithms determine the order in which disk requests are serviced. Common concepts include FCFS, SSTF, SCAN, C-SCAN and related approaches.",
          "example": "SSTF chooses the pending request with the shortest seek distance from the current head position.",
          "keyPoints": [
            "FCFS services requests in arrival order.",
            "SSTF selects the closest request.",
            "SCAN moves like an elevator across the disk.",
            "Scheduling tries to reduce seek overhead."
          ]
        },
        {
          "id": "disk-performance",
          "title": "Disk Performance",
          "learn": "Disk performance depends on factors such as seek time, rotational delay and data transfer. Scheduling decisions can change total service time.",
          "example": "A sequence of requests that causes repeated long head movements can take longer than an intelligently ordered sequence.",
          "keyPoints": [
            "Seek time is time to position the disk head.",
            "Rotational delay is waiting for the desired sector.",
            "Transfer time is time to move the data."
          ]
        }
      ]
    }
  ]
}
'@

Write-Utf8File "data\os-curriculum.json" $curriculum

# ---------------------------------------------------------
# OS HTML
# ---------------------------------------------------------

$osHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Operating Systems | CareerPilot AI</title>
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/os.css" />
</head>
<body>
  <nav class="os-navbar">
    <div class="os-brand">CareerPilot AI <span>/ Operating Systems</span></div>
    <div class="os-nav-actions">
      <a href="dashboard.html">Dashboard</a>
      <button id="logoutBtn">Logout</button>
    </div>
  </nav>

  <main class="os-page">
    <section class="os-hero">
      <div>
        <p class="os-eyebrow">TECHNICAL PREPARATION</p>
        <h1>Operating Systems</h1>
        <p>Learn OS chapter-by-chapter, complete self-checks, and pass assessments to unlock the next chapter.</p>
      </div>
      <div class="os-completion-box">
        <strong id="coursePercent">0%</strong>
        <span>Course Complete</span>
      </div>
    </section>

    <section class="os-layout">
      <aside class="os-sidebar">
        <div class="os-sidebar-head">
          <h2>Chapters</h2>
          <span id="chapterCount">0</span>
        </div>
        <div id="chapterList"></div>
      </aside>

      <section class="os-content">
        <div id="loadError" class="os-error" hidden></div>

        <div id="emptyState" class="os-empty">
          <div class="os-empty-icon">🧠</div>
          <h2>Loading your OS course…</h2>
          <p>Please wait while the chapter content is loaded.</p>
        </div>

        <div id="courseView" hidden>
          <div class="os-topic-head">
            <div>
              <span id="chapterBadge" class="os-badge"></span>
              <h2 id="chapterTitle"></h2>
              <p id="topicTitle"></p>
            </div>
            <div class="os-topic-counter" id="topicCounter"></div>
          </div>

          <div id="topicNav" class="os-topic-nav"></div>

          <article class="os-card">
            <h3>📖 Learn</h3>
            <p id="learnText"></p>
          </article>

          <article class="os-card">
            <h3>💡 Example</h3>
            <p id="exampleText"></p>
          </article>

          <article class="os-card">
            <h3>🔑 Key Points</h3>
            <ul id="keyPoints"></ul>
          </article>

          <article class="os-card">
            <h3>✍️ Self Check</h3>
            <p>Write what you learned in your own words before completing this topic.</p>
            <textarea id="selfCheck" placeholder="Explain the concept in at least 40 characters..."></textarea>
            <div class="os-self-check-meta">
              <span id="selfCheckCount">0 characters</span>
              <button id="completeTopicBtn" class="os-primary-btn">Complete Topic</button>
            </div>
            <p id="completeMessage" class="os-message"></p>
          </article>

          <div class="os-bottom-actions">
            <button id="prevTopicBtn" class="os-secondary-btn">← Previous</button>
            <button id="nextTopicBtn" class="os-primary-btn">Next Topic →</button>
            <button id="assessmentBtn" class="os-assessment-btn" hidden>Take Chapter Assessment</button>
          </div>
        </div>
      </section>
    </section>
  </main>

  <script type="module" src="../js/technical/os.js"></script>
</body>
</html>
'@

Write-Utf8File "pages\os.html" $osHtml

# ---------------------------------------------------------
# OS CSS
# ---------------------------------------------------------

$osCss = @'
body {
  margin: 0;
  background: #f6f7ff;
  color: #171b3a;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.os-navbar {
  height: 74px;
  padding: 0 34px;
  background: #fff;
  border-bottom: 1px solid #e6e7f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.os-brand {
  font-size: 23px;
  font-weight: 800;
}

.os-brand span {
  color: #8c90aa;
  font-weight: 500;
}

.os-nav-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}

.os-nav-actions a {
  text-decoration: none;
  color: #5849df;
  font-weight: 800;
}

.os-nav-actions button {
  border: 0;
  background: #f0edff;
  color: #5849df;
  border-radius: 13px;
  padding: 11px 16px;
  font-weight: 800;
  cursor: pointer;
}

.os-page {
  max-width: 1480px;
  margin: 0 auto;
  padding: 42px 30px 70px;
}

.os-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  padding: 44px;
  border-radius: 30px;
  color: #fff;
  background: linear-gradient(135deg, #6252f7, #8a74ff);
  box-shadow: 0 25px 65px rgba(98, 82, 247, 0.28);
}

.os-eyebrow {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.os-hero h1 {
  margin: 0;
  font-size: 48px;
}

.os-hero p {
  max-width: 850px;
  font-size: 17px;
  line-height: 1.7;
}

.os-completion-box {
  min-width: 160px;
  height: 150px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.os-completion-box strong {
  font-size: 46px;
}

.os-completion-box span {
  font-size: 15px;
}

.os-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 30px;
  margin-top: 32px;
}

.os-sidebar,
.os-content {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 12px 45px rgba(40, 40, 80, .08);
}

.os-sidebar {
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.os-sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.os-sidebar-head h2 {
  margin: 0;
}

.os-sidebar-head span {
  background: #f0edff;
  color: #5d50df;
  font-weight: 800;
  border-radius: 999px;
  padding: 5px 10px;
}

.os-chapter {
  border: 1px solid #e6e6f0;
  border-radius: 17px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: .2s;
}

.os-chapter:hover {
  border-color: #7869f7;
}

.os-chapter.active {
  background: #f4f2ff;
  border-color: #7869f7;
}

.os-chapter.locked {
  opacity: .55;
  cursor: not-allowed;
}

.os-chapter-title {
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.os-chapter-meta {
  margin-top: 7px;
  color: #7b7f98;
  font-size: 13px;
}

.os-content {
  padding: 34px;
}

.os-error {
  padding: 16px 18px;
  background: #fff0f0;
  border: 1px solid #ffcaca;
  color: #b42318;
  border-radius: 14px;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.os-empty {
  min-height: 550px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #70748f;
  text-align: center;
}

.os-empty-icon {
  font-size: 55px;
}

.os-topic-head {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.os-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: #f0edff;
  color: #5c4ddf;
  font-size: 12px;
  font-weight: 900;
}

.os-topic-head h2 {
  margin: 13px 0 5px;
  font-size: 31px;
}

.os-topic-head p {
  margin: 0;
  color: #777b94;
  font-weight: 700;
}

.os-topic-counter {
  color: #777b94;
  font-weight: 800;
}

.os-topic-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}

.os-topic-pill {
  border: 1px solid #dedff0;
  background: #fff;
  color: #555a72;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.os-topic-pill.current {
  background: #5f51ea;
  border-color: #5f51ea;
  color: #fff;
}

.os-topic-pill.completed {
  background: #eefaf2;
  color: #1f7a45;
  border-color: #bce8ca;
}

.os-card {
  padding: 25px;
  border: 1px solid #ebebf3;
  border-radius: 21px;
  margin-top: 18px;
}

.os-card h3 {
  margin-top: 0;
}

.os-card p,
.os-card li {
  line-height: 1.75;
  color: #4d526b;
}

.os-card textarea {
  width: 100%;
  min-height: 150px;
  border: 1px solid #dedff0;
  border-radius: 15px;
  resize: vertical;
  padding: 15px;
  box-sizing: border-box;
  margin-top: 12px;
  font: inherit;
}

.os-self-check-meta {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.os-primary-btn,
.os-secondary-btn,
.os-assessment-btn {
  border: 0;
  border-radius: 13px;
  padding: 12px 18px;
  font-weight: 800;
  cursor: pointer;
}

.os-primary-btn {
  background: #5f51ea;
  color: #fff;
}

.os-secondary-btn {
  background: #f1f1f8;
  color: #52566e;
}

.os-assessment-btn {
  background: #16a05d;
  color: #fff;
}

.os-primary-btn:disabled,
.os-secondary-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.os-message {
  min-height: 22px;
  font-weight: 800;
  color: #268250 !important;
}

.os-bottom-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

@media (max-width: 1000px) {
  .os-layout {
    grid-template-columns: 1fr;
  }

  .os-sidebar {
    position: static;
  }
}

@media (max-width: 700px) {
  .os-navbar {
    padding: 0 16px;
  }

  .os-brand span {
    display: none;
  }

  .os-page {
    padding: 20px 15px 50px;
  }

  .os-hero {
    padding: 27px;
    flex-direction: column;
    align-items: flex-start;
  }

  .os-hero h1 {
    font-size: 38px;
  }

  .os-completion-box {
    min-width: 100%;
  }

  .os-content {
    padding: 20px;
  }

  .os-topic-head {
    flex-direction: column;
  }
}
'@

Write-Utf8File "css\os.css" $osCss

# ---------------------------------------------------------
# OS JS
# ---------------------------------------------------------

$osJs = @'
import { auth, db } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const chapterList = document.getElementById("chapterList");
const chapterCount = document.getElementById("chapterCount");
const coursePercent = document.getElementById("coursePercent");
const emptyState = document.getElementById("emptyState");
const courseView = document.getElementById("courseView");
const loadError = document.getElementById("loadError");

const chapterBadge = document.getElementById("chapterBadge");
const chapterTitle = document.getElementById("chapterTitle");
const topicTitle = document.getElementById("topicTitle");
const topicCounter = document.getElementById("topicCounter");
const topicNav = document.getElementById("topicNav");
const learnText = document.getElementById("learnText");
const exampleText = document.getElementById("exampleText");
const keyPoints = document.getElementById("keyPoints");
const selfCheck = document.getElementById("selfCheck");
const selfCheckCount = document.getElementById("selfCheckCount");
const completeTopicBtn = document.getElementById("completeTopicBtn");
const completeMessage = document.getElementById("completeMessage");
const prevTopicBtn = document.getElementById("prevTopicBtn");
const nextTopicBtn = document.getElementById("nextTopicBtn");
const assessmentBtn = document.getElementById("assessmentBtn");
const logoutBtn = document.getElementById("logoutBtn");

let user = null;
let curriculum = null;
let progress = {
  completedTopics: {},
  selfChecks: {},
  completedChapters: {},
  assessments: {}
};

let currentChapterIndex = 0;
let currentTopicIndex = 0;

async function loadCurriculum() {
  const response = await fetch("../data/os-curriculum.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load os-curriculum.json (HTTP ${response.status}).`);
  }

  return await response.json();
}

function topicKey(chapterId, topicId) {
  return `${chapterId}__${topicId}`;
}

async function loadProgress() {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    progress = {
      ...progress,
      ...(data.osProgress || {})
    };
  }
}

async function saveProgress() {
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    {
      osProgress: progress
    },
    { merge: true }
  );
}

function isChapterUnlocked(index) {
  if (index === 0) return true;

  return !!progress.completedChapters[
    curriculum.chapters[index - 1].id
  ];
}

function isTopicCompleted(chapter, topic) {
  return !!progress.completedTopics[
    topicKey(chapter.id, topic.id)
  ];
}

function isChapterCompleted(chapter) {
  return !!progress.completedChapters[chapter.id];
}

function renderChapters() {
  chapterList.innerHTML = "";
  chapterCount.textContent = curriculum.chapters.length;

  curriculum.chapters.forEach((chapter, index) => {
    const unlocked = isChapterUnlocked(index);
    const completed = isChapterCompleted(chapter);

    const item = document.createElement("div");
    item.className = "os-chapter";

    if (index === currentChapterIndex) item.classList.add("active");
    if (!unlocked) item.classList.add("locked");

    item.innerHTML = `
      <div class="os-chapter-title">
        <span>${chapter.number}. ${chapter.title}</span>
        <span>${completed ? "✓" : unlocked ? "›" : "🔒"}</span>
      </div>
      <div class="os-chapter-meta">
        ${chapter.topics.length} topics
      </div>
    `;

    if (unlocked) {
      item.addEventListener("click", () => {
        currentChapterIndex = index;
        currentTopicIndex = 0;
        renderAll();
      });
    }

    chapterList.appendChild(item);
  });
}

function renderTopicNav(chapter) {
  topicNav.innerHTML = "";

  chapter.topics.forEach((topic, index) => {
    const pill = document.createElement("button");
    pill.className = "os-topic-pill";

    if (index === currentTopicIndex) {
      pill.classList.add("current");
    }

    if (isTopicCompleted(chapter, topic)) {
      pill.classList.add("completed");
    }

    pill.textContent = `${index + 1}. ${topic.title}`;

    const canOpen =
      index === 0 ||
      isTopicCompleted(chapter, chapter.topics[index - 1]);

    pill.disabled = !canOpen;
    pill.addEventListener("click", () => {
      if (!canOpen) return;
      currentTopicIndex = index;
      renderAll();
    });

    topicNav.appendChild(pill);
  });
}

function renderCurrentTopic() {
  const chapter = curriculum.chapters[currentChapterIndex];
  const topic = chapter.topics[currentTopicIndex];

  chapterBadge.textContent = `Chapter ${chapter.number}`;
  chapterTitle.textContent = chapter.title;
  topicTitle.textContent = topic.title;
  topicCounter.textContent =
    `Topic ${currentTopicIndex + 1} of ${chapter.topics.length}`;

  learnText.textContent = topic.learn;
  exampleText.textContent = topic.example;

  keyPoints.innerHTML = "";
  topic.keyPoints.forEach(point => {
    const li = document.createElement("li");
    li.textContent = point;
    keyPoints.appendChild(li);
  });

  const key = topicKey(chapter.id, topic.id);
  selfCheck.value = progress.selfChecks[key] || "";
  updateSelfCheckCount();

  const completed = isTopicCompleted(chapter, topic);

  completeTopicBtn.disabled = completed;

  if (completed) {
    completeTopicBtn.textContent = "✓ Topic Completed";
    completeMessage.textContent = "This topic is completed.";
  } else {
    completeTopicBtn.textContent = "Complete Topic";
    completeMessage.textContent = "";
  }

  prevTopicBtn.disabled = currentTopicIndex === 0;

  const lastTopic = currentTopicIndex === chapter.topics.length - 1;
  nextTopicBtn.disabled =
    !completed || lastTopic;

  assessmentBtn.hidden = !(
    lastTopic && allTopicsCompleted(chapter)
  );

  prevTopicBtn.textContent =
    currentTopicIndex === 0
      ? "← Previous"
      : "← Previous Topic";

  nextTopicBtn.textContent =
    lastTopic
      ? "Chapter Complete"
      : "Next Topic →";
}

function allTopicsCompleted(chapter) {
  return chapter.topics.every(topic =>
    isTopicCompleted(chapter, topic)
  );
}

function updateCourseProgress() {
  let total = 0;
  let completed = 0;

  curriculum.chapters.forEach(chapter => {
    total += chapter.topics.length;
    chapter.topics.forEach(topic => {
      if (isTopicCompleted(chapter, topic)) {
        completed++;
      }
    });
  });

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  coursePercent.textContent = `${percentage}%`;
}

function renderAll() {
  renderChapters();
  renderTopicNav(curriculum.chapters[currentChapterIndex]);
  renderCurrentTopic();
  updateCourseProgress();
}

function showError(error) {
  console.error(error);

  emptyState.hidden = true;
  courseView.hidden = true;
  loadError.hidden = false;

  loadError.textContent =
    `OS course failed to load.\n\n${error.message}\n\nOpen the browser Console (F12) if the problem continues.`;
}

selfCheck.addEventListener("input", updateSelfCheckCount);

function updateSelfCheckCount() {
  selfCheckCount.textContent =
    `${selfCheck.value.trim().length} characters`;
}

completeTopicBtn.addEventListener("click", async () => {
  const chapter = curriculum.chapters[currentChapterIndex];
  const topic = chapter.topics[currentTopicIndex];
  const answer = selfCheck.value.trim();

  if (answer.length < 40) {
    completeMessage.textContent =
      "Please write at least 40 characters in the self-check.";
    return;
  }

  const key = topicKey(chapter.id, topic.id);

  progress.completedTopics[key] = true;
  progress.selfChecks[key] = answer;

  if (allTopicsCompleted(chapter)) {
    progress.completedChapters[chapter.id] = true;
  }

  try {
    completeTopicBtn.disabled = true;
    completeMessage.textContent = "Saving progress…";

    await saveProgress();

    renderAll();

    completeMessage.textContent =
      "Topic completed and progress saved.";

  } catch (error) {
    console.error(error);
    completeMessage.textContent =
      "Could not save progress. Please try again.";
  }
});

prevTopicBtn.addEventListener("click", () => {
  if (currentTopicIndex > 0) {
    currentTopicIndex--;
    renderAll();
  }
});

nextTopicBtn.addEventListener("click", () => {
  const chapter = curriculum.chapters[currentChapterIndex];

  if (!isTopicCompleted(
    chapter,
    chapter.topics[currentTopicIndex]
  )) {
    return;
  }

  if (currentTopicIndex < chapter.topics.length - 1) {
    currentTopicIndex++;
    renderAll();
  }
});

assessmentBtn.addEventListener("click", () => {
  const chapter = curriculum.chapters[currentChapterIndex];

  window.location.href =
    `os-assessment.html?chapter=${encodeURIComponent(chapter.id)}`;
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

onAuthStateChanged(auth, async currentUser => {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  user = currentUser;

  try {
    curriculum = await loadCurriculum();

    if (
      !curriculum ||
      !Array.isArray(curriculum.chapters) ||
      curriculum.chapters.length === 0
    ) {
      throw new Error("No chapters were found in os-curriculum.json.");
    }

    await loadProgress();

    emptyState.hidden = true;
    courseView.hidden = false;

    renderAll();

  } catch (error) {
    showError(error);
  }
});
'@

Write-Utf8File "js\technical\os.js" $osJs

# ---------------------------------------------------------
# ASSESSMENT HTML
# ---------------------------------------------------------

$assessmentHtml = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OS Assessment | CareerPilot AI</title>
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/os-assessment.css" />
</head>
<body>
  <nav class="os-navbar">
    <div class="os-brand">CareerPilot AI <span>/ OS Assessment</span></div>
    <div class="os-nav-actions">
      <a href="os.html">Back to OS</a>
      <button id="logoutBtn">Logout</button>
    </div>
  </nav>

  <main class="assessment-page">
    <div class="assessment-hero">
      <p class="eyebrow">TECHNICAL PREPARATION</p>
      <h1 id="assessmentTitle">OS Assessment</h1>
      <p id="assessmentDescription"></p>
    </div>

    <div class="assessment-progress">
      <span>Progress</span>
      <strong id="progressText">0%</strong>
      <div class="bar">
        <div id="progressFill"></div>
      </div>
    </div>

    <section id="questionContainer"></section>

    <div class="assessment-actions">
      <button id="submitBtn">Submit Assessment</button>
      <a href="os.html">Back to Course</a>
    </div>

    <section id="resultCard" class="result-card" hidden>
      <div class="result-icon" id="resultIcon">🎯</div>
      <h2 id="resultTitle"></h2>
      <p id="resultMessage"></p>
      <strong id="resultScore"></strong>
      <div class="result-stats">
        <div><span>Correct</span><b id="correctCount">0</b></div>
        <div><span>Wrong</span><b id="wrongCount">0</b></div>
        <div><span>Total</span><b id="totalCount">0</b></div>
      </div>
      <button id="retryBtn">Retry</button>
    </section>
  </main>

  <script type="module" src="../js/technical/os-assessment.js"></script>
</body>
</html>
'@

Write-Utf8File "pages\os-assessment.html" $assessmentHtml

# ---------------------------------------------------------
# ASSESSMENT CSS
# ---------------------------------------------------------

$assessmentCss = @'
body {
  margin: 0;
  background: #f6f7ff;
  color: #171b3a;
  font-family: Inter, system-ui, sans-serif;
}

.assessment-page {
  max-width: 1050px;
  margin: auto;
  padding: 35px 20px 70px;
}

.assessment-hero {
  background: linear-gradient(135deg, #6252f7, #8a74ff);
  color: #fff;
  border-radius: 28px;
  padding: 34px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.assessment-hero h1 {
  margin: 0;
  font-size: 38px;
}

.assessment-progress {
  background: #fff;
  padding: 18px;
  margin: 24px 0;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(40,40,80,.07);
}

.assessment-progress > span {
  color: #70748b;
}

.assessment-progress > strong {
  float: right;
}

.bar {
  clear: both;
  height: 9px;
  background: #eaeaf2;
  margin-top: 13px;
  border-radius: 999px;
  overflow: hidden;
}

.bar div {
  height: 100%;
  width: 0;
  background: #6252f7;
  transition: width .25s;
}

.question {
  background: #fff;
  border-radius: 20px;
  padding: 23px;
  margin-bottom: 15px;
  box-shadow: 0 8px 28px rgba(40,40,80,.06);
}

.question h3 {
  margin-top: 0;
  line-height: 1.5;
}

.option {
  display: flex;
  gap: 11px;
  padding: 12px;
  border: 1px solid #e4e4ef;
  border-radius: 12px;
  margin-top: 10px;
  cursor: pointer;
}

.option:hover {
  background: #f8f7ff;
  border-color: #8477f6;
}

.assessment-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.assessment-actions button,
.assessment-actions a,
.result-card button {
  border: 0;
  border-radius: 12px;
  padding: 13px 18px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
}

.assessment-actions button,
.result-card button {
  background: #6252f7;
  color: #fff;
}

.assessment-actions a {
  background: #eeeefe;
  color: #5547d6;
}

.result-card {
  background: #fff;
  border-radius: 25px;
  padding: 35px;
  text-align: center;
  margin-top: 25px;
}

.result-icon {
  font-size: 48px;
}

.result-score {
  display: block;
  font-size: 44px;
  color: #6252f7;
  margin: 15px;
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.result-stats div {
  background: #f7f7fc;
  padding: 15px;
  border-radius: 14px;
}

.result-stats span {
  display: block;
  color: #777b90;
  font-size: 13px;
}

.result-stats b {
  display: block;
  font-size: 24px;
  margin-top: 4px;
}

@media(max-width:700px){
  .result-stats{
    grid-template-columns:1fr;
  }
}
'@

Write-Utf8File "css\os-assessment.css" $assessmentCss

# ---------------------------------------------------------
# ASSESSMENT JS
# ---------------------------------------------------------

$assessmentJs = @'
import { auth, db } from "../firebase/firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const chapterId = params.get("chapter");

const title = document.getElementById("assessmentTitle");
const description = document.getElementById("assessmentDescription");
const questionContainer = document.getElementById("questionContainer");
const submitBtn = document.getElementById("submitBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resultScore = document.getElementById("resultScore");
const resultIcon = document.getElementById("resultIcon");
const correctCount = document.getElementById("correctCount");
const wrongCount = document.getElementById("wrongCount");
const totalCount = document.getElementById("totalCount");
const retryBtn = document.getElementById("retryBtn");
const logoutBtn = document.getElementById("logoutBtn");

let user = null;
let curriculum = null;
let chapter = null;
let questions = [];

const questionBanks = {
  "os-introduction": [
    ["What is the primary role of an Operating System?", ["Interface between user and hardware","Only a compiler","Only a browser","Only a database"],0],
    ["Which OS type processes groups of jobs without direct interaction during execution?",["Batch OS","Time Sharing OS","Real Time OS","Distributed OS"],0],
    ["Which mode has privileged access to hardware resources?",["User mode","Kernel mode","Browser mode","Application mode"],1],
    ["A process is:",["A program under execution","A file extension","A folder","A database"],0],
    ["Which OS type keeps multiple jobs in memory to improve CPU utilization?",["Multiprogramming","Batch","Single-user","Offline"],0],
    ["Real-time systems are designed to:",["Meet required timing deadlines","Avoid all memory use","Only run browsers","Only store files"],0]
  ],
  "process-management": [
    ["What does PCB stand for?",["Process Control Block","Program Cache Buffer","Process Code Bus","Program Control Board"],0],
    ["The Program Counter stores:",["Address of the next instruction","Disk size","File name","User password"],0],
    ["A running process is:",["Currently using the CPU","Waiting for input","Already terminated","Being created"],0],
    ["A process waiting for I/O is commonly in:",["Waiting/Blocked state","Running state","New state","Terminated state"],0],
    ["Which activity is part of process management?",["Process creation and scheduling","CSS rendering","Image compression","Web styling"],0],
    ["Ready state means a process is:",["Waiting for CPU time","Finished forever","Deleted","Running on disk"],0]
  ],
  "cpu-scheduling": [
    ["CPU scheduling selects:",["Which ready process runs next","Which file is deleted","Which user logs in","Which disk is formatted"],0],
    ["Which is non-preemptive?",["A process keeps CPU until completion/blocking","CPU is always forcibly removed","Only high priority runs","No scheduling happens"],0],
    ["Which scheduling algorithm uses a time quantum?",["Round Robin","FCFS","SJF only","FIFO disk scheduling"],0],
    ["FCFS schedules according to:",["Arrival order","File size","Priority only","Memory size"],0],
    ["A major goal of scheduling is to:",["Reduce waiting and response time","Increase starvation","Keep CPU idle","Delete processes"],0],
    ["Preemptive scheduling can improve:",["Responsiveness","Disk capacity","File permissions","Database indexing"],0]
  ],
  "process-synchronization": [
    ["A critical section is where:",["Shared resources are accessed","A file is compiled","A disk is formatted","A process is deleted"],0],
    ["A race condition depends on:",["Timing of concurrent access","Screen size","Disk brand","Keyboard layout"],0],
    ["Which is a critical section requirement?",["Mutual exclusion","Data deletion","File mounting","Disk formatting"],0],
    ["A mutex provides:",["Exclusive access","Multiple CPUs","Disk storage","Network routing"],0],
    ["A binary semaphore generally uses:",["0 and 1","1 and 2","2 and 3","Any string"],0],
    ["Producer-Consumer commonly uses a:",["Shared buffer","Kernel file","Disk partition","CPU cache only"],0]
  ],
  "deadlock": [
    ["Which is a necessary condition for deadlock?",["Circular wait","Sorting","Caching","Compilation"],0],
    ["P → R in a Resource Allocation Graph means:",["Process requests resource","Resource requests process","Process terminates","Resource is released"],0],
    ["Which algorithm is associated with deadlock avoidance?",["Banker's Algorithm","Round Robin","FCFS","SCAN"],0],
    ["Deadlock prevention attempts to:",["Break at least one necessary condition","Increase circular wait","Remove all CPU scheduling","Delete memory"],0],
    ["Detection and recovery means:",["Allow deadlock, detect it and recover","Never detect anything","Disable the OS","Only increase RAM"],0],
    ["R → P in a Resource Allocation Graph means:",["Resource is assigned to process","Process requests resource","Process is terminated","Disk is mounted"],0]
  ],
  "ipc": [
    ["IPC stands for:",["Inter-process Communication","Internal Program Cache","Input Process Controller","Internet Program Compiler"],0],
    ["Message passing communicates using:",["Structured messages","Shared files only","Disk blocks","Keyboard events"],0],
    ["Shared memory requires:",["Synchronization to avoid clashes","No OS support","No memory","Only a browser"],0],
    ["IPC is useful for:",["Client-server communication","CSS styling","Image editing","Font selection"],0],
    ["Which IPC approach can work across machines?",["Message passing","Only local shared memory","CPU registers","Screen sharing"],0],
    ["Shared memory can be fast because:",["There is no message-copying overhead in the shared region","It uses no RAM","It removes the CPU","It deletes all synchronization"],0]
  ],
  "memory-management": [
    ["Internal fragmentation is wasted space:",["Inside allocated blocks","Only on disk","Between networks","Inside files"],0],
    ["External fragmentation is wasted space:",["Between allocated blocks","Inside one allocated block","Inside the CPU","In the browser"],0],
    ["Variable partitioning can cause:",["External fragmentation","Only internal fragmentation","No fragmentation","Network fragmentation"],0],
    ["Fixed partitioning can cause:",["Internal fragmentation","No memory waste","Only file fragmentation","Only CPU fragmentation"],0],
    ["Paging uses:",["Pages and frames","Only partitions","Only files","Only registers"],0],
    ["Compaction is mainly used to reduce:",["External fragmentation","CPU starvation","Disk rotation","Race conditions"],0]
  ],
  "file-systems": [
    ["Which method uses a bit per disk block?",["Bitmap","Queue","Stack","Hash table"],0],
    ["A free list stores:",["Linked free blocks","CPU instructions","User passwords","Only file names"],0],
    ["Mounting a file system makes it:",["Accessible to the OS","Invisible to the OS","A CPU process","A database query"],0],
    ["A mount point is:",["Directory where a file system is attached","A CPU register","A process state","A scheduling algorithm"],0],
    ["In UFS, the inode stores:",["File metadata","Only file contents","Only boot code","Only directory names"],0],
    ["In UFS, data blocks contain:",["Actual file contents","Only permissions","Only bootloader code","Only file-system type"],0]
  ],
  "disk-management": [
    ["Disk scheduling determines:",["Order of servicing disk requests","Order of user logins","Order of source files","Order of CSS rules"],0],
    ["FCFS disk scheduling serves requests:",["In arrival order","By closest distance","By highest priority only","Randomly"],0],
    ["SSTF chooses the request with:",["Shortest seek distance","Longest seek distance","Largest file size","Highest CPU priority"],0],
    ["SCAN is often compared to:",["An elevator movement pattern","A queue stack","A memory page","A compiler"],0],
    ["Seek time is related to:",["Moving the disk head to the required position","Reading keyboard input","Creating a process","Loading CSS"],0],
    ["Rotational delay is waiting for:",["The required sector to rotate under the head","A process to terminate","A file to mount","The CPU to cool"],0]
  ]
};

function renderQuestions() {
  questionContainer.innerHTML = "";

  questions.forEach((q, index) => {
    const card = document.createElement("div");
    card.className = "question";

    const h3 = document.createElement("h3");
    h3.textContent = `${index + 1}. ${q[0]}`;
    card.appendChild(h3);

    q[1].forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = optionIndex;

      input.addEventListener("change", updateProgress);

      const span = document.createElement("span");
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      card.appendChild(label);
    });

    questionContainer.appendChild(card);
  });

  updateProgress();
}

function updateProgress() {
  const answered = questions.filter((_, index) =>
    document.querySelector(`input[name="q${index}"]:checked`)
  ).length;

  const value = Math.round(
    (answered / questions.length) * 100
  );

  progressText.textContent = `${value}%`;
  progressFill.style.width = `${value}%`;
}

async function saveResult(score, correct, total, passed) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  const osProgress = data.osProgress || {};
  const assessments = osProgress.assessments || {};
  const completedChapters =
    osProgress.completedChapters || {};

  assessments[chapter.id] = {
    score,
    correct,
    total,
    passed,
    completedAt: new Date().toISOString()
  };

  if (passed) {
    completedChapters[chapter.id] = true;
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
    { merge: true }
  );
}

submitBtn.addEventListener("click", async () => {
  const answers = questions.map((_, index) => {
    const selected =
      document.querySelector(`input[name="q${index}"]:checked`);
    return selected ? Number(selected.value) : null;
  });

  if (answers.some(answer => answer === null)) {
    alert("Please answer all questions before submitting.");
    return;
  }

  let correct = 0;

  answers.forEach((answer, index) => {
    if (answer === questions[index][2]) {
      correct++;
    }
  });

  const total = questions.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= 75;

  await saveResult(score, correct, total, passed);

  resultCard.hidden = false;
  submitBtn.disabled = true;

  resultScore.textContent = `${score}%`;
  correctCount.textContent = correct;
  wrongCount.textContent = total - correct;
  totalCount.textContent = total;

  if (passed) {
    resultIcon.textContent = "🎉";
    resultTitle.textContent = "Chapter Passed";
    resultMessage.textContent =
      "You reached the 75% passing score. The chapter has been marked complete.";
  } else {
    resultIcon.textContent = "📚";
    resultTitle.textContent = "Keep Practicing";
    resultMessage.textContent =
      "You need at least 75% to pass. Review the chapter and retry.";
  }

  resultCard.scrollIntoView({ behavior: "smooth" });
});

retryBtn.addEventListener("click", () => {
  resultCard.hidden = true;
  submitBtn.disabled = false;
  renderQuestions();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

onAuthStateChanged(auth, async currentUser => {
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  user = currentUser;

  try {
    const response = await fetch("../data/os-curriculum.json", {
      cache: "no-store"
    });

    const data = await response.json();
    curriculum = data;

    chapter =
      curriculum.chapters.find(c => c.id === chapterId) ||
      curriculum.chapters[0];

    questions =
      questionBanks[chapter.id] ||
      [];

    title.textContent =
      `Chapter ${chapter.number}: ${chapter.title}`;

    description.textContent =
      `Assessment for ${chapter.title}. Passing score: 75%.`;

    if (!questions.length) {
      throw new Error("No questions are available for this chapter.");
    }

    renderQuestions();

  } catch (error) {
    console.error(error);
    questionContainer.innerHTML =
      `<div class="question"><h3>Assessment could not load</h3><p>${error.message}</p></div>`;
  }
});
'@

Write-Utf8File "js\technical\os-assessment.js" $assessmentJs

Write-Host ""
Write-Host "OS module fixed successfully." -ForegroundColor Cyan
Write-Host "Run: npm run dev" -ForegroundColor Yellow
Write-Host "Open: http://localhost:5173/pages/os.html" -ForegroundColor Yellow
