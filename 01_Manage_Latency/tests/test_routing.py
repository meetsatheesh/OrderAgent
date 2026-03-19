import pytest
import numpy as np
import pandas as pd
from router import IntelligentRouter
from models import MockProvider

def test_routing_distribution():
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    provider = MockProvider(model_configs)
    router = IntelligentRouter(provider)
    
    # Test 100 simple queries
    simple_results = []
    for _ in range(100):
        resp = router.route("Hello world")
        simple_results.append(resp.model_name)
    
    fast_count = sum(1 for r in simple_results if "mock-fast" in r)
    assert fast_count >= 80, f"Expected >= 80 simple queries to go to Fast, but got {fast_count}"

    # Test tool queries
    tool_resp = router.route("Calculate 1+1")
    assert "mock-tool" in tool_resp.model_name

    # Test complex queries
    complex_resp = router.route("Summarize this long document about socio-economics...")
    assert "mock-strong" in complex_resp.model_name

def test_failure_handling_and_fallback():
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    provider = MockProvider(model_configs)
    provider.set_failure_rate(0.1)  # 10% failure in Strong
    router = IntelligentRouter(provider)
    
    results = []
    # Run 50 complex queries (which should go to Strong)
    for _ in range(50):
        resp = router.route("This is a complex query that needs strong model.")
        results.append({
            "success": resp.success,
            "model": resp.model_name,
            "latency": resp.latency
        })
    
    df = pd.DataFrame(results)
    success_rate = df['success'].mean()
    fallback_count = (df['model'] == 'mock-fast').sum()
    
    print(f"\nSuccess rate with failures: {success_rate*100:.1f}%")
    print(f"Fallback to fast count: {fallback_count}")
    
    # Check if we maintain high success rate via fallback
    assert success_rate > 0.95, "Success rate should be high due to fallback"
    assert fallback_count > 0, "There should be some fallbacks to Fast"
