# AutoDevGenie Backend & Frontend

This repository contains the FastAPI backend and Next.js frontend for AutoDevGenie, connected to MongoDB.

## Requirements
- Python 3.11+
- Node.js >= 18.0.0
- npm >= 10.0.0
- MongoDB (local or remote, v6+ recommended)

## Backend Setup
1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Set up your `.env` file:**
   ```env
   MONGO_URI=mongodb://localhost:27017
   ```
3. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at [http://localhost:8000](http://localhost:8000)

## Frontend Setup
1. **Install Node.js and npm** (see requirements above).
2. **Install frontend dependencies:**
   ```bash
   cd ui
   npm install
   ```
3. **Run the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:3000](http://localhost:3000)

## MongoDB Setup
- Make sure MongoDB is running locally (default: `mongodb://localhost:27017`).
- To view and manage your data, use [MongoDB Compass](https://www.mongodb.com/try/download/compass):
  1. Download and install Compass.
  2. Connect to `mongodb://localhost:27017`.
  3. Browse the `autodevgenie` database and its collections.

## Docker (Optional)
To run the backend with Docker:
```bash
docker build -t autodevgenie-backend ./backend
# Make sure to provide your .env file if needed
# docker run -p 8000:8000 --env-file ./backend/.env autodevgenie-backend
```

## API Endpoints
- `POST /employees/` — Add an employee
- `GET /employees/` — List employees
- `POST /projects/` — Add a project
- `GET /projects/` — List projects

## Notes
- The frontend expects the backend to be running at `http://localhost:8000` by default.
- The backend expects MongoDB to be running at `mongodb://localhost:27017` by default.
- You can change these settings in the code or via environment variables as needed. 