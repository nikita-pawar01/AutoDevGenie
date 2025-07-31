from pydantic import BaseModel, Field
from typing import List, Optional

class FileMeta(BaseModel):
    name: str
    size: int
    type: str
    path: str

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