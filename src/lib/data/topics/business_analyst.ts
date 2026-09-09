import type { ConceptualQuestion } from "../conceptual";

export const businessAnalystQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     Requirements (Discovery)
     ========================================================================== */
  {
    topicSlug: "requirements",
    slug: "functional-vs-non-functional-requirements",
    title: "What is the difference between Functional and Non-Functional Requirements?",
    difficulty: "EASY",
    subtopic: "Requirements Gathering",
    synopsis: "What the system does (behavior) vs how well the system performs (quality attributes).",
    shortAnswer:
      "Functional Requirements (FRs) define WHAT the system must do: specific behaviors, features, calculations, data workflows, and business rules (e.g., 'User can transfer funds via SMS'). Non-Functional Requirements (NFRs) define HOW the system performs: quality attributes like performance, scalability, security, availability, and usability (e.g., 'Fund transfer response must be < 500ms').",
    detailedExplanation: [
      "**Functional Requirements (System Behavior).** Direct features that deliver business value. Examples: User registration, payment processing, report generation, role-based access control.",
      "**Non-Functional Requirements (Quality & Constraints).** Technical constraints that determine user experience and system operational viability. Categories include:",
      "- *Performance & Latency:* 99th percentile API response time < 200ms.",
      "- *Availability:* 99.99% system uptime (four nines).",
      "- *Security:* Data at rest encrypted via AES-256; PCI-DSS compliance.",
      "- *Scalability:* Support 10,000 concurrent active users during peak hours.",
      "**BRD vs FRD vs PRD.** Business Requirements Document (BRD) = Why & High-level Goals; Functional Requirements Document (FRD) / Product Requirements Document (PRD) = Detailed FRs & NFRs.",
    ],
    example: {
      language: "JAVA",
      code: `// Business Requirements Summary Example:
// Functional Requirement (FR-101):
// "When a user submits an order, the system must send a confirmation email containing the order summary."

// Non-Functional Requirement (NFR-201):
// "Order confirmation emails must be delivered to the user's inbox within 30 seconds of order placement under peak load of 500 orders/sec."`,
    },
    interviewTip:
      "A classic BA interview question asks: 'If a project is running late, can you cut Non-Functional Requirements to meet the deadline?'. Answer that cutting NFRs (like security or performance testing) introduces technical debt and production risk; instead, descope non-critical Functional scope.",
    commonTrap:
      "Treating NFRs as optional 'nice-to-haves'. A functional payment button is useless if the NFR latency is 45 seconds and times out.",
    followUpQuestions: [
      "How do you elicit requirements from non-technical stakeholders?",
      "What is MoSCoW prioritization (Must have, Should have, Could have, Won't have)?",
      "Difference between BRD, PRD, and User Stories?",
    ],
    relatedTopics: ["Requirements", "BA Fundamentals", "NFRs"],
    tags: ["Business Analyst", "Requirements"],
  },
  {
    topicSlug: "requirements",
    slug: "user-story-invest-framework",
    title: "How do you write effective User Stories using the INVEST Framework and Acceptance Criteria?",
    difficulty: "MEDIUM",
    subtopic: "Agile Requirements",
    synopsis: "User perspective stories (As a... I want... So that...) with Given-When-Then criteria.",
    shortAnswer:
      "A User Story expresses a feature from the end-user's perspective: 'As a [user role], I want [goal], So that [benefit]'. Effective user stories follow the INVEST framework (Independent, Negotiable, Valuable, Estimable, Small, Testable) and contain explicit Given-When-Then Acceptance Criteria.",
    detailedExplanation: [
      "**User Story Template.** 'As a [registered customer], I want to [save items to a wishlist], So that [I can purchase them later when on sale]'.",
      "**INVEST Framework:**",
      "- **I — Independent:** Stories can be developed/released in any order without blocking dependencies.",
      "- **N — Negotiable:** Details are co-created through team conversation, not set in rigid stone.",
      "- **V — Valuable:** Delivers explicit value to end-users or business.",
      "- **E — Estimable:** Team understands scope enough to estimate story points.",
      "- **S — Small:** Fits within a single sprint (typically 1-3 days of effort).",
      "- **T — Testable:** Clear acceptance criteria allow QA to write pass/fail tests.",
      "**Given-When-Then Acceptance Criteria (BDD).** Sets clear boundary test conditions: 'Given [initial state], When [action occurs], Then [expected result]'.",
    ],
    example: {
      language: "JAVA",
      code: `// User Story: Add Item to Cart
// Acceptance Criteria (Given-When-Then):

// Scenario 1: Successful Add to Cart
// GIVEN a logged-in user is on a product page with available stock
// WHEN the user clicks the "Add to Cart" button
// THEN the item is added to their cart
// AND the header cart counter increments by 1.

// Scenario 2: Out of Stock Item
// GIVEN a user is on a product page with 0 inventory
// WHEN the user views the page
// THEN the "Add to Cart" button is disabled with text "Out of Stock".`,
    },
    interviewTip:
      "Explain the 3 Cs of User Stories: **Card** (written title/token), **Conversation** (discussion between BA, PO, Dev, and QA), and **Confirmation** (Acceptance Criteria defining when the story is 'Done').",
    commonTrap:
      "Writing User Stories as technical implementation tasks (e.g. 'Create database table in PostgreSQL') instead of user-focused business goals.",
    followUpQuestions: [
      "What is the difference between a User Story, an Epic, and a Task?",
      "How do you handle technical debt stories versus business feature stories?",
      "What is the Definition of Done (DoD) vs Definition of Ready (DoR)?",
    ],
    relatedTopics: ["User Stories", "Agile", "Acceptance Criteria"],
    tags: ["Business Analyst", "Agile"],
  },

  /* ==========================================================================
     Agile & Scrum (Discovery)
     ========================================================================== */
  {
    topicSlug: "agile",
    slug: "agile-scrum-ceremonies-backlog-refinement",
    title: "What are the 4 Scrum Ceremonies and how does a BA maintain Product Backlog Health?",
    difficulty: "EASY",
    subtopic: "Scrum Framework",
    synopsis: "Sprint Planning, Daily Standup, Sprint Review, Retrospective, and Backlog Grooming.",
    shortAnswer:
      "The 4 official Scrum Ceremonies are Sprint Planning (selecting sprint goal & scope), Daily Standup (15-min sync on progress & blockers), Sprint Review (demoing working increment to stakeholders), and Sprint Retrospective (team process reflection). The BA/PO continuously performs Backlog Refinement (Grooming) to keep stories prioritized, estimated, and ready for sprint planning.",
    detailedExplanation: [
      "**1. Sprint Planning.** Team commits to a Sprint Backlog for the next 2-week cycle based on historical velocity.",
      "**2. Daily Standup (15 mins).** What did I accomplish yesterday? What will I do today? Are there any blockers?",
      "**3. Sprint Review (Demo).** Demo working software to business stakeholders and gather feedback.",
      "**4. Sprint Retrospective.** What went well? What didn't go well? What actionable improvements will we commit to next sprint?",
      "**Backlog Refinement (Grooming).** Ongoing activity where the BA breaks Epics into User Stories, clarifies acceptance criteria, removes obsolete items, and ensures stories meet the Definition of Ready (DoR).",
    ],
    example: {
      language: "JAVA",
      code: `// Backlog Health Checklist for Business Analyst:
// 1. Top 2 Sprints worth of stories meet "Definition of Ready" (DoR).
// 2. Stories have clear Given-When-Then Acceptance Criteria.
// 3. Dependencies across teams are identified and unblocked.
// 4. Backlog is prioritized by Business Value (ROI) and Urgency.`,
    },
    interviewTip:
      "Highlight the role of a Business Analyst in Scrum: BAs bridge the gap between Product Owner (vision) and Engineering Team (execution), writing clear acceptance criteria and unblocking requirements during sprints.",
    commonTrap:
      "Turning Daily Standups into a status reporting session for management rather than a peer-to-peer coordination sync.",
    followUpQuestions: [
      "Difference between Scrum Master, Product Owner, and Business Analyst?",
      "How do you handle scope creep during an active Sprint?",
      "What is Kanban vs Scrum?",
    ],
    relatedTopics: ["Agile", "Scrum", "Backlog Grooming"],
    tags: ["Agile", "Scrum"],
  },

  /* ==========================================================================
     Excel for Business Analysts (Analysis)
     ========================================================================== */
  {
    topicSlug: "excel-ba",
    slug: "sensitivity-analysis-data-tables-excel",
    title: "How do you perform Sensitivity Analysis and Scenario Modeling in Excel?",
    difficulty: "EASY",
    subtopic: "Financial Modeling",
    synopsis: "Evaluating output variations (NPV, profit) under changing input assumptions.",
    shortAnswer:
      "Sensitivity Analysis evaluates how changes in key input variables (e.g. price, volume, discount rate) impact a business model outcome (e.g. Net Profit or NPV). In Excel, 1-Way and 2-Way Data Tables automate calculating outputs across variable ranges, while Scenario Manager models Best-Case, Base-Case, and Worst-Case scenarios.",
    detailedExplanation: [
      "**1-Way Data Table.** Tests how varying 1 input variable (e.g. Unit Price from $10 to $20) changes total Revenue.",
      "**2-Way Data Table.** Tests how varying 2 input variables simultaneously (e.g. Unit Price on row header, Sales Volume on column header) affects Net Income in a matrix grid.",
      "**Scenario Manager.** Stores different sets of input values (Best Case: High Sales + Low Cost; Base Case; Worst Case: Low Sales + High Cost) and generates a Scenario Summary comparison report.",
      "**Goal Seek & Solver.** Goal Seek finds the input value required to reach a target output (e.g., 'What sales volume is needed to break even?'). Solver handles multi-variable constrained optimization.",
    ],
    example: {
      language: "JAVA",
      code: `// 2-Way Data Table Grid Concept in Excel:
// Inputs: Price ($10..$15) vs Churn Rate (2%..5%) -> Output: ARR ($ Millions)
//          Churn 2%   Churn 3%   Churn 5%
// Price $10  $1.2M      $1.1M      $0.9M
// Price $12  $1.5M      $1.3M      $1.1M
// Price $15  $1.9M      $1.7M      $1.4M`,
    },
    interviewTip:
      "Explain the business purpose: Sensitivity analysis identifies which assumptions are highest risk so executive decision-makers know where to focus risk mitigation efforts.",
    commonTrap:
      "Hardcoding input values inside Excel formulas rather than linking them to dedicated Assumption Input cells.",
    followUpQuestions: [
      "How to use Goal Seek vs Solver in Excel?",
      "What is Net Present Value (NPV) and Internal Rate of Return (IRR)?",
    ],
    relatedTopics: ["Excel", "Financial Modeling", "Sensitivity Analysis"],
    tags: ["Excel", "Modeling"],
  },

  /* ==========================================================================
     Business & Product Analytics (Analysis)
     ========================================================================== */
  {
    topicSlug: "analytics",
    slug: "unit-economics-ltv-cac-ratio",
    title: "What are LTV (Customer Lifetime Value) and CAC (Customer Acquisition Cost), and what is a healthy LTV:CAC ratio?",
    difficulty: "EASY",
    subtopic: "Business Metrics",
    synopsis: "Customer acquisition payback, gross margin, churn rate, and unit economics viability.",
    shortAnswer:
      "CAC (Customer Acquisition Cost) is total sales/marketing spend divided by new customers acquired. LTV (Lifetime Value) is the net profit a customer generates over their entire relationship (ARPU × Gross Margin / Churn Rate). A healthy SaaS business model targets an LTV:CAC ratio of at least 3:1, with a CAC Payback Period of under 12 months.",
    detailedExplanation: [
      "**CAC Formula.** $CAC = \\frac{\\text{Total Sales \\& Marketing Costs}}{\\text{Number of New Customers Acquired}}$. Includes ad spend, sales salaries, and software tools.",
      "**LTV Formula (SaaS).** $LTV = \\frac{\\text{Average Revenue Per User (ARPU)} \\times \\text{Gross Margin \\%}}{\\text{Monthly Churn Rate \\%}}$.",
      "**LTV : CAC Ratios:**",
      "- $< 1.0$: Value destruction (losing money on every customer).",
      "- $1.0 - 2.0$: Underperforming / slow growth due to high acquisition costs.",
      "- $3.0$: **Industry Standard Target** (healthy, sustainable growth).",
      "- $> 5.0$: Under-investing in growth (should spend more on marketing to capture market share).",
      "**CAC Payback Period.** Time in months required for a customer to generate enough gross profit to cover their acquisition cost ($CAC / (ARPU \\times \\text{Gross Margin})$).",
    ],
    example: {
      language: "PYTHON",
      code: `# Unit Economics Calculation Example
arpu = 100        # $100/month subscription
gross_margin = 0.80 # 80% SaaS margin
monthly_churn = 0.04 # 4% monthly churn (Average lifetime = 1/0.04 = 25 months)
cac = 500         # $500 sales & marketing cost per user

ltv = (arpu * gross_margin) / monthly_churn # (100 * 0.80) / 0.04 = $2,000
ltv_cac_ratio = ltv / cac                 # $2,000 / $500 = 4.0x
cac_payback = cac / (arpu * gross_margin) # 500 / 80 = 6.25 months

print(f"LTV: {ltv}, Ratio: {ltv_cac_ratio}x, Payback: {cac_payback:.1f} months")`,
    },
    interviewTip:
      "Explain why Churn is the silent killer of LTV: even a small increase in monthly churn (e.g. 3% to 7%) cuts customer lifetime and LTV in half, ruining unit economics even if CAC is low.",
    commonTrap:
      "Calculating LTV using Revenue instead of Gross Profit ($ARPU \\times Gross Margin$). Using top-line revenue inflates LTV.",
    followUpQuestions: [
      "Difference between User Churn and Revenue Churn (Net Revenue Retention)?",
      "What is Net Expansion MRR?",
      "How to calculate CAC Payback Period?",
    ],
    relatedTopics: ["Business Metrics", "Unit Economics", "SaaS Analytics"],
    tags: ["Analytics", "Business Metrics"],
  },
  {
    topicSlug: "analytics",
    slug: "funnel-conversion-rate-drop-off-analysis",
    title: "How do you perform Funnel Conversion and Drop-Off Analysis to diagnose user friction?",
    difficulty: "MEDIUM",
    subtopic: "Product Analytics",
    synopsis: "Step-by-step conversion rates, drop-off bottlenecks, and cohort segmentation.",
    shortAnswer:
      "Funnel Analysis tracks user progression through a multi-step workflow (e.g. Landing Page ➔ Signup ➔ Onboarding ➔ Purchase). Step Conversion Rate is the percentage of users advancing to the next step. Drop-off Analysis identifies where the highest percentage of users abandon the funnel to prioritize UX friction fixes.",
    detailedExplanation: [
      "**1. Define Funnel Steps.** Establish clear sequential events (Step 1: Product Page View ➔ Step 2: Add to Cart ➔ Step 3: Checkout Initiated ➔ Step 4: Payment Completed).",
      "**2. Measure Overall vs Micro Conversion Rates.**",
      "- *Overall Funnel Conversion:* $\\frac{\\text{Completed Step 4}}{\\text{Started Step 1}}$.",
      "- *Step-to-Step Conversion:* $\\frac{\\text{Users in Step } N}{\\text{Users in Step } N-1}$.",
      "**3. Identify Bottlenecks.** Find the step with the largest percentage drop-off (e.g. 70% drop-off between Checkout and Payment).",
      "**4. Segment & Diagnose.** Breakdown funnel by Device Type (iOS vs Android), Traffic Channel (Organic vs Paid Ads), or User Cohort to isolate the root cause (e.g., broken payment button on iOS Safari).",
    ],
    example: {
      language: "JAVA",
      code: `-- SQL Funnel Conversion & Drop-off Query
WITH FunnelSteps AS (
  SELECT
    COUNT(DISTINCT landing_user_id) as step1_landing,
    COUNT(DISTINCT signup_user_id)  as step2_signup,
    COUNT(DISTINCT checkout_user_id) as step3_checkout,
    COUNT(DISTINCT paid_user_id)     as step4_paid
  FROM user_funnel_events
)
SELECT 
  step1_landing,
  step2_signup,
  ROUND(step2_signup * 100.0 / step1_landing, 1) as landing_to_signup_pct,
  step3_checkout,
  ROUND(step3_checkout * 100.0 / step2_signup, 1) as signup_to_checkout_pct,
  step4_paid,
  ROUND(step4_paid * 100.0 / step3_checkout, 1) as checkout_to_paid_pct
FROM FunnelSteps;`,
    },
    interviewTip:
      "A great BA candidate doesn't just calculate conversion percentages—they propose actionable next steps: 'When I see a 60% drop-off at payment, I check for unexpected shipping costs, lack of guest checkout, or missing local payment methods like Apple Pay.'",
    commonTrap:
      "Counting total events instead of unique users, which skews conversion rates when a single user clicks a button multiple times.",
    followUpQuestions: [
      "What is Cohort Analysis and how does it differ from Funnel Analysis?",
      "How do you distinguish between UX friction vs low user intent in funnel drop-offs?",
    ],
    relatedTopics: ["Funnel Analysis", "Product Analytics", "Conversion Rate"],
    tags: ["Analytics", "Product Strategy"],
  },
];
