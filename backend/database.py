from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.autodevgenie  # Database name
employee_collection = database.get_collection("employees")
project_collection = database.get_collection("projects")
user_collection = database.get_collection("users") 