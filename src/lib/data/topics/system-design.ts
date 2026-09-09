import type { ConceptualQuestion } from "../conceptual";

export const systemDesignQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "system-design",
    slug: "cap-theorem-explained",
    title: "What is the CAP Theorem in Distributed Systems?",
    difficulty: "MEDIUM",
    subtopic: "Distributed Systems",
    synopsis: "Consistency, Availability, and Partition Tolerance trade-offs during network failures.",
    shortAnswer:
      "The CAP Theorem states that a distributed data store can simultaneously provide at most 2 of 3 guarantees: Consistency (every read receives the most recent write or an error), Availability (every non-failing node returns a response), and Partition Tolerance (system continues operating despite network message loss or delay). In real-world networks, Partition Tolerance is mandatory, forcing a choice between CP or AP.",
    detailedExplanation: [
      "**Consistency (CP).** Prioritizes data correctness. If a network partition cuts off node synchronization, the system rejects writes/reads on isolated nodes until the partition heals (e.g. HBase, MongoDB, Redis in cluster mode).",
      "**Availability (AP).** Prioritizes uptime. Nodes accept reads/writes during network partitions, serving stale or divergent data, and reconcile differences later via eventual consistency (e.g. Cassandra, DynamoDB).",
      "**Partition Tolerance is Non-Negotiable.** Networks will experience latency and dropped packets. Thus, system design is really about choosing between CP (Consistency under Partition) or AP (Availability under Partition).",
    ],
    example: {
      language: "JAVA",
      code: `// Distributed System Decision during Network Partition (Node A cut off from Node B)
if (systemChoice == CP) {
    // CP: Deny write to prevent data divergence
    throw new SystemUnavailableException("Network partition detected. Read/Write blocked for consistency.");
} else if (systemChoice == AP) {
    // AP: Accept write on Node A, resolve conflicts later via Vector Clocks / Last-Write-Wins
    acceptLocalWrite(data);
    queueSyncForLater(nodeB);
}`,
    },
    interviewTip:
      "Mention PACELC theorem as the modern extension of CAP: 'If there is a Partition (P), choose between Availability (A) and Consistency (C); Else (E), choose between Latency (L) and Consistency (C)'.",
    commonTrap:
      "Claiming a database can be 'CA' (Consistency + Availability without Partition Tolerance). Physical networks experience partitions, making CA impossible in real distributed systems.",
    followUpQuestions: [
      "What is Eventual Consistency?",
      "How do Vector Clocks resolve data divergence?",
      "What is the PACELC theorem?",
    ],
    relatedTopics: ["CAP Theorem", "Distributed Systems", "Database Replication"],
    tags: ["System Design", "Distributed Systems"],
  },
];
