import os
from supabase import create_client, Client

from dotenv import load_dotenv

load_dotenv()

testMode = True

class DB_Manager:
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL")
        self.key: str = os.getenv("SUPABASE_KEY")
        self.supabase: Client = create_client(self.url, self.key)
        self.session = self.supabase.auth.get_session() 
        self.user = self.supabase.auth.get_user()
        
        # Class variable to store function names and filters out dunder functions
        # function_names = [func for func in dir() if callable(getattr(MyClass, func)) and not func.startswith("__")]
        
    def get_client(self):
        # Return only basic, serializable data (URL and key)
        return {"url": self.url, "key": self.key}
        
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
        response = self.supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )

    def sign_out(self):
        response = self.supabase.auth.sign_out()
        
    def verify_user_session(self):
        if not testMode:
            session = self.supabase.auth.get_session() 

            # Check if session exists and has a valid access token
            if session and session.access_token:  # Accessing the attribute directly
                return True
            return False 
        
        return True
    
    # Users
    def get_user_info(self):
        # Check if the session exists and has a valid access token
        print(f"{self.user}")
        if self.verify_user_session():
            # Step 2: Query the profiles table for the user info
            if self.user is None:
                print("kjwbefkqbewrfhbehrbfehbrgfkerhgb-----------")
            user_id = self.user[id]  # Get the user's ID from the session
            
            # Fetch the user's profile from the 'profiles' table
            profile = self.supabase.table("profiles").select("first_name, last_name, email").eq("id", user_id).execute()
            
            if profile.data:
                # Return first name, last name, and email as a dictionary
                return {
                    "first_name": profile.data.first_name,
                    "last_name": profile.data.last_name,
                    "email": profile.data.email
                }
            else:
                print("Profile not found.")
                return None
        else:
            print("No valid session found.")
            return None
    
    
    
# Create an instance of DB_Manager
#db_manager = DB_Manager()

# Call the sign_up method on the instance
#response = db_manager.sign_up("king.ceg@gmail.com", "password", "Charles", "Gary")

#print(response)