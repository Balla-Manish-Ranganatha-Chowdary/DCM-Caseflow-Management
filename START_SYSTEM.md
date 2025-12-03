# 🚀 Quick Start Guide

## Prerequisites
- ✅ XAMPP installed (Apache + MySQL)
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed

---

## Step 1: Database Setup (5 minutes)

### 1.1 Start XAMPP
- Open XAMPP Control Panel
- Click "Start" for **Apache**
- Click "Start" for **MySQL**

### 1.2 Import Database
1. Open browser: http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `Back-End/database_schema.sql`
4. Click "Go"
5. Wait for success message

### 1.3 Verify Database
- Check that `case_management` database exists
- Should have 5 tables: users, judges, admins, cases, hearings, judge_schedules

---

## Step 2: Backend Setup (3 minutes)

### 2.1 Create Virtual Environment
```bash
cd Back-End
python -m venv venv
```

### 2.2 Activate Virtual Environment
**Windows**:
```bash
venv\Scripts\activate
```

**Mac/Linux**:
```bash
source venv/bin/activate
```

### 2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 2.4 Create .env File
```bash
copy .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/case_management
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2.5 Fix Passwords (Important!)
```bash
python fix_passwords.py
```

You should see:
```
✅ Updated rasesh (rasesh@example.com)
✅ Updated samarth (samarth@example.com)
✅ Updated bully (bully@example.com)
✅ Updated manish (manish@example.com)
...
```

### 2.6 Start Backend
```bash
uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test**: Open http://localhost:8000 in browser
Should see: `{"message": "Differential Case Flow Management System"}`

---

## Step 3: Frontend Setup (2 minutes)

### 3.1 Open New Terminal
Keep backend running, open a new terminal

### 3.2 Install Dependencies
```bash
cd Front-End
npm install
```

### 3.3 Start Frontend
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Test**: Open http://localhost:5173 in browser
Should see the landing page

---

## Step 4: Test Login (1 minute)

### 4.1 Test User Login
1. Go to http://localhost:5173
2. Click "Login / Sign Up" → User → Login
3. Email: `rasesh@example.com`
4. Password: `rasesh@2004`
5. Click "Sign In"
6. Should redirect to user dashboard
7. Username "rasesh" should appear in navbar

### 4.2 Test Judge Login
1. Logout
2. Click "Login / Sign Up" → Judge → Login
3. Email: `manish@example.com`
4. Password: `manish@2004`
5. Should redirect to judge dashboard

### 4.3 Test Admin Login
1. Logout
2. Click "Login / Sign Up" → Admin → Login
3. Email: `ruthvik@example.com`
4. Password: `ruthvik@2004`
5. Should redirect to admin dashboard

---

## Step 5: Test File Case (2 minutes)

1. Login as user (rasesh@example.com)
2. Click "File New Case"
3. Fill in:
   - **Title**: "Test Case"
   - **Description**: "Testing the P-MLQ scheduler"
   - **Sections**: "Section 420, Section 120B, Section 34"
   - **Document**: (optional)
4. Click "File Case"
5. Should see success message with case number and scheduled date

---

## Step 6: Test Schedule Hearing (1 minute)

1. Login as judge (manish@example.com)
2. Click "My Cases"
3. Find a case
4. Click "Schedule Hearing"
5. Should see success message with hearing date/time

---

## 🎉 Success!

If all steps worked, your system is fully operational!

---

## Troubleshooting

### Backend won't start
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt

# Check .env file exists
```

### Frontend won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Login fails
```bash
# Run password fix script again
cd Back-End
python fix_passwords.py
```

### Database error
- Make sure XAMPP MySQL is running
- Reimport database_schema.sql
- Check DATABASE_URL in .env file

---

## All Login Credentials

### Users
- rasesh@example.com / rasesh@2004
- samarth@example.com / samarth@2004
- bully@example.com / bully@2004

### Judges
- manish@example.com / manish@2004
- vade@example.com / vade@2004
- venki@example.com / venki@2004

### Admins
- ruthvik@example.com / ruthvik@2004
- mahesh@example.com / mahesh@2004
- vimal@example.com / vimal@2004

---

## Quick Commands Reference

### Start Backend
```bash
cd Back-End
venv\Scripts\activate
uvicorn main:app --reload
```

### Start Frontend
```bash
cd Front-End
npm run dev
```

### Fix Passwords
```bash
cd Back-End
venv\Scripts\activate
python fix_passwords.py
```

---

**Total Setup Time**: ~15 minutes  
**System Status**: ✅ Production Ready
