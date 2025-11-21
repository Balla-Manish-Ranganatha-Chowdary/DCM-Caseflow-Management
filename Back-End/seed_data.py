"""
Seed script to populate initial data for testing
Run this after setting up the database
"""
from app.database import SessionLocal
from app.models import User, Judge, Admin
from app.auth import get_password_hash

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first() or db.query(Judge).first() or db.query(Admin).first():
            print("Database already contains data. Skipping seed.")
            return
        
        # Create Users
        users_data = [
            {"username": "rasesh", "email": "rasesh@example.com", "password": "rasesh@2004"},
            {"username": "samarth", "email": "samarth@example.com", "password": "samarth@2004"},
            {"username": "bully", "email": "bully@example.com", "password": "bully@2004"}
        ]
        
        for user_data in users_data:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                password=get_password_hash(user_data["password"])
            )
            db.add(user)
        
        # Create Judges
        judges_data = [
            {"username": "manish", "email": "manish@example.com", "password": "manish@2004"},
            {"username": "vade", "email": "vade@example.com", "password": "vade@2004"},
            {"username": "venki", "email": "venki@example.com", "password": "venki@2004"}
        ]
        
        for judge_data in judges_data:
            judge = Judge(
                username=judge_data["username"],
                email=judge_data["email"],
                password=get_password_hash(judge_data["password"])
            )
            db.add(judge)
        
        # Create Admins
        admins_data = [
            {"email": "ruthvik@example.com", "password": "ruthvik@2004"},
            {"email": "mahesh@example.com", "password": "mahesh@2004"},
            {"email": "vimal@example.com", "password": "vimal@2004"}
        ]
        
        for admin_data in admins_data:
            admin = Admin(
                email=admin_data["email"],
                password=get_password_hash(admin_data["password"])
            )
            db.add(admin)
        
        db.commit()
        print("✓ Database seeded successfully!")
        print("\nTest Credentials:")
        print("\nUsers:")
        for user in users_data:
            print(f"  - {user['email']} / {user['password']}")
        print("\nJudges:")
        for judge in judges_data:
            print(f"  - {judge['email']} / {judge['password']}")
        print("\nAdmins:")
        for admin in admins_data:
            print(f"  - {admin['email']} / {admin['password']}")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
