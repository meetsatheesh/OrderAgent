# Production RAG Application: "Ask My Docs"

This project implements a domain-specific "Ask My Docs" RAG (Retrieval-Augmented Generation) system.

## Architecture & Features

- **Hybrid Retrieval**: Combines BM25 (dense keyword/sparse) with Vector Search (dense embeddings) using LangChain's `EnsembleRetriever`.
- **Cross-Encoder Reranking**: Re-ranks the combined hybrid retrieval results using a HuggingFace cross-encoder model to boost precision before passing context to the LLM.
- **Citation Enforcement**: Uses OpenAI's structured output generation via Pydantic to ensure models return exact document citations (`doc_id` mapping).
- **CI-Gated Evaluation Pipeline**: Includes a basic PyTest evaluation suite integrated natively with GitHub Actions (`.github/workflows/eval.yml`) to enforce retrieval metrics and quality checks on Pull Requests.

## Project Structure

- `requirements.txt`: Python package dependencies.
- `ingest.py`: Chunking, vector embeddings computation, and setting up our vector store (Chroma) and semantic cache (BM25).
- `retrieval.py`: Setup for our EnsembleRetriever (hybrid search) wrapper and our contextual cross-encoder compressor.
- `generation.py`: Pipeline connecting retrieval to OpenAI's structured generation. Returns the valid citation references cleanly.
- `tests/test_evaluation.py`: Pytest-based evaluator simulating our CI gate.
- `.github/workflows/eval.yml`: The YAML definition bridging evaluations automatically natively in repositories.

## Quick Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Ingest Documents**:
   This parses documents from `data/docs`, chunks them, assigns `doc_id`s, and persists data.
   ```bash
   python ingest.py
   ```

3. **Query the System**:
   Ensure you have an Open AI API key configured.
   ```bash
   export OPENAI_API_KEY=your-api-key
   python generation.py
   ```

4. **Run Evaluations** (Local execution for CI checks):
   ```bash
   pytest tests/test_evaluation.py
   ```
