import type { ConceptualQuestion } from "../conceptual";

export const dbmsQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     1. Architecture, Fundamentals & Data Independence
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "dbms-vs-file-system",
    title: "What is a DBMS and what are its key advantages over traditional file processing systems?",
    difficulty: "EASY",
    subtopic: "DBMS Architecture",
    synopsis: "Centralized software managing data storage, concurrency, integrity, security, and recovery.",
    shortAnswer:
      "A Database Management System (DBMS) is software that manages data creation, retrieval, updating, and administration. Compared to traditional file systems, a DBMS eliminates data redundancy/inconsistency, provides ACID transactions, enforces security/integrity constraints, enables multi-user concurrency control, and automates crash recovery.",
    detailedExplanation: [
      "**Redundancy & Inconsistency:** File systems duplicate data across multiple files leading to conflicting entries; DBMS enforces a single source of truth.",
      "**Concurrent Access:** File systems lock entire files or corrupt data under simultaneous writes; DBMS uses fine-grained locking and MVCC for high-concurrency transactions.",
      "**Data Integrity:** DBMS enforces automatic rules (Primary Keys, Foreign Keys, CHECK constraints) at the database layer.",
      "**Atomicity & Crash Recovery:** DBMS uses Write-Ahead Logging (WAL) to roll back incomplete transactions after power loss or system crashes.",
    ],
    example: {
      language: "JAVA",
      code: `-- Enforcing Integrity Constraints at DBMS level
CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT CHECK (age >= 18),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    },
    interviewTip:
      "Highlight 4 core pillars: Data Abstraction, Concurrent Control, Integrity Enforcement, and Crash Recovery.",
    commonTrap:
      "Claiming file systems cannot store large datasets. File systems store files efficiently, but lack structured query language (SQL), transaction boundaries, and ACID safety.",
    followUpQuestions: [
      "What is the difference between DBMS and RDBMS?",
      "How does Write-Ahead Logging ensure crash recovery?",
    ],
    relatedTopics: ["DBMS", "Architecture", "RDBMS"],
    tags: ["DBMS", "Fundamentals", "Architecture"],
  },
  {
    topicSlug: "dbms",
    slug: "three-schema-architecture-data-independence",
    title: "What is the 3-Schema Architecture and Data Independence in DBMS?",
    difficulty: "MEDIUM",
    subtopic: "DBMS Architecture",
    synopsis: "External, Conceptual, and Internal schema levels separating application views from physical disk storage.",
    shortAnswer:
      "The 3-Schema Architecture separates the database into 3 abstraction levels: 1) External Level (user views), 2) Conceptual/Logical Level (community view / table schemas), and 3) Internal/Physical Level (disk storage structures / B-Trees). Data Independence allows modifying one level without requiring changes to higher levels.",
    detailedExplanation: [
      "**1. External Level (User Views):** Individual customized views exposed to end-users or application modules (`CREATE VIEW`).",
      "**2. Conceptual/Logical Level:** Defines database structure, entities, relationships, constraints, and data types (Database Tables & Schemas).",
      "**3. Internal/Physical Level:** Describes how data is physically stored on disk (B-Tree indexes, page blocks, file organization, hashing).",
      "**Logical Data Independence:** Ability to modify the logical schema (e.g. adding a column or table) without breaking existing external views or user queries.",
      "**Physical Data Independence:** Ability to modify physical storage or indexes (e.g. adding a B+ Tree index or moving to SSD) without altering logical SQL queries.",
    ],
    example: {
      language: "JAVA",
      code: `-- Logical Schema (Conceptual Level)
CREATE TABLE employees ( id INT, first_name VARCHAR(50), last_name VARCHAR(50), salary NUMERIC );

-- External View (External Level) - Hides salary from public UI
CREATE VIEW public_employees AS SELECT id, first_name || ' ' || last_name AS full_name FROM employees;

-- Physical Index (Internal Level) - Physical Data Independence
CREATE INDEX idx_emp_lastname ON employees(last_name);`,
    },
    interviewTip:
      "Physical Data Independence is why you can add or drop indexes without modifying application SQL SELECT statements.",
    commonTrap:
      "Confusing Logical Data Independence with Physical Data Independence. Logical handles schema changes; Physical handles index/disk storage changes.",
    followUpQuestions: [
      "What is a Database View and does it store physical data on disk?",
      "How does an API Gateway leverage external schemas?",
    ],
    relatedTopics: ["DBMS", "Architecture", "Data Independence"],
    tags: ["DBMS", "Architecture"],
  },
  {
    topicSlug: "dbms",
    slug: "rdbms-vs-nosql-comparison",
    title: "What is the difference between RDBMS and NoSQL databases?",
    difficulty: "EASY",
    subtopic: "DBMS Architecture",
    synopsis: "Structured relational tables with ACID guarantees vs flexible distributed document/key-value stores.",
    shortAnswer:
      "RDBMS stores data in structured tables with fixed schemas, enforcing strict ACID properties and relational SQL joins (PostgreSQL, MySQL, Oracle). NoSQL stores schema-less data (Documents, Key-Value, Wide-Column, Graphs), favoring horizontal scaling and high-throughput BASE properties (MongoDB, Cassandra, Redis).",
    detailedExplanation: [
      "**Data Model:** RDBMS uses tables with rows and columns. NoSQL uses JSON Documents (MongoDB), Key-Value pairs (Redis), Wide-Column families (Cassandra), or Graphs (Neo4j).",
      "**Schema:** RDBMS requires predefined rigid schemas (`CREATE TABLE`). NoSQL supports dynamic schemas (add new fields without migrations).",
      "**Scalability:** RDBMS scales vertically (more RAM/CPU on single master server). NoSQL scales horizontally (sharding across clusters of commodity servers).",
      "**Transactions:** RDBMS enforces immediate ACID guarantees. NoSQL prefers eventual consistency (BASE properties).",
    ],
    example: {
      language: "JAVA",
      code: `// RDBMS Normalized Structure (PostgreSQL)
// SELECT * FROM users U JOIN orders O ON U.id = O.user_id;

// NoSQL Embedded Document (MongoDB JSON)
{
  "_id": "usr_100",
  "name": "Niraj",
  "orders": [
    { "order_id": "ord_501", "total": 99.50 },
    { "order_id": "ord_502", "total": 14.20 }
  ]
}`,
    },
    interviewTip:
      "Summarize using ACID vs BASE: 'RDBMS prioritizes ACID transactional consistency; NoSQL prioritizes horizontal scalability and flexible schema evolution.'",
    commonTrap:
      "Believing modern RDBMS cannot scale horizontally or handle JSON. Modern PostgreSQL supports JSONB columns and horizontal read replicas natively.",
    followUpQuestions: [
      "What are the 4 types of NoSQL databases?",
      "What is the CAP theorem in distributed databases?",
    ],
    relatedTopics: ["RDBMS", "NoSQL", "Database Design"],
    tags: ["DBMS", "NoSQL", "Architecture"],
  },

  /* ==========================================================================
     2. ER Modeling & Relational Schema Design
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "er-model-components-explained",
    title: "What is an ER Model and what are its key components?",
    difficulty: "EASY",
    subtopic: "ER Modeling",
    synopsis: "High-level conceptual data model composed of Entities, Attributes, and Relationships.",
    shortAnswer:
      "An Entity-Relationship (ER) Model is a high-level conceptual data model used to design database schemas. Its key components are Entities (real-world objects), Attributes (properties of entities), and Relationships (associations between entities).",
    detailedExplanation: [
      "**Entity:** A real-world object or concept (e.g. `Student`, `Course`). Rendered as a rectangle in ER diagrams.",
      "**Entity Set:** A collection of similar entities (e.g. all students in a university).",
      "**Attribute:** Properties describing an entity (e.g. `Student_ID`, `Email`). Rendered as ovals.",
      "**Relationship:** Association between two or more entities (e.g. Student *Enrolls* in Course). Rendered as diamonds.",
      "**Cardinality Ratios:** 1-to-1, 1-to-Many, Many-to-1, Many-to-Many.",
    ],
    example: {
      language: "JAVA",
      code: `-- Converting ER Relationship (Many-to-Many) into Relational Tables
CREATE TABLE students ( id INT PRIMARY KEY, name VARCHAR(100) );
CREATE TABLE courses ( id INT PRIMARY KEY, title VARCHAR(100) );

-- Junction / Join Table representing 'Enrolls' Relationship
CREATE TABLE student_courses (
    student_id INT REFERENCES students(id),
    course_id INT REFERENCES courses(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id)
);`,
    },
    interviewTip:
      "Explain how Many-to-Many (M:N) relationships in ER diagrams MUST be mapped to relational schemas by introducing a Join/Junction table.",
    commonTrap:
      "Trying to store array of foreign keys directly in a table column instead of creating a junction table for Many-to-Many relationships.",
    followUpQuestions: [
      "How do you convert 1-to-Many vs Many-to-Many ER relationships into SQL tables?",
      "What is Weak Entity Set?",
    ],
    relatedTopics: ["ER Model", "Database Design", "Relational Schema"],
    tags: ["DBMS", "ER Modeling"],
  },
  {
    topicSlug: "dbms",
    slug: "types-of-attributes-in-er-diagram",
    title: "What are the different types of Attributes in an ER Model?",
    difficulty: "EASY",
    subtopic: "ER Modeling",
    synopsis: "Simple, Composite, Single-valued, Multi-valued, Derived, and Key attributes.",
    shortAnswer:
      "Attributes describe entity properties. They are classified into: Simple (indivisible), Composite (divisible into sub-parts), Single-valued (one value per entity), Multi-valued (multiple values per entity), Derived (calculated from another attribute), and Key attributes (uniquely identify entities).",
    detailedExplanation: [
      "**Simple Attribute:** Atomic value that cannot be divided further (e.g. `Age`, `SSN`).",
      "**Composite Attribute:** Can be subdivided into smaller sub-attributes (e.g. `Name` -> `First_Name`, `Last_Name`; `Address` -> `Street`, `City`, `Zip`).",
      "**Multi-Valued Attribute:** Entity can have multiple values (e.g. `Phone_Numbers`, `Degrees`). Drawn as double ovals in ER diagrams.",
      "**Derived Attribute:** Calculated dynamically from stored attributes (e.g. `Age` derived from `Date_Of_Birth`). Drawn as dashed ovals.",
      "**Key Attribute:** Attribute whose value uniquely identifies an entity (e.g. `Student_ID`). Drawn with underlined text.",
    ],
    example: {
      language: "JAVA",
      code: `-- Mapping Multi-valued Attribute (Phone_Numbers) to Relational Schema
CREATE TABLE employee_phones (
    employee_id INT REFERENCES employees(id),
    phone_number VARCHAR(20),
    PRIMARY KEY (employee_id, phone_number) -- Multi-valued mapped to separate table!
);`,
    },
    interviewTip:
      "Never store Derived attributes (like `Age`) directly in database columns; compute them dynamically in SQL queries using `AGE(dob)` or generated columns to prevent stale data.",
    commonTrap:
      "Storing multi-valued attributes as comma-separated strings (`phone = '123,456'`) in a single column, violating 1st Normal Form (1NF).",
    followUpQuestions: [
      "How does 1NF eliminate multi-valued attributes?",
      "What is a generated column in PostgreSQL?",
    ],
    relatedTopics: ["ER Model", "Normalization", "Attributes"],
    tags: ["DBMS", "ER Modeling"],
  },
  {
    topicSlug: "dbms",
    slug: "weak-entity-set-explained",
    title: "What is a Weak Entity Set and how is it represented in relational databases?",
    difficulty: "MEDIUM",
    subtopic: "ER Modeling",
    synopsis: "Entity set lacking a primary key, dependent on an identifying owner entity via partial keys.",
    shortAnswer:
      "A Weak Entity Set is an entity set that does not possess a primary key of its own. It depends on an Identifying (Owner) Entity Set for its existence. It uses a Partial Key (Discriminator) combined with the Owner's Primary Key to uniquely identify records.",
    detailedExplanation: [
      "**Characteristics:**",
      "- Does not have a primary key.",
      "- Has a Partial Key (discriminator), drawn with dashed underline in ER diagrams.",
      "- Has a Total Participation constraint with its Identifying Relationship (drawn as double diamond / double rectangle).",
      "**Real-World Example:** `Dependent` (Child/Spouse) entity set dependent on `Employee` entity set. If Employee 101 is deleted, all their Dependents are deleted (`ON DELETE CASCADE`).",
    ],
    example: {
      language: "JAVA",
      code: `-- Relational Schema for Weak Entity Set (Dependent)
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE dependents (
    emp_id INT REFERENCES employees(emp_id) ON DELETE CASCADE,
    dependent_name VARCHAR(100), -- Partial Key
    relationship VARCHAR(50),
    PRIMARY KEY (emp_id, dependent_name) -- Composite PK combining Owner PK + Partial Key!
);`,
    },
    interviewTip:
      "Remember: A Weak Entity Set's Primary Key is ALWAYS a Composite Key formed by combining the Primary Key of the Identifying Parent Entity + Partial Key of the Weak Entity.",
    commonTrap:
      "Creating an artificial auto-increment ID on a weak entity and forgetting the `ON DELETE CASCADE` foreign key constraint back to the owner entity.",
    followUpQuestions: [
      "What is Total Participation vs Partial Participation in ER diagrams?",
      "What is ON DELETE CASCADE vs ON DELETE SET NULL?",
    ],
    relatedTopics: ["ER Model", "Weak Entity", "Foreign Keys"],
    tags: ["DBMS", "ER Modeling", "Database Design"],
  },

  /* ==========================================================================
     3. Database Keys & Referential Integrity
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "keys-in-dbms-super-candidate-primary-foreign",
    title: "What are the different types of Keys in DBMS?",
    difficulty: "EASY",
    subtopic: "Database Keys",
    synopsis: "Super Key, Candidate Key, Primary Key, Alternate Key, Foreign Key, and Composite Key.",
    shortAnswer:
      "Keys uniquely identify rows and establish relationships. A Super Key is any set of columns that uniquely identifies a row. A Candidate Key is a minimal Super Key (no redundant attributes). A Primary Key is the chosen Candidate Key. An Alternate Key is an unchosen Candidate Key. A Foreign Key references a Primary Key in another table.",
    detailedExplanation: [
      "**Super Key:** Any combination of attributes that uniquely identifies a record in a table. (e.g. `{SSN}`, `{SSN, Name}`, `{Email, Phone}`).",
      "**Candidate Key:** Minimal Super Key with no unnecessary attributes. `{SSN}` and `{Email}` are Candidate Keys.",
      "**Primary Key (PK):** The single candidate key selected by database designers to identify records uniquely. Must be `NOT NULL` and `UNIQUE`.",
      "**Alternate Key:** Candidate keys that were not selected as the primary key.",
      "**Foreign Key (FK):** A column that references the Primary Key of another table, enforcing Referential Integrity.",
      "**Composite Key:** A primary key consisting of two or more columns (`PRIMARY KEY (order_id, item_id)`).",
    ],
    example: {
      language: "JAVA",
      code: `CREATE TABLE users (
    user_id BIGINT PRIMARY KEY,     -- Primary Key
    email VARCHAR(255) UNIQUE,       -- Alternate Key (Candidate Key)
    ssn VARCHAR(11) UNIQUE           -- Alternate Key (Candidate Key)
    -- Super Keys: {user_id}, {email}, {ssn}, {user_id, name}, {email, ssn}
);`,
    },
    interviewTip:
      "Venn Diagram Relationship: All Primary Keys are Candidate Keys; All Candidate Keys are Super Keys; but NOT all Super Keys are Candidate Keys.",
    commonTrap:
      "Confusing Candidate Key with Primary Key. A table can have multiple Candidate Keys, but ONLY ONE Primary Key.",
    followUpQuestions: [
      "Can a table have multiple Primary Keys?",
      "What is the difference between Primary Key and Unique Key?",
    ],
    relatedTopics: ["DBMS Keys", "Primary Key", "Foreign Key"],
    tags: ["DBMS", "Keys", "SQL"],
  },
  {
    topicSlug: "dbms",
    slug: "difference-primary-key-vs-unique-key",
    title: "What is the difference between Primary Key and Unique Key constraints?",
    difficulty: "EASY",
    subtopic: "Database Keys",
    synopsis: "Single null-forbidden identifier (Primary Key) vs multiple null-allowing constraints (Unique Key).",
    shortAnswer:
      "A table can have only ONE Primary Key, and it strictly forbids `NULL` values (`NOT NULL` + `UNIQUE`). A table can have MULTIPLE Unique Keys, and depending on SQL dialect (PostgreSQL/SQL Server), Unique constraints allow `NULL` values (since NULL != NULL).",
    detailedExplanation: [
      "**Quantity Limit:** Only 1 Primary Key per table; Unlimited Unique constraints allowed per table.",
      "**Nullability:** Primary Key columns automatically enforce `NOT NULL`. Unique Key columns allow `NULL` values (except MySQL where NULLs are treated specially).",
      "**Default Index:** Primary Key automatically creates a Clustered Index (by default in MySQL InnoDB). Unique Key creates a Non-Clustered Index.",
    ],
    example: {
      language: "JAVA",
      code: `CREATE TABLE accounts (
    account_id BIGINT PRIMARY KEY, -- 1 per table, NOT NULL implicitly
    email VARCHAR(255) UNIQUE,      -- Unique Key #1 (Allows NULL)
    phone VARCHAR(20) UNIQUE        -- Unique Key #2 (Allows NULL)
);`,
    },
    interviewTip:
      "Remember: In standard SQL, multiple rows can contain `NULL` in a UNIQUE column because `NULL` represents an unknown value, and `NULL = NULL` evaluates to UNKNOWN.",
    commonTrap:
      "Assuming UNIQUE constraint prevents inserting multiple NULL values. In PostgreSQL and SQL Server, multiple NULLs are permitted in UNIQUE columns.",
    followUpQuestions: [
      "Why does standard SQL allow multiple NULL values in a UNIQUE column?",
      "How does MySQL InnoDB handle Primary Key clustered indexing?",
    ],
    relatedTopics: ["Primary Key", "Unique Key", "Constraints"],
    tags: ["DBMS", "SQL", "Constraints"],
  },
  {
    topicSlug: "dbms",
    slug: "foreign-key-referential-integrity",
    title: "What is a Foreign Key constraint and Referential Integrity?",
    difficulty: "EASY",
    subtopic: "Database Keys",
    synopsis: "Maintaining valid cross-table entity relationships and preventing orphan records.",
    shortAnswer:
      "Referential Integrity is a database state property ensuring that relationships between tables remain valid. A Foreign Key is a column in a child table pointing to a Primary Key in a parent table, preventing orphan records by enforcing `ON DELETE` and `ON UPDATE` actions.",
    detailedExplanation: [
      "**Referential Rule:** A foreign key value in a child table MUST either match an existing primary key value in the parent table OR be `NULL`.",
      "**ON DELETE Actions:**",
      "- `CASCADE`: Deleting parent row automatically deletes all child rows.",
      "- `SET NULL`: Deleting parent row sets foreign key column in child rows to `NULL`.",
      "- `RESTRICT / NO ACTION`: Blocks deletion of parent row if child rows reference it (Default).",
      "- `SET DEFAULT`: Sets foreign key in child rows to column's default value.",
    ],
    example: {
      language: "JAVA",
      code: `CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50)
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    dept_id INT REFERENCES departments(dept_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE -- Referential Integrity Enforced!
);`,
    },
    interviewTip:
      "Always recommend indexing foreign key columns. While Primary Keys get automatic indexes, SQL databases do NOT automatically index Foreign Key columns, leading to full table scans during JOINs and parent deletions.",
    commonTrap:
      "Forgetting to index foreign key columns in MySQL/PostgreSQL, causing massive lock escalation and performance degradation on parent row updates.",
    followUpQuestions: [
      "Why should you always create an index on Foreign Key columns?",
      "What is an orphan record?",
    ],
    relatedTopics: ["Foreign Key", "Referential Integrity", "Constraints"],
    tags: ["DBMS", "SQL", "Database Design"],
  },

  /* ==========================================================================
     4. Database Normalization & Functional Dependencies
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "database-normalization-purpose-anomalies",
    title: "What is Database Normalization and what problems (anomalies) does it solve?",
    difficulty: "EASY",
    subtopic: "Normalization",
    synopsis: "Organizing schemas to minimize data redundancy and eliminate Insertion, Update, and Deletion anomalies.",
    shortAnswer:
      "Database Normalization is the systematic technique of organizing tables to minimize data redundancy and prevent data modification anomalies: Insertion Anomaly (cannot insert data without dummy values), Update Anomaly (updating one record leaves duplicate records inconsistent), and Deletion Anomaly (deleting a record unintentionally erases secondary data).",
    detailedExplanation: [
      "**Insertion Anomaly:** Unable to insert a new department unless at least one employee is assigned to it.",
      "**Update Anomaly:** If a department name changes, updating it in 1,000 employee rows risks leaving some rows with old names if an update fails midway.",
      "**Deletion Anomaly:** Deleting the last employee in a department accidentally wipes out the entire department's existence from the database.",
      "**Goal of Normalization:** Decompose unnormalized tables into smaller, well-structured tables while preserving functional dependencies and lossless joins.",
    ],
    example: {
      language: "JAVA",
      code: `-- Unnormalized Table (Suffers from Update & Deletion Anomalies)
