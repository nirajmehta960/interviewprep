import type { ConceptualQuestion } from "../conceptual";

export const osQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     1. OS Fundamentals & Architecture
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "what-is-os-dual-mode-execution",
    title: "What is an Operating System and how does Dual-Mode Execution work?",
    difficulty: "EASY",
    subtopic: "OS Fundamentals",
    synopsis: "Resource manager executing in User Mode (restricted) vs Kernel Mode (privileged).",
    shortAnswer:
      "An Operating System (OS) is system software that manages computer hardware, memory, execution processes, and file storage. Dual-Mode Execution protects the system by separating CPU execution into User Mode (restricted mode for user applications) and Kernel Mode (privileged mode for OS kernel with full hardware access). Mode switches occur via traps or system calls.",
    detailedExplanation: [
      "**User Mode (Mode Bit = 1):** User applications execute with restricted hardware access. Attempting privileged CPU instructions (e.g. direct disk I/O or memory mapping) triggers a hardware trap exception.",
      "**Kernel Mode (Mode Bit = 0):** Kernel executes with unrestricted access to physical memory, CPU control registers, and I/O devices.",
      "**Mode Switch Mechanism:** A user program executes a software interrupt/trap (`syscall`), transitioning CPU mode bit from 1 to 0, jumping to a pre-defined kernel interrupt vector table handler.",
    ],
    example: {
      language: "JAVA",
      code: `// C System Call Mode Switch Execution Flow
// User Space: calling write() system call
// Assembly: INT 0x80 or SYSCALL instruction -> CPU Mode Bit changes 1 -> 0
// Kernel Space: sys_write() handler executes -> CPU Mode Bit restores 0 -> 1`,
    },
    interviewTip:
      "Explain why dual-mode execution is necessary: Without mode switching, a buggy or malicious user program could execute HALT or overwrite operating system kernel memory directly.",
    commonTrap:
      "Confusing a User/Kernel Mode switch with a Process Context switch. A mode switch stays within the same process context and is much faster than a full process context switch.",
    followUpQuestions: [
      "What is the difference between a trap and a hardware interrupt?",
      "How does CPU hardware enforce mode bit protection?",
    ],
    relatedTopics: ["Operating Systems", "Kernel", "System Calls"],
    tags: ["OS", "Architecture", "Kernel"],
  },
  {
    topicSlug: "operating-systems",
    slug: "microkernel-vs-monolithic-kernel",
    title: "What is the difference between a Microkernel and a Monolithic Kernel?",
    difficulty: "MEDIUM",
    subtopic: "OS Fundamentals",
    synopsis: "Large all-in-one kernel space (Monolithic) vs minimal IPC-based modular kernel (Microkernel).",
    shortAnswer:
      "A Monolithic Kernel executes all core OS services (file system, IPC, device drivers, virtual memory, process scheduling) inside a single large kernel space address space (Linux, Unix). A Microkernel keeps only absolute minimal services in kernel space (IPC, basic memory, scheduling), running drivers and file systems as user-space servers (L4, QNX, Mach).",
    detailedExplanation: [
      "**Monolithic Kernel (Linux, Windows NT):**",
      "- Pros: Extremely fast execution (direct in-memory function calls between OS modules, zero IPC overhead).",
      "- Cons: Poor crash isolation; a crash in a 3rd-party GPU device driver crashes the entire operating system (Kernel Panic / BSOD).",
      "**Microkernel (qnx, L4, macOS Mach hybrid):**",
      "- Pros: High crash resilience and modular security; if a device driver crashes, its user-space process restarts without downing the kernel.",
      "- Cons: Slower performance due to frequent context switching and Message Passing IPC overhead across user-kernel boundaries.",
    ],
    example: {
      language: "JAVA",
      code: `// Monolithic: File System read is direct kernel function call: vfs_read()
// Microkernel: File System read requires IPC message pass: User App -> Microkernel -> FS Server -> Microkernel -> User App`,
    },
    interviewTip:
      "Mention that modern operating systems like macOS and Windows NT are Hybrid Kernels: combining monolithic speed for performance-critical subsystems with microkernel modularity.",
    commonTrap:
      "Assuming Linux is a microkernel because of Loadable Kernel Modules (LKMs). LKMs dynamically load into the SAME monolithic kernel space at runtime.",
    followUpQuestions: [
      "What are Loadable Kernel Modules (LKMs) in Linux?",
      "Why are Microkernels popular in mission-critical automotive software (QNX)?",
    ],
    relatedTopics: ["Kernel", "Linux", "OS Architecture"],
    tags: ["OS", "Kernel", "Architecture"],
  },
  {
    topicSlug: "operating-systems",
    slug: "system-calls-interrupts-traps-signals",
    title: "What are System Calls, Interrupts, Traps, and Signals?",
    difficulty: "EASY",
    subtopic: "OS Fundamentals",
    synopsis: "OS API requests (Syscalls), hardware signals (Interrupts), software errors (Traps), and async notifications (Signals).",
    shortAnswer:
      "System Calls are programmatic requests from user programs for OS kernel services (`fork`, `read`, `write`). Interrupts are asynchronous hardware signals sent to the CPU by devices (keyboard, NIC). Traps (Exceptions) are synchronous software events triggered by CPU instructions (divide-by-zero, page fault). Signals are asynchronous OS notifications sent to processes (`SIGINT`, `SIGKILL`).",
    detailedExplanation: [
      "**System Call:** Interface between process and kernel. Invoked via `syscall` instruction.",
      "**Hardware Interrupt:** Asynchronous event generated by external hardware controllers. CPU pauses current instruction stream and jumps to Interrupt Service Routine (ISR).",
      "**Trap / Exception:** Synchronous event produced by invalid CPU operation (Page Fault, Segment Violation, Divide by Zero).",
      "**Signal:** Process-level software notification handled via registered signal handlers (`signal(SIGINT, handler)`).",
    ],
    example: {
      language: "JAVA",
      code: `// C Signal Handler Code Example
#include <stdio.h>
#include <signal.h>

void handle_sigint(int sig) {
    printf("Caught SIGINT (Ctrl+C)! Graceful shutdown initiated.\\n");
}

int main() {
    signal(SIGINT, handle_sigint); // Catching process signal
    while(1);
}`,
    },
    interviewTip:
      "Distinguish synchronous vs asynchronous: Traps and System Calls are Synchronous (predictable at CPU instruction execution); Hardware Interrupts and Signals are Asynchronous.",
    commonTrap:
      "Confusing SIGKILL (9) with SIGTERM (15). SIGTERM can be caught and handled for graceful shutdown; SIGKILL cannot be caught or ignored and terminates process immediately.",
    followUpQuestions: [
      "What is the difference between SIGKILL and SIGTERM?",
      "How does the Interrupt Vector Table (IVT) work?",
    ],
    relatedTopics: ["System Calls", "Interrupts", "Signals"],
    tags: ["OS", "Architecture", "POSIX"],
  },

  /* ==========================================================================
     2. Process Management & CPU Scheduling
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "process-vs-thread",
    title: "What is the difference between a Process and a Thread?",
    difficulty: "EASY",
    subtopic: "Process Management",
    synopsis: "Isolated memory space vs shared execution thread inside a process.",
    shortAnswer:
      "A Process is an independent executing program instance with its own isolated virtual memory space (code, data, heap, file descriptors). A Thread is an execution unit within a process that shares the parent process's heap and memory space, but maintains its own stack, register state, and program counter.",
    detailedExplanation: [
      "**Memory Isolation:** Processes are isolated from each other by virtual memory hardware (MMU). One process crashing does not affect others. Threads share process memory, so a memory error in one thread can crash the entire process.",
      "**Creation & Context Switch Overhead:** Spawning a process requires OS allocation of new virtual page tables (high overhead). Context switching between processes involves flushing TLB caches. Thread context switching is significantly faster since address spaces stay unchanged.",
      "**Inter-Process Communication (IPC):** Processes communicate via IPC mechanisms (Sockets, Shared Memory, Pipes, Signals). Threads communicate directly by reading/writing shared variables (requiring synchronization mutexes/locks).",
    ],
    example: {
      language: "JAVA",
      code: `// Multi-threading: Threads share the same heap memory space
public class ThreadExample {
    private static int sharedCounter = 0; // Shared state

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> sharedCounter++);
        Thread t2 = new Thread(() -> sharedCounter++);
        t1.start(); t2.start();
        t1.join(); t2.join();
    }
}`,
    },
    interviewTip:
      "Contrast thread safety issues (data races) with process isolation. Mention that Chrome browser gives every tab its own process so a single bad web page crash cannot bring down the entire browser.",
    commonTrap:
      "Confusing Process Context Switch with Thread Context Switch. Thread context switching does NOT require changing MMU page tables.",
    followUpQuestions: [
      "What is virtual memory and page faulting?",
      "What is a Zombie Process vs Orphan Process?",
      "How does copy-on-write work in process fork()?",
    ],
    relatedTopics: ["Process Management", "Multithreading", "Virtual Memory"],
    tags: ["OS", "Concurrency"],
  },
  {
    topicSlug: "operating-systems",
    slug: "process-states-and-pcb",
    title: "What are Process States and what is a Process Control Block (PCB)?",
    difficulty: "EASY",
    subtopic: "Process Management",
    synopsis: "5-state process lifecycle (New, Ready, Running, Waiting, Terminated) tracked via PCB.",
    shortAnswer:
      "A process transitions through 5 fundamental states: New (being created), Ready (waiting for CPU assignment), Running (executing instructions on CPU), Waiting/Blocked (waiting for I/O event), and Terminated (finished execution). The OS tracks every process via a Process Control Block (PCB) structure containing Process ID, Program Counter, registers, and memory boundaries.",
    detailedExplanation: [
      "**Process Control Block (PCB) Contents:**",
      "- **Process ID (PID) & Parent PID (PPID).**",
      "- **Process State:** New, Ready, Running, Waiting, Terminated.",
      "- **Program Counter (PC):** Address of next instruction to execute.",
      "- **CPU Registers:** Save register contents during context switches.",
      "- **Memory Management:** Page tables, segment tables.",
      "- **I/O State:** Open file descriptors, allocated lock resources.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux Kernel task_struct (PCB representation)
struct task_struct {
    volatile long state;    // -1 unrunnable, 0 runnable, >0 stopped
    struct thread_info *thread_info;
    pid_t pid;
    struct mm_struct *mm;   // Virtual Memory details
    struct files_struct *files; // Open file descriptors table
};`,
    },
    interviewTip:
      "Explain the Ready ➔ Running ➔ Waiting ➔ Ready loop: CPU Scheduler moves process from Ready to Running; an I/O request moves process to Waiting; I/O completion moves process back to Ready.",
    commonTrap:
      "Assuming a Waiting/Blocked process consumes CPU cycles. Blocked processes sit in I/O queues without taking any CPU time.",
    followUpQuestions: [
      "What is Context Switching and how does CPU save/restore PCB states?",
      "What is the difference between CPU-bound and I/O-bound processes?",
    ],
    relatedTopics: ["Process Control Block", "Process States", "Scheduling"],
    tags: ["OS", "Process Management"],
  },
  {
    topicSlug: "operating-systems",
    slug: "zombie-vs-orphan-process",
    title: "What is the difference between a Zombie Process and an Orphan Process?",
    difficulty: "EASY",
    subtopic: "Process Management",
    synopsis: "Terminated process awaiting parent wait() exit code (Zombie) vs process whose parent died (Orphan).",
    shortAnswer:
      "A Zombie Process is a process that has completed execution, but its exit status entry remains in the OS process table because its parent has not yet called `wait()`. An Orphan Process is a process whose parent process terminated before it did; orphans are automatically adopted by process `init` (PID 1), which reaps their exit status.",
    detailedExplanation: [
      "**Zombie Process:** Consumes zero CPU or RAM memory, but holds a PID slot in process table. Created when child finishes execution (`exit()`) and sends `SIGCHLD` signal to parent, but parent ignores or hasn't called `wait()` yet.",
      "**Orphan Process:** Parent process dies or crashes. The operating system re-parents the orphan process to `init` / `systemd` (PID 1). `init` periodically calls `wait()` to clean up adopted orphans.",
      "**Cleaning Zombies:** Kill the parent process! When the parent dies, zombie children become orphans and are immediately cleaned up by `init`.",
    ],
    example: {
      language: "JAVA",
      code: `// Creating a Zombie Process in C
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main() {
    pid_t child_pid = fork();
    if (child_pid == 0) {
        exit(0); // Child exits immediately -> becomes Zombie!
    } else {
        sleep(60); // Parent sleeps without calling wait() -> Zombie remains in process table!
    }
}`,
    },
    interviewTip:
      "Remember: `kill -9` cannot kill a Zombie process because a Zombie is ALREADY DEAD! To remove zombies, call `wait()` in the parent or kill the parent process.",
    commonTrap:
      "Thinking Zombie processes consume heavy RAM or CPU. Zombies take 0 RAM/CPU, but exhaust finite PID slots in the process table.",
    followUpQuestions: [
      "Why can't `kill -9` kill a zombie process?",
      "How to avoid zombie processes using SIGCHLD signal handlers?",
    ],
    relatedTopics: ["Process Management", "Zombie Process", "Linux"],
    tags: ["OS", "Linux", "Processes"],
  },
  {
    topicSlug: "operating-systems",
    slug: "cpu-scheduling-algorithms-overview",
    title: "What are the main CPU Scheduling Algorithms and how do they compare?",
    difficulty: "MEDIUM",
    subtopic: "Process Management",
    synopsis: "FCFS, SJF, SRTF, Round Robin, Priority, and Multilevel Feedback Queue scheduling.",
    shortAnswer:
      "CPU Scheduling algorithms decide which ready process gets CPU time. Main algorithms include: FCFS (First-Come First-Served), SJF (Shortest Job First - optimal avg wait time), SRTF (Preemptive SJF), Round Robin (time-sliced preemptive for time-sharing), Priority Scheduling, and MLFQ (Multilevel Feedback Queue - adaptive real-world scheduler).",
    detailedExplanation: [
      "**FCFS (First-Come First-Served):** Non-preemptive. Simple, but suffers from **Convoy Effect** (short processes wait behind long CPU-bound process).",
      "**SJF / SRTF (Shortest Job / Remaining Time First):** Gives CPU to process with smallest execution time. Provably optimal minimum average waiting time. Suffers from **Starvation** of long jobs.",
      "**Round Robin (RR):** Preemptive time-slice quantum (e.g. 10ms). Fair, low response time for interactive systems. Large quantum turns RR into FCFS; tiny quantum causes excessive context switch overhead.",
      "**MLFQ (Multilevel Feedback Queue):** Multiple queues with varying priorities and time quanta. Processes move down queues as CPU consumption increases; I/O-bound jobs stay in high-priority queues.",
    ],
    example: {
      language: "JAVA",
      code: `// Round Robin Scheduling Logic Concept
Queue<Process> readyQueue = new LinkedList<>();
int timeQuantum = 10; // ms

while (!readyQueue.isEmpty()) {
    Process p = readyQueue.poll();
    int executeTime = Math.min(p.remainingTime, timeQuantum);
    p.remainingTime -= executeTime;
    
    if (p.remainingTime > 0) {
        readyQueue.add(p); // Re-queue at tail if quantum expires
    }
}`,
    },
    interviewTip:
      "MLFQ is the real-world standard used in modern OS kernels (Linux Completely Fair Scheduler CFS, Windows) because it adapts dynamically without knowing process execution times in advance.",
    commonTrap:
      "Confusing Turnaround Time (Completion Time - Arrival Time) with Waiting Time (Turnaround Time - Burst Time).",
    followUpQuestions: [
      "What is the Convoy Effect in FCFS scheduling?",
      "How does Linux Completely Fair Scheduler (CFS) use Red-Black trees?",
    ],
    relatedTopics: ["CPU Scheduling", "Round Robin", "MLFQ"],
    tags: ["OS", "Scheduling", "Performance"],
  },

  /* ==========================================================================
     3. Process Synchronization & IPC
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "critical-section-problem-mutex-semaphore",
    title: "What is the Critical Section Problem, and what is the difference between Mutex and Semaphore?",
    difficulty: "EASY",
    subtopic: "Synchronization",
    synopsis: "Code accessing shared resources requiring Mutual Exclusion, Progress, and Bounded Waiting guarantees.",
    shortAnswer:
      "The Critical Section is a code segment accessing shared resources that must not be executed concurrently by multiple threads. A Mutex is a locking mechanism owned by a single thread (ownership enforcement). A Semaphore is a signaling mechanism (counter-based) that controls access to $N$ shared resources.",
    detailedExplanation: [
      "**Critical Section 3 Requirements:**",
      "1. **Mutual Exclusion:** Only one process inside critical section at a time.",
      "2. **Progress:** If no process is in critical section, selection of next process cannot be postponed indefinitely.",
      "3. **Bounded Waiting:** Bound on number of times other processes can enter critical section after a process requests entry.",
      "**Mutex (Binary Lock):** Thread locking mutex MUST be the thread that unlocks it. Has ownership.",
      "**Semaphore (Counting/Binary):** Maintains integer counter. `wait()` / `P()` decrements; `signal()` / `V()` increments. Any thread can signal a semaphore (no ownership requirement).",
    ],
    example: {
      language: "JAVA",
      code: `// Java ReentrantLock (Mutex) vs Semaphore
ReentrantLock mutex = new ReentrantLock();
Semaphore semaphore = new Semaphore(3); // Allows 3 concurrent threads

// Mutex Usage
mutex.lock();
try {
    // Critical Section: Access Shared State
} finally {
    mutex.unlock();
}`,
    },
    interviewTip:
      "Remember key distinction: Mutex = Locking with Ownership (Locking thread must Unlock); Semaphore = Signaling without Ownership (Thread A can signal Thread B).",
    commonTrap:
      "Calling `unlock()` on a Mutex from a thread that did not acquire the lock. This throws an IllegalMonitorStateException.",
    followUpQuestions: [
      "What is a Spinlock and when is it preferred over a Mutex?",
      "What is Priority Inversion and how does Priority Inheritance solve it?",
    ],
    relatedTopics: ["Synchronization", "Mutex", "Semaphore", "Concurrency"],
    tags: ["OS", "Concurrency", "Synchronization"],
  },
  {
    topicSlug: "operating-systems",
    slug: "classic-synchronization-problems",
    title: "What are the classic Process Synchronization problems (Producer-Consumer, Readers-Writers, Dining Philosophers)?",
    difficulty: "MEDIUM",
    subtopic: "Synchronization",
    synopsis: "Standard concurrency benchmarks demonstrating race condition avoidance and deadlock prevention.",
    shortAnswer:
      "Classic synchronization problems illustrate concurrency challenges: Producer-Consumer (bounded buffer access using semaphores for buffer slots), Readers-Writers (allowing multiple simultaneous readers while restricting writers to exclusive access), and Dining Philosophers (preventing deadlocks and starvation when acquiring multiple shared resources).",
    detailedExplanation: [
      "**Producer-Consumer (Bounded Buffer):** Uses 3 semaphores: `mutex` (for buffer access), `empty` (counts empty slots), `full` (counts filled slots). Producer waits on `empty`, consumer waits on `full`.",
      "**Readers-Writers:** Priority strategies: 1) Reader-Preference (Writers may starve), 2) Writer-Preference (Readers wait if writer is queued), 3) Fair / No Starvation (FIFO queue).",
      "**Dining Philosophers:** 5 philosophers, 5 chopsticks. If all pick up left chopstick simultaneously ➔ DEADLOCK! Solutions: Asymmetric picking (odd pick left first, even pick right first) or hierarchy ordering.",
    ],
    example: {
      language: "JAVA",
      code: `// Dining Philosophers Solution (Asymmetric Chopstick Pick)
void grabChopsticks(int id) {
    if (id % 2 == 0) {
        lock(leftChopstick);
        lock(rightChopstick);
    } else {
        lock(rightChopstick);
        lock(leftChopstick); // Prevents circular wait deadlock condition!
    }
}`,
    },
    interviewTip:
      "Relate Dining Philosophers directly to Deadlock conditions: Eliminating Circular Wait by breaking lock acquisition symmetry prevents deadlocks completely.",
    commonTrap:
      "Allowing Readers to read while a Writer is actively modifying the shared buffer, causing corrupted state reads.",
    followUpQuestions: [
      "How to implement Producer-Consumer using Java BlockingQueue?",
      "What is Read-Write Lock (`ReentrantReadWriteLock`) in Java?",
    ],
    relatedTopics: ["Synchronization", "Concurrency", "Semaphores"],
    tags: ["OS", "Concurrency"],
  },
  {
    topicSlug: "operating-systems",
    slug: "inter-process-communication-ipc-mechanisms",
    title: "What are the main Inter-Process Communication (IPC) mechanisms?",
    difficulty: "MEDIUM",
    subtopic: "Process Management",
    synopsis: "Pipes, Named Pipes (FIFO), Shared Memory, Message Queues, and Sockets.",
    shortAnswer:
      "Processes communicate via 5 primary IPC mechanisms: 1) Anonymous Pipes (unidirectional byte stream between parent-child), 2) Named Pipes / FIFOs (pipe accessible by unrelated processes via file path), 3) Shared Memory (fastest IPC; processes map same physical memory page), 4) Message Queues (kernel-managed discrete message buffer), and 5) Sockets (network/local IPC).",
    detailedExplanation: [
      "**Anonymous Pipes (`pipe()`):** Unidirectional data channel between parent and child processes created via `fork()`. Data flows linearly.",
      "**Shared Memory (`shmget()`, `mmap()`):** FASTEST IPC method. System maps a physical memory region into the virtual address space of multiple processes. Zero OS copy overhead; requires semaphores/mutexes for synchronization.",
      "**Message Queues:** Kernel maintains a queue of structured messages. Sender appends, receiver reads. Handles message boundaries automatically.",
      "**Unix Domain Sockets:** Fast local socket communication (`AF_UNIX`) using standard socket APIs without network stack overhead.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux Command Line Anonymous Pipe
// $ cat access.log | grep "404" | wc -l
// Output of 'cat' is piped directly to input of 'grep' via kernel buffer pipe!`,
    },
    interviewTip:
      "Always state: Shared Memory is the FASTEST IPC mechanism because data does not need to be copied through kernel space; processes read/write directly to shared RAM pages.",
    commonTrap:
      "Using Shared Memory without synchronization locks. Shared Memory provides zero built-in locking; applications MUST use semaphores or mutexes to prevent corruption.",
    followUpQuestions: [
      "Why is Shared Memory faster than Message Passing?",
      "What is a Unix Domain Socket vs TCP Network Socket?",
    ],
    relatedTopics: ["IPC", "Pipes", "Shared Memory", "Linux"],
    tags: ["OS", "IPC", "Linux"],
  },

  /* ==========================================================================
     4. Deadlocks
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "deadlock-necessary-conditions-handling",
    title: "What is a Deadlock and what are the 4 necessary Coffman conditions?",
    difficulty: "EASY",
    subtopic: "Deadlocks",
    synopsis: "Permanent blocking of processes holding resources while waiting for others; requires 4 Coffman conditions.",
    shortAnswer:
      "A Deadlock is a state where a set of processes are permanently blocked because each holds a resource while waiting for another resource held by another process in the set. A deadlock occurs IF AND ONLY IF all 4 Coffman conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    detailedExplanation: [
      "**1. Mutual Exclusion:** At least one resource must be held in a non-shareable mode (exclusive access).",
      "**2. Hold and Wait:** A process holding at least one resource is actively waiting to acquire additional resources held by other processes.",
      "**3. No Preemption:** Resources cannot be forcibly taken away from a process; they can only be released voluntarily after job completion.",
      "**4. Circular Wait:** A closed chain of processes exists ($P_0 \\rightarrow P_1 \\rightarrow P_2 \\rightarrow P_0$) such that $P_0$ waits for $P_1$, $P_1$ waits for $P_2$, and $P_2$ waits for $P_0$.",
    ],
    example: {
      language: "JAVA",
      code: `// Deadlock Code Example in Java
Thread 1: lock(ResourceA); lock(ResourceB);
Thread 2: lock(ResourceB); lock(ResourceA); 
// If T1 locks A and T2 locks B simultaneously -> DEADLOCK!`,
    },
    interviewTip:
      "To prevent deadlocks, eliminate any ONE of the 4 conditions (most commonly breaking Circular Wait by ordering resource acquisitions globally).",
    commonTrap:
      "Confusing Deadlock with Livelock or Starvation. In Livelock, process states change continuously without progress; in Deadlock, processes are completely blocked.",
    followUpQuestions: [
      "What is the difference between Deadlock, Livelock, and Starvation?",
      "How does Banker's Algorithm avoid deadlocks?",
    ],
    relatedTopics: ["Deadlock", "Coffman Conditions", "Concurrency"],
    tags: ["OS", "Deadlock", "Concurrency"],
  },
  {
    topicSlug: "operating-systems",
    slug: "bankers-algorithm-deadlock-avoidance",
    title: "How does Banker's Algorithm avoid deadlocks?",
    difficulty: "MEDIUM",
    subtopic: "Deadlocks",
    synopsis: "Safety algorithm testing resource allocation state to ensure system remains in a Safe State.",
    shortAnswer:
      "Banker's Algorithm is a deadlock avoidance algorithm for systems with multiple resource instances. When a process requests resources, the algorithm simulates allocation and tests if the resulting state is a **Safe State** (a sequence exists where all processes can finish). If unsafe, the request is denied, forcing the process to wait.",
    detailedExplanation: [
      "**Safe State:** System can allocate resources to each process up to its maximum limit in some order without causing a deadlock.",
      "**Data Structures:**",
      "- `Available[m]`: Number of available units of each resource type.",
      "- `Max[n][m]`: Maximum resource demand of each process.",
      "- `Allocation[n][m]`: Currently allocated resources per process.",
      "- `Need[n][m]`: Remaining resource need (`Need = Max - Allocation`).",
      "**Safety Test:** Find a process whose `Need <= Available`. Pretend it finishes, release its `Allocation` back to `Available`, and repeat. If all processes finish, state is SAFE.",
    ],
    example: {
      language: "JAVA",
      code: `// Need Matrix Calculation
// Need[i][j] = Max[i][j] - Allocation[i][j]
// If Need[i] <= Available, Process i can execute to completion safely!`,
    },
    interviewTip:
      "Highlight: Deadlock Avoidance (Banker's Algorithm) requires knowing processes' MAXIMUM resource needs IN ADVANCE, making it impractical for general-purpose OS kernels.",
    commonTrap:
      "Thinking an Unsafe State is automatically a Deadlock. An Unsafe State is NOT a deadlock; it is a state that *might* lead to a deadlock if processes request maximum demands.",
    followUpQuestions: [
      "Why is Banker's Algorithm rarely used in modern operating systems like Linux?",
      "What is Resource Allocation Graph (RAG)?",
    ],
    relatedTopics: ["Banker's Algorithm", "Deadlock Avoidance", "OS"],
    tags: ["OS", "Deadlock", "Algorithms"],
  },

  /* ==========================================================================
     5. Memory Management & Virtual Memory
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "paging-vs-segmentation-memory-management",
    title: "What is the difference between Paging and Segmentation in Memory Management?",
    difficulty: "EASY",
    subtopic: "Memory Management",
    synopsis: "Fixed-size physical blocks (Paging) vs variable-size logical segments (Segmentation).",
    shortAnswer:
      "Paging divides physical and virtual memory into fixed-size memory blocks called Pages (virtual) and Frames (physical), managed by Page Tables (eliminates external fragmentation). Segmentation divides memory into variable-sized logical segments reflecting program structure (Code, Data, Stack, Heap), which can cause external fragmentation.",
    detailedExplanation: [
      "**Paging:** Hardware-driven fixed allocation (e.g. 4KB pages). Virtual address contains Page Number + Offset. Completely eliminates External Fragmentation, but causes minor Internal Fragmentation.",
      "**Segmentation:** Programmer-oriented logical sections (e.g. Segment 0 = Code, Segment 1 = Stack). Segment Table holds base address and limit length. Causes External Fragmentation.",
      "**Paged Segmentation (Modern x86):** Virtual memory uses segmentation mapped onto underlying paging.",
    ],
    example: {
      language: "JAVA",
      code: `// Virtual Address translation in 32-bit Paging (4KB Page Size = 2^12 bytes)
// Virtual Address: [ Page Number (20 bits) | Page Offset (12 bits) ]
// Physical Address = Frame Number (from Page Table lookup) + Offset`,
    },
    interviewTip:
      "Remember: Paging = Fixed-size blocks (Internal fragmentation); Segmentation = Variable-size logical blocks (External fragmentation).",
    commonTrap:
      "Believing Paging causes External Fragmentation. Paging completely eliminates External Fragmentation because any free frame can fit any page.",
    followUpQuestions: [
      "What is Internal vs External Fragmentation?",
      "How does a multi-level page table save memory?",
    ],
    relatedTopics: ["Paging", "Segmentation", "Memory Management"],
    tags: ["OS", "Memory", "Architecture"],
  },
  {
    topicSlug: "operating-systems",
    slug: "virtual-memory-page-fault-handling-sequence",
    title: "What is Virtual Memory and what is the exact Page Fault handling sequence?",
    difficulty: "MEDIUM",
    subtopic: "Virtual Memory",
    synopsis: "Abstraction mapping process virtual addresses to physical RAM, loading pages on-demand from disk.",
    shortAnswer:
      "Virtual Memory provides processes with the illusion of a vast, contiguous address space larger than physical RAM. On-demand paging loads pages from disk into RAM only when accessed. A Page Fault occurs when a CPU accesses a virtual page whose valid bit in the page table is 0 (not in RAM).",
    detailedExplanation: [
      "**Page Fault Handling Sequence:**",
      "1. CPU accesses virtual memory address; MMU detects valid bit = 0 in Page Table ➔ Triggers Page Fault Trap.",
      "2. OS pauses process, saves context, and switches to Kernel Mode page fault handler.",
      "3. OS checks if memory access was valid (if invalid ➔ Segmentation Fault `SIGSEGV`).",
      "4. OS locates missing page in Swap Space on disk.",
      "5. OS finds a free physical RAM Frame (if none free, executes Page Replacement Algorithm like LRU).",
      "6. OS schedules disk I/O read to load page from Swap to RAM frame.",
      "7. Upon I/O completion, OS updates Page Table (valid bit = 1, sets frame number).",
      "8. OS restores process state and restarts the faulting CPU instruction.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux command checking swap & page fault metrics
// $ vmstat 1
// si (so): Swap-in (Swap-out) memory rate
// majflt: Major page faults requiring disk I/O read`,
    },
    interviewTip:
      "Highlight performance difference: Minor Page Faults (page in RAM buffer cache) take nanoseconds; Major Page Faults (page read from disk/SSD) take milliseconds ($10^6$ times slower!).",
    commonTrap:
      "Confusing Page Fault with Segmentation Fault. A Page Fault is a routine OS virtual memory operation; a SegFault is an illegal memory access crash.",
    followUpQuestions: [
      "What is the difference between a Major Page Fault and a Minor Page Fault?",
      "What is Thrashing in Virtual Memory?",
    ],
    relatedTopics: ["Virtual Memory", "Page Fault", "Paging"],
    tags: ["OS", "Memory", "Virtual Memory"],
  },
  {
    topicSlug: "operating-systems",
    slug: "page-replacement-algorithms-lru-fifo-clock",
    title: "What are Page Replacement Algorithms (FIFO, LRU, Optimal, Clock)?",
    difficulty: "MEDIUM",
    subtopic: "Virtual Memory",
    synopsis: "Evicting RAM pages when memory is full: FIFO (suffers Belady's anomaly), LRU, Optimal, and Clock.",
    shortAnswer:
      "When physical RAM is full during a page fault, a Page Replacement Algorithm selects a page to evict to disk swap space. FIFO evicts the oldest loaded page (suffers Belady's Anomaly). Optimal evicts the page that won't be used for the longest future time (theoretical benchmark). LRU (Least Recently Used) evicts the page unaccessed for the longest past time. Clock (Second Chance) approximates LRU efficiently.",
    detailedExplanation: [
      "**FIFO (First-In First-Out):** Evicts oldest page. Simple queue, but can evict heavily used pages. Suffers from Belady's Anomaly (increasing frame allocation increases page faults).",
      "**Optimal (OPT / MIN):** Evicts page that will not be used for longest future duration. Requires future knowledge (impossible in practice; used as theoretical upper bound).",
      "**LRU (Least Recently Used):** Evicts page with oldest last access timestamp. Excellent performance, but hardware stack/counter tracking is expensive.",
      "**Clock Algorithm (Second Chance):** Maintains circular array of pages with a reference bit (0 or 1). Clock hand steps through: if bit is 1, clears bit to 0 and gives second chance; if bit is 0, selects page for eviction.",
    ],
    example: {
      language: "JAVA",
      code: `// LRU Cache Implementation in Java using LinkedHashMap
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // true for access-order!
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity; // Evicts LRU item when capacity exceeded!
    }
}`,
    },
    interviewTip:
      "Explain why real operating systems use Clock (Second Chance) instead of pure LRU: Pure LRU requires updating a timestamp on EVERY memory reference, incurring massive hardware overhead.",
    commonTrap:
      "Assuming adding more RAM frames always reduces page faults. Under FIFO, Belady's Anomaly causes more page faults with more frames.",
    followUpQuestions: [
      "What is Belady's Anomaly and which algorithms suffer from it?",
      "How does the Clock page replacement algorithm work?",
    ],
    relatedTopics: ["Page Replacement", "LRU", "Belady Anomaly"],
    tags: ["OS", "Virtual Memory", "Algorithms"],
  },
  {
    topicSlug: "operating-systems",
    slug: "tlb-translation-lookaside-buffer-mechanics",
    title: "What is a Translation Lookaside Buffer (TLB) and how does it speed up paging?",
    difficulty: "MEDIUM",
    subtopic: "Virtual Memory",
    synopsis: "High-speed associative hardware CPU cache storing recent virtual-to-physical page table translations.",
    shortAnswer:
      "A Translation Lookaside Buffer (TLB) is an associative hardware cache built directly into the CPU's Memory Management Unit (MMU). It stores recent virtual-page-number to physical-frame-number translations. On a TLB Hit, translation occurs in sub-nanosecond CPU clock cycles, bypassing multi-level page table memory lookups.",
    detailedExplanation: [
      "**Paging Latency Problem:** Without a TLB, every memory read requires first traversing a 4-level page table in RAM (4 memory accesses) + 1 access for actual data = 5 RAM reads per instruction!",
      "**TLB Hit & Miss:** On virtual memory reference, MMU checks TLB. If present (**TLB Hit**), physical address is generated instantly. If absent (**TLB Miss**), MMU walks page tables in RAM, updates TLB, and completes access.",
      "**Effective Access Time (EAT):** $EAT = \\text{Hit Rate} \\times (TLB + RAM) + (1 - \\text{Hit Rate}) \\times (TLB + 5 \\times RAM)$. High hit rates (>99%) bring EAT close to 1 RAM access.",
      "**TLB Flush on Context Switch:** Switching processes invalidates page table mappings. Modern CPUs use Address Space Identifiers (ASID) to tag TLB entries to prevent flushing entire TLB on context switch.",
    ],
    example: {
      language: "JAVA",
      code: `// Effective Access Time (EAT) Calculation:
// Assume TLB search = 1ns, Main Memory RAM access = 10ns, TLB Hit Rate = 98%
// EAT = 0.98 * (1 + 10) + 0.02 * (1 + 10 + 10) = 10.78 + 0.42 = 11.2ns (vs 20ns without TLB)`,
    },
    interviewTip:
      "Mention ASID (Address Space Identifier) tagging in ARM and x86 CPUs: tagging TLB entries with process IDs eliminates the massive performance penalty of flushing TLBs during context switching.",
    commonTrap:
      "Thinking TLB stores actual row data. TLB stores ONLY address translation mappings (Virtual Page -> Physical Frame).",
    followUpQuestions: [
      "What is Address Space Identifier (ASID) tagging in TLBs?",
      "How do Huge Pages (2MB/1GB pages) improve TLB hit rates?",
    ],
    relatedTopics: ["TLB", "MMU", "Virtual Memory", "Paging"],
    tags: ["OS", "Hardware", "Virtual Memory"],
  },
  {
    topicSlug: "operating-systems",
    slug: "thrashing-and-working-set-model",
    title: "What is Thrashing in Virtual Memory and how does the Working Set Model prevent it?",
    difficulty: "MEDIUM",
    subtopic: "Virtual Memory",
    synopsis: "High page-fault state where OS spends more time swapping pages than executing instructions.",
    shortAnswer:
      "Thrashing occurs when a system spends more time swapping pages in and out of disk than executing actual code. It happens when total memory demands of active processes exceed available physical RAM. The Working Set Model prevents thrashing by tracking the set of pages actively used by each process and pausing processes if working sets cannot fit in RAM.",
    detailedExplanation: [
      "**Thrashing Collapse:** As physical RAM fills, page faults spike. Processes block waiting for disk I/O swap. CPU utilization drops to near zero. OS mistakenly spawns MORE processes thinking CPU is idle, accelerating memory collapse.",
      "**Working Set Model ($W(t, \\Delta)$):** Defines the set of pages referenced by a process in the most recent $\\Delta$ time units.",
      "**Prevention Rule:** Total Demand $D = \\sum W_i$. If $D > \\text{Total RAM}$, thrashing is imminent. OS must suspend/swap out an entire process to free RAM frames for remaining working sets.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux Out-Of-Memory (OOM) Killer
// When thrashing degrades system to critical memory exhaustion:
// OOM Killer selects process with highest oom_score and executes SIGKILL (kill -9)!`,
    },
    interviewTip:
      "Describe the classic CPU utilization graph: As multiprogramming degree increases, CPU utilization increases up to a peak, then drops vertically off a cliff into Thrashing.",
    commonTrap:
      "Thinking increasing CPU count stops thrashing. Adding more CPUs exacerbates thrashing because it increases memory demand; only adding RAM or reducing active processes resolves thrashing.",
    followUpQuestions: [
      "What is the Linux OOM (Out-Of-Memory) Killer?",
      "How to calculate process Working Set size in Linux?",
    ],
    relatedTopics: ["Thrashing", "Virtual Memory", "Working Set"],
    tags: ["OS", "Virtual Memory", "Performance"],
  },

  /* ==========================================================================
     6. Storage, File Systems & I/O
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "file-system-inodes-hard-vs-soft-links",
    title: "How do File System Inodes work and what is the difference between Hard Links and Soft (Symbolic) Links?",
    difficulty: "EASY",
    subtopic: "File Systems",
    synopsis: "Metadata structures (Inodes), directory entry pointers (Hard Links), and file path shortcuts (Soft Links).",
    shortAnswer:
      "An Inode (Index Node) is an OS file system data structure storing file metadata (file size, permissions, owner, block pointers) EXCEPT file name. A Hard Link is a directory entry pointing directly to an existing Inode number (shares same data blocks). A Soft (Symbolic) Link is a separate file containing a text path string pointing to another filename.",
    detailedExplanation: [
      "**Inode Contents:** File mode/permissions, Owner/Group ID, File size in bytes, Timestamps (atime, mtime, ctime), Direct/Indirect Data Block Pointers. Does NOT store filename.",
      "**Hard Link (`ln file link`):**",
      "- Increments Inode link count (`st_nlink`).",
      "- Points to exact same Inode and data blocks. Deleting original file does NOT lose data (data remains until link count = 0).",
      "- Cannot cross different file system partitions.",
      "**Soft Link (`ln -s file link`):**",
      "- Has its own distinct Inode and data block storing target path string.",
      "- Deleting original file creates a 'Broken Symlink'.",
      "- Can cross different file system partitions.",
    ],
    example: {
      language: "JAVA",
      code: `// Terminal Commands demonstrating Links & Inodes
$ touch original.txt
$ ln original.txt hardlink.txt   # Same Inode number! (ls -i)
$ ln -s original.txt softlink.txt # New Inode, points to filename text string
$ rm original.txt
// hardlink.txt STILL WORKS! softlink.txt is BROKEN!`,
    },
    interviewTip:
      "Explain why filenames are NOT stored in Inodes: Filenames are stored inside Directory Entries (`dentry`), which map filename strings to Inode numbers. This allows multiple Hard Links to point to one Inode.",
    commonTrap:
      "Creating hard links to directories. Operating systems forbid hard links to directories to prevent infinite circular loops in directory trees.",
    followUpQuestions: [
      "Why do Linux file systems forbid hard links to directories?",
      "What is the difference between atime, mtime, and ctime in Inodes?",
    ],
    relatedTopics: ["Inodes", "File Systems", "Linux", "Hard Links"],
    tags: ["OS", "Linux", "File Systems"],
  },
  {
    topicSlug: "operating-systems",
    slug: "disk-scheduling-algorithms-scan-cscan-look",
    title: "What are Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN)?",
    difficulty: "MEDIUM",
    subtopic: "Storage & I/O",
    synopsis: "Optimizing magnetic disk head movement: SSTF, Elevator algorithm (SCAN), and Circular SCAN (C-SCAN).",
    shortAnswer:
      "Disk Scheduling algorithms order I/O read/write requests to minimize disk arm Seek Time on mechanical hard drives. SSTF (Shortest Seek Time First) services nearest track request (suffers starvation). SCAN (Elevator algorithm) moves arm back and forth across disk. C-SCAN (Circular SCAN) scans in one direction only, returning to start track, delivering uniform wait times.",
    detailedExplanation: [
      "**Seek Time:** Time required for disk arm to position read/write head over specified cylinder track (largest component of disk latency).",
      "**SSTF:** Selects request closest to current head position. Minimizes overall seek time, but causes starvation for distant tracks.",
      "**SCAN (Elevator):** Head starts at one end, moves toward other end servicing requests, reverses direction at disk edge.",
      "**C-SCAN (Circular SCAN):** Head moves in one direction servicing requests. When it reaches end, it jumps immediately back to beginning WITHOUT servicing requests on return trip. Provides uniform wait bounds.",
      "**LOOK / C-LOOK:** Variant of SCAN/C-SCAN where head goes only as far as final request in current direction before reversing (doesn't travel needlessly to disk edge).",
    ],
    example: {
      language: "JAVA",
      code: `// Disk Head Cylinder Request Queue: [98, 183, 37, 122, 14, 124, 65, 67]
// Initial Head Position: 53
// SSTF Sequence: 53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183 (Minimizes Seek Distance!)`,
    },
    interviewTip:
      "Clarify that Disk Scheduling algorithms are designed for mechanical Hard Disk Drives (HDDs) with moving actuator arms; SSDs have zero physical seek time and use electronic NVMe queueing.",
    commonTrap:
      "Applying mechanical HDD disk scheduling algorithms to NVMe SSDs. Flash SSDs perform random reads at speed equal to sequential reads.",
    followUpQuestions: [
      "Why is disk seek time non-existent in Solid State Drives (SSDs)?",
      "What is NVMe protocol and queue depth?",
    ],
    relatedTopics: ["Disk Scheduling", "Storage", "Hardware"],
    tags: ["OS", "Storage", "Algorithms"],
  },
  {
    topicSlug: "operating-systems",
    slug: "raid-levels-overview-0-1-5-6-10",
    title: "What are RAID levels (RAID 0, RAID 1, RAID 5, RAID 6, RAID 10)?",
    difficulty: "MEDIUM",
    subtopic: "Storage & I/O",
    synopsis: "Redundant Array of Independent Disks combining drives for performance and fault tolerance.",
    shortAnswer:
      "RAID (Redundant Array of Independent Disks) combines multiple physical disk drives into a single logical unit. Key levels: RAID 0 (Striping - high speed, zero fault tolerance), RAID 1 (Mirroring - 100% redundancy, 50% capacity loss), RAID 5 (Block Striping + Distributed Parity - tolerates 1 drive failure), RAID 6 (Double Parity - tolerates 2 drive failures), and RAID 10 (Striping + Mirroring - high speed and fault tolerance).",
    detailedExplanation: [
      "**RAID 0 (Striping):** Splits data evenly across $N$ disks. High read/write speed. If 1 disk fails, ALL data is lost.",
      "**RAID 1 (Mirroring):** Duplicates exact data across 2+ disks. Tolerates $N-1$ failures. Usable capacity = 50%.",
      "**RAID 5 (Distributed Parity):** Requires min 3 disks. Distributes parity blocks across all drives. Usable capacity = $(N-1) \\times S$. Tolerates 1 disk failure.",
      "**RAID 6 (Dual Parity):** Requires min 4 disks. Uses two independent parity schemes. Tolerates 2 simultaneous disk failures.",
      "**RAID 10 (1+0 Striped Mirrors):** Requires min 4 disks. Mirrors pairs of disks, then stripes across pairs. Fast recovery, high performance.",
    ],
    example: {
      language: "JAVA",
      code: `// RAID 5 Capacity Calculation:
// 4 Disks of 2TB each -> Total Raw = 8TB
// Usable Capacity = (4 - 1) * 2TB = 6TB (2TB allocated to distributed parity)`,
    },
    interviewTip:
      "State: 'RAID 0 for Speed without redundancy; RAID 1 for Mirroring; RAID 5 for Cost-effective Parity; RAID 10 for High-Performance Mission-Critical Databases.'",
    commonTrap:
      "Treating RAID as a Backup solution. RAID protects against hardware drive failure; it does NOT protect against accidental file deletion, ransomware, or corruption.",
    followUpQuestions: [
      "Why is RAID not a replacement for database backups?",
      "What is the RAID write penalty in RAID 5?",
    ],
    relatedTopics: ["RAID", "Storage", "Fault Tolerance"],
    tags: ["OS", "Storage", "Hardware"],
  },

  /* ==========================================================================
     7. Virtualization, Security & Concurrency
     ========================================================================== */
  {
    topicSlug: "operating-systems",
    slug: "virtualization-hypervisors-vs-containers",
    title: "What is the difference between Virtual Machines (Hypervisors) and Containers (Docker)?",
    difficulty: "MEDIUM",
    subtopic: "Virtualization",
    synopsis: "Hardware virtualization via Guest OS (VMs) vs OS-level virtualization sharing Host Kernel (Containers).",
    shortAnswer:
      "Virtual Machines (Type-1/Type-2 Hypervisors) virtualize physical hardware, requiring each VM to run a complete, independent Guest Operating System. Containers (Docker) implement OS-level virtualization, sharing the Host OS Kernel while isolating user-space processes using Linux namespaces and cgroups.",
    detailedExplanation: [
      "**Virtual Machines (VMware, KVM, Hyper-V):**",
      "- Hardware Virtualization: Hypervisor emulates CPU, RAM, NIC for guest OS.",
      "- Isolation: Complete hardware isolation; hypervisor boundary.",
      "- Startup Time: Minutes; Memory footprint: Gigabytes per VM.",
      "**Containers (Docker, containerd):**",
      "- OS-Level Virtualization: Shares Host Linux Kernel.",
      "- Isolation Mechanisms: Linux `namespaces` (PID, Net, Mount isolation) and `cgroups` (CPU/Memory resource caps).",
      "- Startup Time: Milliseconds; Memory footprint: Megabytes per container.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux Primitives Underneath Docker Containers:
// 1. Namespaces (pid, net, mnt, ipc, uts): Provides isolated process tree & network stack.
// 2. Control Groups (cgroups): Limits CPU/RAM usage (e.g. max 512MB RAM for container).
// 3. OverlayFS: Copy-on-Write layered file system.`,
    },
    interviewTip:
      "Name the 2 core Linux kernel primitives that make Docker containers possible: **Namespaces** (for isolation) and **Cgroups** (for resource limits).",
    commonTrap:
      "Claiming Docker containers run a guest kernel. All Linux containers on a host execute instructions directly on the SINGLE shared Host OS Kernel.",
    followUpQuestions: [
      "What are Linux Namespaces and Cgroups?",
      "What is a Type-1 Bare-Metal Hypervisor vs Type-2 Hosted Hypervisor?",
    ],
    relatedTopics: ["Virtualization", "Docker", "Containers", "Linux"],
    tags: ["OS", "Virtualization", "Docker"],
  },
  {
    topicSlug: "operating-systems",
    slug: "copy-on-write-cow-fork-mechanics",
    title: "How does Copy-on-Write (COW) work in process fork()?",
    difficulty: "MEDIUM",
    subtopic: "Process Management",
    synopsis: "Deferring memory page duplication during fork() until parent or child attempts a write operation.",
    shortAnswer:
      "Copy-on-Write (COW) is an optimization technique used during process creation (`fork()`). Instead of duplicating all physical RAM memory pages of the parent process, parent and child share the exact same physical memory pages marked as READ-ONLY. When either process attempts to WRITE to a page, a page fault occurs, and the OS duplicates only that specific modified page.",
    detailedExplanation: [
      "**Without COW:** `fork()` duplicating a 16GB process takes hundreds of milliseconds to copy RAM pages.",
      "**With COW Execution Flow:**",
      "1. Parent calls `fork()`. Kernel creates child Process Control Block and copies page table pointers.",
      "2. Parent and child page tables point to same physical RAM frames marked as `READ-ONLY`.",
      "3. Child immediately executes `execve()` to load a new program ➔ Zero memory pages copied!",
      "4. If Parent/Child writes to a page ➔ MMU triggers Page Fault ➔ Kernel allocates a new frame, copies the 4KB page, updates page table to Read-Write, and resumes process.",
    ],
    example: {
      language: "JAVA",
      code: `// Redis Background BGSAVE leveraging Copy-on-Write
// Redis forks child process to save RDB snapshot to disk.
// Child reads shared memory pages to write snapshot.
// Main parent process continues servicing live writes; COW duplicates ONLY modified pages!`,
    },
    interviewTip:
      "Connect COW to Redis snapshots: Redis uses `fork()` and COW to take non-blocking background database snapshots (`BGSAVE`) with zero memory duplication overhead for untouched keys.",
    commonTrap:
      "Believing `fork()` immediately allocates a complete duplicate set of physical RAM pages for the child process.",
    followUpQuestions: [
      "How does Redis use Copy-on-Write for background snapshotting?",
      "What is `execve()` system call?",
    ],
    relatedTopics: ["Copy-on-Write", "Fork", "Memory Management"],
    tags: ["OS", "Memory", "Linux"],
  },
  {
    topicSlug: "operating-systems",
    slug: "priority-inversion-priority-inheritance",
    title: "What is Priority Inversion and how does Priority Inheritance Protocol resolve it?",
    difficulty: "HARD",
    subtopic: "Synchronization",
    synopsis: "High-priority task blocked by medium-priority task holding a low-priority task's lock; resolved by boosting low-priority task.",
    shortAnswer:
      "Priority Inversion occurs when a high-priority task ($H$) is indirectly preempted by a medium-priority task ($M$) because a low-priority task ($L$) holds a shared lock that $H$ needs. It is resolved by the Priority Inheritance Protocol, where task $L$ temporarily inherits task $H$'s high priority until $L$ releases the shared lock.",
    detailedExplanation: [
      "**Priority Inversion Scenario:**",
      "1. Task $L$ (Low Priority) acquires Lock A.",
      "2. Task $H$ (High Priority) runs, needs Lock A, and blocks waiting for $L$.",
      "3. Task $M$ (Medium Priority) arrives. $M$ does not need Lock A. $M$ preempts $L$ because $M$'s priority is higher than $L$'s!",
      "4. Result: Medium-priority task $M$ runs while High-priority task $H$ is delayed indefinitely! (Priority inverted).",
      "**Priority Inheritance Solution:** When $H$ blocks on Lock A held by $L$, the OS kernel temporarily boosts $L$'s priority to match $H$. $L$ finishes its critical section quickly, releases Lock A, restores its low priority, and $H$ executes immediately.",
    ],
    example: {
      language: "JAVA",
      code: `// Real-World Incident: Mars Pathfinder Spacecraft Bug (1997)
// Pathfinder reset continuously on Mars due to Priority Inversion on an information bus mutex.
// Fixed remotely by enabling Priority Inheritance on the VxWorks RTOS mutex!`,
    },
    interviewTip:
      "Cite the 1997 Mars Pathfinder spacecraft mission incident: Priority Inversion on the VxWorks real-time operating system caused system resets until engineers patched mutexes with Priority Inheritance.",
    commonTrap:
      "Thinking Priority Inversion can happen without mutual exclusion locks. Priority Inversion requires a shared lock.",
    followUpQuestions: [
      "What is Priority Ceiling Protocol?",
      "How does real-time scheduling (RTOS) handle priority inversion?",
    ],
    relatedTopics: ["Priority Inversion", "RTOS", "Synchronization"],
    tags: ["OS", "Concurrency", "Scheduling"],
  },
];
