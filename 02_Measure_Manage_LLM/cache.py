import os
import pickle
import numpy as np
from typing import Optional, Tuple
from sentence_transformers import SentenceTransformer
import faiss

class SemanticCache:
    def __init__(self, threshold: float = 0.85, model_name: str = "all-MiniLM-L6-v2"):
        self.threshold = threshold
        self.encoder = SentenceTransformer(model_name)
        self.dimension = 384  # MiniLM-L6-v2 dimension
        self.index = faiss.IndexFlatIP(self.dimension) # Inner product for cosine similarity (with normalized vectors)
        self.entries = [] # List to store (query, response_text, model_name, cost, latency)
        
    def _normalize(self, vec):
        return vec / np.linalg.norm(vec, axis=1, keepdims=True)

    def get(self, query: str) -> Optional[Tuple[str, str, float, float]]:
        if not self.entries:
            return None
            
        query_vec = self.encoder.encode([query])
        query_vec = self._normalize(query_vec)
        
        distances, indices = self.index.search(query_vec, 1)
        
        if indices[0][0] != -1 and distances[0][0] >= self.threshold:
            idx = indices[0][0]
            entry = self.entries[idx]
            return entry[1:] # response_text, model_name, cost, latency
            
        return None

    def add(self, query: str, response_text: str, model_name: str, cost: float, latency: float):
        query_vec = self.encoder.encode([query])
        query_vec = self._normalize(query_vec)
        
        self.index.add(query_vec)
        self.entries.append((query, response_text, model_name, cost, latency))

# Global cache instance
semantic_cache = SemanticCache()
