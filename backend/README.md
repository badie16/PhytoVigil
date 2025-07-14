# 🌿 PhytoVigil Backend

Backend for the **PhytoVigil** application, developed with **FastAPI**, featuring:

- 🔐 Secure JWT authentication
- 👤 User management with roles (`user`, `admin`)
- 🧠 AI module for plant disease detection (TensorFlow)
- 🗃️ PostgreSQL database (via SQLAlchemy)
- 📦 RESTful API with auto-generated Swagger documentation
- 🔄 Local storage and synchronization support
- 🤖 Integration with an AI API (e.g., Gemini API) to provide additional information and solutions for detected diseases

## ⚙️ Technologies Used

- FastAPI
- SQLAlchemy
- TensorFlow
- Pydantic
- PostgreSQL
- Python-JOSE
- Uvicorn

## 🚀 Running the Project Locally

### 1. Clone the project

```bash
git clone https://github.com/badie16/PhytoVigil.git
cd PhytoVigil/backend
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/Scripts/activate        # Windows (Git Bash)
# or
source venv/bin/activate            # Linux/macOS
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the database

Create a .env file in the /backend/ directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/phytovigil
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 5. Launch the API

```bash
uvicorn app.main:app --reload
```

Access auto-generated documentation:
- Swagger UI : http://127.0.0.1:8000/docs
- Redoc : http://127.0.0.1:8000/redoc

## 🧠 AI Module

The AI model is located in:

```
/app/ml/
├── model.h5         ← Trained TensorFlow model
├── class.json       ← ID to disease name mapping
└── diagnosis.py     ← Prediction code
```
## 🤖 Gemini Integration
The backend queries the Gemini API to provide users with detailed information and natural solutions for detected diseases,
enhancing user experience with dynamic, tailored content.
## 📦 Project Structure
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

## 📝 License

This project is licensed under Apache 2.0 - see the LICENSE file.

## 👨‍💻 Author

**Badie Bahida** – [@badie16](https://github.com/badie16)   
2025 Internship – Project: 🌿 *PhytoVigil*
