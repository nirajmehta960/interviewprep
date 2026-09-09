import type { ConceptualQuestion } from "../conceptual";

export const productManagerQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "product-strategy",
    slug: "tam-sam-som-market-sizing",
    title: "Market Sizing & TAM, SAM, SOM Framework",
    difficulty: "MEDIUM",
    subtopic: "Strategy & Design",
    synopsis: "Total demand vs target segment vs realistic obtainable market share in 3-5 years.",
    shortAnswer:
      "TAM (Total Addressable Market) is total global market demand. SAM (Serviceable Addressable Market) is the segment targeted by your business model and geography. SOM (Serviceable Obtainable Market) is the realistic market share captured in 3-5 years.",
    detailedExplanation: [
      "**TAM (Total Addressable Market).** Total global demand across all customer segments if 100% market share were captured.",
      "**SAM (Serviceable Addressable Market).** The portion of TAM reachable by your current product line, pricing model, and target geography.",
      "**SOM (Serviceable Obtainable Market).** The realistic market share your business can capture within 3-5 years considering sales channels, capacity, and competition.",
      "**Bottom-Up Estimation Method.** Calculated as Target Customers * Average Selling Price (ASP) * Annual Purchase Frequency. Strongly preferred over top-down report percentage filters in interviews.",
    ],
    example: {
      language: "JAVA",
      code: `// Bottom-Up Market Sizing Example for B2B AI Code Assistant:
// TAM: 30M Engineers worldwide * $300/year = $9.0B/year.
// SAM: English-speaking Enterprise Cloud Engineers (10M) * $300/year = $3.0B/year.
// SOM: Capturing 5% of SAM within 3 years = $150M ARR.`,
    },
    interviewTip:
      "In Product Management interviews, always use **Bottom-Up estimation**. State your explicit assumptions clearly, use reasonable numerical approximations, and break the math into intuitive steps.",
    commonTrap:
      "Concluding that capturing 'just 1% of a massive TAM' makes a viable product without analyzing customer acquisition costs (CAC), distribution channels, or competitive moat.",
    followUpQuestions: [
      "How do you stress-test a market size estimate if your product defines a brand new category?",
      "What is the difference between market size and market growth rate (CAGR)?",
    ],
    relatedTopics: ["Product Strategy", "Metrics & KPIs"],
    tags: ["Product Strategy", "TAM SAM SOM", "Market Sizing", "Estimation", "Product Management"],
  },
  {
    topicSlug: "product-design",
    slug: "product-teardown-jtbd",
    title: "Product Design & Jobs-to-be-Done (JTBD) Framework",
    difficulty: "MEDIUM",
    subtopic: "Strategy & Design",
    synopsis: "Functional, emotional, and social customer motivations vs demographic profiling.",
    shortAnswer:
      "The Jobs-to-be-Done (JTBD) framework focuses on the underlying functional, emotional, and social 'job' a customer 'hires' a product to perform, rather than demographics or superficial feature requests.",
    detailedExplanation: [
      "**Core Concept.** 'People don't want to buy a quarter-inch drill bit. They want a quarter-inch hole.' — Theodore Levitt.",
      "**JTBD Statement.** When [Situation], I want to [Motivation], so that I can [Expected Outcome].",
      "**Functional vs Emotional vs Social Jobs.** Functional = the baseline task. Emotional = how the user wants to feel (confident, safe). Social = how the user wants to be perceived by peers.",
      "**Product Design Workflow.** 1. Define Persona & Context. 2. Deconstruct User Journey. 3. Brainstorm 3 distinct solutions. 4. Evaluate UX, tech feasibility, and ROI trade-offs.",
    ],
    example: {
      language: "JAVA",
      code: `// Case Study: Uber Eats JTBD
// Flawed Demographic View: Target suburban professionals aged 25-40.
// JTBD View: "When I am exhausted after a 10-hour workday and have zero groceries, I want a fast, friction-free way to get hot food delivered in under 30 minutes, so that I can relax without cooking or cleaning dishes."`,
    },
    interviewTip:
      "In product design interview questions ('Design X for Y'), never jump directly to solutions or UI features. Always spend the first 5 minutes defining personas, user goals, and prioritizing pain points.",
    commonTrap:
      "Designing features for edge cases before perfecting the primary user journey (the 'happy path').",
    followUpQuestions: [
      "How do you validate a JTBD hypothesis before committing engineering sprint bandwidth?",
      "What framework do you use to evaluate trade-offs between UX simplicity and advanced power-user feature density?",
    ],
    relatedTopics: ["Product Design", "Product Strategy", "Prioritization"],
    tags: ["Product Design", "JTBD", "User Research", "Product Management", "UX"],
  },
  {
    topicSlug: "metrics-execution",
    slug: "north-star-metric-counter-metrics",
    title: "Defining North Star Metrics & Guardrail Counter-Metrics",
    difficulty: "MEDIUM",
    subtopic: "Execution & Analytics",
    synopsis: "Core value measurement vs guardrails that prevent metric gaming or quality degradation.",
    shortAnswer:
      "A North Star Metric is the single key metric that best captures the core value delivered to customers and drives long-term revenue. Counter-metrics act as guardrails to prevent gaming or unintended negative side effects.",
    detailedExplanation: [
      "**Characteristics of a Good North Star Metric.** 1. Measures customer value realization. 2. Acts as a leading indicator of retention and revenue. 3. Understandable and actionable for product pods.",
      "**Examples by Model.** Spotify: Time spent listening to music. Airbnb: Nights booked. Slack: Messages sent within organization.",
      "**Guardrail Counter-Metrics.** If YouTube only optimized Watch Time, algorithms would push clickbait. Adding 'Valued Watch Time' and 'Report Rate' protects long-term trust.",
    ],
    example: {
      language: "JAVA",
      code: `// Metric System Hierarchy Example:
// North Star Metric: Spotify Total Hours Listened per Subscriber / Week
// Input Metric 1: Search Latency < 100ms
// Input Metric 2: Playlist Creation Frequency
// Guardrail Counter-Metric: Ad-Skip Rate & 30-day Subscriber Churn Rate`,
    },
    interviewTip:
      "In metric interviews, always explicitly define your North Star Metric alongside 1-2 Guardrail Metrics to show holistic executive maturity.",
    commonTrap:
      "Selecting revenue (ARR or GMV) directly as a North Star Metric. Revenue is a lagging indicator; the North Star should measure customer value creation that causes revenue.",
    followUpQuestions: [
      "Why is monthly active users (MAU) often considered a vanity metric for SaaS products?",
      "How do you align cross-functional engineering and design pods around a single input metric?",
    ],
    relatedTopics: ["Metrics & KPIs", "Growth & A/B Testing"],
    tags: ["Product Metrics", "North Star Metric", "KPIs", "Counter Metrics", "Analytics"],
  },
  {
    topicSlug: "prioritization",
    slug: "rice-prioritization-framework",
    title: "Feature Prioritization Frameworks: RICE vs MoSCoW",
    difficulty: "MEDIUM",
    subtopic: "Execution & Analytics",
    synopsis: "Quantitative score calculation (RICE) vs qualitative bucket categorization (MoSCoW).",
    shortAnswer:
      "RICE prioritizes features by scoring (Reach * Impact * Confidence) / Effort. MoSCoW categorizes features into Must-have, Should-have, Could-have, and Won't-have to scope releases and manage roadmap trade-offs.",
    detailedExplanation: [
      "**RICE Formula.** RICE Score = (Reach * Impact * Confidence) / Effort.",
      "**Reach.** Number of users affected over a specific time period (e.g. 50,000 active users/month).",
      "**Impact.** Value added per user (3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal).",
      "**Confidence.** Percentage quantifying data backing your estimate (100% = High data, 80% = Moderate, 50% = Wild guess).",
      "**Effort.** Total person-months required from engineering, product, and design.",
      "**MoSCoW Framework.** Must-Have (critical for launch), Should-Have (important workarounds exist), Could-Have (delighters), Won't-Have (explicitly out of scope).",
    ],
    example: {
      language: "JAVA",
      code: `// RICE Score Comparison Example:
// Feature A (1-Click Checkout): Reach 100k * Impact 2.0 * Confidence 80% / Effort 2.0 = Score 80,000
// Feature B (Dark Mode): Reach 150k * Impact 0.5 * Confidence 100% / Effort 1.0 = Score 75,000
// Feature C (AI Recommendations): Reach 20k * Impact 3.0 * Confidence 50% / Effort 4.0 = Score 7,500`,
    },
    interviewTip:
      "Explain how you handle stakeholder pushback when an executive's pet project gets a low RICE score. Emphasize transparent scoring criteria, data-backed confidence ratings, and alignment with quarterly OKRs.",
    commonTrap:
      "Treating prioritization formulas as rigid mathematical truth. Frameworks structure discussions; strategic vision and technical debt must also be factored in.",
    followUpQuestions: [
      "How do you balance tech debt remediation with new feature requests when engineering demands 20% refactoring bandwidth?",
      "What is the Kano Model and how does it categorize basic expectations versus delighters?",
    ],
    relatedTopics: ["Prioritization", "Product Strategy"],
    tags: ["Prioritization", "RICE", "MoSCoW", "Roadmap", "Product Management"],
  },
  {
    topicSlug: "growth-ab-testing",
    slug: "ab-testing-statistical-significance",
    title: "A/B Testing, Sample Size & Statistical Significance",
    difficulty: "HARD",
    subtopic: "Execution & Analytics",
    synopsis: "Hypothesis testing, p-values, sample size estimation, and sample ratio mismatch (SRM).",
    shortAnswer:
      "A/B testing evaluates two variants (A control, B treatment) by randomly splitting traffic. Statistical significance (p-value < 0.05) ensures observed metric differences are unlikely due to random sampling noise.",
    detailedExplanation: [
      "**Hypothesis Formulation.** Null Hypothesis (H0): Variant B has no impact on conversion rate. Alternative Hypothesis (H1): Variant B increases conversion rate.",
      "**Sample Size Drivers.** Required sample size per variant depends on Baseline Conversion Rate, Minimum Detectable Effect (MDE), Significance Level alpha (Type I false positive rate = 0.05), and Power 1-beta (Type II false negative rate = 0.80).",
      "**Sample Ratio Mismatch (SRM).** Deviations from intended 50/50 split (e.g. 52.5/47.5 with p < 0.001) signal traffic assignment bugs, caching issues, or bot filtering distortions.",
    ],
    example: {
      language: "PYTHON",
      code: `from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect_size = proportion_effectsize(prop1=0.10, prop2=0.105) # 10% to 10.5% conversion
analysis = NormalIndPower()
sample_size_per_variant = analysis.solve_power(
    effect_size=effect_size,
    alpha=0.05,
    power=0.80,
    ratio=1.0
)
print(f"Required Users per Variant: {int(sample_size_per_variant):,}")`,
    },
    interviewTip:
      "Mention common experiment pitfalls: Peeking Problem (checking p-values daily without sequential testing correction), Novelty Effect (temporary metric lift due to UI curiosity), and Seasonality.",
    commonTrap:
      "Stopping an A/B test early as soon as p < 0.05 appears on Day 2. Early peeking inflates false positive rates from 5% up to 30%+.",
    followUpQuestions: [
      "How do you handle A/B test results where conversion rate increases but average order value (AOV) drops?",
      "What is Multi-Armed Bandit (MAB) testing and when should you use it over traditional A/B testing?",
    ],
    relatedTopics: ["Growth & A/B Testing", "Metrics & KPIs"],
    tags: ["A/B Testing", "Statistics", "Sample Size", "Growth", "Experimentation"],
  },
];
