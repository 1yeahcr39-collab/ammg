# 📋 Automated Meeting Minutes Generator

**Project ID:** P34 | **Course:** UE23CS341A | **Campus:** EC | **Branch:** CSE | **Section:** K  
**Academic Year:** 2025 | **Semester:** 5th Sem | **Team:** MinuteMinds

---

## 🎯 Project Overview

The **Automated Meeting Minutes Generator** is an intelligent system designed to transcribe meeting audio, extract key action items, summarize discussions, and generate structured meeting minutes documents. The project is developed as part of the Software Engineering (UE23CS341A) course at PES University, combining modern AI/ML technologies with full-stack web development.

### Key Capabilities

✅ **Audio Transcription** - Convert speech to text using OpenAI Whisper  
✅ **Meeting Summarization** - Auto-generate summaries using Hugging Face Transformers  
✅ **Action Item Extraction** - Identify key decisions and tasks using spaCy NLP  
✅ **Audio Enhancement** - Optional noise filtering with librosa  
✅ **Full-Text Search** - MongoDB-powered keyword search  
✅ **Document Export** - Export minutes as professional DOCX files  
✅ **User Management** - Secure authentication with JWT & bcrypt  
✅ **Admin Dashboard** - User management, analytics, and system monitoring  

---

## 👥 Development Team: MinuteMinds

| Role | Name | GitHub |
|------|------|--------|
| Team Lead | Vishnupriya | @vishnupriyal-24 |
| Developer | Kusumita | - |
| Developer | Raagnya | - |
| Developer | Vanya | - |

**Faculty Supervisor:** @sheela824  
**Teaching Assistant:** @Omicarr

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Router:** React Router v6
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Charts:** Recharts (analytics)
- **Export:** file-saver, jsPDF
- **Styling:** CSS3

### Backend
- **Framework:** Flask
- **Authentication:** PyJWT, bcrypt
- **ML/AI Models:**
  - OpenAI Whisper (speech-to-text)
  - Hugging Face Transformers (summarization)
  - spaCy (NLP & entity extraction)
- **Audio Processing:** librosa, noisereduce, soundfile
- **Document Generation:** python-docx
- **Database Driver:** pymongo

### Database
- **Primary:** MongoDB
- **Fallback:** In-memory storage (development mode)

