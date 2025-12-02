"""
Quick test script to verify all fixes are working
Run this after starting the backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_admin_login():
    """Test admin login"""
    print("\n🔐 Testing Admin Login...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/admin",
        json={
            "email": "ruthvik@example.com",
            "password": "ruthvik@2004"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Admin login successful!")
        print(f"   Username: {data.get('username')}")
        print(f"   Role: {data.get('role')}")
        print(f"   User ID: {data.get('user_id')}")
        return data.get('access_token')
    else:
        print(f"❌ Admin login failed: {response.text}")
        return None

def test_judge_login():
    """Test judge login"""
    print("\n⚖️  Testing Judge Login...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/judge",
        json={
            "email": "manish@example.com",
            "password": "manish@2004"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Judge login successful!")
        print(f"   Username: {data.get('username')}")
        print(f"   Role: {data.get('role')}")
        print(f"   User ID: {data.get('user_id')}")
        return data.get('access_token')
    else:
        print(f"❌ Judge login failed: {response.text}")
        return None

def test_user_login():
    """Test user login"""
    print("\n👤 Testing User Login...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/user",
        json={
            "email": "rasesh@example.com",
            "password": "rasesh@2004"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"✅ User login successful!")
        print(f"   Username: {data.get('username')}")
        print(f"   Role: {data.get('role')}")
        print(f"   User ID: {data.get('user_id')}")
        return data.get('user_id')
    else:
        print(f"❌ User login failed: {response.text}")
        return None

def test_file_case(user_id):
    """Test filing a case"""
    print("\n📄 Testing File Case...")
    
    # Prepare form data
    data = {
        'title': 'Test Case - Automated',
        'description': 'This is a test case filed via automated script',
        'complexity': 'simple',
        'user_id': str(user_id)
    }
    
    response = requests.post(
        f"{BASE_URL}/api/cases/file",
        data=data
    )
    
    if response.status_code == 201:
        case_data = response.json()
        print(f"✅ Case filed successfully!")
        print(f"   Case Number: {case_data.get('case_number')}")
        print(f"   Status: {case_data.get('status')}")
        print(f"   Scheduled Date: {case_data.get('scheduled_date')}")
        print(f"   Scheduled Time: {case_data.get('scheduled_time')}")
        return case_data.get('id')
    else:
        print(f"❌ File case failed: {response.text}")
        return None

def test_admin_get_cases():
    """Test admin getting all cases"""
    print("\n📋 Testing Admin Get Cases...")
    response = requests.get(f"{BASE_URL}/api/admins/cases")
    
    if response.status_code == 200:
        cases = response.json()
        print(f"✅ Retrieved {len(cases)} cases")
        if cases:
            print(f"   Latest case: {cases[0].get('case_number')}")
        return True
    else:
        print(f"❌ Get cases failed: {response.text}")
        return False

def test_admin_get_users():
    """Test admin getting all users"""
    print("\n👥 Testing Admin Get Users...")
    response = requests.get(f"{BASE_URL}/api/admins/users")
    
    if response.status_code == 200:
        users = response.json()
        print(f"✅ Retrieved {len(users)} users")
        return True
    else:
        print(f"❌ Get users failed: {response.text}")
        return False

def test_admin_get_judges():
    """Test admin getting all judges"""
    print("\n⚖️  Testing Admin Get Judges...")
    response = requests.get(f"{BASE_URL}/api/admins/judges")
    
    if response.status_code == 200:
        judges = response.json()
        print(f"✅ Retrieved {len(judges)} judges")
        return True
    else:
        print(f"❌ Get judges failed: {response.text}")
        return False

def main():
    print("=" * 60)
    print("🧪 TESTING ALL FIXES")
    print("=" * 60)
    
    # Check if server is running
    try:
        response = requests.get(BASE_URL)
        if response.status_code != 200:
            print("❌ Backend server is not running!")
            print("   Start it with: cd Back-End && uvicorn main:app --reload")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("   Make sure it's running at http://localhost:8000")
        return
    
    print("✅ Backend server is running\n")
    
    # Run all tests
    admin_token = test_admin_login()
    judge_token = test_judge_login()
    user_id = test_user_login()
    
    if user_id:
        case_id = test_file_case(user_id)
    
    test_admin_get_cases()
    test_admin_get_users()
    test_admin_get_judges()
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS COMPLETED!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start frontend: cd Front-End && npm run dev")
    print("2. Open browser: http://localhost:5173")
    print("3. Test the UI with the credentials in FIXES_APPLIED.md")

if __name__ == "__main__":
    main()
