from typing import List, Dict, Any, Optional
from models import BaseProvider, ModelResponse
from telemetry import telemetry
import time

class IntelligentRouter:
    def __init__(self, provider: BaseProvider, slo_latency: float = 2.0, slo_budget: float = 0.001):
        self.provider = provider
        self.slo_latency = slo_latency  # p95 goal
        self.slo_budget = slo_budget    # budget per query goal

    def classify_intent(self, query: str) -> str:
        """Simple heuristic-based classification for simulation."""
        query_lower = query.lower()
        # Tool: Explicit keywords
        if any(word in query_lower for word in ["calc", "search", "get", "calculate", "find", "compute"]):
            return "tool"
        
        # Simple: Short, standard greetings/questions (excluding complex ones)
        words = query.split()
        if len(words) < 10 and not any(w in query_lower for w in ["compare", "contrast", "analyze", "explain"]):
            return "simple"
            
        return "complex"

    def estimate_complexity(self, query: str) -> float:
        """Complexity score from 0.0 to 1.0."""
        words = query.split()
        # Length-based: 0.0 at 1 word, 1.0 at 100 words
        base_score = min(len(words) / 50.0, 0.8)
        
        # Keyword-based: analyze, compare, socio-economic, etc.
        complex_keywords = ["socio-economic", "comparison", "differentiation", "architectural", "industrial"]
        bonus = 0.0
        if any(k in query.lower() for k in complex_keywords):
            bonus += 0.3
            
        return min(base_score + bonus, 1.0)

    def route(self, query: str, tenant_id: str = "default") -> ModelResponse:
        from observability import Trace, metrics_collector, compute_grounding_score
        trace = Trace()
        root_span = trace.start_span("route")
        root_span.metadata["tenant_id"] = tenant_id
        prompt_version = "1.0.0"
        
        # 1. Semantic Cache check
        cache_span = trace.start_span("cache_check")
        from cache import semantic_cache
        cached = semantic_cache.get(query)
        if cached:
            text, model, cost, latency = cached
            cache_span.finish(hit=True, model=model)
            
            telemetry.log_decision(
                query=query,
                intent="CACHE_HIT",
                complexity=0.0,
                model_selected=model,
                latency=0.001,
                cost=0.0,
                success=True
            )
            root_span.finish(status="success", source="cache", version=prompt_version)
            metrics_collector.record_trace(trace)
            return ModelResponse(
                text=text,
                model_name=f"{model} (cached)",
                latency=0.001,
                cost=0.0,
                success=True
            )
        cache_span.finish(hit=False)

        # 2. Routing logic
        classify_span = trace.start_span("classification")
        intent = self.classify_intent(query)
        complexity = self.estimate_complexity(query)
        classify_span.finish(intent=intent, complexity=complexity)
        
        target_model = "fast"
        if intent == "tool":
            target_model = "tool"
        elif intent == "complex" or complexity > 0.4:
            target_model = "strong"
            
        # Call provider
        llm_span = trace.start_span("llm_call")
        response = self.provider.generate(query, model_type=target_model)
        
        # Fallback logic
        is_fallback = False
        if not response.success:
            is_fallback = True
            if target_model != "fast":
                response = self.provider.generate(query, model_type="fast")
        
        # Grounding Score
        grounding_score = compute_grounding_score(query, response.text)
        llm_span.finish(
            model=response.model_name,
            cost=response.cost,
            latency=response.latency,
            success=response.success,
            grounding_score=grounding_score,
            version=prompt_version
        )
        
        # Store in cache if successful
        if response.success:
            semantic_cache.add(query, response.text, response.model_name, response.cost, response.latency)

        # Log decision
        telemetry.log_decision(
            query=query,
            intent=intent,
            complexity=complexity,
            model_selected=response.model_name,
            latency=response.latency,
            cost=response.cost,
            success=response.success,
            fallback=is_fallback
        )
        
        root_span.finish(status="success" if response.success else "error", version=prompt_version)
        metrics_collector.record_trace(trace)
        return response
