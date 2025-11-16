# Role-Based System - Quick Testing Guide

## Prerequisites

✅ Backend running on `http://localhost:5000`
✅ Frontend running on `http://localhost:3000`
✅ MongoDB connected and running

## Quick Start Testing

### Step 1: Start Backend (if not running)

```bash
cd /workspaces/ammg/backend
python app.py
```

Expected output:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

### Step 2: Start Frontend (if not running)

```bash
cd /workspaces/ammg/frontend
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://192.168.x.x:3000
```

---

## Test Case 1: Register as Regular User

**Objective**: Verify regular user registration and dashboard access

**Steps:**
1. Open `http://localhost:3000`
2. Click "Register" button
3. Fill form:
   - Name: `John User`
   - Email: `john.user@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - **Role**: Select "User (Can upload & view meetings)"
4. Click "Register"
5. You should see: "Registration successful! Please login."
6. Click "Login" link
7. Enter credentials:
   - Email: `john.user@example.com`
   - Password: `TestPass123!`
8. Click "Login"

**Expected Results:**
- ✅ Successfully logged in
- ✅ Dashboard loads showing "MinuteMinds" header
- ✅ User name shown: `John User`
- ✅ No "Admin Dashboard" button visible
- ✅ No "Analytics" button visible (or grayed out)
- ✅ Only "Logout" button visible in header

**Verification:**
- Check browser DevTools → Application → Cookies
- Should see auth token saved
- Try accessing `http://localhost:3000/admin`
- Should redirect back to `/dashboard`

---

## Test Case 2: Register as Admin User

**Objective**: Verify admin registration and admin dashboard access

**Steps:**
1. Open `http://localhost:3000`
2. Click "Register" button
3. Fill form:
   - Name: `Admin User`
   - Email: `admin@example.com`
   - Password: `AdminPass123!`
   - Confirm Password: `AdminPass123!`
   - **Role**: Select "Admin (Access to all users & analytics)"
4. Click "Register"
5. Click "Login" link
6. Enter credentials:
   - Email: `admin@example.com`
   - Password: `AdminPass123!`
7. Click "Login"

**Expected Results:**
- ✅ Successfully logged in
- ✅ Dashboard loads
- ✅ User name shown: `Admin User`
- ✅ **🛡️ Admin Dashboard** button visible
- ✅ **📊 Analytics** button visible
- ✅ Logout button visible

**Admin Dashboard Testing:**
1. Click "🛡️ Admin Dashboard" button
2. Should see three tabs:
   - 👥 Users Management (default selected)
   - 📋 System Logs
   - 📊 Analytics

**Users Management Tab:**
- ✅ Shows table with columns: Name, Email, Role, Created At, Actions
- ✅ Both users listed (John User + Admin User)
- ✅ Admin User has purple "admin" badge
- ✅ John User has green "user" badge
- ✅ Edit/Delete buttons present

**System Logs Tab:**
1. Click "📋 System Logs"
2. Should show logs (or "No logs found" if none exist)
3. If logs shown:
   - ✅ Color-coded log levels (INFO/ERROR/WARNING)
   - ✅ Timestamps displayed
   - ✅ Log messages visible

**Analytics Tab:**
1. Click "📊 Analytics"
2. Should see stat cards:
   - ✅ Total Users: 2
   - ✅ Admins: 1
   - ✅ Total Transcriptions: 0 (or your count)
   - ✅ Avg Processing Time: N/A (or value)

---

## Test Case 3: Access Control Verification

**Objective**: Verify non-admin users cannot access admin routes

**Steps:**
1. Login as `John User` (regular user)
2. In browser address bar, manually navigate to:
   ```
   http://localhost:3000/admin
   ```
3. Press Enter

**Expected Result:**
- ✅ Page should NOT load admin dashboard
- ✅ Automatically redirect to `/dashboard`
- ✅ Admin buttons should NOT appear

**Reverse Test - Admin Access:**
1. Logout from John User
2. Login as `Admin User`
3. Navigate to `http://localhost:3000/admin`
4. Press Enter

**Expected Result:**
- ✅ Admin dashboard loads successfully
- ✅ Users/Logs/Analytics tabs accessible

---

## Test Case 4: JWT Token Verification

**Objective**: Verify JWT token includes role information

**Steps:**
1. Login as `Admin User`
2. Open browser **DevTools** (F12)
3. Go to **Application** tab
4. Click **Cookies** in sidebar
5. Find cookie starting with `localhost:3000`
6. Look for auth token (usually named `token` or in localStorage)
7. Copy the token value
8. Go to https://jwt.io
9. Paste token in "Encoded" section

**Expected Results:**
- ✅ Decode shows payload:
  ```json
  {
    "user_id": "...",
    "email": "admin@example.com",
    "role": "admin",
    "exp": 1234567890
  }
  ```
- ✅ Signature verified

**For Regular User:**
- ✅ Same steps but with `John User` token
- ✅ Payload should show:
  ```json
  {
    "user_id": "...",
    "email": "john.user@example.com",
    "role": "user",
    "exp": 1234567890
  }
  ```

---

## Test Case 5: Role Selection During Registration

**Objective**: Verify role radio buttons work correctly

