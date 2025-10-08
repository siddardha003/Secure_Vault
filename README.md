# Secure Vault - Password Manager

A privacy-first password manager with client-side encryption, built with Next.js, Node.js, TypeScript, and MongoDB.

![Secure Vault](https://via.placeholder.com/800x400?text=Secure+Vault+Password+Manager)

## 🔒 Features

### Must-haves (✅ Completed)
- **Password Generator**: Customizable strong password generation with length slider, character type options, and exclude look-alikes
- **User Authentication**: Simple email + password authentication with JWT tokens
- **Secure Vault**: Store passwords with title, username, password, URL, and notes
- **Client-side Encryption**: All sensitive data is encrypted in the browser before reaching the server
- **Copy to Clipboard**: Auto-clearing clipboard functionality (clears after 15 seconds)
- **Search & Filter**: Real-time search through vault items

### Nice-to-haves (Future enhancements)
- 2FA (TOTP)
- Tags/folders organization
- Dark mode
- Export/import encrypted files

## 🛡️ Security

### Client-Side Encryption
We use **AES-256** encryption with **PBKDF2** key derivation for maximum security:

- **Algorithm**: AES-256-CBC for symmetric encryption
- **Key Derivation**: PBKDF2 with 100,000 iterations and SHA-256
- **Salt**: Unique per user, stored locally
- **IV**: Random initialization vector for each encryption operation
- **Library**: crypto-js for client-side cryptographic operations

**Why crypto-js?** We chose crypto-js because it's a well-established, widely-used JavaScript cryptography library that provides reliable AES encryption. It allows us to perform all encryption operations in the browser, ensuring that the server never sees plaintext passwords.

### Zero-Knowledge Architecture
- Server only stores encrypted data
- Passwords are encrypted/decrypted entirely in your browser
- Your master password is never sent to our servers
- We cannot recover your data if you forget your master password

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/msarayu20/Secure_Vault.git
   cd Secure_Vault
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create environment file
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or update the connection string in `backend/.env`

5. **Run the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

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

## 🧪 Testing

### Manual Testing Checklist
1. **Registration**: Create a new account
2. **Login**: Sign in with your credentials
3. **Password Generation**: Generate passwords with different options
4. **Add Vault Item**: Save a generated password
5. **Search**: Search for vault items
6. **Edit Item**: Modify an existing vault item
7. **Delete Item**: Remove a vault item
8. **Copy to Clipboard**: Test copy functionality and auto-clear
9. **Database Verification**: Check that only encrypted data is stored

### Security Validation
- Inspect network requests to ensure no plaintext passwords are transmitted
- Check MongoDB to verify all sensitive data is encrypted
- Test that forgotten master passwords cannot be recovered

## 🚀 Deployment

### Backend Deployment
1. Deploy to your preferred cloud platform (Heroku, Vercel, AWS, etc.)
2. Set up MongoDB Atlas or your preferred MongoDB hosting
3. Configure environment variables in your deployment platform
4. Update CORS settings for your frontend domain

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to your backend URL
2. Deploy to Vercel, Netlify, or your preferred platform
3. Ensure the backend URL is accessible from your frontend domain

## 🔐 Security Considerations

### In Production
- Use strong, unique JWT secrets
- Enable HTTPS everywhere
- Set up proper CORS policies
- Use environment variables for all secrets
- Implement rate limiting
- Consider adding additional security headers
- Set up monitoring and logging (without logging sensitive data)

### User Guidelines
- Choose a strong master password
- Don't share your master password
- Log out from shared devices
- Regularly update your vault items

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with security and privacy as top priorities
- Inspired by modern password managers like Bitwarden and 1Password
- Uses established cryptographic standards and libraries

## ⚠️ Disclaimer

While this application implements strong security measures, always use additional security practices:
- Regular backups of your data
- Two-factor authentication where possible
- Keep your devices and browsers updated
- Use this software at your own risk

---

**Built with ❤️ and 🔒 for your security and privacy.**