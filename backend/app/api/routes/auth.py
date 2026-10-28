from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    UserUpdateRequest,
    AuthTokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer account",
)
def register_customer(
    payload: UserRegisterRequest,
    db: Session = Depends(get_db),
) -> AuthTokenResponse:
    clean_email = payload.email.strip().lower()

    # Check for existing account
    existing = db.scalar(select(User).where(User.email == clean_email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Securely hash password and create customer (is_admin ALWAYS False)
    hashed_pw = get_password_hash(payload.password)
    user = User(
        full_name=payload.full_name.strip(),
        email=clean_email,
        hashed_password=hashed_pw,
        phone_number=payload.phone_number.strip() if payload.phone_number else None,
        is_active=True,
        is_admin=False,  # strictly enforce False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Issue access token immediately for seamless onboarding
    token = create_access_token(
        subject=user.id,
        extra_claims={"email": user.email, "is_admin": user.is_admin},
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=AuthTokenResponse,
    summary="Authenticate customer or administrator",
)
def login_user(
    payload: UserLoginRequest,
    db: Session = Depends(get_db),
) -> AuthTokenResponse:
    clean_email = payload.email.strip().lower()
    user = db.scalar(select(User).where(User.email == clean_email))

    # Generic error message prevents account enumeration
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact concierge support.",
        )

    token = create_access_token(
        subject=user.id,
        extra_claims={"email": user.email, "is_admin": user.is_admin},
    )

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Retrieve current authenticated patron profile",
)
def get_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update customer profile details",
)
def update_profile(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    if payload.full_name is not None:
        current_user.full_name = payload.full_name.strip()
    if payload.phone_number is not None:
        current_user.phone_number = payload.phone_number.strip() if payload.phone_number else None

    # Handle password change
    if payload.new_password:
        if not payload.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to set a new password.",
            )
        if not verify_password(payload.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password.",
            )
        current_user.hashed_password = get_password_hash(payload.new_password)

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
