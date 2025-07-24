from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Employee, Project
from database import employee_collection, project_collection
from typing import List
from bson import ObjectId

app = FastAPI()

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



@app.get("/")
def read_root():
    return {"message": "AutoDevGenie backend is running!"}

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