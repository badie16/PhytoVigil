# 🌿 PhytoVigil Backend

Backend de l'application **PhytoVigil**, développé avec **FastAPI**, intégrant :

- 🔐 Authentification sécurisée par JWT
- 👤 Gestion des utilisateurs avec rôles (`user`, `admin`)
- 🧠 Module IA de détection de maladies des plantes (TensorFlow)
- 🗃️ Base de données PostgreSQL (via SQLAlchemy)
- 📦 API RESTful avec documentation Swagger auto
- 🔄 Support du stockage local et de la synchronisation
## ⚙️ Technologies utilisées

- FastAPI
- SQLAlchemy
- TensorFlow
- Pydantic
- PostgreSQL
- Python-JOSE
- Uvicorn

## 🚀 Lancer le projet en local

### 1. Cloner le projet

```bash
git clone https://github.com/badie16/PhytoVigil.git
cd PhytoVigil/backend
```

### 2. Créer et activer un environnement virtuel

```bash
python -m venv venv
source venv/Scripts/activate        # Windows (Git Bash)
# ou
source venv/bin/activate            # Linux / macOS
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer la base de données

Créer un fichier `.env` dans le dossier `/backend/` :

```env
DATABASE_URL=postgresql://username:password@localhost:5432/phytovigil
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 5. Lancer l’API

```bash
uvicorn app.main:app --reload
```

Accéder à la documentation automatique :
- Swagger UI : http://127.0.0.1:8000/docs
- Redoc : http://127.0.0.1:8000/redoc

## 🧠 Module IA

Le modèle d’intelligence artificielle est situé dans :

```
/app/ml/
├── model.h5         ← Modèle TensorFlow entraîné
├── class.json       ← Mapping ID → nom des maladies
└── diagnosis.py     ← Code de prédiction
```

## 📦 Structure du projet
```
/backend
├── app/
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── crud/
│   ├── core/
│   ├── ml/
│   └── utils/
├── notebooks/
├── requirements.txt
├── .env
└── README.md
```

## 📝 Licence

Ce projet est sous licence **Apache 2.0** — voir le fichier `LICENSE`.

## 👤 Auteur

**Badie Bahida**  
