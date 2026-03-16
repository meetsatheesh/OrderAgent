# Production RAG Application: "Ask My Docs"

This project implements a domain-specific "Ask My Docs" RAG (Retrieval-Augmented Generation) system with advanced observability and evaluation.

## Architecture & Features

- **Hybrid Retrieval**: Combines BM25 with Vector Search using LangChain's `EnsembleRetriever`.
- **Cross-Encoder Reranking**: Boosts precision using HuggingFace cross-encoders.
- **Citation Enforcement**: Uses OpenAI's structured output via Pydantic for exact `doc_id` mapping.
- **Advanced Observability**: 
    - **Latency Tracking**: P50/P95 latency monitoring.
    - **Cost Estimation**: Real-time token cost calculation for GPT-4o-mini.
    - **LangSmith Integration**: Full tracing support for visual debugging.
- **CI Regression Gating**: Automated performance and quality gates in GitHub Actions.

## Project Structure

- `ingest.py`: Document processing and vector store setup.
- `retrieval.py`: Hybrid retrieval and reranking pipeline.
- `generation.py`: RAG chain with observability and citation logic.
- `observability.py`: Tracing, cost, and LangSmith configuration.
- `evaluation_metrics.py`: LLM-as-a-judge quality scorers.
- `tests/test_performance.py`: Performance and quality regression tests.
- `.github/workflows/eval.yml`: CI pipeline definition.

## Quick Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Ingest Documents**:
   ```bash
   python ingest.py
   ```

3. **Set API Keys**:
   ```bash
   export OPENAI_API_KEY="your-openai-key"
   export LANGCHAIN_API_KEY="your-langsmith-key" # Optional for tracing
   ```

4. **Query the System**:
   ```bash
   python generation.py
   ```

5. **Run Evaluations**:
   ```bash
   pytest tests/test_performance.py -v
   ```

## LangSmith Setup
To enable LangSmith tracing, simply provide your `LANGCHAIN_API_KEY`. Traces will be uploaded to the `RAG-Production-Project` project by default.
