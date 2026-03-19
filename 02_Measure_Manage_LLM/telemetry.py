import structlog
import os
import json
from datetime import datetime

# Configure structlog
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.PrintLoggerFactory(),
)

logger = structlog.get_logger()

class Telemetry:
    def __init__(self, log_file: str = "routing_decisions.jsonl"):
        self.log_file = log_file

    def log_decision(self, query: str, intent: str, complexity: float, model_selected: str, 
                     latency: float, cost: float, success: bool, fallback: bool = False):
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "query": query[:50] + "..." if len(query) > 50 else query,
            "intent": intent,
            "complexity": complexity,
            "model": model_selected,
            "latency": latency,
            "cost": cost,
            "success": success,
            "fallback": fallback
        }
        logger.info("routing_decision", **log_entry)
        
        with open(self.log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")

telemetry = Telemetry()
