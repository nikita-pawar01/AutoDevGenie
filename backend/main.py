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

load_dotenv()

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
    result = await project_collection.insert_one(project.dict())
    return {"id": str(result.inserted_id)}

@app.get("/projects/", response_model=List[dict])
async def get_projects():
    projects = []
    async for project in project_collection.find():
        projects.append(doc_to_dict(project))
    return projects

# Bug Analysis Endpoint
@app.post("/analyze/", response_model=List[BugReport])
async def analyze_project(
    files: List[FileMeta] = Body(...),
    developers: List[str] = Body(...)
):
    # Dummy bug analysis logic for demonstration
    bugs = []
    if files:
        for idx, file in enumerate(files):
            bugs.append(BugReport(
                id=idx+1,
                file=file.name,
                line=7,
                type="Null Reference",
                severity="High",
                description="Potential null reference error when accessing object properties",
                assignedTo=developers[0] if developers else None
            ))
    return bugs 