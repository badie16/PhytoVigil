# 🌱 PhytoVigil – Intelligent Plant Disease Detection

**PhytoVigil** is a full-stack solution (mobile + web + backend) that helps farmers, gardeners, and plant enthusiasts identify plant diseases using artificial intelligence and receive recommendations or natural treatments.

---

## 📱 Project Components
```
/PhytoVigil
├── backend/       # API FastAPI + IA + PostgreSQL
├── mobile/        # Application mobile (React Native)
├── web/           # Interface admin web (Next.js)
├── docs/          # Documentation and diagrams
└── README.md      
└── LICENSE
```
## 🧠 Key Features

- 📸 Detect plant disease from a leaf photo (mobile)
- 🤖 Predict disease using a trained CNN (TensorFlow)
- 🔐 Secure authentication with user/admin roles
- 🌾 Receive natural solutions & extra info via Gemini 
- 📦 Local storage (SQLite + AsyncStorage) + cloud sync
- 💻 Admin web interface to manage diseases, users, etc.

## 🔧 Technologies Used

| Layer        | Main Techs |
|--------------|------------|
| Mobile       | React Native, Expo, AsyncStorage |
| Backend      | FastAPI, PostgreSQL, TensorFlow, JWT |
| Web (admin)  | Next.js, Tailwind CSS |
| AI Model     | CNN (`.h5` model), OpenCV, Gemini API |

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/badie16/PhytoVigil.git
cd phyto-vigil
```
### 2. Run the Project
Refer to the README in each subfolder:
- [`/backend/README.md`](./backend/README.md)
- [`/mobile/README.md`](./mobile/README.md)
- [`/web/README.md`](./web/README.md)


## 📜 License
This project is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE) file for details.



## 👨‍💻 Author

**Badie Bahida** – [@badie16](https://github.com/badie16)   
2025 Internship – Project: 🌿 *PhytoVigil*