# Differential Case Flow Management System - Complete Documentation

## 📋 Project Overview

A comprehensive case management system with intelligent multi-level queue scheduling algorithm that prioritizes cases based on complexity. The system supports three user roles: Users (file cases), Judges (manage cases), and Admins (system management).

## 🏗️ System Architecture

### Backend (FastAPI + MySQL)
- **Framework**: FastAPI
- **Database**: MySQL (via XAMPP)
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Local file system with path mapping
- **Scheduling**: Custom multi-level queue algorithm

### Frontend (React + Vite)
- **Framework**: React 18
- **Routing**: React Router v7
- **Styling**: Pure CSS with responsive design
- **State Management**: React Hooks (useState, useEffect)

## 🚀 Complete Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+ (XAMPP recommended)
- Git

### Backend Setup

1. **Install XAMPP and Start MySQL**
   - Download and install XAMPP
   - Start Apache and MySQL services
   - Open phpMyAdmin (http://localhost/phpmyadmin)

2. **Create Database**
   ```sql
   -- Run this in phpMyAdmin SQL tab or MySQL command line
   -- Or import the database_schema.sql file directly
   ```
   - Go to phpMyAdmin
   - Click "Import" tab
   - Choose `Back-End/database_schema.sql`
   - Click "Go" to execute

3. **Setup Python Environment**
   ```bash
   cd Back-End
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Mac/Linux
   source venv/bin/activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```
   DATABASE_URL=mysql+pymysql://root:@localhost:3306/case_management
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

6. **Seed Initial Data (Optional)**
   ```bash
   python seed_data.py
   ```

7. **Run Backend Server**
   ```bash
   uvicorn main:app --reload
   ```
   
   Backend will run on: http://localhost:8000
   API Docs: http://localhost:8000/docs

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Front-End
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on: http://localhost:5173

## 📱 Complete User Workflows

### 1. User Journey

#### A. Registration & Login
1. Visit http://localhost:5173
2. Click "Login / Sign Up" button
3. Select "User" role
4. Click "Sign Up"
5. Fill registration form:
   - Username (min 3 characters)
   - Email (valid format)
   - Password (min 6 characters)
   - Confirm Password
6. Click "Sign Up"
7. Return to login page
8. Enter credentials and login

#### B. Dashboard
- View welcome message with username
- See recent cases (up to 3)
- Quick action cards:
  - File New Case
  - Check Status

#### C. File a Case
1. Click "File New Case" from dashboard or navbar
2. Fill case form:
   - **Case Title**: Descriptive title
   - **Case Description**: Detailed information
   - **Case Complexity**: 
     - Simple (30 min) - Minor disputes
     - Moderate (60 min) - Contract disputes
     - Complex (120 min) - Property disputes
     - Highly Complex (180 min) - Criminal cases
   - **Supporting Documents** (Optional): PDF, DOC, DOCX, JPG, PNG
3. Click "File Case"
4. System automatically:
   - Generates unique case number
   - Assigns judge with minimum workload
   - Schedules hearing based on complexity
   - Returns scheduled date and time

#### D. Check Case Status
1. Click "Check Status" from dashboard or navbar
2. View all filed cases in card format
3. Click any case card to see detailed modal:
   - Case information
   - Description
   - Hearing schedule
   - Judgment (if case is closed)
   - Attached documents

#### E. Logout
- Click "Logout" button in navbar
- Redirected to landing page

### 2. Judge Journey

#### A. Login
1. Visit http://localhost:5173
2. Click "Login / Sign Up"
3. Select "Judge" role
4. Click "Login"
5. Enter credentials (no signup option for judges)

#### B. Dashboard
- View analytics cards:
  - Total Cases
  - Pending Cases
  - Scheduled Cases
  - Completed Cases
- Quick actions:
  - Manage Cases
  - View Analytics
- Recent cases overview

#### C. Manage Cases
1. Click "My Cases" from navbar
2. View all assigned cases in table format
3. For each case, options:
   - **Schedule Next Hearing**: 
     - Click button
     - System automatically finds next available slot (7+ days out)
     - Confirms scheduling with date/time
   - **Close Case**:
     - Click button
     - Enter judgment in prompt
     - Case marked as completed
     - Judgment saved and visible to user

#### D. View Analytics
1. Click "Analytics" from navbar
2. View comprehensive analytics:
   - Case complexity distribution
   - Performance metrics
   - Completion rate
   - Average case duration
   - Monthly case distribution

#### E. Logout
- Click "Logout" in navbar

### 3. Admin Journey

#### A. Login
1. Visit http://localhost:5173
2. Click "Login / Sign Up"
3. Select "Admin" role
4. Click "Login"
5. Enter credentials

#### B. Dashboard
- System-wide analytics:
  - Total Cases
  - Total Users
  - Total Judges
  - Pending/Scheduled/Completed Cases
- Quick actions:
  - View Analytics
  - Manage Records
- System status indicators

#### C. View Analytics
1. Click "Analytics" from navbar
2. View system-wide analytics:
   - Case status distribution
   - Case complexity distribution
   - System performance metrics
   - Completion rate
   - System utilization

#### D. Manage Database Records
1. Click "Manage Records" from navbar
2. Three tabs available:
   - **Cases**: View and delete cases
   - **Users**: View and delete users
   - **Judges**: View and delete judges
3. Each tab shows table with:
   - All records
   - Delete button for each record
   - Confirmation dialog before deletion

#### E. Logout
- Click "Logout" in navbar

## 🔐 Test Credentials

### Users (Can Login & Signup)
- rasesh@example.com / rasesh@2004
- samarth@example.com / samarth@2004
- bully@example.com / bully@2004

### Judges (Login Only)
- manish@example.com / manish@2004
- vade@example.com / vade@2004
- venki@example.com / venki@2004

### Admins (Login Only)
- ruthvik@example.com / ruthvik@2004
- mahesh@example.com / mahesh@2004
- vimal@example.com / vimal@2004

## 🧮 Multi-Level Queue Scheduling Algorithm

### Algorithm Overview
The system uses a priority-based scheduling algorithm that considers:
1. **Case Complexity** (primary factor)
2. **Judge Availability**
3. **Working Hours** (9 AM - 5 PM)
4. **Lunch Break** (1 PM - 2 PM)
5. **Existing Schedules** (never conflicts)

### Priority Levels
1. **Highly Complex** (Priority: 100)
   - Duration: 180 minutes
   - Scheduling: Earliest available date
   
2. **Complex** (Priority: 75)
   - Duration: 120 minutes
   - Scheduling: Earliest available date
   
3. **Moderate** (Priority: 50)
   - Duration: 60 minutes
   - Scheduling: Fill available time slots
   
4. **Simple** (Priority: 25)
   - Duration: 30 minutes
   - Scheduling: Fill available time slots

### Scheduling Process
1. **Case Filed** → System assigns priority score
2. **Judge Assignment** → Selects judge with minimum workload
3. **Slot Finding**:
   - Complex cases: Search from tomorrow onwards
   - Simple cases: Search from 3 days onwards (to fill gaps)
4. **Time Slot Validation**:
   - Check working hours
   - Avoid lunch break
   - Ensure no conflicts with existing schedules
   - Find consecutive 30-minute slots for duration
5. **Schedule Creation** → Update case and judge schedule tables

### Next Hearing Scheduling
- Minimum 7 days from current date
- Same duration as original case
- Same validation process
- Never modifies existing schedules

## 📊 Database Schema

### Tables
1. **users** - User accounts
2. **judges** - Judge accounts
3. **admins** - Admin accounts
4. **cases** - All case information
5. **hearings** - Hearing schedules
6. **judge_schedules** - Judge availability tracking

### Key Relationships
- User → Cases (One-to-Many)
- Judge → Cases (One-to-Many)
- Case → Hearings (One-to-Many)
- Judge → Judge Schedules (One-to-Many)

### File Storage
- Documents stored in `Back-End/uploads/` directory
- File paths stored in database
- Original filenames preserved

## 🎨 UI/UX Features

### Design Principles
- **Consistent Color Scheme**: Purple gradient theme
- **Responsive Design**: Mobile and desktop support
- **Intuitive Navigation**: Role-based navbar
- **Visual Feedback**: Loading states, hover effects
- **Status Indicators**: Color-coded badges
- **Modal Dialogs**: Detailed case views

### Color Coding
- **Blue (#3498db)**: Primary actions, scheduled
- **Green (#27ae60)**: Completed, success
- **Orange (#f39c12)**: Pending, warnings
- **Purple (#9b59b6)**: In progress
- **Red (#e74c3c)**: Adjourned, delete actions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/judge` - Judge login
- `POST /api/auth/login/admin` - Admin login

### Users
- `POST /api/users/register` - Register new user
- `GET /api/users/{user_id}` - Get user details

### Cases
- `POST /api/cases/file` - File new case (with file upload)
- `GET /api/cases/user/{user_id}` - Get user's cases
- `GET /api/cases/judge/{judge_id}` - Get judge's cases
- `GET /api/cases/{case_id}` - Get case details
- `GET /api/cases/` - Get all cases (admin)

### Judges
- `POST /api/judges/register` - Register judge
- `GET /api/judges/{judge_id}` - Get judge details
- `GET /api/judges/{judge_id}/analytics` - Get judge analytics
- `POST /api/judges/schedule-hearing` - Schedule next hearing
- `POST /api/judges/close-case` - Close case with judgment

### Admins
- `GET /api/admins/analytics` - System analytics
- `GET /api/admins/cases` - All cases
- `GET /api/admins/users` - All users
- `GET /api/admins/judges` - All judges
- `PUT /api/admins/cases/{case_id}` - Update case
- `DELETE /api/admins/cases/{case_id}` - Delete case
- `DELETE /api/admins/users/{user_id}` - Delete user
- `DELETE /api/admins/judges/{judge_id}` - Delete judge

## 📁 Project Structure

```
project-root/
├── Back-End/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py              # JWT authentication
│   │   ├── config.py            # Environment config
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── scheduler.py         # Multi-level queue algorithm
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py          # Auth endpoints
│   │       ├── users.py         # User endpoints
│   │       ├── judges.py        # Judge endpoints
│   │       ├── admins.py        # Admin endpoints
│   │       └── cases.py         # Case endpoints
│   ├── uploads/                 # File storage
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   ├── database_schema.sql     # MySQL schema
│   ├── seed_data.py            # Sample data script
│   ├── README.md               # Backend docs
│   └── SETUP_GUIDE.md          # Setup instructions
│
├── Front-End/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/             # Images
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Policy.jsx
│   │   │   └── SharedNavbar.jsx
│   │   ├── data/               # Legacy data files
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── UserSignupPage.jsx
│   │   │   ├── UserLoginPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserFileCasePage.jsx
│   │   │   ├── UserCheckStatusPage.jsx
│   │   │   ├── JudgeLoginPage.jsx
│   │   │   ├── JudgeDashboard.jsx
│   │   │   ├── JudgeCasesPage.jsx
│   │   │   ├── JudgeAnalyticsPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminAnalyticsPage.jsx
│   │   │   └── AdminManageRecordsPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── PROJECT_DOCUMENTATION.md    # This file
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**
```
Solution: 
1. Ensure MySQL is running in XAMPP
2. Check DATABASE_URL in .env
3. Verify database exists: case_management
4. Test connection: mysql -u root -p
```

**Import Errors**
```
Solution:
1. Activate virtual environment
2. Reinstall: pip install -r requirements.txt
3. Check Python version: python --version (3.8+)
```

**File Upload Errors**
```
Solution:
1. Check uploads/ directory exists
2. Verify write permissions
3. Check file size limits
```

### Frontend Issues

**Cannot Connect to Backend**
```
Solution:
1. Ensure backend is running on port 8000
2. Check CORS settings in main.py
3. Verify API endpoint URLs in frontend code
```

**Build Errors**
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Clear cache: npm cache clean --force
```

**Routing Issues**
```
Solution:
1. Check React Router configuration
2. Verify all routes in App.jsx
3. Ensure BrowserRouter is properly set up
```

## 🚀 Deployment Considerations

### Backend Deployment
1. Use production WSGI server (Gunicorn)
2. Set strong SECRET_KEY
3. Use environment variables
4. Enable HTTPS
5. Configure proper CORS origins
6. Set up database backups
7. Implement rate limiting

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files
3. Configure environment variables
4. Update API base URL
5. Enable HTTPS
6. Set up CDN for assets

## 📈 Future Enhancements

1. **Email Notifications**: Send hearing reminders
2. **SMS Integration**: Case status updates
3. **Document Preview**: View PDFs in browser
4. **Advanced Search**: Filter and search cases
5. **Calendar View**: Visual schedule representation
6. **Reports Generation**: PDF reports for cases
7. **Audit Logs**: Track all system changes
8. **Multi-language Support**: Internationalization
9. **Mobile App**: Native iOS/Android apps
10. **Video Conferencing**: Virtual hearings

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review API docs at http://localhost:8000/docs
3. Check console logs for errors
4. Verify database schema is correct

## 📄 License

This project is for educational purposes.

---

**Last Updated**: November 2024
**Version**: 1.0.0
