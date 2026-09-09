import type { ConceptualQuestion } from "../conceptual";

export const backendQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "backend",
    slug: "jwt-vs-session-authentication",
    title: "What is the difference between Session-based and JWT Authentication?",
    difficulty: "EASY",
    subtopic: "Authentication",
    synopsis: "Stateful server session lookup vs stateless self-contained cryptographically signed tokens.",
    shortAnswer:
      "Session-based auth is stateful: the server stores session data in memory/Redis and sends an opaque Session ID cookie to the client. JWT (JSON Web Token) is stateless: the server signs a self-contained payload containing user claims and sends it to the client, allowing any backend service to verify it without database lookups.",
    detailedExplanation: [
      "**Stateful Sessions.** Client sends a Session ID cookie. Server looks up session state in Redis/DB on every request. Easy to instantly invalidate (log out user), but requires centralized session storage across microservices.",
      "**Stateless JWT.** Token consists of three base64-encoded parts: \`Header.Payload.Signature\`. Verified cryptographically using a secret key or RSA public key. Eliminates DB lookups for user claims, but hard to instantly revoke before token expiration.",
      "**Security Best Practices.** Store JWTs in \`HttpOnly\`, \`SameSite=Strict\`, \`Secure\` cookies to prevent XSS and CSRF attacks. Use short-lived Access Tokens (15 min) paired with long-lived Refresh Tokens stored in DB/Redis for instant revocation capability.",
    ],
    example: {
      language: "JAVA",
      code: `// JWT Generation Structure (Header.Payload.Signature)
String jwtToken = Jwts.builder()
    .setSubject("user_123")
    .claim("role", "ADMIN")
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 900_000)) // 15 mins
    .signWith(SignatureAlgorithm.HS256, secretKey)
    .compact();`,
    },
    interviewTip:
      "A candidate who says 'JWTs are stored in localStorage' loses points due to XSS vulnerability (JavaScript can read localStorage). Always recommend `HttpOnly`, `Secure` cookies for web clients.",
    commonTrap:
      "Storing sensitive data like passwords or credit card numbers in a JWT payload. JWT payloads are base64-encoded and unencrypted (readable by anyone), only signed.",
    followUpQuestions: [
      "How do you implement immediate logout with stateless JWTs?",
      "Difference between symmetric (HMAC) and asymmetric (RSA/ECDSA) JWT signing?",
      "How to prevent CSRF attacks with SameSite cookies?",
    ],
    relatedTopics: ["Authentication", "Security", "JWT", "OAuth2"],
    tags: ["Backend", "Security", "Authentication"],
  },
  {
    topicSlug: "backend",
    slug: "redis-caching-strategies",
    title: "What are the common Redis Caching Strategies (Cache-Aside, Write-Through, Write-Behind)?",
    difficulty: "MEDIUM",
    subtopic: "Caching",
    synopsis: "Lazy loading vs synchronous write-through vs asynchronous batch write-behind.",
    shortAnswer:
      "Cache-Aside (Lazy Loading) queries Redis first; on a cache miss, it reads from the DB and writes to Redis. Write-Through updates Redis and DB synchronously in a single transaction. Write-Behind (Write-Back) updates Redis immediately and writes to DB asynchronously in batches, maximizing write throughput.",
    detailedExplanation: [
      "**Cache-Aside.** Application manages caching logic. Cache misses populate Redis. Best for read-heavy workloads (\`SELECT\`). Risk of stale data if DB is updated without invalidating Redis.",
      "**Write-Through.** Application writes to Cache; Cache synchronously writes to DB before returning. Guarantees consistency, but adds write latency.",
      "**Write-Behind (Write-Back).** Writes to Cache and returns immediately. Asynchronous background queue flushes updates to DB in bulk batches. Extremely fast for high-volume writes (e.g. analytics, view counters), but data loss occurs if Cache crashes before DB flush.",
    ],
    example: {
      language: "JAVA",
      code: `// Cache-Aside Pattern Implementation
public User getUser(String userId) {
    // 1. Try fetching from Redis
    User cachedUser = redisTemplate.opsForValue().get("user:" + userId);
    if (cachedUser != null) return cachedUser;

    // 2. Cache Miss: Fetch from DB
    User dbUser = userRepository.findById(userId);

    // 3. Populate Redis for subsequent reads (with TTL expiration!)
    redisTemplate.opsForValue().set("user:" + userId, dbUser, 1, TimeUnit.HOURS);
    return dbUser;
}`,
    },
    interviewTip:
      "Always set a TTL (Time-To-Live) on Redis cache keys! Without TTL or LRU eviction policies, Redis memory will fill up completely (Cache Stampede / OOM).",
    commonTrap:
      "Forgetting cache invalidation on DB writes when using Cache-Aside.",
    followUpQuestions: [
      "What is Cache Penetration, Cache Breakdown, and Cache Avalanche?",
      "How does Redis LRU vs LFU memory eviction work?",
      "What is a Bloom Filter?",
    ],
    relatedTopics: ["Caching", "Redis", "Performance"],
    tags: ["Backend", "Caching", "Redis"],
  },
];
