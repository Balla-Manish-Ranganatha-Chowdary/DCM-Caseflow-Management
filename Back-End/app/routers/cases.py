from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import Case, User, CaseStatus
from app.schemas import CaseCreate, CaseResponse
from app.scheduler import MultiLevelQueueScheduler
from typing import List, Optional
from datetime import datetime
import os
import uuid

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_case_number() -> str:
    """Generate unique case number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"CASE-{timestamp}"

def calculate_complexity_from_sections(sections_str: str) -> str:
    """
    Calculate case complexity based on number of legal sections involved
    Following P-MLQ rubric:
    - 1-2 sections: simple
    - 3-4 sections: moderate  
    - 5-7 sections: complex
    - 8+ sections: highly_complex
    """
    if not sections_str:
        return 'simple'
    
    sections = [s.strip() for s in sections_str.split(',') if s.strip()]
    num_sections = len(sections)
    
    if num_sections <= 2:
        return 'simple'
    elif num_sections <= 4:
        return 'moderate'
    elif num_sections <= 7:
        return 'complex'
    else:
        return 'highly_complex'

@router.post("/file", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def file_case(
    title: str = Form(...),
    description: str = Form(...),
    sections: str = Form(...),
    user_id: int = Form(...),
    document: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """File a new case with optional document upload"""
    try:
        # Verify user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Calculate complexity from sections
        complexity = calculate_complexity_from_sections(sections)
        
        # Handle file upload
        document_path = None
        document_filename = None
        if document and document.filename:
            try:
                # Generate unique filename
                file_extension = document.filename.split('.')[-1] if '.' in document.filename else 'bin'
                unique_filename = f"{uuid.uuid4()}.{file_extension}"
                document_path = os.path.join(UPLOAD_DIR, unique_filename)
                document_filename = document.filename
                
                # Save file
                content = await document.read()
                with open(document_path, 'wb') as f:
                    f.write(content)
            except Exception as e:
                print(f"File upload error: {e}")
                # Continue without document if upload fails
                document_path = None
                document_filename = None
        
        # Create case
        new_case = Case(
            case_number=generate_case_number(),
            title=title,
            description=description,
            sections=sections,
            complexity=complexity,
            user_id=user_id,
            status=CaseStatus.PENDING,
            document_path=document_path,
            document_filename=document_filename
        )
        
        db.add(new_case)
        db.commit()
        db.refresh(new_case)
        
        # Schedule the case using multi-level queue algorithm
        try:
            scheduler = MultiLevelQueueScheduler(db)
            scheduled = scheduler.schedule_case(new_case)
            
            if not scheduled:
                # Case is filed but not scheduled yet
                print("Warning: Case filed but not scheduled")
        except Exception as e:
            print(f"Scheduling error: {e}")
            # Continue even if scheduling fails
        
        db.refresh(new_case)
        return new_case
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error filing case: {e}")
        raise HTTPException(status_code=500, detail=f"Error filing case: {str(e)}")

@router.get("/user/{user_id}", response_model=List[CaseResponse])
def get_user_cases(user_id: int, db: Session = Depends(get_db)):
    """Get all cases filed by a user"""
    cases = db.query(Case).filter(Case.user_id == user_id).order_by(Case.filed_at.desc()).all()
    return cases

@router.get("/judge/{judge_id}", response_model=List[CaseResponse])
def get_judge_cases(judge_id: int, db: Session = Depends(get_db)):
    """Get all cases assigned to a judge"""
    cases = db.query(Case).filter(
        Case.judge_id == judge_id
    ).order_by(Case.scheduled_date, Case.scheduled_time).all()
    return cases

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get case details"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.get("/", response_model=List[CaseResponse])
def get_all_cases(db: Session = Depends(get_db)):
    """Get all cases (admin only)"""
    cases = db.query(Case).order_by(Case.filed_at.desc()).all()
    return cases
