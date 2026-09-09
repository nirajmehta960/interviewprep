import type { ConceptualQuestion } from "../conceptual";

export const aiEngineerQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "ml-fundamentals",
    slug: "ml-supervision-types",
    title: "Supervised vs Unsupervised vs Reinforcement Learning",
    difficulty: "EASY",
    subtopic: "ML Foundations",
    synopsis: "Labeled data mapping vs structural pattern discovery vs policy optimization via rewards.",
    shortAnswer:
      "Supervised learning trains models on labeled input-output pairs to minimize prediction loss. Unsupervised learning discovers hidden patterns or clusters in unlabeled data. Reinforcement learning optimizes actions in a dynamic environment to maximize cumulative rewards.",
    detailedExplanation: [
      "**Supervised Learning.** Models learn a mapping f(X) -> y from labeled features X and ground-truth targets y. Tasks include regression (continuous output like housing price prediction) and classification (discrete output like spam filtering).",
      "**Unsupervised Learning.** Models uncover intrinsic geometry or clusters in unlabeled features X. Tasks include clustering (k-Means, DBSCAN), dimensionality reduction (PCA, t-SNE, UMAP), and density estimation.",
      "**Reinforcement Learning (RL).** An agent takes action a_t in state s_t, receives reward r_t, and transitions to s_{t+1}. The goal is learning a policy pi(a|s) that maximizes expected discounted cumulative reward.",
    ],
    example: {
      language: "PYTHON",
      code: `# Supervised: Customer churn classification
from sklearn.ensemble import RandomForestClassifier
clf = RandomForestClassifier().fit(X_train_labeled, y_train_labels)

# Unsupervised: Customer segmentation without labels
from sklearn.cluster import KMeans
clusters = KMeans(n_clusters=5).fit_predict(X_features)`,
    },
    interviewTip:
      "When asked to categorize a real-world problem, start by asking: 'Do we have reliable ground-truth labels?' If yes, frame as supervised. If labels are expensive, mention semi-supervised or weak supervision.",
    commonTrap:
      "Confusing self-supervised learning (SSL)—used to train base LLMs like GPT on next-token prediction—with unsupervised learning. SSL generates labels directly from raw sequence context.",
    followUpQuestions: [
      "How does semi-supervised learning bridge the gap between supervised and unsupervised methods?",
      "Why is reward hacking a major challenge when aligning RL models with human feedback (RLHF)?",
    ],
    relatedTopics: ["ML Fundamentals", "Deep Learning", "Fine-Tuning"],
    tags: ["ML Fundamentals", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
  },
  {
    topicSlug: "ml-fundamentals",
    slug: "bias-variance-tradeoff",
    title: "Bias-Variance Tradeoff & Regularization",
    difficulty: "MEDIUM",
    subtopic: "ML Foundations",
    synopsis: "Underfitting error vs sensitivity to training fluctuations and how penalties mitigate variance.",
    shortAnswer:
      "Bias is error from erroneous model assumptions (underfitting); variance is error from sensitivity to small fluctuations in training data (overfitting). Total expected error equals Bias^2 + Variance + Irreducible Error. Regularization constraints (L1, L2, Dropout) mitigate variance.",
    detailedExplanation: [
      "**High Bias (Underfitting).** Model is overly simplistic (e.g., linear regression fitted to quadratic data). Both training and test loss remain high.",
      "**High Variance (Overfitting).** Model memorizes training noise (e.g., unconstrained decision tree of depth 50). Training loss is near zero, but test loss spikes.",
      "**L1 Regularization (Lasso).** Adds penalty proportional to absolute sum of weights. Enforces feature sparsity by setting irrelevant weights to zero.",
      "**L2 Regularization (Ridge).** Adds penalty proportional to squared sum of weights. Shrinks weights smoothly toward zero, preventing explosive gradients.",
      "**Dropout.** Randomly zeroes activations during forward pass with probability p, forcing redundant representation pathways.",
    ],
    example: {
      language: "PYTHON",
      code: `import torch
import torch.nn as nn

class RegularizedMLP(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.dropout = nn.Dropout(p=0.3)
        self.fc2 = nn.Linear(128, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(self.dropout(x))

# Optimizer applies L2 weight decay
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)`,
    },
    interviewTip:
      "Always state that total generalization error cannot drop below the irreducible error. Mention how modern deep learning exhibits 'double descent' where over-parameterized models achieve low variance post-interpolation threshold.",
    commonTrap:
      "Assuming high training accuracy always means a good model. Without checking validation metrics, high training accuracy with poor validation performance is overfitting.",
    followUpQuestions: [
      "Why does L1 regularization yield sparse feature weights while L2 does not?",
      "What is double descent in modern deep neural networks and how does it challenge traditional statistical bias-variance intuition?",
    ],
    relatedTopics: ["ML Fundamentals", "Deep Learning"],
    tags: ["ML Fundamentals", "Bias-Variance", "Overfitting", "Regularization", "Dropout"],
  },
  {
    topicSlug: "deep-learning",
    slug: "transformer-self-attention",
    title: "Transformer Architecture & Self-Attention Mechanism",
    difficulty: "HARD",
    subtopic: "Deep Learning",
    synopsis: "Query, Key, Value projections, scaled dot-product attention, and multi-head representation.",
    shortAnswer:
      "Self-attention allows tokens in a sequence to dynamically compute pairwise context weights via Query (Q), Key (K), and Value (V) projections using scaled dot-product attention: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V.",
    detailedExplanation: [
      "**Scaled Dot-Product Attention.** Linear projections compute Q = X W_Q, K = X W_K, V = X W_V. Pairwise similarity matrix S = Q K^T is scaled by sqrt(d_k) to prevent vanishing softmax gradients in high dimensions.",
      "**Multi-Head Attention (MHA).** MHA splits model dimension d_model into h heads of dimension d_k = d_model / h. Each head projects tokens into distinct representation subspaces, enabling simultaneous focus on syntactic and semantic relationships.",
      "**Computational Complexity.** Naive self-attention requires O(N^2 * d) time and memory for sequence length N. FlashAttention achieves exact attention with IO-aware block tiling.",
    ],
    example: {
      language: "PYTHON",
      code: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    attn_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attn_weights, V), attn_weights`,
    },
    interviewTip:
      "Be prepared to state the quadratic time/memory complexity O(N^2) of naive self-attention. Highlight FlashAttention as an IO-aware exact attention optimization for long context windows.",
    commonTrap:
      "Forgetting why the scaling factor sqrt(d_k) is necessary. For independent standard normal vectors, Var(q * k) = d_k. Large dot products push softmax into flat regions with zero gradients.",
    followUpQuestions: [
      "How does FlashAttention achieve speedups without changing the exact output of standard self-attention?",
      "What is the difference between Encoder-only (BERT), Decoder-only (GPT), and Encoder-Decoder (T5) architectures?",
    ],
    relatedTopics: ["Deep Learning", "LLMs & RAG"],
    tags: ["Deep Learning", "Transformers", "Self-Attention", "Multi-Head Attention", "PyTorch"],
  },
  {
    topicSlug: "llm-rag",
    slug: "rag-retrieval-architecture",
    title: "Retrieval-Augmented Generation (RAG) Systems",
    difficulty: "MEDIUM",
    subtopic: "Generative AI",
    synopsis: "Document chunking, vector indexing, hybrid search, reranking, and context synthesis.",
    shortAnswer:
      "RAG enhances LLM responses by fetching relevant context from external knowledge bases during query time. The pipeline involves document chunking, embedding generation, vector indexing, similarity search, reranking, and context-augmented prompt synthesis.",
    detailedExplanation: [
      "**Chunking & Ingestion.** Documents are split into semantic chunks (256-512 tokens with 10-20% overlap).",
      "**Hybrid Search.** Combines Dense Retrieval (bi-encoder embeddings for semantic meaning) and Sparse Retrieval (BM25 for exact keyword matching). Reciprocal Rank Fusion (RRF) merges candidate lists.",
      "**Cross-Encoder Reranking.** A cross-encoder model computes fine-grained relevance scores over top-K candidates by passing (query, chunk) pairs simultaneously.",
    ],
    example: {
      language: "PYTHON",
      code: `def get_augmented_context(query: str, top_k: int = 5):
    dense_hits = vector_db.search(embed(query), k=20)
    sparse_hits = bm25.search(query, k=20)
    fused_candidates = rrf_fuse(dense_hits, sparse_hits, top_k=20)
    
    pairs = [[query, doc.text] for doc in fused_candidates]
    scores = reranker_model.predict(pairs)
    
    reranked_docs = [doc for _, doc in sorted(zip(scores, fused_candidates), reverse=True)]
    return reranked_docs[:top_k]`,
    },
    interviewTip:
      "In enterprise RAG discussions, emphasize chunk metadata management (document ID, timestamp, ACL permissions) and handling stale vectors when documents update.",
    commonTrap:
      "Relying solely on dense vector search for queries containing specific product codes, IDs, or rare acronyms. Always recommend hybrid search (BM25 + Dense).",
    followUpQuestions: [
      "How do you evaluate a RAG pipeline using metrics like Context Precision, Context Recall, and Answer Faithfulness?",
      "What is Parent Document Retrieval and how does it solve the chunk-size trade-off?",
    ],
    relatedTopics: ["LLMs & RAG", "Vector Databases", "Prompt Engineering"],
    tags: ["LLM", "RAG", "Vector Search", "Hybrid Search", "Reranking", "AI System Design"],
  },
  {
    topicSlug: "fine-tuning",
    slug: "peft-lora-fine-tuning",
    title: "Parameter-Efficient Fine-Tuning (PEFT) & LoRA",
    difficulty: "HARD",
    subtopic: "Generative AI",
    synopsis: "Freezing base model weights and training low-rank update decomposition matrices.",
    shortAnswer:
      "LoRA (Low-Rank Adaptation) freezes pretrained model weights W_0 and injects trainable rank decomposition matrices A and B (W = W_0 + (alpha/r) * B * A). This reduces trainable parameter counts by 99%+ while maintaining fine-tuning quality.",
    detailedExplanation: [
      "**Low-Rank Decomposition.** For weight matrix W_0 in R^(d x k), LoRA factorizes weight updates delta W into B in R^(d x r) and A in R^(r x k) with rank r << min(d, k).",
      "**Forward Pass & Initialization.** Forward calculation: h = W_0 x + (alpha/r) (B A) x. Matrix A is initialized from Gaussian distribution and B to zero, so delta W = 0 at start.",
      "**QLoRA.** Quantizes base model weights W_0 to 4-bit NormalFloat (NF4) while maintaining 16-bit LoRA adapter matrices in FP16/BF16, enabling fine-tuning of 70B models on single GPUs.",
    ],
    example: {
      language: "PYTHON",
      code: `from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained('meta-llama/Llama-3-8B')
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=['q_proj', 'v_proj'],
    task_type='CAUSAL_LM'
)
peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()`,
    },
    interviewTip:
      "Explain how LoRA adapters can be merged back into W_0 for zero-latency inference deployment, or swapped dynamically in memory for multi-tenant adapter serving.",
    commonTrap:
      "Confusing Full Fine-Tuning, Instruction Tuning (SFT), and DPO/RLHF. LoRA is an efficient parameter method that can be applied to both SFT and alignment stages.",
    followUpQuestions: [
      "What are the key trade-offs between LoRA, Prefix Tuning, and Adapter Modules?",
      "How does Direct Preference Optimization (DPO) simplify LLM alignment compared to PPO-based RLHF?",
    ],
    relatedTopics: ["Fine-Tuning", "LLMs & RAG", "Deep Learning"],
    tags: ["Fine-Tuning", "PEFT", "LoRA", "QLoRA", "LLM", "PyTorch"],
  },
  {
    topicSlug: "vector-databases",
    slug: "vector-index-hnsw-ivfflat",
    title: "Vector Indexing Algorithms: HNSW vs IVFFlat",
    difficulty: "HARD",
    subtopic: "Production Systems",
    synopsis: "Inverted file clustering (IVFFlat) vs hierarchical graph navigation (HNSW).",
    shortAnswer:
      "IVFFlat uses k-means clustering to partition vector space into inverted list Voronoi cells, reducing search scope. HNSW (Hierarchical Navigable Small World) builds multi-layer proximity graphs offering fast sub-millisecond retrieval at higher memory cost.",
    detailedExplanation: [
      "**Flat (Exact Search).** Brute-force pairwise evaluation O(N * d). Zero build time, lowest memory, 100% recall.",
      "**IVFFlat.** Partitions vectors into nlist clusters using k-means. Queries search only nprobe nearest centroids. Fast build time, low memory, 85-95% recall.",
      "**HNSW.** Multi-layer skip-list graph. Top layers contain sparse long-range skip connections; bottom layers contain dense local connections. Slow build time, higher memory, 95-99% recall.",
    ],
    example: {
      language: "PYTHON",
      code: `import faiss

