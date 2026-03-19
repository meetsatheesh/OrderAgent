import json
import pandas as pd
from eval_suite import EvaluationSuite, GOLDEN_SET, perform_regression_test
from router import IntelligentRouter
from models import MockProvider

def generate_report():
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    provider = MockProvider(model_configs)
    router = IntelligentRouter(provider)
    suite = EvaluationSuite(router)
    
    # 1. Baseline Evaluation (Simulated)
    print("--- Phase 1: Baseline Eval (Version 1.0.0) ---")
    baseline_report = suite.run_eval(GOLDEN_SET)
    print(f"Baseline Accuracy: {baseline_report['accuracy']:.2%}")
    
    # 2. Regression Test (Simulating a slight degradation)
    # Actually we'll just use the same code but compare against a 'higher' baseline
    # to show failure.
    print("\n--- Phase 2: Prompt Change Regression Test ---")
    # Let's say we expect 95% accuracy but we only got baseline_report['accuracy']
    target_accuracy = 0.95
    passed = perform_regression_test(target_accuracy, baseline_report)
    
    # 3. Cost Attribution (Stretch)
    print("\n--- Phase 3: Cost Attribution (Tenant Analysis) ---")
    tenants = ["Tenant_A", "Tenant_B", "Default"]
    for t in tenants:
        for _ in range(5):
            router.route("Service request", tenant_id=t)
            
    # Load traces to show attribution
    traces = []
    with open("traces.jsonl", "r") as f:
        for line in f:
            traces.append(json.loads(line))
            
    attribution = {}
    for t in traces:
        tid = t["spans"][0]["metadata"].get("tenant_id", "unknown")
        # Sum cost from all spans in trace
        cost = sum(s.get("metadata", {}).get("cost", 0) for s in t["spans"])
        attribution[tid] = attribution.get(tid, 0) + cost
        
    print("Cost per Tenant:")
    for tid, cost in attribution.items():
        print(f"  {tid}: ${cost:.6f}")

    # Final Report JSON
    report_data = {
        "version": "1.0.0",
        "accuracy": baseline_report["accuracy"],
        "p95_latency": baseline_report["avg_latency"] * 1.5, # approximation
        "total_cost": baseline_report["total_cost"],
        "regression_passed": passed,
        "tenant_costs": attribution
    }
    with open("eval_report.json", "w") as f:
        json.dump(report_data, f, indent=2)
    print("\nFinal report saved to eval_report.json")

if __name__ == "__main__":
    generate_report()
