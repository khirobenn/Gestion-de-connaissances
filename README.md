# Création d'environnement et activation:
- ### Linux:
`python3 -m venv env` puis
`source env/bin/activate`.
- ### Windows:
`python -m venv env` puis `env\Scripts\activate`

# Installation des dépendances:
Exécutez `pip install -r requirements` puis `cd website & npm install` 

# Export des variables
Exportez vos variables `SUPABASE_URL`, `SUPABASE_KEY` et `GROQ_API_KEY`. L'export se fait dans la ligne de commande de cette façon: `export nom_de_variable=valeur_de_la_variable`.

# Lancer le site:
- ### Linux:
Lancez l'api avec `python3 api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
- ### Windows:
Lancez l'api avec `python api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
