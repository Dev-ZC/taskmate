from enum import Enum
from typing import List
from pydantic import BaseModel

class SenderType(str, Enum):
    user = "user"
    ai = "bot"
    system = "system"
    unknown = "unknown"

class User(BaseModel):
    id: int

class Message(BaseModel):
    message: str
    sender_id: int
    sender_type: str

class UserMessageLog(BaseModel):
    user_id: int
    message_log: List[Message]
    
class AIResponse(BaseModel):
    response: str
    
# Login/Sign Up

class LoginRequest(BaseModel):
    email: str
    password: str
    
class SignupRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str