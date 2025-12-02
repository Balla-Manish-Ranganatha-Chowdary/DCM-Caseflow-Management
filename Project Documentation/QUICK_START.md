# Quick Start Guide - Differential Case Management System

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database (2 minutes)
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL**
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Click **Import** tab
5. Choose file: `Back-End/database_schema.sql`
6. Click **Go**
7. Database `case_management` is now ready!

### Step 2: Start Backend (1 minute)
```bash
cd Back-End
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```
✅ Backend running at: http://localhost:8000

### Step 3: Start Frontend (1 minute)
```bash
cd Front-End
npm install
npm run dev
```
✅ Frontend running at: http://localhost:5173

### Step 4: Test the System (1 minute)
1. Open browser: http://localhost:5173
2. Click **Login / Sign Up**
3. Select **User** → **Sign Up**
4. Create account and login
5. Click **File New Case**
6. Fill form and submit
7. Check **Case Status** to see your scheduled hearing!

## 🔑 Test Credentials

### Users (Can signup or use these)
- rasesh@example.com / rasesh@2004
- samarth@example.com / samarth@2004

### Judges
- manish@example.com / manish@2004
- vade@example.com / vade@2004

### Admins
- ruthvik@example.com / ruthvik@2004
- mahesh@example.com / mahesh@2004

## 📱 What Can You Do?

### As User:
1. **Sign up** and create account
2. **File cases** with document upload
3. **Check status** of all your cases
4. **View judgments** when cases are closed

### As Judge:
1. **View dashboard** with analytics
2. **Manage assigned cases**
3. **Schedule next hearings** (automatic)
4. **Close cases** with judgments

### As Admin:
1. **View system analytics**
2. **Manage all records** (users, judges, cases)
3. **Delete records** from database
4. **Monitor system status**

## 🎯 Key Features

✨ **Intelligent Scheduling**: Cases automatically scheduled based on complexity
📊 **Real-time Analytics**: Live dashboards for judges and admins
📁 **Document Upload**: Attach PDFs, images to cases
⚖️ **Multi-level Queue**: Complex cases get priority dates
🔒 **Secure Authentication**: JWT tokens with bcrypt
📱 **Responsive Design**: Works on mobile and desktop

## 🐛 Common Issues

**Backend won't start?**
- Check if MySQL is running in XAMPP
- Verify .env file exists with correct DATABASE_URL

**Frontend won't start?**
- Delete node_modules and run `npm install` again
- Check if port 5173 is available

**Can't login?**
- Make sure backend is running on port 8000
- Check browser console for errors
- Verify database has user records

## 📚 Need More Help?

- **Full Documentation**: See `PROJECT_DOCUMENTATION.md`
- **API Docs**: http://localhost:8000/docs
- **Setup Guide**: See `Back-End/SETUP_GUIDE.md`

## 🎉 You're All Set!

The system is now ready to use. Start by creating a user account and filing your first case!

---

**Pro Tip**: Open three browser windows to test all three roles simultaneously:
1. User filing cases
2. Judge managing cases
3. Admin monitoring system
