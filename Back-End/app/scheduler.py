from datetime import datetime, date, time, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import Case, Judge, JudgeSchedule, Hearing, CaseComplexity, CaseStatus
from typing import Optional, Tuple, List
import random

class MultiLevelQueueScheduler:
    """
    Multi-level queue scheduler for case management
    Priority levels based on complexity:
    1. Highly Complex - Highest priority, date-based scheduling
    2. Complex - High priority, date-based scheduling
    3. Moderate - Medium priority, time-based scheduling
    4. Simple - Lower priority, time-based scheduling
    """
    
    # Working hours configuration
    WORK_START_HOUR = 9  # 9 AM
    WORK_END_HOUR = 17   # 5 PM
    LUNCH_START_HOUR = 13  # 1 PM
    LUNCH_END_HOUR = 14    # 2 PM
    SLOT_DURATION = 30  # minutes
    
    # Duration estimates by complexity (in minutes)
    DURATION_MAP = {
        CaseComplexity.SIMPLE: 30,
        CaseComplexity.MODERATE: 60,
        CaseComplexity.COMPLEX: 120,
        CaseComplexity.HIGHLY_COMPLEX: 180
    }
    
    # Priority scores
    PRIORITY_MAP = {
        CaseComplexity.HIGHLY_COMPLEX: 100,
        CaseComplexity.COMPLEX: 75,
        CaseComplexity.MODERATE: 50,
        CaseComplexity.SIMPLE: 25
    }
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_available_time_slots(self, judge_id: int, target_date: date) -> List[Tuple[time, time]]:
        """Get available time slots for a judge on a specific date"""
        slots = []
        current_time = datetime.combine(target_date, time(self.WORK_START_HOUR, 0))
        end_time = datetime.combine(target_date, time(self.WORK_END_HOUR, 0))
        lunch_start = datetime.combine(target_date, time(self.LUNCH_START_HOUR, 0))
        lunch_end = datetime.combine(target_date, time(self.LUNCH_END_HOUR, 0))
        
        # Get existing schedules for this judge on this date
        existing_schedules = self.db.query(JudgeSchedule).filter(
            and_(
                JudgeSchedule.judge_id == judge_id,
                JudgeSchedule.date == target_date
            )
        ).all()
        
        while current_time < end_time:
            slot_end = current_time + timedelta(minutes=self.SLOT_DURATION)
            
            # Skip lunch time
            if lunch_start <= current_time < lunch_end:
                current_time = lunch_end
                continue
            
            # Check if slot is available
            is_available = True
            for schedule in existing_schedules:
                schedule_start = datetime.combine(target_date, schedule.start_time)
                schedule_end = datetime.combine(target_date, schedule.end_time)
                
                if not (slot_end <= schedule_start or current_time >= schedule_end):
                    is_available = False
                    break
            
            if is_available:
                slots.append((current_time.time(), slot_end.time()))
            
            current_time = slot_end
        
        return slots
    
    def find_next_available_slot(self, judge_id: int, duration: int, start_date: date = None) -> Optional[Tuple[date, time]]:
        """Find the next available slot for a case with given duration"""
        if start_date is None:
            start_date = date.today()
        
        # Search for up to 60 days
        for day_offset in range(60):
            check_date = start_date + timedelta(days=day_offset)
            
            # Skip weekends
            if check_date.weekday() >= 5:
                continue
            
            available_slots = self.get_available_time_slots(judge_id, check_date)
            
            # Find consecutive slots that can accommodate the duration
            required_slots = (duration + self.SLOT_DURATION - 1) // self.SLOT_DURATION
            
            for i in range(len(available_slots) - required_slots + 1):
                # Check if we have enough consecutive slots
                is_consecutive = True
                for j in range(required_slots - 1):
                    slot1_end = datetime.combine(check_date, available_slots[i + j][1])
                    slot2_start = datetime.combine(check_date, available_slots[i + j + 1][0])
                    if slot1_end != slot2_start:
                        is_consecutive = False
                        break
                
                if is_consecutive:
                    return (check_date, available_slots[i][0])
        
        return None
    
    def assign_judge(self) -> Optional[Judge]:
        """Assign a judge with least workload"""
        judges = self.db.query(Judge).all()
        if not judges:
            return None
        
        # Simple round-robin for now, can be enhanced with workload balancing
        judge_workload = []
        for judge in judges:
            active_cases = self.db.query(Case).filter(
                and_(
                    Case.judge_id == judge.id,
                    Case.status.in_([CaseStatus.SCHEDULED, CaseStatus.IN_PROGRESS])
                )
            ).count()
            judge_workload.append((judge, active_cases))
        
        # Return judge with minimum workload
        judge_workload.sort(key=lambda x: x[1])
        return judge_workload[0][0]
    
    def schedule_case(self, case: Case) -> bool:
        """Schedule a case using multi-level queue algorithm"""
        # Assign priority score
        case.priority_score = self.PRIORITY_MAP[case.complexity]
        
        # Assign judge if not already assigned
        if not case.judge_id:
            judge = self.assign_judge()
            if not judge:
                return False
            case.judge_id = judge.id
        
        # Get estimated duration
        duration = self.DURATION_MAP[case.complexity]
        case.estimated_duration = duration
        
        # For complex cases, prioritize date (earlier dates)
        # For simple cases, prioritize time (fill available slots)
        if case.complexity in [CaseComplexity.COMPLEX, CaseComplexity.HIGHLY_COMPLEX]:
            # Date priority - schedule as soon as possible
            start_date = date.today() + timedelta(days=1)
        else:
            # Time priority - can be scheduled further out to fill gaps
            start_date = date.today() + timedelta(days=3)
        
        # Find available slot
        slot = self.find_next_available_slot(case.judge_id, duration, start_date)
        if not slot:
            return False
        
        scheduled_date, scheduled_time = slot
        
        # Update case
        case.scheduled_date = scheduled_date
        case.scheduled_time = scheduled_time
        case.status = CaseStatus.SCHEDULED
        
        # Create judge schedule entry
        end_time = (datetime.combine(scheduled_date, scheduled_time) + 
                   timedelta(minutes=duration)).time()
        
        judge_schedule = JudgeSchedule(
            judge_id=case.judge_id,
            date=scheduled_date,
            start_time=scheduled_time,
            end_time=end_time,
            is_available=False,
            case_id=case.id,
            notes=f"Case {case.case_number} - {case.complexity.value}"
        )
        
        self.db.add(judge_schedule)
        self.db.commit()
        
        return True
    
    def schedule_next_hearing(self, case: Case) -> Optional[Hearing]:
        """Schedule next hearing for a case"""
        if not case.judge_id:
            return None
        
        # Get the last hearing number
        last_hearing = self.db.query(Hearing).filter(
            Hearing.case_id == case.id
        ).order_by(Hearing.hearing_number.desc()).first()
        
        next_hearing_number = (last_hearing.hearing_number + 1) if last_hearing else 1
        
        # Find next available slot (at least 7 days from now for next hearing)
        duration = self.DURATION_MAP[case.complexity]
        start_date = date.today() + timedelta(days=7)
        
        slot = self.find_next_available_slot(case.judge_id, duration, start_date)
        if not slot:
            return None
        
        scheduled_date, scheduled_time = slot
        
        # Create hearing record
        hearing = Hearing(
            case_id=case.id,
            hearing_number=next_hearing_number,
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            duration=duration,
            status="scheduled"
        )
        
        # Create judge schedule entry
        end_time = (datetime.combine(scheduled_date, scheduled_time) + 
                   timedelta(minutes=duration)).time()
        
        judge_schedule = JudgeSchedule(
            judge_id=case.judge_id,
            date=scheduled_date,
            start_time=scheduled_time,
            end_time=end_time,
            is_available=False,
            case_id=case.id,
            notes=f"Hearing #{next_hearing_number} - Case {case.case_number}"
        )
        
        self.db.add(hearing)
        self.db.add(judge_schedule)
        self.db.commit()
        self.db.refresh(hearing)
        
        return hearing
