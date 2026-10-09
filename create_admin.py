
from getpass import getpass

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.auth.security import hash_password

email = input("Admin email: ").strip().lower()
password = getpass("Admin password: ")

if not email or not password:
    raise ValueError("Email and password are required.")

db = SessionLocal()

try:
    user = db.query(User).filter(User.email == email).first()

    if user:
        user.role = UserRole.admin
        print("Existing user's role will be changed to admin.")
    else:
        user = User(
            email=email,
            password_hash=hash_password(password),
            role=UserRole.admin,
        )
        db.add(user)

    db.commit()
    print(f"Admin account ready for: {email}")

except Exception:
    db.rollback()
    raise
finally:
    db.close()
