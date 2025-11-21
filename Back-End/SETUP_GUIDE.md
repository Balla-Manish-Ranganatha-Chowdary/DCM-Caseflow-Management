# Setup Guide - Differential Case Flow Management System

## Prerequisites
- Python 3.8+
- MySQL 8.0+
- Node.js 16+ (for frontend)

## Backend Setup

### 1. Install MySQL
Make sure MySQL is installed and running on your system.

### 2. Create Database
```sql
CREATE DATABASE case_management;
```

### 3. Setup Python Environment
```bash
cd Back-End
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/case_management
SECRET_KEY=change-this-to-a-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 6. Seed Initial Data
```bash
python seed_data.py
```

This will create test users, judges, and admins.

### 7. Run Backend Server
```bash
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd Front-End
npm install
```

### 2. Run Frontend
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Test Credentials

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

## Testing the System

### 1. Login as User
- Go to `http://localhost:5173/user-login-page`
- Login with user credentials
- File a new case with different complexity levels
- View scheduled date and time

### 2. Login as Judge
- Go to `http://localhost:5173/judge-login-page`
- Login with judge credentials
- View assigned cases
- Click "Schedule Next Hearing" for any case

### 3. Verify Scheduling
- Complex cases get earlier dates
- Simple cases fill available time slots
- No schedule conflicts
- Working hours: 9 AM - 5 PM
- Lunch break: 1 PM - 2 PM

## API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Import Errors
- Activate virtual environment
- Reinstall requirements: `pip install -r requirements.txt`

### Frontend Not Connecting
- Ensure backend is running on port 8000
- Check CORS settings in main.py
- Verify API endpoint URLs in frontend code
