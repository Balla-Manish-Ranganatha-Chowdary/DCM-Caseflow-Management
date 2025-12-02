# 🧪 Complete Testing Guide

## Prerequisites
- ✅ XAMPP running (Apache + MySQL)
- ✅ Database imported (case_management)
- ✅ Backend running (http://localhost:8000)
- ✅ Frontend running (http://localhost:5173)

---

## Automated Backend Test

Run this to verify all backend fixes:

```bash
cd Back-End
pip install requests
python ../test_fixes.py
```

This will test:
- Admin login ✓
- Judge login ✓
- User login ✓
- File case ✓
- Admin API endpoints ✓

---

## Manual UI Testing

### Test 1: Admin Login & Manage Records

1. **Open Browser**: http://localhost:5173

2. **Login as Admin**:
   - Click "Login / Sign Up" → Admin → Login
   - Email: `ruthvik@example.com`
   - Password: `ruthvik@2004`
   - Click "Sign In"

3. **Verify Dashboard**:
   - Should redirect to `/admin-dashboard`
   - Username "ruthvik" should appear in navbar
   - Should see analytics cards

4. **Test Manage Records**:
   - Click "Manage Records" in navbar
   - **Cases Tab**:
     - Should load all cases
     - Click "Edit" on any case
     - Modify title or status
     - Click "Save Changes"
     - Should show success message
   - **Users Tab**:
     - Should load all users
     - Click "Edit" on any user
     - Modify username or email
     - Click "Save Changes"
   - **Judges Tab**:
     - Should load all judges
     - Try editing a judge
     - Should work correctly

5. **Test Delete** (Optional):
   - Click "Delete" on any record
   - Confirm deletion
   - Record should be removed

**Expected Result**: ✅ All operations work without errors

---

### Test 2: Judge Login

1. **Logout** (if logged in)

2. **Login as Judge**:
   - Click "Login / Sign Up" → Judge → Login
   - Email: `manish@example.com`
   - Password: `manish@2004`
   - Click "Sign In"

3. **Verify Dashboard**:
   - Should redirect to `/judge-dashboard`
   - Username "manish" should appear in navbar
   - Should see assigned cases

**Expected Result**: ✅ Login successful, dashboard loads

---

### Test 3: User Login & File Case

1. **Logout** (if logged in)

2. **Login as User**:
   - Click "Login / Sign Up" → User → Login
   - Email: `rasesh@example.com`
   - Password: `rasesh@2004`
   - Click "Sign In"

3. **Verify Dashboard**:
   - Should redirect to `/user-dashboard`
   - Username "rasesh" should appear in navbar

4. **File New Case**:
   - Click "File New Case" in navbar
   - Fill in form:
     - **Title**: "Property Dispute Test"
     - **Description**: "Testing the case filing system with all fixes applied"
     - **Complexity**: Select "Moderate"
     - **Document**: Upload any PDF/image (optional)
   - Click "File Case"

5. **Verify Success**:
   - Should show alert with:
     - Case Number (e.g., CASE-20241202...)
     - Scheduled Date
     - Scheduled Time
   - Should redirect to "Check Status" page
   - New case should appear in the list

**Expected Result**: ✅ Case filed successfully with scheduling

---

### Test 4: Check Case Status

1. **While logged in as User**:
   - Click "Check Status" in navbar
   - Should see all your filed cases
   - Verify the newly filed case appears
   - Check that it has:
     - Case number
     - Status (Pending or Scheduled)
     - Filed date
     - Scheduled date/time (if scheduled)

**Expected Result**: ✅ All cases display correctly

---

## Common Issues & Solutions

### Issue: "Invalid credentials"
**Solution**: 
- Check that database has sample data
- Verify password is exactly: `username@2004`
- Example: ruthvik@2004, manish@2004, rasesh@2004

### Issue: "Cannot connect to backend"
**Solution**:
```bash
cd Back-End
venv\Scripts\activate
uvicorn main:app --reload
```
Verify at: http://localhost:8000

### Issue: "Network Error" when filing case
**Solution**:
- Check backend is running
- Check XAMPP MySQL is running
- Verify database exists in phpMyAdmin

### Issue: Admin Manage Records shows empty
**Solution**:
- Check backend console for errors
- Verify API endpoints: 
  - http://localhost:8000/api/admins/cases
  - http://localhost:8000/api/admins/users
  - http://localhost:8000/api/admins/judges
- Check browser console for CORS errors

### Issue: File upload fails
**Solution**:
- File size should be < 10MB
- Accepted formats: PDF, DOC, DOCX, JPG, PNG
- File upload is optional - try without file first

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/judge` - Judge login
- `POST /api/auth/login/admin` - Admin login

### Cases
- `POST /api/cases/file` - File new case
- `GET /api/cases/user/{user_id}` - Get user's cases
- `GET /api/cases/judge/{judge_id}` - Get judge's cases

### Admin
- `GET /api/admins/cases` - Get all cases
- `PUT /api/admins/cases/{id}` - Update case
- `DELETE /api/admins/cases/{id}` - Delete case
- `GET /api/admins/users` - Get all users
- `PUT /api/admins/users/{id}` - Update user
- `DELETE /api/admins/users/{id}` - Delete user
- `GET /api/admins/judges` - Get all judges
- `PUT /api/admins/judges/{id}` - Update judge
- `DELETE /api/admins/judges/{id}` - Delete judge

---

## Success Criteria

All tests pass when:
- ✅ Admin can login and see username in navbar
- ✅ Judge can login and see username in navbar
- ✅ User can login and see username in navbar
- ✅ User can file case with/without document
- ✅ Case gets scheduled automatically
- ✅ Admin can view all cases/users/judges
- ✅ Admin can edit records successfully
- ✅ Admin can delete records successfully
- ✅ No console errors in browser
- ✅ No errors in backend logs

---

## Test Results Template

Copy this and fill in your results:

```
Date: ___________
Tester: ___________

[ ] Admin Login - ruthvik@example.com
[ ] Admin Dashboard loads
[ ] Admin Manage Records - Cases tab
[ ] Admin Manage Records - Users tab
[ ] Admin Manage Records - Judges tab
[ ] Admin Edit Case
[ ] Admin Edit User
[ ] Admin Edit Judge
[ ] Judge Login - manish@example.com
[ ] Judge Dashboard loads
[ ] User Login - rasesh@example.com
[ ] User Dashboard loads
[ ] File New Case (without document)
[ ] File New Case (with document)
[ ] Case appears in Check Status
[ ] Case gets scheduled automatically

Issues Found:
_________________________________
_________________________________
_________________________________

Overall Status: PASS / FAIL
```

---

## Need Help?

If any test fails:
1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify database has sample data
4. Restart backend and frontend
5. Clear browser cache and localStorage
6. Review FIXES_APPLIED.md for details

All fixes have been applied and tested! 🎉
