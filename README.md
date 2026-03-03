# Création d'environnement et activation:
- ### Linux:
`python3 -m venv env` puis
`source env/bin/activate`.
- ### Windows:
`python -m venv env` puis `env\Scripts\activate`

# Installation des dépendances:
`pip install -r requirements`

# Installation des modèles utilisés:
- `ollama pull embeddinggemma`
- `ollama pull gemma3:27b-cloud`

# Lancer l'App:
- ### Linux:
`python3 app.py`
- ### Windows:
`python app.py`
