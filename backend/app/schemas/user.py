from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(BaseModel):
    id: int
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    role: str = "user"
    created_at: datetime
    
    class Config:
        from_attributes = True
