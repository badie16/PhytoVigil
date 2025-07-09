
# 🌿 PhytoVigil – AI-Powered Plant Disease Detection

**PhytoVigil** is a mobile application built with **React Native** and powered by **AI**, designed to help farmers and gardeners detect plant diseases simply by taking a photo of a leaf.

<!-- <img src="./assets/logo.png" width="200" alt="PhytoVigil logo" /> -->



## 📱 Features

- 📷 Scan plant leaves using the camera
- 🤖 Detect diseases using a trained CNN model (PlantVillage dataset)
- 🧠 Display diagnosis with confidence level and treatment suggestions
- 📍 Save analysis history (with optional location)
- 🔐 Secure local storage using Expo SecureStore
- 🌱 Offline access to a disease guide



## 🛠️ Technologies

| Frontend (Mobile)       | Backend (AI Model)             |
|--------------------------|-------------------------------|
| React Native (Expo)      | Python (Flask or FastAPI)      |
| Tailwind CSS (NativeWind)| TensorFlow / PyTorch (CNN)    |
| Axios                    | OpenCV + Pillow (image preprocessing) |
| Expo Camera / Media Lib  | PlantVillage Dataset           |
| AsyncStorage / SecureStore| Railway / Render (API hosting) |



## 📁 Project Structure (Frontend)

```
PhytoVigil/
├── App.tsx
├── assets/
├── components/
├── screens/
├── services/
├── tailwind.config.js
└── README.md
```



## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/badie16/PhytoVigil.git
cd phyto-vigil
```

### 2. Install dependencies

```bash
npm install
npx expo install
```

### 3. Run the project

```bash
npx expo start
```



## 🧠 AI Model (Backend)

The AI model is trained on the [PlantVillage dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) using a CNN architecture.

### Backend repository:  
[🔗 Backend repo (Flask API)](https://github.com/badie16/PhytoVigilAPI.git)



## 🚀 Deployment

- 📱 App built with [Expo Go](https://expo.dev)
- 🌐 API hosted on [Railway](https://railway.app) or [Render](https://render.com)
- 🔐 HTTPS communication with API tokens 



## 📜 License
This project is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE) file for details.



## 👨‍💻 Author

**Badie Bahida** – [@badiebahida](https://github.com/badie16)  
