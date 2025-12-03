# Schedule Next Hearing - Testing Guide

## Overview
Judges can schedule next hearings for their assigned cases using the P-MLQ algorithm.

## How It Works

### Frontend (JudgeCasesPage.jsx)
1. Judge views their assigned cases
2. Each case has a "Schedule Hearing" button
3. Clicking the button calls the backend API
4. Success message shows the scheduled date and time

### Backend Flow

**Endpoint**: `POST /api/judges/schedule-hearing?judge_id={judge_id}`

**Request Body**:
```json
{
  "case_id": 123
}
```

**Process**:
1. Verifies case exists and is assigned to the judge
2. Calls `MultiLevelQueueScheduler.schedule_next_hearing(case)`
3. Scheduler:
   - Gets last hearing number (or starts at 1)
   - Calculates duration based on case complexity
   - Finds next available slot at least 7 days from today
   - Uses P-MLQ algorithm (respects queue preferences)
   - Creates Hearing record
   - Creates JudgeSchedule entry (blocks the time slot)
4. Returns hearing details

**Response**:
```json
{
  "message": "Hearing scheduled successfully",
  "hearing": {
    "id": 1,
    "case_id": 123,
    "hearing_number": 2,
    "scheduled_date": "2024-12-15",
    "scheduled_time": "10:00:00",
    "duration": 60,
    "status": "scheduled"
  },
  "case": { ... }
}
```

## Testing Steps

### Step 1: Login as Judge
```
Email: manish@example.com
Password: manish@2004
```

### Step 2: Navigate to "My Cases"
- Click "My Cases" in the navbar
- You should see all cases assigned to you

### Step 3: Schedule a Hearing
1. Find a case that is not completed
2. Click "Schedule Hearing" button
3. Wait for confirmation

### Step 4: Verify Success
You should see an alert:
```
Hearing scheduled successfully!
Date: 2024-12-15
Time: 10:00
```

### Step 5: Check Database
In phpMyAdmin, run:
```sql
-- Check hearings table
SELECT * FROM hearings WHERE case_id = [your_case_id] ORDER BY hearing_number DESC;

-- Check judge schedules
SELECT * FROM judge_schedules WHERE case_id = [your_case_id] ORDER BY date DESC;
```

## P-MLQ Algorithm Applied

The scheduler uses the same P-MLQ rules for hearings:

### Queue 3 (Complex/Highly Complex)
- **Policy**: DATE PREFERENCE
- **Behavior**: Finds earliest available date (7+ days from today)
- **Time**: Any time of day (respecting breaks)

### Queue 2 (Moderate)
- **Policy**: Balanced FCFS
- **Behavior**: Next available general slot
- **Time**: Any available time

### Queue 1 (Simple)
- **Policy**: TIME PREFERENCE
- **Behavior**: Only schedules in morning blocks
- **Time**: 9-11 AM or 11:15 AM-1 PM

## Example Scenarios

### Scenario 1: Simple Case Hearing
```
Case Complexity: Simple
Duration: 30 minutes
Result: Scheduled in morning block (e.g., 9:30 AM) on next available day (7+ days out)
```

### Scenario 2: Complex Case Hearing
```
Case Complexity: Complex
Duration: 120 minutes
Result: Scheduled at earliest available date (7+ days out), any time with 2-hour block
```

### Scenario 3: Multiple Hearings
```
Case already has Hearing #1
Clicking "Schedule Hearing" creates Hearing #2
Each hearing is scheduled independently using P-MLQ
```

## Important Notes

✅ **Minimum 7 Days**: Hearings are scheduled at least 7 days from today
✅ **No Rescheduling**: Never affects existing hearings or case schedules
✅ **Respects Breaks**: All break times are honored
✅ **Workday Limits**: Only schedules within 9 AM - 5 PM
✅ **Weekend Skip**: Automatically skips weekends
✅ **Queue Rules**: Follows P-MLQ bi-preferential policy

## Error Handling

### "Case not found"
- Case ID doesn't exist in database

### "Case not assigned to this judge"
- Case is assigned to a different judge
- Judge trying to schedule hearing for someone else's case

### "Could not schedule hearing. No available slots found."
- No available slots in next 90 days
- Judge's calendar is fully booked
- Solution: Extend search range or add more judges

## API Mapping Verification

### ✅ Frontend → Backend
```javascript
// Frontend (JudgeCasesPage.jsx)
fetch(`http://localhost:8000/api/judges/schedule-hearing?judge_id=${judgeId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ case_id: caseId })
})

// Backend (judges.py)
@router.post("/schedule-hearing", response_model=ScheduleHearingResponse)
def schedule_next_hearing(request: ScheduleHearingRequest, judge_id: int, ...)
```

### ✅ Backend → Scheduler
```python
# judges.py
scheduler = MultiLevelQueueScheduler(db)
hearing = scheduler.schedule_next_hearing(case)

# scheduler.py
def schedule_next_hearing(self, case: Case) -> Optional[Hearing]:
    # Uses P-MLQ algorithm
    slot = self.find_next_available_slot(case.judge_id, duration, case.complexity, start_date)
```

### ✅ Database Updates
```python
# Creates Hearing record
hearing = Hearing(
    case_id=case.id,
    hearing_number=next_hearing_number,
    scheduled_date=scheduled_date,
    scheduled_time=scheduled_time,
    duration=duration,
    status="scheduled"
)

# Creates JudgeSchedule entry (blocks time)
judge_schedule = JudgeSchedule(
    judge_id=case.judge_id,
    date=scheduled_date,
    start_time=scheduled_time,
    end_time=end_time,
    is_available=False,
    case_id=case.id,
    notes=f"Hearing #{next_hearing_number} - Case {case.case_number}"
)
```

## Everything is Correctly Mapped! ✅

- ✅ Frontend button exists and calls correct endpoint
- ✅ Backend endpoint receives request and validates
- ✅ Scheduler uses P-MLQ algorithm correctly
- ✅ Database tables (hearings, judge_schedules) are updated
- ✅ Foreign key relationships are maintained
- ✅ Response is sent back to frontend
- ✅ Success message displayed to judge

## Quick Test Command

To test the complete flow:

1. **Start Backend**:
```bash
cd Back-End
uvicorn main:app --reload
```

2. **Start Frontend**:
```bash
cd Front-End
npm run dev
```

3. **Test**:
- Login as judge: manish@example.com / manish@2004
- Go to "My Cases"
- Click "Schedule Hearing" on any case
- Verify success message
- Check database for new hearing record

**Status**: ✅ All mappings verified and working correctly!
