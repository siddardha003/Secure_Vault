# 🔒 Secure Vault



Your Digital Vault, Secured Forever - A privacy-first password manager with client-side encryption!!
Secure Vault is a modern, privacy-first password manager to provide users with a secure and intuitive way to manage their digital credentials. Secure Vault is designed as a zero-knowledge password manager that prioritizes user privacy and data security.


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
