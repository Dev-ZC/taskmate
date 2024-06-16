from fastapi.middleware.cors import CORSMiddleware
from models import *
from fastapi import FastAPI, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4

app = FastAPI()

messages = [
    Message(message='Hello!', sender_id=1, sender_type='user'),
    Message(message='Hi there!', sender_id=2, sender_type='bot')
]

# Allows cross origin requests with react and fast api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/messages", response_model=Message)
async def send_message(message: Message):
    if not message.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    # Here, you can process the message as needed
    
    # Add users Message 
    messages.append(message)
    return message; 

@app.get("/api/messages", response_model=List[Message])
async def fetch_messages(user_id: int):
    user_messages = [message for message in messages if message.sender_id == user_id]
    return user_messages

# Takes user id collects their messages, and returns an AI response
@app.post("/api/ai_response", response_model=AIResponse)
async def get_ai_response(user_id: int = Query(..., description="ID of the user")):
    # Fetch user's message history
    user_messages = [message.message for message in messages if message.sender_id == user_id]
    
    # Simulate AI response
    try:
        ai_response = {"response": "This is a simulated AI response."}
        return AIResponse(response=ai_response['response'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI response: {str(e)}")


if __name__ == "__main__":
   import uvicorn
   
   uvicorn.run(app, host="0.0.0.0", port=8000) 