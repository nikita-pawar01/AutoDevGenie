from pydantic import BaseModel, Field
from typing import List, Optional

class Employee(BaseModel):
    name: str
    role: str
    experience: int
    projectList: List[str]
    githubUsername: str

class Project(BaseModel):
    name: str
    description: str
    assignedEmployees: List[str]
    status: str
    progress: int 