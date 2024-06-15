from fastapi.middleware.cors import CORSMiddleware
from models import *
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4

app = FastAPI()

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

# @app.get("/api/messages", response_model=List[Message])
# async def fetch_messages():
#     return messages

@app.post("/api/messages", response_model=Message)
async def send_message(message: Message):
    if not message.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    # Here, you can process the message as needed
    
    # Add users Message 
    messages.append(message)
    return message; 

if __name__ == "__main__":
   import uvicorn
   
   uvicorn.run(app, host="0.0.0.0", port=8000) 