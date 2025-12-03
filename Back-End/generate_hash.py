"""
Generate password hash for testing
Run this to see what hash should be used
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generate hash for the passwords
passwords = {
    'rasesh@2004': None,
    'manish@2004': None,
    'ruthvik@2004': None,
}

print("🔐 Generating Password Hashes\n")
print("=" * 80)

for password in passwords.keys():
    hash_value = pwd_context.hash(password)
    print(f"\nPassword: {password}")
    print(f"Hash: {hash_value}")
    
    # Verify it works
    if pwd_context.verify(password, hash_value):
        print("✅ Verification: SUCCESS")
    else:
        print("❌ Verification: FAILED")

print("\n" + "=" * 80)
print("\n📋 SQL Update Commands:\n")

# Generate SQL for each user type
print("-- Update Users")
hash_val = pwd_context.hash('rasesh@2004')
print(f"UPDATE users SET password = '{hash_val}' WHERE email = 'rasesh@example.com';")
hash_val = pwd_context.hash('samarth@2004')
print(f"UPDATE users SET password = '{hash_val}' WHERE email = 'samarth@example.com';")
hash_val = pwd_context.hash('bully@2004')
print(f"UPDATE users SET password = '{hash_val}' WHERE email = 'bully@example.com';")

print("\n-- Update Judges")
hash_val = pwd_context.hash('manish@2004')
print(f"UPDATE judges SET password = '{hash_val}' WHERE email = 'manish@example.com';")
hash_val = pwd_context.hash('vade@2004')
print(f"UPDATE judges SET password = '{hash_val}' WHERE email = 'vade@example.com';")
hash_val = pwd_context.hash('venki@2004')
print(f"UPDATE judges SET password = '{hash_val}' WHERE email = 'venki@example.com';")

print("\n-- Update Admins")
hash_val = pwd_context.hash('ruthvik@2004')
print(f"UPDATE admins SET password = '{hash_val}' WHERE email = 'ruthvik@example.com';")
hash_val = pwd_context.hash('mahesh@2004')
print(f"UPDATE admins SET password = '{hash_val}' WHERE email = 'mahesh@example.com';")
hash_val = pwd_context.hash('vimal@2004')
print(f"UPDATE admins SET password = '{hash_val}' WHERE email = 'vimal@example.com';")
