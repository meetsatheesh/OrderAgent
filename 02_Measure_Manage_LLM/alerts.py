import numpy as np
import json
from typing import List, Dict, Any

class AlertManager:
    def __init__(self, latency_threshold: float = 2.0, daily_budget: float = 10.0):
        self.latency_threshold = latency_threshold
        self.daily_budget = daily_budget
        self.active_alerts = []

    def process_traces(self, traces: List[Dict[str, Any]]):
        self.active_alerts = []
        
        # 1. p95 Latency Check
        latencies = [t["spans"][0]["end_time"] - t["spans"][0]["start_time"] for t in traces if t["spans"]]
        if latencies:
            p95 = np.percentile(latencies, 95)
            if p95 > self.latency_threshold:
                self.active_alerts.append({
                    "type": "LATENCY_CRITICAL",
                    "value": f"{p95:.2f}s",
                    "threshold": f"{self.latency_threshold}s",
                    "severity": "High"
                })

        # 2. Budget Check
        total_cost = sum(
            span.get("metadata", {}).get("cost", 0) 
            for t in traces 
            for span in t.get("spans", [])
        )
        if total_cost > self.daily_budget:
            self.active_alerts.append({
                "type": "BUDGET_EXCEEDED",
                "value": f"${total_cost:.4f}",
                "threshold": f"${self.daily_budget}",
                "severity": "Critical"
            })

    def get_alerts(self) -> List[Dict[str, Any]]:
        return self.active_alerts

def load_traces(filename: str = "traces.jsonl") -> List[Dict[str, Any]]:
    traces = []
    try:
        with open(filename, "r") as f:
            for line in f:
                traces.append(json.loads(line))
    except FileNotFoundError:
        pass
    return traces

if __name__ == "__main__":
    # Test alerts
    traces = load_traces()
    manager = AlertManager(latency_threshold=0.5, daily_budget=0.01) # Low thresholds to trigger
    manager.process_traces(traces)
    alerts = manager.get_alerts()
    print(f"Active Alerts: {len(alerts)}")
    for a in alerts:
        print(f"[{a['severity']}] {a['type']}: {a['value']} exceeds {a['threshold']}")
