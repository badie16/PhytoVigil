# 🌿 PhytoVigil Mobile

Mobile application for **PhytoVigil**, developed with **React Native (Expo)**.  
It allows users to:

- Capture or import a leaf photo
- Identify the plant disease using the AI module (via API)
- View recommendations (OpenAI)
- View the analysis history (even offline)
- Receive notifications (e.g.: critical diseases)


## ⚙️ Technologies Used

- React Native + Expo SDK
- AsyncStorage (local storage)
- SQLite (local history)
- Axios (connection to FastAPI API)
- React Navigation
- Tailwind (via NativeWind)
- Expo Notifications


## 🚀 Launch the Application

### 1. Go to the folder

```bash
cd PhytoVigil/mobile
```

### 2. Install dependencies

```bash
npm install
npx expo install
```

### 3. Start the application

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

## 📦 Folder Structure

```
/mobile
├── App/
│   └── index.tsx      
│   └── tabs/          # Pages: Home, scanner, account, History...    
├── components/        # Reusable UI
├── services/          # API calls (auth, analysis, user)
├── storage/           # SQLite & AsyncStorage management
└── utils/             # Utility functions (formatting, date...)    
├── assets/            # Images, icons, style
├── tailwibd.config.js
├── App.json
└── README.md
```


## 🔄 Offline Features

- Analysis history stored locally (SQLite)
- Store results if the user is offline
- Automatic synchronization as soon as a connection is restored


## 📝 License

This project is under the **Apache 2.0** license.


## 👨‍💻 Author

**Badie Bahida** – [@badie16](https://github.com/badie16)   
2025 Internship – Project: 🌿 *PhytoVigil*