from langchain_core.prompts import ChatPromptTemplate #pr avoir les variables template = """...
from langchain_groq import ChatGroq #pour avoir des modèles de api, LLM (different de ollama)
model = ChatGroq(model="llama-3.3-70b-versatile", streaming=True)

template = """
You are an expert in answering questions about champions league 2025/2026. If the question isn't about champions league, don't answer.

Here are some information about what happened in champions league 2025/2026: {information}

{previous_discussion}

Here is the question to answer: {question}
"""
#a template pon donne les variables {}

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
#pareil pour context on a les variables {}

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

prompt = ChatPromptTemplate.from_template(template) #premier prompt = template --> chammpionsleague
prompt_discussion = ChatPromptTemplate.from_template(context) #reformuler la question a partir de la discussion d avant (par rapport a la question d avant) et la dernière question posée
prompt_title = ChatPromptTemplate.from_template(title_template) #titre pour la discussion 

#objets du llm
chain = prompt | model
context_discussion = prompt_discussion | model
title = prompt_title | model
#sortie de la commande de gauche est l'entrée de droite
