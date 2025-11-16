# MinuteMinds - Automated Meeting Minutes Generator

A full-stack application for transcribing, summarizing, and analyzing meeting audio using AI.

## 🎯 Quick Start

### **Backend Setup**
```bash
cd PESU_EC_CSE_K_P34_Automated_Meeting_Minutes_Generator_MinuteMinds/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Server runs on: `http://localhost:5000`

### **Frontend Setup**
```bash
cd PESU_EC_CSE_K_P34_Automated_Meeting_Minutes_Generator_MinuteMinds/frontend
npm install
npm start
```
App runs on: `http://localhost:3000`

## 🔐 Login Credentials

```
Email:    admin@example.com
Password: Password123
```

## ✨ Features

- 🎤 **Audio Transcription** - Speech-to-text using Whisper
- 🔧 **Noise Filtering** - Optional audio denoising
- 📝 **Summarization** - AI-powered summaries of meetings
- 🎯 **Key Items Extraction** - Extract action items & decisions
- 🔍 **Search** - Full-text search across transcriptions
- 📄 **Export** - Download as DOCX documents
- 👤 **Multi-user** - User registration & JWT auth
- 👨‍💼 **Admin Dashboard** - User management & analytics

## 🏗️ Architecture

```
frontend/              React 18 + Router + Context API
backend/               Flask + Whisper + HuggingFace Transformers
  └─ app.py           All endpoints & business logic
  └─ requirements.txt  Python dependencies
```

## 🚀 Technologies

**Backend:** Flask, PyJWT, bcrypt, Whisper, Transformers, spaCy, librosa  
**Frontend:** React 18, React Router v6, Axios, Recharts  
**Data:** MongoDB (optional fallback to in-memory for dev)  

## 📖 API Documentation

See `API_DOCUMENTATION.md` for detailed endpoint descriptions.

## 🔒 Security

- JWT token-based authentication (24-hour expiry)
- Password hashing with bcrypt
- Role-based admin access control
- CORS configured for localhost:3000

## 🛠️ Development

- Backend runs on port 5000
- Frontend dev server on port 3000
- Frontend proxy configured to backend
- In-memory fallback when MongoDB unavailable

## 📝 Notes

- First time running? Register a new account or use demo credentials
- Audio models load lazily on first use
- For better key-item extraction: `python -m spacy download en_core_web_sm`
