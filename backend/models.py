from enum import Enum
from typing import List
from pydantic import BaseModel
from typing import List, Optional

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
    
# Documents
class Document(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    doc_id: Optional[int] = None
    user_id: Optional[str] = None