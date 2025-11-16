# 📚 MinuteMinds API Documentation v2.0

**Base URL:** `http://localhost:5000`  
**Authentication:** JWT Bearer Token in `Authorization` header

---

## 🔐 Authentication Endpoints

### POST `/register`
Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Error (409):**
```json
{
  "error": "Email already registered"
}
```

---

### POST `/login`
Authenticate user and receive JWT token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

---

### POST `/verify-token`
Verify if a JWT token is valid

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

## 📝 Transcription Endpoints

### POST `/transcribe`
Upload and transcribe audio file

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body:**
```
file: <audio file (.mp3, .wav, etc)>
denoise: true|false (optional, default: false)
```

**Response (200):**
```json
{
  "transcription_id": "507f1f77bcf86cd799439011",
  "transcription": "Full transcription text here...",
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Hello everyone, welcome to the meeting"
    },
    {
      "start": 2.5,
      "end": 5.0,
      "text": "Today we'll discuss the Q4 roadmap"
    }
  ]
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/transcribe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@meeting.mp3" \
  -F "denoise=true"
```

---

### GET `/transcriptions`
Get all transcriptions for current user

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "transcriptions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "filename": "meeting.mp3",
      "transcription": "Meeting text...",
      "segments": [...],
      "summary": null,
      "bullet_points": null,
      "created_at": "2025-11-16T10:30:00.000Z"
    }
  ]
}
```

---

### GET `/transcriptions/search?q={query}`
Search transcriptions by keyword

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `q` (required): Search keyword

**Response (200):**
```json
{
  "query": "budget",
  "count": 2,
  "results": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "filename": "Q4_planning.mp3",
      "transcription": "...",
      "created_at": "2025-11-16T10:30:00.000Z",
      "matching_segments": [
        {
          "start": 45.2,
          "end": 48.5,
          "text": "The budget allocation for Q4 is..."
        }
      ]
    }
  ]
}
```

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/transcriptions/search?q=budget" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✨ AI Features

### POST `/transcriptions/{id}/summarize`
Generate AI-powered summary of transcription

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200):**
```json
{
  "summary": "The team discussed Q4 objectives including product roadmap, budget allocation, and team expansion...",
  "bullet_points": [
    "Q4 product roadmap finalized",
    "Budget allocation for 4 new hires approved",
    "Marketing campaign to launch in November",
    "Performance review schedule set for December"
  ]
}
```

**Error (503):**
```json
{
  "error": "Summarization service unavailable"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/transcriptions/507f1f77bcf86cd799439011/summarize \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST `/translate`
Translate transcription to another language

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "text": "Full transcription text...",
  "target": "es"
}
```

**Response (200):**
```json
{
  "translatedText": "Texto de transcripción completo..."
}
```

**Supported Languages:**
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese

---

## 📁 Export Endpoints

### GET `/transcriptions/{id}/export?format={format}`
Export transcription as DOCX or PDF

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `format` (required): `docx` or `pdf`

**Response:** Binary file (DOCX or PDF)

**Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="minutes_20251116.docx"
```

**Included in Export:**
- Meeting metadata (filename, date)
- Full transcription
- Summary (if generated)
- Bullet points (if generated)
- Segments with timestamps

**Example cURL:**
```bash
curl -X GET "http://localhost:5000/transcriptions/507f1f77bcf86cd799439011/export?format=docx" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o meeting_minutes.docx
```

---

## 👥 Admin Endpoints