-- Emp_ID | Emp_Name | Dept_ID | Dept_Name (Repeated for 1000 employees!)

-- Normalized Tables (Eliminates Anomalies)
CREATE TABLE departments ( dept_id INT PRIMARY KEY, dept_name VARCHAR(100) );
CREATE TABLE employees ( emp_id INT PRIMARY KEY, emp_name VARCHAR(100), dept_id INT REFERENCES departments(dept_id) );`,
    },
    interviewTip:
      "Remember the mnemonic for Normal Forms: 'Every attribute must depend on the Key (1NF), the Whole Key (2NF), and Nothing but the Key (3NF), so help me Codd!'",
    commonTrap:
      "Over-normalizing databases for read-heavy analytical workloads. Normalization optimizes write consistency, but excessive JOINs slow down reads.",
    followUpQuestions: [
      "What are 1NF, 2NF, 3NF, and BCNF?",
      "When is Denormalization beneficial?",
    ],
    relatedTopics: ["Normalization", "Anomalies", "Database Design"],
    tags: ["DBMS", "Normalization", "Architecture"],
  },
  {
    topicSlug: "dbms",
    slug: "normal-forms-1nf-2nf-3nf-bcnf",
    title: "What are the core Normal Forms (1NF, 2NF, 3NF, BCNF)?",
    difficulty: "MEDIUM",
    subtopic: "Normalization",
    synopsis: "Progressive schema refinement: Atomic values (1NF), Full dependency (2NF), No transitive dependency (3NF), Superkey determinants (BCNF).",
    shortAnswer:
      "1NF requires atomic values and no repeating groups. 2NF requires 1NF + no Partial Dependencies (non-key attributes must depend on the complete composite primary key). 3NF requires 2NF + no Transitive Dependencies. BCNF (Boyce-Codd) requires 3NF + every determinant in X -> Y must be a Super Key.",
    detailedExplanation: [
      "**1NF (First Normal Form):** Every column cell contains atomic (indivisible) values; no multi-valued arrays or comma-separated lists.",
      "**2NF (Second Normal Form):** Table is in 1NF and contains NO Partial Dependencies (a non-prime attribute depending on only part of a composite primary key). Applies only to tables with composite primary keys.",
      "**3NF (Third Normal Form):** Table is in 2NF and contains NO Transitive Dependencies (A -> B and B -> C, so non-prime attribute C depends on non-prime attribute B).",
      "**BCNF (Boyce-Codd Normal Form):** Stricter version of 3NF. For every functional dependency X -> Y, X MUST be a Super Key.",
    ],
    example: {
      language: "JAVA",
      code: `-- 3NF Violation: Emp_ID -> Dept_ID, and Dept_ID -> Dept_Name (Transitive Dependency!)
