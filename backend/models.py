from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from enum import Enum

class Role(str, Enum):
    PROJECT_MANAGER = "project_manager"
    DEVELOPER = "developer"
    QA = "qa"

class FileMeta(BaseModel):
    name: str
    size: int
    type: str
    path: str

class User(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role
    githubUsername: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Role

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role
    hasGithubAccount: bool = False
    githubUsername: Optional[str] = None

class Employee(BaseModel):
    name: str
    email: str
    role: str
    skills: List[str]
    avatar: str
    experience: Optional[int] = None
    projectList: Optional[List[str]] = []
    githubUsername: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str
    developers: List[str]  # List of employee IDs
    files: List[FileMeta]
    createdAt: str
    status: Optional[str] = "active"
    progress: Optional[int] = 0

class BugReport(BaseModel):
    id: Optional[int]
    file: str
    line: int
    type: str
    severity: str
    description: str
    assignedTo: Optional[str]  # Employee ID 