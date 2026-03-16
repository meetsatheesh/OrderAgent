import time
import tiktoken
from typing import Dict, Any, List
import logging
import json
import os

# Configure logging for tracing
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RAG_Observability")

# LangSmith Setup
def init_langsmith(project_name: str = "RAG-Production-Project"):
    """Initialize LangSmith tracing environment variables."""
    if os.environ.get("LANGCHAIN_API_KEY"):
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_PROJECT"] = project_name
        logger.info(f"🚀 LangSmith Tracing enabled for project: {project_name}")
    else:
        logger.warning("⚠️ LANGCHAIN_API_KEY not found. LangSmith tracing disabled.")

# Cost constants for GPT-4o-mini
# Prices per 1M tokens
COST_PER_1M_INPUT = 0.150
COST_PER_1M_OUTPUT = 0.600

class TracingContext:
    def __init__(self, operation_name: str):
        self.operation_name = operation_name
        self.start_time = None
        self.end_time = None
        self.metadata = {}

    def __enter__(self):
        self.start_time = time.perf_now()
        logger.info(f"[TRACE START] {self.operation_name}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.perf_now()
        duration = self.end_time - self.start_time
        logger.info(f"[TRACE END] {self.operation_name} | Duration: {duration:.4f}s")
        if exc_type:
            logger.error(f"[TRACE ERROR] {self.operation_name} | Error: {exc_val}")

def count_tokens(text: str, model: str = "gpt-4o-mini") -> int:
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))

def calculate_cost(input_tokens: int, output_tokens: int) -> float:
    input_cost = (input_tokens / 1_000_000) * COST_PER_1M_INPUT
    output_cost = (output_tokens / 1_000_000) * COST_PER_1M_OUTPUT
    return input_cost + output_cost

class TraceManager:
    def __init__(self):
        self.traces = []

    def add_trace(self, trace_data: Dict[str, Any]):
        self.traces.append(trace_data)
        # In a real app, this could be pushed to a DB or telemetry service
        with open("data/telemetry.jsonl", "a") as f:
            f.write(json.dumps(trace_data) + "\n")

trace_manager = TraceManager()

def track_request(func):
    """Decorator to track latency, tokens, and costs for a RAG request."""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        # Capture parameters
        question = args[0] if args else kwargs.get("question", "unknown")
        
        result = func(*args, **kwargs)
        
        end_time = time.time()
        latency = end_time - start_time
        
        # Extract metrics if available in result
        raw_response = result.get("response")
        # Estimate input tokens (Context + Question)
        # This is an approximation since we don't have the full prompt here easily
        # but generation.py can be modified to provide it.
        
        # For now, let's assume generation.py returns token counts
        # If not, we estimate here.
        input_tokens = result.get("input_tokens", 0)
        output_tokens = result.get("output_tokens", 0)
        
        if input_tokens == 0:
            input_tokens = count_tokens(question) # Baseline
            
        if output_tokens == 0 and hasattr(raw_response, 'answer'):
            output_tokens = count_tokens(raw_response.answer)
            
        cost = calculate_cost(input_tokens, output_tokens)
        
        # Enrich result
        result["metadata"] = {
            "latency": latency,
            "cost": cost,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "timestamp": time.time()
        }
        
        # Log trace
        trace_data = {
            "operation": "rag_request",
            "question": question,
            "latency": latency,
            "cost": cost,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "status": "success"
        }
        trace_manager.add_trace(trace_data)
        
        return result
    return wrapper
