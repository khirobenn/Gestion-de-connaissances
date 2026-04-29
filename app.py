from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever
model = OllamaLLM(model="gemma3:27b-cloud", streaming=True)

template = """
You are an expert in answering questions about champions league 2025/2026. If the question isn't about champions league, don't answer.

Here are some information about what happened in champions league 2025/2026: {information}

{previous_discussion}

Here is the question to answer: {question}
"""

context = """
You are a query reformulation assistant.
Your only job is to read a conversation history (a series of Q&A exchanges) and a new follow-up question, then output the standalone, self-contained question that captures the user's real intent, with all necessary context resolved from the history.

Rules:
- Resolve all pronouns and references (e.g. "it", "that", "this", "the same one")
- Include all context needed to answer the question without looking at the history
- Output ONLY the reformulated question, no explanation, no preamble
- If the question is already fully self-contained, return it as-is

Q&A exchanges : 
{discussion}.

And this is the last question of the user: {last_question}.
"""

prompt = ChatPromptTemplate.from_template(template)
prompt_discussion = ChatPromptTemplate.from_template(context)

chain = prompt | model
context_discussion = prompt_discussion | model

# while True:
#     print("\n\n-----------------------------------")
#     question = input("Ask your question (q to quit): ")
#     if question == "q":
#         break
#     information = retriever.invoke(question)
#     res = chain.invoke({"information": information, "question": question})
#     print(res)