-- Table: employees (emp_id, emp_name, dept_id, dept_name)

-- Decomposed into 3NF:
-- Table 1: departments (dept_id [PK], dept_name)
-- Table 2: employees (emp_id [PK], emp_name, dept_id [FK])`,
    },
    interviewTip:
      "Recite the rule: '1NF = Atomic Values; 2NF = No Partial Key Dependencies; 3NF = No Non-Key Transitive Dependencies; BCNF = Determinant Must Be Super Key.'",
    commonTrap:
      "Checking for 2NF on tables with a single-column Primary Key. 2NF violations are IMPOSSIBLE if the primary key consists of a single attribute.",
    followUpQuestions: [
      "Can a table be in 3NF but not in BCNF?",
      "What is Lossless Join Decomposition?",
    ],
    relatedTopics: ["Normalization", "1NF", "2NF", "3NF", "BCNF"],
    tags: ["DBMS", "Normalization"],
  },
  {
    topicSlug: "dbms",
    slug: "functional-dependencies-armstrong-axioms",
    title: "What are Functional Dependencies and Armstrong's Axioms?",
    difficulty: "MEDIUM",
    subtopic: "Normalization",
    synopsis: "Constraint X -> Y where X uniquely determines Y, governed by Primary Axioms (Reflexivity, Augmentation, Transitivity).",
    shortAnswer:
      "A Functional Dependency (X -> Y) is a constraint where attribute set X uniquely determines attribute set Y. Armstrong's Axioms are 3 sound and complete inference rules used to derive all functional dependencies: Reflexivity, Augmentation, and Transitivity.",
    detailedExplanation: [
      "**Functional Dependency (X -> Y):** If two tuples have identical values for X, they MUST have identical values for Y. (SSN -> Name).",
      "**Armstrong's Primary Axioms:**",
      "- **Reflexivity:** If Y is a subset of X, then X -> Y. (e.g. {Name, Age} -> Name).",
      "- **Augmentation:** If X -> Y, then XZ -> YZ for any attribute Z.",
      "- **Transitivity:** If X -> Y and Y -> Z, then X -> Z.",
      "**Secondary Derived Rules:** Union (X -> Y, X -> Z implies X -> YZ), Decomposition (X -> YZ implies X -> Y), Pseudo-transitivity.",
    ],
    example: {
      language: "JAVA",
      code: `-- Functional Dependency Example:
