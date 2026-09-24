$ErrorActionPreference = 'Stop'

$root = Get-Location

$files = @{
'os/data-placeholder.txt' = ''
}

New-Item -ItemType Directory -Force -Path "$root/pages","$root/css","$root/js/technical","$root/data" | Out-Null

$curriculum = @'
{
  "courseId": "operating-systems",
  "title": "Operating Systems",
  "source": "Operating System Notes.pdf",
  "passingScore": 75,
  "chapters": [
    {
      "id": "os-introduction",
      "number": 1,
      "title": "Introduction to Operating System",
      "summary": "OS definition, purpose, types, kernel, user mode and kernel mode.",
      "topics": [
        {"id":"os-definition","title":"What is an Operating System?","learn":"An Operating System acts as an interface between the user and hardware. It manages processes, resources, CPU usage, files and other system tasks.","example":"When you open a browser, the OS loads the program, allocates memory, schedules CPU time and manages its files.","keyPoints":["Interface between user and hardware","Process and resource management","CPU management","File management"]},
        {"id":"os-purpose","title":"Purpose of an Operating System","learn":"The OS provides an environment in which users can execute programs conveniently and efficiently.","example":"A desktop OS provides services so applications can use CPU, memory, storage and devices without directly controlling hardware.","keyPoints":["Convenience","Efficiency","Resource management","Program execution"]},
        {"id":"os-types","title":"Types of Operating Systems","learn":"The source notes cover batch-processing, multiprogramming, multitasking, time-sharing, real-time and distributed operating systems.","example":"In a multiprogramming system, when one process waits for I/O, another process can use the CPU.","keyPoints":["Batch","Multiprogramming","Multitasking","Time sharing","Real time","Distributed"]},
        {"id":"os-kernel","title":"Kernel","learn":"The kernel is the part of the operating system that interacts directly with hardware and performs crucial tasks. The notes describe it as the heart of the OS.","example":"A system call may transfer control from an application into the kernel so the OS can perform a privileged operation.","keyPoints":["Direct hardware interaction","Core OS component","Privileged operations"]},
        {"id":"os-modes","title":"User Mode vs Kernel Mode","learn":"Kernel mode has privileged access to hardware and system resources. User mode is restricted so applications cannot freely access protected resources.","example":"A normal application runs in user mode and uses system calls when it needs a protected OS service.","keyPoints":["User mode is restricted","Kernel mode is privileged","Protection and stability"]}
      ]
    },
    {
      "id": "process-management",
      "number": 2,
      "title": "Process Management",
      "summary": "Processes, process states, PCB and process-related management.",
      "topics": [
        {"id":"process-definition","title":"Process","learn":"A process is a program under execution. The program counter indicates the address of the next instruction being executed.","example":"A running text editor is a process, while its executable file is a program.","keyPoints":["Program under execution","Program counter","Execution state"]},
        {"id":"process-pcb","title":"Process Control Block","learn":"Each process is represented by a Process Control Block (PCB). It stores information the OS needs to manage the process.","example":"The OS can use process information from the PCB when switching between processes.","keyPoints":["PCB represents a process","Used by OS process management","Supports process switching"]},
        {"id":"process-states","title":"Process States","learn":"Processes move through execution-related states as they are admitted, scheduled, blocked and completed.","example":"A process waiting for I/O is not executing on the CPU while it waits for the required event.","keyPoints":["Ready","Running","Waiting/Blocked","Terminated"]},
        {"id":"process-management-goals","title":"Process Management Responsibilities","learn":"OS process management coordinates processes, CPU use, state changes and resources so programs can execute correctly.","example":"The OS selects a ready process for CPU execution and later handles its state transition when it waits for I/O.","keyPoints":["Process coordination","CPU allocation","State management","Resource use"]}
      ]
    },
    {
      "id": "cpu-scheduling",
      "number": 3,
      "title": "CPU Scheduling",
      "summary": "Scheduling purpose, goals, preemptive and non-preemptive scheduling and common algorithms.",
      "topics": [
        {"id":"cpu-scheduling-purpose","title":"What is CPU Scheduling?","learn":"CPU scheduling is the process used by the OS to decide which process in the ready queue should be executed next by the CPU.","example":"If several processes are ready, the scheduler selects one according to the scheduling policy.","keyPoints":["Ready queue","Scheduler","CPU selection"]},
        {"id":"scheduling-goals","title":"Goals of CPU Scheduling","learn":"The notes identify goals such as maximizing CPU utilization and throughput, minimizing turnaround, waiting and response time, and maintaining fairness.","example":"A good scheduler should keep the CPU busy while avoiding unnecessary starvation.","keyPoints":["CPU utilization","Throughput","Turnaround time","Waiting time","Response time","Fairness"]},
        {"id":"preemptive-nonpreemptive","title":"Preemptive vs Non-Preemptive","learn":"In non-preemptive scheduling, a process keeps the CPU until completion or an I/O wait. In preemptive scheduling, the CPU can be taken from a running process.","example":"A short task arriving while a long task is running may cause a preemptive scheduler to switch to the short task.","keyPoints":["Non-preemptive","Preemptive","Context switching","Responsiveness"]},
        {"id":"fcfs-scheduling","title":"FCFS Scheduling","learn":"First Come First Serve schedules processes in their arrival order.","example":"If P1 arrives before P2 and P3, P1 is considered before P2 and P3.","keyPoints":["Arrival order","Simple","Can increase waiting time"]},
        {"id":"sjf-scheduling","title":"SJF and SRTF","learn":"Shortest Job First selects a process with the shortest expected CPU burst. The preemptive form is commonly called Shortest Remaining Time First.","example":"Between jobs with burst times 4 and 10, SJF selects the 4-unit job first when both are available.","keyPoints":["Shortest burst","SJF","SRTF","Waiting-time trade-offs"]},
        {"id":"round-robin","title":"Round Robin","learn":"Round Robin gives ready processes CPU time in turns using a time quantum.","example":"With a quantum of 2 units, processes take turns and the running process may be preempted when its quantum expires.","keyPoints":["Time quantum","Fair sharing","Preemptive","Interactive systems"]}
      ]
    },
    {
      "id": "process-synchronization",
      "number": 4,
      "title": "Process Synchronization",
      "summary": "Critical section, race condition, synchronization requirements, semaphores, mutexes, spinlocks, monitors and classic problems.",
      "topics": [
        {"id":"race-condition","title":"Race Condition","learn":"A race condition occurs when concurrent access to shared data can produce unpredictable results depending on execution timing.","example":"Two processes incrementing the same shared counter without synchronization can produce an incorrect final value.","keyPoints":["Shared data","Concurrency","Timing-dependent result"]},
        {"id":"critical-section","title":"Critical Section Problem","learn":"The critical section is the part of a process where shared resources are accessed. A correct solution addresses mutual exclusion, progress and bounded waiting.","example":"Only one process should enter a critical section that modifies a non-shareable shared variable at a time.","keyPoints":["Mutual exclusion","Progress","Bounded waiting"]},
        {"id":"semaphores","title":"Semaphores","learn":"A semaphore is a synchronization mechanism. Binary semaphores use two values, while counting semaphores can represent multiple available instances of a resource.","example":"A counting semaphore can represent the number of free slots in a buffer.","keyPoints":["Binary semaphore","Counting semaphore","Synchronization"]},
        {"id":"mutex-spin-monitor","title":"Mutex, Spinlock and Monitor","learn":"A mutex provides exclusive access, a spinlock is useful when a lock is expected to be held briefly, and a monitor is a higher-level synchronization construct providing mutual exclusion and condition synchronization.","example":"A mutex can protect one shared data structure so only one thread updates it at a time.","keyPoints":["Exclusive access","Short waits for spinlocks","High-level monitor"]},
        {"id":"producer-consumer","title":"Producer-Consumer Problem","learn":"The producer-consumer problem studies coordination around a shared buffer. The source notes describe the shared buffer as a way to pass data between processes using shared memory.","example":"A producer adds data to a bounded buffer while a consumer removes data, requiring synchronization.","keyPoints":["Shared buffer","Synchronization","Producer","Consumer"]}
      ]
    },
    {
      "id": "deadlock",
      "number": 5,
      "title": "Deadlock",
      "summary": "Deadlock conditions, resource allocation graphs, prevention, avoidance, detection and recovery.",
      "topics": [
        {"id":"deadlock-definition","title":"What is Deadlock?","learn":"A deadlock occurs when a set of processes are unable to proceed because each is waiting for resources or events that cannot become available under the current allocation.","example":"If P1 holds R1 and waits for R2 while P2 holds R2 and waits for R1, neither may proceed.","keyPoints":["Waiting processes","Resource dependency","No progress"]},
        {"id":"four-conditions","title":"Four Necessary Conditions","learn":"The notes describe mutual exclusion, hold and wait, no preemption and circular wait as the four necessary conditions for deadlock.","example":"Removing one necessary condition can prevent the deadlock scenario.","keyPoints":["Mutual exclusion","Hold and wait","No preemption","Circular wait"]},
        {"id":"rag","title":"Resource Allocation Graph","learn":"A resource allocation graph models processes and resources using directed request and assignment edges. Request edge P→R means a process requests a resource; assignment edge R→P means the resource is allocated to a process.","example":"A graph can make circular dependencies visible in a deadlock analysis.","keyPoints":["Process nodes","Resource nodes","Request edge","Assignment edge"]},
        {"id":"deadlock-prevention","title":"Deadlock Prevention","learn":"Prevention ensures at least one necessary condition never occurs. The notes give approaches such as eliminating hold-and-wait, allowing preemption where possible and imposing a resource order.","example":"Requiring processes to request all resources at once can eliminate hold-and-wait.","keyPoints":["Break a necessary condition","Lower utilization trade-off","Resource ordering"]},
        {"id":"deadlock-avoidance","title":"Deadlock Avoidance","learn":"Avoidance dynamically checks whether granting a request keeps the system in a safe state. The notes discuss the Banker's Algorithm for multiple resource instances.","example":"A request is granted only when the resulting allocation remains safe.","keyPoints":["Safe state","Dynamic check","Banker's Algorithm"]},
        {"id":"deadlock-detection-recovery","title":"Detection and Recovery","learn":"Another strategy is to allow deadlocks, detect them periodically and then recover, for example by terminating processes or preempting resources and rolling back.","example":"After detecting a deadlock, the OS may terminate one of the involved processes to release resources.","keyPoints":["Detection","Termination","Preemption","Rollback"]}
      ]
    },
    {
      "id": "ipc",
      "number": 6,
      "title": "Inter-process Communication",
      "summary": "IPC use cases, message passing and shared memory.",
      "topics": [
        {"id":"ipc-purpose","title":"Purpose of IPC","learn":"IPC is used when two or more processes need to exchange data or coordinate, either on the same computer or across computers.","example":"A client process sends a request to a server process and receives a response.","keyPoints":["Data exchange","Coordination","Same or different computers"]},
        {"id":"message-passing","title":"Message Passing","learn":"Processes communicate by sending and receiving structured messages without sharing the same memory region.","example":"A client sends a request message and a server responds with another message.","keyPoints":["Send/receive","No shared memory","Works across machines"]},
        {"id":"shared-memory","title":"Shared Memory","learn":"Processes share a memory region where they can read and write data. The notes emphasize that shared memory is fast but requires synchronization.","example":"Two processes can use a shared buffer for high-speed data exchange while synchronization prevents conflicting updates.","keyPoints":["Shared region","Fast","Synchronization required"]},
        {"id":"ipc-use-cases","title":"IPC Use Cases","learn":"The notes list client-server communication, component-based applications, parallel processing, data synchronization and transaction systems as IPC use cases.","example":"Independent services coordinating a transaction may use IPC to exchange intermediate results or status.","keyPoints":["Client-server","Parallel processing","Synchronization","Transactions"]}
      ]
    },
    {
      "id": "memory-management",
      "number": 7,
      "title": "Memory Management",
      "summary": "Contiguous allocation, fixed and variable partitioning, fragmentation and memory management concepts.",
      "topics": [
        {"id":"memory-purpose","title":"Memory Management","learn":"OS memory management controls allocation and use of main memory among processes.","example":"When a new process starts, the OS determines where its required memory can be placed.","keyPoints":["Allocation","Process memory","Utilization"]},
        {"id":"fixed-partitioning","title":"Fixed Partitioning","learn":"Memory is divided into fixed-size partitions at startup, with a partition holding one process.","example":"If a process needs less memory than its assigned partition, unused space inside that partition is wasted.","keyPoints":["Fixed-size partitions","Simple","Internal fragmentation"]},
        {"id":"variable-partitioning","title":"Variable Partitioning","learn":"Memory partitions are created dynamically according to incoming process sizes.","example":"A process can receive a block closer to its actual size, but free memory may become scattered.","keyPoints":["Dynamic partitions","Better utilization","External fragmentation"]},
        {"id":"fragmentation","title":"Internal and External Fragmentation","learn":"Internal fragmentation is wasted space inside allocated blocks. External fragmentation is free space scattered between allocated blocks.","example":"A process receiving 8 KB but using only 6 KB leaves 2 KB of internal waste.","keyPoints":["Internal","External","Compaction","Paging can reduce external fragmentation"]},
        {"id":"paging","title":"Paging","learn":"Paging divides memory into fixed-size units so a process need not occupy one continuous block. The source notes identify paging as a solution associated with fragmentation handling.","example":"Different pages of a process can be placed into available frames rather than requiring one continuous memory region.","keyPoints":["Pages","Frames","Non-contiguous allocation"]}
      ]
    },
    {
      "id": "file-systems",
      "number": 8,
      "title": "File Systems",
      "summary": "File organization, free-space management, mounting and Unix File System concepts.",
      "topics": [
        {"id":"file-system-purpose","title":"File System","learn":"A file system organizes files and directories and manages how stored data is accessed and maintained.","example":"A hierarchical directory structure lets users organize project files into folders.","keyPoints":["Files","Directories","Organization","Access"]},
        {"id":"free-space-management","title":"Free Space Management","learn":"The notes describe bitmaps, free lists, grouping and counting as free-space management techniques.","example":"A bitmap can use one bit per disk block to indicate whether a block is free or allocated.","keyPoints":["Bitmap","Free list","Grouping","Counting"]},
        {"id":"file-system-mounting","title":"File System Mounting","learn":"Mounting makes a file system accessible to the OS at a mount point. The notes describe verification of the file system type and updating the mount table.","example":"A USB drive can be mounted under a directory such as /media/usb.","keyPoints":["Mount point","Verification","Mount table"]},
        {"id":"ufs","title":"Unix File System","learn":"The source notes describe UFS as a foundational UNIX file system with a boot block, superblock, inode table and data blocks.","example":"An inode stores metadata such as permissions and file size, while data blocks hold file contents.","keyPoints":["Boot block","Superblock","Inode table","Data blocks","Permissions"]}
      ]
    },
    {
      "id": "disk-management",
      "number": 9,
      "title": "Disk Management",
      "summary": "Disk management concepts and disk scheduling for efficient I/O service.",
      "topics": [
        {"id":"disk-management","title":"Disk Management","learn":"Disk management concerns how the operating system organizes and services storage devices and disk I/O requests.","example":"The OS can order pending disk requests to reduce unnecessary head movement.","keyPoints":["Storage devices","I/O requests","Performance"]},
        {"id":"disk-scheduling-purpose","title":"Purpose of Disk Scheduling","learn":"Disk scheduling chooses the order in which pending disk requests are serviced, aiming to improve performance and reduce unnecessary movement.","example":"Reordering nearby cylinder requests can reduce total head movement.","keyPoints":["Request order","Seek movement","Service efficiency"]},
        {"id":"fcfs-disk","title":"FCFS Disk Scheduling","learn":"FCFS services disk requests in the order in which they arrive.","example":"Requests 40, 10 and 70 are serviced in that same order under FCFS.","keyPoints":["Arrival order","Simple","May cause extra movement"]},
        {"id":"sstf-disk","title":"SSTF Disk Scheduling","learn":"Shortest Seek Time First selects the pending request that is closest to the current head position.","example":"If the head is at 50 and pending requests are 45 and 90, SSTF selects 45 first because it is closer.","keyPoints":["Nearest request","Lower immediate seek","Possible starvation"]},
        {"id":"scan-cscan","title":"SCAN and C-SCAN","learn":"SCAN services requests while moving in one direction and then reverses. C-SCAN services in one direction and returns to the beginning to continue the cycle.","example":"A disk head moving toward higher cylinders can service requests along that direction before reversing under SCAN.","keyPoints":["Elevator idea","SCAN reversal","C-SCAN circular service"]}
      ]
    }
  ]
}
'@

