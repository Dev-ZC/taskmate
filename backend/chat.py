from mistralai.models.chat_completion import ChatMessage
from mistralai.client import MistralClient
from dotenv import load_dotenv
from typing import Optional, List
from models import SenderType
import os
load_dotenv()

API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
simulate_response = True

class ChatBot:
    def __init__(self, model: Optional[str] = MODEL, api_key: Optional[str] = API_KEY):
        self.model = model
        self.api_key = api_key
        self.client = MistralClient(api_key=api_key)
        
    # Takes a list of messages(strings) and converts them into messages the AI can read
    def create_chat_messages(self, role: SenderType, messages: List[str]) -> List[ChatMessage]:
        return [ChatMessage(role=role, content=msg) for msg in messages]
        
    # Given a list of messages return a chat response
    def get_response(self, messages) -> str:
        try:
            if simulate_response is True:
                return "This is a simulated AI response"
            
            chat_response = self.client.chat(model=self.model, messages=messages)
                
            response = chat_response.choices[0].message.content
            return response
        except:
            return "I am having trouble processing your request, please try again"
    
        
        
