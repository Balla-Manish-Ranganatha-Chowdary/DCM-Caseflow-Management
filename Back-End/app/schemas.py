from pydantic import BaseModel, EmailStr
from datetime import datetime, date, time
from typing import Optional, List
from enum import Enum

class CaseComplexity(str, Enum):
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    HIGHLY_COMPLEX = "highly_complex"

class CaseStatus(str, Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ADJOURNED = "adjourned"

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class JudgeBase(BaseModel):
    username: str
    email: EmailStr

class JudgeCreate(JudgeBase):
    password: str

class JudgeResponse(JudgeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AdminBase(BaseModel):
    email: EmailStr

class AdminCreate(AdminBase):
    password: str

class AdminResponse(AdminBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    username: Optional[str] = None

class CaseCreate(BaseModel):
    title: str
    description: str
    complexity: CaseComplexity

class CaseResponse(BaseModel):
    id: int
    case_number: str
    title: str
    description: str
    complexity: CaseComplexity
    status: CaseStatus
    priority_score: int
    user_id: int
    judge_id: Optional[int]
    filed_at: datetime
    scheduled_date: Optional[date]
    scheduled_time: Optional[time]
    estimated_duration: Optional[int]
    document_filename: Optional[str]
    judgment: Optional[str]
    judgment_date: Optional[datetime]
    closed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    complexity: Optional[CaseComplexity] = None
    status: Optional[CaseStatus] = None
    judgment: Optional[str] = None

class CloseCaseRequest(BaseModel):
    case_id: int
    judgment: str

class JudgeAnalytics(BaseModel):
    total_cases: int
    pending_cases: int
    scheduled_cases: int
    completed_cases: int
    cases_this_month: int

class AdminAnalytics(BaseModel):
    total_cases: int
    total_users: int
    total_judges: int
    pending_cases: int
    scheduled_cases: int
    completed_cases: int
    cases_this_month: int

class HearingResponse(BaseModel):
    id: int
    case_id: int
    hearing_number: int
    scheduled_date: date
    scheduled_time: time
    duration: int
    status: str
    notes: Optional[str]
    
    class Config:
        from_attributes = True

class ScheduleHearingRequest(BaseModel):
    case_id: int

class ScheduleHearingResponse(BaseModel):
    message: str
    hearing: HearingResponse
    case: CaseResponse
