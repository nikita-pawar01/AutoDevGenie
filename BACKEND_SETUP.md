# Backend Setup Guide

## Prerequisites
- Python 3.11 or higher
- MongoDB running locally or cloud instance
- pip package manager

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd AutoDevGenie/backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory with:
   ```env
   MONGO_URI=mongodb://localhost:27017
   SECRET_KEY=your-secret-key-change-in-production
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system or use a cloud instance.

5. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (protected)

### Existing Endpoints
- `GET /employees/` - Get all employees
- `POST /employees/` - Create employee
- `GET /projects/` - Get all projects
- `POST /projects/` - Create project
- `POST /analyze/` - Analyze project for bugs

## Database Collections
- `users` - User authentication data
- `employees` - Employee information
- `projects` - Project data

## Testing the API

1. **Test registration:**
   ```bash
   curl -X POST "http://localhost:8000/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
          "name": "John Doe",
          "email": "john@example.com",
          "password": "password123",
          "role": "developer",
          "hasGithubAccount": true,
          "githubUsername": "johndoe"
        }'
   ```

2. **Test login:**
   ```bash
   curl -X POST "http://localhost:8000/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
          "email": "john@example.com",
          "password": "password123",
          "role": "developer"
        }'
   ```

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and accessible
- **Import Errors**: Make sure all dependencies are installed
- **Port Conflicts**: Change the port in the uvicorn command if needed 