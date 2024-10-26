from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends, Query, WebSocket

from db_tools import *
from models import *
from plan_and_execute import *
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from dotenv import load_dotenv
import os
import json

from mistralai.models.chat_completion import ChatMessage
from mistralai.client import MistralClient



load_dotenv()

app = FastAPI()

db_manager = DB_Manager()

API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
simulate_response = True

messages_ex = [
    Message(message='Hello!', sender_id=1, sender_type='user'),
    Message(message='Hi there!', sender_id=2, sender_type='bot')
]

messages = []

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
async def get_ai_response(message: Message, user_id: int = Query(..., description="ID of the user")):
    # Fetch user's message history as a list of strings
    user_messages = [message.message for message in messages if message.sender_id == user_id]
    
    
    mistral_user_messages = [
        ChatMessage(role="user", content=msg) for msg in user_messages
    ]
    
    # Simulate AI response
    try:
        if (not simulate_response):
            client = MistralClient(api_key=API_KEY)
            
            some_messages = [
                ChatMessage(role="user", content="What is the best French cheese?")
            ]
            
            # Takes in the message list and returns AI response
            chat_response = client.chat(model=MODEL, messages=mistral_user_messages)
            
            response = chat_response.choices[0].message.content
        else:
            response = "This is a simulated AI response"
        
        print(response)
        messages.append(Message(message=response, sender_type="bot", sender_id = user_id))
        
        return AIResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI response: {str(e)}")


@app.get("/api/calendar/fetch_user_calendar")
async def fetch_user_calendar(sender_id: int):
    try:
        # Simulating fetching user calendar data
        # Replace this with your actual logic to fetch data
        return {"sender_id": sender_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user calendar: {str(e)}")
    
    
# Auth
@app.post("api/signup")
async def signup(email: str, password: str, first_name: str, last_name: str) -> str:
    try:
        db_manager.sign_up(email, password, first_name, last_name)
        return "User signed up!"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to sign up user: {str(e)}")
    
@app.post("api/login")
async def login(email: str, password: str) -> str:
    try:
        db_manager.sign_in(email, password)
        return "User logged in!"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to sign in user: {str(e)}")
        

if __name__ == "__main__":
   import uvicorn
   
   uvicorn.run(app, host="0.0.0.0", port=8000) 