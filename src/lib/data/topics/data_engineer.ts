import type { ConceptualQuestion } from "../conceptual";

export const dataEngineerQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     SQL for Data Engineering
     ========================================================================== */
  {
    topicSlug: "sql-engineering",
    slug: "database-partitioning-vs-sharding",
    title: "What is the difference between Database Partitioning and Sharding?",
    difficulty: "MEDIUM",
    subtopic: "SQL & Storage",
    synopsis: "Single-node table splitting (Range/Hash) vs horizontal multi-node database distribution.",
    shortAnswer:
      "Partitioning splits a large table into smaller, manageable chunks (partitions) within a single database instance based on a partition key (e.g. Range by date). Sharding is horizontal scaling that distributes database partitions across multiple physical database servers/nodes, requiring a routing key.",
    detailedExplanation: [
      "**Table Partitioning (Single Database Node).** Stores sub-tables on separate disk files within the same DB engine. Queries filtering on the partition key (\`WHERE created_at >= '2026-01-01'\`) skip unneeded partitions (Partition Pruning), drastically reducing I/O.",
      "**Sharding (Multi-Node Horizontal Scaling).** Distributes subsets of data across independent DB servers. Solves hardware memory and disk limits for petabyte-scale data. Requires a Shard Key and shard router.",
      "**Trade-offs.** Partitioning is transparent to application code and easy to maintain. Sharding introduces complex cross-shard joins, distributed transactions (2-Phase Commit), and re-balancing overhead.",
    ],
    example: {
      language: "JAVA",
      code: `-- PostgreSQL Range Partitioning by Date
CREATE TABLE orders (
    order_id BIGINT,
    created_at DATE NOT NULL,
    amount NUMERIC
) PARTITION BY RANGE (created_at);

-- Partition for 2026 Q1
CREATE TABLE orders_2026_q1 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

-- Query leverages Partition Pruning (Scans ONLY orders_2026_q1 table file!)
SELECT SUM(amount) FROM orders WHERE created_at = '2026-02-15';`,
    },
    interviewTip:
      "Always mention Partition Pruning! The main performance advantage of table partitioning is enabling the query engine to ignore scanning 90%+ of disk partitions that fall outside the query's date range.",
    commonTrap:
      "Choosing a low-cardinality shard key (e.g., Country), which leads to data hotspots where 80% of traffic lands on a single shard server.",
    followUpQuestions: [
      "What is Partition Pruning and how does the query planner use it?",
      "How to resolve data hotspots when sharding?",
      "Difference between Range Partitioning, Hash Partitioning, and List Partitioning?",
    ],
    relatedTopics: ["Database Partitioning", "Sharding", "Scalability"],
    tags: ["SQL", "Data Engineering", "Scalability"],
  },
  {
    topicSlug: "sql-engineering",
    slug: "indexing-columnar-vs-row-oriented",
    title: "What is the difference between Row-Oriented and Columnar Database Storage Engines?",
    difficulty: "MEDIUM",
    subtopic: "SQL & Storage",
    synopsis: "Transactional OLTP row-by-row storage vs analytical OLAP column-by-column compression.",
    shortAnswer:
      "Row-Oriented databases (PostgreSQL, MySQL) store entire data rows contiguously on disk, making single-record reads and writes (OLTP) fast. Columnar databases (Snowflake, Redshift, BigQuery, ClickHouse) store values of a single column contiguously on disk, enabling high compression ratios and ultra-fast analytical queries (OLAP) aggregations over millions of rows.",
    detailedExplanation: [
      "**Row-Oriented (OLTP - Transactional).** Reading a row fetches all columns in a single disk read. Ideal for transactional web apps (\`INSERT INTO users...\`, \`SELECT * FROM users WHERE id = 42\`). Expensive for analytics because reading 1 column from 100M rows requires reading all other columns from disk.",
      "**Columnar (OLAP - Analytical Data Warehousing).** Stores all values of Column A together, then Column B together. Queries calculating \`SUM(revenue)\` scan ONLY the revenue column file, ignoring all other 50 columns.",
      "**Compression & Vectorization.** Because all values in a column share the same data type, columnar stores achieve 5x–10x higher compression (Dictionary Encoding, Run-Length Encoding) and leverage CPU SIMD vectorization.",
    ],
    example: {
      language: "JAVA",
      code: `// OLTP Row Storage Layout on Disk:
// [Row 1: Id=1, Name='Alice', Age=30, State='NY'] [Row 2: Id=2, Name='Bob', Age=25, State='CA']

// OLAP Columnar Storage Layout on Disk:
// [Age Column: 30, 25, 40, 35, 28...] -> Compressed with Run-Length Encoding!
// [State Column: 'NY', 'CA', 'NY', 'TX'...] -> Dictionary Encoded!

// Analytical Query in OLAP:
// SELECT AVG(age) FROM users; // Reads ONLY the contiguous Age file off disk!`,
    },
    interviewTip:
      "Frame the answer around access patterns: 'Row stores optimize for write-heavy OLTP single-record lookups; Columnar stores optimize for read-heavy OLAP aggregations over subset columns.'",
    commonTrap:
      "Using a Columnar Data Warehouse (like Redshift or Snowflake) as a transactional database for single-record point updates.",
    followUpQuestions: [
      "What is Run-Length Encoding and Dictionary Encoding?",
      "Why are single-row inserts slow in Columnar Data Warehouses?",
      "What is the difference between OLTP and OLAP?",
    ],
    relatedTopics: ["Data Warehousing", "Columnar Storage", "OLAP vs OLTP"],
    tags: ["Data Engineering", "Storage Engines"],
  },

  /* ==========================================================================
     Python for Data Engineering
     ========================================================================== */
  {
    topicSlug: "python-engineering",
    slug: "chunked-data-processing-generators",
    title: "How do you process multi-gigabyte files in Python without running out of memory?",
    difficulty: "EASY",
    subtopic: "Memory & Processing",
    synopsis: "Streaming generators, memory-mapped files, and Pandas chunksize iterator.",
    shortAnswer:
      "Avoid reading the entire file into memory at once (e.g. file.read() or pd.read_csv()). Instead, use Python Generators to stream line-by-line using lazy evaluation, or use Pandas chunking (pd.read_csv(file, chunksize=10000)) to iterate over data batches sequentially in constant O(1) memory space.",
    detailedExplanation: [
      "**Streaming Line-by-Line (Python File Iterator).** In Python, a file object is an iterator that yields one line at a time. Reading with \`for line in file:\` consumes minimal RAM regardless of whether the file is 10 MB or 100 GB.",
      "**Pandas Chunksize Iterator.** \`pd.read_csv(path, chunksize=N)\` returns a \`TextFileReader\` iterator yielding DataFrames of size N. Process each chunk, append results to a database/file, and let Garbage Collection clear the processed chunk.",
      "**PyArrow & Parquet Streaming.** For columnar files, PyArrow \`ParquetFile.iter_batches()\` reads subsets of row groups without loading the entire dataset.",
    ],
    example: {
      language: "PYTHON",
      code: `import pandas as pd

# Process 50 GB log file in 100,000-row chunks in O(1) Memory Space
total_revenue = 0

for chunk in pd.read_csv("huge_sales_data.csv", chunksize=100_000):
    # Process chunk in memory
    filtered_chunk = chunk[chunk['status'] == 'COMPLETED']
    total_revenue += filtered_chunk['amount'].sum()
    # Garbage collection automatically reclaims chunk memory!

print("Total Revenue:", total_revenue)`,
    },
    interviewTip:
      "Demonstrate awareness of RAM constraints: explain that reading a 10 GB CSV into a Pandas DataFrame actually consumes ~30 GB of RAM due to object overhead and data type casting, which crashes a 16 GB server unless chunking or streaming generators are used.",
    commonTrap:
      "Using `pd.read_csv('100GB_file.csv')` directly on large production data files.",
    followUpQuestions: [
      "How do Python Generators save memory compared to List Comprehensions?",
      "What is PyArrow and how does it speed up data processing in Python?",
    ],
    relatedTopics: ["Python", "Data Processing", "Generators"],
    tags: ["Python", "Data Engineering"],
  },

  /* ==========================================================================
     ETL & Pipelines
     ========================================================================== */
  {
    topicSlug: "etl",
    slug: "etl-vs-elt-pipeline-orchestration",
    title: "What is the difference between ETL and ELT, and how do Orchestrators manage pipeline DAGs?",
    difficulty: "EASY",
    subtopic: "Pipeline Architecture",
    synopsis: "Pre-load transformation servers vs post-load cloud data warehouse transformations.",
    shortAnswer:
      "ETL (Extract, Transform, Load) transforms data on a separate processing server before loading into a target database. ELT (Extract, Load, Transform) loads raw data directly into a cloud data warehouse (Snowflake, BigQuery) first, using the warehouse's massive parallel processing engine to transform data in-place (e.g. using dbt).",
    detailedExplanation: [
      "**Traditional ETL.** Extract ➔ Transform (Python/Spark server) ➔ Load (Data Warehouse). Necessary when data warehouses were expensive or on-premise, or when PII data must be masked before loading.",
      "**Modern ELT.** Extract ➔ Load (Raw Data Lake/Warehouse) ➔ Transform (SQL inside Warehouse via dbt). Enabled by scalable, low-cost cloud storage and columnar MPP engines. Keeps raw historical data immutable for future re-transformations.",
      "**Pipeline Orchestration (Airflow/Prefect/Dagster).** Manages Directed Acyclic Graphs (DAGs) of tasks, handling task dependency ordering, automated retries, alert notifications, and execution scheduling.",
    ],
    example: {
      language: "PYTHON",
      code: `# Apache Airflow DAG Definition (ELT Pipeline)
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG("raw_to_analytics_elt", start_date=datetime(2026, 1, 1), schedule_interval="@daily") as dag:
    # 1. Extract & Load raw JSON into Snowflake
    extract_load = BashOperator(task_id="extract_to_snowflake", bash_command="python extract_api.py")
    
    # 2. Transform raw data inside Snowflake using dbt (ELT!)
    transform_elt = BashOperator(task_id="dbt_run_models", bash_command="dbt run --select tag:daily")

    extract_load >> transform_elt # Dependency chain`,
    },
    interviewTip:
      "Emphasize the main advantage of ELT: storing raw untransformed data in the warehouse means if business logic changes 6 months later, you can re-run dbt transformations over historical raw data without needing to re-extract source system data!",
    commonTrap:
      "Building complex Python transformation scripts outside the warehouse when the target database is an MPP warehouse like Snowflake that can run the transformations faster via SQL.",
    followUpQuestions: [
      "What is dbt (data build tool) and how does it fit into ELT?",
      "How do Airflow DAGs handle backfills?",
      "What makes a data pipeline task idempotent?",
    ],
    relatedTopics: ["ETL", "ELT", "Airflow", "dbt"],
    tags: ["ETL", "Pipelines", "Airflow"],
  },
  {
    topicSlug: "etl",
    slug: "data-pipeline-idempotency-backfills",
    title: "How do you design Idempotent Data Pipelines that support Historical Backfills?",
    difficulty: "MEDIUM",
    subtopic: "Pipeline Architecture",
    synopsis: "Atomic partition overwrites and deterministic execution dates to prevent duplicate data.",
    shortAnswer:
      "An Idempotent Data Pipeline produces the exact same dataset regardless of how many times a DAG run is executed for a specific logical execution date. Idempotency is achieved by parameterizing queries with the logical execution date (logical_date / ds) and using atomic partition overwrites (INSERT OVERWRITE or DELETE + INSERT) rather than append operations.",
    detailedExplanation: [
      "**Parameterize by Logical Execution Date.** Never use \`datetime.now()\` inside a pipeline! Always use the orchestrator's logical execution date (\`{{ ds }}\` in Airflow). This guarantees that running a backfill for 2025-06-01 processes data for that historical date deterministically.",
      "**Atomic Partition Overwrite.** Avoid \`INSERT INTO table\` (which appends duplicate rows on pipeline retries). Instead, use \`INSERT OVERWRITE TABLE target PARTITION (ds = '2026-01-01')\` or \`DELETE FROM target WHERE ds = '2026-01-01'\` followed by insert.",
      "**Staging & Temp Tables.** Write pipeline outputs to a staging table first, run data quality assertions (non-null checks, row count bounds), and swap or merge atomically into production tables.",
    ],
    example: {
      language: "JAVA",
      code: `-- Idempotent SQL Transformation using Atomic Partition Overwrite
INSERT OVERWRITE TABLE analytics_daily_sales
PARTITION (event_date = '{{ ds }}') -- Parameterized by Airflow execution date
SELECT 
  user_id, 
  COUNT(order_id) as total_orders, 
  SUM(amount) as total_spent
FROM raw_orders
WHERE DATE(created_at) = '{{ ds }}'
GROUP BY user_id;`,
    },
    interviewTip:
      "Explain the golden test of pipeline idempotency: 'If a pipeline fails halfway through at 3 AM and auto-retries 5 times, or if I re-run the pipeline 3 months later for a backfill, the destination table must contain ZERO duplicate rows.'",
    commonTrap:
      "Using `datetime.now()` or `CURRENT_TIMESTAMP()` in pipeline SQL queries, making historical backfills impossible.",
    followUpQuestions: [
      "Difference between execution_date and current run time in Airflow?",
      "How to implement data quality checks (Great Expectations) before atomic swaps?",
    ],
    relatedTopics: ["ETL", "Idempotency", "Airflow", "Backfills"],
    tags: ["ETL", "Pipelines", "Idempotency"],
  },

  /* ==========================================================================
     Data Warehousing
     ========================================================================== */
  {
    topicSlug: "data-warehousing",
    slug: "star-schema-vs-snowflake-schema",
    title: "What is the difference between a Star Schema and a Snowflake Schema in Dimensional Modeling?",
    difficulty: "EASY",
    subtopic: "Dimensional Modeling",
    synopsis: "Denormalized single-table dimensions vs normalized multi-table dimension hierarchies.",
    shortAnswer:
      "In Dimensional Data Modeling (Kimball methodology), a Star Schema surrounds a central Fact Table with denormalized Dimension Tables (no joins between dimensions). A Snowflake Schema normalizes dimension tables into multiple sub-dimension tables (e.g. Product ➔ Subcategory ➔ Category), reducing redundancy at the cost of complex multi-table JOINs.",
    detailedExplanation: [
      "**Fact Table.** Contains quantitative numerical business metrics/events (e.g., Sales Revenue, Quantity, Duration) and Foreign Keys linking to dimension tables.",
      "**Star Schema.** Dimension tables are completely denormalized. Query performance is fast because joining the Fact table to any Dimension requires only 1 single JOIN.",
      "**Snowflake Schema.** Dimension tables are normalized to 3rd Normal Form (3NF). Saves disk storage by eliminating repeated text strings, but slows down analytical queries due to multi-level JOIN hierarchies.",
      "**Industry Standard.** Modern Cloud Data Warehouses (Snowflake, BigQuery) favor Star Schemas (or wide flat tables) because storage is cheap and single-level JOIN performance is significantly faster.",
    ],
    example: {
      language: "JAVA",
      code: `-- Star Schema Query (Fast 1-level JOINs):
SELECT d.date, p.product_name, f.sales_amount
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_product p ON f.product_key = p.product_key;

-- Snowflake Schema Query (Slower Multi-level JOINs):
SELECT d.date, p.product_name, c.category_name, f.sales_amount
FROM fact_sales f
JOIN dim_product p ON f.product_key = p.product_key
JOIN dim_subcategory sub ON p.subcategory_key = sub.subcategory_key
JOIN dim_category c ON sub.category_key = c.category_key;`,
    },
    interviewTip:
      "Emphasize the Kimball Data Modeling approach: 'Star schemas optimize for query performance and analytical usability; Snowflake schemas optimize for storage normalization.' In modern cloud warehousing, Star Schema wins.",
    commonTrap:
      "Building OLTP 3NF normalized tables in a Data Warehouse, leading to horrible analytical query performance.",
    followUpQuestions: [
      "What is the difference between a Fact Table and a Dimension Table?",
      "What is a Conformed Dimension?",
      "What is a Junk Dimension vs Degenerate Dimension?",
    ],
    relatedTopics: ["Data Warehousing", "Dimensional Modeling", "Star Schema"],
    tags: ["Data Warehousing", "Modeling"],
  },
  {
    topicSlug: "data-warehousing",
    slug: "slowly-changing-dimensions-scd-type-1-2-3",
    title: "What are Slowly Changing Dimensions (SCD Type 0, 1, 2, 3) and how do they track historical changes?",
    difficulty: "MEDIUM",
    subtopic: "Dimensional Modeling",
    synopsis: "Overwrite (Type 1) vs versioned history rows (Type 2) vs previous column (Type 3).",
    shortAnswer:
      "Slowly Changing Dimensions (SCD) manage how historical changes to dimension attributes (e.g. user address or tier) are stored: Type 1 overwrites old data (no history); Type 2 inserts a new row with start/end validity dates and a surrogate key (full versioned history); Type 3 adds a 'previous_val' column (limited history).",
    detailedExplanation: [
      "**SCD Type 0 (Retain Original).** Attribute never changes (e.g. Original Registration Date).",
      "**SCD Type 1 (Overwrite).** Overwrites old attribute with new value. Simple, but historical facts retroactively reflect the new attribute. No history retained.",
      "**SCD Type 2 (Add New Row - Industry Standard).** Inserts a new dimension row with a new Surrogate Key, \`effective_start_date\`, \`effective_end_date\`, and \`is_current\` boolean flag. Preserves complete historical truth for point-in-time reporting.",
      "**SCD Type 3 (Add New Column).** Adds a \`previous_address\` column. Only tracks the immediate previous state.",
    ],
    example: {
      language: "JAVA",
      code: `-- SCD Type 2 Dimension Table Structure:
CREATE TABLE dim_customer (
    customer_key BIGINT PRIMARY KEY, -- Surrogate Key (auto-increment / hash)
    customer_id INT,                 -- Natural Business Key
    name VARCHAR(100),
    address VARCHAR(200),
    effective_start_date DATE,
    effective_end_date DATE,
    is_current BOOLEAN
);

-- Query historical customer address at the exact time an old order was placed:
SELECT o.order_id, c.name, c.address
FROM fact_orders o
JOIN dim_customer c ON o.customer_id = c.customer_id
WHERE o.order_date BETWEEN c.effective_start_date AND c.effective_end_date;`,
    },
    interviewTip:
      "Demonstrate why SCD Type 2 requires a **Surrogate Key** (synthetic primary key) separate from the Natural Business Key (`customer_id`): because a single `customer_id` will have multiple rows in the dimension table for each historical address version!",
    commonTrap:
      "Using the Natural Business Key as the Primary Key on an SCD Type 2 table, which causes primary key violation errors on the second version insertion.",
    followUpQuestions: [
      "What is a Surrogate Key and why is it necessary for SCD Type 2?",
      "How to implement SCD Type 2 using dbt snapshots?",
      "What is SCD Type 6 (Combination of 1, 2, and 3)?",
    ],
    relatedTopics: ["Data Warehousing", "SCD", "Dimensional Modeling"],
    tags: ["Data Warehousing", "SCD"],
  },

  /* ==========================================================================
     Apache Spark
     ========================================================================== */
  {
    topicSlug: "spark",
    slug: "spark-architecture-rdd-dataframe-dataset",
    title: "How does Apache Spark's Architecture work (Driver, Executors, RDDs vs DataFrames)?",
    difficulty: "EASY",
    subtopic: "Distributed Computing",
    synopsis: "Driver coordination, Executor worker tasks, and Catalyst Optimizer data abstractions.",
    shortAnswer:
      "Spark is a distributed in-memory data processing engine. A Master Driver Node converts user code into a Logical/Physical execution DAG and distributes tasks across Executor Worker Nodes. RDDs are low-level immutable distributed collections. DataFrames add a schema and leverage the Catalyst Optimizer and Tungsten engine for automated query optimization.",
    detailedExplanation: [
      "**Spark Driver & Executors.** Driver Node contains the SparkContext/SparkSession, creates the DAG, and assigns Task partitions to Executors. Executor Nodes execute tasks in parallel threads and store cached data in RAM.",
      "**RDD (Resilient Distributed Dataset).** Low-level distributed object collection with no schema optimization. Requires manual serialization overhead.",
      "**DataFrame & Catalyst Optimizer.** Higher-level structured abstraction (rows & columns). Spark's Catalyst Optimizer optimizes execution plans (predicate pushdown, projection pruning, join re-ordering) before execution.",
      "**Transformations vs Actions.** Transformations (e.g. \`map\`, \`filter\`, \`groupBy\`) are LAZY and build the DAG. Actions (e.g. \`count\`, \`collect\`, \`save\`) trigger execution.",
    ],
    example: {
      language: "PYTHON",
      code: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DataEngineeringJob").getOrCreate()

# Lazy Transformation (Builds Execution DAG, zero I/O performed)
df = spark.read.parquet("s3://data-bucket/logs/")
filtered_df = df.filter(df["status"] == 500).groupBy("endpoint").count()

# Action (Triggers Catalyst Optimization & Spark Job Execution across Executors!)
filtered_df.write.mode("overwrite").parquet("s3://data-bucket/output/")`,
    },
    interviewTip:
      "Highlight Transformations vs Actions: calling `.filter()` or `.select()` performs ZERO computation. Execution is triggered ONLY when an Action (like `.count()` or `.write()`) is called, allowing Spark to optimize the entire DAG beforehand.",
    commonTrap:
      "Calling `.collect()` on a multi-terabyte DataFrame, which pulls all distributed data into the single Driver Node memory and crashes the Driver with OutOfMemoryError.",
    followUpQuestions: [
      "What is the difference between Narrow and Wide Transformations in Spark?",
      "Why does a Wide Transformation trigger a Spark Data Shuffle?",
      "How does Spark's Catalyst Optimizer perform Predicate Pushdown?",
    ],
    relatedTopics: ["Spark", "PySpark", "Distributed Computing"],
    tags: ["Spark", "Big Data"],
  },
  {
    topicSlug: "spark",
    slug: "spark-data-skew-shuffle-optimization",
    title: "What causes Spark Data Skew and Data Shuffling, and how do you fix it using Salting?",
    difficulty: "HARD",
    subtopic: "Optimization",
    synopsis: "Uneven partition data distribution causing straggler tasks, fixed via key salting.",
    shortAnswer:
      "Data Shuffling occurs during Wide Transformations (groupBy, join) when Spark redistributes data across cluster network partitions. Data Skew occurs when 90%+ of data rows belong to a single key (e.g. nulls or popular IDs), forcing one single Executor thread to process all skewed data (Straggler Task). Salting adds random prefix keys to break up the bottleneck.",
    detailedExplanation: [
      "**Data Shuffle Bottleneck.** Network I/O and disk serialization during \`groupByKey\` or \`join\`. High shuffle write/read spills to disk when RAM is insufficient.",
      "**Data Skew Symptoms.** 99 out of 100 Spark tasks complete in 10 seconds, but 1 final task hangs at 99% for 2 hours because a single partition holds 500 million rows for key \`null\` or \`user_0\`).",
      "**Salting Technique.** Append a random integer (e.g., \`0\` to \`N-1\`) to the join key of the skewed table, and explode the matching dimension table keys by the same range. This redistributes the skewed key across N separate Executors, eliminating the straggler task.",
      "**Broadcast Join.** If one table is small (< 100 MB), use Broadcast Join (\`broadcast(small_df)\`) to send a copy of the small table to every executor, completely eliminating data shuffling!",
    ],
    example: {
      language: "PYTHON",
      code: `from pyspark.sql.functions import concat, lit, floor, rand, explode, array

# 1. Salt Skewed Table: Append random 0..3 prefix to join key
salted_fact = fact_df.withColumn(
    "salted_key", 
    concat(df["customer_id"], lit("_"), floor(rand() * 4))
)

# 2. Replicate Dimension Keys x4 to match salted keys
salted_dim = dim_df.withColumn("salt_array", array([lit(i) for i in range(4)])) \\
                   .withColumn("exploded_salt", explode("salt_array")) \\
                   .withColumn("salted_key", concat(df["customer_id"], lit("_"), df["exploded_salt"]))

# 3. Join on Salted Key (Data is now evenly split across 4 executors!)
result_df = salted_fact.join(salted_dim, "salted_key")`,
    },
    interviewTip:
      "Mention Broadcast Hash Join first for join optimization! If joining a 10 TB table to a 50 MB lookup table, broadcasting the 50 MB table avoids a 10 TB network shuffle across the cluster.",
    commonTrap:
      "Increasing cluster executor memory to fix data skew. RAM tuning does not fix data skew because a single key still lands on one single thread.",
    followUpQuestions: [
      "What is a Broadcast Hash Join in Spark?",
      "How to detect Data Skew using Spark UI Stage view?",
      "Difference between Coalesce and Repartition in PySpark?",
    ],
    relatedTopics: ["Spark", "Data Skew", "Performance Tuning"],
    tags: ["Spark", "Optimization", "Big Data"],
  },
];
