from typing import List
from pydantic import BaseModel

class User(BaseModel):
    id: int

class Message(BaseModel):
    message: str
    sender_id: int
    sender_type: str

class UserMessage(BaseModel):
    user_id: int
    message_log: List[Message]
    
class AIResponse(BaseModel):
    response: str