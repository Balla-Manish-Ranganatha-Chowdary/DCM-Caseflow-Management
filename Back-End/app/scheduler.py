from datetime import datetime, date, time, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import Case, Judge, JudgeSchedule, Hearing, CaseComplexity, CaseStatus
from typing import Optional, Tuple, List
import random

class MultiLevelQueueScheduler:
    """
    P-MLQ (Prioritized Multi-Level Queue) Scheduler
    Implements bi-preferential scheduling:
    - Queue 3 (Complex/Highly Complex): DATE PREFERENCE - earliest possible date
    - Queue 2 (Moderate): Balanced FCFS
    - Queue 1 (Simple): TIME PREFERENCE - specific time blocks (mornings)
    
    Judge workday: 8 hours (9 AM - 5 PM)
    - Lunch break: 1 PM - 2 PM (1 hour)
    - Short breaks: 11 AM - 11:15 AM, 3:30 PM - 3:45 PM (15 min each)
    - Effective work time: 6.5 hours per day
    
    CRITICAL: Never reschedule existing cases
    """
    
    # Working hours configuration (8-hour workday)
    WORK_START_HOUR = 9  # 9 AM
    WORK_END_HOUR = 17   # 5 PM (8 hours total)
    
    # Break times
    LUNCH_START = time(13, 0)  # 1:00 PM
    LUNCH_END = time(14, 0)    # 2:00 PM
    MORNING_BREAK_START = time(11, 0)   # 11:00 AM
    MORNING_BREAK_END = time(11, 15)    # 11:15 AM
    AFTERNOON_BREAK_START = time(15, 30)  # 3:30 PM
    AFTERNOON_BREAK_END = time(15, 45)    # 3:45 PM
    
    # Time blocks for Queue 1 (Simple cases) - TIME PREFERENCE
    Q1_TIME_BLOCKS = [
        (time(9, 0), time(11, 0)),    # Morning block 9-11 AM
        (time(11, 15), time(13, 0)),  # Late morning 11:15 AM - 1 PM
    ]
    
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
    
    def is_break_time(self, check_time: time) -> bool:
        """Check if given time falls within any break period"""
        return (
            (self.LUNCH_START <= check_time < self.LUNCH_END) or
            (self.MORNING_BREAK_START <= check_time < self.MORNING_BREAK_END) or
            (self.AFTERNOON_BREAK_START <= check_time < self.AFTERNOON_BREAK_END)
        )
    
    def get_available_time_slots(self, judge_id: int, target_date: date, 
                                 queue_level: int = None) -> List[Tuple[time, time]]:
        """
        Get available time slots for a judge on a specific date
        For Queue 1 (simple cases), only return slots in designated time blocks
        """
        slots = []
        current_time = datetime.combine(target_date, time(self.WORK_START_HOUR, 0))
        end_time = datetime.combine(target_date, time(self.WORK_END_HOUR, 0))
        
        # Get existing schedules - NEVER modify these
        existing_schedules = self.db.query(JudgeSchedule).filter(
            and_(
                JudgeSchedule.judge_id == judge_id,
                JudgeSchedule.date == target_date
            )
        ).all()
        
        while current_time < end_time:
            slot_end = current_time + timedelta(minutes=self.SLOT_DURATION)
            current_time_only = current_time.time()
            
            # Skip all break times
            if self.is_break_time(current_time_only):
                current_time += timedelta(minutes=self.SLOT_DURATION)
                continue
            
            # For Queue 1 (simple cases), only consider designated time blocks
            if queue_level == 1:
                in_time_block = False
                for block_start, block_end in self.Q1_TIME_BLOCKS:
                    if block_start <= current_time_only < block_end:
                        in_time_block = True
                        break
                if not in_time_block:
                    current_time += timedelta(minutes=self.SLOT_DURATION)
                    continue
            
            # Check if slot conflicts with existing schedules
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
    
    def find_next_available_slot(self, judge_id: int, duration: int, 
                                 complexity: CaseComplexity, start_date: date = None) -> Optional[Tuple[date, time]]:
        """
        Find next available slot implementing P-MLQ bi-preferential policy:
        - Queue 3 (Complex/Highly Complex): DATE PREFERENCE - earliest date
        - Queue 2 (Moderate): Balanced approach
        - Queue 1 (Simple): TIME PREFERENCE - specific morning blocks
        
        NEVER reschedules existing cases
        """
        if start_date is None:
            start_date = date.today() + timedelta(days=1)  # Start from tomorrow
        
        # Determine queue level
        if complexity in [CaseComplexity.COMPLEX, CaseComplexity.HIGHLY_COMPLEX]:
            queue_level = 3  # High priority - DATE PREFERENCE
        elif complexity == CaseComplexity.MODERATE:
            queue_level = 2  # Medium priority - Balanced
        else:
            queue_level = 1  # Low priority - TIME PREFERENCE
        
        # Search for up to 90 days
        for day_offset in range(90):
            check_date = start_date + timedelta(days=day_offset)
            
            # Skip weekends
            if check_date.weekday() >= 5:
                continue
            
            # Get available slots based on queue level
            available_slots = self.get_available_time_slots(judge_id, check_date, queue_level)
            
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
        """
        Schedule a case using P-MLQ algorithm
        Implements bi-preferential scheduling without rescheduling existing cases
        """
        # Assign priority score based on complexity
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
        
        # Find available slot using P-MLQ policy
        # CRITICAL: This will NEVER reschedule existing cases
        slot = self.find_next_available_slot(case.judge_id, duration, case.complexity)
        if not slot:
            # If no slot found, case remains pending
            return False
        
        scheduled_date, scheduled_time = slot
        
        # Update case status
        case.scheduled_date = scheduled_date
        case.scheduled_time = scheduled_time
        case.status = CaseStatus.SCHEDULED
        
        # Create judge schedule entry (blocking this time slot)
        end_time = (datetime.combine(scheduled_date, scheduled_time) + 
                   timedelta(minutes=duration)).time()
        
        judge_schedule = JudgeSchedule(
            judge_id=case.judge_id,
            date=scheduled_date,
            start_time=scheduled_time,
            end_time=end_time,
            is_available=False,
            case_id=case.id,
            notes=f"Q{3 if case.complexity in [CaseComplexity.COMPLEX, CaseComplexity.HIGHLY_COMPLEX] else (2 if case.complexity == CaseComplexity.MODERATE else 1)} - {case.case_number}"
        )
        
        self.db.add(judge_schedule)
        self.db.commit()
        
        return True
    
    def schedule_next_hearing(self, case: Case) -> Optional[Hearing]:
        """
        Schedule next hearing for a case using P-MLQ algorithm
        Hearings are scheduled at least 7 days from today
        """
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
        
        # Use P-MLQ algorithm to find slot
        slot = self.find_next_available_slot(case.judge_id, duration, case.complexity, start_date)
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
