from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
import os

class QualityScore(BaseModel):
    score: float = Field(description="Score between 0.0 and 1.0")
    reasoning: str = Field(description="Brief explanation for the score")

def get_judge_llm():
    return ChatOpenAI(model="gpt-4o-mini", temperature=0)

def evaluate_faithfulness(question: str, answer: str, context: str) -> QualityScore:
    """Evaluate if the answer is faithful to the provided context."""
    judge = get_judge_llm().with_structured_output(QualityScore)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a grader evaluating if an AI's answer is faithful to the provided context.
        Score 1.0 if the answer is entirely supported by the context.
        Score 0.0 if the answer contains hallucinations or info not in the context.
        Partial scores are allowed for partial support.
        """),
        ("human", f"Context: {context}\n\nQuestion: {question}\n\nAnswer: {answer}")
    ])
    
    try:
        return judge.invoke(prompt.format_messages())
    except Exception as e:
        return QualityScore(score=0.0, reasoning=f"Evaluation failed: {str(e)}")

def evaluate_relevancy(question: str, answer: str) -> QualityScore:
    """Evaluate if the answer is relevant to the question."""
    judge = get_judge_llm().with_structured_output(QualityScore)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "Evaluate on a scale of 0.0 to 1.0 how relevant the answer is to the question."),
        ("human", f"Question: {question}\n\nAnswer: {answer}")
    ])
    
    try:
        return judge.invoke(prompt.format_messages())
    except Exception as e:
        return QualityScore(score=0.0, reasoning=f"Evaluation failed: {str(e)}")
