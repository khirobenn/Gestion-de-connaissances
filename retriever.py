import os
from langchain_core.documents import Document
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

class Retriever():
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        self.supabase : Client = create_client(url, key)
        self.embedding_model = SentenceTransformer('Supabase/gte-small')

    def invoke(self, sentence:str, threshold=0.8, count=10) -> list[Document]:
        sentence_embedding = self.embedding_model.encode([sentence])[0].tolist()
        parameters = {
            "query_embedding" : sentence_embedding,
            "match_threshold" : threshold,
            "match_count" : count 
        }
        response = (
            self.supabase.rpc("match_documents", parameters)
            .execute()
        )
        documents = [Document(page_content=doc["body"], id=doc["id"]) for doc in response.data]
        return documents

retriever = Retriever()
