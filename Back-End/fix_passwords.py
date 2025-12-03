"""
Script to fix password hashes in the database
Run this to ensure all predefined users can login

Usage:
    cd Back-End
    venv\Scripts\activate
    python fix_passwords.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database import SessionLocal
    from app.models import User, Judge, Admin
    from app.auth import get_password_hash
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("\nMake sure you:")
    print("1. Activate virtual environment: venv\\Scripts\\activate")
    print("2. Install requirements: pip install -r requirements.txt")
    sys.exit(1)

def fix_passwords():
    db = SessionLocal()
    
    try:
        print("🔧 Fixing passwords in database...\n")
        
        # Fix Users
        print("👤 Updating Users...")
        users = [
            ('rasesh', 'rasesh@example.com', 'rasesh@2004'),
            ('samarth', 'samarth@example.com', 'samarth@2004'),
            ('bully', 'bully@example.com', 'bully@2004')
        ]
        
        for username, email, password in users:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.password = get_password_hash(password)
                print(f"   ✅ Updated {username} ({email})")
            else:
                # Create if doesn't exist
                new_user = User(
                    username=username,
                    email=email,
                    password=get_password_hash(password)
                )
                db.add(new_user)
                print(f"   ✅ Created {username} ({email})")
        
        # Fix Judges
        print("\n⚖️  Updating Judges...")
        judges = [
            ('manish', 'manish@example.com', 'manish@2004'),
            ('vade', 'vade@example.com', 'vade@2004'),
            ('venki', 'venki@example.com', 'venki@2004')
        ]
        
        for username, email, password in judges:
            judge = db.query(Judge).filter(Judge.email == email).first()
            if judge:
                judge.password = get_password_hash(password)
                print(f"   ✅ Updated {username} ({email})")
            else:
                # Create if doesn't exist
                new_judge = Judge(
                    username=username,
                    email=email,
                    password=get_password_hash(password)
                )
                db.add(new_judge)
                print(f"   ✅ Created {username} ({email})")
        
        # Fix Admins
        print("\n🔐 Updating Admins...")
        admins = [
            ('ruthvik@example.com', 'ruthvik@2004'),
            ('mahesh@example.com', 'mahesh@2004'),
            ('vimal@example.com', 'vimal@2004')
        ]
        
        for email, password in admins:
            admin = db.query(Admin).filter(Admin.email == email).first()
            if admin:
                admin.password = get_password_hash(password)
                print(f"   ✅ Updated {email.split('@')[0]} ({email})")
            else:
                # Create if doesn't exist
                new_admin = Admin(
                    email=email,
                    password=get_password_hash(password)
                )
                db.add(new_admin)
                print(f"   ✅ Created {email.split('@')[0]} ({email})")
        
        db.commit()
        print("\n" + "="*60)
        print("✅ All passwords updated successfully!")
        print("="*60)
        print("\n📋 Login Credentials:")
        print("\nUsers:")
        print("  • rasesh@example.com / rasesh@2004")
        print("  • samarth@example.com / samarth@2004")
        print("  • bully@example.com / bully@2004")
        print("\nJudges:")
        print("  • manish@example.com / manish@2004")
        print("  • vade@example.com / vade@2004")
        print("  • venki@example.com / venki@2004")
        print("\nAdmins:")
        print("  • ruthvik@example.com / ruthvik@2004")
        print("  • mahesh@example.com / mahesh@2004")
        print("  • vimal@example.com / vimal@2004")
        print("\n🚀 You can now login with these credentials!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print(f"\nDetails: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_passwords()
