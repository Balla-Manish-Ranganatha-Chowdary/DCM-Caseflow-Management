from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.database import get_db
from app.models import Judge, Case, Hearing, CaseStatus
from app.schemas import JudgeCreate, JudgeResponse, ScheduleHearingRequest, ScheduleHearingResponse, CloseCaseRequest, JudgeAnalytics
from app.auth import get_password_hash
from app.scheduler import MultiLevelQueueScheduler
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/register", response_model=JudgeResponse, status_code=status.HTTP_201_CREATED)
def register_judge(judge: JudgeCreate, db: Session = Depends(get_db)):
    db_judge = db.query(Judge).filter(Judge.email == judge.email).first()
    if db_judge:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(judge.password)
    new_judge = Judge(username=judge.username, email=judge.email, password=hashed_password)
    db.add(new_judge)
    db.commit()
    db.refresh(new_judge)
    return new_judge

@router.get("/{judge_id}", response_model=JudgeResponse)
def get_judge(judge_id: int, db: Session = Depends(get_db)):
    judge = db.query(Judge).filter(Judge.id == judge_id).first()
    if not judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    return judge

@router.get("/{judge_id}/analytics", response_model=JudgeAnalytics)
def get_judge_analytics(judge_id: int, db: Session = Depends(get_db)):
    """Get analytics for a specific judge"""
    judge = db.query(Judge).filter(Judge.id == judge_id).first()
    if not judge:
        raise HTTPException(status_code=404, detail="Judge not found")
    
    # Calculate analytics
    total_cases = db.query(Case).filter(Case.judge_id == judge_id).count()
    pending_cases = db.query(Case).filter(and_(Case.judge_id == judge_id, Case.status == CaseStatus.PENDING)).count()
    scheduled_cases = db.query(Case).filter(and_(Case.judge_id == judge_id, Case.status == CaseStatus.SCHEDULED)).count()
    completed_cases = db.query(Case).filter(and_(Case.judge_id == judge_id, Case.status == CaseStatus.COMPLETED)).count()
    
    # Cases this month
    current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    cases_this_month = db.query(Case).filter(
        and_(Case.judge_id == judge_id, Case.filed_at >= current_month)
    ).count()
    
    return JudgeAnalytics(
        total_cases=total_cases,
        pending_cases=pending_cases,
        scheduled_cases=scheduled_cases,
        completed_cases=completed_cases,
        cases_this_month=cases_this_month
    )

@router.post("/schedule-hearing", response_model=ScheduleHearingResponse)
def schedule_next_hearing(request: ScheduleHearingRequest, judge_id: int, db: Session = Depends(get_db)):
    """Schedule next hearing for a case"""
    # Verify case exists and is assigned to this judge
    case = db.query(Case).filter(Case.id == request.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if case.judge_id != judge_id:
        raise HTTPException(status_code=403, detail="Case not assigned to this judge")
    
    # Use scheduler to find next available slot
    scheduler = MultiLevelQueueScheduler(db)
    hearing = scheduler.schedule_next_hearing(case)
    
    if not hearing:
        raise HTTPException(
            status_code=500,
            detail="Could not schedule hearing. No available slots found."
        )
    
    return {
        "message": "Hearing scheduled successfully",
        "hearing": hearing,
        "case": case
    }

@router.post("/close-case")
def close_case(request: CloseCaseRequest, judge_id: int, db: Session = Depends(get_db)):
    """Close a case with judgment"""
    case = db.query(Case).filter(Case.id == request.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if case.judge_id != judge_id:
        raise HTTPException(status_code=403, detail="Case not assigned to this judge")
    
    # Update case with judgment
    case.status = CaseStatus.COMPLETED
    case.judgment = request.judgment
    case.judgment_date = datetime.utcnow()
    case.closed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(case)
    
    return {"message": "Case closed successfully", "case": case}
