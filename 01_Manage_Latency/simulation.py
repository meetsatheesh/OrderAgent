import pandas as pd
import numpy as np
from router import IntelligentRouter
from models import MockProvider
import json
import os

def generate_queries(n=200):
    queries = []
    # 50% Simple
    for i in range(n // 2):
        queries.append(f"Hello, what is the weather like today? query_id_{i}")
    
    # 30% Complex
    for i in range(int(n * 0.3)):
        queries.append(
            "Compare and contrast the socio-economic impacts of the industrial revolution "
            f"in Great Britain versus Germany during the late 19th century. query_id_{i}"
        )
    
    # 20% Tool-related
    for i in range(int(n * 0.2)):
        queries.append(f"Calculate the compound interest for 5000 USD at 5% for 10 years. query_id_{i}")
    
    import random
    random.shuffle(queries)
    return queries[:n]

def run_simulation():
    # Setup
    model_configs = {
        "fast": {"latency_range": (0.1, 0.4), "cost_per_token": 0.0000005},
        "strong": {"latency_range": (1.0, 2.5), "cost_per_token": 0.00003},
        "tool": {"latency_range": (0.5, 1.5), "cost_per_token": 0.000002}
    }
    
    provider = MockProvider(model_configs)
    router = IntelligentRouter(provider)
    
    queries = generate_queries(200)
    results = []
    
    # Pass 1: No cache (cold)
    print(f"Starting cold simulation of {len(queries)} queries...")
    results_cold = []
    for q in queries:
        resp = router.route(q)
        results_cold.append({"model": resp.model_name, "latency": resp.latency, "cost": resp.cost})
    
    # Pass 2: With cache (warm)
    print(f"Starting warm simulation of same {len(queries)} queries...")
    results_warm = []
    for q in queries:
        resp = router.route(q)
        results_warm.append({"model": resp.model_name, "latency": resp.latency, "cost": resp.cost})
    
    df_cold = pd.DataFrame(results_cold)
    df_warm = pd.DataFrame(results_warm)
    
    # Metrics
    p95_cold = np.percentile(df_cold['latency'], 95)
    cost_cold = df_cold['cost'].sum()
    
    p95_warm = np.percentile(df_warm['latency'], 95)
    cost_warm = df_warm['cost'].sum()
    
    # Model distribution cold
    model_counts = df_cold['model'].value_counts().to_dict()
    
    print("\n--- Simulation Report ---")
    print(f"{'Metric':<15} | {'Cold (Pass 1)':<15} | {'Warm (Pass 2)':<15} | {'Improvement':<10}")
    print("-" * 65)
    print(f"{'p95 Latency':<15} | {p95_cold:15.3f}s | {p95_warm:15.3f}s | {(p95_cold-p95_warm)/p95_cold*100:9.1f}%")
    print(f"{'Total Cost':<15} | ${cost_cold:14.6f} | ${cost_warm:14.6f} | {(cost_cold-cost_warm)/cost_cold*100:9.1f}%")
    
    print("\nModel Distribution (Cold):")
    for model, count in model_counts.items():
        print(f"  {model}: {count} ({count/len(df_cold)*100:.1f}%)")
    
    # Save report
    report = {
        "cold": {"p95": float(p95_cold), "cost": float(cost_cold)},
        "warm": {"p95": float(p95_warm), "cost": float(cost_warm)},
        "distribution": {k: int(v) for k, v in model_counts.items()}
    }
    with open("simulation_report.json", "w") as f:
        json.dump(report, f, indent=2)

if __name__ == "__main__":
    run_simulation()
