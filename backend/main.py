from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import Employee, Project, FileMeta, BugReport, User, LoginRequest, RegisterRequest, Role
from database import employee_collection, project_collection, user_collection
from typing import List
from bson import ObjectId
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import random
import requests
import re
from pydantic import BaseModel

load_dotenv()
class Employee(BaseModel):
    name: str
    email: str
    role: str
    skills: List[str]
    experience: str
    status: str

app = FastAPI()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper to convert MongoDB document to dict with string id
def doc_to_dict(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc

# JWT Token functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Password hashing
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Mock functions for demo purposes
def get_last_commit_author(file_path: str) -> str:
    """Mock function to get the last commit author for a file"""
    # In a real implementation, this would use git commands
    return "John Doe"

def run_llm_analysis(code: str, file_name: str) -> dict:
    """Run real LLM analysis using Ollama"""
    try:
        # Build the prompt for code analysis
        prompt = f"""You are a senior software engineer. I will provide a code file. Your job is to:
1. Find any bugs or issues
2. Suggest improvements or best practices
3. Generate a structured AI Review Report with sections:
   - Bugs Found
   - Suggestions
   - Code Quality Score (1-10)
   - Explanation

Here is the code from {file_name}:

{code}

Please analyze and return the review report in this exact format:
Bugs Found:
- [List any bugs found]

Suggestions:
- [List any suggestions]

Code Quality Score: [1-10]

Explanation:
[Detailed explanation of the analysis]"""

        # Send request to Ollama
        response = requests.post(
            "http://192.168.10.19:11434/api/generate",
            headers={"Content-Type": "application/json"},
            json={
                "model": "deepseek-coder:6.7b-instruct",
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )
        
        if response.status_code != 200:
            return {
                "bugs": ["Failed to analyze code - Ollama service unavailable"],
                "suggestions": [],
                "quality_score": 5,
                "explanation": "Could not connect to AI analysis service"
            }
        
        ai_response = response.json().get("response", "")
        
        # Parse the AI response
        return parse_ai_response(ai_response)
        
    except Exception as e:
        print(f"Error in LLM analysis: {e}")
        return {
            "bugs": ["Error during code analysis"],
            "suggestions": [],
            "quality_score": 5,
            "explanation": f"Analysis failed: {str(e)}"
        }

def parse_ai_response(response: str) -> dict:
    """Parse the AI response to extract structured information"""
    try:
        # Initialize default values
        bugs = []
        suggestions = []
        quality_score = 5
        explanation = ""
        
        # Extract bugs
        bugs_match = re.search(r'Bugs Found:(.*?)(?=Suggestions:|$)', response, re.DOTALL | re.IGNORECASE)
        if bugs_match:
            bugs_text = bugs_match.group(1).strip()
            bugs = [bug.strip().lstrip('- ').lstrip('* ') for bug in bugs_text.split('\n') if bug.strip() and not bug.strip().startswith('Bugs Found:')]
        
        # Extract suggestions
        suggestions_match = re.search(r'Suggestions:(.*?)(?=Code Quality Score:|$)', response, re.DOTALL | re.IGNORECASE)
        if suggestions_match:
            suggestions_text = suggestions_match.group(1).strip()
            suggestions = [sug.strip().lstrip('- ').lstrip('* ') for sug in suggestions_text.split('\n') if sug.strip() and not sug.strip().startswith('Suggestions:')]
        
        # Extract quality score
        score_match = re.search(r'Code Quality Score:\s*(\d+)', response, re.IGNORECASE)
        if score_match:
            quality_score = int(score_match.group(1))
        
        # Extract explanation
        explanation_match = re.search(r'Explanation:(.*?)$', response, re.DOTALL | re.IGNORECASE)
        if explanation_match:
            explanation = explanation_match.group(1).strip()
        
        return {
            "bugs": bugs,
            "suggestions": suggestions,
            "quality_score": quality_score,
            "explanation": explanation
        }
        
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        return {
            "bugs": ["Error parsing analysis results"],
            "suggestions": [],
            "quality_score": 5,
            "explanation": f"Parsing failed: {str(e)}"
        }

async def get_best_developer(last_author: str) -> str:
    """Mock function to get the best developer for assignment"""
    # In a real implementation, this would use ML or rules to assign developers
    # For now, return the last author or a random developer
    developers = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"]
    if last_author in developers:
        return last_author
    return random.choice(developers)

def post_to_slack(file_name: str, llm_response: str, assigned_dev: str):
    """Mock function to post to Slack"""
    # In a real implementation, this would post to actual Slack
    print(f"Slack notification: Bug in {file_name} assigned to {assigned_dev}: {llm_response}")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

@app.get("/")
def read_root():
    return {"message": "AutoDevGenie backend is running!"}

# Authentication Endpoints
@app.post("/auth/register", response_model=dict)
async def register_user(user_data: RegisterRequest):
    # Check if user already exists
    existing_user = await user_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "role": user_data.role,
        "githubUsername": user_data.githubUsername if user_data.hasGithubAccount else None,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    result = await user_collection.insert_one(user_doc)
    return {"id": str(result.inserted_id), "message": "User registered successfully"}

@app.post("/auth/login", response_model=dict)
async def login_user(login_data: LoginRequest):
    # Find user by email
    user = await user_collection.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify role
    if user["role"] != login_data.role:
        raise HTTPException(status_code=401, detail="Invalid role for this user")
    
    # Create access token
    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "name": user["name"]
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "githubUsername": user.get("githubUsername")
        }
    }

