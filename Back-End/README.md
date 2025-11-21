# Differential Case Flow Management System

Multi-role authentication system with intelligent case scheduling using multi-level queue algorithm.

## Features

- **Multi-Level Queue Scheduling**: Cases are prioritized based on complexity
  - Highly Complex & Complex: Date priority (scheduled ASAP)
  - Moderate & Simple: Time priority (fill available slots)
- **Automatic Judge Assignment**: Load balancing across judges
- **Smart Time Slot Management**: 8-hour workday with lunch breaks
- **Next Hearing Scheduling**: Judges can schedule follow-up hearings
- **Real-time Schedule Synchronization**: Both users and judges see updated schedules

## Setup

1. **Install Python dependencies:**
```bash
cd Back-End
pip install -r requirements.txt
```

2. **Setup MySQL Database:**
Create a MySQL database:
```sql
CREATE DATABASE case_management;
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/case_management
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. **Run the application:**
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Authentication
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/judge` - Judge login
- `POST /api/auth/login/admin` - Admin login

### Cases
- `POST /api/cases/file?user_id={id}` - File a new case (auto-schedules)
- `GET /api/cases/user/{user_id}` - Get user's cases
- `GET /api/cases/judge/{judge_id}` - Get judge's assigned cases
- `GET /api/cases/{case_id}` - Get case details

### Judges
- `POST /api/judges/register` - Register new judge
- `POST /api/judges/schedule-hearing?judge_id={id}` - Schedule next hearing

### Users
- `POST /api/users/register` - Register new user

### Admins
- `POST /api/admins/register` - Register new admin

## Case Complexity & Duration

- **Simple**: 30 minutes
- **Moderate**: 60 minutes
- **Complex**: 120 minutes
- **Highly Complex**: 180 minutes

## Scheduling Algorithm

The multi-level queue scheduler:
1. Assigns priority scores based on complexity
2. Assigns judge with minimum workload
3. For complex cases: prioritizes earliest available date
4. For simple cases: fills available time slots efficiently
5. Respects working hours (9 AM - 5 PM) and lunch break (1 PM - 2 PM)
6. Never modifies existing schedules
