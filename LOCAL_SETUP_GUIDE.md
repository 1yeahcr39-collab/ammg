# 🚀 Local Setup Guide - Complete Installation

Complete step-by-step guide to run MinuteMinds on your local machine.

---

## 📋 Prerequisites

Before starting, install these on your system:

### **Windows/Mac/Linux**
- **Node.js** (v16+): [Download](https://nodejs.org/)
- **Python** (v3.8+): [Download](https://www.python.org/downloads/)
- **Git**: [Download](https://git-scm.com/downloads)
- **MongoDB Community**: [Download](https://www.mongodb.com/try/download/community)

---

## 🎯 Step 1: Install MongoDB

### **Windows**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (.msi file)
3. Choose "Install MongoDB as a Service" (recommended)
4. MongoDB runs automatically on `localhost:27017`

**Verify installation:**
```bash
mongod --version
```

### **macOS (Homebrew)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify:**
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

### **Linux (Ubuntu/Debian)**
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Verify:**
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## 📂 Step 2: Clone/Download Project

```bash
# Option A: Clone from Git
git clone https://github.com/1yeahcr39-collab/ammg.git
cd ammg

# Option B: Extract if you have a ZIP file
unzip ammg.zip
cd ammg
```

Navigate to project directory:
```bash
cd PESU_EC_CSE_K_P34_Automated_Meeting_Minutes_Generator_MinuteMinds
```

---

## 🔧 Step 3: Backend Setup

### **3.1 Create Python Virtual Environment**

**Windows (Command Prompt):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### **3.2 Install Python Dependencies**

```bash
# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install requirements
pip install -r requirements.txt
```

**Note:** First install takes 5-10 minutes (installing Whisper, PyTorch, Transformers, etc.)

### **3.3 Create `.env` file in backend directory**

Create a file named `.env` in the `backend/` folder:

```env
SECRET_KEY=your-secret-key-change-this-in-production
MONGO_URL=mongodb://localhost:27017
```

### **3.4 Start Backend Server**

```bash
python app.py
```

**Expected output:**
```
spaCy model en_core_web_sm not loaded; run 'python -m spacy download en_core_web_sm' to enable key item extraction
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 532-097-185
```

✅ Backend is running on `http://localhost:5000`

---

## 🎨 Step 4: Frontend Setup (New Terminal)

Open a **new terminal** and navigate to frontend:

```bash
# From project root
cd PESU_EC_CSE_K_P34_Automated_Meeting_Minutes_Generator_MinuteMinds/frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view meeting-minutes-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

✅ Frontend is running on `http://localhost:3000`

---

## 🔐 Step 5: Create Admin Account

Open a **new terminal** and run:

```bash
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Admin User",
    "email":"admin@example.com",
    "password":"Password123",
    "role":"admin"
  }'
```

**Expected response:**
```json
{
  "message": "User registered successfully",
  "user_id": "1"
}
```

---

## 🌐 Step 6: Access Application

1. Open browser: **http://localhost:3000**
2. Click "Login"
3. Enter credentials:
   - **Email:** `admin@example.com`
   - **Password:** `Password123`
4. ✅ You're in! Explore the Dashboard

---

## 📊 Verify Everything Works

### **Check Backend Health**
```bash
curl http://127.0.0.1:5000/
```

Should return:
```json
{
  "message": "MinuteMinds backend is running!",
  "features": [
    "User Registration & Login",
    "Audio Transcription with Noise Filtering",
    ...
  ],
  "version": "2.0"
}
```

### **Check MongoDB Connection**
```bash
mongosh
> show dbs
> use meeting_minutes
> db.users.find()
```

### **Test Login (Get Token)**
```bash
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@example.com",
    "password":"Password123"
  }'
```

Should return JWT token.

---

## 🎤 Step 7: (Optional) Test Transcription

### **Prepare audio file**
- Have an `.mp3` or `.wav` file ready
- Example: `meeting.mp3`

### **Get token first**
```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

### **Upload and transcribe**
```bash
curl -X POST http://127.0.0.1:5000/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/meeting.mp3" \
  -F "denoise=true"
```

---

## 🔄 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

If ports conflict, change them:

**Frontend (.env or package.json):**
```bash
PORT=3001 npm start
```

**Backend (app.py last line):**
```python
if __name__ == "__main__":
    app.run(port=5001, debug=True)  # Change 5000 to 5001
```

---

## ⚠️ Troubleshooting

### **MongoDB won't start**
```bash
# Windows: Check service
net start MongoDB

# macOS: Check with brew
brew services list

# Linux: Check with systemctl
sudo systemctl status mongod
```

### **Port already in use**
```bash
# Find process using port 5000 (macOS/Linux)
lsof -i :5000

# Find process using port 3000 (macOS/Linux)
lsof -i :3000

# Kill process (macOS/Linux)
kill -9 <PID>
```

### **Virtual environment not activating**
- Windows: Use Command Prompt instead of PowerShell
- Or use: `python -m pip install -r requirements.txt` (without venv)

### **"ModuleNotFoundError: No module named 'flask'"**
- Ensure venv is activated
- Run: `pip install -r requirements.txt` again

### **"Cannot connect to MongoDB"**
- Check MongoDB is running: `mongosh`
- Verify port 27017 is open
- Check firewall settings

### **Whisper model too large**
- First transcription downloads ~140MB model
- This is normal - happens once only
- Can take 2-5 minutes first time

---

## 🚀 Quick Start (TL;DR)

**Terminal 1 - MongoDB:**
```bash
mongod  # or brew services start mongodb-community
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Terminal 4 - Create Admin:**
```bash
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"Password123","role":"admin"}'
```

Then open: **http://localhost:3000**

Login with: `admin@example.com` / `Password123`

---

## 📚 Environment Variables (.env)

### **Backend `.env` file**
```env
# Secret key for JWT tokens
SECRET_KEY=your-secret-key-here

# MongoDB connection string
MONGO_URL=mongodb://localhost:27017

# Optional: For production
# FLASK_ENV=production
# DEBUG=False
```

---

## 🛑 Stop Services

**Backend:** Press `Ctrl+C` in backend terminal

**Frontend:** Press `Ctrl+C` in frontend terminal

**MongoDB (macOS):** 
```bash
brew services stop mongodb-community
```

**MongoDB (Windows):** 
```bash
net stop MongoDB
```

**MongoDB (Linux):**
```bash
sudo systemctl stop mongod
```

---

## ✅ Checklist

- [ ] Node.js installed (`node --version`)
- [ ] Python installed (`python --version`)
- [ ] MongoDB installed and running
- [ ] Project cloned/downloaded
- [ ] Backend venv created
- [ ] Backend dependencies installed
- [ ] `.env` file created in backend
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Admin account created
- [ ] Can login to http://localhost:3000

---

## 📞 Support

**Issue with specific step?** Check the troubleshooting section above.

**MongoDB won't connect?** Ensure `mongod` is running in a terminal.

**Node modules issues?** Delete `node_modules/` and `package-lock.json`, then run `npm install` again.

Happy coding! 🎉
