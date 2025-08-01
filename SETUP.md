# AutoDevGenie Authentication Setup Guide

This guide will help you set up and run the authentication system for AutoDevGenie.

## Prerequisites

- Node.js (v18 or higher)
- Python (3.11 or higher)
- MongoDB (running locally or cloud instance)

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd AutoDevGenie/backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017
   SECRET_KEY=your-secret-key-change-in-production
   ```

4. **Start the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be running at `http://localhost:8000`

## Frontend Setup

1. **Navigate to the UI directory:**
   ```bash
   cd AutoDevGenie/ui
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the ui directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:3000`

## Authentication Features

### User Registration
- Navigate to `/register`
- Fill in: Name, Email, Password, Role (Project Manager/Developer/QA)
- Optional: GitHub username (conditional field)
- After registration, redirects to login page

### User Login
- Navigate to `/login`
- Fill in: Email, Password, Role
- After successful login, redirects to home page

### User Roles
- **Project Manager**: Can create projects, manage team, view all projects
- **Developer**: Can view assigned bugs, upload code for analysis
- **QA Engineer**: Can review bug reports, create test cases

### Authentication Flow
1. User registers → Login page
2. User logs in → Home page (with personalized welcome)
3. Home page shows different content for authenticated users
4. Dashboard button available for quick access to personalized dashboard
5. Logout clears session and redirects to login

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info (protected)

### Existing Endpoints (now protected)
- `GET /employees/` - Get all employees
- `POST /employees/` - Create employee
- `GET /projects/` - Get all projects
- `POST /projects/` - Create project
- `POST /analyze/` - Analyze project for bugs

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Secure token storage in localStorage
- Automatic token validation on app load

## Testing the System

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Click "Get Started" to register a new account
4. Complete registration and login
5. Explore the authenticated home page and dashboard

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and accessible
- **CORS Issues**: Backend is configured to allow all origins for development
- **Token Issues**: Clear browser localStorage if authentication problems occur
- **Port Conflicts**: Change ports in the respective configuration files if needed 