Set-Content -Path "$root/data/os-curriculum.json" -Value $curriculum -Encoding UTF8

$html = @'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Operating Systems | CareerPilot AI</title>
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/os.css">
</head>
<body>
<nav class="os-nav">
  <div><strong>CareerPilot AI</strong><span> / Operating Systems</span></div>
  <div class="os-nav-actions"><a href="dashboard.html">Dashboard</a><button id="logoutBtn">Logout</button></div>
</nav>
<main class="os-shell">
  <section class="os-hero">
    <div><span class="eyebrow">TECHNICAL PREPARATION</span><h1>Operating Systems</h1><p>Learn OS concepts chapter-by-chapter, complete self-checks, and pass assessments to unlock the next chapter.</p></div>
    <div class="course-stat"><strong id="courseProgress">0%</strong><span>Course Complete</span></div>
  </section>
  <section class="os-layout">
    <aside class="chapter-panel"><h2>Chapters</h2><div id="chapterList"></div></aside>
    <section class="lesson-panel">
      <div id="chapterHeader"></div>
      <div id="topicList"></div>
      <article id="topicContent" class="topic-content"></article>
    </section>
  </section>
</main>
<script type="module" src="../js/technical/os.js"></script>
</body>
</html>
'@
Set-Content -Path "$root/pages/os.html" -Value $html -Encoding UTF8

