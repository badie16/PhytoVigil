from pydantic import BaseModel
from typing import Optional

class PushTokenCreate(BaseModel):
    token: str
    device: Optional[str] = None
    deviceId: Optional[str] = None

class PushTokenResponse(BaseModel):
    id: int
    token: str
    device: Optional[str]
    deviceId: Optional[str]
    class Config:
        orm_mode = True
