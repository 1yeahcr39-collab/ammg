# Authentication System Documentation

## Overview
MinuteMinds now includes a complete professional authentication system with:
- User registration with password validation
- Secure login with JWT tokens
- Protected routes (PrivateRoute)
- Session management
- User-specific transcription history

---

## 📋 User Stories Implemented

### User Story 1: User Registration
**As a** new user  
**I want to** register with my email and password  
**So that** I can create an account and access the platform

**Features:**
- Name, email, and password fields
- Password strength validation (min 6 characters)
- Password confirmation matching
- Email uniqueness checking
- Bcrypt password hashing
- Automatic redirect to login after successful registration

**Backend Endpoint:** `POST /register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

---

### User Story 2: User Login
**As a** registered user  
**I want to** login with my email and password  
**So that** I can access my transcriptions and tools

**Features:**
- Email and password verification
- Secure password comparison with bcrypt
- JWT token generation (24-hour expiry)
- Automatic login state management
- Token storage in localStorage
- Automatic redirect to dashboard

**Backend Endpoint:** `POST /login`
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### User Story 3: Protected Transcription
**As a** logged-in user  
**I want to** upload and transcribe audio files  
**So that** my transcriptions are saved to my personal account

**Features:**
- Token-based authentication
- User-specific transcription storage
- Transcriptions linked to user ID
- Created timestamp tracking

**Backend Endpoint:** `POST /transcribe`
```
Headers: Authorization: Bearer {token}
Body: multipart/form-data (audio file)
```

---

### User Story 4: Session Management
**As a** logged-in user  
**I want to** maintain my session across page reloads  
**So that** I don't need to login repeatedly

**Features:**
- Token persistence in localStorage
- Automatic token verification on app load
- Session timeout handling
- Logout functionality

**Backend Endpoint:** `POST /verify-token`
```json
{
  "token": "eyJhbGc..."
}
```

---

### User Story 5: View Transcription History
**As a** logged-in user  
**I want to** see all my past transcriptions  
**So that** I can retrieve and review previous meeting minutes

**Features:**
- User-specific transcription retrieval
- Timestamp display
- Filename and preview display
- Sorted by creation date

**Backend Endpoint:** `GET /transcriptions`
```
Headers: Authorization: Bearer {token}
```

---

### User Story 6: Logout
**As a** logged-in user  
**I want to** logout securely  
**So that** my session ends and my account is protected

**Features:**
- Token removal from storage
- Context state reset
- Automatic redirect to login
- Session cleanup

---

## 🏗️ Architecture

### Frontend Structure
```
frontend/src/
├── context/
│   └── AuthContext.js          # Global auth state management
├── components/
│   └── PrivateRoute.js         # Protected route wrapper
├── pages/
│   ├── Login.js                # Login page
│   ├── Register.js             # Registration page
│   ├── Dashboard.js            # Main app (transcription)
│   ├── Auth.css                # Auth pages styling
│   └── Dashboard.css           # Dashboard styling
└── App.js                      # Main router setup
```

### Backend Structure
```
backend/
├── app.py                      # Flask app with auth endpoints
├── requirements.txt            # Dependencies (JWT, bcrypt)
└── .env.example               # Environment variables template
```

---

## 🔐 Security Features

### Password Security
- **Bcrypt Hashing:** Passwords are hashed with bcrypt (salt rounds: 10)
- **Minimum Length:** 6 characters enforced
- **No Plain Text:** Passwords never stored or logged in plain text

### Token Security
- **JWT (JSON Web Tokens):** Signed with SECRET_KEY
- **Token Expiry:** 24-hour expiration
- **Algorithm:** HS256
- **Bearer Token:** Sent in Authorization header

### Database Security
- **Unique Emails:** Email uniqueness enforced at DB level
- **User Isolation:** Users can only access their own data
- **Validation:** All inputs validated before database operations

---

## 📱 User Flows

### Registration Flow
```
User → Register Page
       ↓
  Fill Form
       ↓
  Validation (client + server)
       ↓
  Hash Password (bcrypt)
       ↓
  Store in MongoDB
       ↓
  Redirect to Login
```

### Login Flow
```
User → Login Page
       ↓
  Enter Credentials
       ↓
  Verify Email Exists
       ↓
  Verify Password Match
       ↓
  Generate JWT Token
       ↓
  Store Token in localStorage
       ↓
  Redirect to Dashboard
```

### Protected Access Flow
```
User Access → Check Token
              ↓
          Token Valid? → Yes → Grant Access
              ↓
              No → Redirect to Login
```

---

## 🚀 Running the System

### Prerequisites
```bash
# Install Python packages
cd backend
pip install -r requirements.txt

# Install Node packages
cd ../frontend
npm install
```

### Start Services

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

**Terminal 3 - MongoDB:**
```bash
mongod
```

---

## 📝 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | No | Create new user account |
| POST | `/login` | No | Login and get JWT token |
| POST | `/verify-token` | No | Verify token validity |
| POST | `/transcribe` | Yes | Upload and transcribe audio |
| POST | `/translate` | Yes | Translate text |
| GET | `/transcriptions` | Yes | Get user's transcriptions |
| GET | `/` | No | Health check |

---

## 🔄 Context API Usage

### useAuth Hook
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  
  // Use auth state and methods
}
```

### Available Methods
- `register(name, email, password)` - Create new account
- `login(email, password)` - Login user
- `logout()` - Clear session
- `verifyToken()` - Check token validity

### Available State
- `user` - Current user object
- `token` - JWT token
- `loading` - Loading state
- `error` - Error messages
- `isAuthenticated` - Boolean auth status

---

## 🐛 Error Handling

### Frontend Error Handling
- Email validation (format + existence)
- Password validation (length + match)
- Network error handling
- Token expiry handling
- Automatic redirect on auth failure

### Backend Error Handling
- Input validation
- Duplicate email checking
- Invalid credentials
- Expired/invalid tokens
- Database connection errors

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Transcriptions Collection
```javascript
{
  _id: ObjectId,
  user_id: String (reference to Users._id),
  filename: String,
  transcription: String,
  created_at: DateTime
}
```

---

## 🎯 Best Practices Implemented

✅ **Security:**
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation

✅ **Code Quality:**
- Modular component structure
- Reusable AuthContext
- Custom useAuth hook
- Error boundary patterns

✅ **UX:**
- Clear error messages
- Loading states
- Responsive design
- Smooth animations

✅ **Performance:**
- Token caching
- Lazy loading
- Efficient API calls
- Optimized re-renders

---

## 📚 References

- [JWT.io](https://jwt.io) - JWT documentation
- [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [Flask-CORS](https://flask-cors.readthedocs.io) - CORS support
- [React Router](https://reactrouter.com) - Routing

---

## 🔧 Troubleshooting

### Token Expired
- **Issue:** User logout after 24 hours
- **Solution:** Implement token refresh mechanism

### CORS Errors
- **Issue:** Cannot access backend from frontend
- **Solution:** Ensure backend proxy is set in package.json

### MongoDB Connection
- **Issue:** Cannot connect to database
- **Solution:** Ensure MongoDB is running and URL is correct

### Password Hash Mismatch
- **Issue:** Login fails with correct password
- **Solution:** Ensure bcrypt library is installed on both ends

---

**System Last Updated:** November 16, 2025
**Status:** Production Ready ✅
