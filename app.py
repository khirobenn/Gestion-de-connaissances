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

title_template = """
You are a conversation titler. Given the first exchange between a user and an AI assistant, produce a short, descriptive title for the conversation.

Rules:
- 3 to 7 words
- Sentence case (only first word and proper nouns capitalised)
- Specific and descriptive — not generic like "Question about X"
- No quotes, no punctuation at the end

User message:
{user_message}

AI answer:
{ai_answer}

Respond with the title only, nothing else.
"""

prompt = ChatPromptTemplate.from_template(template)
prompt_discussion = ChatPromptTemplate.from_template(context)
prompt_title = ChatPromptTemplate.from_template(title_template)

chain = prompt | model
context_discussion = prompt_discussion | model
title = prompt_title | model

# while True:
#     print("\n\n-----------------------------------")
#     question = input("Ask your question (q to quit): ")
#     if question == "q":
#         break
#     information = retriever.invoke(question)
#     res = chain.invoke({"information": information, "question": question})
#     print(res)
