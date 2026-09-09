import type { ConceptualQuestion } from "../conceptual";

export const dataAnalystQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     SQL (Querying)
     ========================================================================== */
  {
    topicSlug: "sql",
    slug: "sql-joins-inner-outer-cross",
    title: "What are the differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and CROSS JOIN?",
    difficulty: "EASY",
    subtopic: "Joins & Aggregations",
    synopsis: "Matching rows vs preserving un-matched left/right rows vs Cartesian products.",
    shortAnswer:
      "INNER JOIN returns only matching rows present in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right (with NULLs for non-matches). RIGHT JOIN is the reverse. FULL OUTER JOIN returns all rows from both tables. CROSS JOIN produces a Cartesian product (N × M rows).",
    detailedExplanation: [
      "**INNER JOIN.** Filters results down to rows satisfying the ON predicate in both tables.",
      "**LEFT JOIN (LEFT OUTER JOIN).** Preserves every record from the left (first) table regardless of matches in the right table. Non-matching right columns are filled with NULLs. Essential when identifying missing associations (e.g. users who have never placed an order).",
      "**RIGHT JOIN.** Preserves every record from the right table. Less common in practice since queries are usually rewritten as LEFT JOIN for readability.",
      "**FULL OUTER JOIN.** Combines results of both LEFT and RIGHT joins, preserving un-matched rows from both sides.",
      "**CROSS JOIN.** Combines every row of table A with every row of table B without an ON condition, yielding A × B rows (used for generating date series or matrix grids).",
    ],
    example: {
      language: "JAVA",
      code: `-- Find all users and their orders (including users with ZERO orders)
SELECT u.user_id, u.name, o.order_id, o.amount
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;

-- Find users who NEVER placed an order (Filtering un-matched rows)
SELECT u.user_id, u.name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;`,
    },
    interviewTip:
      "Using `LEFT JOIN ... WHERE right_table.id IS NULL` is the standard SQL pattern for finding missing records (e.g. inactive users, unpurchased items) and is frequently asked in Data Analyst interviews.",
    commonTrap:
      "Adding a WHERE condition on the right table without checking for NULLs, which silently converts a LEFT JOIN into an INNER JOIN.",
    followUpQuestions: [
      "How does SQL handle NULL values in WHERE filters vs JOIN conditions?",
      "What is the performance difference between LEFT JOIN and EXISTS?",
      "How to avoid duplicate rows during a 1-to-many JOIN?",
    ],
    relatedTopics: ["SQL", "Joins", "Data Querying"],
    tags: ["SQL", "Joins"],
  },
  {
    topicSlug: "sql",
    slug: "sql-window-functions-row-number-rank-dense-rank",
    title: "What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL?",
    difficulty: "MEDIUM",
    subtopic: "Window Functions",
    synopsis: "Handling duplicate ties in ordered window partitions.",
    shortAnswer:
      "All three assign sequential integer rankings to rows within a partition. ROW_NUMBER() assigns distinct sequential integers ignoring ties (1,2,3,4). RANK() assigns identical ranks to tied values and skips subsequent ranks (1,2,2,4). DENSE_RANK() assigns identical ranks to tied values without skipping subsequent ranks (1,2,2,3).",
    detailedExplanation: [
      "**ROW_NUMBER().** Always unique per partition (1, 2, 3, 4, 5). If two employees have identical salaries, their row numbers are assigned arbitrarily based on query execution order.",
      "**RANK().** Ties share the same rank, and gaps are left in the sequence (1, 2, 2, 4, 5). Rank 3 is skipped because two rows tied for rank 2.",
      "**DENSE_RANK().** Ties share the same rank, but NO gaps are left in the sequence (1, 2, 2, 3, 4). Next distinct rank is incremented by 1.",
    ],
    example: {
      language: "JAVA",
      code: `-- Find Top 2 Highest Paid Employees Per Department (Handling Ties Correctly)
WITH RankedSalaries AS (
  SELECT 
    employee_id, department_id, salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT * FROM RankedSalaries WHERE rnk <= 2;`,
    },
    interviewTip:
      "Always use `DENSE_RANK()` when asked to find the 'Top N items per category with ties' (e.g. 2nd highest salary), because `RANK()` might skip rank 2 if there's a tie for rank 1!",
    commonTrap:
      "Using `ROW_NUMBER()` when ties exist, resulting in non-deterministic random selection of tied records.",
    followUpQuestions: [
      "What is the difference between PARTITION BY and GROUP BY?",
      "How do LAG() and LEAD() window functions work?",
      "What are running totals using SUM() OVER (ORDER BY date)?",
    ],
    relatedTopics: ["SQL", "Window Functions", "Analytics"],
    tags: ["SQL", "Analytics"],
  },
  {
    topicSlug: "sql",
    slug: "sql-group-by-vs-having",
    title: "What is the difference between WHERE and HAVING clauses in SQL?",
    difficulty: "EASY",
    subtopic: "Query Execution",
    synopsis: "Pre-aggregation row filtering vs post-aggregation group filtering.",
    shortAnswer:
      "WHERE filters individual raw rows BEFORE aggregation (GROUP BY) takes place and cannot contain aggregate functions like SUM() or COUNT(). HAVING filters grouped summary rows AFTER aggregation takes place and is used exclusively with aggregate functions.",
    detailedExplanation: [
      "**WHERE Clause.** Evaluated first in query execution order. Filters table rows individually before any grouping or calculation occurs. Efficient because it reduces input size for GROUP BY.",
      "**HAVING Clause.** Evaluated after GROUP BY. Filters groups based on aggregate results (\`HAVING COUNT(*) > 5\` or \`HAVING SUM(amount) > 1000\`).",
      "**Combining Both.** You can use WHERE to filter initial rows (e.g., \`WHERE status = 'COMPLETED'\`) and HAVING to filter aggregated groups (e.g., \`HAVING SUM(amount) > 500\`).",
    ],
    example: {
      language: "JAVA",
      code: `-- Find departments with more than 5 high-salary (> $80k) employees
SELECT department_id, COUNT(*) as high_earners
FROM employees
WHERE salary > 80000        -- 1. Pre-aggregation row filter
GROUP BY department_id      -- 2. Grouping
HAVING COUNT(*) > 5;        -- 3. Post-aggregation group filter`,
    },
    interviewTip:
      "Mention SQL Query Execution Order: FROM ➔ JOIN ➔ WHERE ➔ GROUP BY ➔ HAVING ➔ SELECT ➔ DISTINCT ➔ ORDER BY ➔ LIMIT. Demonstrating knowledge of execution order sets you apart.",
    commonTrap:
      "Attempting to put `WHERE COUNT(*) > 5`, which causes a SQL syntax error.",
    followUpQuestions: [
      "What is the full logical SQL processing execution order?",
      "Can HAVING be used without GROUP BY?",
    ],
    relatedTopics: ["SQL", "Aggregations", "Query Execution"],
    tags: ["SQL", "Fundamentals"],
  },

  /* ==========================================================================
     Excel (Querying)
     ========================================================================== */
  {
    topicSlug: "excel",
    slug: "xlookup-vs-vlookup-index-match",
    title: "What is the difference between VLOOKUP, INDEX/MATCH, and XLOOKUP in Excel?",
    difficulty: "EASY",
    subtopic: "Lookup Functions",
    synopsis: "Rigid left-to-right lookup vs dynamic 2D index lookup vs modern XLOOKUP.",
    shortAnswer:
      "VLOOKUP searches for a value in the leftmost column of a table and returns a value to the right (fragile to column insertion). INDEX/MATCH decouples search column from return column, supporting leftward and 2D lookups. XLOOKUP is modern Excel's default lookup: fast, supports leftward lookups, defaults to exact match, and handles missing values without IFERROR.",
    detailedExplanation: [
      "**VLOOKUP(lookup_val, table_array, col_index, [range_lookup]).** Requires lookup column to be the 1st column in range. Using hardcoded column index numbers breaks formulas when columns are inserted or deleted.",
      "**INDEX(return_range, MATCH(lookup_val, lookup_range, 0)).** Dynamic. Does not break when columns are modified, supports looking up values to the left, and uses less memory.",
      "**XLOOKUP(lookup_val, lookup_array, return_array, [if_not_found], [match_mode]).** Modern replacement. Supports leftward lookup, built-in error handling (\`if_not_found\`), search from bottom, and defaults to exact match.",
    ],
    example: {
      language: "JAVA",
      code: `// VLOOKUP (Fragile, Left-to-Right Only)
=VLOOKUP(A2, Customers!A:D, 4, FALSE)

// INDEX/MATCH (Flexible, Dynamic)
=INDEX(Customers!D:D, MATCH(A2, Customers!A:A, 0))

// XLOOKUP (Modern, Safe, Handles Errors)
=XLOOKUP(A2, Customers!A:A, Customers!D:D, "Not Found")`,
    },
    interviewTip:
      "If interviewing for a financial or data analyst role, explain why XLOOKUP/INDEX-MATCH is preferred over VLOOKUP: inserting a new column into a VLOOKUP worksheet breaks all downstream model calculations.",
    commonTrap:
      "Forgetting `FALSE` (exact match) in VLOOKUP, which defaults to `TRUE` (approximate match) and returns incorrect data on unsorted lists.",
    followUpQuestions: [
      "How do SUMIFS and COUNTIFS handle multiple criteria?",
      "What is a Dynamic Array formula in Excel (FILTER, UNIQUE, SORT)?",
    ],
    relatedTopics: ["Excel", "Data Analysis", "Lookup Functions"],
    tags: ["Excel", "Analytics"],
  },

  /* ==========================================================================
     Statistics (Analysis)
     ========================================================================== */
  {
    topicSlug: "statistics",
    slug: "ab-testing-p-value-hypothesis",
    title: "How do you design an A/B Test and interpret P-Values and Statistical Significance?",
    difficulty: "MEDIUM",
    subtopic: "Experimentation",
    synopsis: "Null hypothesis, alpha threshold, p-value interpretation, and sample size power.",
    shortAnswer:
      "An A/B test compares a Control (A) and Variant (B) to evaluate product changes. We establish a Null Hypothesis (H0: no difference) and Alternative Hypothesis (H1: Variant B is better). The p-value is the probability of observing test results at least as extreme assuming H0 is true. If p-value < alpha (typically 0.05), we reject H0 and declare statistical significance.",
    detailedExplanation: [
      "**1. Formulate Hypothesis & Metric.** Define primary metric (e.g. Conversion Rate) and minimum detectable effect (MDE).",
      "**2. Sample Size & Power Calculation.** Determine required sample size based on statistical power ($1 - \\beta = 0.80$) and significance level ($\\alpha = 0.05$). Prevents stopping tests early (peeking problem).",
      "**3. Randomization.** Randomly assign users to Control vs Variant to control for confounding variables.",
      "**4. Statistical Evaluation.** Calculate test statistic (Z-test or T-test) and p-value. If p < 0.05, the observed uplift is unlikely due to random chance.",
    ],
    example: {
      language: "PYTHON",
      code: `import scipy.stats as stats

# A/B Test Results: Conversion Counts
control_converted, control_total = 120, 1000  # 12.0% conversion
variant_converted, variant_total = 155, 1000  # 15.5% conversion

# Two-sample Z-test for proportions
z_stat, p_value = stats.proportions_ztest(
    [control_converted, variant_converted], 
    [control_total, variant_total]
)

print(f"P-Value: {p_value:.4f}")
# If p_value < 0.05: Reject H0! Variant B is statistically significantly better.`,
    },
    interviewTip:
      "Beware the 'Peeking Problem'! Explain why checking p-values daily and stopping the test as soon as p < 0.05 inflates Type I errors (False Positives). Tests must run for their pre-calculated duration.",
    commonTrap:
      "Interpreting p-value as 'the probability that Variant B is better'. P-value is P(Data | H0), not P(H0 | Data).",
    followUpQuestions: [
      "What is Statistical Power (1 - Beta)?",
      "How do you handle Novelty Effect and Seasonality in A/B testing?",
      "What is Type I Error vs Type II Error?",
    ],
    relatedTopics: ["Statistics", "A/B Testing", "Hypothesis Testing"],
    tags: ["Statistics", "Experimentation"],
  },
  {
    topicSlug: "statistics",
    slug: "central-limit-theorem",
    title: "What is the Central Limit Theorem (CLT) and why is it fundamental to statistics?",
    difficulty: "EASY",
    subtopic: "Fundamentals",
    synopsis: "Sampling distribution of the mean approaches normal distribution as sample size N increases.",
    shortAnswer:
      "The Central Limit Theorem (CLT) states that for any independent, identically distributed random variables (regardless of their underlying population distribution shape), the sampling distribution of the sample mean approaches a Normal (Gaussian) distribution as the sample size (N ≥ 30) becomes large.",
    detailedExplanation: [
      "**Population Agnostic.** Whether the original data is skewed, uniform, or bimodal, the distribution of sample *means* will be normally distributed.",
      "**Mean & Standard Error.** The mean of the sampling distribution equals the population mean ($\\mu$), and its standard deviation (Standard Error) is $\\sigma / \\sqrt{N}$.",
      "**Foundation for Hypothesis Testing.** CLT is the reason why Z-tests, T-tests, and confidence intervals work in practice for real-world messy data.",
    ],
    example: {
      language: "PYTHON",
      code: `import numpy as np

# Non-normal skewed population (Exponential distribution)
population = np.random.exponential(scale=2.0, size=100_000)

# Take 1,000 samples of size N=50 and compute their means
sample_means = [np.mean(np.random.choice(population, size=50)) for _ in range(1000)]

# sample_means is now Normally Distributed! (Mean ≈ 2.0, Std ≈ 2.0 / sqrt(50))`,
    },
    interviewTip:
      "Highlight the practical application: CLT allows analysts to compute confidence intervals and perform parametric hypothesis tests even when underlying raw business metrics (like user spend or session duration) are heavily right-skewed.",
    commonTrap:
      "Confusing the population distribution with the sampling distribution of the sample mean. CLT applies to the distribution of sample *means*, not individual data points.",
    followUpQuestions: [
      "What is the difference between Standard Deviation and Standard Error?",
      "How does sample size N impact the width of a Confidence Interval?",
    ],
    relatedTopics: ["Statistics", "Probability", "CLT"],
    tags: ["Statistics", "Fundamentals"],
  },

  /* ==========================================================================
     Python for Analysis (Analysis)
     ========================================================================== */
  {
    topicSlug: "python-analysis",
    slug: "pandas-loc-vs-iloc",
    title: "What is the difference between .loc and .iloc in Pandas?",
    difficulty: "EASY",
    subtopic: "Data Manipulation",
    synopsis: "Label-based indexing vs integer position-based indexing.",
    shortAnswer:
      ".loc is label-based indexing: it selects rows and columns using explicit index labels or boolean conditions (inclusive of endpoint). .iloc is integer position-based indexing: it selects rows and columns by zero-based integer positions (0 to N-1, exclusive of endpoint).",
    detailedExplanation: [
      "**.loc[row_label, col_label].** References index names and column header strings. Slicing with \`.loc['a':'c']\` INCLUDES both 'a' and 'c'. Accepts boolean vectors (\`df[df['age'] > 30]\`).",
      "**.iloc[row_pos, col_pos].** References 0-based integer positions regardless of index labels. Slicing with \`.iloc[0:3]\` EXCLUDES index 3 (returns rows 0, 1, 2).",
    ],
    example: {
      language: "PYTHON",
      code: `import pandas as pd

df = pd.DataFrame({'age': [25, 30, 35], 'salary': [50k, 60k, 70k]}, index=['alice', 'bob', 'charlie'])

# .loc (Label-based)
df.loc['bob', 'salary']       # 60000
df.loc[df['age'] > 28, :]      # Filter rows by boolean condition

# .iloc (Position-based)
df.iloc[1, 1]                  # 60000 (Row index 1, Col index 1)
df.iloc[0:2, 0:2]              # Rows 0 & 1, Cols 0 & 1`,
    },
    interviewTip:
      "Remember: `.loc` is INCLUSIVE of both start and stop labels; `.iloc` is EXCLUSIVE of the stop integer (standard Python slice behavior).",
    commonTrap:
      "Using `.loc[0:2]` on a DataFrame with a non-integer or unsorted index expecting position-based slicing. Use `.iloc` for position slicing.",
    followUpQuestions: [
      "How to avoid SettingWithCopyWarning in Pandas?",
      "What is the difference between df.groupby() and df.pivot_table()?",
    ],
    relatedTopics: ["Pandas", "Python", "Data Cleaning"],
    tags: ["Python", "Pandas"],
  },

  /* ==========================================================================
     Visualization (Analysis)
     ========================================================================== */
  {
    topicSlug: "visualization",
    slug: "chart-selection-guide-data-viz",
    title: "How do you select the right Chart Type for different Data Visualization goals?",
    difficulty: "EASY",
    subtopic: "Data Storytelling",
    synopsis: "Matching visual encodings (bar, line, scatter, boxplot, heatmap) to data relationships.",
    shortAnswer:
      "Chart selection depends on data relationships: Line charts show trends over continuous time; Bar charts compare discrete categorical values; Scatter plots show correlation between 2 continuous variables; Histograms/Boxplots show distributions; Heatmaps show 2D matrix intensity.",
    detailedExplanation: [
      "**Trends over Time:** Line Chart (continuous time-series data).",
      "**Categorical Comparison:** Bar Chart (Vertical for few categories, Horizontal for long category labels).",
      "**Correlation / Relationship:** Scatter Plot (2 continuous variables). Add a regression trendline to show direction.",
      "**Distribution:** Histogram (single continuous variable frequency), Box Plot (shows median, quartiles, and outliers across groups).",
      "**Part-to-Whole:** Stacked Bar Chart or Donut Chart (limit to 3-5 categories; avoid 3D pie charts!).",
    ],
    example: {
      language: "PYTHON",
      code: `import matplotlib.pyplot as plt
import seaborn as sns

# Scatter Plot: Correlation between Ad Spend & Revenue
sns.scatterplot(data=df, x='ad_spend', y='revenue', hue='channel')
plt.title("Ad Spend vs Revenue Correlation by Marketing Channel")
plt.show()`,
    },
    interviewTip:
      "Emphasize Data Storytelling: 'A chart should answer a business question within 5 seconds without requiring an explanation.' Mention eliminating chart junk (unnecessary 3D effects, background grid lines, rainbow colors).",
    commonTrap:
      "Using pie charts with 10+ categories or 3D visual effects that distort bar heights.",
    followUpQuestions: [
      "What are Gestalt principles in visualization design?",
      "Difference between Measures and Dimensions in Tableau / Power BI?",
    ],
    relatedTopics: ["Visualization", "Tableau", "Data Storytelling"],
    tags: ["Visualization", "Design"],
  },
];
