import os
import pickle
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.retrievers import EnsembleRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from langchain.retrievers import ContextualCompressionRetriever

CHROMA_PERSIST_DIR = "data/chroma"
BM25_PERSIST_PATH = "data/bm25_retriever.pkl"

def get_retriever():
    if not os.path.exists(BM25_PERSIST_PATH) or not os.path.exists(CHROMA_PERSIST_DIR):
        raise FileNotFoundError("Data has not been ingested. Please run ingest.py first.")

    # 1. Load Vector Store Retriever
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(persist_directory=CHROMA_PERSIST_DIR, embedding_function=embeddings)
    vector_retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    # 2. Load BM25 Retriever
    with open(BM25_PERSIST_PATH, "rb") as f:
        bm25_retriever = pickle.load(f)
    bm25_retriever.k = 5

    # 3. Hybrid Retriever (Ensemble of Sparse and Dense)
    # Weights define the importance between BM25 and Vector Search
    hybrid_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever], weights=[0.5, 0.5]
    )

    # 4. Cross-Encoder Reranker
    # Re-ranks the combined documents for precision checking
    cross_encoder = HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
    compressor = CrossEncoderReranker(model=cross_encoder, top_n=3)

    # 5. Final Retrieval Pipeline
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=hybrid_retriever
    )

    return compression_retriever
