from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd

df = pd.read_csv("champions-league-2025-UTC.csv")
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db_location = "./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []

    for i, row in df.iterrows():
        home_score = ""
        away_score = ""
        scores = str(row["Result"]).split("-")
        if len(scores) == 2:
            home_score = scores[0].strip()
            away_score = scores[1].strip()
        
        info = "Date: " + str(row["Date"]) + ", " + "Location: " + str(row["Location"]) + ", " + str(row["Home Team"]) + " " + home_score + " - " + away_score + " " + str(row["Away Team"])
        print(info)
        document = Document(
            page_content=info,
            id=str(i)
        )
        documents.append(document)
        ids.append(str(i))

vector_store = Chroma(
    collection_name="scores",
    persist_directory=db_location,
    embedding_function=embeddings
)

if add_documents:
    vector_store.add_documents(documents=documents, ids=ids)

retriever = vector_store.as_retriever(
    search_kwargs={"k":3},
)