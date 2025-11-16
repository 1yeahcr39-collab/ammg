
---

## 🎯 ROLE-BASED USER SYSTEM (NEW)

### Quick Start
```
1. Start Backend: python backend/app.py
2. Start Frontend: npm start (in frontend/)
3. Register as User → Dashboard (no admin features)
4. Register as Admin → Dashboard + Admin buttons
```

### Registration Types

**Regular User**
- Select: "User (Can upload & view meetings)"
- Access: Dashboard, upload audio
- Cannot: View admin panel, see other users

**Admin User**
- Select: "Admin (Access to all users & analytics)"
- Access: Everything + admin dashboard
- Can: View all users, logs, analytics

### Admin Dashboard Features
- 👥 **Users Management**: View all registered users
- 📋 **System Logs**: View system activity logs
- 📊 **Analytics**: Key metrics (users, admins, transcriptions)

### Admin Button
- Regular users: NO admin buttons
- Admin users: 🛡️ Admin Dashboard button visible

### Database
```javascript
// User role stored in MongoDB
{
  name: "User Name",
  email: "user@email.com",
  role: "user"  // or "admin"
}
```

### API
```bash
# Registration with role
curl -X POST http://localhost:5000/register \
  -d '{"name":"John","email":"john@email.com","password":"pass","role":"user"}'

# Login returns role
curl -X POST http://localhost:5000/login \
  -d '{"email":"john@email.com","password":"pass"}'
# Response: {"token":"...", "user":{"role":"user"}}
```

### Create Admin via CLI
```bash
python scripts/create_admin.py \
  --email admin@email.com \
  --name "Admin Name" \
  --password "password123"
```

### Documentation Files
- `ROLE_BASED_SYSTEM.md` - Full implementation details
- `TESTING_GUIDE.md` - 8 comprehensive test cases
- `IMPLEMENTATION_SUMMARY.md` - Project overview


# ⚡ Quick Reference - Local Setup

## One-Page Cheat Sheet

### **Prerequisites**
```
✓ Node.js v16+
✓ Python 3.8+
✓ Git
✓ MongoDB Community
```

### **MongoDB Setup**
```bash
# Windows: Run installer → Install as Service → Done

# macOS:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu):
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### **Backend (Terminal 1)**
```bash
cd backend
python -m venv venv

# Activate (Windows Command Prompt):
venv\Scripts\activate

# Activate (macOS/Linux):
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

### **Create .env**
```bash
# In backend/ folder, create .env file:
SECRET_KEY=your-secret-key
MONGO_URL=mongodb://localhost:27017
```

### **Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm start
```

### **Admin Account (Terminal 3)**
```bash
curl -X POST http://127.0.0.1:5000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"Password123","role":"admin"}'
```

### **Access**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### **Login Credentials**
```
Email: admin@example.com
Password: Password123
```

### **Port Issues**
```bash
# Find process on port 5000 (macOS/Linux):
lsof -i :5000

# Kill it:
kill -9 <PID>
```

### **Stop Everything**
```bash
Ctrl+C in each terminal
```

### **MongoDB Commands**
```bash
# Check connection:
mongosh

# In mongosh shell:
show dbs
use meeting_minutes
db.users.find()
```

### **Test Backend**
```bash
# Health check:
curl http://127.0.0.1:5000/

# Login:
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123"}'
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| MongoDB won't start | Ensure `mongod` running or `brew services start mongodb-community` |
| Port 5000 in use | Run `kill -9 $(lsof -t -i :5000)` or change port in app.py |
| Port 3000 in use | Run `kill -9 $(lsof -t -i :3000)` or use `PORT=3001 npm start` |
| venv not activating | Use Command Prompt (not PowerShell) on Windows |
| Module not found | Ensure venv activated, run `pip install -r requirements.txt` |
| Can't connect to DB | Check MongoDB is running: `mongosh --eval "db.adminCommand('ping')"` |
| Slow first transcription | Whisper model downloads (~140MB) on first use - normal |

---

## File Locations

```
ammg/
├── LOCAL_SETUP_GUIDE.md ← You are here
├── README.md
├── QUICK_START.md
├── API_DOCUMENTATION.md
└── PESU_EC_CSE_K_P34_Automated_Meeting_Minutes_Generator_MinuteMinds/
    ├── backend/
    │   ├── app.py
    │   ├── requirements.txt
    │   ├── .env ← Create this
    │   └── venv/ ← Auto-created
    └── frontend/
        ├── package.json
        ├── src/
        └── node_modules/ ← Auto-created
```

---

## Terminal Setup for Beginners

You need **3 terminals open simultaneously:**

**Terminal 1 (MongoDB):**
- Purpose: Database server
- Command: `mongod` or `brew services start mongodb-community`
- Leave running

**Terminal 2 (Backend):**
- Purpose: API server
- Location: `cd backend`
- Commands: Activate venv, `python app.py`
- Leave running

**Terminal 3 (Frontend):**
- Purpose: React dev server
- Location: `cd frontend`
- Command: `npm start`
- Leave running

**Terminal 4 (Admin Account):**
- Purpose: One-time setup
- Command: Run curl command to create admin
- Can close after

Then open browser: **http://localhost:3000**

---

## Environment Variables Reference

```env
# Backend/.env file

# Flask secret key for JWT signing
# Change this in production!
SECRET_KEY=your-secret-key-change-this-in-production

# MongoDB connection
# Default for local: mongodb://localhost:27017
MONGO_URL=mongodb://localhost:27017

# Optional in development:
# FLASK_DEBUG=True
# FLASK_ENV=development
```

---

For detailed guide, see: **LOCAL_SETUP_GUIDE.md**
