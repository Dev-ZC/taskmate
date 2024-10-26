import os
from supabase import create_client, Client

from dotenv import load_dotenv

load_dotenv()

class DB_Manager:
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL")
        self.key: str = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.url, self.key)
        
        # Class variable to store function names and filters out dunder functions
        # function_names = [func for func in dir() if callable(getattr(MyClass, func)) and not func.startswith("__")]
        
    # Auth
    def sign_up(self, email: str, password: str, first_name: str, last_name: str) -> str:
        response = self.supabase.auth.sign_up(
            {
                "email": email, 
                "password": password,
                "options": {"data": {"first_name": first_name, "last_name": last_name, "email": email}},
            }
        )
        
    def sign_in(self, email: str, password: str) -> str:
        response = supabase.auth.sign_in_with_password(
            {"email": "email@example.com", "password": "example-password"}
        )
        
    def sign_out(self):
        response = self.supabase.auth.sign_out()
        
    # Calendar
    def fetch_all_events(self):
        pass
    
    def fetch_one_event(self):
        pass
    
    def fetch_event_name(self):
        pass
    
    def fetch_events_in_time_frame(self):
        pass
    
    # Users
    
    # Documents
    def fetch_all_documents(self):
        pass
    
    def fetch_one_document(self):
        pass
    
    
    
    
# Create an instance of DB_Manager
db_manager = DB_Manager()

# Call the sign_up method on the instance
response = db_manager.sign_up("king.ceg@gmail.com", "password", "Charles", "Gary")

print(response)