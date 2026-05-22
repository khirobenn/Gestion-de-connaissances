# Création d'environnement et activation:
- ### Linux:
`python3 -m venv env` puis
`source env/bin/activate`.
- ### Windows:
`python -m venv env` puis `env\Scripts\activate`

# Installation des dépendances:
Exécutez `pip install -r requirements` puis `cd website & npm install` 

# Export des variables de votre base de données SUPABASE et de votre Clé API Groq
Exportez vos variables `SUPABASE_URL`, `SUPABASE_KEY` et `GROQ_API_KEY`. L'export se fait dans la ligne de commande de cette façon: `export nom_de_variable=valeur_de_la_variable`.

Ensuite, vous devez créer dans le dossier `website` un fichier `.env` qui contient les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Notez que `VITE_SUPABASE_URL` a la même valeur que `SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` a la même valeur que `SUPABASE_KEY`.

# Lancer le site:
- ### Linux:
Lancez l'api avec `python3 api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
- ### Windows:
Lancez l'api avec `python api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