**Steps:**
1. Go to `/register`
2. Observe the role selection section:
   - Should see two radio button options
   - Option 1: "User (Can upload & view meetings)"
   - Option 2: "Admin (Access to all users & analytics)"
3. Click on "User" option
   - ✅ Should be selected (filled radio circle)
   - ✅ Text should be bold and colored
4. Click on "Admin" option
   - ✅ Should switch selection
   - ✅ Previous selection should be deselected
5. Hover over each option
   - ✅ Should show subtle background change
   - ✅ Smooth transition effect
6. Fill form and select role, then submit
   - ✅ Correct role should be stored in DB

---

## Test Case 6: Database Verification

**Objective**: Verify roles are correctly stored in MongoDB

**Steps:**
1. Open terminal
2. Connect to MongoDB:
   ```bash
   mongosh  # or mongo
   ```
3. Switch to database:
   ```javascript
   use ammg_db  // or your database name
   ```
4. Query users:
   ```javascript
   db.users.find({}, { name: 1, email: 1, role: 1 })
   ```

**Expected Output:**
```javascript
[
  {
    _id: ObjectId(...),
    name: "John User",
    email: "john.user@example.com",
    role: "user"
  },
  {
    _id: ObjectId(...),
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  }
]
```

---

## Test Case 7: API Testing with cURL

**Objective**: Verify backend role endpoints work correctly

### Test Registration Endpoint

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "role": "user"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Registration successful! Please login.",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Test Login Endpoint

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }'
```

**Expected Response (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Test Admin Endpoint (with token)

```bash
# Replace TOKEN with actual JWT from login response
curl -X GET http://localhost:5000/admin/users \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**
```json
{
  "users": [
    {
      "_id": "...",
      "name": "John User",
      "email": "john.user@example.com",
      "role": "user",
      "created_at": "2024-01-01T12:00:00.000Z"
    },
    {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2024-01-01T12:30:00.000Z"
    }
  ]
}
```

---

## Test Case 8: Logout and Re-login

**Objective**: Verify role persistence across sessions

**Steps:**
1. Login as Admin User
2. Navigate around admin dashboard
3. Click "Logout"
4. Page redirects to `/login`
5. Login again as Admin User
6. Admin dashboard should still be accessible
7. Click "Logout" again
8. Login as regular user
9. Admin buttons should NOT appear

**Expected Results:**
- ✅ Roles persist correctly across sessions
- ✅ Logout clears authentication
- ✅ Re-login restores correct role access
- ✅ Correct UI shown based on role

---

## Common Issues & Troubleshooting

### Issue: "Register as Admin" option not showing

**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh page (Ctrl+F5)
- Check browser console for errors (F12)
- Verify frontend is updated with latest code

### Issue: Admin Dashboard shows error

**Solution:**
- Verify backend is running and responding
- Check MongoDB connection
- Verify user has admin role in DB
- Check browser console for API error messages

### Issue: Role not persisting after registration

**Solution:**
- Verify MongoDB is running and connected
- Check backend logs for database errors
- Verify "role" field is being saved in user document
- Use mongosh to verify data was inserted

### Issue: Cannot access admin routes even as admin

**Solution:**
- Verify JWT token has `role: "admin"`
- Clear localStorage and cookies
- Re-login to refresh token
- Check that `user?.role === 'admin'` in code

### Issue: Regular user can see admin button

**Solution:**
- Clear frontend cache and rebuild
- Verify AuthContext is correctly checking role
- Verify role is correctly set in login response
- Check that conditional rendering checks `user?.role === 'admin'`

---

## Performance Testing

### Load Test - Create Multiple Users

```bash
for i in {1..10}; do
  curl -X POST http://localhost:5000/register \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"User $i\",
      \"email\": \"user$i@example.com\",
      \"password\": \"TestPass123!\",
      \"role\": \"user\"
    }"
done
```

Then access admin dashboard:
- ✅ Should load all 10+ users
- ✅ Table should scroll smoothly
- ✅ No performance degradation

---

## Success Checklist

- [ ] Regular users can register with "User" role
- [ ] Admin users can register with "Admin" role
- [ ] Role radio buttons work during registration
- [ ] Correct role stored in database
- [ ] JWT token includes role field
- [ ] Admin users see admin buttons on dashboard
- [ ] Regular users don't see admin buttons
- [ ] `/admin` route blocked for non-admin users
- [ ] Admin dashboard loads with users/logs/analytics tabs
- [ ] Users table shows all users with correct roles
- [ ] Admin can view system logs
- [ ] Admin can view analytics
- [ ] Logout and re-login preserves role access
- [ ] Error handling works for invalid roles

---

## Next Testing Steps

1. **Test Admin Actions** (future feature)
   - Promote/demote users
   - Delete users
   - Reset passwords

2. **Test Role-Based Logs** (future feature)
   - Track all admin actions
   - Log timestamps and changes
   - Export logs

3. **Performance Testing**
   - Test with 100+ users
   - Test with 1000+ logs
   - Measure response times

4. **Security Testing**
   - Try SQL injection in registration
   - Try XSS attacks
   - Verify CORS headers
   - Test JWT expiration

---

**Happy Testing!** 🚀

For issues, check `/workspaces/ammg/backend/app.py` for backend logic and `/workspaces/ammg/frontend/src/` for frontend components.