$css = @'
body{margin:0;background:#f7f8fc;color:#172033;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif}.os-nav{height:70px;background:#fff;border-bottom:1px solid #e7e9f2;display:flex;align-items:center;justify-content:space-between;padding:0 28px;box-sizing:border-box;position:sticky;top:0;z-index:10}.os-nav strong{font-size:20px}.os-nav span{color:#7a8192}.os-nav-actions{display:flex;gap:14px;align-items:center}.os-nav a{color:#5c4fd6;text-decoration:none;font-weight:700}.os-nav button{border:0;background:#f0efff;color:#5548ce;border-radius:10px;padding:10px 15px;font-weight:700;cursor:pointer}.os-shell{max-width:1250px;margin:auto;padding:32px 22px 60px}.os-hero{display:flex;justify-content:space-between;gap:20px;background:linear-gradient(135deg,#635bff,#8d7bff);color:#fff;border-radius:24px;padding:30px;margin-bottom:24px;box-shadow:0 16px 45px rgba(74,63,190,.2)}.eyebrow{font-size:11px;font-weight:800;letter-spacing:1.4px;opacity:.85}.os-hero h1{font-size:38px;margin:8px 0}.os-hero p{max-width:720px;line-height:1.6;margin:0;opacity:.93}.course-stat{min-width:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.25);border-radius:18px}.course-stat strong{font-size:36px}.course-stat span{opacity:.9}.os-layout{display:grid;grid-template-columns:290px 1fr;gap:22px}.chapter-panel,.lesson-panel{background:#fff;border:1px solid #e8eaf2;border-radius:22px}.chapter-panel{padding:20px;height:max-content;position:sticky;top:92px}.chapter-panel h2{font-size:18px;margin:0 0 15px}.chapter-btn{display:block;width:100%;text-align:left;border:1px solid #e8eaf2;background:#fff;border-radius:13px;padding:13px;margin:8px 0;cursor:pointer}.chapter-btn.active{border-color:#7266ff;background:#f2f0ff}.chapter-btn.locked{opacity:.55;cursor:not-allowed}.chapter-num{font-size:11px;color:#7569e8;font-weight:800}.chapter-title{font-weight:750;margin-top:3px}.chapter-status{font-size:12px;color:#7a8192;margin-top:5px}.lesson-panel{padding:26px}.chapter-header h2{margin:4px 0}.chapter-header p{color:#72798c;line-height:1.6}.topic-list{display:flex;flex-wrap:wrap;gap:9px;margin:20px 0}.topic-btn{border:1px solid #e6e8f0;background:#fff;border-radius:999px;padding:9px 13px;cursor:pointer}.topic-btn.active{background:#eeeaff;border-color:#7569e8;color:#5346ce}.topic-btn.locked{opacity:.45;cursor:not-allowed}.topic-content{border-top:1px solid #edf0f5;padding-top:24px}.topic-content h3{font-size:26px;margin-top:0}.topic-content h4{margin-bottom:8px}.topic-content p,.topic-content li{line-height:1.7;color:#454d61}.self-check{width:100%;min-height:130px;border:1px solid #dddfea;border-radius:14px;padding:13px;box-sizing:border-box;resize:vertical}.complete-btn,.assessment-btn{border:0;border-radius:12px;padding:12px 17px;font-weight:800;cursor:pointer;margin-top:12px}.complete-btn{background:#6559ee;color:#fff}.assessment-btn{background:#e9e7ff;color:#5548d0}.assessment-btn:disabled{opacity:.45;cursor:not-allowed}.done{color:#18855b;font-weight:800}.mini-note{padding:12px 14px;background:#f8f8fd;border-radius:12px;color:#61697c;font-size:13px}@media(max-width:900px){.os-layout{grid-template-columns:1fr}.chapter-panel{position:static}.os-hero{flex-direction:column}.course-stat{padding:18px}.os-nav{padding:0 15px}}
'@
Set-Content -Path "$root/css/os.css" -Value $css -Encoding UTF8

$js = @'
import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const chapterList=document.getElementById("chapterList"),chapterHeader=document.getElementById("chapterHeader"),topicList=document.getElementById("topicList"),topicContent=document.getElementById("topicContent"),courseProgress=document.getElementById("courseProgress"),logoutBtn=document.getElementById("logoutBtn");
let curriculum=null,user=null,progress={completedTopics:{},selfChecks:{},completedChapters:{},assessments:{}};let currentChapter=0,currentTopic=0;
const key=(c,t)=>`${c}__${t}`;
async function load(){const r=await fetch("../data/os-curriculum.json");curriculum=await r.json();const snap=await getDoc(doc(db,"users",user.uid));if(snap.exists()&&snap.data().osProgress)progress={...progress,...snap.data().osProgress};render();}
function chapterUnlocked(i){return i===0||!!progress.completedChapters[curriculum.chapters[i-1].id]}
function topicUnlocked(c,t){return t===0||!!progress.completedTopics[key(curriculum.chapters[c].id,curriculum.chapters[c].topics[t-1].id)]}
function render(){renderChapters();openChapter(currentChapter);updateProgress();}
function renderChapters(){chapterList.innerHTML="";curriculum.chapters.forEach((c,i)=>{const b=document.createElement("button");b.className=`chapter-btn ${i===currentChapter?"active":""} ${chapterUnlocked(i)?"":"locked"}`;b.disabled=!chapterUnlocked(i);b.innerHTML=`<div class="chapter-num">CHAPTER ${c.number}</div><div class="chapter-title">${c.title}</div><div class="chapter-status">${progress.completedChapters[c.id]?"✓ Completed":chapterUnlocked(i)?"Unlocked":"Locked"}</div>`;b.onclick=()=>{currentChapter=i;currentTopic=0;render()};chapterList.appendChild(b)})}
function openChapter(i){const c=curriculum.chapters[i];chapterHeader.className="chapter-header";chapterHeader.innerHTML=`<div class="mini-note">Chapter ${c.number}</div><h2>${c.title}</h2><p>${c.summary}</p>`;topicList.className="topic-list";topicList.innerHTML="";c.topics.forEach((t,j)=>{const b=document.createElement("button");b.className=`topic-btn ${j===currentTopic?"active":""} ${topicUnlocked(i,j)?"":"locked"}`;b.disabled=!topicUnlocked(i,j);b.textContent=`${j+1}. ${t.title}`;b.onclick=()=>{currentTopic=j;openChapter(i)};topicList.appendChild(b)});const t=c.topics[currentTopic];renderTopic(c,t)}
function renderTopic(c,t){const done=!!progress.completedTopics[key(c.id,t.id)];const check=progress.selfChecks[key(c.id,t.id)]||"";const allTopicsDone=c.topics.every(x=>progress.completedTopics[key(c.id,x.id)]);const chapterDone=!!progress.completedChapters[c.id];topicContent.innerHTML=`<h3>${t.title}</h3><h4>Learn</h4><p>${t.learn}</p><h4>Example</h4><p>${t.example}</p><h4>Key Points</h4><ul>${t.keyPoints.map(x=>`<li>${x}</li>`).join("")}</ul><h4>Self Check</h4><p>Explain this topic in your own words. Write at least 40 characters.</p><textarea id="selfCheck" class="self-check" placeholder="Write what you understood..."></textarea><div><button id="completeTopic" class="complete-btn">${done?"✓ Topic Completed":"Complete Topic"}</button><button id="assessmentBtn" class="assessment-btn" ${allTopicsDone&&!chapterDone?"":"disabled"}>Chapter Assessment</button></div>${chapterDone?'<p class="done">✓ Chapter completed</p>':allTopicsDone?'<p class="mini-note">All topics completed. Take the chapter assessment.</p>':'<p class="mini-note">Complete every topic before starting the assessment.</p>'}`;document.getElementById("selfCheck").value=check;document.getElementById("completeTopic").onclick=()=>completeTopic(c,t);document.getElementById("assessmentBtn").onclick=()=>location.href=`os-assessment.html?chapter=${c.id}`}
async function completeTopic(c,t){const ta=document.getElementById("selfCheck"),text=ta.value.trim();if(text.length<40){alert("Write at least 40 characters in Self Check before completing the topic.");return}progress.selfChecks[key(c.id,t.id)]=text;progress.completedTopics[key(c.id,t.id)]=true;if(c.topics.every(x=>progress.completedTopics[key(c.id,x.id)])){ }await setDoc(doc(db,"users",user.uid),{osProgress:progress},{merge:true});const next=c.topics.findIndex(x=>!progress.completedTopics[key(c.id,x.id)]);if(next!==-1)currentTopic=next;render()}
function updateProgress(){if(!curriculum)return;const total=curriculum.chapters.reduce((a,c)=>a+c.topics.length,0);const done=Object.keys(progress.completedTopics).length;courseProgress.textContent=`${Math.round(done/total*100)}%`}
logoutBtn.onclick=async()=>{await signOut(auth);location.href="login.html"};
onAuthStateChanged(auth,u=>{if(!u){location.href="login.html";return}user=u;load()});
'@
Set-Content -Path "$root/js/technical/os.js" -Value $js -Encoding UTF8

$assessmentHtml = @'
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>OS Assessment | CareerPilot AI</title><link rel="stylesheet" href="../css/style.css"><link rel="stylesheet" href="../css/os-assessment.css"></head><body><main class="assessment-shell"><a href="os.html">← Back to OS</a><div id="assessment"></div></main><script type="module" src="../js/technical/os-assessment.js"></script></body></html>
'@
Set-Content -Path "$root/pages/os-assessment.html" -Value $assessmentHtml -Encoding UTF8

$assessmentCss = @'
body{margin:0;background:#f7f8fc;color:#172033;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif}.assessment-shell{max-width:950px;margin:auto;padding:35px 20px 60px}.assessment-shell>a{color:#5c4fd6;text-decoration:none;font-weight:700}.assessment-card,.result{margin-top:22px;background:#fff;border:1px solid #e8eaf2;border-radius:22px;padding:26px;box-shadow:0 12px 35px rgba(35,30,80,.07)}.q{padding:20px 0;border-top:1px solid #edf0f5}.q:first-child{border-top:0}.q h3{line-height:1.5}.opt{display:block;padding:11px 13px;border:1px solid #e5e8f0;border-radius:12px;margin:8px 0;cursor:pointer}.opt:hover{background:#f7f5ff}.submit,.retry{border:0;border-radius:12px;padding:13px 18px;font-weight:800;background:#6659ee;color:#fff;cursor:pointer}.score{font-size:44px;font-weight:900;color:#6659ee}.pass{color:#168357;font-weight:800}.fail{color:#b84a4a;font-weight:800}
'@
Set-Content -Path "$root/css/os-assessment.css" -Value $assessmentCss -Encoding UTF8

$assessmentJs = @'
import { auth, db } from "../firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc,getDoc,setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const chapterId=new URLSearchParams(location.search).get("chapter")||"os-introduction";let curriculum,user;const box=document.getElementById("assessment");
const questions={
"os-introduction":[["The kernel is best described as:",["A web server","The core part of the OS that interacts with hardware","A database","A text editor"],1],["Which OS type groups jobs for execution without direct user interaction?",["Batch","Real-time","Distributed","Interactive only"],0],["Kernel mode is:",["Restricted","Privileged","Only for browsers","Only for storage"],1],["A real-time OS is designed to respond within:",["Deadlines","Unlimited delays","Only at startup","Only after shutdown"],0]],
"process-management":[["A process is:",["A program under execution","A file extension","A directory","A CPU register"],0],["PCB stands for:",["Process Control Block","Program Cache Buffer","Process Command Bus","Primary Control Block"],0],["A process waiting for I/O is generally:",["Running","Blocked/Waiting","Terminated","New only"],1],["The program counter indicates:",["Next instruction address","Disk size","File permissions","RAM capacity"],0]],
"cpu-scheduling":[["CPU scheduling selects:",["The next ready process for CPU","The next file to delete","A disk format","A network cable"],0],["Which scheduling type can take CPU away from a running process?",["Preemptive","Non-preemptive","Batch only","Static only"],0],["Round Robin uses:",["Time quantum","Only priorities","No context switches","File blocks"],0],["FCFS schedules according to:",["Arrival order","Shortest job only","Highest memory only","Random order"],0]],
"process-synchronization":[["A race condition depends on:",["Execution timing","Screen size","Disk label","File extension"],0],["The critical section accesses:",["Shared resources","Only private constants","Only the keyboard","Only boot files"],0],["A binary semaphore normally uses:",["0 and 1","1 and 2","Any string","Only -1"],0],["A mutex provides:",["Exclusive access","Disk formatting","CPU compilation","File compression"],0]],
"deadlock":[["Which is a necessary deadlock condition?",["Circular wait","Compilation","Caching","Indexing"],0],["A request edge in a resource allocation graph is:",["P → R","R → P","P → P","R → R"],0],["Banker's Algorithm is associated with:",["Deadlock avoidance","File mounting","Disk formatting","CPU compilation"],0],["Deadlock recovery can involve:",["Terminating processes","Creating CSS","Renaming files","Removing the kernel"],0]],
"ipc":[["IPC is used for:",["Process communication and coordination","Only CPU cooling","Only formatting","Only passwords"],0],["Message passing communicates using:",["Messages","Shared disk geometry","Only registers","Only caches"],0],["Shared memory is generally:",["Fast but needs synchronization","Always slower","Only for kernels","Not usable by processes"],0],["Client-server communication can use:",["IPC","Only BIOS","Only CSS","Only HTML"],0]],
"memory-management":[["Internal fragmentation is wasted space:",["Inside allocated blocks","Only between disks","Only in CPU","Only in files"],0],["External fragmentation is:",["Scattered free space","Unused CPU","A deadlock condition","A file permission"],0],["Fixed partitioning uses:",["Fixed-size partitions","Only variable files","Only virtual disks","Only CPU registers"],0],["Variable partitioning can cause:",["External fragmentation","No memory usage","No process execution","No scheduling"],0]],
"file-systems":[["A bitmap can represent:",["Free/allocated disk blocks","Only CPU state","Only network routes","Only passwords"],0],["Mounting makes a file system:",["Accessible to the OS","Invisible","Encrypted automatically","A CPU process"],0],["The UFS notes list which structure for file metadata?",["Inode table","CPU queue","Router table","PCB only"],0],["A superblock contains:",["File-system metadata","Only file contents","Only CPU instructions","Only keyboard input"],0]],
"disk-management":[["Disk scheduling chooses:",["The order of servicing disk requests","Which user logs in","Which file is compiled","Which OS boots"],0],["SSTF selects:",["The closest pending request","The oldest request only","The largest file","A random request"],0],["SCAN is often compared to:",["An elevator","A compiler","A database index","A semaphore"],0],["FCFS disk scheduling uses:",["Arrival order","Shortest seek only","Highest priority only","Random order"],0]]};
onAuthStateChanged(auth,async u=>{if(!u){location.href="login.html";return}user=u;const r=await fetch("../data/os-curriculum.json");curriculum=await r.json();render()});
function render(){const c=curriculum.chapters.find(x=>x.id===chapterId);const qs=questions[chapterId]||[];box.innerHTML=`<div class="assessment-card"><h1>Chapter ${c.number}: ${c.title}</h1><p>${c.summary}</p>${qs.map((q,i)=>`<div class="q"><h3>${i+1}. ${q[0]}</h3>${q[1].map((o,j)=>`<label class="opt"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}</div>`).join("")}<button class="submit" id="submit">Submit Assessment</button></div>`;document.getElementById("submit").onclick=submit}
async function submit(){const qs=questions[chapterId],c=curriculum.chapters.find(x=>x.id===chapterId);let score=0,missing=0;qs.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(!a)missing++;else if(+a.value===q[2])score++});if(missing){alert(`Answer all questions. Unanswered: ${missing}`);return}const pct=Math.round(score/qs.length*100),passed=pct>=75;const snap=await getDoc(doc(db,"users",user.uid));const d=snap.exists()?snap.data():{},p={...(d.osProgress||{})};p.assessments=p.assessments||{};p.completedChapters=p.completedChapters||{};p.assessments[chapterId]={score:pct,correct:score,total:qs.length,passed,completedAt:new Date().toISOString()};if(passed)p.completedChapters[chapterId]=true;await setDoc(doc(db,"users",user.uid),{osProgress:p},{merge:true});box.innerHTML=`<div class="result"><h1>${passed?"🎉 Chapter Passed":"📚 Keep Practicing"}</h1><div class="score">${pct}%</div><p>${score} / ${qs.length} correct.</p><p class="${passed?"pass":"fail"}">${passed?"Chapter completed. Next chapter unlocked.":"You need at least 75% to pass."}</p><button class="retry" onclick="location.reload()">Retry</button> <a href="os.html">Back to OS</a></div>`}
'@
Set-Content -Path "$root/js/technical/os-assessment.js" -Value $assessmentJs -Encoding UTF8

Write-Host "OS module built successfully from the PDF-aligned chapter structure." -ForegroundColor Green
Write-Host "Created: data/os-curriculum.json, pages/os.html, pages/os-assessment.html, css/os.css, css/os-assessment.css, js/technical/os.js, js/technical/os-assessment.js" -ForegroundColor Cyan
