from mistralai.models.chat_completion import ChatMessage
from mistralai.client import MistralClient
from dotenv import load_dotenv
from typing import Optional, List, Tuple
from models import SenderType
import os
import json
load_dotenv()

API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")
simulate_response = False

class PlanAndExecute:
    def __init__(self, memory: Optional[List[str]] = [], model: Optional[str] = MODEL, api_key: Optional[str] = API_KEY):
        self.memory = memory
        self.model = model
        self.api_key = api_key
        self.client = MistralClient(api_key=api_key)
        #self.plan_prompt = ""
        #self.execute_prompt_end = ""
    
    def plan(self, messages: List[Tuple[str, str]]) -> str:
        # Provides a step by step plan (each step should include what agent should be used) 
        
        # Formats messages to match mistral format
        model_messages = self.mistral_message_formatter(messages)
        
        # Adds a planning prompt to the lasts messages content
        model_messages[-1].content = self.plan_prompted_message(model_messages[-1].content)
        
        # Requests a chat response and assigns response content to 'response'
        if simulate_response is True:
            return "This is a simulated AI response"
        
        try:
            chat_response = self.client.chat(model=self.model, response_format={"type": "json_object"}, messages=model_messages)
            response = chat_response.choices[0].message.content
            
            print(response)
            self.execute(response)
        except:
            return "Unable to connect to Mistral API"
        
    
    def execute(self, curr_plan: str):
        # Loops through the step by step plan and passes 
        # that step in the plan to the relevent agent
        
        plan = json.loads(curr_plan)
        # Loop to assign each step to a given 
        for agent, action in plan.items():
            if agent == 'GmailAgent':
                GmailAgent(action)
            elif agent == 'CalendarAgent':
                CalendarAgent(action)
            else:
                print(f"Agent {agent} not available")
                
        
        # AI model response that summizes the final info
        
        # Reset memory for next process
        self.memory = []
    
    # Formats messages to mistral can read them, takes in a list of [role][message] pairs
    def mistral_message_formatter(self, messages: List[Tuple[str, str]]):
        formatted_messages = [ChatMessage(role=role, content=msg) for role, msg in messages]
        return formatted_messages
    
    # Takes a messages and adds a prompt to it
    def plan_prompted_message(self, inquiry: str):
        # JSON object should be formated like {"agent":"description of task"} 
        user_message = (
            f"""
            You are a process manager that creates a plan and assigns each step to an
            available AI agent that has the tools to complete that step. If you are
            not able to complete the task
            
            ###
            {{"AgentName1":"Task Description", "Agentname2":"TaskDescription"}}
            
            Example Case/
            Input: Add two new meeting to my calendar, and send an email Joe, then add another meeting
            Output: {{"CalendarAgent":"Create two new meetings", "GmailAgent":"Send Joe an email", "CalendarAgent":"Create one new meeting"}}
            ###
            
            Only assign tasks to the following agents: 
            -"GmailAgent" Can only send and check emails
            -"CalendarAgent" Can only add and delete calendar events
            
            <<<
            Respond with only a short JSON object formatted {inquiry}
            >>>
            """
        )
        return user_message
    
    def tester(self):
        self.memory.append("ayooo")
    
    
class GmailAgent:
    def __init__(self, description):
        print("Gmail Agent initialized, given the task of")
        print(description)
        
    def execute():
        pass
        
class CalendarAgent:
    def __init__(self, description):
        print("Calendar Agent initialized, given the task of")
        print(description)
    
# Eventually write classes for other agents as well

model = PlanAndExecute()
print(model.memory)
model.tester()
print(model.memory)

model.plan([("user", "Send an email to Joe and add a meeting at 9am to my calendar, then email Cathy about the new meeting")])
#print(model.plan([("user", "Send an email to Joe")]))