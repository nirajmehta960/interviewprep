import type { ConceptualQuestion } from "../conceptual";

export const networksQuestions: ConceptualQuestion[] = [
  /* ==========================================================================
     1. Network Architecture & Layers
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "what-happens-when-you-type-url-in-browser",
    title: "What happens when you type a URL into a browser and press Enter?",
    difficulty: "EASY",
    subtopic: "Network Architecture",
    synopsis: "The end-to-end request lifecycle from DNS, TCP handshake, TLS to HTTP rendering.",
    shortAnswer:
      "The browser resolves the domain via DNS to an IP address, initiates a TCP 3-way handshake with the server, negotiates a TLS/SSL handshake for HTTPS security, sends an HTTP GET request, receives the server's response HTML/JS/CSS, and renders the webpage DOM.",
    detailedExplanation: [
      "**1. URL Parsing & Browser Cache Check:** The browser checks HSTS, browser cache, OS cache, and local hosts file before querying network DNS.",
      "**2. DNS Resolution:** If uncached, the browser queries the Recursive DNS Resolver -> Root Server -> TLD Server -> Authoritative Name Server to get the target IP address.",
      "**3. TCP 3-Way Handshake:** Establishes a reliable connection between client and server via SYN -> SYN-ACK -> ACK packets.",
      "**4. TLS/SSL Handshake (HTTPS):** Client and server exchange certificates, negotiate cipher suites, and exchange symmetric encryption keys (Diffie-Hellman / RSA).",
      "**5. HTTP Request & Response:** Browser sends HTTP GET request with headers and cookies; server processes and returns HTTP 200 response HTML.",
      "**6. Critical Rendering Path:** Browser parses HTML to construct DOM tree, parses CSS to construct CSSOM tree, runs JavaScript, computes layout, and paints pixels on screen.",
    ],
    example: {
      language: "JAVA",
      code: `// Conceptual Java Client Request Execution Flow
Socket socket = new Socket("example.com", 443); // 1. DNS & TCP Handshake
SSLSocket sslSocket = (SSLSocket) sslFactory.createSocket(socket, ...); // 2. TLS Handshake

// 3. Send HTTP GET Request
OutputStream out = sslSocket.getOutputStream();
out.write("GET /index.html HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n".getBytes());`,
    },
    interviewTip:
      "This classic question tests breadth across networking layers. Briefly touch every layer (DNS -> TCP -> TLS -> HTTP -> DOM rendering). Mentioning HSTS (HTTP Strict Transport Security) or TLS 1.3 1-RTT handshake signals deep knowledge.",
    commonTrap:
      "Skipping DNS or TLS and jumping straight to 'the server returns the HTML'.",
    followUpQuestions: [
      "How does DNS caching work across the recursive resolver chain?",
      "Difference between TCP 3-way handshake and TLS handshake?",
      "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
    ],
    relatedTopics: ["DNS", "TCP/IP", "TLS", "HTTP"],
    tags: ["Networks", "HTTP", "Architecture"],
  },
  {
    topicSlug: "networks",
    slug: "osi-model-vs-tcp-ip-model",
    title: "What is the OSI 7-Layer Model vs TCP/IP 4-Layer Model?",
    difficulty: "EASY",
    subtopic: "Network Architecture",
    synopsis: "Theoretical 7-layer reference framework vs pragmatic 4/5-layer internet implementation.",
    shortAnswer:
      "The OSI Model is a 7-layer theoretical conceptual model (Application, Presentation, Session, Transport, Network, Data Link, Physical). The TCP/IP Model is a pragmatic 4-layer architecture (Application, Transport, Internet, Network Access) that powers the modern Internet.",
    detailedExplanation: [
      "**OSI 7 Layers (All People Seem To Need Data Processing):**",
      "- **7. Application:** End-user APIs and protocols (HTTP, SMTP, FTP, DNS).",
      "- **6. Presentation:** Data formatting, compression, encryption/decryption (TLS, JSON, Base64).",
      "- **5. Session:** Manages session connections and dialog control (NetBIOS, RPC).",
      "- **4. Transport:** End-to-end process communication, error recovery, flow control (TCP, UDP).",
      "- **3. Network:** Logical IP routing and packet forwarding across networks (IPv4, IPv6, ICMP).",
      "- **2. Data Link:** Physical MAC addressing, framing, and hop-to-hop error detection (Ethernet, Wi-Fi, ARP).",
      "- **1. Physical:** Bit-level transmission over physical media (cables, fiber optics, radio frequencies).",
      "**TCP/IP Model Mapping:** Combines OSI Layers 5-7 into the single **Application Layer**.",
    ],
    example: {
      language: "JAVA",
      code: `// Data Encapsulation Across Layers
// Application (HTTP Data) -> Transport (TCP Header + Data) -> Network (IP Header + TCP + Data) -> Data Link (Ethernet Frame + IP + TCP + Data)`,
    },
    interviewTip:
      "Know key PDU (Protocol Data Unit) names per layer: Layer 7=Data, Layer 4=Segment (TCP) / Datagram (UDP), Layer 3=Packet, Layer 2=Frame, Layer 1=Bits.",
    commonTrap:
      "Confusing Data Link MAC address (hop-to-hop local delivery) with Network IP address (end-to-end global routing).",
    followUpQuestions: [
      "What is Encapsulation and Decapsulation?",
      "What protocol data units (PDUs) are associated with each layer?",
    ],
    relatedTopics: ["OSI Model", "TCP/IP", "Networking"],
    tags: ["Networks", "Architecture"],
  },
  {
    topicSlug: "networks",
    slug: "switch-vs-router-vs-hub",
    title: "What is the difference between a Hub, a Switch, and a Router?",
    difficulty: "EASY",
    subtopic: "Network Architecture",
    synopsis: "Layer 1 broadcast repeater (Hub) vs Layer 2 MAC frame switch vs Layer 3 IP packet router.",
    shortAnswer:
      "A Hub operates at Layer 1 (Physical), broadcasting incoming signals to ALL ports indiscriminately (high collisions). A Switch operates at Layer 2 (Data Link), inspecting MAC addresses to forward frames exclusively to target ports. A Router operates at Layer 3 (Network), routing IP packets between DIFFERENT networks.",
    detailedExplanation: [
      "**Hub (Layer 1):** Dummy repeater. Shares a single collision domain among all ports. Obsolete in modern networking.",
      "**Switch (Layer 2):** Smart local network device. Maintains a MAC Address Table (CAM table). Creates separate collision domains per port, but shares a single broadcast domain.",
      "**Router (Layer 3):** Connects disparate subnets/networks (e.g. LAN to WAN Internet). Maintains Routing Tables. Separates broadcast domains.",
    ],
    example: {
      language: "JAVA",
      code: `// Switch CAM Table Lookup (MAC to Port mapping)
// MAC: 00:1A:2B:3C:4D:5E -> Port 2
// Router Routing Table Lookup (Subnet to Next Hop)
// Destination: 192.168.1.0/24 -> Next Hop: 10.0.0.1 (Interface eth0)`,
    },
    interviewTip:
      "Summary: Hubs broadcast to everyone (Layer 1); Switches connect devices inside a single LAN via MAC (Layer 2); Routers connect multiple LANs/subnets via IP (Layer 3).",
    commonTrap:
      "Believing a Switch separates Broadcast Domains. A standard Layer 2 switch forwards broadcast packets (like ARP requests) to ALL ports.",
    followUpQuestions: [
      "What is a Collision Domain vs Broadcast Domain?",
      "What is a Layer 3 Switch?",
    ],
    relatedTopics: ["Switch", "Router", "Hardware"],
    tags: ["Networks", "Hardware"],
  },

  /* ==========================================================================
     2. Physical & Data Link Layers
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "mac-address-vs-ip-address-and-arp",
    title: "What is the difference between a MAC Address and an IP Address, and how does ARP work?",
    difficulty: "EASY",
    subtopic: "Data Link Layer",
    synopsis: "Hardware physical address vs logical network address, resolved via Address Resolution Protocol (ARP).",
    shortAnswer:
      "A MAC Address is a permanent, 48-bit physical hardware address burned into a Network Interface Card (NIC) for local LAN hop-to-hop communication. An IP Address is a logical 32-bit (IPv4) or 128-bit (IPv6) location address used for global routing across networks. ARP (Address Resolution Protocol) translates known IP addresses to unknown MAC addresses.",
    detailedExplanation: [
      "**MAC Address:** `00:1A:2B:3C:4D:5E` (First 24 bits = Organizationally Unique Identifier OUI vendor code). Used at Data Link Layer (Layer 2).",
      "**IP Address:** `192.168.1.50` (Logical location assigned dynamically via DHCP). Used at Network Layer (Layer 3).",
      "**ARP Resolution Sequence:**",
      "1. Host A wants to send packet to IP `192.168.1.50` on local LAN, but lacks its MAC address.",
      "2. Host A broadcasts an **ARP Request**: 'Who has `192.168.1.50`? Tell `192.168.1.10`.' (Destination MAC = `FF:FF:FF:FF:FF:FF`).",
      "3. Target Host B receives broadcast and returns unicast **ARP Reply**: '`192.168.1.50` is at `00:1A:2B:3C:4D:5E`'.",
      "4. Host A caches mapping in local ARP Cache Table for future packets.",
    ],
    example: {
      language: "JAVA",
      code: `// Inspecting ARP Cache Table in OS Terminal
$ arp -a
Interface: 192.168.1.10
  Internet Address      Physical Address      Type
  192.168.1.1           00-11-22-33-44-55     dynamic
  192.168.1.50          00-1a-2b-3c-4d-5e     dynamic`,
    },
    interviewTip:
      "Explain what happens when routing outside the local LAN: The target IP stays destination server IP, but destination MAC becomes the Default Gateway (Router) MAC address!",
    commonTrap:
      "Assuming ARP works over the Internet. ARP is strictly a Layer 2 local broadcast protocol and cannot cross router boundaries.",
    followUpQuestions: [
      "What is ARP Spoofing / Poisoning attack?",
      "What is RARP (Reverse ARP) and Gratuitous ARP?",
    ],
    relatedTopics: ["ARP", "MAC Address", "IP Address"],
    tags: ["Networks", "Data Link"],
  },
  {
    topicSlug: "networks",
    slug: "csma-cd-vs-csma-ca",
    title: "What is the difference between CSMA/CD and CSMA/CA?",
    difficulty: "MEDIUM",
    subtopic: "Data Link Layer",
    synopsis: "Carrier Sense Multiple Access with Collision Detection (Ethernet) vs Collision Avoidance (Wi-Fi).",
    shortAnswer:
      "CSMA/CD (Collision Detection) is used in wired Ethernet networks: devices listen to the wire, transmit data, and if a collision is detected, stop immediately and wait a random exponential backoff time. CSMA/CA (Collision Avoidance) is used in wireless Wi-Fi: wireless radio signals cannot detect collisions while transmitting, so devices exchange RTS/CTS reservation frames to avoid collisions beforehand.",
    detailedExplanation: [
      "**CSMA/CD (Ethernet - IEEE 802.3):**",
      "- Carrier Sense (listen before talk) + Multiple Access (shared wire) + Collision Detection.",
      "- If collision detected, transmit jam signal, abort, and execute Binary Exponential Backoff ($2^k \\times slot\\_time$).",
      "- Modern full-duplex Ethernet switches eliminate collisions entirely.",
      "**CSMA/CA (Wi-Fi - IEEE 802.11):**",
      "- Carrier Sense + Collision Avoidance.",
      "- Uses **RTS/CTS (Request to Send / Clear to Send)** handshake and ACK frames.",
      "- Solves the **Hidden Node Problem** in wireless communication.",
    ],
    example: {
      language: "JAVA",
      code: `// Binary Exponential Backoff Algorithm Concept (CSMA/CD)
int attempts = 0;
int maxSlots = (1 << Math.min(attempts, 10)) - 1; // 2^k - 1
int backoffTime = random.nextInt(maxSlots + 1) * 512; // Wait random slot times`,
    },
    interviewTip:
      "Highlight the Hidden Node Problem: Wireless Device A and Device C can both see Access Point B, but cannot see each other. RTS/CTS in CSMA/CA prevents them from colliding at B.",
    commonTrap:
      "Assuming modern switched wired networks still use CSMA/CD. Full-duplex Ethernet switches give each port dedicated RX/TX channels, eliminating collisions.",
    followUpQuestions: [
      "What is the Hidden Node Problem in wireless Wi-Fi?",
      "How does Binary Exponential Backoff algorithm prevent repeated collisions?",
    ],
    relatedTopics: ["CSMA/CD", "CSMA/CA", "Wi-Fi", "Ethernet"],
    tags: ["Networks", "Data Link"],
  },

  /* ==========================================================================
     3. Network Layer (IP & Routing)
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "ipv4-vs-ipv6-subnetting-cidr",
    title: "What is the difference between IPv4 and IPv6, and how does Subnetting (CIDR) work?",
    difficulty: "EASY",
    subtopic: "Network Layer",
    synopsis: "32-bit address exhaustion vs 128-bit hexadecimal addressing and CIDR subnet masking.",
    shortAnswer:
      "IPv4 uses 32-bit dotted-decimal addresses (4.3 billion total addresses). IPv6 uses 128-bit hexadecimal addresses ($3.4 \\times 10^{38}$ addresses), eliminating NAT requirements. CIDR (Classless Inter-Domain Routing) notation (`/24`) uses a subnet mask to split an IP into Network ID and Host ID bits.",
    detailedExplanation: [
      "**IPv4 Address:** `192.168.1.100` (4 octets = 32 bits).",
      "**IPv6 Address:** `2001:0db8:85a3:0000:0000:8a2e:0370:7334` (8 groups of 4 hex digits = 128 bits). Features built-in IPsec and auto-configuration (SLAAC).",
      "**CIDR Notation (`192.168.1.0/24`):** The `/24` prefix specifies that the first 24 bits belong to the Network ID, leaving $32 - 24 = 8$ bits for Host IDs ($2^8 - 2 = 254$ usable hosts, minus network and broadcast addresses).",
    ],
    example: {
      language: "JAVA",
      code: `// CIDR Subnet Calculation Example (/24)
// Subnet Mask: 255.255.255.0 (11111111.11111111.11111111.00000000)
// IP: 192.168.1.50/24
// Network Address: 192.168.1.0
// Broadcast Address: 192.168.1.255
// Usable Host Range: 192.168.1.1 to 192.168.1.254 (254 hosts)`,
    },
    interviewTip:
      "Quick Subnet Math Trick: Usable hosts = $2^{(32 - \\text{CIDR})} - 2$. Subtract 2 because the 1st IP is the Network Address and the last IP is the Broadcast Address.",
    commonTrap:
      "Forgetting to subtract 2 when calculating usable host IPs in an IPv4 subnet.",
    followUpQuestions: [
      "Why does IPv6 eliminate the need for NAT (Network Address Translation)?",
      "How to calculate the broadcast address for a `/27` subnet?",
    ],
    relatedTopics: ["IPv4", "IPv6", "Subnetting", "CIDR"],
    tags: ["Networks", "IP", "Subnetting"],
  },
  {
    topicSlug: "networks",
    slug: "nat-network-address-translation-private-ip",
    title: "What is NAT (Network Address Translation) and how does PAT (Port Address Translation) work?",
    difficulty: "EASY",
    subtopic: "Network Layer",
    synopsis: "Mapping multiple private LAN IP addresses to a single public IP address using port numbers.",
    shortAnswer:
      "NAT maps private non-routable IPv4 addresses (`192.168.x.x`, `10.x.x.x`) inside a local network to a single public IPv4 address on the Internet. Port Address Translation (PAT / NAPT) allows thousands of local devices to share a single public IP by mapping each local IP + internal port to unique external source ports on the router.",
    detailedExplanation: [
      "**Private IPv4 Ranges (RFC 1918):**",
      "- `10.0.0.0` - `10.255.255.255` (/8)",
      "- `172.16.0.0` - `172.31.255.255` (/12)",
      "- `192.168.0.0` - `192.168.255.255` (/16)",
      "**PAT Translation Table Mechanics:**",
      "- Host A (`192.168.1.10:5000`) sends request to Web Server `93.184.216.34:80`.",
      "- Router NAT modifies IP packet: Source IP changes to Public IP `203.0.113.1`, Source Port changes to `40001`.",
      "- Router records mapping in NAT Translation Table: `192.168.1.10:5000 <-> 203.0.113.1:40001`.",
      "- When web response arrives at `203.0.113.1:40001`, router translates destination back to `192.168.1.10:5000`.",
    ],
    example: {
      language: "JAVA",
      code: `// NAT Router Translation Table Mapping:
// Internal Socket        <--->  Public External Socket
// 192.168.1.10:52104      <--->  203.0.113.1:10001
// 192.168.1.11:52104      <--->  203.0.113.1:10002`,
    },
    interviewTip:
      "Explain why NAT preserved IPv4 from running out of addresses 20 years ago by allowing entire office buildings of 10,000 devices to share 1 public IP address.",
    commonTrap:
      "Assuming NAT is a security Firewall. NAT provides basic IP hiding as a side effect, but does not perform stateful packet inspection security filtering.",
    followUpQuestions: [
      "What is STUN, TURN, and ICE in WebRTC NAT traversal?",
      "What is the difference between Static NAT, Dynamic NAT, and PAT?",
    ],
    relatedTopics: ["NAT", "PAT", "IPv4", "Security"],
    tags: ["Networks", "IP", "Routing"],
  },
  {
    topicSlug: "networks",
    slug: "icmp-ping-traceroute-mechanisms",
    title: "How do ICMP, Ping, and Traceroute work under the hood?",
    difficulty: "MEDIUM",
    subtopic: "Network Layer",
    synopsis: "Diagnostic network protocol (ICMP) utilizing Echo Requests and TTL expiration to trace hops.",
    shortAnswer:
      "ICMP (Internet Control Message Protocol) is an auxiliary Layer 3 protocol used for network diagnostics and error reporting. `ping` sends ICMP Echo Requests (Type 8) and measures latency of Echo Replies (Type 0). `traceroute` discovers route hops by sending packets with incrementally increasing Time-To-Live (TTL = 1, 2, 3...) values, capturing ICMP Time Exceeded messages from intermediate routers.",
    detailedExplanation: [
      "**ICMP (Layer 3):** Encapsulated inside IP packets (Protocol 1), but contains no TCP/UDP port numbers.",
      "**Ping Execution:** Sends ICMP Echo Request. Target host returns ICMP Echo Reply. Measures Round-Trip Time (RTT) and packet loss.",
      "**Traceroute Execution:**",
      "1. Sends packet 1 with `TTL = 1`. 1st Router decrements `TTL` to 0, drops packet, and sends back **ICMP Time Exceeded (Type 11)** message -> Identifies Hop 1 IP.",
      "2. Sends packet 2 with `TTL = 2`. 2nd Router drops packet and returns ICMP Time Exceeded -> Identifies Hop 2 IP.",
      "3. Repeats `TTL = 3, 4, 5...` until packet reaches final destination, which returns ICMP Port Unreachable or Echo Reply.",
    ],
    example: {
      language: "JAVA",
      code: `// Terminal Output of Traceroute (Incrementing TTL)
$ traceroute google.com
1  192.168.1.1 (Default Gateway)  1.2 ms  (TTL=1 expired here)
2  10.20.0.1 (ISP Router)        12.4 ms  (TTL=2 expired here)
3  142.250.190.46 (Google Target)25.1 ms  (Destination reached!)`,
    },
    interviewTip:
      "Explain the purpose of TTL (Time To Live) in IP headers: TTL is a hop counter that prevents lost IP packets from looping infinitely on misconfigured network routes.",
    commonTrap:
      "Saying `ping` uses TCP or UDP. `ping` uses ICMP directly over IP (Layer 3), having no port numbers.",
    followUpQuestions: [
      "What is IP header Time-To-Live (TTL) and why is it essential?",
      "Why do some routers show `***` in traceroute output?",
    ],
    relatedTopics: ["ICMP", "Ping", "Traceroute", "Routing"],
    tags: ["Networks", "Diagnostics"],
  },

  /* ==========================================================================
     4. Transport Layer (TCP & UDP)
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "tcp-vs-udp",
    title: "What is the difference between TCP and UDP protocols?",
    difficulty: "EASY",
    subtopic: "Transport Layer",
    synopsis: "Connection-oriented reliable ordered stream vs connectionless low-latency datagrams.",
    shortAnswer:
      "TCP (Transmission Control Protocol) is connection-oriented, reliable, and guarantees ordered packet delivery with flow/congestion control. UDP (User Datagram Protocol) is connectionless, lightweight, and unordered with no delivery guarantees, prioritizing minimum latency.",
    detailedExplanation: [
      "**Reliability:** TCP uses sequence numbers, ACKs, and retransmissions to guarantee zero data loss. UDP sends packets without delivery verification.",
      "**Ordering & Connection:** TCP requires a 3-way handshake connection before transmission and reassembles packets in order. UDP sends independent datagrams instantly without connection setup.",
      "**Flow & Congestion Control:** TCP adjusts transmission speed using sliding window algorithms (TCP Tahoe/Reno/BBR) to prevent network congestion. UDP streams at maximum speed regardless of congestion.",
      "**Use Cases:** TCP powers HTTP/HTTPS, SSH, FTP, Email (SMTP). UDP powers Real-Time Video Calls (Zoom), Online Gaming, DNS queries, and Live Streaming (QUIC/HTTP/3).",
    ],
    example: {
      language: "JAVA",
      code: `// TCP Client (Reliable Stream)
Socket tcpSocket = new Socket("localhost", 8080);
PrintWriter out = new PrintWriter(tcpSocket.getOutputStream(), true);
out.println("Reliable Message"); // Guaranteed Delivery & Order

// UDP Client (Unreliable Fast Datagram)
DatagramSocket udpSocket = new DatagramSocket();
byte[] data = "Fast Message".getBytes();
DatagramPacket packet = new DatagramPacket(data, data.length, InetAddress.getByName("localhost"), 8080);
udpSocket.send(packet); // Sent without connection setup`,
    },
    interviewTip:
      "Connect UDP to modern protocols: HTTP/3 is built on QUIC, which runs on top of UDP to achieve zero-round-trip (0-RTT) connection setup while implementing custom reliability in user space.",
    commonTrap:
      "Saying 'UDP is always faster'. UDP is faster at packet dispatch, but TCP is optimized for high-throughput bulk streams.",
    followUpQuestions: [
      "How does TCP Sliding Window Flow Control work?",
      "What is the TCP TIME_WAIT state and why does it exist?",
      "Why does HTTP/3 use UDP instead of TCP?",
    ],
    relatedTopics: ["TCP/IP", "Transport Layer", "UDP", "QUIC"],
    tags: ["Networks", "Protocols"],
  },
  {
    topicSlug: "networks",
    slug: "tcp-three-way-handshake-four-way-teardown",
    title: "How does the TCP 3-Way Handshake and 4-Way Teardown work?",
    difficulty: "MEDIUM",
    subtopic: "Transport Layer",
    synopsis: "Connection establishment (SYN, SYN-ACK, ACK) and connection termination (FIN, ACK, FIN, ACK).",
    shortAnswer:
      "The TCP 3-Way Handshake establishes connection synchronization: 1) Client sends `SYN` (Sequence $x$), 2) Server responds with `SYN-ACK` (Sequence $y$, ACK $x+1$), 3) Client sends `ACK` (ACK $y+1$). 4-Way Teardown closes connection: 1) Client sends `FIN`, 2) Server sends `ACK`, 3) Server finishes sending data and sends `FIN`, 4) Client sends `ACK` and enters `TIME_WAIT`.",
    detailedExplanation: [
      "**3-Way Handshake Purpose:** Synchronizes Initial Sequence Numbers (ISN) for sequence tracking and negotiates Window Size and MSS (Maximum Segment Size).",
      "**4-Way Teardown Steps:**",
      "- **Step 1 (FIN):** Client sends `FIN` frame (enters `FIN_WAIT_1`).",
      "- **Step 2 (ACK):** Server sends `ACK` (enters `CLOSE_WAIT`; client enters `FIN_WAIT_2`). Server can still send remaining data.",
      "- **Step 3 (FIN):** Server finishes data transmission and sends `FIN` (enters `LAST_ACK`).",
      "- **Step 4 (ACK):** Client sends `ACK` (enters `TIME_WAIT` for $2 \\times MSL = 60s$ before closing).",
    ],
    example: {
      language: "JAVA",
      code: `// TCP Connection Sequence Flags
// Client -> Server: [SYN] Seq=100
// Server -> Client: [SYN, ACK] Seq=300, Ack=101
// Client -> Server: [ACK] Seq=101, Ack=301 -> Connection ESTABLISHED!`,
    },
    interviewTip:
      "Explain the SYN Flood attack: An attacker sends thousands of `SYN` packets from spoofed IPs, filling the server's SYN Queue backlog while ignoring `SYN-ACK` responses. Mitigated via **SYN Cookies**.",
    commonTrap:
      "Assuming connection closes immediately after the first FIN packet. TCP is full-duplex; both sides must close independently.",
    followUpQuestions: [
      "What is a SYN Flood DDoS attack and how do SYN Cookies mitigate it?",
      "Why is the TCP 4-Way Teardown necessary instead of a 3-way teardown?",
    ],
    relatedTopics: ["TCP", "Handshake", "Transport Layer"],
    tags: ["Networks", "TCP", "Protocols"],
  },
  {
    topicSlug: "networks",
    slug: "tcp-flow-control-sliding-window-vs-congestion-control",
    title: "What is the difference between TCP Flow Control and TCP Congestion Control?",
    difficulty: "MEDIUM",
    subtopic: "Transport Layer",
    synopsis: "Receiver buffer protection (Flow Control) vs Network bottleneck protection (Congestion Control).",
    shortAnswer:
      "Flow Control prevents a fast sender from overwhelming a slow receiver's buffer, enforced via Receiver Window size (`rwnd`). Congestion Control prevents senders from overloading intermediate network routers, enforced via Congestion Window size (`cwnd`) using algorithms like Slow Start, Congestion Avoidance, and Fast Recovery.",
    detailedExplanation: [
      "**Flow Control (Sliding Window):** Receiver advertises available buffer space in TCP header (`Window Size`). Sender cannot transmit more data than `rwnd` byte limit without receiving ACKs.",
      "**Congestion Control Algorithms:**",
      "- **Slow Start:** Starts with small `cwnd` (e.g. 10 MSS) and doubles `cwnd` every RTT (exponential growth) until reaching `ssthresh`.",
      "- **Congestion Avoidance:** Linear growth of `cwnd` (+1 MSS per RTT) past `ssthresh`.",
      "- **Fast Retransmit & Recovery:** On receiving 3 duplicate ACKs, sender retransmits missing segment immediately without waiting for retransmission timer expiration.",
    ],
    example: {
      language: "JAVA",
      code: `// Effective Transmission Window Calculation:
// Effective Window = Min(Receiver Window [rwnd], Congestion Window [cwnd])
// Senders respect whichever bottleneck is tighter!`,
    },
    interviewTip:
      "Summarize: Flow Control protects the RECEIVER (Buffer overflow); Congestion Control protects the NETWORK (Router buffer drop). Effective sending window = `MIN(rwnd, cwnd)`.",
    commonTrap:
      "Confusing Flow Control (Receiver Window `rwnd`) with Congestion Control (Network Congestion Window `cwnd`).",
    followUpQuestions: [
      "What is TCP BBR (Bottleneck Bandwidth and RTT) algorithm developed by Google?",
      "What triggers Fast Retransmit in TCP?",
    ],
    relatedTopics: ["TCP", "Flow Control", "Congestion Control"],
    tags: ["Networks", "TCP", "Performance"],
  },
  {
    topicSlug: "networks",
    slug: "tcp-time-wait-state-and-socket-reuse",
    title: "What is the TCP TIME_WAIT state and why does it exist?",
    difficulty: "HARD",
    subtopic: "Transport Layer",
    synopsis: "Post-closure 2*MSL delay ensuring delayed in-flight packets expire and final ACKs arrive.",
    shortAnswer:
      "The `TIME_WAIT` state is entered by the active closer of a TCP connection after sending the final ACK. It holds the socket open for 2 Maximum Segment Lifetimes ($2 \\times MSL$, typically 60 seconds) to: 1) Ensure the final ACK was received by the server, and 2) Allow delayed in-flight packets to expire from the network so they don't corrupt future connections.",
    detailedExplanation: [
      "**Reason 1: Reliable Termination:** If final `ACK` is lost, server re-transmits `FIN`. If client immediately closed socket, it would respond with `RST` (connection reset) instead of proper `ACK`.",
      "**Reason 2: Delayed Packet Expiration:** Old duplicate packets traveling through delayed internet routes must die off before a new connection reuses the same IP:Port tuple.",
      "**High-Load Problem:** High-throughput HTTP servers opening/closing short-lived connections exhaust ephemeral ports due to thousands of sockets stuck in `TIME_WAIT`.",
      "**Solution:** Enable `SO_REUSEADDR` socket option, HTTP Persistent Keep-Alive connections, or adjust `tcp_tw_reuse` sysctl.",
    ],
    example: {
      language: "JAVA",
      code: `// Enabling SO_REUSEADDR in Java Socket to reuse ports in TIME_WAIT state
ServerSocket serverSocket = new ServerSocket();
serverSocket.setReuseAddress(true); // Allows immediate binding even if port is in TIME_WAIT!
serverSocket.bind(new InetSocketAddress(8080));`,
    },
    interviewTip:
      "Explain how HTTP Keep-Alive solves `TIME_WAIT` port exhaustion: Reusing a single persistent TCP connection for multiple HTTP requests prevents opening and tearing down hundreds of short-lived TCP sockets.",
    commonTrap:
      "Setting `tcp_tw_recycle` in Linux. `tcp_tw_recycle` breaks NAT clients completely and was removed from the Linux kernel.",
    followUpQuestions: [
      "Why is HTTP Persistent Keep-Alive crucial for API server performance?",
      "What is `SO_REUSEADDR` vs `SO_REUSEPORT`?",
    ],
    relatedTopics: ["TCP", "TIME_WAIT", "Sockets"],
    tags: ["Networks", "TCP", "OS"],
  },

  /* ==========================================================================
     5. Application Layer & Protocols
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "http1-vs-http2-vs-http3-quic",
    title: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3 (QUIC)?",
    difficulty: "MEDIUM",
    subtopic: "Application Layer",
    synopsis: "Sequential text streams (HTTP/1.1) vs binary multiplexing (HTTP/2) vs UDP-based QUIC (HTTP/3).",
    shortAnswer:
      "HTTP/1.1 uses text-based requests over TCP (suffers Head-of-Line blocking). HTTP/2 introduces binary framing, multiplexing multiple streams over a single TCP connection, and HPACK header compression. HTTP/3 replaces TCP with QUIC (built on UDP), eliminating TCP Head-of-Line blocking and enabling 0-RTT connection resumption.",
    detailedExplanation: [
      "**HTTP/1.1:** Text-based protocols. Requires opening multiple parallel TCP connections (browser limit 6 per domain) to fetch assets concurrently. Suffers Head-of-Line (HoL) blocking on single connections.",
      "**HTTP/2:** Binary protocol. **Multiplexing:** Requests and responses are broken into binary frames interleaved over a single TCP connection. **Server Push:** Server sends CSS/JS proactively. Drawback: Single TCP packet drop stalls ALL multiplexed streams (TCP-level HoL blocking).",
      "**HTTP/3 (QUIC over UDP):** Replaces TCP with UDP + QUIC protocol in user space. Solves packet-loss HoL blocking (dropped packet affects ONLY its specific stream). Integrates TLS 1.3 encryption into connection handshake (0-RTT / 1-RTT setup). Connection Migration allows switching Wi-Fi to cellular without dropping streams.",
    ],
    example: {
      language: "JAVA",
      code: `// Protocol Progression Summary:
// HTTP/1.1: Text Format   | TCP Transport | 1 Request per Connection
// HTTP/2:   Binary Frames | TCP Transport | Multiplexed Streams
// HTTP/3:   Binary Frames | UDP (QUIC)    | Independent Multiplexed Streams (0-RTT)`,
    },
    interviewTip:
      "Key distinction for HTTP/3: HTTP/2 solved HTTP-level Head-of-Line blocking, but remained vulnerable to TCP-level Head-of-Line blocking. HTTP/3 solves both by running over UDP via QUIC.",
    commonTrap:
      "Assuming HTTP/3 is unsafe because it runs over UDP. QUIC implements full reliability, congestion control, and TLS 1.3 encryption on top of UDP.",
    followUpQuestions: [
      "What is Head-of-Line (HoL) blocking in HTTP/1.1 vs HTTP/2?",
      "How does Connection Migration work in QUIC when changing networks?",
    ],
    relatedTopics: ["HTTP/1.1", "HTTP/2", "HTTP/3", "QUIC"],
    tags: ["Networks", "HTTP", "Protocols"],
  },
  {
    topicSlug: "networks",
    slug: "dns-resolution-hierarchy-recursive-vs-iterative",
    title: "How does DNS Resolution work (Recursive vs Iterative queries)?",
    difficulty: "EASY",
    subtopic: "Application Layer",
    synopsis: "Translating domain names to IP addresses via Root, TLD, and Authoritative Name Servers.",
    shortAnswer:
      "DNS (Domain Name System) translates human-readable domain names (`example.com`) into IP addresses (`93.184.216.34`). In Recursive Queries, the client asks the Recursive Resolver to find the complete IP answer. In Iterative Queries, the resolver queries Root (`.`), TLD (`.com`), and Authoritative servers step-by-step.",
    detailedExplanation: [
      "**DNS Resolution Sequence:**",
      "1. Client checks Browser Cache -> OS Cache -> `/etc/hosts` file.",
      "2. Client sends **Recursive Query** to ISP/Public Recursive Resolver (`8.8.8.8`).",
      "3. Recursive Resolver performs **Iterative Queries**:",
      "   - Queries **Root Name Server (`.`)** -> Returns TLD Server IP for `.com`.",
      "   - Queries **TLD Name Server (`.com`)** -> Returns Authoritative Server IP for `example.com`.",
      "   - Queries **Authoritative Name Server (`example.com`)** -> Returns exact A Record IP (`93.184.216.34`).",
      "4. Recursive Resolver caches answer for duration of **TTL (Time-To-Live)** and returns IP to client.",
    ],
    example: {
      language: "JAVA",
      code: `// Inspecting DNS Resolution Steps via dig
$ dig +trace example.com
; Root Server (.) -> TLD Server (.com) -> Authoritative Server (ns1.example.com) -> A Record 93.184.216.34`,
    },
    interviewTip:
      "Know key DNS Record Types: `A` (IPv4 address), `AAAA` (IPv6 address), `CNAME` (Canonical Name alias), `MX` (Mail Exchange), `TXT` (SPF/DKIM verification), `NS` (Name Server).",
    commonTrap:
      "Confusing CNAME with A Record. A CNAME points a domain alias to another domain name, requiring an additional DNS lookup to resolve the final A Record IP.",
    followUpQuestions: [
      "What is the difference between A Record, CNAME, and ALIAS record?",
      "How does DNS Propagation work when updating IP records?",
    ],
    relatedTopics: ["DNS", "Domain Name System", "Networking"],
    tags: ["Networks", "DNS"],
  },
  {
    topicSlug: "networks",
    slug: "dhcp-dora-process",
    title: "How does DHCP work (The DORA 4-Step Process)?",
    difficulty: "EASY",
    subtopic: "Application Layer",
    synopsis: "Automated IP address assignment via Discover, Offer, Request, and Acknowledge UDP broadcasts.",
    shortAnswer:
      "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to network devices. It operates via the 4-step **DORA** broadcast process: Discover, Offer, Request, and Acknowledge over UDP ports 67 and 68.",
    detailedExplanation: [
      "**1. Discover (Client -> Broadcast):** New device joins network with IP `0.0.0.0` and broadcasts `DHCPDISCOVER` packet to `255.255.255.255:67` seeking a DHCP server.",
      "**2. Offer (Server -> Unicast/Broadcast):** DHCP server reserves an IP and responds with `DHCPOFFER` containing proposed IP, subnet mask, gateway, lease time.",
      "**3. Request (Client -> Broadcast):** Client broadcasts `DHCPREQUEST` accepting the offered IP (informs other DHCP servers that its offer was chosen).",
      "**4. Acknowledge (Server -> Unicast/Broadcast):** DHCP server sends `DHCPACK` confirming lease allocation. Client configures network interface.",
    ],
    example: {
      language: "JAVA",
      code: `// DORA Packet Protocol Summary
// 1. DHCPDISCOVER : Src 0.0.0.0:68           -> Dst 255.255.255.255:67
// 2. DHCPOFFER    : Src 192.168.1.1:67       -> Dst 255.255.255.255:68
// 3. DHCPREQUEST  : Src 0.0.0.0:68           -> Dst 255.255.255.255:67
// 4. DHCPACK      : Src 192.168.1.1:67       -> Dst 255.255.255.255:68`,
    },
    interviewTip:
      "Remember the acronym **DORA**: **D**iscover -> **O**ffer -> **R**equest -> **A**cknowledge.",
    commonTrap:
      "Thinking DHCP operates over TCP. DHCP uses UDP ports 67 (server) and 68 (client) because connectionless broadcasts are required before an IP address is assigned.",
    followUpQuestions: [
      "What is a Rogue DHCP Server and how does DHCP Snooping mitigate it?",
      "What happens when a DHCP lease expires?",
    ],
    relatedTopics: ["DHCP", "DORA", "IP Allocation"],
    tags: ["Networks", "DHCP", "Protocols"],
  },

  /* ==========================================================================
     6. Network Security & Infrastructure
     ========================================================================== */
  {
    topicSlug: "networks",
    slug: "ssl-tls-handshake-tls12-vs-tls13",
    title: "How does the SSL/TLS Handshake work (TLS 1.2 vs TLS 1.3)?",
    difficulty: "MEDIUM",
    subtopic: "Network Security",
    synopsis: "Authenticating certificates and establishing symmetric encryption keys via RSA/Diffie-Hellman.",
    shortAnswer:
      "The TLS Handshake secures HTTPS traffic by authenticating server identity via X.509 digital certificates and establishing a shared symmetric key (AES-GCM) for data encryption. TLS 1.2 requires 2 Round Trips (2-RTT); TLS 1.3 optimizes the handshake to 1 Round Trip (1-RTT) or 0-RTT for resumed connections.",
    detailedExplanation: [
      "**TLS 1.2 Handshake (2-RTT):**",
      "- Round 1: ClientHello (supported ciphers) <-> ServerHello (chosen cipher + X.509 Certificate).",
      "- Round 2: Key Exchange (Client verifies certificate via CA root chain, exchanges Diffie-Hellman keys, computes session key) <-> Finished.",
      "**TLS 1.3 Handshake (1-RTT):**",
      "- Combines key exchange into ClientHello by sending guess key shares upfront.",
      "- Drops insecure legacy algorithms (RSA key exchange, MD5, SHA-1, RC4, CBC).",
      "- Enforces **Perfect Forward Secrecy (PFS)** via ephemeral Diffie-Hellman (ECDHE).",
    ],
    example: {
      language: "JAVA",
      code: `// Hybrid Encryption Architecture in TLS:
// 1. Asymmetric Encryption (RSA / ECDHE): Used ONLY during handshake to verify identity and exchange symmetric session keys.
// 2. Symmetric Encryption (AES-256-GCM): Used for bulk HTTP payload encryption (1000x faster than asymmetric!).`,
    },
    interviewTip:
      "Explain Hybrid Encryption: TLS uses Asymmetric Encryption for identity verification during handshake, then switches to Symmetric Encryption for fast payload transfer.",
    commonTrap:
      "Confusing Encryption with Authentication. Digital Certificates provide Authentication (identity); Symmetric ciphers provide Confidentiality (Encryption).",
    followUpQuestions: [
      "What is Perfect Forward Secrecy (PFS)?",
      "What is the difference between TLS 1.2 2-RTT and TLS 1.3 1-RTT?",
    ],
    relatedTopics: ["TLS", "HTTPS", "Encryption", "Security"],
    tags: ["Networks", "Security", "TLS"],
  },
  {
    topicSlug: "networks",
    slug: "symmetric-vs-asymmetric-encryption-pki",
    title: "What is the difference between Symmetric and Asymmetric Encryption?",
    difficulty: "EASY",
    subtopic: "Network Security",
    synopsis: "Single shared key (Symmetric: AES) vs Public/Private key pair (Asymmetric: RSA/ECC).",
    shortAnswer:
      "Symmetric Encryption uses a single shared secret key for both encryption and decryption (AES, ChaCha20); it is extremely fast but requires a secure key exchange. Asymmetric Encryption uses a mathematically linked key pair: a Public Key for encryption and a Private Key for decryption (RSA, ECC); it is slower but solves key distribution.",
    detailedExplanation: [
      "**Symmetric Encryption (AES-256):** Both parties must possess identical secret key. Extremely fast hardware acceleration. Problem: How to share secret key securely over untrusted Internet?",
      "**Asymmetric Encryption (RSA, Elliptic Curve Cryptography - ECC):**",
      "- **Public Key:** Distributed freely to anyone. Used to encrypt data or verify signatures.",
      "- **Private Key:** Kept strictly secret. Used to decrypt data or generate digital signatures.",
      "**Public Key Infrastructure (PKI):** Certificate Authorities (CAs like Let's Encrypt) digitally sign public key certificates to verify website domain ownership.",
    ],
    example: {
      language: "JAVA",
      code: `// Java Asymmetric RSA vs Symmetric AES
Cipher rsaCipher = Cipher.getInstance("RSA");
rsaCipher.init(Cipher.ENCRYPT_MODE, publicKey); // Asymmetric

Cipher aesCipher = Cipher.getInstance("AES/GCM/NoPadding");
aesCipher.init(Cipher.ENCRYPT_MODE, secretKey); // Symmetric (Fast)`,
    },
    interviewTip:
      "Highlight ECC (Elliptic Curve Cryptography) vs RSA: ECC provides equivalent security to RSA with significantly smaller key sizes (256-bit ECC = 3072-bit RSA), reducing CPU consumption and packet size.",
    commonTrap:
      "Encrypting large file payloads directly with RSA. RSA can only encrypt data smaller than its key size and is thousands of times slower than AES.",
    followUpQuestions: [
      "How do Digital Signatures guarantee non-repudiation and integrity?",
      "What is a Certificate Authority (CA) root chain?",
    ],
    relatedTopics: ["Encryption", "PKI", "Security", "RSA"],
    tags: ["Networks", "Security", "Cryptography"],
  },
  {
    topicSlug: "networks",
    slug: "firewalls-stateful-vs-stateless-vs-waf",
    title: "What is the difference between a Stateless Firewall, a Stateful Firewall, and a Web Application Firewall (WAF)?",
    difficulty: "MEDIUM",
    subtopic: "Network Security",
    synopsis: "Static packet filtering (Stateless) vs connection tracking (Stateful) vs Layer 7 payload inspection (WAF).",
    shortAnswer:
      "A Stateless Firewall filters individual packets independently based solely on static rules (IP, Port, Protocol). A Stateful Firewall tracks active connection states in a state table, automatically allowing return traffic for established outbound connections. A Web Application Firewall (WAF) operates at Layer 7, inspecting HTTP payload content for web attacks (SQLi, XSS).",
    detailedExplanation: [
      "**Stateless Firewall (Layer 3/4):** Evaluates access control lists (ACLs) per packet. Fast, but requires explicitly opening both outbound and inbound port rules.",
      "**Stateful Firewall (Layer 3/4):** Maintains connection state table (`ESTABLISHED`, `NEW`). If outbound connection to `port 443` is created, return traffic is permitted automatically.",
      "**Web Application Firewall / WAF (Layer 7):** Inspects HTTP request headers, cookies, and JSON bodies. Detects application-layer attacks (SQL Injection, Cross-Site Scripting, Remote Code Execution) that pass cleanly through Layer 4 firewalls.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux iptables Stateful Rule Example
// Allow return traffic for established connections automatically:
// iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`,
    },
    interviewTip:
      "Explain why Layer 4 firewalls cannot block SQL Injection: To a Layer 4 firewall, an HTTP request containing `' OR 1=1` is just a valid TCP packet on port 443; only a Layer 7 WAF decodes the HTTP body to spot malicious SQL syntax.",
    commonTrap:
      "Believing a network firewall protects against application vulnerabilities like XSS. XSS protection requires WAF or application sanitization.",
    followUpQuestions: [
      "What is AWS WAF and ModSecurity?",
      "How does Stateful Packet Inspection (SPI) work?",
    ],
    relatedTopics: ["Firewall", "WAF", "Security"],
    tags: ["Networks", "Security"],
  },
  {
    topicSlug: "networks",
    slug: "load-balancing-l4-vs-l7-load-balancers",
    title: "What is the difference between Layer 4 and Layer 7 Load Balancers?",
    difficulty: "MEDIUM",
    subtopic: "Infrastructure",
    synopsis: "Transport layer routing by IP/Port (Layer 4) vs Application layer routing by URL/Header (Layer 7).",
    shortAnswer:
      "A Layer 4 Load Balancer routes network traffic based on IP address and TCP/UDP port numbers without inspecting packet payloads (high speed, lower CPU). A Layer 7 Load Balancer inspects HTTP headers, cookies, and URL paths to make intelligent routing decisions (e.g. routing `/api` to service A, `/images` to CDN).",
    detailedExplanation: [
      "**Layer 4 Load Balancer (HAProxy TCP mode, AWS NLB):**",
      "- Operates at Transport Layer (IP:Port).",
      "- Does NOT terminate TLS or inspect HTTP content.",
      "- Ultra-high performance (millions of requests/sec with minimal CPU).",
      "**Layer 7 Load Balancer (Nginx, HAProxy HTTP mode, AWS ALB):**",
      "- Operates at Application Layer (HTTP/HTTPS).",
      "- Terminates TLS encryption, inspects cookies (sticky sessions), headers, and path routes.",
      "- Enables advanced features: Rate limiting, path routing, header modification.",
    ],
    example: {
      language: "JAVA",
      code: `// AWS ALB (Layer 7) Path-Based Routing Rule
// Path /api/v1/users*  -> Route to Target Group: user-microservice
// Path /api/v1/orders* -> Route to Target Group: order-microservice
// Path /static/*       -> Route to S3 Bucket`,
    },
    interviewTip:
      "In System Design: Recommend L4 (NLB) for extreme throughput or non-HTTP protocols (gRPC, WebSockets, DB connections); recommend L7 (ALB) for microservices path-routing and SSL termination.",
    commonTrap:
      "Trying to route traffic based on HTTP cookies or headers using a Layer 4 load balancer. Layer 4 has no access to HTTP payload headers.",
    followUpQuestions: [
      "What is AWS ALB vs AWS NLB?",
      "How does Sticky Sessions (Session Affinity) work in Layer 7 load balancers?",
    ],
    relatedTopics: ["Load Balancer", "Layer 4", "Layer 7", "AWS"],
    tags: ["Networks", "System Design", "Infrastructure"],
  },
  {
    topicSlug: "networks",
    slug: "ddos-attacks-syn-flood-udp-reflection",
    title: "What are common DDoS attacks (SYN Flood, UDP Amplification) and how are they mitigated?",
    difficulty: "MEDIUM",
    subtopic: "Network Security",
    synopsis: "Exhausting server resources via half-open connections or spoofed UDP amplification.",
    shortAnswer:
      "Distributed Denial of Service (DDoS) overwhelms target resources to cause outages. A SYN Flood sends thousands of spoofed TCP `SYN` packets, filling the server's connection backlog. UDP Amplification sends small requests with spoofed victim IP headers to vulnerable open servers (NTP/DNS), causing massive responses to bombard the victim. Mitigated via SYN Cookies, Anycast CDNs (Cloudflare), and Scrubbing Centers.",
    detailedExplanation: [
      "**SYN Flood (Layer 4):** Attacker sends SYN requests with fake IPs. Server allocates memory in SYN Queue and sends SYN-ACK. Attacker ignores responses. SYN Queue fills up, blocking legitimate users.",
      "**SYN Cookies Mitigation:** Server encodes connection state into the Initial Sequence Number (ISN) without allocating SYN Queue memory until client returns final ACK.",
      "**UDP Amplification (Layer 7/4):** Attacker sends 64-byte request to open DNS/NTP servers with victim's spoofed source IP. Server returns 4000-byte response to victim ($60\\times$ traffic amplification multiplier).",
      "**Cloudflare / Anycast Mitigation:** Anycast BGP routes attack traffic to hundreds of global edge data centers simultaneously, absorbing multi-terabit attacks.",
    ],
    example: {
      language: "JAVA",
      code: `// Linux Kernel SYN Cookie Enablement
// $ sysctl -w net.ipv4.tcp_syncookies=1
// Eliminates SYN queue memory allocation vulnerability during SYN flood attacks!`,
    },
    interviewTip:
      "Explain Anycast routing for DDoS defense: Anycast advertises the same IP address from 300+ data centers globally, spreading a 2 Tbps attack across global edges so no single datacenter experiences overload.",
    commonTrap:
      "Thinking rate limiting on a single origin web server can stop a 1 Tbps volumetric DDoS. Volumetric attacks must be scrubbed at the CDN / Anycast network edge before reaching origin bandwidth.",
    followUpQuestions: [
      "How does BGP Anycast routing mitigate volumetric DDoS attacks?",
      "What is a DNS Amplification attack factor?",
    ],
    relatedTopics: ["DDoS", "Security", "SYN Flood", "Cloudflare"],
    tags: ["Networks", "Security", "DDoS"],
  },
];
