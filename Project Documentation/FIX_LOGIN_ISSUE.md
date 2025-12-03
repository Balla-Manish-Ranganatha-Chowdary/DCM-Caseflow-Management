# 🔧 Fix Login Issue - Invalid Credentials

## Problem
Predefined users, judges, and admins cannot login - getting "Invalid credentials" error.

## Root Cause
The password hashes in the database don't match the expected passwords.

## Solution - Run Password Fix Script

### Option 1: Using Batch File (Easiest)
```bash
cd Back-End
fix_passwords.bat
```

### Option 2: Manual Commands
```bash
cd Back-End
venv\Scripts\activate
python fix_passwords.py
```

### Option 3: If Virtual Environment Doesn't Exist
```bash
cd Back-End
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python fix_passwords.py
```

## What the Script Does

1. Connects to your database
2. Updates/creates all predefined users with correct password hashes:
   - **Users**: rasesh, samarth, bully
   - **Judges**: manish, vade, venki
   - **Admins**: ruthvik, mahesh, vimal
3. All passwords follow the pattern: `username@2004`

## After Running the Script

You should see output like:
```
🔧 Fixing passwords in database...

👤 Updating Users...
   ✅ Updated rasesh (rasesh@example.com)
   ✅ Updated samarth (samarth@example.com)
   ✅ Updated bully (bully@example.com)

⚖️  Updating Judges...
   ✅ Updated manish (manish@example.com)
   ✅ Updated vade (vade@example.com)
   ✅ Updated venki (venki@example.com)

🔐 Updating Admins...
   ✅ Updated ruthvik (ruthvik@example.com)
   ✅ Updated mahesh (mahesh@example.com)
   ✅ Updated vimal (vimal@example.com)

✅ All passwords updated successfully!
```

## Test Login

After running the script, test with:

### Admin Login
- Email: `ruthvik@example.com`
- Password: `ruthvik@2004`

### Judge Login
- Email: `manish@example.com`
- Password: `manish@2004`

### User Login
- Email: `rasesh@example.com`
- Password: `rasesh@2004`

## Troubleshooting

### Error: "ModuleNotFoundError: No module named 'sqlalchemy'"
**Solution**: Activate virtual environment and install requirements
```bash
cd Back-End
venv\Scripts\activate
pip install -r requirements.txt
python fix_passwords.py
```

### Error: "Can't connect to MySQL server"
**Solution**: Make sure XAMPP MySQL is running
1. Open XAMPP Control Panel
2. Start MySQL
3. Run the script again

### Error: "Database 'case_management' doesn't exist"
**Solution**: Import the database schema
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import"
3. Choose file: `Back-End/database_schema.sql`
4. Click "Go"
5. Run the password fix script again

### Script runs but login still fails
**Solution**: Check backend logs
1. Make sure backend is running: `uvicorn main:app --reload`
2. Try logging in
3. Check the terminal for error messages
4. Verify the email is exactly as shown (lowercase)

## Alternative: Manual SQL Update

If the Python script doesn't work, you can update passwords directly in phpMyAdmin:

1. Open http://localhost/phpmyadmin
2. Select `case_management` database
3. Click "SQL" tab
4. Run this SQL:

```sql
USE case_management;

-- Update all users with correct password hash
UPDATE users SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u' 
WHERE email IN ('rasesh@example.com', 'samarth@example.com', 'bully@example.com');

UPDATE judges SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u' 
WHERE email IN ('manish@example.com', 'vade@example.com', 'venki@example.com');

UPDATE admins SET password = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u' 
WHERE email IN ('ruthvik@example.com', 'mahesh@example.com', 'vimal@example.com');
```

**Note**: This hash works for all `username@2004` passwords.

## Verify It Works

After fixing passwords:

1. Start backend: `cd Back-End && uvicorn main:app --reload`
2. Start frontend: `cd Front-End && npm run dev`
3. Open: http://localhost:5173
4. Try logging in with any credentials above
5. Should work! ✅

## Quick Test Command

To verify passwords are correct without starting the full app:

```bash
cd Back-End
venv\Scripts\activate
python test_login.py
```

This will test all credentials and show which ones work.