d = 1536 # OpenAI embedding dim
nlist = 100

# IVFFlat Indexing
quantizer = faiss.IndexFlatIP(d)
index_ivf = faiss.IndexIVFFlat(quantizer, d, nlist)
index_ivf.train(vectors_np)
index_ivf.add(vectors_np)
index_ivf.nprobe = 10

# HNSW Indexing
M = 32
index_hnsw = faiss.IndexHNSWFlat(d, M)
index_hnsw.hnsw.efSearch = 64
index_hnsw.add(vectors_np)`,
    },
    interviewTip:
      "When designing a production vector service, highlight memory budgeting. If high-dimensional vectors exceed RAM, recommend Product Quantization (PQ) to compress vector representations by 8-16x with minimal recall loss.",
    commonTrap:
      "Assuming distance metrics are interchangeable. Cosine distance equals 1 - Dot Product ONLY when vectors are normalized to unit length.",
    followUpQuestions: [
      "How does Scalar Quantization (SQ8) and Product Quantization (PQ) compress vector memory in vector databases?",
      "Why is filtered vector search (Metadata Filtering) tricky, and how do pre-filtering, post-filtering, and single-stage vector filtering differ?",
    ],
    relatedTopics: ["Vector Databases", "LLMs & RAG"],
    tags: ["Vector DB", "HNSW", "IVFFlat", "FAISS", "Embeddings", "Indexing"],
  },
  {
    topicSlug: "ai-system-design",
    slug: "ai-agent-react-function-calling",
    title: "AI Agent Systems & Tool-Calling Execution Loops",
    difficulty: "HARD",
    subtopic: "Production Systems",
    synopsis: "ReAct framework, JSON schema tool definitions, sandboxed execution, and state management.",
    shortAnswer:
      "AI agents combine LLMs with tool execution loops using frameworks like ReAct (Reasoning + Acting). The LLM inspects user intent, selects external APIs via structured function schemas, receives execution outputs, and iteratively reasons toward a final response.",
    detailedExplanation: [
      "**ReAct Execution Loop.** Goal -> [ Thought -> Action (Tool Call) -> Observation (Tool Output) ]* -> Final Answer.",
      "**Tool Registry & Schemas.** Tools are defined via JSON Schemas detailing function names, descriptions, parameters, and required fields.",
      "**State & Memory Management.** Maintains conversation history, tool invocation arguments, execution outputs, and token window bounds.",
    ],
    example: {
      language: "PYTHON",
      code: `tools = [{
    'type': 'function',
    'function': {
        'name': 'get_stock_price',
        'description': 'Fetch real-time stock price',
        'parameters': {
            'type': 'object',
            'properties': {'ticker': {'type': 'string'}},
            'required': ['ticker']
        }
    }
}]
response = client.chat.completions.create(model='gpt-4o', messages=messages_history, tools=tools)`,
    },
    interviewTip:
      "Discuss safety guardrails in agent systems: schema validation, tool execution timeouts, maximum loop iteration depth, and human-in-the-loop approval for destructive actions.",
    commonTrap:
      "Assuming LLMs execute code directly inside the model. LLMs generate text/JSON tokens representing function parameters; the host application runtime parses and executes the function call.",
    followUpQuestions: [
      "How do you handle cyclic execution loops where an agent gets stuck calling the same tool repeatedly?",
      "What are the tradeoffs between LangGraph state machine agents and simple linear ReAct loops?",
    ],
    relatedTopics: ["AI System Design", "Prompt Engineering", "LLMs & RAG"],
    tags: ["AI System Design", "AI Agents", "Function Calling", "ReAct", "LLM Systems"],
  },
];
