from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd
import requests

match_scores = requests.get('https://fixturedownload.com/feed/json/champions-league-2025')
df = pd.DataFrame(match_scores.json())

embeddings = OllamaEmbeddings(model="embeddinggemma")

db_location = "./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []

    for i, row in df.iterrows():
        home_score = int(row["HomeTeamScore"])
        away_score = int(row["AwayTeamScore"])

        verb = "drew"

        if home_score > away_score:
            verb = "won"
        elif away_score > home_score:
            verb = "lost"
        
        info = f"In the round {row["RoundNumber"]} of champions league 2025/2026, {row["HomeTeam"]} {verb} against {row["AwayTeam"]} with a score : {home_score} - {away_score}. The match was played on {row["DateUtc"]} at the {row["HomeTeam"]}'s stadium called {row["Location"]}."
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
    print("\nEmbedding..")
    vector_store.add_documents(documents=documents, ids=ids)
    print("Finished ;)")

retriever = vector_store.as_retriever(
    search_kwargs={"k":3},
)