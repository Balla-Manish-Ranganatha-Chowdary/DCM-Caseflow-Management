from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, ForeignKey, Date, Time, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class CaseComplexity(str, enum.Enum):
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    HIGHLY_COMPLEX = "highly_complex"

class CaseStatus(str, enum.Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ADJOURNED = "adjourned"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    cases = relationship("Case", back_populates="user")

class Judge(Base):
    __tablename__ = "judges"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    cases = relationship("Case", back_populates="judge")
    schedules = relationship("JudgeSchedule", back_populates="judge")

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    complexity = Column(Enum(CaseComplexity), nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.PENDING)
    priority_score = Column(Integer, default=0)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    judge_id = Column(Integer, ForeignKey("judges.id"), nullable=True)
    
    filed_at = Column(DateTime(timezone=True), server_default=func.now())
    scheduled_date = Column(Date, nullable=True)
    scheduled_time = Column(Time, nullable=True)
    estimated_duration = Column(Integer, nullable=True)  # in minutes
    
    # File upload support
    document_path = Column(String(500), nullable=True)
    document_filename = Column(String(200), nullable=True)
    
    # Judgment details
    judgment = Column(Text, nullable=True)
    judgment_date = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="cases")
    judge = relationship("Judge", back_populates="cases")
    hearings = relationship("Hearing", back_populates="case")

class Hearing(Base):
    __tablename__ = "hearings"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    hearing_number = Column(Integer, nullable=False)
    scheduled_date = Column(Date, nullable=False)
    scheduled_time = Column(Time, nullable=False)
    duration = Column(Integer, nullable=False)  # in minutes
    status = Column(String(50), default="scheduled")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    case = relationship("Case", back_populates="hearings")

class JudgeSchedule(Base):
    __tablename__ = "judge_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    judge_id = Column(Integer, ForeignKey("judges.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    notes = Column(String(200), nullable=True)
    
    judge = relationship("Judge", back_populates="schedules")
    
    class Config:
        indexes = [
            {"fields": ["judge_id", "date"], "unique": False}
        ]