@app.get("/auth/me", response_model=dict)
async def get_current_user(token: dict = Depends(verify_token)):
    user_id = token.get("sub")
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "githubUsername": user.get("githubUsername")
    }

# Employee Endpoints
@app.post("/employees/", response_model=dict)
async def create_employee(employee: Employee):
    result = await employee_collection.insert_one(employee.dict())
    return {"id": str(result.inserted_id)}

@app.get("/employees/", response_model=List[dict])
async def get_employees():
    employees = []
    async for employee in employee_collection.find():
        employees.append(doc_to_dict(employee))
    return employees

# Project Endpoints
@app.post("/projects/", response_model=dict)
async def create_project(project: Project):
    # Mock implementation for demo
    return {"id": "mock_project_id"}

@app.get("/projects/", response_model=List[dict])
async def get_projects():
    # Mock implementation for demo
    return []

# Bug Analysis Endpoint
@app.post("/analyze/", response_model=List[BugReport])
async def analyze_project(
    files: List[FileMeta] = Body(...),
    developers: List[str] = Body(...)  # Optional, now unused
):
    bugs = []
    for idx, file in enumerate(files):
        # 1. Generate mock code content for demo
        code = generate_mock_code(file.name)
        
        # 2. Git author
        last_author = get_last_commit_author(file.path)
        
        # 3. LLM bug analysis
        try:
            llm_analysis = run_llm_analysis(code, file.name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM analysis failed: {e}")
        
        # 4. Developer assignment
        assigned_dev = await get_best_developer(last_author)
        
        # 5. Slack ticket
        post_to_slack(file.name, str(llm_analysis), assigned_dev)
        
        # 6. Create bug reports for each bug found
        for bug_idx, bug_description in enumerate(llm_analysis.get("bugs", [])):
            bugs.append(BugReport(
                id=len(bugs) + 1,
                file=file.name,
                line=7,  # Placeholder — extract from LLM if possible
                type="AI Detected",
                severity="High" if llm_analysis.get("quality_score", 5) < 6 else "Medium",
                description=bug_description,
                assignedTo=assigned_dev
            ))
        
        # If no bugs found, create a general report
        if not llm_analysis.get("bugs"):
            bugs.append(BugReport(
                id=len(bugs) + 1,
                file=file.name,
                line=0,
                type="Code Review",
                severity="Low",
                description=f"Code Quality Score: {llm_analysis.get('quality_score', 5)}/10. {llm_analysis.get('explanation', 'No issues found')}",
                assignedTo=assigned_dev
            ))
    
    return bugs

def generate_mock_code(file_name: str) -> str:
    """Generate mock code content for demo purposes"""
    extension = file_name.split('.').pop().lower() if '.' in file_name else 'txt'
    
    if extension in ['js', 'jsx']:
        return f"""// {file_name}
import React from 'react';

const Component = ({{ data }}) => {{
  // Bug: Missing prop validation
  const handleClick = () => {{
    console.log(data.name.toUpperCase()); // Potential null reference
  }};

  return (
    <div onClick={{handleClick}}>
      <h1>{{data.title}}</h1>
      <p>{{data.description}}</p>
    </div>
  );
}};

export default Component;"""
    
    elif extension == 'py':
        return f"""# {file_name}
def process_data(data):
    # Bug: No error handling
    result = []
    for item in data:
        result.append(item['value'] * 2)  # KeyError if 'value' doesn't exist
    return result

def main():
    data = [{{'value': 1}}, {{'value': 2}}]
    processed = process_data(data)
    print(processed)"""
    
    elif extension == 'java':
        return f"""// {file_name}
public class DataProcessor {{
    public void processArray(int[] arr) {{
        // Bug: Array bounds not checked
        for (int i = 0; i <= arr.length; i++) {{  // Should be < not <=
            System.out.println(arr[i] * 2);
        }}
    }}
    
    public String getName(User user) {{
        // Bug: Null pointer potential
        return user.getName().toUpperCase();
    }}
}}"""
    
    else:
        return f"""// {file_name}
// Sample code content
// This file contains potential bugs that will be detected by our AI system
function example() {{
  console.log("Hello World");
}}"""