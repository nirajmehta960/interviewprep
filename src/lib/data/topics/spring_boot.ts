import type { ConceptualQuestion } from "../conceptual";

export const springBootQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "spring-boot",
    slug: "what-is-spring-boot-vs-spring",
    title: "What is Spring Boot and how does it differ from the core Spring Framework?",
    difficulty: "EASY",
    subtopic: "Core Concepts",
    synopsis: "Opinionated layer over Spring Framework providing starter dependencies and auto-configuration.",
    shortAnswer:
      "Spring Framework is the core Java enterprise framework providing Dependency Injection (IoC) and AOP. Spring Boot is an opinionated layer built on top of Spring that eliminates complex XML/Java configuration boilerplate through starter dependencies, embedded web servers (Tomcat), and automatic configuration.",
    detailedExplanation: [
      "Spring Framework requires manual XML/Java configuration beans, external WAR deployment to Tomcat, and explicit library dependency version management.",
      "Spring Boot provides 'opinionated defaults'—pre-configured starter POMs, embedded servlet containers, and automatic classpath-based configuration.",
      "Production-ready features out of the box: Health checks, metrics, externalized configuration, and zero code generation requirement.",
    ],
    interviewTip:
      "Frame the relationship clearly: 'Spring is the core framework engine; Spring Boot is the opinionated starter suite that automates setup and deployment.'",
    commonTrap:
      "Claiming Spring Boot replaces Spring. Spring Boot uses Spring Framework under the hood—it just automates configuration.",
    followUpQuestions: [
      "What is Spring Boot Auto-Configuration?",
      "Why does Spring Boot use embedded Tomcat by default?",
    ],
    relatedTopics: ["Spring Boot", "Spring Framework", "Architecture"],
    tags: ["Core Concepts", "Spring Boot"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-starter-dependencies",
    title: "What are Spring Boot Starter Dependencies and how do they simplify Maven/Gradle configurations?",
    difficulty: "EASY",
    subtopic: "Core Concepts",
    synopsis: "Curated dependency descriptor POMs managing version compatibility.",
    shortAnswer:
      "Spring Boot Starters are curated set of dependency descriptors that aggregate related libraries into a single dependency module (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`). They automatically manage compatible library versions via Spring Boot Bill of Materials (BOM).",
    detailedExplanation: [
      "`spring-boot-starter-web`: Pulls Spring MVC, REST support, Jackson JSON mapper, and embedded Tomcat.",
      "`spring-boot-starter-data-jpa`: Pulls Hibernate, Spring Data JPA, HikariCP connection pool, and JDBC.",
      "Dependency Management: Transitive version management eliminates Maven dependency version conflicts (`<version>` tags omitted).",
    ],
    example: {
      language: "JAVA",
      code: `<!-- Maven pom.xml example: single starter brings full REST stack -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>`,
    },
    interviewTip:
      "Highlight version management: starters eliminate 'JAR hell' by ensuring all transitively included library versions are tested and compatible with each other.",
    followUpQuestions: [
      "What is the Spring Boot Parent POM (spring-boot-starter-parent)?",
      "How to override a library version managed by Spring Boot BOM?",
    ],
    relatedTopics: ["Core Concepts", "Maven", "Dependencies"],
    tags: ["Core Concepts"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-autoconfigure-annotation",
    title: "How does Spring Boot Auto-Configuration work and what does @SpringBootApplication do under the hood?",
    difficulty: "MEDIUM",
    subtopic: "Core Concepts",
    synopsis: "@SpringBootApplication composite annotation and conditional bean registration.",
    shortAnswer:
      "`@SpringBootApplication` is a composite annotation combining `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. Auto-configuration checks classpath libraries and registers necessary beans conditionally using `@ConditionalOnClass`, `@ConditionalOnMissingBean`, and auto-configuration imports.",
    detailedExplanation: [
      "`@Configuration`: Marks class as a source of bean definitions.",
      "`@EnableAutoConfiguration`: Scans classpath dependencies and imports configuration classes from `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.",
      "`@ComponentScan`: Automatically discovers `@Component`, `@Service`, `@Repository`, and `@RestController` classes in the main package and sub-packages.",
    ],
    example: {
      language: "JAVA",
      code: `@SpringBootApplication // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`,
    },
    interviewTip:
      "Point out package scanning boundaries: `@ComponentScan` scans sub-packages of the main application class package by default. Placing classes outside this package prevents them from being discovered!",
    followUpQuestions: [
      "How to exclude a specific auto-configuration class (@SpringBootApplication(exclude = ...))?",
      "What are conditional annotations in Spring Boot?",
    ],
    relatedTopics: ["Core Concepts", "Annotations", "Auto-Configuration"],
    tags: ["Core Concepts", "Annotations"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-embedded-servers",
    title: "What are Embedded Servers in Spring Boot (Tomcat, Jetty, Undertow) and how can you change or disable them?",
    difficulty: "EASY",
    subtopic: "Web & Deployment",
    synopsis: "Self-contained servlet containers bundled directly within executable JAR files.",
    shortAnswer:
      "Spring Boot embeds web servers (Tomcat by default) directly within executable JAR files, eliminating external servlet container installations. Embedded servers can be swapped to Jetty or Undertow by excluding Tomcat in `pom.xml`, or disabled entirely for non-web batch jobs.",
    detailedExplanation: [
      "Embedded Server Types: Tomcat (default), Jetty (lightweight), Undertow (high concurrency non-blocking).",
      "Deployment Model: `java -jar application.jar` runs web app self-contained.",
      "Disabling Web Server: Set `spring.main.web-application-type=none` in properties for console/batch applications.",
    ],
    example: {
      language: "JAVA",
      code: `<!-- Exclude Tomcat and include Undertow in Maven -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>`,
    },
    interviewTip:
      "Explain the microservice advantage: executable JARs with embedded servers simplify Docker containerization and Kubernetes pod orchestration.",
    followUpQuestions: [
      "How to deploy a Spring Boot application as a traditional WAR file to external Tomcat?",
      "How to configure embedded Tomcat thread pool parameters in application.properties?",
    ],
    relatedTopics: ["Web & Deployment", "Tomcat", "Architecture"],
    tags: ["Web & Deployment"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-actuator",
    title: "What is Spring Boot Actuator and what key health/metrics endpoints does it provide (/health, /metrics, /info)?",
    difficulty: "MEDIUM",
    subtopic: "Observability",
    synopsis: "Production-ready monitoring, metrics, and health diagnostic HTTP endpoints.",
    shortAnswer:
      "Spring Boot Actuator (`spring-boot-starter-actuator`) provides production-ready monitoring and management endpoints. Key endpoints include `/actuator/health` (application health status), `/actuator/metrics` (Micrometer application metrics), `/actuator/env`, and `/actuator/loggers`.",
    detailedExplanation: [
      "`/health`: Shows application, database, and disk health status.",
      "`/metrics`: Exposes JVM heap, CPU usage, GC pause times, and HTTP request metrics for Prometheus/Grafana.",
      "`/loggers`: View and dynamically alter logging levels at runtime without restarting application.",
      "Security: Actuator endpoints should be secured via Spring Security (`management.endpoints.web.exposure.include=health,info,metrics`).",
    ],
    example: {
      language: "JAVA",
      code: `# application.properties actuator setup:
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always`,
    },
    interviewTip:
      "Security warning: Never expose `/actuator/env` or `/actuator/heapdump` publicly in production! They can leak secret passwords and database credentials.",
    commonTrap:
      "Exposing all actuator endpoints via `include=*` in production without Spring Security authentication.",
    followUpQuestions: [
      "How to create a custom HealthIndicator in Spring Boot?",
      "How to dynamically change logger levels using /actuator/loggers?",
    ],
    relatedTopics: ["Observability", "Actuator", "Security"],
    tags: ["Observability", "Actuator"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-profiles-environment",
    title: "How do Spring Boot Profiles work (@Profile, application-{profile}.properties)?",
    difficulty: "EASY",
    subtopic: "Configuration",
    synopsis: "Environment-specific bean registration and configuration property files.",
    shortAnswer:
      "Spring Profiles allow segregating application configuration for different environments (`dev`, `test`, `prod`). Property files follow the naming `application-{profile}.properties`, and beans can be conditionally loaded using `@Profile(\'prod\')`.",
    detailedExplanation: [
      "Activation: Activated via JVM argument `-Dspring.profiles.active=prod` or environment variable `SPRING_PROFILES_ACTIVE=prod`.",
      "Property Precedence: Profile-specific properties (`application-prod.properties`) override general properties (`application.properties`).",
      "`@Profile`: Restricts bean instantiation to matching active profiles.",
    ],
    example: {
      language: "JAVA",
      code: `@Service
@Profile("dev") // Instantiated ONLY when 'dev' profile is active
public class DevEmailService implements EmailService {
    public void sendEmail(String msg) { System.out.println("Mock dev email"); }
}`,
    },
    interviewTip:
      "Use Spring Profiles to inject mock service implementations (e.g., Mock Payment Gateway) in `dev` and real integrations in `prod`.",
    followUpQuestions: [
      "What is profile group in Spring Boot 2.4+?",
      "How to set default profile if no active profile is specified?",
    ],
    relatedTopics: ["Configuration", "Profiles", "Spring Core"],
    tags: ["Configuration"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-properties-yaml",
    title: "What is the difference between application.properties and application.yml in Spring Boot?",
    difficulty: "EASY",
    subtopic: "Configuration",
    synopsis: "Flat key-value property notation vs hierarchical structured YAML configuration.",
    shortAnswer:
      "Both configure Spring Boot applications. `application.properties` uses flat key-value pairs (`server.port=8080`). `application.yml` uses hierarchical YAML syntax (`server: port: 8080`), which reduces key repetition and improves readability for complex configurations.",
    detailedExplanation: [
      "`application.properties`: Simple, flat syntax. Supported everywhere. Does not support multi-profile documents cleanly in legacy versions.",
      "`application.yml`: Supports hierarchical nesting, lists, and multi-document separation using `---` dividers.",
      "`@PropertySource`: Only works with `.properties` files by default, not `.yml` files.",
    ],
    example: {
      language: "JAVA",
      code: `# application.yml equivalent:
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb`,
    },
    interviewTip:
      "Note that YAML properties cannot be loaded using `@PropertySource` annotations unless a custom `PropertySourceFactory` is supplied.",
    followUpQuestions: [
      "What is property precedence order in Spring Boot?",
      "How do environment variables map to application.yml properties (relaxed binding)?",
    ],
    relatedTopics: ["Configuration", "YAML"],
    tags: ["Configuration"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-configurationproperties-vs-value",
    title: "What is the difference between @Value and @ConfigurationProperties in Spring Boot?",
    difficulty: "MEDIUM",
    subtopic: "Configuration",
    synopsis: "Single property SpEL injection vs type-safe structured object property binding.",
    shortAnswer:
      "`@Value` injects individual properties using SpEL (`@Value(\'${server.port}\')`). `@ConfigurationProperties` binds an entire group of hierarchical properties into a strongly typed Java object with validation support and relaxed binding.",
    detailedExplanation: [
      "`@Value`: Good for injecting single primitive values or environment variables. Does not support relaxed binding or nested object hierarchies.",
      "`@ConfigurationProperties(prefix = \'app.mail\')`: Binds structured properties to JavaBean fields or Java Records. Supports JSR-380 validation (`@NotNull`, `@Min`) and relaxed binding (`app-mail` $\rightarrow$ `appMail`).",
    ],
    example: {
      language: "JAVA",
      code: `@ConfigurationProperties(prefix = "app.security")
public record SecurityProps(String jwtSecret, int expirationMs) {} // Type-safe record binding!`,
    },
    interviewTip:
      "Recommend `@ConfigurationProperties` over `@Value` for grouping configuration properties—it supports type safety, auto-completion in IDEs, and Bean Validation.",
    followUpQuestions: [
      "What is relaxed binding in Spring Boot configuration properties?",
      "How to enable validation on @ConfigurationProperties using @Validated?",
    ],
    relatedTopics: ["Configuration", "Annotations"],
    tags: ["Configuration"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-ioc-container-applicationcontext",
    title: "What is the Spring IoC (Inversion of Control) Container and ApplicationContext?",
    difficulty: "MEDIUM",
    subtopic: "Spring Core",
    synopsis: "Central container managing bean lifecycles and dependency resolution.",
    shortAnswer:
      "Inversion of Control (IoC) is a design pattern where object creation, lifecycle management, and dependency wiring are transferred from developer code to the framework. `ApplicationContext` is Spring's central IoC container interface responsible for instantiating, configuring, and wiring Spring Beans.",
    detailedExplanation: [
      "BeanFactory vs ApplicationContext: `BeanFactory` provides basic bean instantiation; `ApplicationContext` adds enterprise features (AOP, event publication, i18n message resolution, Web ApplicationContext).",
      "IoC Flow: Reads metadata (`@Component`, `@Bean`) $\rightarrow$ Instantiates object instances $\rightarrow$ Injects dependencies $\rightarrow$ Manages lifecycle.",
    ],
    interviewTip:
      "Explain the fundamental design win: IoC decouples high-level service logic from concrete dependency instantiation, making classes easy to mock and unit test.",
    followUpQuestions: [
      "Difference between BeanFactory and ApplicationContext?",
      "What is Spring IoC container initialization phase?",
    ],
    relatedTopics: ["Spring Core", "IoC", "Dependency Injection"],
    tags: ["Spring Core", "IoC"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-dependency-injection-types",
    title: "What is Dependency Injection (DI) and why is Constructor Injection preferred over @Autowired Field Injection?",
    difficulty: "MEDIUM",
    subtopic: "Spring Core",
    synopsis: "Constructor vs Setter vs Field injection and unit testing / immutability benefits.",
    shortAnswer:
      "Dependency Injection (DI) is the mechanism by which the IoC container supplies dependent objects to a class. Constructor Injection is preferred over `@Autowired` Field Injection because it enables `final` immutable fields, prevents `NullPointerExceptions` during unit testing without Spring, and catches circular dependencies at startup.",
    detailedExplanation: [
      "Field Injection (`@Autowired private Service s;`): Hides dependencies, makes pure unit testing impossible without Spring runner, allows mutable state.",
      "Constructor Injection (`public Class(Service s)`): 1. Fields can be declared `final` (immutable). 2. Plain JUnit unit tests can instantiate the class directly with `new Class(mockService)`. 3. Circular dependencies throw `BeanCurrentlyInCreationException` on startup.",
      "Implicit Autowiring: Since Spring 4.3, classes with a single constructor do not even need the `@Autowired` annotation!",
    ],
    example: {
      language: "JAVA",
      code: `@Service
public class UserService {
    private final UserRepository userRepository; // Final & immutable!

    public UserService(UserRepository userRepository) { // Preferred Constructor DI
        this.userRepository = userRepository;
    }
}`,
    },
    interviewTip:
      "State the 3 golden reasons: 1. Immutability (`final` fields), 2. Easy unit testing without Spring context, 3. Early circular dependency detection.",
    commonTrap:
      "Using `@Autowired` directly on private instance fields in production code.",
    followUpQuestions: [
      "How to resolve circular dependencies between two Spring Beans?",
      "What is Lombok's @RequiredArgsConstructor for constructor injection?",
    ],
    relatedTopics: ["Spring Core", "Dependency Injection", "Best Practices"],
    tags: ["Spring Core", "Dependency Injection"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-bean-scopes",
    title: "What are Spring Bean Scopes (singleton, prototype, request, session, application)?",
    difficulty: "MEDIUM",
    subtopic: "Spring Core",
    synopsis: "Bean instance lifecycle management across IoC container scopes.",
    shortAnswer:
      "Bean Scopes define the lifecycle and visibility of Spring Beans. The 5 core scopes are: `singleton` (default: 1 shared instance per IoC container), `prototype` (new instance created every time requested), `request` (1 instance per HTTP request), `session` (1 instance per HTTP session), and `application` (1 instance per ServletContext).",
    detailedExplanation: [
      "`singleton` (Default): Thread-safe state required! All application threads share the exact same bean instance.",
      "`prototype`: Container creates a new instance on every lookup/injection. Spring does NOT call `@PreDestroy` on prototype beans!",
      "Web Scopes: `request`, `session`, `application`, `websocket` available only in web-aware `ApplicationContext`.",
    ],
    example: {
      language: "JAVA",
      code: `@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE) // New instance per injection
public class ShoppingCartBean {}`,
    },
    interviewTip:
      "Call out Singleton State Trap: Because Spring Beans are singletons by default, instance fields must be thread-safe (or stateless) to avoid race conditions across concurrent web requests!",
    followUpQuestions: [
      "Why doesn't Spring manage the full lifecycle of prototype beans (@PreDestroy not invoked)?",
      "What is Scope Proxy (proxyMode = ScopedProxyMode.TARGET_CLASS)?",
    ],
    relatedTopics: ["Spring Core", "Bean Scopes", "Concurrency"],
    tags: ["Spring Core"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-bean-lifecycle-hooks",
    title: "What is the Spring Bean Lifecycle and what are @PostConstruct and @PreDestroy?",
    difficulty: "MEDIUM",
    subtopic: "Spring Core",
    synopsis: "Bean instantiation, dependency wiring, initialization callbacks, and destruction hooks.",
    shortAnswer:
      "The Spring Bean Lifecycle follows: 1) Instantiation, 2) Dependency Injection, 3) Aware Interfaces setup, 4) BeanPostProcessor pre-initialization, 5) `@PostConstruct` initialization callback, 6) Bean is ready for use, 7) `@PreDestroy` destruction callback when container shuts down.",
    detailedExplanation: [
      "Initialization: `@PostConstruct` executes immediately after dependency injection is completed.",
      "Destruction: `@PreDestroy` executes right before the bean is destroyed upon container shutdown.",
      "Interfaces Alternative: `InitializingBean` (`afterPropertiesSet()`) and `DisposableBean` (`destroy()`).",
      "`BeanPostProcessor`: Intercepts every bean before and after initialization (used for creating AOP proxies).",
    ],
    example: {
      language: "JAVA",
      code: `@Component
public class CacheManager {
    @PostConstruct
    public void init() { System.out.println("Cache warmed up after DI"); }

    @PreDestroy
    public void cleanup() { System.out.println("Cache cleared before shutdown"); }
}`,
    },
    interviewTip:
      "Explain why `@PostConstruct` is needed: You cannot access injected dependencies inside a standard class constructor because dependencies have not been injected yet!",
    followUpQuestions: [
      "What is BeanPostProcessor in Spring Framework?",
      "Why can't dependencies be accessed inside a bean constructor?",
    ],
    relatedTopics: ["Spring Core", "Bean Lifecycle", "Annotations"],
    tags: ["Spring Core"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-component-scanning",
    title: "How does Component Scanning (@ComponentScan) work in Spring Boot?",
    difficulty: "EASY",
    subtopic: "Spring Core",
    synopsis: "Automatic detection and registration of stereotype annotated Spring Beans.",
    shortAnswer:
      "`@ComponentScan` instructs Spring to scan specified packages for classes annotated with `@Component` (and derived stereotypes `@Service`, `@Repository`, `@RestController`), automatically registering them as Spring Beans in the IoC container.",
    detailedExplanation: [
      "Default Behavior: `@SpringBootApplication` includes `@ComponentScan` and scans the package of the main application class and all its sub-packages.",
      "Custom Packages: `@ComponentScan(basePackages = \'com.example.service\')`.",
      "Include/Exclude Filters: Restrict scanning using regex or annotation types.",
    ],
    interviewTip:
      "Common bug: Placing a service class in a parent or sibling package relative to `@SpringBootApplication` causes Spring to miss the bean during scanning, leading to `NoSuchBeanDefinitionException`.",
    followUpQuestions: [
      "What happens if a Spring Bean is defined outside the main package?",
      "Difference between @ComponentScan and @Import?",
    ],
    relatedTopics: ["Spring Core", "Component Scan", "Annotations"],
    tags: ["Spring Core"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-stereotype-annotations",
    title: "What is the difference between @Component, @Service, @Repository, and @Controller / @RestController?",
    difficulty: "EASY",
    subtopic: "Spring Core",
    synopsis: "Stereotype annotations designating functional roles and framework features.",
    shortAnswer:
      "`@Component` is the generic stereotype for any Spring-managed bean. `@Service` designates business logic. `@Repository` designates data persistence and translates SQL exceptions into Spring DataAccessException. `@Controller` handles web MVC, while `@RestController` combines `@Controller` and `@ResponseBody` for JSON/XML REST APIs.",
    detailedExplanation: [
      "`@Component`: Generic stereotype annotation.",
      "`@Service`: Specialization for business service layer.",
      "`@Repository`: Specialization for DAO/Persistence layer. Enables automatic SQL exception translation into Spring's un-checked `DataAccessException` hierarchy.",
      "`@Controller`: Handles web HTML views (Spring MVC).",
      "`@RestController`: Specialization for RESTful Web Services (combines `@Controller` + `@ResponseBody`). Every method returns JSON/XML directly.",
    ],
    interviewTip:
      "Highlight `@Repository` extra feature: it doesn't just register a bean—it enables Spring's automatic SQL exception translation mechanism!",
    followUpQuestions: [
      "Why use specialized stereotypes over generic @Component?",
      "How does @ResponseBody convert Java objects to JSON?",
    ],
    relatedTopics: ["Spring Core", "Annotations", "REST APIs"],
    tags: ["Spring Core", "Annotations"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-primary-vs-qualifier",
    title: "What is the difference between @Primary and @Qualifier annotations when resolving ambiguous bean wiring?",
    difficulty: "EASY",
    subtopic: "Spring Core",
    synopsis: "Default priority bean resolution vs explicit bean name selection.",
    shortAnswer:
      "When multiple beans of the same interface type exist, `@Primary` marks one bean as the default fallback choice for injection. `@Qualifier(\'beanName\')` explicitly specifies the exact bean name to inject at the specific injection site.",
    detailedExplanation: [
      "`@Primary`: Declared on the bean class definition. Acts as default priority when no qualifier is specified.",
      "`@Qualifier(\'specificName\')`: Declared at the injection point (`constructor` or parameter). Takes precedence over `@Primary`.",
      "Unresolved Ambiguity: Having multiple matching beans without `@Primary` or `@Qualifier` causes `NoUniqueBeanDefinitionException` on startup.",
    ],
    example: {
      language: "JAVA",
      code: `@Component
@Primary
public class SqlUserRepository implements UserRepository {}

@Component("mongoRepo")
public class MongoUserRepository implements UserRepository {}

// Injection site selecting mongo explicit qualifier:
public UserService(@Qualifier("mongoRepo") UserRepository repo) { this.repo = repo; }`,
    },
    interviewTip:
      "Precedence rule: `@Qualifier` always overrides `@Primary` if both are present.",
    followUpQuestions: [
      "What error occurs when multiple beans match an injection point without @Primary or @Qualifier?",
      "How to inject all beans of an interface into a List<Interface>?",
    ],
    relatedTopics: ["Spring Core", "Dependency Injection", "Annotations"],
    tags: ["Spring Core"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-restcontroller-vs-controller",
    title: "What is the difference between @Controller and @RestController in Spring MVC?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "HTML template rendering controllers vs JSON/XML REST API controllers.",
    shortAnswer:
      "`@Controller` is used for traditional web applications returning HTML views (rendered via Thymeleaf/JSP). `@RestController` is a convenient meta-annotation combining `@Controller` and `@ResponseBody`, returning domain objects directly serialized into JSON/XML payloads.",
    detailedExplanation: [
      "`@Controller`: Methods return a `String` view name (`\'index\'`) resolved by `ViewResolver`.",
      "`@RestController`: Every method implicitly has `@ResponseBody` attached, bypassing view resolution to serialize objects via Jackson `HttpMessageConverter`.",
    ],
    interviewTip:
      "Mention Jackson mapper: `@RestController` uses `MappingJackson2HttpMessageConverter` under the hood to convert Java DTOs to JSON.",
    followUpQuestions: [
      "How to return HTML view from a @RestController?",
      "What is HttpMessageConverter in Spring MVC?",
    ],
    relatedTopics: ["Web & REST", "REST APIs", "Annotations"],
    tags: ["Web & REST"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-requestmapping-shortcuts",
    title: "What are Request Mapping annotations (@GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping)?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "Composed shortcut annotations mapping HTTP request methods to controller handler methods.",
    shortAnswer:
      "These are composed HTTP method shortcuts for `@RequestMapping`. `@GetMapping` handles HTTP `GET`, `@PostMapping` handles `POST`, `@PutMapping` handles full updates `PUT`, `@DeleteMapping` handles `DELETE`, and `@PatchMapping` handles partial updates `PATCH`.",
    detailedExplanation: [
      "`@GetMapping(\'/users\')` $\equiv$ `@RequestMapping(value=\'/users\', method=RequestMethod.GET)`.",
      "Class-level `@RequestMapping(\'/api/v1\')` sets base path URI prefix for all controller methods.",
      "Idempotency semantics: `GET`, `PUT`, `DELETE` should be idempotent; `POST` is non-idempotent.",
    ],
    interviewTip:
      "Tie HTTP methods to REST semantics: `PUT` replaces the entire target resource; `PATCH` updates only specified fields.",
    followUpQuestions: [
      "Difference between PUT and PATCH in RESTful API design?",
      "What is HTTP method idempotency?",
    ],
    relatedTopics: ["Web & REST", "REST APIs"],
    tags: ["Web & REST"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-requestparam-vs-pathvariable",
    title: "What is the difference between @RequestParam, @PathVariable, and @RequestBody in Spring REST APIs?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "URL query parameters vs URI path segments vs HTTP request body JSON payloads.",
    shortAnswer:
      "`@PathVariable` extracts values directly from URI template path segments (`/users/{id}`). `@RequestParam` extracts query parameters (`/users?page=1`) or form data. `@RequestBody` deserializes the incoming JSON HTTP request body into a Java DTO object.",
    detailedExplanation: [
      "`@PathVariable(\'id\') Long id`: Extracting resource identifiers from URL path.",
      "`@RequestParam(name=\'page\', defaultValue=\'0\') int page`: Filtering, sorting, and pagination parameters.",
      "`@RequestBody @Valid CreateUserRequest dto`: Deserializes JSON payload via Jackson and triggers Jakarta Bean Validation.",
    ],
    example: {
      language: "JAVA",
      code: `@GetMapping("/users/{id}")
public UserDto getUser(@PathVariable("id") Long id, @RequestParam(name="detail", defaultValue="false") boolean detail) {
    return userService.findUser(id, detail);
}`,
    },
    interviewTip:
      "Rule of thumb: Use `@PathVariable` to identify a specific resource; use `@RequestParam` to filter/sort/paginate collections of resources.",
    followUpQuestions: [
      "What happens if a required @RequestParam is missing in HTTP request?",
      "How to extract HTTP headers using @RequestHeader?",
    ],
    relatedTopics: ["Web & REST", "REST APIs"],
    tags: ["Web & REST"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-responseentity-http-status",
    title: "How does ResponseEntity<T> work for customizing HTTP status codes and headers in Spring REST controllers?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "Wrapping REST API responses with explicit HTTP status codes, headers, and body.",
    shortAnswer:
      "`ResponseEntity<T>` represents the complete HTTP response, including HTTP status code (`200 OK`, `201 Created`, `404 Not Found`), response headers, and body payload `T`, giving full control over REST endpoint outputs.",
    detailedExplanation: [
      "Fluent Builder API: `ResponseEntity.status(HttpStatus.CREATED).header(\'X-Custom\', \'val\').body(dto)`.",
      "Shortcut Methods: `ResponseEntity.ok(body)`, `ResponseEntity.notFound().build()`, `ResponseEntity.noContent().build()`.",
    ],
    example: {
      language: "JAVA",
      code: `@PostMapping
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest req) {
    UserDto created = userService.create(req);
    URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(created.id()).toUri();
    return ResponseEntity.created(location).body(created); // 201 Created with Location header
}`,
    },
    interviewTip:
      "Highlight REST best practice: returning `201 Created` along with a `Location` header pointing to the newly created resource URI.",
    followUpQuestions: [
      "Difference between @ResponseStatus and ResponseEntity?",
      "How to set cookies in ResponseEntity headers?",
    ],
    relatedTopics: ["Web & REST", "REST APIs"],
    tags: ["Web & REST"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-exception-handler-controlleradvice",
    title: "How do @ExceptionHandler and @ControllerAdvice / @RestControllerAdvice work for global error handling?",
    difficulty: "MEDIUM",
    subtopic: "Web & REST",
    synopsis: "Centralized cross-cutting REST API exception handling and unified error response structures.",
    shortAnswer:
      "`@RestControllerAdvice` is a component that intercept exceptions thrown across ALL `@RestController` controllers. Paired with `@ExceptionHandler(CustomException.class)` methods, it catches specified exceptions centrally and formats unified error payload responses (`ProblemDetail` / custom Error DTOs).",
    detailedExplanation: [
      "Centralized Handling: Prevents duplicating `try-catch` blocks inside individual controller methods.",
      "Custom Exceptions: Intercepts business domain exceptions (`UserNotFoundException`, `InsufficientBalanceException`) and maps them to appropriate HTTP status codes (`404`, `400`).",
      "Bean Validation Interception: Catches `MethodArgumentNotValidException` to extract field-level validation errors into clean API error responses.",
    ],
    example: {
      language: "JAVA",
      code: `@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse err = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
}`,
    },
    interviewTip:
      "Explain the architectural clean-code win: `@RestControllerAdvice` keeps REST controllers focused purely on happy-path request routing while centralizing error logic.",
    followUpQuestions: [
      "What is RFC 7807 Problem Details for HTTP APIs in Spring Boot 3?",
      "How to handle MethodArgumentNotValidException for invalid request bodies?",
    ],
    relatedTopics: ["Web & REST", "Exception Handling", "REST APIs"],
    tags: ["Web & REST", "Exception Handling"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-data-jpa-repositories",
    title: "What is Spring Data JPA and what is the difference between CrudRepository, PagingAndSortingRepository, and JpaRepository?",
    difficulty: "MEDIUM",
    subtopic: "Data & JPA",
    synopsis: "Abstracting DAO boilerplates and interface hierarchy capabilities.",
    shortAnswer:
      "Spring Data JPA reduces boilerplate DAO code by generating query implementations automatically from interface definitions. `CrudRepository` provides basic CRUD methods. `PagingAndSortingRepository` adds pagination and sorting capabilities. `JpaRepository` extends both, adding JPA-specific features (`flush()`, batch deletes, `saveAndFlush()`).",
    detailedExplanation: [
      "`CrudRepository<T, ID>`: Standard CRUD operations (`save`, `findById`, `deleteById`).",
      "`PagingAndSortingRepository<T, ID>`: Adds `findAll(Pageable)` and `findAll(Sort)`.",
      "`JpaRepository<T, ID>`: Extends PagingAndSorting. Returns `List` instead of `Iterable`, adds flush methods (`flush()`, `saveAndFlush()`, `deleteInBatch()`).",
    ],
    example: {
      language: "JAVA",
      code: `public interface UserRepository extends JpaRepository<User, Long> {
    // Derived query generated automatically by Spring Data JPA!
    Optional<User> findByEmail(String email);
}`,
    },
    interviewTip:
      "Recommend `JpaRepository` for standard enterprise applications due to rich batch operations and `Pageable` support.",
    followUpQuestions: [
      "How does Spring Data JPA generate SQL queries from method names?",
      "What is the difference between save() and saveAndFlush()?",
    ],
    relatedTopics: ["Data & JPA", "Spring Data", "Hibernate"],
    tags: ["Data & JPA"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-jpa-derived-query-methods",
    title: "How do Derived Query Methods (Query Creation from Method Names) work in Spring Data JPA?",
    difficulty: "EASY",
    subtopic: "Data & JPA",
    synopsis: "Automated SQL query generation parsing repository method name syntax.",
    shortAnswer:
      "Derived Query Methods automatically generate SQL queries by parsing repository method names according to a strict keyword convention (e.g. `findByEmailAndStatus(email, status)` compiles to `SELECT u FROM User u WHERE u.email = ?1 AND u.status = ?2`).",
    detailedExplanation: [
      "Method Prefixes: `find...By`, `read...By`, `query...By`, `count...By`, `delete...By`.",
      "Supported Keywords: `And`, `Or`, `Is`, `Equals`, `Between`, `LessThan`, `GreaterThan`, `Like`, `Containing`, `OrderBy`, `IgnoreCase`.",
      "Limitations: Overly long method names hurt readability—use `@Query` (JPQL/Native SQL) for complex multi-join queries.",
    ],
    example: {
      language: "JAVA",
      code: `public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdAndStatusOrderByCreatedAtDesc(Long customerId, String status);
}`,
    },
    interviewTip:
      "State rule of thumb: Use Derived Query Methods for simple 1-2 property lookups; switch to `@Query(\'SELECT...\')` JPQL for complex multi-table joins.",
    followUpQuestions: [
      "How to execute native SQL queries using @Query(nativeQuery = true)?",
      "What is Modifying Query (@Modifying @Query)?",
    ],
    relatedTopics: ["Data & JPA", "Spring Data", "JPA"],
    tags: ["Data & JPA"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-jpa-n-plus-1-problem",
    title: "What is the N+1 Select Query problem in Hibernate/JPA and how do you resolve it (JOIN FETCH, @EntityGraph)?",
    difficulty: "HARD",
    subtopic: "Data & JPA",
    synopsis: "Lazy loading database query explosion and fetching optimization strategies.",
    shortAnswer:
      "The N+1 Query problem occurs when fetching 1 parent entity results in N additional database queries to load its lazy-loaded child entities. It is resolved using `JOIN FETCH` in JPQL queries, `@EntityGraph`, or DTO projections.",
    detailedExplanation: [
      "Cause: Fetching a list of N `User` entities with lazy `@OneToMany List<Order> orders`. Iterating over users and calling `user.getOrders()` executes N separate SQL queries.",
      "Solution 1 (`JOIN FETCH`): `@Query(\'SELECT u FROM User u JOIN FETCH u.orders\')` fetches parent and children in 1 SQL query.",
      "Solution 2 (`@EntityGraph`): `@EntityGraph(attributePaths = {\'orders\'})` dynamically changes fetch plan to eager for specified method.",
      "Solution 3 (DTO Projection): Fetching only required fields directly into a record/DTO via interface or constructor projection.",
    ],
    example: {
      language: "JAVA",
      code: `public interface UserRepository extends JpaRepository<User, Long> {
    // Fix N+1 with JOIN FETCH in 1 SQL Query:
    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.roles")
    List<User> findAllWithRoles();

    // Or using EntityGraph:
    @EntityGraph(attributePaths = {"roles"})
    List<User> findAll();
}`,
    },
    interviewTip:
      "Diagnosing N+1 queries is one of the most critical performance checks in Java interviews—always mention `JOIN FETCH` and `@EntityGraph`.",
    followUpQuestions: [
      "What is the difference between FetchType.LAZY and FetchType.EAGER?",
      "Why is FetchType.EAGER dangerous for @OneToMany relationships?",
    ],
    relatedTopics: ["Data & JPA", "Hibernate", "Performance", "JPA"],
    tags: ["Data & JPA", "Performance"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-transactional-annotation",
    title: "How does the @Transactional annotation work in Spring and why doesn't self-invocation trigger a transaction?",
    difficulty: "HARD",
    subtopic: "Transactions",
    synopsis: "AOP proxy transaction interceptors, rollback rules, and internal self-invocation proxy bypass.",
    shortAnswer:
      "`@Transactional` uses Spring AOP proxies to wrap method calls in database transaction boundaries. Self-invocation (`this.method()`) bypasses the AOP proxy completely, executing the method directly without starting a transaction.",
    detailedExplanation: [
      "AOP Proxy Mechanism: Spring creates a dynamic proxy wrapper around the target bean. The proxy starts DB transaction before method entry and commits/rolls back on exit.",
      "Self-Invocation Trap: Calling a `@Transactional` method from another method inside the same class calls `this.method()`, which bypasses the outer AOP proxy!",
      "Rollback Default: Rolls back ONLY for unchecked exceptions (`RuntimeException` and `Error`). Checked exceptions do NOT trigger rollback unless `rollbackFor = Exception.class` is set.",
    ],
    example: {
      language: "JAVA",
      code: `@Service
public class OrderService {
    // Broken: Internal call bypasses AOP proxy!
    public void processOrder() {
        this.saveTx(); // NO transaction started!
    }

    @Transactional
    public void saveTx() { /* DB operations */ }
}`,
    },
    interviewTip:
      "Explain the fix for self-invocation: refactor the `@Transactional` method into a separate Spring Bean or inject `ObjectProvider<OrderService>` to invoke via proxy.",
    commonTrap:
      "Expecting checked exceptions (`Exception`) to roll back transactions by default without specifying `rollbackFor = Exception.class`.",
    followUpQuestions: [
      "How to fix self-invocation transaction bypass in Spring?",
      "What is rollbackFor attribute in @Transactional?",
    ],
    relatedTopics: ["Transactions", "AOP", "Spring Core"],
    tags: ["Transactions", "AOP"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-transaction-propagation-isolation",
    title: "What are Transaction Propagation levels (REQUIRED, REQUIRES_NEW, MANDATORY) and Isolation levels in Spring?",
    difficulty: "HARD",
    subtopic: "Transactions",
    synopsis: "Transaction context propagation rules and ACID database isolation levels.",
    shortAnswer:
      "Transaction Propagation defines how transaction boundaries behave when a transactional method calls another transactional method. `REQUIRED` (default) joins existing transaction or creates a new one. `REQUIRES_NEW` pauses existing transaction and starts an independent new transaction. `MANDATORY` requires an active transaction or throws an exception.",
    detailedExplanation: [
      "`REQUIRED` (Default): Joins current transaction if present; creates new one if absent.",
      "`REQUIRES_NEW`: Always creates a new independent transaction, suspending any existing outer transaction.",
      "`MANDATORY`: Must run inside an existing transaction; throws `IllegalTransactionStateException` if no transaction exists.",
      "`SUPPORTS`: Runs inside transaction if present; runs non-transactionally if absent.",
      "`NEVER`: Throws exception if a transaction exists.",
      "Isolation Levels: `DEFAULT`, `READ_UNCOMMITTED`, `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE` (preventing dirty reads, non-repeatable reads, phantom reads).",
    ],
    example: {
      language: "JAVA",
      code: `@Transactional(propagation = Propagation.REQUIRES_NEW)
public void auditLog(String action) {
    // Runs in independent transaction; commits even if outer transaction rolls back!
}`,
    },
    interviewTip:
      "Use `REQUIRES_NEW` for audit logging: audit logs should commit independently even if the outer business transaction fails and rolls back.",
    followUpQuestions: [
      "What is the difference between dirty read, non-repeatable read, and phantom read?",
      "How does REQUIRES_NEW suspend an existing transaction in Spring?",
    ],
    relatedTopics: ["Transactions", "Database", "ACID"],
    tags: ["Transactions"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-aop-aspect-oriented-programming",
    title: "What is Spring AOP (Aspect-Oriented Programming), JoinPoints, Pointcuts, and Advice (@Before, @After, @Around)?",
    difficulty: "HARD",
    subtopic: "AOP",
    synopsis: "Decoupling cross-cutting concerns (logging, security, transactions) via proxy aspects.",
    shortAnswer:
      "Spring AOP decouples cross-cutting concerns (logging, security, auditing) from core business logic. An **Aspect** contains **Advice** (action code executed `@Before`, `@After`, `@Around`) applied at **JoinPoints** matching defined **Pointcut** expressions.",
    detailedExplanation: [
      "Aspect (`@Aspect`): Module encapsulating cross-cutting concern.",
      "JoinPoint: Execution point in application (method execution in Spring AOP).",
      "Pointcut (`@Pointcut`): Expression matching specific JoinPoints (`execution(* com.example.service.*.*(..))`).",
      "Advice Types: `@Before` (runs before method), `@AfterReturning` (runs on success), `@AfterThrowing` (runs on error), `@After` (runs finally), `@Around` (wraps execution using `ProceedingJoinPoint`).",
    ],
    example: {
      language: "JAVA",
      code: `@Aspect
@Component
public class LoggingAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed(); // Proceed with target method
        long executionTime = System.currentTimeMillis() - start;
        System.out.println(joinPoint.getSignature() + " executed in " + executionTime + "ms");
        return proceed;
    }
}`,
    },
    interviewTip:
      "`@Around` advice is the most powerful advice type because it can inspect/modify parameters, measure execution time, or swallow/transform return values.",
    followUpQuestions: [
      "What is ProceedingJoinPoint in @Around advice?",
      "Difference between Spring AOP and AspectJ?",
    ],
    relatedTopics: ["AOP", "Design Patterns", "Spring Core"],
    tags: ["AOP", "Advanced Spring"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-aop-proxy-jdk-cglib",
    title: "What is the difference between JDK Dynamic Proxies and CGLIB Proxies in Spring AOP?",
    difficulty: "HARD",
    subtopic: "AOP",
    synopsis: "Interface-based Java reflection proxies vs subclass-based bytecode generation proxies.",
    shortAnswer:
      "JDK Dynamic Proxies require target classes to implement at least one `interface` (proxies via interface delegation). CGLIB Proxies create dynamic subclasses at runtime to proxy concrete classes without interfaces. Spring Boot 2+ defaults to CGLIB proxies (`spring.aop.proxy-target-class=true`).",
    detailedExplanation: [
      "JDK Dynamic Proxy: Built into Java (`java.lang.reflect.Proxy`). Proxy extends `Proxy` and implements target interface.",
      "CGLIB Proxy: Generates runtime byte-code subclass extending target class. Cannot proxy `final` classes or `final` methods!",
      "Spring Boot 2+ Default: Uses CGLIB by default for consistent bean proxying regardless of interface presence.",
    ],
    interviewTip:
      "Explain why CGLIB cannot proxy `final` classes or `final` methods: CGLIB generates a runtime subclass, and Java forbids extending `final` classes or overriding `final` methods.",
    followUpQuestions: [
      "Why can't CGLIB proxy final methods?",
      "How to force JDK Dynamic Proxies in Spring Boot?",
    ],
    relatedTopics: ["AOP", "Proxies", "JVM"],
    tags: ["AOP", "Internals"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-security-architecture",
    title: "How does Spring Security work internally (SecurityFilterChain, DelegatingFilterProxy, AuthenticationManager)?",
    difficulty: "HARD",
    subtopic: "Security",
    synopsis: "Servlet filter chains, security filter proxies, authentication managers, and SecurityContext.",
    shortAnswer:
      "Spring Security hooks into the Servlet container via `DelegatingFilterProxy`, which delegates HTTP request filtering to `FilterChainProxy` containing a chain of `SecurityFilterChain` filters. `AuthenticationManager` authenticates credentials, storing the authenticated token in `SecurityContextHolder`.",
    detailedExplanation: [
      "`DelegatingFilterProxy`: Bridge between Servlet container filter lifecycle and Spring ApplicationContext Beans.",
      "`SecurityFilterChain`: Chain of Spring Security filters (`UsernamePasswordAuthenticationFilter`, `JwtAuthenticationFilter`, `ExceptionTranslationFilter`).",
      "`AuthenticationManager`: Delegates authentication to `AuthenticationProvider` instances (e.g. `DaoAuthenticationProvider`).",
      "`SecurityContextHolder`: Holds current thread's `SecurityContext` storing authenticated `Authentication` principal.",
    ],
    example: {
      language: "JAVA",
      code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}`,
    },
    interviewTip:
      "Highlight thread-local storage: `SecurityContextHolder` uses a `ThreadLocal` by default to hold the current user's authentication details per request thread.",
    followUpQuestions: [
      "How is SecurityContext stored across thread pools in async execution?",
      "What is AuthenticationProvider in Spring Security?",
    ],
    relatedTopics: ["Security", "Spring Security", "Architecture"],
    tags: ["Security", "Spring Security"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-security-jwt-authentication",
    title: "How do you implement Stateless JWT (JSON Web Token) Authentication in Spring Security?",
    difficulty: "HARD",
    subtopic: "Security",
    synopsis: "Custom OncePerRequestFilter, stateless session policy, and JWT signature verification.",
    shortAnswer:
      "Stateless JWT Authentication is implemented by: 1) Setting `SessionCreationPolicy.STATELESS`, 2) Creating a custom `OncePerRequestFilter` that extracts the `Bearer` token from `Authorization` header, verifies signature, extracts user claims, and populates `SecurityContextHolder.getContext().setAuthentication(authToken)`.",
    detailedExplanation: [
      "Stateless Session: Disables HTTP Sessions (`SessionCreationPolicy.STATELESS`). Server retains zero session state.",
      "`OncePerRequestFilter`: Guarantees filter executes exactly once per HTTP request.",
      "Token Validation: Parses JWT using secret key, validates expiration, loads `UserDetails`.",
      "Filter Registration: Injected into filter chain before `UsernamePasswordAuthenticationFilter` (`addFilterBefore`).",
    ],
    example: {
      language: "JAVA",
      code: `public class JwtFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String token = parseJwt(req);
        if (token != null && jwtUtils.validateToken(token)) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(jwtUtils.getUserNameFromToken(token));
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(req, res);
    }
}`,
    },
    interviewTip:
      "Emphasize `OncePerRequestFilter`: extending `OncePerRequestFilter` guarantees that the JWT extraction logic executes once per request across different dispatch types.",
    followUpQuestions: [
      "Why is OncePerRequestFilter preferred over standard Filter interface?",
      "How to handle JWT refresh tokens securely?",
    ],
    relatedTopics: ["Security", "JWT", "Spring Security"],
    tags: ["Security", "JWT"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-security-cors-csrf",
    title: "How to configure CORS and CSRF protection in Spring Security?",
    difficulty: "MEDIUM",
    subtopic: "Security",
    synopsis: "Cross-origin resource sharing configuration and CSRF protection for REST APIs.",
    shortAnswer:
      "CORS is configured by defining a `CorsConfigurationSource` bean setting allowed origins, methods, and headers. CSRF protection is enabled by default for session-based web apps, but disabled (`csrf.disable()`) for stateless REST APIs using JWT tokens.",
    detailedExplanation: [
      "CORS Configuration: `CorsConfiguration.setAllowedOrigins(List.of(\'https://app.com\'))`.",
      "CSRF Disable Rule: Disable CSRF ONLY when the application is stateless (REST APIs using JWTs in custom headers) because browsers do not automatically attach JWT headers on cross-site form submissions.",
      "CSRF Enable Rule: Keep CSRF enabled if using session cookies for authentication.",
    ],
    interviewTip:
      "Explain *why* CSRF is disabled for stateless JWT REST APIs: CSRF attacks rely on browsers auto-submitting session cookies. Custom `Authorization: Bearer <token>` headers are NOT automatically sent by browsers on cross-site form posts.",
    followUpQuestions: [
      "Why is CSRF disabled for stateless REST APIs?",
      "How to configure CookieCsrfTokenRepository in Spring Security?",
    ],
    relatedTopics: ["Security", "CORS", "CSRF"],
    tags: ["Security"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-devtools-hot-reloading",
    title: "What is spring-boot-devtools and how does Automatic Restart / LiveReload work?",
    difficulty: "EASY",
    subtopic: "Developer Tools",
    synopsis: "Classpath monitoring, dual ClassLoader automatic restarts, and LiveReload browser refresh.",
    shortAnswer:
      "`spring-boot-devtools` speeds up development by providing Automatic Restarts whenever files on the classpath change, LiveReload for auto-refreshing browsers, and disabling template caching defaults.",
    detailedExplanation: [
      "Dual ClassLoader Architecture: Uses two ClassLoaders—base ClassLoader (for 3rd party JARs that don't change) and restart ClassLoader (for project code). Restarting reloads ONLY the project ClassLoader (extremely fast!).",
      "Disabled Caching: Automatically sets template engine caching (Thymeleaf/Freemarker) to `false` during development.",
      "Dev Only: Disabled automatically when running packaged production JARs (`java -jar`).",
    ],
    interviewTip:
      "Explain the dual ClassLoader trick: devtools restarts in under 1 second because 3rd-party library JARs remain loaded in the base ClassLoader!",
    followUpQuestions: [
      "How does dual ClassLoader architecture speed up Spring Boot restarts?",
      "How to exclude specific resources from trigger restarts (.devtoolsignore)?",
    ],
    relatedTopics: ["Developer Tools", "JVM"],
    tags: ["Developer Tools"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-banner-customization",
    title: "How do you customize or disable the Spring Boot Startup Banner?",
    difficulty: "EASY",
    subtopic: "Configuration",
    synopsis: "Customizing ASCII console banners or disabling banner output.",
    shortAnswer:
      "The startup banner can be customized by placing a `banner.txt` file in the `src/main/resources` directory. It can be disabled by setting `spring.main.banner-mode=off` in properties or via `SpringApplication.setBannerMode(Banner.Mode.OFF)`.",
    detailedExplanation: [
      "`banner.txt`: Supports ANSI color codes, application version placeholders (`${application.version}`), and Spring Boot version (`${spring-boot.version}`).",
      "Image Banners: Supports `banner.png` or `banner.jpg` rendered as ASCII art.",
      "Programmatic Disable: `app.setBannerMode(Banner.Mode.OFF)`.",
    ],
    interviewTip:
      "Useful for quiet CLI microservices or containerized logging aggregators where ASCII banners clutter log stream parsers.",
    followUpQuestions: [
      "How to print dynamic application metadata inside banner.txt?",
      "What are ANSI color codes in Spring Boot banners?",
    ],
    relatedTopics: ["Configuration", "Console Output"],
    tags: ["Configuration"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-cli",
    title: "What is the Spring Boot CLI?",
    difficulty: "EASY",
    subtopic: "Developer Tools",
    synopsis: "Command-line tool for prototyping Spring applications using Groovy scripts.",
    shortAnswer:
      "The Spring Boot CLI is a command-line tool that allows developers to prototype and build Spring applications rapidly using Groovy scripts without verbose Maven/Gradle build configurations.",
    detailedExplanation: [
      "Groovy Support: Automatically resolves `@Grab` annotations and default imports.",
      "Execution: Run `spring run app.groovy` directly from the terminal.",
      "Scaffolding: Generate new project structures via `spring init` command.",
    ],
    interviewTip:
      "Note that while great for quick prototyping or script automation, standard Maven/Gradle builds are preferred for enterprise codebases.",
    followUpQuestions: [
      "How to initialize a Spring Boot project using Spring Boot CLI?",
      "What is spring init command?",
    ],
    relatedTopics: ["Developer Tools", "CLI"],
    tags: ["Developer Tools"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-commandlinerunner-applicationrunner",
    title: "What is the difference between CommandLineRunner and ApplicationRunner in Spring Boot?",
    difficulty: "EASY",
    subtopic: "Core Concepts",
    synopsis: "Startup callback interfaces executing code immediately after application context initialization.",
    shortAnswer:
      "Both are startup callback interfaces executed right after `SpringApplication.run()` completes. `CommandLineRunner` passes raw string arguments (`String[] args`). `ApplicationRunner` passes parsed `ApplicationArguments` providing option/non-option argument parsing.",
    detailedExplanation: [
      "Execution Timing: Executed once during application startup after `ApplicationContext` is fully refreshed.",
      "`CommandLineRunner`: `run(String... args)` raw array.",
      "`ApplicationRunner`: `run(ApplicationArguments args)` with helper methods (`args.getOptionNames()`, `args.getOptionValues(\'foo\')`).",
      "Ordering: Order multiple runners using `@Order(1)` annotation.",
    ],
    example: {
      language: "JAVA",
      code: `@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {
    public void run(String... args) {
        System.out.println("Seeding database on application startup...");
    }
}`,
    },
    interviewTip:
      "Use `@Order` annotation to control explicit execution sequence when using multiple startup runners.",
    followUpQuestions: [
      "What happens if an exception is thrown inside CommandLineRunner.run()?",
      "Difference between @PostConstruct and CommandLineRunner?",
    ],
    relatedTopics: ["Core Concepts", "Startup Hooks"],
    tags: ["Core Concepts"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-logging-logback-log4j2",
    title: "How does Logging work in Spring Boot (SLF4J, Logback default configuration)?",
    difficulty: "EASY",
    subtopic: "Logging",
    synopsis: "SLF4J abstraction layer, Logback default provider, and profile logging configuration.",
    shortAnswer:
      "Spring Boot uses SLF4J (Simple Logging Facade for Java) as an abstraction facade, defaulting to **Logback** as the underlying logging implementation. Logging levels (`TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`) are configured in `application.properties` or custom `logback-spring.xml`.",
    detailedExplanation: [
      "SLF4J Abstraction: Decouples logging code from underlying logger provider (Logback, Log4j2).",
      "Configuration: `logging.level.root=INFO` and `logging.level.com.example=DEBUG`.",
      "`logback-spring.xml`: Supports profile-specific logging appenders (`<springProfile name=\'prod\'>`).",
      "Lombok `@Slf4j`: Generates private static final `log` field automatically.",
    ],
    example: {
      language: "JAVA",
      code: `@Service
@Slf4j // Injects 'log' logger via Lombok
public class PaymentService {
    public void process() {
        log.info("Processing payment for user");
    }
}`,
    },
    interviewTip:
      "Always use `logback-spring.xml` over standard `logback.xml` so Spring Boot can apply advanced profile-based logging configurations.",
    followUpQuestions: [
      "Why use SLF4J facade over direct Logback calls?",
      "How to configure file appenders in Logback?",
    ],
    relatedTopics: ["Logging", "SLF4J", "Logback"],
    tags: ["Logging"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-validation-bean-validation",
    title: "How does Request Body Validation work in Spring Boot using Jakarta Bean Validation (@Valid, @NotNull, @Size)?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "Declarative DTO input validation using Jakarta constraints and automatic Exception translation.",
    shortAnswer:
      "Spring Boot uses Jakarta Bean Validation (`spring-boot-starter-validation`). Decorating DTO fields with constraint annotations (`@NotNull`, `@Size`, `@Email`, `@Min`) and adding `@Valid` / `@Validated` to controller request parameters automatically validates payloads, throwing `MethodArgumentNotValidException` on validation failure.",
    detailedExplanation: [
      "Annotations: `@NotNull`, `@NotBlank`, `@NotEmpty`, `@Size(min=2, max=50)`, `@Email`, `@Min`, `@Max`, `@Pattern`.",
      "Controller Binding: `@PostMapping public ResponseEntity create(@Valid @RequestBody UserDto dto)`.",
      "Error Handling: `@RestControllerAdvice` catches `MethodArgumentNotValidException` to extract field error details.",
    ],
    example: {
      language: "JAVA",
      code: `public record CreateUserRequest(
    @NotBlank(message = "Name required") String name,
    @Email(message = "Invalid email format") String email,
    @Min(value = 18, message = "Must be at least 18") int age
) {}`,
    },
    interviewTip:
      "Explain `@NotBlank` vs `@NotNull` vs `@NotEmpty`: `@NotBlank` is strictest—verifies string is non-null, non-empty, and contains at least 1 non-whitespace character.",
    followUpQuestions: [
      "Difference between @NotBlank, @NotEmpty, and @NotNull?",
      "How to write a custom Bean Validation annotation?",
    ],
    relatedTopics: ["Web & REST", "Validation", "REST APIs"],
    tags: ["Web & REST", "Validation"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-custom-starter-creation",
    title: "How do you create a Custom Spring Boot Starter dependency?",
    difficulty: "HARD",
    subtopic: "Advanced Spring",
    synopsis: "Autoconfiguration module packaging and AutoConfiguration.imports declaration.",
    shortAnswer:
      "A Custom Starter consists of 2 modules (or 1 combined): 1) Autoconfiguration module containing `@Configuration` beans with `@Conditional` annotations, and 2) Starter module declaring dependencies. Register autoconfiguration classes in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.",
    detailedExplanation: [
      "Naming Convention: Custom starters should be named `foo-spring-boot-starter` (reserved prefix `spring-boot-starter-foo` is for official Spring team modules).",
      "Imports Declaration: Add autoconfiguration FQCN class names to `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3+).",
      "Conditionals: Use `@ConditionalOnClass`, `@ConditionalOnProperty`, `@ConditionalOnMissingBean` to ensure beans instantiate only when client apps meet conditions.",
    ],
    interviewTip:
      "Highlight starter naming rules: Third-party/custom starters must end with `-spring-boot-starter` (e.g. `mybatis-spring-boot-starter`).",
    followUpQuestions: [
      "Difference between Spring Boot 2 META-INF/spring.factories and Spring Boot 3 AutoConfiguration.imports?",
      "How do custom starter configuration properties work?",
    ],
    relatedTopics: ["Advanced Spring", "Auto-Configuration"],
    tags: ["Advanced Spring"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-test-annotations",
    title: "What is the difference between @SpringBootTest, @WebMvcTest, and @DataJpaTest in Spring Boot testing?",
    difficulty: "MEDIUM",
    subtopic: "Testing",
    synopsis: "Full ApplicationContext integration test vs sliced layer-specific unit tests.",
    shortAnswer:
      "`@SpringBootTest` loads the FULL application context for end-to-end integration tests. `@WebMvcTest` creates a sliced context loading ONLY Spring MVC web layer components (`Controllers`, `Converters`) with mocked services. `@DataJpaTest` loads ONLY JPA repositories, entity manager, and configures an embedded database.",
    detailedExplanation: [
      "`@SpringBootTest`: Slow, full integration test. Boots whole Spring context.",
      "`@WebMvcTest(UserController.class)`: Fast web-slice test. Use `@MockBean` for service dependencies.",
      "`@DataJpaTest`: Fast persistence-slice test. Automatically configures in-memory DB (H2) and rolls back transactions after each test method by default.",
    ],
    example: {
      language: "JAVA",
      code: `@WebMvcTest(UserController.class) // Web-slice test
public class UserControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private UserService userService; // Mock service layer!
}`,
    },
    interviewTip:
      "Recommend Sliced Tests (`@WebMvcTest`, `@DataJpaTest`) over `@SpringBootTest` for unit testing specific architectural layers—they execute in milliseconds instead of seconds.",
    followUpQuestions: [
      "Why is @WebMvcTest faster than @SpringBootTest?",
      "What is MockMvc and how does it test HTTP endpoints without running a web server?",
    ],
    relatedTopics: ["Testing", "JUnit", "Mockito"],
    tags: ["Testing"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-mockito-mockbean",
    title: "What is the difference between @Mock and @MockBean in Spring Boot unit and integration tests?",
    difficulty: "MEDIUM",
    subtopic: "Testing",
    synopsis: "Plain Mockito unit test mocks vs Spring ApplicationContext bean replacement mocks.",
    shortAnswer:
      "`@Mock` (Mockito) creates a plain mock object for pure unit tests without starting Spring. `@MockBean` (Spring Boot Test) creates a Mockito mock AND registers it inside the Spring `ApplicationContext`, replacing any existing bean of that type.",
    detailedExplanation: [
      "`@Mock`: Used with `@ExtendWith(MockitoExtension.class)`. Fast, no Spring context loaded.",
      "`@MockBean`: Used with Spring test annotations (`@SpringBootTest`, `@WebMvcTest`). Replaces real Spring bean in `ApplicationContext` with mock.",
      "Context Dirties: Excessive distinct `@MockBean` configurations can cause Spring Test Context Caching to invalidate, slowing down overall test suite execution.",
    ],
    interviewTip:
      "Warning: Using different `@MockBean` configurations across test classes causes Spring to recreate the `ApplicationContext` repeatedly, slowing down build pipelines.",
    followUpQuestions: [
      "How does Spring Test Context Caching work?",
      "What is @SpyBean in Spring Boot test?",
    ],
    relatedTopics: ["Testing", "Mockito", "Spring Core"],
    tags: ["Testing"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-testcontainers",
    title: "What is Testcontainers and how does @ServiceConnection simplify Spring Boot integration testing with real databases?",
    difficulty: "HARD",
    subtopic: "Testing",
    synopsis: "Spinning up real Docker containers for integration tests with auto-configured connection properties.",
    shortAnswer:
      "Testcontainers is a Java library that spins up real Docker containers (PostgreSQL, Redis, Kafka) during integration tests. Introduced in Spring Boot 3.1, `@ServiceConnection` automatically discovers container host/ports and configures Spring Boot connection properties (`spring.datasource.url`) without manual `@DynamicPropertySource` declarations.",
    detailedExplanation: [
      "Real Environment Testing: Replaces H2 in-memory databases with real PostgreSQL/MySQL Docker containers, avoiding SQL dialect discrepancies.",
      "`@ServiceConnection`: Automatically injects container connection details directly into Spring Boot properties.",
      "Container Lifecycle: Starts Docker container before test suite runs and cleans up automatically on completion.",
    ],
    example: {
      language: "JAVA",
      code: `@Testcontainers
@SpringBootTest
public class IntegrationTest {
    @Container
    @ServiceConnection // Auto-configures spring.datasource properties from real Postgres container!
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");
}`,
    },
    interviewTip:
      "Emphasize `@ServiceConnection` (Spring Boot 3.1+): it completely eliminates boiler-plate `@DynamicPropertySource` methods when pairing Testcontainers with Spring Boot.",
    followUpQuestions: [
      "Why are real Docker containers preferred over in-memory H2 database tests?",
      "What is @DynamicPropertySource in Spring Boot tests?",
    ],
    relatedTopics: ["Testing", "Docker", "Integration Testing"],
    tags: ["Testing", "Modern Spring"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-microservices-architecture",
    title: "What is Spring Cloud and what are its core microservices components (Eureka, Config Server, API Gateway)?",
    difficulty: "HARD",
    subtopic: "Microservices",
    synopsis: "Distributed systems patterns suite for microservice routing, discovery, and configuration.",
    shortAnswer:
      "Spring Cloud provides tools to quickly build common distributed system patterns in microservices architectures. Core components include: 1) **Service Discovery** (Eureka Server), 2) **API Gateway** (Spring Cloud Gateway), 3) **Centralized Config** (Spring Cloud Config Server), 4) **Circuit Breaker** (Resilience4j), and 5) **Tracing** (Micrometer Tracing / Zipkin).",
    detailedExplanation: [
      "Service Discovery: Services register dynamic IP/port addresses with Eureka Server; clients query Eureka for dynamic load-balanced routing.",
      "API Gateway: Entry point handling authentication, rate-limiting, and routing cross-cutting concerns.",
      "Distributed Tracing: Propagates traceId and spanId across HTTP microservice hops.",
    ],
    interviewTip:
      "Contrast Spring Cloud Eureka with Kubernetes: In Kubernetes deployments, K8s native DNS Service Discovery handles routing, replacing Eureka Server.",
    followUpQuestions: [
      "How does Kubernetes Service Discovery replace Eureka Server?",
      "What is Distributed Tracing (traceId and spanId)?",
    ],
    relatedTopics: ["Microservices", "Spring Cloud", "Architecture"],
    tags: ["Microservices", "Spring Cloud"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-eureka-service-discovery",
    title: "What is Service Discovery and how does Netflix Eureka Server/Client work in Spring Cloud?",
    difficulty: "MEDIUM",
    subtopic: "Microservices",
    synopsis: "Dynamic microservice IP registration and client-side load balancing.",
    shortAnswer:
      "Service Discovery eliminates hardcoded IP addresses in microservices. Microservices register their dynamic IP/port with **Eureka Server** on startup (`@EnableEurekaServer`). Calling services (**Eureka Client**) query Eureka to resolve service names (`http://USER-SERVICE/api`) via client-side load balancing (Spring Cloud LoadBalancer).",
    detailedExplanation: [
      "Heartbeats: Eureka Clients send heartbeats every 30 seconds. If heartbeats stop, Eureka evicts the service instance after timeout.",
      "Self-Preservation Mode: If network partitions cause massive heartbeat drops, Eureka stops evicting instances to prevent catastrophic cascading deletions.",
      "Client-Side Load Balancing: Spring Cloud LoadBalancer caches instance lists locally and load balances requests (Round-Robin).",
    ],
    interviewTip:
      "Explain Eureka Self-Preservation Mode: Eureka protects its registry during network glitches by freezing instance evictions.",
    followUpQuestions: [
      "What is Eureka Self-Preservation Mode?",
      "How does Spring Cloud LoadBalancer distribute requests across dynamic instances?",
    ],
    relatedTopics: ["Microservices", "Eureka", "Spring Cloud"],
    tags: ["Microservices"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-api-gateway",
    title: "What is Spring Cloud Gateway and how does it handle routing, predicates, and filters?",
    difficulty: "MEDIUM",
    subtopic: "Microservices",
    synopsis: "Reactive API reverse proxy managing cross-cutting microservice concerns.",
    shortAnswer:
      "Spring Cloud Gateway (built on Spring WebFlux and Netty) acts as the single API entry point for microservice clusters. It routes requests based on 3 abstractions: **Routes** (destination URI), **Predicates** (HTTP criteria matching e.g. path/header), and **Filters** (modifying incoming request or outgoing response).",
    detailedExplanation: [
      "Route Definition: ID, destination URI, collection of Predicates and Filters.",
      "Predicates: `Path=/api/v1/users/**`, `Header=X-Request-Id`.",
      "Gateway Filters: `AddRequestHeader`, `RewritePath`, `RateLimiter`.",
      "Reactive Architecture: Built on non-blocking Netty engine for high concurrency throughput.",
    ],
    example: {
      language: "JAVA",
      code: `# application.yml Spring Cloud Gateway route config:
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://USER-SERVICE # Dynamic Eureka load balancing!
          predicates:
            - Path=/api/v1/users/**
          filters:
            - AddRequestHeader=X-Gateway-Source, SpringGateway`,
    },
    interviewTip:
      "Highlight `lb://SERVICE-NAME` syntax: it connects Gateway routing directly to Eureka Service Discovery for dynamic client-side load balancing.",
    followUpQuestions: [
      "Why did Spring Cloud Gateway replace Netflix Zuul 1?",
      "How to implement custom GlobalFilter for JWT validation in API Gateway?",
    ],
    relatedTopics: ["Microservices", "API Gateway", "Spring Cloud"],
    tags: ["Microservices", "API Gateway"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-config-server",
    title: "How does Spring Cloud Config Server provide centralized external configuration management?",
    difficulty: "MEDIUM",
    subtopic: "Microservices",
    synopsis: "Centralized Git-backed configuration server with dynamic property refresh.",
    shortAnswer:
      "Spring Cloud Config Server provides centralized externalized configuration management across all environment microservices. Configurations are stored in a central repository (Git/File system) and served via HTTP. Microservices load properties at startup and can refresh properties dynamically using `@RefreshScope` and `/actuator/refresh`.",
    detailedExplanation: [
      "Git Backend: Store environment-specific configuration files (`user-service-prod.yml`) in a version-controlled Git repo.",
      "`@RefreshScope`: Beans annotated with `@RefreshScope` re-initialize property values when `/actuator/refresh` endpoint is triggered without restarting microservices.",
      "Encryption: Supports encrypting sensitive passwords using asymmetric keys (`{cipher}XYZ`).",
    ],
    interviewTip:
      "Explain dynamic property reloading: `@RefreshScope` allows updating config properties (like logging levels or feature flags) across running microservices without restarting instances.",
    followUpQuestions: [
      "How does Spring Cloud Bus automate config refresh across 50 microservices using RabbitMQ/Kafka?",
      "How to secure sensitive database passwords in Config Server using encryption?",
    ],
    relatedTopics: ["Microservices", "Configuration", "Spring Cloud"],
    tags: ["Microservices", "Configuration"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-resilience4j-circuit-breaker",
    title: "What is the Circuit Breaker pattern and how does Resilience4j integrate with Spring Boot?",
    difficulty: "HARD",
    subtopic: "Microservices",
    synopsis: "Fault-tolerance pattern preventing cascading microservice failures.",
    shortAnswer:
      "The Circuit Breaker pattern prevents cascading failures when downstream microservices fail or slow down. Resilience4j manages 3 states: **CLOSED** (normal operation), **OPEN** (downstream failing; requests fail fast immediately to fallback method), and **HALF-OPEN** (testing downstream recovery with limited trial requests).",
    detailedExplanation: [
      "State Transitions: CLOSED $\rightarrow$ OPEN when error rate crosses threshold (e.g., 50% failures in rolling window).",
      "Fail Fast: When OPEN, requests do not wait for timeout—they execute the fallback method immediately.",
      "Fallback Method: `@CircuitBreaker(name = \'userService\', fallbackMethod = \'fallbackUser\')`.",
    ],
    example: {
      language: "JAVA",
      code: `@Service
public class OrderService {
    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(PaymentRequest req) {
        return paymentClient.callPaymentApi(req);
    }

    // Fallback executed when circuit is OPEN or fails!
    public PaymentResponse paymentFallback(PaymentRequest req, Throwable t) {
        return new PaymentResponse("PENDING_OFFLINE_QUEUE");
    }
}`,
    },
    interviewTip:
      "State rule of thumb for fallback methods: Fallback method signature MUST match original method parameters plus an extra `Throwable` exception parameter at the end.",
    followUpQuestions: [
      "Why did Resilience4j replace Netflix Hystrix?",
      "What is RateLimiter and Bulkhead patterns in Resilience4j?",
    ],
    relatedTopics: ["Microservices", "Resilience4j", "Fault Tolerance"],
    tags: ["Microservices", "Resilience"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-cloud-feign-client",
    title: "What is Declarative REST Client (@EnableFeignClients, OpenFeign) in Spring Cloud?",
    difficulty: "EASY",
    subtopic: "Microservices",
    synopsis: "Interface-driven HTTP REST client simplifying inter-service communications.",
    shortAnswer:
      "Spring Cloud OpenFeign is a declarative REST client. Instead of writing boilerplate `RestTemplate` or `WebClient` code, you define a Java interface with Spring MVC annotations (`@GetMapping`), and Feign generates the HTTP client implementation automatically.",
    detailedExplanation: [
      "Declarative Syntax: `@FeignClient(name = \'USER-SERVICE\')` paired with standard `@GetMapping` annotations.",
      "Eureka & LoadBalancing Integration: Integrates seamlessly with Eureka Service Discovery and Spring Cloud LoadBalancer out of the box.",
      "Resilience4j Integration: Supports fallback classes for fault tolerance when downstream service calls fail.",
    ],
    example: {
      language: "JAVA",
      code: `@FeignClient(name = "USER-SERVICE", fallback = UserFeignFallback.class)
public interface UserClient {
    @GetMapping("/api/v1/users/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
}`,
    },
    interviewTip:
      "Highlight clean code: OpenFeign replaces 30 lines of manual `RestTemplate` error checking with a clean 5-line Java interface definition.",
    followUpQuestions: [
      "How to pass authorization headers across Feign Client calls (RequestInterceptor)?",
      "Difference between RestTemplate, WebClient, and OpenFeign?",
    ],
    relatedTopics: ["Microservices", "OpenFeign", "REST APIs"],
    tags: ["Microservices"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-kafka-integration",
    title: "How do @KafkaListener and KafkaTemplate work for event streaming in Spring Boot?",
    difficulty: "HARD",
    subtopic: "Messaging",
    synopsis: "Event-driven asynchronous messaging integration with Apache Kafka.",
    shortAnswer:
      "Spring Boot (`spring-kafka`) integrates Apache Kafka. `KafkaTemplate` sends messages asynchronously to Kafka topics. `@KafkaListener` marks bean methods to consume messages from specified Kafka topics and consumer groups automatically.",
    detailedExplanation: [
      "`KafkaTemplate.send(topic, key, payload)`: Producer sending events.",
      "`@KafkaListener(topics = \'orders-topic\', groupId = \'group_id\')`: Consumer listening to partition events.",
      "Deserialization: Configured with `JsonDeserializer` or Avro schema registry.",
      "AckMode: Manual acknowledgment (`Acknowledgment.acknowledge()`) ensures offset is committed ONLY after business processing succeeds.",
    ],
    example: {
      language: "JAVA",
      code: `@Component
public class OrderConsumer {
    @KafkaListener(topics = "orders-topic", groupId = "order-group")
    public void consumeOrder(OrderEvent event, Acknowledgment ack) {
        System.out.println("Processing order: " + event.orderId());
        ack.acknowledge(); // Manual commit offset
    }
}`,
    },
    interviewTip:
      "Emphasize manual acknowledgment (`AckMode.MANUAL`): manually committing offset prevents message loss if consumer crashes during processing.",
    followUpQuestions: [
      "How to handle consumer processing exceptions in Kafka (Dead Letter Topic - DLT)?",
      "What is consumer offset committing in Kafka?",
    ],
    relatedTopics: ["Messaging", "Kafka", "Event Driven"],
    tags: ["Messaging", "Kafka"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-rabbitmq-integration",
    title: "How does Spring AMQP (@RabbitListener, RabbitTemplate) integrate RabbitMQ with Spring Boot?",
    difficulty: "MEDIUM",
    subtopic: "Messaging",
    synopsis: "AMQP message broker integration using Exchanges, Queues, and Binding keys.",
    shortAnswer:
      "Spring Boot (`spring-boot-starter-amqp`) integrates RabbitMQ using AMQP protocol abstractions. `RabbitTemplate` publishes messages to Exchanges, while `@RabbitListener` consumes messages asynchronously from bound Queues.",
    detailedExplanation: [
      "Exchange Types: Direct (exact routing key), Fanout (broadcast to all queues), Topic (pattern matching `*.orders.#`), Headers.",
      "`RabbitTemplate.convertAndSend(exchange, routingKey, message)`.",
      "`@RabbitListener(queues = \'ordersQueue\')`.",
    ],
    interviewTip:
      "Explain the key architectural difference: RabbitMQ is a message broker (pushes messages to consumers, deletes on ack); Kafka is a distributed append-only commit log (consumers pull messages, offsets retained).",
    followUpQuestions: [
      "Difference between RabbitMQ and Apache Kafka architecture?",
      "How to configure Dead Letter Exchange (DLX) in RabbitMQ?",
    ],
    relatedTopics: ["Messaging", "RabbitMQ", "AMQP"],
    tags: ["Messaging"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-webflux-reactive-programming",
    title: "What is Spring WebFlux and how does Reactive Non-blocking Programming (Mono, Flux, Netty) work?",
    difficulty: "HARD",
    subtopic: "Reactive",
    synopsis: "Asynchronous non-blocking event-driven web framework built on Reactive Streams.",
    shortAnswer:
      "Spring WebFlux is a non-blocking, asynchronous reactive web framework built on Reactive Streams (Project Reactor) and Netty server. It handles high concurrency using small event-loop thread pools by processing data streams via `Mono` (0 or 1 item) and `Flux` (0 to N items).",
    detailedExplanation: [
      "`Mono<T>`: Publisher returning 0 or 1 item asynchronously.",
      "`Flux<T>`: Publisher returning 0 to N items asynchronously (data stream).",
      "Non-Blocking I/O: Threads never block waiting for DB or network responses; they yield execution context until reactive signals fire.",
      "Backpressure: Receiver controls how fast publishers emit items, preventing memory overflow.",
    ],
    example: {
      language: "JAVA",
      code: `@RestController
public class ProductController {
    @GetMapping("/products")
    public Flux<Product> getAllProducts() {
        return productService.findAll(); // Returns reactive Flux stream!
    }
}`,
    },
    interviewTip:
      "Golden rule: NEVER invoke blocking JDBC calls or `Thread.sleep()` inside WebFlux reactive pipelines! Use reactive drivers (R2DBC) or wrap blocking calls in `Schedulers.boundedElastic()`.",
    followUpQuestions: [
      "Difference between Spring MVC (servlet-based) and Spring WebFlux (reactive)?",
      "What is Backpressure in Reactive Streams?",
    ],
    relatedTopics: ["Reactive", "WebFlux", "Project Reactor"],
    tags: ["Reactive", "Advanced Spring"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-r2dbc-reactive-database",
    title: "What is R2DBC (Reactive Relational Database Connectivity) and how does it differ from JDBC/JPA?",
    difficulty: "HARD",
    subtopic: "Reactive",
    synopsis: "Non-blocking reactive relational database driver spec for WebFlux.",
    shortAnswer:
      "R2DBC is a non-blocking reactive API specification for relational databases (PostgreSQL, MySQL). Standard JDBC/JPA is inherently thread-blocking; R2DBC provides non-blocking reactive drivers allowing Spring WebFlux to perform end-to-end reactive database operations.",
    detailedExplanation: [
      "JDBC Limitation: JDBC is synchronous and thread-blocking by specification.",
      "R2DBC Solution: Fully non-blocking event-driven SQL execution returning `Mono` and `Flux`.",
      "Trade-off: R2DBC is NOT an ORM like Hibernate (no lazy loading, dirty checking, or complex entity graphs).",
    ],
    interviewTip:
      "Clarify that R2DBC is not JPA/Hibernate replacement—it is a lower-level reactive driver specification designed for pure non-blocking WebFlux architectures.",
    followUpQuestions: [
      "Why can't Hibernate be used directly with WebFlux without thread blocking?",
      "How to configure R2dbcEntityTemplate in Spring Boot?",
    ],
    relatedTopics: ["Reactive", "R2DBC", "Database"],
    tags: ["Reactive", "Database"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-flyway-liquibase",
    title: "How do Database Migration tools (Flyway, Liquibase) work in Spring Boot?",
    difficulty: "MEDIUM",
    subtopic: "Data & JPA",
    synopsis: "Version-controlled automated database schema migrations on application startup.",
    shortAnswer:
      "Flyway and Liquibase automate version-controlled database schema migrations on Spring Boot application startup. They maintain a tracking table (`flyway_schema_history`) to execute pending SQL/XML script migrations in strict sequential order before JPA initializations.",
    detailedExplanation: [
      "Flyway: SQL-based migration scripts named `V1__init.sql`, `V2__add_index.sql` placed in `classpath:db/migration`.",
      "Liquibase: XML/YAML/JSON/SQL changelog files executing changeset migrations.",
      "Best Practice: Disable `spring.jpa.hibernate.ddl-auto` (`none` or `validate`) in production and rely exclusively on Flyway/Liquibase for schema changes.",
    ],
    example: {
      language: "JAVA",
      code: `-- db/migration/V1__init_schema.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);`,
    },
    interviewTip:
      "Production Rule: Always set `spring.jpa.hibernate.ddl-auto=validate` in production to prevent Hibernate from altering database schemas automatically!",
    followUpQuestions: [
      "What happens if a Flyway migration script fails midway?",
      "Difference between Flyway and Liquibase?",
    ],
    relatedTopics: ["Data & JPA", "Flyway", "Liquibase", "Database"],
    tags: ["Data & JPA", "Database"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-caching-redis",
    title: "How does @EnableCaching work in Spring Boot (@Cacheable, @CachePut, @CacheEvict) with Redis?",
    difficulty: "MEDIUM",
    subtopic: "Caching",
    synopsis: "Declarative method result caching and cache invalidation backed by Redis.",
    shortAnswer:
      "Spring Caching (`@EnableCaching`) provides declarative AOP caching. `@Cacheable` returns cached results if present; `@CachePut` executes method and updates cache; `@CacheEvict` removes entries. Including `spring-boot-starter-data-redis` automatically configures Redis as the cache provider.",
    detailedExplanation: [
      "`@Cacheable(value = \'users\', key = \'#id\')`: Checks Redis first. If hit, returns cached object without executing method.",
      "`@CachePut(value = \'users\', key = \'#result.id\')`: Always executes method and updates Redis cache.",
      "`@CacheEvict(value = \'users\', key = \'#id\')`: Evicts key from Redis.",
      "Serialization: Objects stored in Redis must implement `Serializable` or use Jackson JSON Redis serializers.",
    ],
    example: {
      language: "JAVA",
      code: `@Service
public class UserService {
    @Cacheable(value = "users", key = "#id")
    public UserDto getUserById(Long id) {
        return userRepository.findById(id).map(UserDto::from).orElseThrow();
    }

    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) { userRepository.deleteById(id); }
}`,
    },
    interviewTip:
      "Call out cache eviction: always pair data update/delete methods with `@CacheEvict` or `@CachePut` to prevent stale data bugs.",
    followUpQuestions: [
      "What is Cache Penetration, Cache Stampede, and Cache Avalanche?",
      "How to set TTL (Time To Live) on Redis caches in Spring Boot?",
    ],
    relatedTopics: ["Caching", "Redis", "Performance"],
    tags: ["Caching", "Redis"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-async-scheduling",
    title: "How do @Async and @Scheduled annotations work for background tasks in Spring Boot?",
    difficulty: "MEDIUM",
    subtopic: "Core Concepts",
    synopsis: "Asynchronous background thread pool execution and cron-based task scheduling.",
    shortAnswer:
      "`@EnableAsync` and `@Async` execute annotated methods asynchronously in a separate thread pool returning `CompletableFuture<T>` or `void`. `@EnableScheduling` and `@Scheduled` execute background tasks periodically based on fixed rate, fixed delay, or cron expressions (`cron = \'0 0 * * * *\'`).",
    detailedExplanation: [
      "`@Async`: Uses `TaskExecutor` thread pool. Internal `this.asyncMethod()` calls fail due to AOP proxy bypass.",
      "`@Scheduled(fixedRate = 5000)`: Executes every 5 seconds regardless of previous completion.",
      "`@Scheduled(fixedDelay = 5000)`: Waits 5 seconds after previous execution completes.",
      "`@Scheduled(cron = \'0 0 12 * * ?\')`: Executes at 12 PM every day.",
    ],
    example: {
      language: "JAVA",
      code: `@Component
public class ScheduledTasks {
    @Scheduled(cron = "0 0 2 * * ?") // 2 AM daily cleanup
    public void dailyCleanup() {
        System.out.println("Running daily maintenance job...");
    }
}`,
    },
    interviewTip:
      "Warn: In multi-instance microservice deployments, `@Scheduled` runs on EVERY instance simultaneously! Use ShedLock or Distributed Schedulers (Quartz/Quartz-cluster) to enforce single execution.",
    followUpQuestions: [
      "Why does @Scheduled run on all instances in a multi-node deployment, and how to fix it (ShedLock)?",
      "Difference between fixedRate and fixedDelay in @Scheduled?",
    ],
    relatedTopics: ["Core Concepts", "Async", "Scheduling"],
    tags: ["Core Concepts", "Scheduling"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-swagger-springdoc-openapi",
    title: "How do you generate OpenAPI 3 / Swagger REST API documentation in Spring Boot using springdoc-openapi?",
    difficulty: "EASY",
    subtopic: "Web & REST",
    synopsis: "Automated interactive REST API documentation generation matching OpenAPI 3 spec.",
    shortAnswer:
      "Spring Boot generates interactive Swagger UI and OpenAPI 3 documentation automatically by adding the `springdoc-openapi-starter-webmvc-ui` dependency. It inspects REST controllers and annotations to host Swagger UI at `/swagger-ui.html` and raw JSON spec at `/v3/api-docs`.",
    detailedExplanation: [
      "No Boilerplate: Automatically inspects `@RestController`, `@PathVariable`, `@RequestParam`, `@Valid` constraints.",
      "Annotations: `@Operation(summary = \'...\')`, `@ApiResponse`, `@Tag` enrich documentation metadata.",
      "Spring Boot 3: Uses `springdoc-openapi-starter-webmvc-ui` (replaces deprecated Springfox Swagger library).",
    ],
    interviewTip:
      "Mention library upgrade: `springdoc-openapi` is the official modern library for Spring Boot 3+ (Springfox is unmaintained and incompatible).",
    followUpQuestions: [
      "Why is Springfox deprecated in Spring Boot 3?",
      "How to secure /swagger-ui.html in production?",
    ],
    relatedTopics: ["Web & REST", "OpenAPI", "Documentation"],
    tags: ["Web & REST"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-docker-jib-packpacks",
    title: "How do you containerize a Spring Boot application using Docker, Cloud Native Buildpacks (bootBuildImage), or Jib?",
    difficulty: "MEDIUM",
    subtopic: "Deployment",
    synopsis: "OCI container image generation using Dockerfiles, Buildpacks, or Google Jib.",
    shortAnswer:
      "Spring Boot applications can be containerized via: 1) Traditional multi-stage `Dockerfile`, 2) Cloud Native Buildpacks via Spring Boot Maven/Gradle plugin (`mvn spring-boot:build-image`), or 3) Google Jib plugin (builds optimized Docker images without local Docker daemon).",
    detailedExplanation: [
      "Buildpacks (`bootBuildImage`): Zero-Dockerfile OCI image generation managed by Paketo Buildpacks.",
      "Google Jib: Builds layered Java images directly to registry without requiring Docker installed on build machine.",
      "Layered JARs: Spring Boot 2.3+ splits JAR into layers (dependencies, spring-boot-loader, application code), maximizing Docker layer caching efficiency.",
    ],
    example: {
      language: "JAVA",
      code: `# Run Cloud Native Buildpack image generation:
./mvnw spring-boot:build-image`,
    },
    interviewTip:
      "Highlight Docker layer caching: layered JARs separate slow-changing 3rd-party dependencies from fast-changing application code, making `docker push` take seconds instead of minutes.",
    followUpQuestions: [
      "What are Layered JARs in Spring Boot?",
      "How does Google Jib build Docker images without a Docker daemon?",
    ],
    relatedTopics: ["Deployment", "Docker", "DevOps"],
    tags: ["Deployment", "Docker"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-virtual-threads-java21",
    title: "How do you enable Java 21 Virtual Threads in Spring Boot 3.2+ (spring.threads.virtual.enabled=true)?",
    difficulty: "MEDIUM",
    subtopic: "Modern Spring",
    synopsis: "Enabling lightweight user-mode Virtual Threads for high-concurrency Spring web applications.",
    shortAnswer:
      "In Spring Boot 3.2+ running on Java 21, setting `spring.threads.virtual.enabled=true` automatically configures Tomcat/Jetty web servers and `@Async` task executors to use lightweight **Virtual Threads** (Project Loom), dramatically boosting I/O concurrency without changing application code.",
    detailedExplanation: [
      "Property Toggle: `spring.threads.virtual.enabled=true` in `application.properties`.",
      "Under the Hood: Spring replaces platform thread pools with `Executors.newVirtualThreadPerTaskExecutor()`.",
      "High Throughput: Servlet containers handle tens of thousands of concurrent blocking HTTP requests with minimal memory footprint.",
    ],
    interviewTip:
      "Highlight simplicity: a single property toggle (`spring.threads.virtual.enabled=true`) upgrades Spring MVC thread-per-request performance to near-reactive scale on Java 21!",
    followUpQuestions: [
      "What happens to Tomcat thread pool when virtual threads are enabled?",
      "What is Thread Pinning in Virtual Threads?",
    ],
    relatedTopics: ["Modern Spring", "Virtual Threads", "Java 21"],
    tags: ["Modern Spring", "Performance"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-graalvm-native-image",
    title: "What is GraalVM Native Image compilation in Spring Boot 3+ and what are its trade-offs?",
    difficulty: "HARD",
    subtopic: "Modern Spring",
    synopsis: "Ahead-Of-Time (AOT) native binary compilation for instant startup and low memory usage.",
    shortAnswer:
      "Spring Boot 3 supports GraalVM Native Image AOT (Ahead-Of-Time) compilation. It compiles Java bytecode directly into a standalone native OS executable binary, achieving sub-10ms startup times and tiny RAM footprints, ideal for serverless functions (AWS Lambda).",
    detailedExplanation: [
      "AOT Processing: `mvn native:compile` analyzes application reachability and pre-compiles native machine code.",
      "Benefits: Instant startup time (< 20ms), lower initial RSS memory footprint, no JVM warm-up needed.",
      "Trade-offs: Long build times (several minutes), closed-world assumption (reflection, dynamic proxies, and serialization require explicit AOT hints configuration), slightly lower throughput compared to long-running JIT C2 optimization.",
    ],
    interviewTip:
      "Explain the ideal use case: GraalVM Native Images are ideal for serverless cold-start reduction (AWS Lambda) or CLI tools, whereas long-running high-throughput microservices still benefit from standard JVM JIT compilation.",
    followUpQuestions: [
      "What is Ahead-Of-Time (AOT) compilation in Spring 6?",
      "Why does reflection require hints in GraalVM Native Images?",
    ],
    relatedTopics: ["Modern Spring", "GraalVM", "Performance"],
    tags: ["Modern Spring", "Performance"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-batch",
    title: "What is Spring Batch and what are its core concepts (Job, Step, ItemReader, ItemProcessor, ItemWriter)?",
    difficulty: "HARD",
    subtopic: "Batch Processing",
    synopsis: "Chunk-oriented processing framework for high-volume enterprise batch jobs.",
    shortAnswer:
      "Spring Batch is a framework designed for high-volume batch processing. A **Job** consists of one or more **Steps**. Chunk-oriented processing steps execute in a loop reading items (`ItemReader`), transforming items (`ItemProcessor`), and writing items in chunks (`ItemWriter`).",
    detailedExplanation: [
      "Chunk Processing: Reads N items (`chunk-size`), processes N items, and writes N items within a single transaction.",
      "`ItemReader`: Reads data from DB, CSV, XML, or queue.",
      "`ItemProcessor`: Applies business transformations, filtering, or validation.",
      "`ItemWriter`: Writes chunk output to target database or file.",
      "Metadata Repository: Automatically tracks Job executions, status (`COMPLETED`, `FAILED`), and restart parameters in DB metadata tables.",
    ],
    example: {
      language: "JAVA",
      code: `@Bean
public Step sampleStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
    return new StepBuilder("sampleStep", jobRepository)
        .<User, User>chunk(100, transactionManager) // Chunk size 100
        .reader(itemReader())
        .processor(itemProcessor())
        .writer(itemWriter())
        .build();
}`,
    },
    interviewTip:
      "Highlight chunk processing fault-tolerance: if a batch fails at item 5,000 in a 1,000,000 item job, Spring Batch can restart execution precisely from the last committed chunk!",
    followUpQuestions: [
      "How does Spring Batch handle job restartability after failure?",
      "What is Tasklet step vs Chunk-oriented step?",
    ],
    relatedTopics: ["Batch Processing", "Spring Batch"],
    tags: ["Batch Processing"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-graceful-shutdown",
    title: "How does Graceful Shutdown work in Spring Boot web applications?",
    difficulty: "EASY",
    subtopic: "Web & Deployment",
    synopsis: "Allowing active in-flight HTTP requests to complete during application shutdown.",
    shortAnswer:
      "Graceful Shutdown allows running web servers (Tomcat/Netty) to stop accepting new incoming HTTP requests while giving active in-flight requests a grace period to complete before the application process stops.",
    detailedExplanation: [
      "Configuration: Set `server.shutdown=graceful` and `spring.lifecycle.timeout-per-shutdown-phase=30s`.",
      "Kubernetes Pod Eviction: Essential for zero-downtime rolling deployments in Kubernetes to prevent dropping active user HTTP requests during pod termination.",
    ],
    example: {
      language: "JAVA",
      code: `# application.properties Graceful Shutdown:
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=20s`,
    },
    interviewTip:
      "Link to Kubernetes: Graceful shutdown aligns with Kubernetes `preStop` hooks and `terminationGracePeriodSeconds` for zero-downtime microservice deployments.",
    followUpQuestions: [
      "What happens if active requests exceed the timeout-per-shutdown-phase?",
      "How to handle SIGTERM signal in containerized Spring Boot apps?",
    ],
    relatedTopics: ["Web & Deployment", "Kubernetes", "Production Ready"],
    tags: ["Web & Deployment"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-problem-details-rfc7807",
    title: "What is RFC 7807 Problem Details for HTTP APIs in Spring Boot 3+?",
    difficulty: "MEDIUM",
    subtopic: "Web & REST",
    synopsis: "Standardized specification for HTTP API error responses (ProblemDetail).",
    shortAnswer:
      "RFC 7807 Problem Details is a standardized specification for HTTP API error responses. Spring Boot 3 / Spring 6 natively supports RFC 7807 via the `ProblemDetail` class and property `spring.mvc.problemdetails.enabled=true`.",
    detailedExplanation: [
      "Standard Specification: Provides consistent JSON error structure (`type`, `title`, `status`, `detail`, `instance`).",
      "Spring 3 Implementation: `ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, \'User missing\')`.",
      "Extensibility: Custom error metadata fields can be added via `.setProperty(\'timestamp\', Instant.now())`.",
    ],
    example: {
      language: "JAVA",
      code: `@ExceptionHandler(UserNotFoundException.class)
public ProblemDetail handleUserNotFound(UserNotFoundException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    problem.setTitle("User Not Found");
    problem.setProperty("timestamp", Instant.now());
    return problem;
}`,
    },
    interviewTip:
      "Highlight standardization: RFC 7807 replaces custom, non-standard company error response JSON formats with an officially recognized IETF web standard.",
    followUpQuestions: [
      "What are the standard fields in an RFC 7807 ProblemDetail object?",
      "How to enable global Problem Details in Spring Boot 3 properties?",
    ],
    relatedTopics: ["Web & REST", "REST APIs", "Modern Spring"],
    tags: ["Web & REST", "Modern Spring"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-custom-conditional-annotations",
    title: "How do custom @Conditional annotations (@ConditionalOnProperty, @ConditionalOnMissingBean) work in Spring Boot?",
    difficulty: "MEDIUM",
    subtopic: "Core Concepts",
    synopsis: "Evaluating conditional rules to control Spring Bean instantiation.",
    shortAnswer:
      "Conditional annotations evaluate boolean conditions during Spring container startup. If conditions pass, the annotated bean is registered; if conditions fail, the bean is skipped.",
    detailedExplanation: [
      "`@ConditionalOnProperty(name=\'feature.enabled\', havingValue=\'true\')`: Checks configuration property value.",
      "`@ConditionalOnMissingBean(Service.class)`: Registers bean ONLY if no other bean of that type exists.",
      "`@ConditionalOnClass(RedisTemplate.class)`: Checks if target class is present on application classpath.",
      "Custom Condition: Implement `Condition` interface (`matches(ConditionContext, AnnotatedTypeMetadata)`).",
    ],
    example: {
      language: "JAVA",
      code: `@Bean
@ConditionalOnProperty(name = "notification.provider", havingValue = "aws")
public NotificationService awsNotificationService() {
    return new AwsNotificationService();
}`,
    },
    interviewTip:
      "Highlight `@ConditionalOnMissingBean`: it allows clients to override default starter beans easily by declaring their own custom bean definition.",
    followUpQuestions: [
      "How do custom Spring Condition implementations work?",
      "What is @ConditionalOnExpression SpEL condition?",
    ],
    relatedTopics: ["Core Concepts", "Auto-Configuration", "Annotations"],
    tags: ["Core Concepts"],
  },
  {
    topicSlug: "spring-boot",
    slug: "spring-boot-micrometer-prometheus-grafana",
    title: "How does Micrometer export Spring Boot metrics to Prometheus and Grafana for observability?",
    difficulty: "MEDIUM",
    subtopic: "Observability",
    synopsis: "Dimensional metrics collection via Micrometer registry for Prometheus monitoring.",
    shortAnswer:
      "Micrometer is a dimensional metrics collection facade for JVM applications (similar to SLF4J for logging). Adding `micrometer-registry-prometheus` automatically formats Spring Boot Actuator `/actuator/prometheus` metrics into Prometheus scrape format for Grafana dashboard visualization.",
    detailedExplanation: [
      "Dimensional Metrics: Gauges, Counters, Timers tagged with key-value tags (`method=\'GET\'`, `status=\'200\'`).",
      "Prometheus Scrape: Prometheus server pulls metrics from `/actuator/prometheus` endpoint at regular intervals.",
      "Grafana Dashboards: Visualizes JVM heap memory, garbage collection pause times, CPU load, and API throughput.",
    ],
    interviewTip:
      "Summarize the observability stack: **Micrometer** collects metrics $\rightarrow$ **Actuator / Prometheus** exposes & scrapes metrics $\rightarrow$ **Grafana** visualizes real-time operational metrics.",
    followUpQuestions: [
      "Difference between Counter, Gauge, and Timer in Micrometer?",
      "How to create a custom Micrometer counter metric in Spring Boot?",
    ],
    relatedTopics: ["Observability", "Actuator", "Prometheus", "Grafana"],
    tags: ["Observability", "Metrics"],
  },
];
