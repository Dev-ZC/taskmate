from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends, Query, WebSocket, Body, Response, Request, Cookie
from fastapi.responses import JSONResponse
from supabase import create_client

from db_tools import *
from models import *
from plan_and_execute import *
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from dotenv import load_dotenv
import os
import json
import logging

from mistralai.models.chat_completion import ChatMessage
from mistralai.client import MistralClient

supabase_url = os.getenv("SUPABASE_URL")
supabase_anon_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_anon_key)

load_dotenv()

app = FastAPI()

db_manager = DB_Manager()

API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
simulate_response = True
is_secure = False

messages_ex = [
    Message(message='Hello!', sender_id=1, sender_type='user'),
    Message(message='Hi there!', sender_id=2, sender_type='bot')
]

messages = []

# Allows cross origin requests with react and fast api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify your React app's URL
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
    
    
# >>>---------------- Auth -------------------<<<
@app.get("/api/get_client")
async def get_client():
    try:
        # Attempt to sign up the user
        response = db_manager.get_client()
        
        return response
    
    except Exception as e:
        # Catch any unexpected errors and raise a generic HTTP exception
        raise HTTPException(status_code=500, detail=f"Unable to get client: {str(e)}")

@app.post("/api/signup")
async def signup(
    response: Response,
    email: str = Body(...),
    password: str = Body(...),
    first_name: str = Body(...),
    last_name: str = Body(...)
):
    try:
        signup_response = supabase.auth.sign_up(
            {
                "email": email, 
                "password": password,
                "options": {"data": {"first_name": first_name, "last_name": last_name, "email": email}},
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to sign up user: {str(e)}")

    session = signup_response.session
    if session:
        # Clear existing cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Set new access and refresh tokens
        response.set_cookie(key="access_token", value=session.access_token, httponly=True, secure=True, expires=3600, samesite="None")
        response.set_cookie(key="refresh_token", value=session.refresh_token, httponly=True, secure=True, expires=86400, samesite="None")

    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(response: Response, email: str = Body(...), password: str = Body(...)):
    try:
        login_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to log in: {str(e)}")

    if "error" in login_response:
        raise HTTPException(status_code=400, detail=login_response["error"]["message"])

    session = login_response.session
    if session:
        # Clear existing cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Set new access and refresh tokens
        response.set_cookie(key="access_token", value=session.access_token, httponly=True, secure=True, expires=3600, samesite="None")
        response.set_cookie(key="refresh_token", value=session.refresh_token, httponly=True, secure=True, expires=86400, samesite="None")

    return {"message": "Login successful"}

@app.post("/api/refresh")
async def refresh_token(response: Response, request: Request):
    refresh_token = request.cookies.get("refresh_token")
    print(refresh_token)
    if not refresh_token:
        raise HTTPException(status_code=402, detail="Refresh token missing")

    try:
        # Call Supabase to refresh the token
        refresh_response = supabase.auth.refresh_session(refresh_token)
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Refresh token invalid: {str(e)}")

    if refresh_response.session:
        # Get the new session access and refresh tokens
        new_access_token = refresh_response.session.access_token
        new_refresh_token = refresh_response.session.refresh_token

        # Clear access and refresh tokens from cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Set a new access token cookie
        response.set_cookie(key="access_token", value=new_access_token, httponly=True, secure=True, expires=3600, samesite="None")
        response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True, secure=True, expires=86400, samesite="None")

        return {"message": "Access token refreshed successfully"}

    raise HTTPException(status_code=500, detail="Unable to refresh access token")

        
@app.get("/api/verify_session")
async def verify_session(request: Request):
    # Updated method "async def read_cookie(my_cookie: Annotated[str | None, Cookie()] = None):"
    token = request.cookies.get("access_token")
    # print(f"Received token: {token}")  # Log the token

    if not token:
        raise HTTPException(status_code=401, detail="Access token missing")

    try:
        response = supabase.auth.get_user(token)
        # print(f"Supabase response: {response}")  # Log the response
        if response.user:
            return {"isAuthenticated": True}
        else:
            return {"isAuthenticated": False}
    except Exception as e:
        return {"isAuthenticated": False, "error": str(e)}

# Getting user data
@app.get("/api/user_profile")
async def user_profile(request: Request) -> dict:
    token = request.cookies.get("access_token")
    
    # print(token)
    
    if not token:
        raise HTTPException(status_code=401, detail="Access token missing")

    try:
        # Use Supabase to fetch user data based on the token
        user_data = supabase.auth.get_user(token)
        # print(user_data)
        # print(f"Supabase response for user: {response}") 
        if user_data.user:
            # Prepare user_info dictionary with necessary fields
            user_info = {
                "first_name": user_data.user.user_metadata["first_name"],  # Ensure these keys match your Supabase schema
                "last_name": user_data.user.user_metadata["last_name"],
                "email": user_data.user.user_metadata["email"]
            }

            # print("User info being returned:", user_info)  

            return user_info
        else:
            raise HTTPException(status_code=401, detail="Invalid access token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")
    
# >>>---------------- Inbox -------------------<<<

if __name__ == "__main__":
   import uvicorn
   
   uvicorn.run(app, host="0.0.0.0", port=8000) 