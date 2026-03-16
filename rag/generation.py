import os
from pydantic import BaseModel, Field
from typing import List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from retrieval import get_retriever

class AnswerWithCitations(BaseModel):
    answer: str = Field(description="The comprehensive answer to the user's question, based solely on the provided context.")
    citations: List[str] = Field(description="A list of document IDs (doc_id) that justify the answer.")

def get_rag_chain():
    # Utilizing OpenAI to ensure strictly typed JSON/Structured output.
    # Set OPENAI_API_KEY environment variable.
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    structured_llm = llm.with_structured_output(AnswerWithCitations)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a domain expert answering questions based on the provided documents.
        You must only use the information given in the context.
        If the context does not contain the answer, say "I don't know based on the provided documents."
        
        Context format:
        <doc_id> | <document_content>
        
        {context}
        """),
        ("human", "{question}")
    ])

    def formatted_rag(question: str):
        retriever = get_retriever()
        docs = retriever.invoke(question)
        
        formatted_context = ""
        for d in docs:
            doc_id = d.metadata.get("doc_id", "unknown_id")
            formatted_context += f"{doc_id} | {d.page_content}\n\n"
            
        messages = prompt.format_messages(context=formatted_context, question=question)
        result = structured_llm.invoke(messages)
        
        return {
            "response": result,
            "retrieved_docs": docs
        }

    return formatted_rag

if __name__ == "__main__":
    if not os.environ.get("OPENAI_API_KEY"):
        print("Please set OPENAI_API_KEY to test the generation.")
    else:
        chain_fn = get_rag_chain()
        res = chain_fn("What is the company policy on paid leave?")
        print("\n=== Answer ===")
        print(res["response"].answer)
        print("\n=== Citations ===")
        print(res["response"].citations)
        print("\n=== Retrieved Context References ===")
        for d in res["retrieved_docs"]:
            print(f"- [{d.metadata.get('doc_id')}] {d.page_content}")
