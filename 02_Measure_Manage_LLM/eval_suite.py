import json
import pandas as pd
from router import IntelligentRouter
from models import MockProvider

GOLDEN_SET = [
    {"query": "Hello", "expected_intent": "simple"},
    {"query": "How are you?", "expected_intent": "simple"},
    {"query": "What is the capital of France?", "expected_intent": "simple"},
    {"query": "Calculate 5 * 123", "expected_intent": "tool"},
    {"query": "Search for the latest news on AI", "expected_intent": "tool"},
    {"query": "Compute the square root of 256", "expected_intent": "tool"},
    {"query": "Analyze the impact of climate change on agriculture in the next decade.", "expected_intent": "complex"},
    {"query": "Compare the performance of Python and C++ for scientific computing.", "expected_intent": "complex"},
    {"query": "Explain the theory of relativity in simple terms.", "expected_intent": "complex"},
    # ... 20 queries total (simplified for brevitiy)
] * 2 + [{"query": f"Extra query {i}", "expected_intent": "simple"} for i in range(2)]

class EvaluationSuite:
    def __init__(self, router: IntelligentRouter):
        self.router = router

    def run_eval(self, dataset: list) -> dict:
        correct_intents = 0
        total_latency = 0
        total_cost = 0
        
        results = []
        for item in dataset:
            resp = self.router.route(item["query"])
            # In our mock, intent is captured in the trace, but for eval we'll check model mapping
            actual_intent = self.router.classify_intent(item["query"])
            
            is_correct = actual_intent == item["expected_intent"]
            if is_correct:
                correct_intents += 1
                
            total_latency += resp.latency
            total_cost += resp.cost
            results.append({"query": item["query"], "correct": is_correct, "latency": resp.latency})

        accuracy = correct_intents / len(dataset)
        return {
            "accuracy": accuracy,
            "avg_latency": total_latency / len(dataset),
            "total_cost": total_cost,
            "results": results
        }

def perform_regression_test(baseline_accuracy: float, current_eval: dict, threshold: float = 0.05):
    diff = baseline_accuracy - current_eval["accuracy"]
    print(f"Baseline Accuracy: {baseline_accuracy:.2%}")
    print(f"Current Accuracy: {current_eval['accuracy']:.2%}")
    print(f"Accuracy Delta: {-diff:.2%}")
    
    if diff > threshold:
        print("❌ REGRESSION DETECTED: Accuracy dropped by more than 5%. Blocking deploy.")
        return False
    else:
        print("✅ REGRESSION TEST PASSED: Accuracy within acceptable limits.")
        return True

if __name__ == "__main__":
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    provider = MockProvider(model_configs)
    router = IntelligentRouter(provider)
    suite = EvaluationSuite(router)
    
    # Baseline run
    print("Running Evaluation...")
    report = suite.run_eval(GOLDEN_SET)
    
    # Simulate a baseline from a previous run
    baseline_acc = 0.90 
    perform_regression_test(baseline_acc, report)