-- Given: emp_id -> dept_id and dept_id -> dept_location
-- By Transitivity: emp_id -> dept_location`,
    },
    interviewTip:
      "Functional dependencies are derived from real-world business rules, not random sample data in a table.",
    commonTrap:
      "Assuming X -> Y implies Y -> X. Functional dependency is unidirectional.",
    followUpQuestions: [
      "What is Attribute Closure and how do you find Super Keys using FD closure?",
      "What is Lossless Join Decomposition?",
    ],
    relatedTopics: ["Functional Dependency", "Normalization", "Armstrong Axioms"],
    tags: ["DBMS", "Normalization", "Math"],
  },

  /* ==========================================================================
     5. SQL Commands, Joins, Subqueries & Window Functions
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "sql-command-categories-ddl-dml-dcl-tcl-dql",
    title: "What are the categories of SQL commands (DDL, DML, DCL, TCL, DQL)?",
    difficulty: "EASY",
    subtopic: "SQL Fundamentals",
    synopsis: "DDL (schema), DML (data mutation), DQL (queries), DCL (permissions), TCL (transactions).",
    shortAnswer:
      "SQL commands fall into 5 categories: 1) DDL (Data Definition Language: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`), 2) DML (Data Manipulation Language: `INSERT`, `UPDATE`, `DELETE`), 3) DQL (Data Query Language: `SELECT`), 4) DCL (Data Control Language: `GRANT`, `REVOKE`), and 5) TCL (Transaction Control Language: `COMMIT`, `ROLLBACK`, `SAVEPOINT`).",
    detailedExplanation: [
      "**DDL (Data Definition Language):** Defines or modifies database schema structure. Auto-commits automatically in most DBs.",
      "**DML (Data Manipulation Language):** Mutates data rows inside tables. Requires explicit `COMMIT` to persist.",
      "**DQL (Data Query Language):** Fetches and projects data (`SELECT`).",
      "**DCL (Data Control Language):** Controls user permissions and access rights.",
      "**TCL (Transaction Control Language):** Manages transaction boundaries.",
    ],
    example: {
      language: "JAVA",
      code: `-- DDL: Structure
CREATE TABLE logs ( id INT, msg VARCHAR(100) );

-- DML: Data Mutation
INSERT INTO logs VALUES (1, 'Server started');

-- TCL: Transaction Control
COMMIT;

-- DQL: Query Data
SELECT * FROM logs;`,
    },
    interviewTip:
      "Know that `TRUNCATE` is DDL (resets structure/storage, cannot be rolled back in MySQL), whereas `DELETE` is DML (deletes rows, logged in undo log).",
    commonTrap:
      "Classifying `SELECT` as DML. `SELECT` is technically DQL, though often informally grouped under DML.",
    followUpQuestions: [
      "Difference between DROP, TRUNCATE, and DELETE?",
      "Why is TRUNCATE faster than DELETE?",
    ],
    relatedTopics: ["SQL", "DDL", "DML", "TCL"],
    tags: ["DBMS", "SQL", "Fundamentals"],
  },
  {
    topicSlug: "dbms",
    slug: "difference-drop-truncate-delete",
    title: "What is the difference between DROP, TRUNCATE, and DELETE in SQL?",
    difficulty: "EASY",
    subtopic: "SQL Fundamentals",
    synopsis: "Schema removal (DROP) vs storage deallocation (TRUNCATE) vs row-by-row deletion (DELETE).",
    shortAnswer:
      "DELETE is a DML command that removes specific rows line-by-line using a WHERE clause; it is logged in transaction logs and can be rolled back. TRUNCATE is a DDL command that deallocates all table data pages instantaneously; it resets auto-increment IDs. DROP is a DDL command that deletes the entire table data AND schema structure permanently.",
    detailedExplanation: [
      "**DELETE (DML):** Slow for large tables. Triggers row-level triggers (`AFTER DELETE`). Supports `WHERE` clause filter.",
      "**TRUNCATE (DDL):** Extremely fast because it deallocates data pages instead of logging individual row deletions. Resets identity/auto-increment counter. Cannot use `WHERE` clause.",
      "**DROP (DDL):** Removes data, indexes, triggers, constraints, AND table schema definition entirely from database catalog.",
    ],
    example: {
      language: "JAVA",
      code: `-- DELETE: Remove specific rows (Rollbackable)
DELETE FROM users WHERE status = 'INACTIVE';

-- TRUNCATE: Empty entire table instantly (Resets auto-increment ID to 1)
TRUNCATE TABLE audit_logs;

-- DROP: Destroy table completely
DROP TABLE temporary_staging;`,
    },
    interviewTip:
      "Highlight performance: TRUNCATE is O(1) page deallocation; DELETE is O(N) row-by-row operation.",
    commonTrap:
      "Assuming TRUNCATE cannot be rolled back in PostgreSQL. In PostgreSQL, TRUNCATE is transactional and CAN be rolled back inside a `BEGIN...ROLLBACK` block!",
    followUpQuestions: [
      "Why is TRUNCATE transactional in PostgreSQL but non-transactional in MySQL?",
      "What happens to foreign keys referencing a truncated table?",
    ],
    relatedTopics: ["SQL", "DDL", "DML"],
    tags: ["DBMS", "SQL"],
  },
  {
    topicSlug: "dbms",
    slug: "sql-joins-inner-left-right-full-cross-self",
    title: "What are the different types of SQL Joins?",
    difficulty: "EASY",
    subtopic: "SQL Queries",
    synopsis: "INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER, CROSS, and SELF joins.",
    shortAnswer:
      "SQL Joins combine columns from two tables based on a related attribute: INNER JOIN returns matching rows in both tables; LEFT JOIN returns all left rows plus matching right rows; RIGHT JOIN returns all right rows plus matching left rows; FULL JOIN returns all rows from both tables; CROSS JOIN returns Cartesian product; SELF JOIN joins a table with itself.",
    detailedExplanation: [
      "**INNER JOIN:** Keeps only rows where the join predicate matches in both tables.",
      "**LEFT (OUTER) JOIN:** Keeps all rows from left table. Unmatched right columns contain `NULL`.",
      "**RIGHT (OUTER) JOIN:** Keeps all rows from right table. Unmatched left columns contain `NULL`.",
      "**FULL (OUTER) JOIN:** Retains all rows from both tables, filling `NULL` for non-matches.",
      "**CROSS JOIN:** Produces Cartesian product (M * N rows).",
      "**SELF JOIN:** Joins a table to itself using aliases (e.g. Employee table joining Manager ID to Employee ID).",
    ],
    example: {
      language: "JAVA",
      code: `-- Self Join: Finding Employee and Manager Name
SELECT E.name AS employee_name, M.name AS manager_name
FROM employees E
LEFT JOIN employees M ON E.manager_id = M.emp_id;`,
    },
    interviewTip:
      "When asked to optimize a slow JOIN query, check: 1) Are join key columns indexed? 2) Are foreign key data types identical?",
    commonTrap:
      "Filtering a LEFT JOIN's right table inside the WHERE clause (`WHERE R.status = 'ACTIVE'`). This silently converts the LEFT JOIN into an INNER JOIN! Put condition in the ON clause instead.",
    followUpQuestions: [
      "Why does a WHERE clause turn a LEFT JOIN into an INNER JOIN?",
      "What are Nested Loop Join, Hash Join, and Sort-Merge Join algorithms in SQL query engines?",
    ],
    relatedTopics: ["SQL", "Joins", "Query Optimization"],
    tags: ["DBMS", "SQL", "Joins"],
  },
  {
    topicSlug: "dbms",
    slug: "where-vs-having-clause-difference",
    title: "What is the difference between WHERE and HAVING clause in SQL?",
    difficulty: "EASY",
    subtopic: "SQL Queries",
    synopsis: "Pre-aggregation row filtering (WHERE) vs post-aggregation group filtering (HAVING).",
    shortAnswer:
      "WHERE filters individual rows BEFORE aggregate operations (`GROUP BY`) are computed; it cannot contain aggregate functions (`SUM`, `COUNT`). HAVING filters aggregated groups AFTER `GROUP BY` execution; it operates directly on aggregate function results.",
    detailedExplanation: [
      "**Execution Order:** `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `ORDER BY`.",
      "**WHERE Clause:** Applied to raw table rows. Uses indexes efficiently. Example: `WHERE status = 'ACTIVE'`.",
      "**HAVING Clause:** Applied to grouped summary rows. Cannot use standard column indexes directly. Example: `HAVING COUNT(order_id) > 5`.",
    ],
    example: {
      language: "JAVA",
      code: `SELECT department_id, AVG(salary) AS avg_sal
FROM employees
WHERE hire_date >= '2020-01-01'  -- WHERE: Filters raw rows BEFORE grouping
GROUP BY department_id
HAVING AVG(salary) > 75000;      -- HAVING: Filters grouped results AFTER aggregation`,
    },
    interviewTip:
      "Always filter raw rows in WHERE as early as possible before GROUP BY to minimize the number of rows processed in memory by HAVING.",
    commonTrap:
      "Putting non-aggregate filters in HAVING (`HAVING status = 'ACTIVE'`). While syntactically valid in some SQL engines, it degrades performance.",
    followUpQuestions: [
      "What is the complete execution order of a SQL SELECT statement?",
      "Can HAVING exist without a GROUP BY clause?",
    ],
    relatedTopics: ["SQL", "Aggregation", "Query Execution"],
    tags: ["DBMS", "SQL"],
  },
  {
    topicSlug: "dbms",
    slug: "sql-window-functions-dense-rank-lead-lag",
    title: "What are SQL Window Functions and how do RANK(), DENSE_RANK(), LEAD(), and LAG() work?",
    difficulty: "MEDIUM",
    subtopic: "SQL Queries",
    synopsis: "Calculation across set of table rows related to current row without collapsing rows via GROUP BY.",
    shortAnswer:
      "Window functions perform calculations across a subset of table rows (a partition) while retaining individual row identities (unlike `GROUP BY` which collapses rows). `RANK()` leaves gaps after ties; `DENSE_RANK()` ranks sequentially without gaps; `LEAD()` fetches values from future rows; `LAG()` fetches values from preceding rows.",
    detailedExplanation: [
      "**ROW_NUMBER():** Assigns unique sequential integers (1, 2, 3, 4) regardless of ties.",
      "**RANK():** Assigns ranks with gaps for ties (1, 2, 2, 4).",
      "**DENSE_RANK():** Assigns consecutive ranks without gaps for ties (1, 2, 2, 3).",
      "**LAG(col, offset):** Accesses data from N rows BEFORE the current row in partition.",
      "**LEAD(col, offset):** Accesses data from N rows AFTER the current row in partition.",
    ],
    example: {
      language: "JAVA",
      code: `-- Finding Top 2 Highest Paid Employees per Department
WITH RankedEmployees AS (
    SELECT emp_id, name, department_id, salary,
           DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
    FROM employees
)
SELECT * FROM RankedEmployees WHERE rnk <= 2;`,
    },
    interviewTip:
      "Use `DENSE_RANK()` for 'Nth highest salary' problems to handle duplicate salary ties correctly without skipping numbers.",
    commonTrap:
      "Using window functions directly inside WHERE clauses (`WHERE ROW_NUMBER() OVER (...) = 1`). Window functions execute AFTER WHERE; wrap inside a CTE or Subquery instead.",
    followUpQuestions: [
      "Difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?",
      "How to calculate month-over-month growth using LAG()?",
    ],
    relatedTopics: ["SQL", "Window Functions", "Analytics"],
    tags: ["DBMS", "SQL", "Advanced SQL"],
  },
  {
    topicSlug: "dbms",
    slug: "subquery-vs-correlated-subquery-performance",
    title: "What is a Correlated Subquery and how does it differ from a standard Subquery?",
    difficulty: "MEDIUM",
    subtopic: "SQL Queries",
    synopsis: "Independent once-executed subquery vs row-by-row inner subquery referencing outer query attributes.",
    shortAnswer:
      "A standard subquery executes ONCE independently of the outer query, passing its result to the outer query. A Correlated Subquery references columns from the outer query, re-executing once for EVERY ROW processed by the outer query (O(N * M) complexity).",
    detailedExplanation: [
      "**Non-Correlated Subquery:** Executed standalone first. Example: `WHERE salary > (SELECT AVG(salary) FROM employees)`.",
      "**Correlated Subquery:** Inner query uses outer table alias (`WHERE E2.dept_id = E1.dept_id`). Executed repeatedly per outer row.",
      "**Optimization:** Modern SQL query optimizers rewrite correlated subqueries into INNER JOINs or Window Functions automatically.",
    ],
    example: {
      language: "JAVA",
      code: `-- Correlated Subquery: Find employees earning more than their department average
SELECT E1.emp_id, E1.name, E1.salary
FROM employees E1
WHERE E1.salary > (
    SELECT AVG(E2.salary) 
    FROM employees E2 
    WHERE E2.department_id = E1.department_id -- References outer alias E1!
);`,
    },
    interviewTip:
      "Rewrite correlated subqueries into Window Functions (`AVG(salary) OVER(PARTITION BY department_id)`) or JOINs for massive performance gains.",
    commonTrap:
      "Using `WHERE id IN (SELECT ...)` with correlated subqueries on large tables, causing quadratic O(N^2) execution loops.",
    followUpQuestions: [
      "How does EXISTS differ from IN in subqueries?",
      "How does query planner rewrite correlated subqueries into Hash Joins?",
    ],
    relatedTopics: ["SQL", "Subqueries", "Query Optimization"],
    tags: ["DBMS", "SQL", "Performance"],
  },

  /* ==========================================================================
     6. Transactions, ACID Properties & Concurrency Control Anomalies
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "acid-properties-database",
    title: "What are ACID properties in Database Management Systems?",
    difficulty: "EASY",
    subtopic: "Transactions",
    synopsis: "Atomicity, Consistency, Isolation, and Durability transaction guarantees.",
    shortAnswer:
      "ACID defines the 4 core guarantees of database transactions: Atomicity (all-or-nothing completion), Consistency (database transitions from one valid state to another obeying all constraints), Isolation (concurrent transactions execute independently without interfering), and Durability (committed changes persist permanently even during crash/power loss).",
    detailedExplanation: [
      "**Atomicity:** Ensures all operations in a transaction commit successfully, or the entire transaction is rolled back (via write-ahead logs / undo logs).",
      "**Consistency:** Guarantees all database rules (foreign keys, check constraints, unique indexes) remain valid before and after transaction execution.",
      "**Isolation:** Prevents concurrency anomalies (dirty reads, non-repeatable reads, phantom reads) through locking or Multi-Version Concurrency Control (MVCC).",
      "**Durability:** Uses Write-Ahead Logging (WAL) and disk flushing so committed data survives system crashes.",
    ],
    example: {
      language: "JAVA",
      code: `// SQL Transaction Example: Bank Transfer
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
  -- If any statement fails, ROLLBACK; otherwise:
COMMIT;`,
    },
    interviewTip:
      "Connect Isolation levels to performance trade-offs: Read Uncommitted (fastest, dirty reads allowed) -> Read Committed -> Repeatable Read (PostgreSQL/MySQL default) -> Serializable (slowest, strict isolation).",
    commonTrap:
      "Assuming Consistency means Eventual Consistency in distributed systems. Database ACID Consistency means constraint integrity.",
    followUpQuestions: [
      "What are dirty reads, non-repeatable reads, and phantom reads?",
      "How does Write-Ahead Logging (WAL) ensure durability?",
    ],
    relatedTopics: ["ACID", "Transactions", "Isolation Levels"],
    tags: ["DBMS", "Transactions"],
  },
  {
    topicSlug: "dbms",
    slug: "concurrency-control-anomalies-dirty-phantom-read",
    title: "What are Concurrency Control Read Anomalies (Dirty Read, Non-Repeatable Read, Phantom Read)?",
    difficulty: "MEDIUM",
    subtopic: "Transactions",
    synopsis: "Reading uncommitted data (Dirty Read), modified data (Non-Repeatable Read), or inserted rows (Phantom Read).",
    shortAnswer:
      "Concurrency anomalies occur when un-isolated transactions execute simultaneously. A Dirty Read occurs when T1 reads uncommitted modifications made by T2 (which later rolls back). A Non-Repeatable Read occurs when T1 reads a row twice, but T2 modifies/deletes it in between. A Phantom Read occurs when T1 executes a range query twice, but T2 inserts new matching rows in between.",
    detailedExplanation: [
      "**Dirty Read:** T1 reads uncommitted update of T2. T2 performs `ROLLBACK`. T1 now operates on bogus data that never existed.",
      "**Non-Repeatable Read (Fuzzy Read):** T1 reads row (balance = $100). T2 updates balance to $200 and commits. T1 reads same row again and gets $200. Value of existing row changed.",
      "**Phantom Read:** T1 queries `WHERE age > 30` (gets 5 rows). T2 inserts new user with `age = 35` and commits. T1 re-runs same query and gets 6 rows. New 'phantom' rows appeared.",
      "**Lost Update Anomaly:** T1 and T2 read balance ($100). T1 adds $10 ($110). T2 adds $20 ($120) and overwrites T1's update.",
    ],
    example: {
      language: "JAVA",
      code: `-- Phantom Read Scenario:
-- Transaction 1:
SELECT COUNT(*) FROM users WHERE age > 21; -- Returns 10

-- Transaction 2 (Concurrent):
INSERT INTO users (name, age) VALUES ('Bob', 25);
COMMIT;

-- Transaction 1 (Re-querying same range):
SELECT COUNT(*) FROM users WHERE age > 21; -- Returns 11! (Phantom Row)`,
    },
    interviewTip:
      "Summary Matrix: Read Uncommitted allows Dirty Reads; Read Committed prevents Dirty Reads; Repeatable Read prevents Non-Repeatable Reads; Serializable prevents Phantom Reads.",
    commonTrap:
      "Confusing Non-Repeatable Read with Phantom Read. Non-Repeatable Read involves MODIFICATION of an existing row; Phantom Read involves INSERTION of new rows in a range.",
    followUpQuestions: [
      "How does Next-Key Locking in MySQL InnoDB prevent Phantom Reads in Repeatable Read level?",
      "What is MVCC?",
    ],
    relatedTopics: ["Transactions", "Isolation Levels", "Concurrency Control"],
    tags: ["DBMS", "Transactions", "Concurrency"],
  },
  {
    topicSlug: "dbms",
    slug: "transaction-isolation-levels-explained",
    title: "What are Transaction Isolation Levels in DBMS?",
    difficulty: "MEDIUM",
    subtopic: "Transactions",
    synopsis: "Read Uncommitted, Read Committed, Repeatable Read, and Serializable.",
    shortAnswer:
      "ANSI SQL defines 4 Transaction Isolation Levels offering trade-offs between consistency and concurrency: 1) Read Uncommitted (lowest isolation, allows dirty reads), 2) Read Committed (prevents dirty reads; default in PostgreSQL), 3) Repeatable Read (prevents non-repeatable reads; default in MySQL InnoDB), and 4) Serializable (highest isolation, completely eliminates all anomalies).",
    detailedExplanation: [
      "**1. Read Uncommitted:** Reads uncommitted data. Fastest, zero lock overhead, high risk of dirty reads.",
      "**2. Read Committed:** Guarantees reading only committed data. Uses short-lived read locks or MVCC snapshots per statement.",
      "**3. Repeatable Read:** Guarantees that multiple reads of the same row within a transaction return identical data. Uses MVCC snapshots per transaction.",
      "**4. Serializable:** Simulates serial single-threaded execution using Range Locks / Predicate Locks or Serializable Snapshot Isolation (SSI).",
    ],
    example: {
      language: "JAVA",
      code: `-- Setting Isolation Level in PostgreSQL / MySQL
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
  SELECT balance FROM accounts WHERE id = 42;
  -- Subsequent reads in this transaction will see exact same balance
COMMIT;`,
    },
    interviewTip:
      "Know default isolation levels: PostgreSQL/Oracle default is Read Committed; MySQL InnoDB default is Repeatable Read.",
    commonTrap:
      "Assuming Serializable isolation is free. Serializable causes frequent transaction serialization failures and aborts under high write concurrency, requiring application retry loops.",
    followUpQuestions: [
      "Why is Read Committed preferred over Serializable in high-throughput web applications?",
      "How does MVCC snapshot isolation work in PostgreSQL?",
    ],
    relatedTopics: ["Isolation Levels", "Transactions", "PostgreSQL", "MySQL"],
    tags: ["DBMS", "Transactions", "Performance"],
  },
  {
    topicSlug: "dbms",
    slug: "mvcc-multi-version-concurrency-control",
    title: "What is Multi-Version Concurrency Control (MVCC) and how does it eliminate read locks?",
    difficulty: "HARD",
    subtopic: "Transactions",
    synopsis: "Maintaining multiple versions of data rows so Readers Never Block Writers, and Writers Never Block Readers.",
    shortAnswer:
      "MVCC (Multi-Version Concurrency Control) is a concurrency mechanism used by modern databases (PostgreSQL, MySQL InnoDB) where updates create a new version of a row rather than overwriting it in place. This guarantees that 'Readers never block Writers, and Writers never block Readers.'",
    detailedExplanation: [
      "**How MVCC Works (PostgreSQL tuple headers):**",
      "- Each row contains system columns `xmin` (creation transaction ID) and `xmax` (deletion/superseded transaction ID).",
      "- When T1 updates a row, the DB writes a NEW row tuple with `xmin = T1.id` and sets `xmax = T1.id` on the old tuple.",
      "- A reader transaction looks up rows matching its snapshot transaction ID window.",
      "**Garbage Collection (VACUUM):** Dead tuple versions superseded by committed transactions are cleaned up by background processes (PostgreSQL `VACUUM` / MySQL Undo Logs).",
    ],
    example: {
      language: "JAVA",
      code: `-- Inspecting PostgreSQL MVCC hidden system columns
SELECT xmin, xmax, id, username FROM users;
-- xmin: Transaction ID that inserted row
-- xmax: Transaction ID that updated/deleted row (0 if active live tuple)`,
    },
    interviewTip:
      "Use the golden tagline: 'MVCC ensures Readers never block Writers, and Writers never block Readers.'",
    commonTrap:
      "Forgetting about PostgreSQL table bloat. Without Auto-VACUUM, MVCC dead tuples accumulate, causing severe disk space bloat and slow table scans.",
    followUpQuestions: [
      "What is table bloat in PostgreSQL and how does VACUUM fix it?",
      "How does MySQL InnoDB undo log work for MVCC consistency?",
    ],
    relatedTopics: ["MVCC", "PostgreSQL", "Transactions", "Concurrency"],
    tags: ["DBMS", "MVCC", "Performance"],
  },

  /* ==========================================================================
     7. Indexing, B-Trees, B+ Trees & Query Optimization
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "b-tree-vs-b-plus-tree-indexing",
    title: "How do B-Tree and B+ Tree Indexes work, and why do databases prefer B+ Trees?",
    difficulty: "MEDIUM",
    subtopic: "Indexing",
    synopsis: "Self-balancing multi-way search trees; B+ Trees store data records only in leaf nodes linked sequentially.",
    shortAnswer:
      "A B-Tree stores key-value data records in both internal and leaf nodes. A B+ Tree stores data records EXCLUSIVELY in leaf nodes, while internal nodes store only key routing pointers. B+ Tree leaf nodes are linked sequentially as a doubly-linked list, enabling fast O(log N) range scans.",
    detailedExplanation: [
      "**Why Databases Prefer B+ Trees:**",
      "1. **Higher Fanout:** Internal nodes hold no payload data, fitting more keys per disk block (high fanout = shorter tree height, fewer disk I/O reads).",
      "2. **Efficient Range Queries:** Leaf nodes form a contiguous linked list. A range query (`WHERE age BETWEEN 20 AND 30`) locates key 20 in O(log N) and traverses the leaf chain sequentially without re-traversing the tree.",
      "3. **Predictable Performance:** Every search reaches a leaf node, guaranteeing uniform O(log N) lookup depth.",
    ],
    example: {
      language: "JAVA",
      code: `-- B+ Tree Index Range Scan Execution
CREATE INDEX idx_orders_date ON orders(order_date);
SELECT * FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-01-31';
-- Engine finds '2026-01-01' via B+ Tree root lookup, then follows leaf pointers sequentially!`,
    },
    interviewTip:
      "Key reason to memorize: 'Higher node fanout reduces tree height to 3-4 levels for billions of rows, requiring only 3-4 disk I/O reads per query.'",
    commonTrap:
      "Claiming B-Trees are obsolete. Standard B-Trees are used in file systems; B+ Trees are used in relational database storage engines (InnoDB).",
    followUpQuestions: [
      "What is Clustered vs Non-Clustered index?",
      "How does disk block size impact B+ Tree fanout?",
    ],
    relatedTopics: ["B+ Tree", "Indexing", "Data Structures"],
    tags: ["DBMS", "Indexing", "Data Structures"],
  },
  {
    topicSlug: "dbms",
    slug: "clustered-vs-non-clustered-index",
    title: "What is the difference between a Clustered Index and a Non-Clustered Index?",
    difficulty: "EASY",
    subtopic: "Indexing",
    synopsis: "Physical row storage ordering (Clustered) vs separate secondary pointer index (Non-Clustered).",
    shortAnswer:
      "A Clustered Index dictates the actual physical storage order of data rows on disk (leaf nodes ARE the data rows); a table can have ONLY ONE Clustered Index (usually Primary Key). A Non-Clustered Index is a separate secondary structure containing index keys and row pointers back to the clustered index.",
    detailedExplanation: [
      "**Clustered Index:** Leaf nodes contain full data rows. Table data is physically sorted by clustered key. Lookup requires 0 extra pointer traversals.",
      "**Non-Clustered (Secondary) Index:** Leaf nodes store index keys + Clustered Key pointers (or Row IDs). Requires a 2-step lookup: 1) Find primary key in secondary index, 2) Perform 'Bookmark Lookup' / 'Table Access by Index RowID' to get full row.",
      "**Quantity:** Exactly 1 Clustered Index per table; up to hundreds of Non-Clustered Indexes.",
    ],
    example: {
      language: "JAVA",
      code: `-- MySQL InnoDB Clustered Index (Primary Key)
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY, -- Clustered Index (Physical disk order)
    email VARCHAR(255),
    city VARCHAR(100)
);

-- Non-Clustered Secondary Index
CREATE INDEX idx_city ON users(city); -- Stores city + user_id pointer`,
    },
    interviewTip:
      "In MySQL InnoDB, secondary indexes store the Primary Key as their row pointer. If your Primary Key is a huge UUID string, all secondary indexes become bloated!",
    commonTrap:
      "Assuming a table can have multiple Clustered Indexes. Data on physical disk can be ordered in only ONE physical sequence.",
    followUpQuestions: [
      "Why should Primary Keys be auto-increment integers rather than random UUIDs in MySQL InnoDB?",
      "What is a Covering Index?",
    ],
    relatedTopics: ["Clustered Index", "Non-Clustered Index", "InnoDB"],
    tags: ["DBMS", "Indexing", "Performance"],
  },
  {
    topicSlug: "dbms",
    slug: "covering-index-and-leftmost-prefix-rule",
    title: "What is a Covering Index and what is the Leftmost Prefix Rule?",
    difficulty: "MEDIUM",
    subtopic: "Indexing",
    synopsis: "Index satisfying query entirely from index leaf nodes (Covering Index) and prefix matching rules.",
    shortAnswer:
      "A Covering Index is a secondary index that contains ALL columns requested by a SQL query in its leaf nodes, eliminating the expensive secondary table lookup step. The Leftmost Prefix Rule dictates that a composite B+ Tree index on `(A, B, C)` can only be used by queries filtering on `(A)`, `(A, B)`, or `(A, B, C)` in order from left to right.",
    detailedExplanation: [
      "**Covering Index Benefits:** If query requests `SELECT email FROM users WHERE city = 'NYC'`, and composite index is `(city, email)`, the DB engine returns data directly from the index tree without fetching data pages from disk (Execution Plan shows `Using index`).",
      "**Leftmost Prefix Rule:** Composite index `(last_name, first_name)`:",
      "- `WHERE last_name = 'Smith'` -> Uses Index.",
      "- `WHERE last_name = 'Smith' AND first_name = 'John'` -> Uses Index.",
      "- `WHERE first_name = 'John'` -> SKIPS INDEX! (Violates leftmost prefix rule).",
    ],
    example: {
      language: "JAVA",
      code: `-- Composite Index creation
CREATE INDEX idx_users_city_email ON users(city, email);

-- Covered Query Execution (Fastest - No Table Lookup!)
SELECT email FROM users WHERE city = 'Chicago'; 

-- Query Skipping Index (Violates Leftmost Prefix)
SELECT city FROM users WHERE email = 'niraj@example.com';`,
    },
    interviewTip:
      "Order composite index columns by cardinality: put high-selectivity columns first, and frequently filtered equality columns before range columns.",
    commonTrap:
      "Expecting an index on `(A, B)` to speed up a query filtering solely on column `B`.",
    followUpQuestions: [
      "How to inspect SQL query execution plans using EXPLAIN ANALYZE?",
      "What is Index Condition Pushdown (ICP)?",
    ],
    relatedTopics: ["Indexing", "Covering Index", "Leftmost Prefix"],
    tags: ["DBMS", "Indexing", "Optimization"],
  },
  {
    topicSlug: "dbms",
    slug: "database-sharding-vs-partitioning",
    title: "What is Database Sharding vs Database Partitioning (Horizontal vs Vertical)?",
    difficulty: "MEDIUM",
    subtopic: "Scaling",
    synopsis: "Distributing rows across servers (Sharding) vs splitting tables/columns locally (Partitioning).",
    shortAnswer:
      "Partitioning splits a large table into smaller physical pieces within a SINGLE database instance. Horizontal Partitioning splits rows based on ranges/hashes; Vertical Partitioning splits columns into separate tables. Sharding is Horizontal Partitioning distributed across MULTIPLE distinct server instances.",
    detailedExplanation: [
      "**Horizontal Partitioning (Local):** Divides a 100M row table on single server into monthly partition tables (`orders_2026_01`, `orders_2026_02`).",
      "**Vertical Partitioning (Local):** Moves infrequently accessed blob columns (`profile_picture`, `bio`) to a secondary table (`user_profiles_blob`).",
      "**Sharding (Distributed):** Distributes rows across 10 separate database servers using a Shard Key (`user_id % 10`).",
      "**Sharding Trade-offs:** Cross-shard JOINs are extremely expensive/impossible; distributed ACID transactions require 2PC; auto-increment primary keys require global ID generators (Snowflake ID).",
    ],
    example: {
      language: "JAVA",
      code: `-- PostgreSQL Declarative Range Partitioning
CREATE TABLE orders (
    order_id BIGINT,
    order_date DATE NOT NULL,
    total NUMERIC
) PARTITION BY RANGE (order_date);

CREATE TABLE orders_2026_jan PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');`,
    },
    interviewTip:
      "In System Design interviews, mention Sharding only when single-node vertical hardware limits are exhausted. Sharding adds severe architectural complexity.",
    commonTrap:
      "Choosing a poor Shard Key causing Hotspot Shards (e.g. sharding by `country` where 80% of traffic hits `US` shard).",
    followUpQuestions: [
      "What is Consistent Hashing and how does it assist shard rebalancing?",
      "How does Twitter Snowflake algorithm generate unique global IDs?",
    ],
    relatedTopics: ["Sharding", "Partitioning", "System Design"],
    tags: ["DBMS", "Sharding", "Scalability"],
  },

  /* ==========================================================================
     8. Locking Protocols, Deadlocks & System Recovery
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "two-phase-locking-2pl-protocol",
    title: "What is the Two-Phase Locking (2PL) protocol?",
    difficulty: "HARD",
    subtopic: "Locking & Recovery",
    synopsis: "Growing Phase (acquiring locks) and Shrinking Phase (releasing locks) guaranteeing serializability.",
    shortAnswer:
      "Two-Phase Locking (2PL) is a concurrency control protocol that guarantees serializability by dividing lock handling in a transaction into 2 distinct phases: 1) Growing Phase (transaction acquires locks, cannot release any), and 2) Shrinking Phase (transaction releases locks, cannot acquire new ones).",
    detailedExplanation: [
      "**Growing Phase:** Transaction requests Shared (S) or Exclusive (X) locks as needed. Zero locks are released.",
      "**Lock Point:** The exact moment the transaction acquires its final lock.",
      "**Shrinking Phase:** Transaction releases locks one by one. Once a single lock is released, NO MORE LOCKS CAN BE ACQUIRED.",
      "**Strict 2PL:** Holds all Exclusive (X) locks until the transaction COMMITS or ABORTS. Eliminates cascading rollbacks.",
      "**Rigorous 2PL:** Holds ALL locks (Shared and Exclusive) until transaction end.",
    ],
    example: {
      language: "JAVA",
      code: `// Strict 2PL Lock Sequence:
// Transaction T1:
// 1. Lock-X(AccountA)  [Growing Phase]
// 2. Lock-X(AccountB)  [Growing Phase - Lock Point]
// 3. Update AccountA, AccountB
// 4. COMMIT
// 5. Release-X(AccountA), Release-X(AccountB) [Shrinking Phase at COMMIT]`,
    },
    interviewTip:
      "Highlight: Basic 2PL guarantees Serializability, but does NOT prevent Deadlocks!",
    commonTrap:
      "Confusing Strict 2PL with Basic 2PL. Basic 2PL can release locks before commit; Strict 2PL holds exclusive locks until commit.",
    followUpQuestions: [
      "Why does 2PL cause deadlocks?",
      "What is Cascading Abort and how does Strict 2PL prevent it?",
    ],
    relatedTopics: ["2PL", "Locking", "Serializability"],
    tags: ["DBMS", "Locking", "Concurrency"],
  },
  {
    topicSlug: "dbms",
    slug: "deadlocks-in-dbms-detection-prevention",
    title: "What is a Deadlock in DBMS and how is it detected and prevented?",
    difficulty: "MEDIUM",
    subtopic: "Locking & Recovery",
    synopsis: "Circular lock dependency loops resolved via Wait-For Graphs, Wait-Die, or Wound-Wait schemes.",
    shortAnswer:
      "A Deadlock occurs when 2 or more transactions are stuck in a circular wait condition where each holds a lock the other requires. DBMS handles deadlocks via: 1) Deadlock Prevention (Wait-Die or Wound-Wait timestamp schemes), 2) Deadlock Detection (Wait-For Graph cycle detection), and 3) Timeout aborts.",
    detailedExplanation: [
      "**Deadlock Condition:** T1 holds Lock A, requests Lock B. T2 holds Lock B, requests Lock A. Both wait indefinitely.",
      "**Wait-For Graph (Detection):** Directed graph where nodes are active transactions and edges represent lock dependencies. A cycle in the graph indicates a DEADLOCK. DBMS picks a 'victim' transaction and aborts/rolls it back.",
      "**Timestamp Prevention Schemes:** Uses transaction start timestamps (TS):",
      "- **Wait-Die (Non-preemptive):** Old waits for Young; Young dies (aborts) if requesting Old's lock.",
      "- **Wound-Wait (Preemptive):** Old wounds (preempts/aborts) Young to steal lock; Young waits if requesting Old's lock.",
    ],
    example: {
      language: "JAVA",
      code: `-- Deadlock Scenario in SQL:
-- Transaction 1: UPDATE accounts SET balance = 100 WHERE id = 1; (Holds Lock 1)
-- Transaction 2: UPDATE accounts SET balance = 200 WHERE id = 2; (Holds Lock 2)
-- Transaction 1: UPDATE accounts SET balance = 100 WHERE id = 2; (Waits for Lock 2...)
-- Transaction 2: UPDATE accounts SET balance = 200 WHERE id = 1; (DEADLOCK DETECTED! T2 Aborted)`,
    },
    interviewTip:
      "Best application practice to prevent deadlocks: Always acquire locks on multiple tables/rows in the EXACT SAME DETERMINISTIC ORDER across all transactions.",
    commonTrap:
      "Assuming higher isolation levels eliminate deadlocks. Higher isolation levels (like Serializable or SELECT FOR UPDATE) actually INCREASE deadlock frequency due to heavy locking.",
    followUpQuestions: [
      "How to analyze deadlock logs in MySQL InnoDB (`SHOW ENGINE INNODB STATUS`)?",
      "Why is Wound-Wait less prone to starvation than Wait-Die?",
    ],
    relatedTopics: ["Deadlock", "Locking", "Wait-For Graph"],
    tags: ["DBMS", "Locking", "Concurrency"],
  },
  {
    topicSlug: "dbms",
    slug: "write-ahead-logging-wal-aries-recovery",
    title: "What is Write-Ahead Logging (WAL) and how does crash recovery work?",
    difficulty: "HARD",
    subtopic: "Locking & Recovery",
    synopsis: "Writing log records to disk before modifying actual data pages to guarantee Durability and Atomicity.",
    shortAnswer:
      "Write-Ahead Logging (WAL) is a technique where log records describing database modifications MUST be flushed to non-volatile disk before the corresponding actual data pages are written to disk. During crash recovery, the ARIES algorithm performs 3 passes: Analysis Phase, Redo Phase (repeats history), and Undo Phase (rolls back uncommitted transactions).",
    detailedExplanation: [
      "**WAL Principle:** Fast append-only disk logging ensures that even if power fails while dirty data pages are still in RAM buffer pool, committed changes survive in the WAL file on disk.",
      "**ARIES Crash Recovery 3-Passes:**",
      "1. **Analysis Phase:** Scans log forward from last checkpoint to identify dirty pages in buffer pool and active uncommitted transactions at crash time.",
      "2. **Redo Phase:** Scans log forward to re-apply all logged changes (even uncommitted ones) to restore database to exact crash state ('Repeating History').",
      "3. **Undo Phase:** Scans log backward to roll back changes made by active uncommitted transactions (the 'losers') using Undo Log records.",
    ],
    example: {
      language: "JAVA",
      code: `-- WAL Operations in PostgreSQL
-- 1. Transaction modifies row -> Log record written to WAL buffer.
-- 2. COMMIT executed -> WAL buffer synchronously flushed to disk (fsync).
-- 3. Dirty RAM table data page flushed to disk asynchronously later by Checkpointer process.`,
    },
    interviewTip:
      "Explain why WAL is fast: Appending sequential log entries to a WAL file requires sequential disk writes, which are 100x faster than random disk I/O data page updates.",
    commonTrap:
      "Confusing WAL (Redo Log) with Undo Log. Redo log re-applies committed changes after a crash; Undo log reverts uncommitted changes during rollback.",
    followUpQuestions: [
      "What is a Checkpoint and why does it speed up recovery?",
      "What is fsync in disk I/O logging?",
    ],
    relatedTopics: ["WAL", "Crash Recovery", "ARIES", "Durability"],
    tags: ["DBMS", "Recovery", "Architecture"],
  },

  /* ==========================================================================
     9. Advanced Concepts & Operations
     ========================================================================== */
  {
    topicSlug: "dbms",
    slug: "stored-procedure-vs-function-vs-trigger",
    title: "What is the difference between a Stored Procedure, a Function, and a Trigger in SQL?",
    difficulty: "EASY",
    subtopic: "SQL Programming",
    synopsis: "Precompiled procedural scripts (Procedure) vs value-returning functions vs event handlers (Trigger).",
    shortAnswer:
      "A Stored Procedure is a precompiled set of SQL statements that can perform administrative actions, manage transaction boundaries (`COMMIT`/`ROLLBACK`), and return zero or multiple output values. A Function MUST return a single value/table, cannot modify database state (in standard SQL), and cannot manage transactions. A Trigger is an event handler that automatically executes in response to DML events (`BEFORE`/`AFTER` `INSERT`, `UPDATE`, `DELETE`).",
    detailedExplanation: [
      "**Stored Procedure:** Called via `CALL proc_name()`. Can execute DDL/DML, handle transactions, and return multiple parameters.",
      "**Function:** Called inside SQL expressions (`SELECT my_func(col) FROM table`). Must return a value; cannot manage transaction blocks.",
      "**Trigger:** Cannot be called manually by users. Executed automatically by the database engine on row modifications.",
    ],
    example: {
      language: "JAVA",
      code: `-- SQL Trigger: Automatically updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_update
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();`,
    },
    interviewTip:
      "Warn against putting heavy business logic in Triggers: Triggers create hidden side-effects that make debugging, testing, and microservice refactoring difficult.",
    commonTrap:
      "Calling a Stored Procedure directly inside a `SELECT` statement projection. Standard SQL functions can be called in SELECT; procedures cannot.",
    followUpQuestions: [
      "Why are triggers considered harmful in large enterprise microservices?",
      "Difference between IN, OUT, and INOUT parameters in stored procedures?",
    ],
    relatedTopics: ["Stored Procedures", "Triggers", "SQL Functions"],
    tags: ["DBMS", "SQL", "Database Design"],
  },
  {
    topicSlug: "dbms",
    slug: "database-index-fragmentation-rebuilding",
    title: "What causes Database Index Fragmentation and how is it resolved?",
    difficulty: "MEDIUM",
    subtopic: "Indexing",
    synopsis: "Internal page splits and external physical page out-of-order fragmentation resolved via REINDEX / REORGANIZE.",
    shortAnswer:
      "Index Fragmentation occurs when random `INSERT`, `UPDATE`, or `DELETE` operations cause B+ Tree page splits, leaving logical index pages physically out-of-order on disk (External Fragmentation) or leaves with low page fill factors (Internal Fragmentation). It is resolved by reorganizing or rebuilding indexes (`REINDEX` / `ALTER INDEX REBUILD`).",
    detailedExplanation: [
      "**Internal Fragmentation:** Random deletes or updates leave empty space inside B+ Tree index pages (e.g. page fill factor drops to 40%), wasting RAM and disk read bandwidth.",
      "**External Fragmentation:** Logical leaf node page chain order does not match physical contiguous disk layout due to frequent page splits, causing slow random disk I/O during range scans.",
      "**Prevention:** Use auto-incrementing sequential integers for primary keys instead of random UUIDs to ensure new rows are always appended to the rightmost index leaf node.",
    ],
    example: {
      language: "JAVA",
      code: `-- Rebuilding index in PostgreSQL
REINDEX INDEX idx_users_city;

-- Rebuilding all indexes on a table in MySQL / SQL Server
ALTER TABLE users REBUILD;`,
    },
    interviewTip:
      "Explain why random UUID primary keys (UUIDv4) cause index fragmentation: Random keys cause page splits everywhere across the B+ Tree, causing severe write amplification.",
    commonTrap:
      "Rebuilding indexes during peak production traffic hours without using `CONCURRENTLY` flag. Online index rebuilds block write locks unless executed concurrently.",
    followUpQuestions: [
      "Why do UUIDv7 (time-ordered UUIDs) solve B+ tree index fragmentation?",
      "How to use REINDEX CONCURRENTLY in PostgreSQL?",
    ],
    relatedTopics: ["Indexing", "Performance Tuning", "B+ Tree"],
    tags: ["DBMS", "Indexing", "Performance"],
  },
  {
    topicSlug: "dbms",
    slug: "optimistic-vs-pessimistic-locking-dbms",
    title: "What is the difference between Optimistic Locking and Pessimistic Locking in DBMS?",
    difficulty: "MEDIUM",
    subtopic: "Locking & Recovery",
    synopsis: "Locking rows upfront (Pessimistic) vs validating version headers on commit (Optimistic).",
    shortAnswer:
      "Pessimistic Locking assumes conflicts WILL happen and locks target rows upfront (`SELECT FOR UPDATE`), blocking other transactions until commit. Optimistic Locking assumes conflicts ARE RARE; it does not lock rows during read, but validates a version column (`@Version`) upon update, aborting if the version changed in between.",
    detailedExplanation: [
      "**Pessimistic Locking (`SELECT FOR UPDATE`):**",
      "- Prevents concurrent modifications completely.",
      "- Trade-off: High lock contention, risk of deadlocks, holds database connections open across network calls.",
      "**Optimistic Locking (Version Column):**",
      "- Query: `UPDATE products SET stock = 5, version = 2 WHERE id = 10 AND version = 1;`",
      "- If updated rows count is 0, another transaction modified the row first. Application catches exception and retries.",
      "- Trade-off: Ideal for high read/low write web applications.",
    ],
    example: {
      language: "JAVA",
      code: `-- Pessimistic Locking in SQL
BEGIN TRANSACTION;
  SELECT stock FROM products WHERE id = 10 FOR UPDATE; -- Acquires Exclusive Lock!
  UPDATE products SET stock = stock - 1 WHERE id = 10;
COMMIT;`,
    },
    interviewTip:
      "Use Optimistic Locking for web application REST APIs to maintain statelessness; use Pessimistic Locking for high-contention financial inventory allocation.",
    commonTrap:
      "Holding a Pessimistic Lock open across human user interactions (e.g. keeping row locked while user fills an HTML form).",
    followUpQuestions: [
      "How to implement Hibernate `@Version` for Optimistic Locking in Spring Boot?",
      "What is `SELECT FOR UPDATE SKIP LOCKED`?",
    ],
    relatedTopics: ["Locking", "Concurrency", "Optimistic Locking"],
    tags: ["DBMS", "Locking", "Concurrency"],
  },
  {
    topicSlug: "dbms",
    slug: "sql-injection-prevention-prepared-statements",
    title: "What is SQL Injection and how do Prepared Statements prevent it?",
    difficulty: "EASY",
    subtopic: "Security",
    synopsis: "Malicious SQL code injection via unsanitized inputs prevented by precompiled Prepared Statements.",
    shortAnswer:
      "SQL Injection (SQLi) is a vulnerability where an attacker injects malicious SQL fragments into application input fields, altering the structure of the database query. Prepared Statements (Parameterized Queries) completely prevent SQLi by separating SQL code compilation from parameter value binding.",
    detailedExplanation: [
      "**Vulnerability Mechanism:** Concatenating raw strings: `'SELECT * FROM users WHERE name = ' + userInput`. Input `' OR '1'='1` turns query into `WHERE name = '' OR '1'='1'`, returning all rows.",
      "**Prepared Statement Fix:** Database compiles query syntax tree with placeholders FIRST (`SELECT * FROM users WHERE name = ?`). Bound parameters are treated strictly as literal data constants, never executable code.",
    ],
    example: {
      language: "JAVA",
      code: `// Secure Parameterized Query in Java JDBC
String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement stmt = connection.prepareStatement(sql);
stmt.setString(1, userInputUsername); // Treated strictly as literal data!
stmt.setString(2, userInputPassword);
ResultSet rs = stmt.executeQuery();`,
    },
    interviewTip:
      "Emphasize: Input sanitization / string escaping is NOT enough. Prepared Statements are the ONLY 100% foolproof defense against SQL injection.",
    commonTrap:
      "Using Prepared Statements but dynamically concatenating table names (`ORDER BY ' + userColumn`). Parameter placeholders `?` only work for DATA VALUES, not table/column identifiers.",
    followUpQuestions: [
      "Why can't parameter placeholders `?` be used for table or column names?",
      "What is Second-Order SQL Injection?",
    ],
    relatedTopics: ["SQL Security", "Prepared Statements", "SQL Injection"],
    tags: ["DBMS", "Security", "SQL"],
  },
  {
    topicSlug: "dbms",
    slug: "connection-pooling-hikari-pgbouncer",
    title: "What is Database Connection Pooling and why is it required?",
    difficulty: "MEDIUM",
    subtopic: "Infrastructure",
    synopsis: "Caching reusable database connection objects to avoid TCP/authentication connection overhead.",
    shortAnswer:
      "Database Connection Pooling maintains a cache of pre-established database connection objects that are reused by application threads. Opening a new database connection requires expensive TCP handshakes, TLS negotiation, authentication, and backend process creation; pooling eliminates this overhead by reusing warm connections.",
    detailedExplanation: [
      "**Connection Overhead:** Creating a physical PostgreSQL connection takes ~30-50ms and allocates 2-10MB of memory on the database server.",
      "**Pool Mechanics:** Application thread borrows a connection from the pool (HikariCP / PgBouncer), executes SQL queries, and returns the connection to the pool instead of closing it.",
      "**Pool Sizing Rule:** Optimal pool size is small! Formula: Connections = (CPU Cores * 2) + Effective Spindle Count. A pool of 20-30 connections often handles thousands of concurrent app requests.",
    ],
    example: {
      language: "JAVA",
      code: `// HikariCP Spring Boot configuration in application.properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000`,
    },
    interviewTip:
      "Mention HikariCP as the fastest JVM connection pool, and PgBouncer as the standard lightweight connection proxy for PostgreSQL in serverless/microservice environments.",
    commonTrap:
      "Setting connection pool sizes arbitrarily large (e.g. 500 max connections). Oversized pools cause thread context switching thrashing and crash database memory.",
    followUpQuestions: [
      "What is PgBouncer and how does Transaction Pooling work?",
      "What is connection leak and how to detect it?",
    ],
    relatedTopics: ["Connection Pooling", "HikariCP", "Performance"],
    tags: ["DBMS", "Performance", "Infrastructure"],
  },
  {
    topicSlug: "dbms",
    slug: "database-denormalization-pros-cons",
    title: "What is Database Denormalization and when is it acceptable?",
    difficulty: "MEDIUM",
    subtopic: "Normalization",
    synopsis: "Intentionally introducing redundant data to optimize read query performance and eliminate JOINs.",
    shortAnswer:
      "Denormalization is the intentional strategy of adding redundant data or grouping data into fewer tables after normalization. It is used to optimize READ performance by eliminating complex runtime JOIN operations, at the expense of higher storage and slower, more complex WRITE operations.",
    detailedExplanation: [
      "**When to Denormalize:** High-scale Read-heavy applications (OLAP data warehouses, e-commerce product pages, reporting dashboards) where read latency is paramount.",
      "**Techniques:** Adding redundant foreign columns (e.g. adding `user_name` to `orders` table), storing pre-computed summary aggregations (`total_order_count` on `users` table), or using Materialized Views.",
      "**Trade-off:** Data updates must update redundant columns across multiple tables, requiring application transactions or triggers to avoid data inconsistency.",
    ],
    example: {
      language: "JAVA",
      code: `-- Denormalized Schema Example
-- Store customer_name inside orders table to avoid JOINs during fast invoice rendering
CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    customer_name VARCHAR(100), -- Redundant Denormalized Attribute!
    total_amount NUMERIC
);`,
    },
    interviewTip:
      "First normalize to 3NF to ensure clean domain design, then selectively denormalize based on empirical query performance metrics.",
    commonTrap:
      "Denormalizing prematurely without profiling slow queries with `EXPLAIN ANALYZE`.",
    followUpQuestions: [
      "What is Materialized View vs Standard View?",
      "How to keep denormalized columns synchronized using triggers or CDC?",
    ],
    relatedTopics: ["Denormalization", "Normalization", "Performance"],
    tags: ["DBMS", "Performance", "Architecture"],
  },
  {
    topicSlug: "dbms",
    slug: "database-replication-types-master-slave",
    title: "What is Database Replication (Primary-Replica, Synchronous vs Asynchronous)?",
    difficulty: "MEDIUM",
    subtopic: "Scaling",
    synopsis: "Copying data across server nodes for high availability, fault tolerance, and read scaling.",
    shortAnswer:
      "Database Replication copies data from a Primary (Master) server to one or more Replica (Slave) servers. In Synchronous Replication, the Primary waits for replica acknowledgment before committing (zero data loss, higher write latency). In Asynchronous Replication, the Primary commits immediately and ships WAL logs in background (low latency, risk of replication lag).",
    detailedExplanation: [
      "**Primary-Replica Architecture:** Writes are executed exclusively on Primary node; Read queries are distributed across multiple Replica nodes.",
      "**Synchronous Replication:** Guarantees strict consistency across replicas. If replica fails, primary write blocks.",
      "**Asynchronous Replication:** Primary commits without waiting. Highly scalable, but replica read queries may read slightly stale data (Replication Lag).",
      "**Semi-Synchronous Replication:** Primary waits for at least ONE replica to receive and write log to disk before committing.",
    ],
    example: {
      language: "JAVA",
      code: `-- Spring Data Read/Write Replica Routing DataSource Concept
-- Writes (@Transactional) -> Route to Primary DB (writer.db.company.com)
-- Reads (@Transactional(readOnly = true)) -> Route to Replica Pool (reader.db.company.com)`,
    },
    interviewTip:
      "When using read replicas, warn about 'Read-Your-Own-Writes' consistency: A user posts a comment, gets redirected to profile, but the read replica hasn't received the async replication log yet, so the user's comment disappears!",
    commonTrap:
      "Assuming read replicas increase write throughput. Read replicas only scale READ queries; write throughput is still bottlenecked by single primary node.",
    followUpQuestions: [
      "How do you solve Read-Your-Own-Writes consistency issues with read replicas?",
      "What is Multi-Master replication?",
    ],
    relatedTopics: ["Replication", "High Availability", "Scaling"],
    tags: ["DBMS", "Scalability", "Infrastructure"],
  },
];
