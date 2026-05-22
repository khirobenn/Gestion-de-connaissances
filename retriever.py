import os
from langchain_core.documents import Document
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

class Retriever(): #class comme strcuture en C
    def __init__(self): #self c est l objet lui mm 
        #automatoquement ce code s execute (def init) avec class, on peut rajouter des attriuts aussi ()
        #init est un constructeur où on crée kes attributs supbase et embedding_model
        url: str = os.environ.get("SUPABASE_URL") #récupère l'url et la cle
        key: str = os.environ.get("SUPABASE_KEY")
        self.supabase : Client = create_client(url, key) 
        #self.qqch: permet de créer attribut pour cette classe , creat_client(...) permet de connecter le client a la base de données(serveur) qu on met dans l attribut supabase
        self.embedding_model = SentenceTransformer('Supabase/gte-small') #on recupère modèle embedding = qui prend cdr et le transforme en vecteur 

     #permet de récupérer le id et body de chaque elmt dans la base des données qu on a 
    def invoke(self, sentence:str, threeshold=0.8, count=10) -> list[Document]: #sentence: phrase avec laquelle je cherche dans la base des données
        #threeshold: teta, count: nbre d elets max a prendre de la base
        sentence_embedding = self.embedding_model.encode([sentence])[0].tolist() #je transforme la phrase en vecteurs
        parameters = {
            "query_embedding" : sentence_embedding, #il a le vecteur 
            "match_threshold" : threeshold,
            "match_count" : count 
        } #paramètres que je donne a ma base de données
        response = (
            self.supabase.rpc("match_documents", parameters) 
            #lien client serveur : je donne paramètres que je viens de faire, et fais le lien avec la base des données en appliquant le cosinus pr y récupérer ce qui ressemble de la base des données
            .execute()
        ) #résultat = tableau où on a data (id,body,vecteur)
        documents = [Document(page_content=doc["body"], id=doc["id"]) for doc in response.data]
        return documents

retriever = Retriever()
#cette variable a des attributs
#si on fait un def create(self):...
#et bah si on fait tot.create() ça rajoute des attributs uniquement au type toto pas autre chose
