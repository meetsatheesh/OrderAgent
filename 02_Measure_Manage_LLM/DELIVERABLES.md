# LLM Router: Project Deliverables

This project implements an intelligent LLM router designed to manage the trade-offs between **Latency, Cost, and Quality**.

## 1. Core Modules (Deliverables)
- **`router.py`**: The primary entry point. Orchestrates intent classification, complexity scoring, and model selection.
- **`DECISION_POLICY.md`**: Formalized routing policy, SLO definitions, and failure handling strategy.
- **`models.py`**: Provider interface with a high-fidelity `MockProvider` for reproducible simulations and a `LiteLLMProvider` for real-world API connectivity.
- **`telemetry.py`**: Performance monitoring and logging.
- **`cache.py`**: Semantic caching using `SentenceTransformers` and `FAISS` (Cosine Similarity).

## 2. Simulation & Results
- **`simulation.py`**: A robust simulation script that runs **200 mixed queries** (Simple, Complex, Tool-use) through both a "Cold" (un-cached) and "Warm" (cached) pass.
- **`simulation_report.json`**: Machine-readable performance metrics including:
  - **p95 Latency**: Validated < 2.5s for cold starts and < 0.001s for cached hits.
  - **Total Cost**: Aggregated cost based on token usage and model tiering.

## 3. Acceptance Tests
- **`tests/test_routing.py`**: Pytest suite verifying:
  - **Routing Accuracy**: ≥ 80% simple queries correctly routed to the Fast tier.
  - **Failure Handling**: System fallback to Fast tier during Strong model failure (10% failure injection), maintaining >95% success rate.

## 4. How to Present
Share the `01_Manage_Latency` folder with the interviewer. Highlight the **Semantic Cache** as a significant performance optimizer and the **Fallback Logic** as a key reliability feature.
