# Création d'environnement et activation:
- ### Linux:
`python3 -m venv env` puis
`source env/bin/activate`.
- ### Windows:
`python -m venv env` puis `env\Scripts\activate`

# Installation des dépendances:
Exécutez `pip install -r requirements` puis `cd website & npm install` 

# Configuration de la base de données Supabase
Avant de lancer le projet, vous devez configurer les tables suivantes dans votre projet Supabase (via l'éditeur SQL de Supabase ou l'interface Table Editor).

### Authentification des utilisateurs (`auth.users`)
Supabase gère nativement la création de comptes utilisateurs via son système d'authentification intégré. **Vous n'avez pas besoin de créer cette table manuellement**, elle est générée automatiquement par Supabase.

Pour l'activer, rendez-vous dans *Authentication > Providers* de votre projet Supabase et activez le provider **Email**. Les utilisateurs pourront ainsi s'inscrire et se connecter avec un email et un mot de passe. La table `auth.users` sera automatiquement alimentée à chaque création de compte.

> **Note :** La colonne `user_id` de la table `discussions` est une clé étrangère qui référence `auth.users.id`, ce qui permet de lier chaque discussion à son auteur.

### Table `discussions`
| Colonne | Type | Description |
|---|---|---|
| `id` | int8 | Clé primaire, auto-incrémentée |
| `user_id` | uuid | Clé étrangère vers `auth.users.id` |
| `created_at` | timestamptz | Date de création (par défaut `now()`) |
| `title` | varchar | Titre de la discussion |
| `discussion` | jsonb | Contenu de la discussion au format JSON |

### Table `posts`
| Colonne | Type | Description |
|---|---|---|
| `id` | int4 | Clé primaire, auto-incrémentée |
| `body` | text | Contenu textuel du post |
| `embedding` | vector | Vecteur d'embedding pour la recherche sémantique |

> **Note :** Le type `vector` nécessite d'activer l'extension **pgvector** dans Supabase. Rendez-vous dans *Database > Extensions* et activez `vector`.

Vous pouvez créer ces tables en exécutant le SQL suivant dans l'éditeur SQL de Supabase :

```sql
-- Activer l'extension pgvector
create extension if not exists vector;

-- Table discussions
create table discussions (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  title varchar,
  discussion jsonb
);

-- Table posts
create table posts (
  id int4 primary key generated always as identity,
  body text,
  embedding vector
);
```

**N'oubliez pas de rajouter vos embeddings après la création des tables dans la base de données.**

# Export des variables de votre base de données SUPABASE et de votre Clé API Groq
Exportez vos variables `SUPABASE_URL`, `SUPABASE_KEY` et `GROQ_API_KEY`. L'export se fait dans la ligne de commande de cette façon: `export nom_de_variable=valeur_de_la_variable`.

Ensuite, vous devez créer dans le dossier `website` un fichier `.env` qui contient les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`. Notez que `VITE_SUPABASE_URL` a la même valeur que `SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` a la même valeur que `SUPABASE_KEY`.

# Lancer le site:
- ### Linux:
Lancez l'api avec `python3 api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
- ### Windows:
Lancez l'api avec `python api.py`. On ouvre une autre ligne de commande et on fait `cd website & npm run dev`
