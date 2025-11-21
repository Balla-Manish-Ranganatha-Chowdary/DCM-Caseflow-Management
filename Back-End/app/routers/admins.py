from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.database import get_db
from app.models import Admin, Case, User, Judge, CaseStatus
from app.schemas import AdminCreate, AdminResponse, AdminAnalytics, CaseResponse, CaseUpdate, UserResponse, JudgeResponse
from app.auth import get_password_hash
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/register", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.email == admin.email).first()
    if db_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(admin.password)
    new_admin = Admin(email=admin.email, password=hashed_password)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.get("/analytics", response_model=AdminAnalytics)
def get_admin_analytics(db: Session = Depends(get_db)):
    """Get system-wide analytics"""
    total_cases = db.query(Case).count()
    total_users = db.query(User).count()
    total_judges = db.query(Judge).count()
    pending_cases = db.query(Case).filter(Case.status == CaseStatus.PENDING).count()
    scheduled_cases = db.query(Case).filter(Case.status == CaseStatus.SCHEDULED).count()
    completed_cases = db.query(Case).filter(Case.status == CaseStatus.COMPLETED).count()
    
    # Cases this month
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    cases_this_month = db.query(Case).filter(Case.filed_at >= current_month).count()
    
    return AdminAnalytics(
        total_cases=total_cases,
        total_users=total_users,
        total_judges=total_judges,
        pending_cases=pending_cases,
        scheduled_cases=scheduled_cases,
        completed_cases=completed_cases,
        cases_this_month=cases_this_month
    )

# Case Management
@router.get("/cases", response_model=List[CaseResponse])
def get_all_cases(db: Session = Depends(get_db)):
    """Get all cases in the system"""
    cases = db.query(Case).order_by(Case.filed_at.desc()).all()
    return cases

@router.put("/cases/{case_id}", response_model=CaseResponse)
def update_case(case_id: int, case_update: CaseUpdate, db: Session = Depends(get_db)):
    """Update case details"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Update fields if provided
    if case_update.title is not None:
        case.title = case_update.title
    if case_update.description is not None:
        case.description = case_update.description
    if case_update.complexity is not None:
        case.complexity = case_update.complexity
    if case_update.status is not None:
        case.status = case_update.status
    if case_update.judgment is not None:
        case.judgment = case_update.judgment
        if case_update.status == CaseStatus.COMPLETED:
            case.judgment_date = datetime.utcnow()
            case.closed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(case)
    return case

@router.delete("/cases/{case_id}")
def delete_case(case_id: int, db: Session = Depends(get_db)):
    """Delete a case"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db.delete(case)
    db.commit()
    return {"message": "Case deleted successfully"}

# User Management
@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Judge Management
@router.get("/judges", response_model=List[JudgeResponse])
def get_all_judges(db: Session = Depends(get_db)):
    """Get all judges"""
    judges = db.query(Judge).order_by(Judge.created_at.desc()).all()
    return judges

@router.delete("/judges/{judge_id}")
def delete_judge(judge_id: int, db: Session = Depends(get_db)):
    """Delete a judge"""
    judge = db.query(Judge).filter(Judge.id == judge_id).first()
    if not judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    
    db.delete(judge)
    db.commit()
    return {"message": "Judge deleted successfully"}
