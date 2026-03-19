from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import time
import random
from pydantic import BaseModel

class ModelResponse(BaseModel):
    text: str
    model_name: str
    latency: float
    cost: float
    success: bool = True

class BaseProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, **kwargs) -> ModelResponse:
        pass

class MockProvider(BaseProvider):
    def __init__(self, model_configs: Dict[str, Dict[str, Any]]):
        """
        model_configs = {
            "fast": {"latency_range": (0.2, 0.5), "cost_per_token": 0.0000005},
            "strong": {"latency_range": (1.5, 3.0), "cost_per_token": 0.00003},
            "tool": {"latency_range": (1.0, 2.0), "cost_per_token": 0.000002}
        }
        """
        self.configs = model_configs
        self.failure_rate = 0.0

    def set_failure_rate(self, rate: float):
        self.failure_rate = rate

    def generate(self, prompt: str, model_type: str = "fast", **kwargs) -> ModelResponse:
        config = self.configs.get(model_type, self.configs["fast"])
        
        # Inject failure
        if random.random() < self.failure_rate:
            return ModelResponse(
                text="Error: Model timeout or simulated failure.",
                model_name=f"mock-{model_type}",
                latency=config["latency_range"][1] + 1.0,
                cost=0.0,
                success=False
            )

        # Simulate latency
        latency = random.uniform(*config["latency_range"])
        time.sleep(latency / 10.0)  # Speed up simulation slightly but record real-style latency
        
        # Estimate cost (rough tokens: 1 token per 4 chars)
        tokens = len(prompt) // 4 + 50 # response overhead
        cost = tokens * config["cost_per_token"]
        
        return ModelResponse(
            text=f"Mock response for {model_type}: {prompt[:20]}...",
            model_name=f"mock-{model_type}",
            latency=latency,
            cost=cost,
            success=True
        )

# Optional: LiteLLMProvider for real usage (if user provides keys)
class LiteLLMProvider(BaseProvider):
    def __init__(self, model_map: Dict[str, str]):
        self.model_map = model_map

    def generate(self, prompt: str, model_type: str = "fast", **kwargs) -> ModelResponse:
        import litellm
        model = self.model_map.get(model_type, "gemini/gemini-1.5-flash")
        start_time = time.time()
        try:
            response = litellm.completion(model=model, messages=[{"role": "user", "content": prompt}], **kwargs)
            latency = time.time() - start_time
            cost = litellm.completion_cost(response)
            return ModelResponse(
                text=response.choices[0].message.content,
                model_name=model,
                latency=latency,
                cost=cost,
                success=True
            )
        except Exception as e:
            return ModelResponse(
                text=str(e),
                model_name=model,
                latency=time.time() - start_time,
                cost=0.0,
                success=False
            )
