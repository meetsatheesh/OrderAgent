import json
import os
from eval_suite import EvaluationSuite, GOLDEN_SET, perform_regression_test
from router import IntelligentRouter
from models import MockProvider

BASELINE_FILE = "baseline_eval.json"

def run_evaluation(label: str):
    print(f"\n🚀 Running {label} Evaluation...")
    # Setup
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    provider = MockProvider(model_configs)
    router = IntelligentRouter(provider)
    suite = EvaluationSuite(router)
    
    # Run Eval
    report = suite.run_eval(GOLDEN_SET)
    return report

def save_baseline():
    report = run_evaluation("Baseline (Pre-change)")
    with open(BASELINE_FILE, "w") as f:
        json.dump(report, f, indent=2)
    print(f"✅ Baseline saved to {BASELINE_FILE} (Accuracy: {report['accuracy']:.2%})")

def run_compare():
    if not os.path.exists(BASELINE_FILE):
        print("❌ Error: No baseline found. Run with --save-baseline first.")
        return

    with open(BASELINE_FILE, "r") as f:
        baseline = json.load(f)

    # Simulation of a "Post-change" (slightly degraded)
    # In a real scenario, the user would modify the system prompt and then run this.
    current = run_evaluation("Current (Post-change)")
    
    # Compare
    print("\n" + "="*40)
    print("      EVALUATION COMPARISON REPORT")
    print("="*40)
    print(f"{'Metric':<15} | {'Baseline':<12} | {'Current':<12} | {'Delta'}")
    print("-" * 55)
    
    acc_delta = current['accuracy'] - baseline['accuracy']
    lat_delta = current['avg_latency'] - baseline['avg_latency']
    cost_delta = current['total_cost'] - baseline['total_cost']

    print(f"{'Accuracy':<15} | {baseline['accuracy']:12.2%} | {current['accuracy']:12.2%} | {acc_delta:+.2%}")
    print(f"{'Avg Latency':<15} | {baseline['avg_latency']:11.3f}s | {current['avg_latency']:11.3f}s | {lat_delta:+.3f}s")
    print(f"{'Total Cost':<15} | ${baseline['total_cost']:11.6f} | ${current['total_cost']:11.6f} | ${cost_delta:+.6f}")
    
    print("\n" + "="*40)
    perform_regression_test(baseline['accuracy'], current)

if __name__ == "__main__":
    import sys
    if "--save-baseline" in sys.argv:
        save_baseline()
    else:
        run_compare()
