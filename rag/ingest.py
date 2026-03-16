import os
import uuid
import pickle
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever

DOCS_DIR = "data/docs"
CHROMA_PERSIST_DIR = "data/chroma"
BM25_PERSIST_PATH = "data/bm25_retriever.pkl"

def get_or_create_docs_dir():
    if not os.path.exists(DOCS_DIR):
        os.makedirs(DOCS_DIR)
        # Create some sample docs if empty
        with open(os.path.join(DOCS_DIR, "sample1.txt"), "w") as f:
            f.write("The company policy states that all employees must take 20 days of paid leave per year.")
        with open(os.path.join(DOCS_DIR, "sample2.txt"), "w") as f:
            f.write("The engineering team uses Python and LangChain for building AI applications.")
        with open(os.path.join(DOCS_DIR, "sample3.txt"), "w") as f:
            f.write("The Q3 financial report indicates a 15% revenue growth compared to Q2.")

def ingest_docs():
    get_or_create_docs_dir()
    
    loader = DirectoryLoader(DOCS_DIR, glob="**/*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    if not documents:
        print("No documents found in", DOCS_DIR)
        return

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)
    
    # Assign unique IDs to chunks for citation purposes
    for i, chunk in enumerate(chunks):
        chunk.metadata["doc_id"] = f"doc_{i}"
        chunk.metadata["source"] = chunk.metadata.get("source", "unknown")
    
    # Ensure directories exist for persisting
    os.makedirs(os.path.dirname(BM25_PERSIST_PATH), exist_ok=True)
    
    # 1. Setup Vector Store (Dense Retrieval)
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )
    print(f"Ingested {len(chunks)} chunks into Chroma Vector Store.")

    # 2. Setup BM25 Retriever (Sparse Retrieval)
    bm25_retriever = BM25Retriever.from_documents(chunks)
    
    # Save BM25 retriever to disk (pickle)
    with open(BM25_PERSIST_PATH, "wb") as f:
        pickle.dump(bm25_retriever, f)
    print("Ingested BM25 representation locally.")

if __name__ == "__main__":
    ingest_docs()
