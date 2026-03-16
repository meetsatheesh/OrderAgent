import pytest
from retrieval import get_retriever

def test_retrieval_accuracy():
    """Test if specific semantic keywords are found by the hybrid search."""
    retriever = get_retriever()
    query = "engineering team tools"
    
    docs = retriever.invoke(query)
    
    found_expected_info = False
    for d in docs:
        if "Python" in d.page_content and "LangChain" in d.page_content:
            found_expected_info = True
            break
            
    assert found_expected_info, "Retriever failed to fetch the document about engineering team tools!"

def test_retrieval_robustness():
    """Test retrieval robustness across financial numeric terms."""
    retriever = get_retriever()
    query = "Q3 financial report revenue"
    
    docs = retriever.invoke(query)
    
    assert len(docs) > 0, "No documents were retrieved for the query"
    
    found_finance = False
    for d in docs:
        if "15%" in d.page_content or "revenue" in d.page_content.lower():
            found_finance = True
            break
            
    assert found_finance, "Retriever failed to fetch Q3 financial report."