### DevOps
- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions (prepared)
- **Container Ready:** Docker-compatible

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 14+ ([https://nodejs.org/](https://nodejs.org/))
- **Python** 3.8+ ([https://python.org/](https://python.org/))
- **MongoDB** 4.0+ ([https://mongodb.com/](https://mongodb.com/))
- **Git** ([https://git-scm.com/](https://git-scm.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/1yeahcr39-collab/ammg.git
cd ammg
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip and install dependencies
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

#### 3. Create Environment Configuration

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here-change-in-production
MONGO_URL=mongodb://localhost:27017
FLASK_ENV=development
```

#### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
# or use npm ci for exact versions
npm ci
```

### Running the Application

**Important:** Use three separate terminal windows/tabs

**Terminal 1 - Start MongoDB:**

```bash
# Windows: Run MongoDB application or use command
mongod

# macOS (with Homebrew):
brew services start mongodb-community

# Linux (Ubuntu/Debian):
sudo systemctl start mongodb
```

Expected output:
```
[initandlisten] Waiting for connections on port 27017
```

**Terminal 2 - Start Backend (Port 5000):**

```bash
cd backend
source venv/bin/activate  # Activate environment
python app.py
```

Expected output:
```
Running on http://127.0.0.1:5000/
```

**Terminal 3 - Start Frontend (Port 3000):**

```bash
cd frontend
npm start
```

Expected output:
```
On Your Network: http://192.168.x.x:3000
Local: http://localhost:3000
```

### 4. Create Admin Account (Terminal 4)

```bash
# Windows (PowerShell):
curl -X POST http://127.0.0.1:5000/register `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "Password123",
    "role": "admin"
  }'

# macOS/Linux (Bash):
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "Password123",
    "role": "admin"
  }'
```

### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

**Login Credentials:**
- **Email:** admin@example.com
- **Password:** Password123

---

## 📁 Project Structure

```
ammg/
│
├── backend/
│   ├── app.py .............................. Main Flask application (943 lines)
│   ├── requirements.txt ................... Python dependencies (17 packages)
│   ├── .env .............................. Environment variables (create this)
│   ├── uploads/ .......................... Audio upload directory
│   └── .venv/ ........................... Virtual environment
│
├── frontend/
│   ├── package.json ...................... NPM configuration
│   ├── public/
│   │   ├── index.html ................... HTML template
│   │   └── manifest.json ............... PWA manifest
│   ├── src/
│   │   ├── App.js ...................... Main React component
│   │   ├── App.css ..................... App styles
│   │   ├── index.js ................... React entry point
│   │   ├── index.css .................. Global styles
│   │   ├── components/
│   │   │   └── PrivateRoute.js ........ Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.js ........ Authentication context
│   │   └── pages/
│   │       ├── Login.js .............. Login page
│   │       ├── Register.js ........... Registration page
│   │       ├── Dashboard.js .......... Main dashboard
│   │       ├── Dashboard.css ........ Dashboard styles
│   │       ├── Analytics.js ......... Admin analytics
│   │       └── Analytics.css ....... Analytics styles
│   ├── .gitignore ..................... Git ignore rules
│   └── node_modules/ .................. NPM packages
│
├── Documentation/
│   ├── README.md ........................ Project overview (this file)
│   ├── LOCAL_SETUP_GUIDE.md .......... Detailed setup guide
│   ├── QUICK_REFERENCE.md ........... Commands cheat sheet
│   ├── ARCHITECTURE_DIAGRAM.md ...... System architecture
│   ├── API_DOCUMENTATION.md ......... API endpoints reference
│   ├── AUTHENTICATION_SYSTEM.md .... Security documentation
│   ├── INDEX.md ....................... Documentation index
│   └── CLEANUP_SUMMARY.md ........... Project optimization summary
│
├── .gitignore .......................... Git ignore patterns
├── .vscode/ ........................... VS Code configuration
│   └── settings.json ................. VS Code settings
│
└── .github/
    └── workflows/ .................... CI/CD workflows (prepared)
```

---

## 🔑 Key Features

### 1. Audio Transcription
- Leverages **OpenAI Whisper** for accurate speech-to-text conversion
- Supports multiple audio formats (MP3, WAV, M4A)
- Optional automatic noise filtering

### 2. Meeting Summarization
- Uses **Hugging Face Transformers** (facebook/bart-large-cnn model)
- Generates concise summaries of full meeting transcriptions

### 3. Action Item Extraction
- **spaCy** NLP model for entity recognition
- Identifies key decisions, tasks, and deadlines

### 4. User Authentication & Authorization
- **JWT tokens** with 24-hour expiration
- **bcrypt** password hashing (10 salt rounds)
- **Role-based access control** (Admin/User)

### 5. Search & Discovery
- **MongoDB full-text search** for transcriptions
- Keyword-based filtering and discovery

### 6. Export Functionality
- Professional **DOCX export** of meeting minutes

### 7. Admin Dashboard
- User management interface
- System analytics and metrics

---

## 🔐 Security Architecture

### Authentication Flow
```
User Registration/Login → Credentials validated (bcrypt) → 
JWT token generated → Token stored in localStorage → 
Axios interceptor adds token to headers → 
Backend validates token on protected routes
```

### Protected Resources
- ✅ JWT token required for protected endpoints
- ✅ Admin endpoints require `role: "admin"`
- ✅ CORS enabled for `localhost:3000` only
- ✅ Input validation on all endpoints

---

## 📊 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/verify-token` | Verify JWT token | ✅ |
| POST | `/transcribe` | Upload & transcribe audio | ✅ |
| GET | `/transcriptions` | List transcriptions | ✅ |
| POST | `/transcriptions/<id>/summarize` | Generate summary | ✅ |
| POST | `/transcriptions/<id>/extract-items` | Extract action items | ✅ |
| GET | `/transcriptions/search?q=<query>` | Search transcriptions | ✅ |
| POST | `/transcriptions/<id>/export` | Export as DOCX | ✅ |
| GET | `/admin/users` | List all users | ✅ Admin |
| GET | `/admin/logs` | View system logs | ✅ Admin |
| GET | `/admin/analytics` | Get analytics data | ✅ Admin |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed examples.

---

## 📖 Comprehensive Documentation

| Document | Purpose |
|----------|---------|
| **LOCAL_SETUP_GUIDE.md** | Step-by-step setup for all OS |
| **QUICK_REFERENCE.md** | Command cheat sheet |
| **ARCHITECTURE_DIAGRAM.md** | System architecture & data flow |
| **API_DOCUMENTATION.md** | All endpoints with examples |
| **AUTHENTICATION_SYSTEM.md** | JWT & security details |
| **INDEX.md** | Documentation navigation hub |

---

## 🚀 Deployment

Ready for deployment to AWS, Google Cloud, Azure, Docker, Heroku, or self-hosted servers.

For production deployment, see configuration notes in `backend/app.py`

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Backend Startup | < 5 seconds |
| Frontend Startup | 10-15 seconds |
| First Transcription | 30-60 seconds |
| Average API Response | < 500ms |

---

## 🔧 Development Guidelines

### Git Workflow
```bash
git clone https://github.com/1yeahcr39-collab/ammg.git
git checkout -b feature/your-feature-name
git add . && git commit -m "feat: Description"
git push origin feature/your-feature-name
```

### Commit Format
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code refactoring

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `mongod` not found | Install MongoDB or add to PATH |
| Port 5000 in use | Kill process: `lsof -i :5000` |
| Module not found | Activate virtual environment |
| CORS errors | Check backend running on port 5000 |
| Slow transcription | Normal - Whisper model downloads (~140MB) |

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for more.

---

## 📄 Academic Attribution

This project is developed for **educational purposes** as part of the Software Engineering (UE23CS341A) course at PES University.

- **Institution:** PES University
- **Course Code:** UE23CS341A
- **Academic Year:** 2025
- **Semester:** 5th
- **Campus:** Electronic City (EC)
- **Branch:** Computer Science & Engineering (CSE)
- **Section:** K
- **Project ID:** P34
- **Team:** MinuteMinds (Vishnupriya, Kusumita, Raagnya, Vanya)

---

## 📞 Contact

- **Faculty Supervisor:** @sheela824
- **Teaching Assistant:** @Omicarr
- **GitHub:** https://github.com/1yeahcr39-collab/ammg

---

**Made with ❤️ by MinuteMinds Team**

*Last Updated: November 16, 2025*
