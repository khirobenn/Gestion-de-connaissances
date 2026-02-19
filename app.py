from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

model = OllamaLLM(model="llama3.2")

template = """
You are an expert in answering questions about football

Here are some information about what happened today in champions league: {information}

Here is the question to answer: {question}
"""

prompt = ChatPromptTemplate.from_template(template)

chain = prompt | model

res = chain.invoke({"information": [], "question": "Which club has the most champions league in history ?"})
print(res)