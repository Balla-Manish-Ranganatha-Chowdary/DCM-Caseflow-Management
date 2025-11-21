from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Judge, Admin
from app.schemas import LoginRequest, Token
from app.auth import verify_password, create_access_token

router = APIRouter()

@router.post("/login/user", response_model=Token)
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email, "role": "user", "user_id": user.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": "user",
        "user_id": user.id,
        "username": user.username
    }

@router.post("/login/judge", response_model=Token)
def login_judge(request: LoginRequest, db: Session = Depends(get_db)):
    judge = db.query(Judge).filter(Judge.email == request.email).first()
    if not judge or not verify_password(request.password, judge.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": judge.email, "role": "judge", "user_id": judge.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": "judge",
        "user_id": judge.id,
        "username": judge.username
    }

@router.post("/login/admin", response_model=Token)
def login_admin(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == request.email).first()
    if not admin or not verify_password(request.password, admin.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin.email, "role": "admin", "user_id": admin.id})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": "admin",
        "user_id": admin.id
    }
