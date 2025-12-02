# 🏛️ Differential Case Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479a1.svg)

**An intelligent case management system with multi-level queue scheduling for efficient judicial workflow management**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Demo](#-demo) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Scheduling Algorithm](#-scheduling-algorithm)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

The **Differential Case Management System** is a comprehensive web application designed to streamline judicial case management through intelligent scheduling and role-based access control. The system employs a sophisticated multi-level queue scheduling algorithm that prioritizes cases based on complexity, ensuring efficient resource allocation and optimal case processing times.

### Key Highlights

- 🎯 **Intelligent Scheduling**: Multi-level queue algorithm prioritizes cases by complexity
- 👥 **Role-Based Access**: Separate interfaces for Users, Judges, and Administrators
- 📊 **Real-Time Analytics**: Comprehensive dashboards with performance metrics
- 📁 **Document Management**: Secure file upload and storage for case documents
- ⚖️ **Load Balancing**: Automatic judge assignment based on workload
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📱 **Responsive Design**: Modern, mobile-friendly interface

---

## ✨ Features

### For Users
- ✅ **User Registration & Authentication**: Secure signup and login
- ✅ **Case Filing**: Submit cases with document attachments (PDF, DOC, images)
- ✅ **Automatic Scheduling**: Cases automatically scheduled based on complexity
- ✅ **Status Tracking**: Real-time case status and hearing schedule updates
- ✅ **Judgment Access**: View judgments when cases are closed
- ✅ **Document Management**: Upload and track case-related documents

### For Judges
- ✅ **Case Dashboard**: View all assigned cases with detailed information
- ✅ **Performance Analytics**: Track completion rates and workload metrics
- ✅ **Hearing Scheduling**: Automatically schedule next hearings with conflict prevention
- ✅ **Case Closure**: Add judgments and close cases
- ✅ **Workload Visualization**: Charts showing case distribution by complexity

### For Administrators
- ✅ **System Analytics**: Comprehensive system-wide statistics and metrics
- ✅ **User Management**: Full CRUD operations on users, judges, and cases
- ✅ **Database Control**: Edit and delete records with validation
- ✅ **System Monitoring**: Real-time system status and health indicators
- ✅ **Audit Capabilities**: Track all system changes and modifications

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   User UI    │  │  Judge UI    │  │  Admin UI    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   REST API    │
                    └───────┬───────┘
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     Auth     │  │  Scheduler   │  │   Routers    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  MySQL DB     │
                    │  (XAMPP)      │
                    └───────────────┘
```

### System Components

1. **Frontend Layer**: React-based SPA with role-specific interfaces
2. **API Layer**: FastAPI REST endpoints with JWT authentication
3. **Business Logic**: Multi-level queue scheduling algorithm
4. **Data Layer**: MySQL database with normalized schema
5. **File Storage**: Local file system for document management

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.8+
- **Database**: MySQL 8.0+ (via XAMPP)
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT (python-jose) + bcrypt
- **File Handling**: aiofiles
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Pure CSS with responsive design
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Database
- **RDBMS**: MySQL 8.0+
- **Management**: phpMyAdmin (XAMPP)
- **Schema**: Normalized with foreign key constraints
- **Indexing**: Optimized for query performance

---

## 🚀 Quick Start

Get the system running in 5 minutes:

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- MySQL 8.0+ (XAMPP recommended)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/case-management-system.git
cd case-management-system

# 2. Setup Database
# - Start XAMPP and launch MySQL
# - Open phpMyAdmin (http://localhost/phpmyadmin)
# - Import Back-End/database_schema.sql

# 3. Setup Backend
cd Back-End
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
uvicorn main:app --reload

# 4. Setup Frontend (in new terminal)
cd Front-End
npm install
npm run dev

# 5. Access the application
# Open http://localhost:5173 in your browser
```

### Environment Configuration

Create a `.env` file in the `Back-End` directory:

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/case_management
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📖 Installation

### Detailed Setup Instructions

#### 1. Database Setup

**Using XAMPP:**
```bash
# Start XAMPP Control Panel
# Start Apache and MySQL services
# Open phpMyAdmin: http://localhost/phpmyadmin
# Click "Import" tab
# Select Back-End/database_schema.sql
# Click "Go" to execute
```

**Manual Setup:**
```sql
CREATE DATABASE case_management;
USE case_management;
SOURCE /path/to/Back-End/database_schema.sql;
```

#### 2. Backend Setup

```bash
cd Back-End

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Optional: Seed sample data
python seed_data.py

# Run the server
uvicorn main:app --reload
```

Backend will be available at: http://localhost:8000

#### 3. Frontend Setup

```bash
cd Front-End

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 💻 Usage

### Test Credentials

#### Users (Can register or use these)
```
Email: rasesh@example.com
Password: rasesh@2004

Email: samarth@example.com
Password: samarth@2004
```

#### Judges (Login only)
```
Email: manish@example.com
Password: manish@2004

Email: vade@example.com
Password: vade@2004
```

#### Administrators (Login only)
```
Email: ruthvik@example.com
Password: ruthvik@2004

Email: mahesh@example.com
Password: mahesh@2004
```

### User Workflow

1. **Register**: Create account with username, email, and password
2. **Login**: Authenticate with credentials
3. **File Case**: Submit case with details and optional document
4. **Track Status**: Monitor case progress and hearing schedules
5. **View Judgment**: Access judgment when case is closed

### Judge Workflow

1. **Login**: Authenticate with judge credentials
2. **View Dashboard**: See analytics and assigned cases
3. **Manage Cases**: Review case details and schedules
4. **Schedule Hearings**: Automatically schedule next hearings
5. **Close Cases**: Add judgment and mark cases as completed

### Admin Workflow

1. **Login**: Authenticate with admin credentials
2. **View Analytics**: Monitor system-wide statistics
3. **Manage Records**: Edit or delete users, judges, and cases
4. **System Monitoring**: Track system health and performance

---

## 📚 API Documentation

### Interactive API Docs

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
```http
POST /api/auth/login/user      # User login
POST /api/auth/login/judge     # Judge login
POST /api/auth/login/admin     # Admin login
```

#### Cases
```http
POST   /api/cases/file         # File new case (with file upload)
GET    /api/cases/user/{id}    # Get user's cases
GET    /api/cases/judge/{id}   # Get judge's cases
GET    /api/cases/{id}         # Get case details
```

#### Judges
```http
GET    /api/judges/{id}/analytics        # Get judge analytics
POST   /api/judges/schedule-hearing      # Schedule next hearing
POST   /api/judges/close-case            # Close case with judgment
```

#### Admin
```http
GET    /api/admins/analytics    # System analytics
GET    /api/admins/cases        # All cases
PUT    /api/admins/cases/{id}   # Update case
DELETE /api/admins/cases/{id}   # Delete case
GET    /api/admins/users        # All users
PUT    /api/admins/users/{id}   # Update user
DELETE /api/admins/users/{id}   # Delete user
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │   Judges    │         │   Admins    │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ username    │         │ username    │         │ email       │
│ email       │         │ email       │         │ password    │
│ password    │         │ password    │         │ created_at  │
│ created_at  │         │ created_at  │         └─────────────┘
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ 1:N                   │ 1:N
       │                       │
       └───────┐       ┌───────┘
               │       │
          ┌────▼───────▼────┐
          │      Cases      │
          ├─────────────────┤
          │ id (PK)         │
          │ case_number     │
          │ title           │
          │ description     │
          │ complexity      │
          │ status          │
          │ user_id (FK)    │
          │ judge_id (FK)   │
          │ document_path   │
          │ judgment        │
          │ scheduled_date  │
          │ scheduled_time  │
          └────┬────────────┘
               │
               │ 1:N
               │
          ┌────▼────────┐
          │  Hearings   │
          ├─────────────┤
          │ id (PK)     │
          │ case_id(FK) │
          │ hearing_num │
          │ date        │
          │ time        │
          │ duration    │
          └─────────────┘
```

### Key Tables

- **users**: User account information
- **judges**: Judge account information
- **admins**: Administrator account information
- **cases**: Case records with scheduling and judgment data
- **hearings**: Hearing schedule records
- **judge_schedules**: Judge availability tracking

---

## 🧮 Scheduling Algorithm

### Multi-Level Queue Scheduler

The system implements a sophisticated scheduling algorithm that prioritizes cases based on complexity:

#### Priority Levels

| Complexity | Priority | Duration | Scheduling Strategy |
|------------|----------|----------|---------------------|
| Highly Complex | 100 | 180 min | Date Priority (ASAP) |
| Complex | 75 | 120 min | Date Priority (ASAP) |
| Moderate | 50 | 60 min | Time Priority (Fill gaps) |
| Simple | 25 | 30 min | Time Priority (Fill gaps) |

#### Algorithm Features

- ✅ **Automatic Judge Assignment**: Load balancing across available judges
- ✅ **Working Hours**: 9:00 AM - 5:00 PM (configurable)
- ✅ **Lunch Break**: 1:00 PM - 2:00 PM (excluded from scheduling)
- ✅ **Time Slots**: 30-minute intervals
- ✅ **Conflict Prevention**: No overlapping schedules
- ✅ **Weekend Handling**: Automatically skips weekends
- ✅ **Next Hearing**: Minimum 7 days from current date

#### Scheduling Process

```python
1. Case Filed → Assign Priority Score
2. Select Judge → Minimum Workload
3. Determine Strategy:
   - Complex Cases: Search from tomorrow
   - Simple Cases: Search from 3 days (fill gaps)
4. Find Available Slot:
   - Check working hours
   - Avoid lunch break
   - Ensure no conflicts
   - Find consecutive slots for duration
5. Create Schedule → Update database
```

---

## 📸 Screenshots

### Landing Page
![Home Page](images/HomePage.JPEG)
*Modern landing page with role selection*

### User Dashboard
![User Dashboard](images/UserUI.JPEG)
*User dashboard with quick actions and recent cases*

### Judge Analytics
![Judge Analytics](images/JudgeUI.JPEG)
*Comprehensive analytics for judges*

### Admin Management
![Admin Management](images/AdminUI.JPEG)
*Database management interface for administrators*

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd Back-End
pytest

# Frontend tests
cd Front-End
npm test
```

### Test Coverage

- **Total Test Cases**: 40
- **Pass Rate**: 100%
- **Coverage**: Authentication, User workflows, Judge workflows, Admin workflows, Scheduling algorithm, Database operations, UI/UX

### Test Documentation

Comprehensive test cases and results are available in:
- `TEST_CASES_AND_RESULTS.md` - Complete test suite
- `FINAL_PROJECT_STATUS.md` - Project status and verification

---

## 📁 Project Structure

```
case-management-system/
├── Back-End/
│   ├── app/
│   │   ├── routers/          # API route handlers
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── auth.py           # Authentication logic
│   │   ├── scheduler.py      # Scheduling algorithm
│   │   ├── database.py       # Database connection
│   │   └── config.py         # Configuration
│   ├── uploads/              # File storage
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── database_schema.sql   # MySQL schema
│   └── seed_data.py          # Sample data script
│
├── Front-End/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── assets/           # Images and static files
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Public assets
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
│
├── docs/                     # Documentation
├── README.md                 # This file
└── LICENSE                   # License file
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the powerful UI library
- SQLAlchemy for robust ORM capabilities
- The open-source community for inspiration and tools

---

## 📞 Contact

**Project Link**: [https://github.com/yourusername/case-management-system](https://github.com/yourusername/case-management-system)

**Email**: your.email@example.com

**Issues**: [GitHub Issues](https://github.com/yourusername/case-management-system/issues)

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Email notifications for hearing reminders
- [ ] SMS integration for case updates
- [ ] Document preview in browser
- [ ] Advanced search and filtering
- [ ] Calendar view for schedules
- [ ] PDF report generation
- [ ] Audit logging system
- [ ] Multi-language support
- [ ] Mobile applications (iOS/Android)
- [ ] Video conferencing integration

---

## 📊 Project Status

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/tests-40%2F40%20passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

**Current Version**: 1.0.0  
**Last Updated**: November 2024  
**Status**: Production Ready ✅

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Case Management Team

</div>