### GET `/admin/users`
Get list of all users (admin only)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "created_at": "2025-11-15T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "email": "admin@example.com",
      "full_name": "Admin User",
      "role": "admin",
      "created_at": "2025-11-14T09:00:00.000Z"
    }
  ]
}
```

**Error (403):**
```json
{
  "error": "Admin access required"
}
```

---

### DELETE `/admin/users/{user_id}`
Delete a user account (admin only)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error (400):**
```json
{
  "error": "Cannot delete yourself"
}
```

---

### GET `/admin/logs`
Get system logs (admin only)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `limit` (optional): Max results, default: 100
- `action` (optional): Filter by action type

**Response (200):**
```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "action": "transcription_created",
      "user_id": "507f1f77bcf86cd799439011",
      "timestamp": "2025-11-16T10:30:00.000Z",
      "details": {
        "filename": "meeting.mp3"
      }
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "action": "summarization",
      "user_id": "507f1f77bcf86cd799439011",
      "timestamp": "2025-11-16T10:32:00.000Z",
      "details": {
        "transcription_id": "507f1f77bcf86cd799439011"
      }
    }
  ]
}
```

**Logged Actions:**
- `user_registered`
- `user_login`
- `transcription_created`
- `summarization`
- `search`
- `translation`
- `export`
- `admin_view_users`
- `admin_delete_user`
- `admin_view_logs`
- `admin_view_analytics`

**Example with Filter:**
```bash
curl -X GET "http://localhost:5000/admin/logs?action=transcription_created&limit=50" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### GET `/admin/analytics`
Get system analytics (admin only)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "total_users": 15,
  "total_transcriptions": 48,
  "total_logins": 132,
  "top_users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "count": 12
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "count": 8
    }
  ],
  "recent_metrics": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "login_count",
      "value": 1,
      "user_id": "507f1f77bcf86cd799439011",
      "timestamp": "2025-11-16T10:30:00.000Z"
    }
  ]
}
```

**Metrics Types:**
- `login_count`
- `transcription_count`
- `summarization_count`
- `search_count`
- `translation_count`
- `export_count`

---

## 🏥 Health Check

### GET `/`
Check if backend is running

**Response (200):**
```json
{
  "message": "MinuteMinds backend is running!",
  "features": [
    "User Registration & Login",
    "Audio Transcription with Noise Filtering",
    "Automatic Summarization",
    "Keyword Search",
    "PDF/DOCX Export",
    "Admin Dashboard",
    "System Logs",
    "Analytics"
  ],
  "version": "2.0"
}
```

---

## ⚠️ Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "error": "Missing required fields" | "Invalid format" | "Empty file"
}
```

**401 - Unauthorized**
```json
{
  "error": "Invalid credentials" | "Token is missing" | "Token has expired"
}
```

**403 - Forbidden**
```json
{
  "error": "Admin access required"
}
```

**404 - Not Found**
```json
{
  "error": "Transcription not found" | "User not found"
}
```

**409 - Conflict**
```json
{
  "error": "Email already registered"
}
```

**500 - Server Error**
```json
{
  "error": "Error transcribing audio: [details]"
}
```

**503 - Service Unavailable**
```json
{
  "error": "Summarization service unavailable"
}
```

---

## 📊 Rate Limiting & Performance

**Recommended Limits:**
- Transcription: 1 per 30 seconds (processing time)
- Search: 10 per minute
- Export: 5 per minute
- Summary generation: 1 per minute (processing time)

**Performance Notes:**
- Summarization takes 10-30 seconds depending on text length
- Transcription takes 30-120 seconds depending on audio length
- Search is instant (indexed queries)
- Export generation is instant

---

## 🔑 Authentication Example

**Step 1: Register/Login**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzMxNzc3NDAwfQ.signature"
}
```

**Step 2: Use Token in Requests**
```bash
curl -X POST http://localhost:5000/transcribe \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@meeting.mp3"
```

---

## 🧪 Testing with cURL

### Complete Workflow Example

```bash
# 1. Register
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq -r '.token')

# 3. Upload and transcribe
curl -X POST http://localhost:5000/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@meeting.mp3" \
  -F "denoise=true"

# 4. Summarize (replace with actual transcription ID)
curl -X POST http://localhost:5000/transcriptions/TRANSCRIPTION_ID/summarize \
  -H "Authorization: Bearer $TOKEN"

# 5. Search
curl -X GET "http://localhost:5000/transcriptions/search?q=budget" \
  -H "Authorization: Bearer $TOKEN"

# 6. Export
curl -X GET "http://localhost:5000/transcriptions/TRANSCRIPTION_ID/export?format=docx" \
  -H "Authorization: Bearer $TOKEN" \
  -o meeting.docx
```

---

## 📞 Support

For issues or questions:
1. Check error message for details
2. Verify JWT token hasn't expired
3. Ensure all required fields are provided
4. Check server logs for detailed errors

