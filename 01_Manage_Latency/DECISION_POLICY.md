# LLM Router: Decision Policy Document

## 1. Objective
The goal of this policy is to optimize LLM selection by balancing **Cost**, **Latency**, and **Quality** while maintaining specific SLOs (Budget and p95 Latency).

## 2. Model Tiering
We define three model tiers for routing:
- **Fast Tier (Cheap/Low-Latency)**: Used for simple queries and greetings (e.g., `Gemini 1.5 Flash` or `GPT-3.5`).
- **Strong Tier (Expensive/High-Quality)**: Used for complex, analytical, or socio-economic reasoning (e.g., `Gemini 1.5 Pro` or `GPT-4o`).
- **Tool Tier (Function-Capable)**: Used for queries requiring external tools like calculators or search (e.g., specific tool-optimized models).

## 3. Classification Logic
Routing is determined by two primary signals:
1. **Intent Classification**: Heuristically identifying if the query is a "Tool", "Simple", or "Complex" request.
2. **Complexity Scoring (0.0 - 1.0)**: Based on:
   - **Token Length**: Longer queries increase complexity.
   - **Keyword Presence**: Keywords like "analyze", "socio-economic", "comparison" trigger higher scores.

## 4. Routing Policy
- **Simple Intent & Complexity < 0.4** → Route to **Fast Tier**.
- **Tool Intent** → Route to **Tool Tier**.
- **Complex Intent OR Complexity > 0.4** → Route to **Strong Tier**.

## 5. Failure & Reliability
- **Simulated SLO**: If a **Strong** model fails (simulated 10% failure rate) or exceeds timeout, the router automatically **falls back** to the **Fast** model to ensure availability.
- **Semantic Cache**: If a query is semantically similar (>85% cosine similarity) to a previous one, the result is served from the cache, bypassing the LLM entirely (0.001s latency, $0 cost).

## 6. SLO Targets
- **p95 Latency**: Target < 2.0s (Cold) / < 0.1s (Cached).
- **Cost**: Target minimal by offloading to Fast/Cache whenever possible.
