# 🏗️ Architecture & Local Setup Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL COMPUTER                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐        ┌──────────────────────┐    │
│  │  FRONTEND (React) │        │   BACKEND (Flask)    │    │
│  ├───────────────────┤        ├──────────────────────┤    │
│  │ http://localhost  │        │ http://localhost:    │    │
│  │      :3000        │◄──────►│      5000            │    │
│  │                   │ HTTP   │                      │    │
│  │ • Login/Register  │ API    │ • Authentication     │    │
│  │ • Dashboard       │ Calls  │ • Transcription      │    │
│  │ • Upload Audio    │        │ • Summarization      │    │
│  │ • View Results    │        │ • Export DOCX        │    │
│  │ • Admin Panel     │        │ • Admin Routes       │    │
│  │                   │        │ • Logs & Analytics   │    │
│  └───────────────────┘        └──────────────────────┘    │
│           │                              │                 │
│           │                              │                 │
│           └──────────────┬───────────────┘                 │
│                          │ (pymongo)                       │
│                          ▼                                 │
│                   ┌──────────────────┐                     │
│                   │   MONGODB        │                     │
│                   ├──────────────────┤                     │
│                   │ localhost:27017  │                     │
│                   │                  │                     │
│                   │ Collections:     │                     │
│                   │ • users          │                     │
│                   │ • transcriptions │                     │
│                   │ • logs           │                     │
│                   │ • analytics      │                     │
│                   └──────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Terminal Setup (Multiple Windows)

```
┌──────────────────────────────────────────────────────────────┐
│  Your Computer - 3-4 Terminal Windows Open                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ╔─ Terminal 1 ─────────────────────────────────────────╗   │
│ ║ Command: mongod                                       ║   │
│ ║ Output: MongoDB is listening on port 27017            ║   │
│ ║ Status: ▶ RUNNING                                     ║   │
│ ║ Action: Keep this window open                         ║   │
│ ╚───────────────────────────────────────────────────────╝   │
│                                                              │
│ ╔─ Terminal 2 ─────────────────────────────────────────╗   │
│ ║ cd backend                                            ║   │
│ ║ source venv/bin/activate                             ║   │
│ ║ python app.py                                         ║   │
│ ║ Output: Running on http://127.0.0.1:5000            ║   │
│ ║ Status: ▶ RUNNING                                     ║   │
│ ║ Action: Keep this window open                         ║   │
│ ╚───────────────────────────────────────────────────────╝   │
│                                                              │
│ ╔─ Terminal 3 ─────────────────────────────────────────╗   │
│ ║ cd frontend                                           ║   │
│ ║ npm start                                             ║   │
│ ║ Output: You can now view app in the browser          ║   │
│ ║         Local: http://localhost:3000                 ║   │
│ ║ Status: ▶ RUNNING                                     ║   │
│ ║ Action: Keep this window open                         ║   │
│ ╚───────────────────────────────────────────────────────╝   │
│                                                              │
│ ╔─ Terminal 4 ─────────────────────────────────────────╗   │
│ ║ One-time setup: Create admin account                 ║   │
│ ║ curl -X POST http://127.0.0.1:5000/register ...      ║   │
│ ║ Status: ✅ DONE                                       ║   │
│ ║ Action: You can close this window                     ║   │
│ ╚───────────────────────────────────────────────────────╝   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
         ▼ THEN OPEN BROWSER ▼
    http://localhost:3000
```

---

## Data Flow

```
User Action on Frontend
        │
        ▼
┌─────────────────────┐
│ React Component     │
│ (Clicks button)     │
└─────────────────────┘
        │
        ▼ (Axios HTTP Request)
┌─────────────────────┐
│ Backend Route       │
│ (Flask endpoint)    │
└─────────────────────┘
        │
        ├─► Process Data
        ├─► Call AI Model (Whisper, Transformers, spaCy)
        │
        ▼ (pymongo)
┌─────────────────────┐
│ MongoDB             │
│ (Store results)     │
└─────────────────────┘
        │
        ▼ (JSON Response)
┌─────────────────────┐
│ React Component     │
│ (Display result)    │
└─────────────────────┘
```

---

## File Organization

