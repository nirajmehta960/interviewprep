/**
 * Role → Category → Topic hierarchy.
 *
 * Populates Software Engineer, AI Engineer, Data Analyst, Data Engineer,
 * Business Analyst, and Product Manager roles.
 */

export interface TopicNode {
  slug: string;
  name: string;
  monogram: string;
  /** Shown on the topic card. */
  blurb: string;
}

export interface CategoryNode {
  slug: string;
  name: string;
  topics: TopicNode[];
}

export interface RoleNode {
  slug: string;
  name: string;
  description: string;
  /** Short topic list for the role selection cards. */
  highlights: string[];
  categories: CategoryNode[];
}

export const roles: RoleNode[] = [
  {
    slug: "software-engineer",
    name: "Software Engineer",
    description:
      "Languages, frameworks, computer science fundamentals, development practice, and system design — the full engineering interview surface.",
    highlights: ["Java", "Python", "JavaScript", "React", "Node.js", "Spring Boot", "DSA", "System Design"],
    categories: [
      {
        slug: "languages",
        name: "Programming Languages",
        topics: [
          { slug: "java", name: "Java", monogram: "JV", blurb: "Collections, memory model, concurrency, and the JVM." },
          { slug: "python", name: "Python", monogram: "PY", blurb: "Data model, generators, decorators, and the GIL." },
          { slug: "javascript", name: "JavaScript", monogram: "JS", blurb: "Event loop, microtasks, prototypes, closures, and async." },
        ],
      },
      {
        slug: "frameworks",
        name: "Frameworks & Runtimes",
        topics: [
          { slug: "react", name: "React", monogram: "RC", blurb: "Virtual DOM, Fiber reconciler, hooks, state, and rendering." },
          { slug: "nodejs", name: "Node.js", monogram: "NJ", blurb: "Event loop, Libuv thread pool, non-blocking I/O, and streams." },
          { slug: "express", name: "Express.js", monogram: "EX", blurb: "Middleware pipeline, routing, and error handling." },
          { slug: "spring-boot", name: "Spring Boot", monogram: "SB", blurb: "IoC, Dependency Injection, auto-configuration, and Spring Data JPA." },
        ],
      },
      {
        slug: "cs-fundamentals",
        name: "CS Fundamentals",
        topics: [
          { slug: "oop", name: "OOP", monogram: "OO", blurb: "Encapsulation, polymorphism, SOLID, and design principles." },
          { slug: "dsa", name: "Data Structures & Algorithms", monogram: "DS", blurb: "The Top Interview 150, with a visual trace workbench." },
          { slug: "dbms", name: "DBMS", monogram: "DB", blurb: "Indexing, ACID, joins, and normalization." },
          { slug: "operating-systems", name: "Operating Systems", monogram: "OS", blurb: "Processes, threads, scheduling, and memory." },
          { slug: "networks", name: "Computer Networks", monogram: "NW", blurb: "TCP/IP, HTTP, DNS, and the request lifecycle." },
        ],
      },
      {
        slug: "development",
        name: "Development",
        topics: [
          { slug: "rest-apis", name: "REST APIs", monogram: "AP", blurb: "Resource design, status codes, idempotency, and versioning." },
          { slug: "backend", name: "Backend", monogram: "BE", blurb: "Auth, caching, queues, and service boundaries." },
          { slug: "git", name: "Git", monogram: "GT", blurb: "Branching, rebase versus merge, and conflict resolution." },
          { slug: "testing", name: "Testing", monogram: "TS", blurb: "Unit, integration, mocking, and the testing pyramid." },
        ],
      },
      {
        slug: "advanced",
        name: "Advanced",
        topics: [
          { slug: "system-design", name: "System Design", monogram: "SD", blurb: "Load balancing, sharding, caching, and CAP trade-offs." },
          { slug: "distributed-systems", name: "Distributed Systems", monogram: "DI", blurb: "Consensus, replication, and failure modes." },
        ],
      },
      {
        slug: "interview",
        name: "Interview",
        topics: [
          { slug: "behavioral", name: "Behavioral", monogram: "BH", blurb: "STAR stories, conflict, ownership, and failure." },
          { slug: "resume", name: "Resume", monogram: "RS", blurb: "Framing impact and defending every line." },
          { slug: "projects", name: "Projects", monogram: "PJ", blurb: "Deep dives into what you built and why." },
        ],
      },
    ],
  },
  {
    slug: "ai-engineer",
    name: "AI Engineer",
    description:
      "ML fundamentals, deep learning, LLMs, RAG pipelines, fine-tuning, vector databases, and AI system design.",
    highlights: ["ML Fundamentals", "Deep Learning", "LLMs & RAG", "Prompt Engineering", "Fine-Tuning", "Vector DBs", "AI System Design"],
    categories: [
      {
        slug: "ai-foundations",
        name: "Foundations",
        topics: [
          { slug: "ml-fundamentals", name: "ML Fundamentals", monogram: "ML", blurb: "Supervised, unsupervised, reinforcement learning, and regularization." },
          { slug: "deep-learning", name: "Deep Learning", monogram: "DL", blurb: "Neural networks, backpropagation, and transformer self-attention." },
        ],
      },
      {
        slug: "generative-ai",
        name: "Generative AI",
        topics: [
          { slug: "llm-rag", name: "LLMs & RAG", monogram: "RG", blurb: "Retrieval-augmented generation, embeddings, hybrid search, and reranking." },
          { slug: "prompt-engineering", name: "Prompt Engineering", monogram: "PE", blurb: "Few-shot, Chain-of-Thought, system prompts, and structured output." },
          { slug: "fine-tuning", name: "Fine-Tuning", monogram: "FT", blurb: "PEFT, LoRA, QLoRA, and preference optimization." },
        ],
      },
      {
        slug: "ai-production",
        name: "Production Systems",
        topics: [
          { slug: "vector-databases", name: "Vector Databases", monogram: "VD", blurb: "HNSW, IVFFlat, FAISS, distance metrics, and metadata filtering." },
          { slug: "ai-system-design", name: "AI System Design", monogram: "AS", blurb: "AI agents, ReAct loops, function calling, and guardrails." },
        ],
      },
    ],
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    description: "SQL, statistics, and the tooling to turn a question into a defensible answer.",
    highlights: ["SQL", "Statistics", "Python", "Excel", "Visualization"],
    categories: [
      {
        slug: "querying",
        name: "Querying",
        topics: [
          { slug: "sql", name: "SQL", monogram: "SQ", blurb: "Joins, window functions, aggregation, and query plans." },
          { slug: "excel", name: "Excel", monogram: "XL", blurb: "Lookups, pivots, and modelling without a database." },
        ],
      },
      {
        slug: "analysis",
        name: "Analysis",
        topics: [
          { slug: "statistics", name: "Statistics", monogram: "ST", blurb: "Distributions, significance, and experiment design." },
          { slug: "python-analysis", name: "Python for Analysis", monogram: "PA", blurb: "pandas, cleaning, and reproducible notebooks." },
          { slug: "visualization", name: "Visualization", monogram: "VZ", blurb: "Choosing the form that makes the finding obvious." },
        ],
      },
    ],
  },
  {
    slug: "data-engineer",
    name: "Data Engineer",
    description: "Pipelines, warehouses, and the systems that keep data correct at scale.",
    highlights: ["SQL", "Python", "ETL", "Data Warehousing", "Spark"],
    categories: [
      {
        slug: "foundations",
        name: "Foundations",
        topics: [
          { slug: "sql-engineering", name: "SQL", monogram: "SQ", blurb: "Performance, partitioning, and modelling for scale." },
          { slug: "python-engineering", name: "Python", monogram: "PY", blurb: "Batch jobs, testing, and packaging." },
        ],
      },
      {
        slug: "pipelines",
        name: "Pipelines",
        topics: [
          { slug: "etl", name: "ETL", monogram: "ET", blurb: "Orchestration, idempotency, and backfills." },
          { slug: "data-warehousing", name: "Data Warehousing", monogram: "DW", blurb: "Star schemas, slowly changing dimensions, and marts." },
          { slug: "spark", name: "Spark", monogram: "SP", blurb: "Shuffles, partitioning, and skew." },
        ],
      },
    ],
  },
  {
    slug: "business-analyst",
    name: "Business Analyst",
    description: "Requirements, analysis, and the communication that moves a decision forward.",
    highlights: ["Requirements", "SQL", "Excel", "Analytics", "Agile"],
    categories: [
      {
        slug: "discovery",
        name: "Discovery",
        topics: [
          { slug: "requirements", name: "Requirements", monogram: "RQ", blurb: "Elicitation, user stories, and acceptance criteria." },
          { slug: "agile", name: "Agile", monogram: "AG", blurb: "Ceremonies, backlog health, and estimation." },
        ],
      },
      {
        slug: "analysis-ba",
        name: "Analysis",
        topics: [
          { slug: "sql-ba", name: "SQL", monogram: "SQ", blurb: "Answering business questions from the warehouse." },
          { slug: "excel-ba", name: "Excel", monogram: "XL", blurb: "Modelling, scenarios, and sensitivity." },
          { slug: "analytics", name: "Analytics", monogram: "AN", blurb: "Metrics, funnels, and cohort thinking." },
        ],
      },
    ],
  },
  {
    slug: "product-manager",
    name: "Product Manager",
    description:
      "Product strategy, user-centric design, North Star metrics, feature prioritization, and experimentation.",
    highlights: ["Product Strategy", "Product Design", "Metrics & KPIs", "Prioritization", "A/B Testing"],
    categories: [
      {
        slug: "pm-strategy",
        name: "Strategy & Design",
        topics: [
          { slug: "product-strategy", name: "Product Strategy", monogram: "PS", blurb: "TAM/SAM/SOM market sizing, positioning, and go-to-market." },
          { slug: "product-design", name: "Product Design", monogram: "PD", blurb: "Jobs-to-be-Done (JTBD), user teardowns, and pain point prioritization." },
        ],
      },
      {
        slug: "pm-execution",
        name: "Execution & Analytics",
        topics: [
          { slug: "metrics-execution", name: "Metrics & KPIs", monogram: "MK", blurb: "North Star Metric, input drivers, and guardrail counter-metrics." },
          { slug: "prioritization", name: "Prioritization", monogram: "PR", blurb: "RICE scoring, MoSCoW, tech debt vs feature tradeoffs." },
          { slug: "growth-ab-testing", name: "Growth & A/B Testing", monogram: "AB", blurb: "Hypothesis testing, statistical significance, sample size, and SRM." },
        ],
      },
    ],
  },
];

export const roleBySlug = (slug: string) => roles.find((role) => role.slug === slug);

/** Flat topic list with its role and category, for lookups and breadcrumbs. */
export const allTopics = roles.flatMap((role) =>
  role.categories.flatMap((category) =>
    category.topics.map((topic) => ({ role, category, topic })),
  ),
);

export const DSA_TOPIC_SLUG = "dsa";
