import time
import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class Span(BaseModel):
    name: str
    start_time: float
    end_time: Optional[float] = None
    metadata: Dict[str, Any] = {}
    
    def finish(self, **metadata):
        self.end_time = time.time()
        self.metadata.update(metadata)
    
    @property
    def duration(self) -> float:
        if self.end_time:
            return self.end_time - self.start_time
        return 0.0

class Trace(BaseModel):
    trace_id: str = str(uuid.uuid4())
    spans: List[Span] = []
    
    def start_span(self, name: str) -> Span:
        span = Span(name=name, start_time=time.time())
        self.spans.append(span)
        return span

class MetricsCollector:
    def __init__(self, log_file: str = "traces.jsonl"):
        self.log_file = log_file

    def record_trace(self, trace: Trace):
        with open(self.log_file, "a") as f:
            f.write(trace.json() + "\n")

metrics_collector = MetricsCollector()

def compute_grounding_score(query: str, response: str) -> float:
    """Mock grounding score: 0.0 to 1.0."""
    # Heuristic: Check if keywords from query are in response
    query_words = set(query.lower().split())
    resp_words = set(response.lower().split())
    if not query_words: return 1.0
    
    match_count = len(query_words.intersection(resp_words))
    score = match_count / len(query_words)
    # Add some randomness for simulation variety
    import random
    return min(max(score + random.uniform(-0.1, 0.2), 0.0), 1.0)