```
ammg/ (your project root)
│
├── README.md ............................ Project overview
├── LOCAL_SETUP_GUIDE.md ................. THIS IS YOUR BIBLE
├── QUICK_REFERENCE.md .................. Commands cheat sheet
├── QUICK_START.md ....................... Quick start
├── API_DOCUMENTATION.md ................. API endpoints
├── AUTHENTICATION_SYSTEM.md ............. Auth details
│
└── PESU_EC_CSE_K_P34_.../
    │
    ├── backend/
    │   ├── app.py ....................... Flask application (all routes & logic)
    │   ├── requirements.txt ............. Python packages to install
    │   ├── .env ......................... Configuration (CREATE THIS)
    │   ├── venv/ ........................ Virtual environment (auto-created)
    │   │   └── lib/
    │   │       └── python3.x/
    │   │           └── site-packages/ .. All installed Python packages
    │   │
    │   └── uploads/ ..................... Audio file storage
    │
    └── frontend/
        ├── package.json ................. Node.js config
        ├── package-lock.json ............ Dependency lock (auto-created)
        ├── node_modules/ ................ Node packages (auto-created)
        │   └── react/
        │   └── axios/
        │   └── react-router-dom/
        │   └── ... (1000+ packages)
        │
        ├── public/
        │   ├── index.html ............... Main HTML file
        │   └── favicon.ico
        │
        └── src/
            ├── index.js ................. React entry point
            ├── App.js ................... Main App component
            ├── context/
            │   └── AuthContext.js ....... Auth state management
            ├── pages/
            │   ├── Login.js ............. Login page
            │   ├── Dashboard.js ......... Main dashboard
            │   └── Analytics.js ......... Admin analytics
            └── components/
                └── PrivateRoute.js ..... Protected routes
```

---

## Setup Timeline

```
Start
  │
  ├─► Install Prerequisites (Node.js, Python, MongoDB)
  │   └─ Time: 10-30 minutes
  │
  ├─► Clone/Download Project
  │   └─ Time: 2 minutes
  │
  ├─► Setup MongoDB
  │   ├─ Install MongoDB
  │   └─ Start MongoDB
  │   └─ Time: 5-15 minutes
  │
  ├─► Setup Backend
  │   ├─ Create virtual environment
  │   ├─ Install Python packages (pip install -r requirements.txt)
  │   │   └─ First time: 5-10 minutes (downloading Whisper, PyTorch, etc.)
  │   ├─ Create .env file
  │   └─ Start Flask app
  │   └─ Time: 10-15 minutes
  │
  ├─► Setup Frontend
  │   ├─ Install Node packages (npm install)
  │   │   └─ First time: 2-5 minutes
  │   └─ Start React dev server (npm start)
  │   └─ Time: 5 minutes
  │
  ├─► Create Admin Account
  │   └─ Run curl command to register
  │   └─ Time: 1 minute
  │
  └─► READY! ✅
      Open browser: http://localhost:3000
      Login: admin@example.com / Password123
```

---

## Key Ports & Services

```
┌──────────────┬─────────────────┬─────────────────────┐
│ Service      │ Port            │ URL / Connection    │
├──────────────┼─────────────────┼─────────────────────┤
│ Frontend     │ 3000            │ http://localhost:3  │
│              │                 │ 000                 │
├──────────────┼─────────────────┼─────────────────────┤
│ Backend      │ 5000            │ http://localhost:5  │
│              │                 │ 000                 │
├──────────────┼─────────────────┼─────────────────────┤
│ MongoDB      │ 27017           │ mongodb://localhost │
│              │                 │ :27017              │
└──────────────┴─────────────────┴─────────────────────┘
```

---

## Common Workflows

### **First Time Setup**
```
1. Install MongoDB and start it
2. Clone project
3. Open Terminal 1: mongod (or brew services start ...)
4. Open Terminal 2: Setup backend
   - cd backend
   - python -m venv venv
   - activate venv
   - pip install -r requirements.txt
   - Create .env file
   - python app.py
5. Open Terminal 3: Setup frontend
   - cd frontend
   - npm install
   - npm start
6. Open Terminal 4: Create admin
   - curl -X POST ... (see QUICK_REFERENCE.md)
7. Open browser: http://localhost:3000
8. Login with admin@example.com / Password123
```

### **Next Day (Just Run)**
```
1. Terminal 1: mongod
2. Terminal 2: cd backend && source venv/bin/activate && python app.py
3. Terminal 3: cd frontend && npm start
4. Open browser: http://localhost:3000
```

### **Stop Everything**
```
Terminal 1: Ctrl+C (MongoDB)
Terminal 2: Ctrl+C (Backend)
Terminal 3: Ctrl+C (Frontend)
```

---

## Environment Variables

### `.env` file in `backend/` folder
```ini
# Secret key for JWT tokens (change in production!)
SECRET_KEY=your-secret-key-here

# MongoDB connection string
MONGO_URL=mongodb://localhost:27017

# Optional for development
FLASK_DEBUG=True
FLASK_ENV=development
```

---

For complete details, see: **LOCAL_SETUP_GUIDE.md**
For quick commands, see: **QUICK_REFERENCE.md**
