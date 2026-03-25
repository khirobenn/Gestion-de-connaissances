from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever

model = OllamaLLM(model="gemma3:27b-cloud", streaming=True)

template = """
You are an expert in answering questions about football

Here are some information about what happened in champions league 2025/2026: {information}

Here is the question to answer: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

chain = prompt | model

# while True:
#     print("\n\n-----------------------------------")
#     question = input("Ask your question (q to quit): ")
#     if question == "q":
#         break
#     information = retriever.invoke(question)
#     res = chain.invoke({"information": information, "question": question})
#     print(res)
