#!/usr/bin/env python
"""
Administrator Provisioning Script for ES ETHNIC STYLES
======================================================
Secure, backend-only CLI script to grant administrator privileges to an existing
user in the SQLite database, or create a brand new administrator account.

Usage:
    # 1. Promote an existing registered customer:
    python scripts/promote_admin.py user@example.com

    # 2. Or create a dedicated admin directly from terminal:
    python scripts/promote_admin.py admin@esethnicstyles.com --create --name "Atelier Director" --password "RoyalAdmin@2026"
"""

import sys
import os
import argparse

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def promote_user(email: str, create: bool = False, name: str = None, password: str = None) -> bool:
    clean_email = email.strip().lower()
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == clean_email))

        if user:
            user.is_admin = True
            if password:
                if len(password) < 8:
                    print("[ERROR] Password must be at least 8 characters long.")
                    return False
                user.hashed_password = get_password_hash(password)
                print(f"[SUCCESS] Updated password for '{clean_email}'.")
            db.commit()
            print(f"[SUCCESS] Administrator privileges confirmed for: '{user.full_name}' ({clean_email})")
            return True

        if not create:
            print(f"[ERROR] User with email '{clean_email}' was not found in the database.")
            print("Tip: Pass --create --name \"<Full Name>\" --password \"<Password>\" to create a new admin.")
            return False

        if not password or len(password) < 8:
            print("[ERROR] Password must be at least 8 characters long.")
            return False

        new_admin = User(
            full_name=name.strip() if name else "Atelier Administrator",
            email=clean_email,
            hashed_password=get_password_hash(password),
            phone_number=None,
            is_active=True,
            is_admin=True,
        )
        db.add(new_admin)
        db.commit()
        print(f"[SUCCESS] Created new administrator account: '{new_admin.full_name}' ({clean_email})")
        return True

    except Exception as e:
        db.rollback()
        print(f"[FAILED] Database error while provisioning administrator: {e}")
        return False
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="ES ETHNIC STYLES - Provision Administrator Privileges")
    parser.add_argument("email", help="Email address of the account to promote or create")
    parser.add_argument("--create", action="store_true", help="Create the user if it does not already exist")
    parser.add_argument("--name", default="Atelier Administrator", help="Full name when creating a new admin")
    parser.add_argument("--password", help="Password when creating a new admin (minimum 8 chars)")

    args = parser.parse_args()
    success = promote_user(args.email, create=args.create, name=args.name, password=args.password)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
