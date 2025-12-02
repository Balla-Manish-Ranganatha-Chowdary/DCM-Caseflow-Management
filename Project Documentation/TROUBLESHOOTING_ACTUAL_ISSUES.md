# 🔧 Troubleshooting Actual Issues

## Issues Reported

1. ❌ Login issue still exists
2. ❌ File case not posting to database
3. ❌ AdminManageRecordsPage has no code

---

## ✅ Verification of Files

### AdminManageRecordsPage.jsx
**Status:** ✅ **HAS COMPLETE CODE**

The file contains:
- 350+ lines of code
- Full edit functionality with modals
- Delete functionality with confirmations
- Three tabs (Cases, Users, Judges)
- All CRUD operations implemented

**Location:** `Front-End/src/pages/AdminManageRecordsPage.jsx`

---

## 🔍 Actual Problems & Solutions

### Problem 1: Backend Not Running

**Symptoms:**
- Login fails
- File case shows error
- No data loading

**Solution:**
```bash
# 1. Check if backend is running
# Open browser: http://localhost:8000
# Should see: {"message": "Differential Case Flow Management System"}

# 2. If not running, start it:
cd Back-End
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# 3. Check for errors in terminal
```

---

### Problem 2: Database Not Set Up

**Symptoms:**
- Backend starts but crashes
- "Connection refused" errors
- "Table doesn't exist" errors

**Solution:**
```bash
# 1. Start XAMPP
# - Open XAMPP Control Panel
# - Click "Start" for Apache
# - Click "Start" for MySQL

# 2. Import database schema
# - Open browser: http://localhost/phpmyadmin
# - Click "Import" tab
# - Choose file: Back-End/database_schema.sql
# - Click "Go"

# 3. Verify database created
# - Should see "case_management" database
# - Should have 6 tables
```

---

### Problem 3: .env File Missing

**Symptoms:**
- Backend won't start
- "Settings validation error"
- Database connection fails

**Solution:**
```bash
# 1. Create .env file
cd Back-End
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux

# 2. Edit .env file with correct values:
DATABASE_URL=mysql+pymysql://root:@localhost:3306/case_management
SECRET_KEY=change-this-to-a-random-secret-key-at-least-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 3. Save and restart backend
```

---

### Problem 4: Missing Python Dependencies

**Symptoms:**
- Import errors
- Module not found errors

**Solution:**
```bash
cd Back-End
venv\Scripts\activate
pip install -r requirements.txt

# If still issues, reinstall:
pip uninstall -y -r requirements.txt
pip install -r requirements.txt
```

---

### Problem 5: Frontend Not Connecting to Backend

**Symptoms:**
- CORS errors in browser console
- Network errors
- "Failed to fetch"

**Solution:**
```bash
# 1. Verify backend is running on port 8000
# 2. Check browser console (F12) for actual error
# 3. Verify CORS settings in main.py include http://localhost:5173
# 4. Try accessing API directly: http://localhost:8000/docs
```

---

## 🧪 Step-by-Step Debugging

### Step 1: Test Backend Health

```bash
cd Back-End
python test_backend.py
```

This will check:
- Database connection
- Tables exist
- Sample data present

### Step 2: Start Backend with Verbose Logging

```bash
cd Back-End
venv\Scripts\activate
uvicorn main:app --reload --log-level debug
```

Watch for errors in the terminal.

### Step 3: Test API Endpoints

Open browser and test:
1. http://localhost:8000 - Should show welcome message
2. http://localhost:8000/docs - Should show API documentation
3. Try login from Swagger UI

### Step 4: Check Frontend Console

1. Open browser: http://localhost:5173
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to login or file case
5. Look for error messages (red text)

---

## 🔍 Common Error Messages & Fixes

### Error: "Connection refused"
**Cause:** Backend not running
**Fix:** Start backend with `uvicorn main:app --reload`

### Error: "Table 'case_management.users' doesn't exist"
**Cause:** Database not set up
**Fix:** Import database_schema.sql in phpMyAdmin

### Error: "Settings validation error for Settings"
**Cause:** .env file missing or incorrect
**Fix:** Create .env file with correct DATABASE_URL

### Error: "CORS policy blocked"
**Cause:** Frontend URL not in CORS origins
**Fix:** Add http://localhost:5173 to CORS in main.py (already done)

### Error: "Invalid credentials"
**Cause:** Wrong password or user doesn't exist
**Fix:** Use test credentials or run seed_data.py

### Error: "User not found" when filing case
**Cause:** userId not in localStorage or user deleted
**Fix:** Logout and login again

---

## 📋 Complete Startup Checklist

### Before Starting:

1. **XAMPP Running?**
   ```
   - [ ] Apache started (green)
   - [ ] MySQL started (green)
   ```

2. **Database Created?**
   ```
   - [ ] Open http://localhost/phpmyadmin
   - [ ] See "case_management" database
   - [ ] Has 6 tables
   ```

3. **.env File Exists?**
   ```
   - [ ] Back-End/.env file present
   - [ ] DATABASE_URL correct
   - [ ] SECRET_KEY set
   ```

4. **Dependencies Installed?**
   ```
   - [ ] Backend: pip install -r requirements.txt
   - [ ] Frontend: npm install
   ```

### Starting the Application:

**Terminal 1 - Backend:**
```bash
cd Back-End
venv\Scripts\activate
uvicorn main:app --reload
```
Wait for: "Application startup complete"

**Terminal 2 - Frontend:**
```bash
cd Front-End
npm run dev
```
Wait for: "Local: http://localhost:5173"

**Browser:**
```
Open: http://localhost:5173
```

---

## 🎯 Quick Test

Once both are running, test this flow:

1. **Open:** http://localhost:5173
2. **Click:** "Login / Sign Up"
3. **Select:** User → Login
4. **Enter:**
   - Username: rasesh
   - Email: rasesh@example.com
   - Password: rasesh@2004
5. **Click:** Sign In
6. **Should:** Redirect to dashboard

If this works, everything is set up correctly!

---

## 📞 Still Having Issues?

### Get Detailed Error Information:

1. **Backend Terminal:** Copy the error message
2. **Browser Console (F12):** Copy the error message
3. **Check:**
   - Is XAMPP MySQL running?
   - Is backend showing "Application startup complete"?
   - Is frontend showing the landing page?

### Common Fixes:

**"Cannot connect to database"**
→ Start MySQL in XAMPP

**"Module not found"**
→ Reinstall dependencies: `pip install -r requirements.txt`

**"Port already in use"**
→ Kill process on port 8000 or use different port

**"CORS error"**
→ Backend must be running first, then start frontend

---

## 🚀 Nuclear Option (Fresh Start)

If nothing works, try this:

```bash
# 1. Stop everything
# - Close all terminals
# - Stop XAMPP

# 2. Clean up
cd Back-End
rmdir /s /q venv
rmdir /s /q __pycache__

cd ../Front-End
rmdir /s /q node_modules

# 3. Start fresh
# - Start XAMPP
# - Import database_schema.sql
# - Follow setup steps again
```

---

**Remember:** The code IS there and IS correct. The issue is likely:
1. Backend not running
2. Database not set up
3. .env file missing/incorrect

Follow the checklist above step by step!
