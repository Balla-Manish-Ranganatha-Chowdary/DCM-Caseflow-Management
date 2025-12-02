"""
Quick test script to verify backend is working
Run this to check if everything is set up correctly
"""
import sys
from app.database import SessionLocal, engine
from app.models import Base, User, Judge, Admin
from sqlalchemy import text

def test_database_connection():
    """Test database connection"""
    print("Testing database connection...")
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        print("✅ Database connection successful!")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_tables_exist():
    """Test if all tables exist"""
    print("\nTesting database tables...")
    try:
        db = SessionLocal()
        
        # Check each table
        tables = ['users', 'judges', 'admins', 'cases', 'hearings', 'judge_schedules']
        for table in tables:
            result = db.execute(text(f"SHOW TABLES LIKE '{table}'"))
            if result.fetchone():
                print(f"✅ Table '{table}' exists")
            else:
                print(f"❌ Table '{table}' missing")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return False

def test_sample_data():
    """Test if sample data exists"""
    print("\nTesting sample data...")
    try:
        db = SessionLocal()
        
        user_count = db.query(User).count()
        judge_count = db.query(Judge).count()
        admin_count = db.query(Admin).count()
        
        print(f"Users in database: {user_count}")
        print(f"Judges in database: {judge_count}")
        print(f"Admins in database: {admin_count}")
        
        if user_count > 0 and judge_count > 0 and admin_count > 0:
            print("✅ Sample data exists!")
        else:
            print("⚠️  No sample data. Run: python seed_data.py")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Error checking sample data: {e}")
        return False

def main():
    print("=" * 60)
    print("Backend Health Check")
    print("=" * 60)
    
    # Test 1: Database connection
    if not test_database_connection():
        print("\n❌ CRITICAL: Cannot connect to database!")
        print("Fix: Check your .env file and ensure MySQL is running")
        sys.exit(1)
    
    # Test 2: Tables exist
    if not test_tables_exist():
        print("\n❌ CRITICAL: Database tables missing!")
        print("Fix: Import database_schema.sql in phpMyAdmin")
        sys.exit(1)
    
    # Test 3: Sample data
    test_sample_data()
    
    print("\n" + "=" * 60)
    print("✅ Backend is ready!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start backend: uvicorn main:app --reload")
    print("2. Visit: http://localhost:8000/docs")
    print("3. Start frontend: cd Front-End && npm run dev")

if __name__ == "__main__":
    main()
