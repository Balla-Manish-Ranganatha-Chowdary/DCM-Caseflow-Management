"""
Test script to verify login credentials work
"""

from app.database import SessionLocal
from app.models import User, Judge, Admin
from app.auth import verify_password

def test_login():
    db = SessionLocal()
    
    print("🧪 Testing Login Credentials\n")
    print("=" * 60)
    
    # Test Users
    print("\n👤 Testing Users:")
    users = [
        ('rasesh@example.com', 'rasesh@2004'),
        ('samarth@example.com', 'samarth@2004'),
        ('bully@example.com', 'bully@2004')
    ]
    
    for email, password in users:
        user = db.query(User).filter(User.email == email).first()
        if user:
            if verify_password(password, user.password):
                print(f"   ✅ {email} - Password correct")
            else:
                print(f"   ❌ {email} - Password incorrect")
        else:
            print(f"   ❌ {email} - User not found")
    
    # Test Judges
    print("\n⚖️  Testing Judges:")
    judges = [
        ('manish@example.com', 'manish@2004'),
        ('vade@example.com', 'vade@2004'),
        ('venki@example.com', 'venki@2004')
    ]
    
    for email, password in judges:
        judge = db.query(Judge).filter(Judge.email == email).first()
        if judge:
            if verify_password(password, judge.password):
                print(f"   ✅ {email} - Password correct")
            else:
                print(f"   ❌ {email} - Password incorrect")
        else:
            print(f"   ❌ {email} - Judge not found")
    
    # Test Admins
    print("\n🔐 Testing Admins:")
    admins = [
        ('ruthvik@example.com', 'ruthvik@2004'),
        ('mahesh@example.com', 'mahesh@2004'),
        ('vimal@example.com', 'vimal@2004')
    ]
    
    for email, password in admins:
        admin = db.query(Admin).filter(Admin.email == email).first()
        if admin:
            if verify_password(password, admin.password):
                print(f"   ✅ {email} - Password correct")
            else:
                print(f"   ❌ {email} - Password incorrect")
        else:
            print(f"   ❌ {email} - Admin not found")
    
    print("\n" + "=" * 60)
    db.close()

if __name__ == "__main__":
    test_login()
