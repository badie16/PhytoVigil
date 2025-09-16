# 🌱 PhytoVigil Web Admin

This is the **web admin interface** for the PhytoVigil project. It allows administrators to manage plant diseases, users, and view analytics via a modern web dashboard.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **Auth:** JWT (via backend API)
- **State/Utils:** React hooks

---

## 🛠️ Setup & Development

### 1. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Authentication (if needed)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```graph
web/
├── app/                   # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── dashboard/     # Main dashboard
│   │   ├── users/         # User management
│   │   ├── diseases/      # Disease management
│   │   ├── scans/         # Plant scan management
│   │   ├── ai-model/      # AI model management
│   │   ├── gemini/        # Gemini AI integration
│   │   ├── mobile-config/ # Mobile app configuration
│   │   └── settings/      # System settings
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API client configuration
│   ├── api-config.ts     # API endpoints
│   └── utils.ts          # Utility functions
├── services/             # API service layers
└── types/                # TypeScript type definitions
```

---

## 🎯 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Secure admin login

### 📊 Dashboard
- Real-time analytics
- User statistics
- Disease detection metrics
- System health monitoring

### 👥 User Management
- User CRUD operations
- User activity tracking
- Role management
- Export functionality

### 🦠 Disease Management
- Disease database management
- Treatment generation with AI
- Image upload and processing
- Disease statistics

### 📱 Plant Scan Management
- Scan validation
- AI prediction results
- Scan history tracking
- Export capabilities

### 🤖 AI Model Management
- Model performance metrics
- Retraining capabilities
- Prediction accuracy tracking
- Model updates

### 🔧 System Configuration
- Mobile app configuration
- Notification settings
- System backup/export
- Environment management

---

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## 🔧 Configuration

### API Configuration
The application uses a centralized API configuration in `lib/api-config.ts`:

- **Base URL**: Configurable via environment variables
- **Endpoints**: All API endpoints are centrally defined
- **Timeout**: 30 seconds default
- **Retry Logic**: 3 attempts with 1-second delay

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_WS_URL`: WebSocket URL for real-time updates

---

## 🎨 UI Components

This project uses **shadcn/ui** components built on top of:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Key Components
- Data tables with sorting and filtering
- Form components with validation
- Charts and analytics widgets
- Modal dialogs and alerts
- Navigation and layout components

---

## 📱 Mobile Integration

The web admin integrates with the PhytoVigil mobile app through:
- **Mobile Configuration**: Manage app settings remotely
- **Push Notifications**: Configure notification templates
- **Content Management**: Update app content and tips
- **Deployment**: Deploy configuration changes

---

## 🔒 Security

- JWT token-based authentication
- Role-based access control
- Secure API communication
- Input validation and sanitization
- CSRF protection

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build Docker image
docker build -t phytovigil-web .

# Run container
docker run -p 3000:3000 phytovigil-web
```

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `.next` folder to your server
3. Install dependencies: `npm install --production`
4. Start the server: `npm run start`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Contact the development team

---

## 🔗 Related Projects

- [PhytoVigil Backend](../backend/) - Python FastAPI backend
- [PhytoVigil Mobile](../mobile/) - React Native mobile app




