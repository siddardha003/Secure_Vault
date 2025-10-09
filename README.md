# 🔒 Secure Vault



Your Digital Vault, Secured Forever - A privacy-first password manager with client-side encryption



## What I used for crypto and why?



I Have Used "Crypto-js library" for client-side AES-256-CBC encryption ensuring passwords are encrypted in your browser before reaching the server. This guarantees zero-knowledge architecture where we never see your data in plaintext.



## 🚀 Quick Start

### Clone repository

```bash

git clone https://github.com/siddardha003/Secure_Vault.git

cd Secure_Vault

```

### Backend setup

```bash

cd backend

npm install

npm run dev

```

### Frontend setup

```bash

cd ../frontend

npm install

npm run dev

``````

Visit `http://localhost:3000` to access the application.



## ✨ Features

- **🔑 Password Generator**: Customizable strong password generation with length slider and character options.

- **🔐 Secure Vault**: Store passwords with title, username, URL, and notes.

- **👤 User Authentication**: Email + password authentication with JWT tokens.

- **📋 Smart Clipboard**: Auto-clearing clipboard functionality (15-second timer).

- **🔍 Search & Filter**: Real-time search through vault items.

- **🎨 Dark Mode**: Theme toggle for comfortable viewing.



## 📁 Project Structure

```
Secure_Vault/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── models/         # MongoDB models (User, VaultItem)
│   │   ├── routes/         # API routes (auth, vault)
│   │   ├── middleware/     # Authentication middleware
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   └── vault/     # Main vault page
│   │   ├── components/    # React components
│   │   │   ├── PasswordGenerator.tsx
│   │   │   ├── VaultItem.tsx
│   │   │   └── VaultForm.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   └── utils/         # Utilities
│   │       ├── encryption.ts  # Client-side encryption
│   │       └── api.ts         # API client
│   ├── .env.local         # Environment variables
│   └── package.json
│
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/secure_vault
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```


## 🤝 Development

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Encryption**: crypto-js (AES-256 + PBKDF2)
- **Authentication**: JWT tokens

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Proper error handling throughout
- Client-side validation
- Secure coding practices
