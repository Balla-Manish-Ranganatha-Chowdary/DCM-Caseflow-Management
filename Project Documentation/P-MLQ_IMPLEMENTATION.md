# P-MLQ Scheduler Implementation

## Overview
Implemented the Prioritized Multi-Level Queue (P-MLQ) scheduling algorithm based on the research paper for judicial case management.

## Key Features

### 1. Bi-Preferential Scheduling Policy

**Queue 3 (Complex & Highly Complex Cases)**
- **Policy**: DATE PREFERENCE
- **Goal**: Minimize Time-to-Disposition
- **Behavior**: Schedules at earliest possible date, any time of day
- **Sections**: 5+ legal sections

**Queue 2 (Moderate Cases)**
- **Policy**: Balanced FCFS
- **Goal**: Fair throughput
- **Behavior**: Standard first-come-first-serve in available slots
- **Sections**: 3-4 legal sections

**Queue 1 (Simple Cases)**
- **Policy**: TIME PREFERENCE  
- **Goal**: Maximize operational efficiency
- **Behavior**: Only schedules in designated morning time blocks (9-11 AM, 11:15 AM-1 PM)
- **Sections**: 1-2 legal sections

### 2. Judge Workday Configuration

**8-Hour Workday**: 9 AM - 5 PM

**Breaks**:
- Lunch: 1:00 PM - 2:00 PM (1 hour)
- Morning break: 11:00 AM - 11:15 AM (15 minutes)
- Afternoon break: 3:30 PM - 3:45 PM (15 minutes)
- **Effective work time**: 6.5 hours/day

### 3. Complexity Calculation

Cases are automatically categorized based on number of legal sections:

| Sections | Complexity | Duration | Queue |
|----------|------------|----------|-------|
| 1-2 | Simple | 30 min | Q1 |
| 3-4 | Moderate | 60 min | Q2 |
| 5-7 | Complex | 120 min | Q3 |
| 8+ | Highly Complex | 180 min | Q3 |

### 4. Critical Rules

✅ **NEVER reschedules existing cases**
✅ **Respects all break times**
✅ **Skips weekends automatically**
✅ **Searches up to 90 days for available slots**
✅ **Assigns judges based on workload balancing**

## Changes Made

### Frontend (`Front-End/src/pages/UserFileCasePage.jsx`)
- Removed complexity dropdown
- Added "Legal Sections" text input field
- Accepts comma-separated sections (e.g., "Section 420, Section 120B, Section 34")
- Sends sections to backend for automatic complexity calculation

### Backend

**Database Schema** (`Back-End/database_schema.sql`):
- Added `sections TEXT` column to `cases` table

**Models** (`Back-End/app/models.py`):
- Added `sections` field to `Case` model

**Schemas** (`Back-End/app/schemas.py`):
- Added `sections` to `CaseResponse`

**Cases Router** (`Back-End/app/routers/cases.py`):
- Added `calculate_complexity_from_sections()` function
- Modified `/file` endpoint to accept `sections` instead of `complexity`
- Automatically calculates complexity from section count

**Scheduler** (`Back-End/app/scheduler.py`):
- Implemented P-MLQ bi-preferential scheduling
- Added break time management
- Added Queue 1 time block restrictions
- Modified `find_next_available_slot()` to respect queue policies
- Updated `schedule_case()` to use new algorithm

## How to Use

### 1. Update Database

If you already have the database, run:
```sql
-- In phpMyAdmin SQL tab
USE case_management;
ALTER TABLE cases ADD COLUMN sections TEXT NULL AFTER description;
```

Or import the updated schema:
```bash
# In phpMyAdmin, import: Back-End/database_schema.sql
```

### 2. File a Case

1. Login as user
2. Go to "File New Case"
3. Fill in:
   - **Title**: "Property Dispute Case"
   - **Description**: "Dispute over land ownership"
   - **Legal Sections**: "Section 420, Section 120B, Section 34, Section 406, Section 506"
   - **Document**: Upload PDF (optional)
4. Submit

### 3. Automatic Processing

The system will:
1. Count sections (5 in example above)
2. Determine complexity: **Complex** (5-7 sections)
3. Assign to **Queue 3** (High Priority)
4. Apply **DATE PREFERENCE** policy
5. Find earliest available date
6. Schedule case without affecting existing cases

## Example Scenarios

### Scenario 1: Simple Case (Queue 1)
```
Sections: "Section 138"
Count: 1
Complexity: Simple
Queue: Q1 (TIME PREFERENCE)
Result: Scheduled in morning block (9-11 AM) on next available day
Duration: 30 minutes
```

### Scenario 2: Complex Case (Queue 3)
```
Sections: "Section 302, Section 34, Section 120B, Section 201, Section 364"
Count: 5
Complexity: Complex
Queue: Q3 (DATE PREFERENCE)
Result: Scheduled at earliest date, any time (respecting breaks)
Duration: 120 minutes
```

### Scenario 3: Highly Complex Case (Queue 3)
```
Sections: "Section 420, 120B, 34, 406, 506, 467, 468, 471"
Count: 8
Complexity: Highly Complex
Queue: Q3 (DATE PREFERENCE)
Result: Scheduled at earliest date, requires 3-hour block
Duration: 180 minutes
```

## Benefits

### For Complex Cases (Q3)
- ✅ Earliest possible hearing dates
- ✅ Minimizes time-to-disposition
- ✅ Active judicial management

### For Simple Cases (Q1)
- ✅ Batch processing efficiency
- ✅ Predictable morning time blocks
- ✅ Reduces judicial cognitive load

### For the Court
- ✅ De-fragmented calendar
- ✅ Higher resource utilization
- ✅ Better trial date certainty
- ✅ No case rescheduling conflicts

## Testing

### Test Case 1: Simple Case
```
Title: "Cheque Bounce Case"
Sections: "Section 138"
Expected: Simple (30 min), Q1, Morning slot
```

### Test Case 2: Moderate Case
```
Title: "Contract Dispute"
Sections: "Section 73, Section 74, Section 75"
Expected: Moderate (60 min), Q2, Any available slot
```

### Test Case 3: Complex Case
```
Title: "Fraud and Conspiracy"
Sections: "Section 420, Section 120B, Section 34, Section 406, Section 506"
Expected: Complex (120 min), Q3, Earliest date
```

### Test Case 4: Highly Complex Case
```
Title: "Murder with Conspiracy"
Sections: "Section 302, Section 34, Section 120B, Section 201, Section 364, Section 109, Section 114, Section 212"
Expected: Highly Complex (180 min), Q3, Earliest date
```

## Migration Steps

1. **Backup database** (important!)
2. **Run migration**: `Back-End/add_sections_column.sql`
3. **Restart backend**: `uvicorn main:app --reload`
4. **Test filing a case** with sections
5. **Verify scheduling** in database

## Troubleshooting

### Issue: "Column 'sections' doesn't exist"
**Solution**: Run the migration SQL script

### Issue: Case not scheduling
**Solution**: Check that:
- Judges exist in database
- Judge has available time slots
- Not all slots are filled for next 90 days

### Issue: Simple cases not in morning
**Solution**: Verify case has 1-2 sections only

## Technical Notes

- Scheduler searches up to 90 days for slots
- Weekends are automatically skipped
- All break times are respected
- Existing cases are NEVER rescheduled
- Judge assignment uses workload balancing
- Priority scores: Simple=25, Moderate=50, Complex=75, Highly Complex=100

## Future Enhancements

- Machine learning for complexity prediction
- Dynamic weight adjustment based on case outcomes
- Multi-day hearing support
- Judge specialization matching
- Real-time calendar visualization
