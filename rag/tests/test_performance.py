import pytest
import numpy as np
import time
from generation import get_rag_chain
from evaluation_metrics import evaluate_faithfulness, evaluate_relevancy

@pytest.fixture
def rag_chain():
    return get_rag_chain()

@pytest.mark.performance
def test_p95_latency(rag_chain):
    """Regression gate: Ensure P95 latency is under 5 seconds."""
    queries = [
        "What is the company policy on paid leave?",
        "How does the engineering team use Python?",
        "What was the revenue growth in Q3?"
    ]
    
    latencies = []
    for q in queries:
        start = time.time()
        rag_chain(q)
        latencies.append(time.time() - start)
    
    p95 = np.percentile(latencies, 95)
    print(f"\nLatency Metrics: Min: {min(latencies):.2f}s | P50: {np.median(latencies):.2f}s | P95: {p95:.2f}s")
    
    assert p95 < 5.0, f"P95 latency {p95:.2f}s exceeds threshold of 5.0s"

@pytest.mark.quality
def test_rag_quality_benchmarks(rag_chain):
    """Regression gate: Ensure average faithfulness and relevancy > 0.8."""
    test_cases = [
        {
            "question": "What is the paid leave policy?",
            "expected_contains": "20 days"
        },
        {
            "question": "What tools does engineering use?",
            "expected_contains": "Python"
        }
    ]
    
    faithfulness_scores = []
    relevancy_scores = []
    
    for case in test_cases:
        res = rag_chain(case["question"])
        answer = res["response"].answer
        context = res["context"]
        
        f_eval = evaluate_faithfulness(case["question"], answer, context)
        r_eval = evaluate_relevancy(case["question"], answer)
        
        faithfulness_scores.append(f_eval.score)
        relevancy_scores.append(r_eval.score)
        
        print(f"\nEval for: {case['question']}")
        print(f"Faithfulness: {f_eval.score} ({f_eval.reasoning})")
        print(f"Relevancy: {r_eval.score} ({r_eval.reasoning})")

    avg_f = np.mean(faithfulness_scores)
    avg_r = np.mean(relevancy_scores)
    
    assert avg_f >= 0.8, f"Average faithfulness {avg_f} is below 0.8 gate!"
    assert avg_r >= 0.8, f"Average relevancy {avg_r} is below 0.8 gate!"
    
@pytest.mark.cost
def test_cost_per_request(rag_chain):
    """Ensure average cost per request remains within budget ($0.001)."""
    res = rag_chain("What is the company policy on paid leave?")
    cost = res["metadata"]["cost"]
    print(f"\nEstimated Cost: ${cost:.6f}")
    assert cost < 0.001, f"Cost ${cost:.6f} exceeds budget of $0.001"
