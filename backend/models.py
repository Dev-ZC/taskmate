from pydantic import BaseModel

class Message(BaseModel):
    message: str
    sender_id: int
    sender_type: str